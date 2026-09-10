// Dependency-free function boundary recovery.
//
// Strategy: recursive descent over the control flow graph starting at the function
// entry, combined with a few cheap architecture specific structural signals
// (prologue / epilogue / alignment padding / PLT stubs). This is the fallback used
// by getFunctionBoundary() whenever neither the OAT method header nor the ELF
// symbol table can answer the question, e.g. stripped native code registered
// through JNI RegisterNatives.
//
// Everything here runs inside the agent, so there is no angr / capstone / Triton
// dependency: Frida's own Instruction.parse() does the decoding.

export type CfgArch = 'arm64' | 'arm' | 'ia32' | 'x64'

export interface CfgOptions {
    /** Maximum number of bytes the analysis is allowed to walk past `start`. */
    maxSpan?: number
    /** Maximum number of instructions the analysis is allowed to visit. */
    maxInsns?: number
    /** Recover jump table bodies with a bounded linear sweep. Default true. */
    linearSweepOnIndirect?: boolean
    /** Bytes the linear sweep may add past the CFG result. Default 0x200. */
    maxSweepBytes?: number
    /** Collect direct call targets (useful to annotate the disassembly). */
    collectCalls?: boolean
}

export interface CfgCallSite {
    from: NativePointer
    to: NativePointer
}

/** A branch that leaves the function through the PLT / GOT. */
export interface CfgPltCall {
    /** The branch instruction inside the analysed function. */
    from: NativePointer
    /** The PLT stub address, null when the `br` itself sits in the function. */
    stub: NativePointer | null
    /** GOT slot the stub loads, null when it could not be resolved. */
    gotSlot: NativePointer | null
    /** Current content of the GOT slot, i.e. the real callee once bound. */
    target: NativePointer | null
}

export interface CfgResult {
    start: NativePointer
    /** Exclusive end address of the recovered function body. */
    end: NativePointer
    size: number
    arch: CfgArch
    insnCount: number
    blockCount: number
    /** Addresses of the instructions that terminate a path. */
    returns: NativePointer[]
    calls: CfgCallSite[]
    /** Tail calls / calls that leave the module through the PLT. */
    pltCalls: CfgPltCall[]
    /**
     * Indirect branches that are NOT PLT stubs, i.e. real jump tables or
     * unresolved computed jumps. These hide control flow from the CFG.
     */
    indirectBranches: NativePointer[]
    undecodable: NativePointer[]
    /** True when maxInsns / maxSpan was hit before the walk finished. */
    truncated: boolean
    /** True when the linear sweep extension ran. */
    linearSwept: boolean
    confidence: 'high' | 'medium' | 'low'
}

type InsnKind =
    | 'return'        // ret / bx lr / pop {..., pc} / brk / udf
    | 'indirect'      // br Xn / bx Xn / jmp [mem] -> target unknown
    | 'jump'          // unconditional direct branch
    | 'branch'        // conditional direct branch
    | 'call'          // direct call
    | 'indirectCall'  // blr / blx reg / call reg
    | 'padding'       // nop
    | 'fallthrough'

/** What an opaque indirect branch really is. */
export type IndirectKind = 'plt' | 'jumpTable' | 'unknown'

// ARM condition codes, shared by arm and arm64 (`b.<cond>`).
const ARMCOND: string[] = ['eq', 'ne', 'cs', 'hs', 'cc', 'lo', 'mi', 'pl', 'vs', 'vc', 'hi', 'ls', 'ge', 'lt', 'gt', 'le', 'al', 'nv']

function regName(op: any): string | null {
    return (op !== null && op !== undefined && op.type === 'reg') ? `${op.value}` : null
}

function memValue(op: any): { base?: string, index?: string, disp: number } | null {
    return (op !== null && op !== undefined && op.type === 'mem' && op.value !== undefined) ? op.value : null
}

function operandsOf(insn: Instruction): any[] | null {
    const ops = (insn as any).operands
    return Array.isArray(ops) ? ops : null
}

function safeReadPointer(addr: NativePointer): NativePointer | null {
    try {
        const value = addr.readPointer()
        return value.isNull() ? null : value
    } catch (e) {
        return null
    }
}

function safeParse(addr: NativePointer): Instruction | null {
    try {
        const insn = Instruction.parse(addr) as Instruction
        return insn.size > 0 ? insn : null
    } catch (e) {
        return null
    }
}

/**
 * Absolute target of a direct branch, or null when the target is not an immediate.
 * Prefers the decoded operand list and only falls back to parsing `opStr`.
 */
export function branchTarget(insn: Instruction): NativePointer | null {
    const ops = operandsOf(insn)
    if (ops !== null && ops.length > 0) {
        // `[reg+disp]` style memory operand => indirect, never an absolute target.
        if (ops[0] && ops[0].type === 'mem') return null
        for (let i = ops.length - 1; i >= 0; i--) {
            const op = ops[i]
            if (op && (op.type === 'imm' || op.type === 'cimm') && op.value !== undefined && op.value !== null) {
                try {
                    return ptr(op.value)
                } catch (e) {
                    return null
                }
            }
        }
        return null
    }
    const matched = /0x[0-9a-fA-F]+/.exec(insn.opStr || '')
    return matched === null ? null : ptr(matched[0])
}

function classifyArm64(insn: Instruction): InsnKind {
    const m = insn.mnemonic
    switch (m) {
        case 'ret':
        case 'brk':
        case 'udf':
            return 'return'
        case 'br':
            return 'indirect'
        case 'blr':
            return 'indirectCall'
        case 'bl':
            return 'call'
        case 'b':
            return 'jump'
        case 'cbz':
        case 'cbnz':
        case 'tbz':
        case 'tbnz':
            return 'branch'
        case 'nop':
            return 'padding'
    }
    // b.<cond>
    if (m.length > 2 && m.charAt(0) === 'b' && m.charAt(1) === '.') {
        return ARMCOND.indexOf(m.slice(2)) !== -1 ? 'branch' : 'fallthrough'
    }
    return 'fallthrough'
}

function classifyArm(insn: Instruction): InsnKind {
    const m = insn.mnemonic
    const ops = insn.opStr || ''
    switch (m) {
        case 'bx':
            return /(^|,\s*)lr\s*$/.test(ops) ? 'return' : 'indirect'
        case 'blx':
            return branchTarget(insn) !== null ? 'call' : 'indirectCall'
        case 'bl':
            return 'call'
        case 'pop':
            return /\bpc\b/.test(ops) ? 'return' : 'fallthrough'
        case 'mov':
            return ops.replace(/\s+/g, '') === 'pc,lr' ? 'return' : 'fallthrough'
        case 'cbz':
        case 'cbnz':
        case 'tbz':
        case 'tbnz':
            return 'branch'
        case 'nop':
            return 'padding'
        case 'udf':
            return 'return'
    }
    if (m === 'b' || m === 'b.w') return 'jump'
    const base = m.length > 2 && m.slice(-2) === '.w' ? m.slice(0, -2) : m
    if (base.length === 3 && base.charAt(0) === 'b' && ARMCOND.indexOf(base.slice(1)) !== -1) return 'branch'
    return 'fallthrough'
}

function classifyX86(insn: Instruction): InsnKind {
    const m = insn.mnemonic
    switch (m) {
        case 'ret':
        case 'retf':
        case 'iret':
        case 'iretq':
        case 'hlt':
        case 'ud2':
            return 'return'
        case 'call':
            return branchTarget(insn) !== null ? 'call' : 'indirectCall'
        case 'jmp':
            return branchTarget(insn) !== null ? 'jump' : 'indirect'
        case 'nop':
            return 'padding'
    }
    if (m.length > 1 && m.charAt(0) === 'j') return 'branch'
    return 'fallthrough'
}

export function classifyInstruction(insn: Instruction, arch: CfgArch): InsnKind {
    switch (arch) {
        case 'arm64': return classifyArm64(insn)
        case 'arm': return classifyArm(insn)
        default: return classifyX86(insn)
    }
}

/**
 * Cheap structural signal: does this instruction look like the start of a new
 * function prologue? Used to stop the linear sweep extension.
 */
export function isPrologue(insn: Instruction, arch: CfgArch): boolean {
    const m = insn.mnemonic
    const ops = (insn.opStr || '').replace(/\s+/g, ' ')
    if (arch === 'arm64') {
        if (m === 'sub' && /^sp, sp, #/.test(ops)) return true
        if (m === 'stp' && /x29, x30/.test(ops)) return true
        if (m === 'stp' && /\[sp, #-/.test(ops)) return true
        return false
    }
    if (arch === 'arm') {
        if (m === 'push' && /\blr\b/.test(ops)) return true
        if (m === 'sub' && /^sp, sp, #/.test(ops)) return true
        return false
    }
    if (m === 'push' && /^(rbp|ebp)$/.test(ops)) return true
    if (m === 'sub' && /^(rsp|esp), (rsp|esp), /.test(ops)) return true
    return false
}

// ---------------------------------------------------------------------------
// PLT / GOT stub recognition
//
// arm64 stub:   adrp x16, <page> ; ldr x17, [x16, #off] ; add x16, x16, #off ; br x17
// x86/x64 stub: jmp [rip + off]
//
// These are tail jumps into *other* modules. Without recognising them the CFG
// happily follows `b <plt>` and then walks the whole stub array, which inflates
// the recovered function to tens of kilobytes.
// ---------------------------------------------------------------------------

export interface GotSlotInfo {
    slot: NativePointer
    /** Page base the stub materialised (arm64 `adrp`), null for rip-relative. */
    page: NativePointer | null
    disp: number
}

/**
 * Resolve the GOT slot an indirect branch jumps through.
 * Returns null when the branch is not a GOT load (e.g. a computed jump table).
 */
export function resolveGotSlot(insn: Instruction, arch: CfgArch = CfgAnalyzer.detectArch()): GotSlotInfo | null {
    const ops = operandsOf(insn)
    if (ops === null || ops.length === 0) return null

    if (arch === 'ia32' || arch === 'x64') {
        if (insn.mnemonic !== 'jmp' && insn.mnemonic !== 'call') return null
        const mem = memValue(ops[0])
        if (mem === null || mem.base === undefined) return null
        const base = `${mem.base}`.toLowerCase()
        if (base !== 'rip' && base !== 'eip') return null
        return { slot: insn.next.add(mem.disp), page: null, disp: mem.disp }
    }

    if (arch !== 'arm64') return null
    if (insn.mnemonic !== 'br' && insn.mnemonic !== 'blr') return null

    const brReg = regName(ops[0])
    if (brReg === null) return null

    // Walk back over the fixed size arm64 encodings that make up the stub.
    let loadBase: string | null = null
    let disp = 0
    for (let i = 1; i <= 3; i++) {
        const prev = safeParse(insn.address.sub(i * 4))
        if (prev === null) break
        const pops = operandsOf(prev)
        if (pops === null || pops.length < 2) continue
        if (prev.mnemonic !== 'ldr' || regName(pops[0]) !== brReg) continue
        const mem = memValue(pops[1])
        if (mem === null) continue
        // An indexed load `[Xm, Xk, lsl #s]` is a jump table, not a GOT load.
        if (mem.index !== undefined) return null
        loadBase = mem.base === undefined ? null : `${mem.base}`
        disp = mem.disp
        break
    }
    if (loadBase === null) return null

    for (let i = 1; i <= 4; i++) {
        const prev = safeParse(insn.address.sub(i * 4))
        if (prev === null) break
        if (prev.mnemonic !== 'adrp') continue
        const pops = operandsOf(prev)
        if (pops === null || pops.length < 2) continue
        if (regName(pops[0]) !== loadBase) continue
        if (pops[1].type !== 'imm' && pops[1].type !== 'cimm') continue
        try {
            const page = ptr(pops[1].value)
            return { slot: page.add(disp), page, disp }
        } catch (e) {
            return null
        }
    }
    return null
}

/**
 * True when the indirect branch is fed by an *indexed* load, the arm64 switch
 * table idiom `ldr xN, [xM, xK, lsl #s]` / `ldrsw`. Those hide real intra
 * function control flow, unlike PLT stubs.
 */
export function isJumpTableBranch(insn: Instruction, arch: CfgArch = CfgAnalyzer.detectArch()): boolean {
    if (arch !== 'arm64') return false
    if (insn.mnemonic !== 'br') return false
    const ops = operandsOf(insn)
    if (ops === null || ops.length === 0) return false
    const brReg = regName(ops[0])
    if (brReg === null) return false

    for (let i = 1; i <= 4; i++) {
        const prev = safeParse(insn.address.sub(i * 4))
        if (prev === null) break
        const m = prev.mnemonic
        if (m !== 'ldr' && m !== 'ldrsw' && m !== 'ldrsb' && m !== 'ldrsh') continue
        const pops = operandsOf(prev)
        if (pops === null || pops.length < 2) continue
        if (regName(pops[0]) !== brReg) continue
        const mem = memValue(pops[1])
        if (mem !== null && mem.index !== undefined) return true
    }
    return false
}

/** Classify an opaque indirect branch. */
export function refineIndirect(insn: Instruction, arch: CfgArch = CfgAnalyzer.detectArch()): IndirectKind {
    if (resolveGotSlot(insn, arch) !== null) return 'plt'
    if (isJumpTableBranch(insn, arch)) return 'jumpTable'
    return 'unknown'
}

export interface PltStubInfo {
    stub: NativePointer
    gotSlot: NativePointer | null
    /** Current content of the GOT slot, i.e. the callee once lazy binding ran. */
    target: NativePointer | null
}

const pltStubCache: Map<string, PltStubInfo | null> = new Map()

/**
 * Inspect `addr` as the *start* of a PLT stub. Used before following a `b`
 * target so tail calls into the PLT are not mistaken for intra function jumps.
 */
export function inspectPltStub(addr: NativePointer, arch: CfgArch = CfgAnalyzer.detectArch()): PltStubInfo | null {
    const key = `${arch}:${addr}`
    if (pltStubCache.has(key)) return pltStubCache.get(key)!

    let info: PltStubInfo | null = null

    if (arch === 'arm64') {
        let cursor = addr
        let sawAdrp = false
        let sawLdr = false
        for (let i = 0; i < 4 && info === null; i++) {
            const insn = safeParse(cursor)
            if (insn === null) break
            const m = insn.mnemonic
            if (m === 'adrp') {
                sawAdrp = true
            } else if (m === 'ldr' && sawAdrp) {
                sawLdr = true
            } else if (m === 'add' && sawAdrp) {
                // `add x16, x16, #off` is part of the stub, keep going
            } else if ((m === 'br' || m === 'blr') && sawAdrp && sawLdr) {
                const slot = resolveGotSlot(insn, arch)
                if (slot !== null) {
                    info = { stub: addr, gotSlot: slot.slot, target: safeReadPointer(slot.slot) }
                }
                break
            } else {
                break
            }
            cursor = insn.next
        }
    } else if (arch === 'ia32' || arch === 'x64') {
        const insn = safeParse(addr)
        if (insn !== null && insn.mnemonic === 'jmp') {
            const slot = resolveGotSlot(insn, arch)
            if (slot !== null) {
                info = { stub: addr, gotSlot: slot.slot, target: safeReadPointer(slot.slot) }
            }
        }
    }

    pltStubCache.set(key, info)
    return info
}

export function isPltStub(addr: NativePointer, arch: CfgArch = CfgAnalyzer.detectArch()): boolean {
    return inspectPltStub(addr, arch) !== null
}

/**
 * Resolve what an indirect branch actually jumps to by reading its GOT slot.
 * Returns null when the branch is not a GOT load.
 */
export function indirectTarget(insn: Instruction, arch: CfgArch = CfgAnalyzer.detectArch()):
    { gotSlot: NativePointer, target: NativePointer | null } | null {
    const slot = resolveGotSlot(insn, arch)
    if (slot === null) return null
    return { gotSlot: slot.slot, target: safeReadPointer(slot.slot) }
}

/**
 * Resolve a `bl` / `b` target that turns out to be a PLT stub down to the real
 * callee. Null when `addr` is not a stub or the GOT entry is still unbound.
 */
export function pltCallTarget(addr: NativePointer, arch: CfgArch = CfgAnalyzer.detectArch()): NativePointer | null {
    const stub = inspectPltStub(addr, arch)
    return stub === null ? null : stub.target
}

/** Drop every cached PLT resolution, e.g. after lazy binding changed the GOT. */
export function clearPltCache(): void {
    pltStubCache.clear()
}

export class CfgAnalyzer {

    public static readonly DEFAULT_MAX_SPAN: number = 0x10000
    public static readonly DEFAULT_MAX_INSNS: number = 20000
    public static readonly DEFAULT_MAX_SWEEP_BYTES: number = 0x200

    public static detectArch(): CfgArch {
        const arch = Process.arch
        if (arch === 'arm64' || arch === 'arm' || arch === 'ia32' || arch === 'x64') return arch
        return 'arm64'
    }

    /** Minimum encoding granularity in bytes, used to validate recovered sizes. */
    public static granularity(arch: CfgArch = CfgAnalyzer.detectArch()): number {
        return arch === 'arm64' ? 4 : (arch === 'arm' ? 2 : 1)
    }

    /**
     * Recover the extent of the function starting at `start`.
     */
    public static analyze(start: NativePointer, options: CfgOptions = {}): CfgResult {
        const arch = CfgAnalyzer.detectArch()
        const maxSpan = options.maxSpan === undefined ? CfgAnalyzer.DEFAULT_MAX_SPAN : options.maxSpan
        const maxInsns = options.maxInsns === undefined ? CfgAnalyzer.DEFAULT_MAX_INSNS : options.maxInsns
        const maxSweepBytes = options.maxSweepBytes === undefined ? CfgAnalyzer.DEFAULT_MAX_SWEEP_BYTES : options.maxSweepBytes
        const collectCalls = options.collectCalls !== false

        // On 32 bit ARM the low bit of a function pointer selects Thumb mode.
        let entry = start
        if (arch === 'arm' && !entry.and(1).isNull()) entry = entry.sub(1)

        const limit = entry.add(maxSpan)
        const visited = new Set<string>()
        const worklist: NativePointer[] = [entry]
        const returns: NativePointer[] = []
        const calls: CfgCallSite[] = []
        const pltCalls: CfgPltCall[] = []
        const indirectBranches: NativePointer[] = []
        const undecodable: NativePointer[] = []

        let end = entry
        let insnCount = 0
        let blockCount = 0
        let truncated = false

        const inRange = (addr: NativePointer): boolean => addr.compare(entry) >= 0 && addr.compare(limit) < 0
        const track = (insn: Instruction, kind: InsnKind): void => {
            const insnEnd = insn.address.add(insn.size)
            // Alignment nops between functions must not widen the recovered body.
            if (kind !== 'padding' && insnEnd.compare(end) > 0) end = insnEnd
        }
        const recordPltTail = (from: NativePointer, stub: PltStubInfo | null): void => {
            pltCalls.push({
                from,
                stub: stub === null ? null : stub.stub,
                gotSlot: stub === null ? null : stub.gotSlot,
                target: stub === null ? null : stub.target,
            })
        }

        while (worklist.length > 0 && !truncated) {
            let cursor: NativePointer = worklist.pop()!
            let blockInsns = 0

            while (!truncated) {
                if (insnCount >= maxInsns) { truncated = true; break }
                if (!inRange(cursor)) break

                const key = cursor.toString()
                if (visited.has(key)) break
                visited.add(key)

                const insn = safeParse(cursor)
                if (insn === null) {
                    undecodable.push(cursor)
                    break
                }

                const kind = classifyInstruction(insn, arch)
                track(insn, kind)
                insnCount++
                blockInsns++

                switch (kind) {
                    case 'return':
                        returns.push(cursor)
                        break
                    case 'indirect':
                    case 'indirectCall': {
                        const refined = refineIndirect(insn, arch)
                        if (refined === 'plt') {
                            const slot = resolveGotSlot(insn, arch)
                            recordPltTail(cursor, slot === null ? null
                                : { stub: cursor, gotSlot: slot.slot, target: safeReadPointer(slot.slot) })
                            // `blr`/`call` through the PLT returns, `br`/`jmp` is a tail call.
                            if (kind === 'indirectCall') { cursor = insn.next; continue }
                            break
                        }
                        // jump table or genuinely opaque: control flow we cannot follow
                        indirectBranches.push(cursor)
                        if (kind === 'indirectCall') { cursor = insn.next; continue }
                        break
                    }
                    case 'jump': {
                        const target = branchTarget(insn)
                        if (target !== null) {
                            const stub = inspectPltStub(target, arch)
                            if (stub !== null) {
                                // Tail call into the PLT: leaves the function.
                                recordPltTail(cursor, stub)
                                break
                            }
                            if (inRange(target)) { cursor = target; continue }
                        }
                        break // tail call into another function, this path ends here
                    }
                    case 'branch': {
                        const target = branchTarget(insn)
                        if (target !== null && inRange(target) && !isPltStub(target, arch)) worklist.push(target)
                        cursor = insn.next
                        continue
                    }
                    case 'call': {
                        if (collectCalls) {
                            const target = branchTarget(insn)
                            if (target !== null) calls.push({ from: cursor, to: target })
                        }
                        cursor = insn.next
                        continue
                    }
                    default:
                        cursor = insn.next
                        continue
                }
                break
            }

            if (blockInsns > 0) blockCount++
        }

        let linearSwept = false
        // Only genuine jump tables justify sweeping: PLT stubs are terminators and
        // sweeping across a stub array is what inflates the result to tens of KB.
        if (indirectBranches.length > 0 && options.linearSweepOnIndirect !== false && !truncated) {
            const swept = CfgAnalyzer.linearSweep(end, limit, arch, maxInsns - insnCount, maxSweepBytes)
            if (swept.end.compare(end) > 0) {
                end = swept.end
                insnCount += swept.insnCount
                linearSwept = true
                if (swept.truncated) truncated = true
            }
        }

        const terminated = returns.length > 0 || pltCalls.length > 0
        let confidence: 'high' | 'medium' | 'low'
        if (!terminated || insnCount === 0) confidence = 'low'
        else if (indirectBranches.length === 0 && !truncated && undecodable.length === 0) confidence = 'high'
        else confidence = 'medium'

        return {
            start: entry,
            end,
            size: end.sub(entry).toInt32(),
            arch,
            insnCount,
            blockCount,
            returns,
            calls,
            pltCalls,
            indirectBranches,
            undecodable,
            truncated,
            linearSwept,
            confidence,
        }
    }

    /**
     * Bounded forward linear sweep. Used to pick up bodies that the CFG cannot see
     * (jump tables reached through `br Xn`). Stops on the first strong boundary
     * signal: undecodable bytes, an alignment padding run, a fresh prologue, a PLT
     * stub, or the byte budget.
     */
    public static linearSweep(from: NativePointer, limit: NativePointer, arch: CfgArch = CfgAnalyzer.detectArch(),
                              budget: number = 256, maxBytes: number = CfgAnalyzer.DEFAULT_MAX_SWEEP_BYTES):
        { end: NativePointer, insnCount: number, truncated: boolean } {

        let cursor = from
        let end = from
        let insnCount = 0
        let paddingRun = 0
        let truncated = false
        const byteLimit = from.add(maxBytes)
        const hardLimit = byteLimit.compare(limit) < 0 ? byteLimit : limit

        while (cursor.compare(hardLimit) < 0) {
            if (insnCount >= budget) { truncated = true; break }

            const insn = safeParse(cursor)
            if (insn === null) break

            const kind = classifyInstruction(insn, arch)

            if (kind === 'padding') {
                paddingRun++
                // Two or more consecutive nops is function alignment padding.
                if (paddingRun >= 2) break
                cursor = insn.next
                continue
            }
            paddingRun = 0

            // Past the CFG end a prologue always means "next function".
            if (isPrologue(insn, arch)) break
            // Walking into the PLT stub array is exactly the failure we want to avoid.
            if (isPltStub(cursor, arch)) break

            insnCount++
            const insnEnd = insn.address.add(insn.size)
            if (insnEnd.compare(end) > 0) end = insnEnd

            cursor = insn.next
        }

        return { end, insnCount, truncated }
    }

    /** Human readable one-line summary, handy in the REPL. */
    public static describe(result: CfgResult): string {
        let disp = `Cfg< ${result.start} -> ${result.end} > size: ${result.size} ( 0x${result.size.toString(16)} )`
        disp += ` | arch: ${result.arch} | confidence: ${result.confidence}`
        disp += ` | insns: ${result.insnCount} | blocks: ${result.blockCount} | returns: ${result.returns.length}`
        disp += ` | calls: ${result.calls.length} | plt: ${result.pltCalls.length} | indirect: ${result.indirectBranches.length}`
        if (result.undecodable.length > 0) disp += ` | undecodable: ${result.undecodable.length}`
        if (result.truncated) disp += ` | TRUNCATED`
        if (result.linearSwept) disp += ` | linear-swept`
        return disp
    }
}

declare global {
    /** Recover a function body with the lightweight CFG only (skips all metadata). */
    var analyzeFunctionCfg: (start: NativePointer | string | number, options?: CfgOptions) => CfgResult
    var isPltStub: (addr: NativePointer | string | number) => boolean
    var clearPltCache: () => void
}

// Exposed as globals so they can be driven straight from the REPL in the compiled agent.
Reflect.set(globalThis, 'CfgAnalyzer', CfgAnalyzer)
Reflect.set(globalThis, 'inspectPltStub', inspectPltStub)
Reflect.set(globalThis, 'resolveGotSlot', resolveGotSlot)

globalThis.isPltStub = (addr: NativePointer | string | number): boolean =>
    isPltStub(typeof addr === 'string' || typeof addr === 'number' ? ptr(addr) : addr)
globalThis.clearPltCache = clearPltCache
globalThis.analyzeFunctionCfg = (start: NativePointer | string | number, options: CfgOptions = {}): CfgResult => {
    const result = CfgAnalyzer.analyze(typeof start === 'string' || typeof start === 'number' ? ptr(start) : start, options)
    LOGD(CfgAnalyzer.describe(result))
    return result
}
