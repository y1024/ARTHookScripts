// Function boundary resolution.
//
// Metadata first, CFG only as a fallback:
//   1. art::OatQuickMethodHeader  -> exact code size written by the compiler (AOT/JIT java code)
//   2. ELF symbol st_size         -> exact size, from .symtab / .dynsym
//   3. next function symbol       -> upper bound when st_size is 0
//   4. CfgAnalyzer                -> recursive descent CFG for stripped / RegisterNatives code
//
// Symbol tables are enumerated once per module and binary searched afterwards,
// because enumerateSymbols() on something like libunity.so is far too slow to
// call per instruction.

import { OatQuickMethodHeader } from "../implements/10/art/OatQuickMethodHeader"
import { branchTarget, CfgAnalyzer, CfgArch, CfgOptions, CfgResult, classifyInstruction, indirectTarget, inspectPltStub, isJumpTableBranch, isPltStub } from "./CfgAnalyzer"
import { formatSymbol } from "./SymHelper"

export type FunctionBoundarySource = 'oat-header' | 'symbol-size' | 'symbol-next' | 'cfg' | 'cfg-bounded' | 'unknown'

export interface FunctionBoundaryOptions extends CfgOptions {
    /** Treat `addr - 8` as an art::OatQuickMethodHeader (compiled java method). */
    oatHeader?: boolean
    /** 'cfg' skips every metadata lookup and goes straight to the CFG. */
    prefer?: 'metadata' | 'cfg'
    /** Set false to disable the CFG fallback. */
    allowCfg?: boolean
    /**
     * `symbol-next` only yields an upper bound (there may be several functions in
     * between), so the CFG is used to tighten it. Set false to trust the bound.
     */
    refineSymbolNext?: boolean
}

export interface ShowFunctionAsmOptions extends FunctionBoundaryOptions {
    /** Instruction count cap, `-1` (default) means "the whole recovered function". */
    num?: number
    /** Per instruction symbol annotation, everything on by default. */
    annotate?: AnnotateOptions
}

export interface FunctionBoundary {
    start: NativePointer
    /** Exclusive end address. Equals `start` when nothing could be determined. */
    end: NativePointer
    size: number
    source: FunctionBoundarySource
    confidence: 'exact' | 'high' | 'medium' | 'low'
    moduleName: string | null
    symbolName: string | null
    /** Populated only when the CFG fallback was used. */
    cfg: CfgResult | null
}

export interface SymbolEntry {
    address: NativePointer
    name: string
    /** ELF st_size, 0 when the symbol carries no size. */
    size: number
}

export class SymbolTableCache {

    private static tables: Map<string, SymbolEntry[]> = new Map()

    public static clear(): void {
        SymbolTableCache.tables.clear()
    }

    public static cachedModules(): string[] {
        return Array.from(SymbolTableCache.tables.keys())
    }

    /** Sorted function symbols of a module, enumerated at most once. */
    public static of(moduleName: string): SymbolEntry[] {
        const cached = SymbolTableCache.tables.get(moduleName)
        if (cached !== undefined) return cached

        const table: SymbolEntry[] = []
        try {
            const md = Process.findModuleByName(moduleName)
            if (md !== null) {
                for (const sym of md.enumerateSymbols()) {
                    if (sym.type !== 'function') continue
                    if (sym.address.isNull()) continue
                    table.push({
                        address: sym.address,
                        name: sym.name,
                        size: sym.size === undefined ? 0 : sym.size,
                    })
                }
            }
        } catch (e) {
            LOGW(`SymbolTableCache: enumerateSymbols('${moduleName}') failed -> ${e}`)
        }

        table.sort((a: SymbolEntry, b: SymbolEntry) => a.address.compare(b.address))
        SymbolTableCache.tables.set(moduleName, table)
        return table
    }

    /** Index of the first symbol whose address is >= addr. */
    private static lowerBound(table: SymbolEntry[], addr: NativePointer): number {
        let lo = 0
        let hi = table.length
        while (lo < hi) {
            const mid = (lo + hi) >>> 1
            if (table[mid].address.compare(addr) < 0) lo = mid + 1
            else hi = mid
        }
        return lo
    }

    private static tableOf(addr: NativePointer): SymbolEntry[] | null {
        const md = Process.findModuleByAddress(addr)
        return md === null ? null : SymbolTableCache.of(md.name)
    }

    /** Symbol starting exactly at addr, regardless of its size. */
    public static exact(addr: NativePointer): SymbolEntry | null {
        const table = SymbolTableCache.tableOf(addr)
        if (table === null) return null
        const i = SymbolTableCache.lowerBound(table, addr)
        return (i < table.length && table[i].address.equals(addr)) ? table[i] : null
    }

    /** Symbol whose [address, address + size) range contains addr. */
    public static containing(addr: NativePointer): { sym: SymbolEntry, offset: number } | null {
        const table = SymbolTableCache.tableOf(addr)
        if (table === null) return null
        const i = SymbolTableCache.lowerBound(table, addr)
        if (i === 0) return null
        const cand = table[i - 1]
        if (cand.size <= 0) return null
        const offset = addr.sub(cand.address).toInt32()
        if (offset < 0 || offset >= cand.size) return null
        return { sym: cand, offset }
    }

    /** Nearest function symbol strictly after addr, an upper bound when st_size is 0. */
    public static nextAfter(addr: NativePointer): SymbolEntry | null {
        const table = SymbolTableCache.tableOf(addr)
        if (table === null) return null
        const i = SymbolTableCache.lowerBound(table, addr)
        if (i < table.length && table[i].address.compare(addr) > 0) return table[i]
        return (i + 1 < table.length) ? table[i + 1] : null
    }

    public static stats(moduleName: string): string {
        const table = SymbolTableCache.of(moduleName)
        const withSize = table.filter((s: SymbolEntry) => s.size > 0).length
        return `SymbolTable< ${moduleName} > functions: ${table.length} | with st_size: ${withSize}`
    }

    /** Look a function symbol up by name, exact match first then substring. */
    public static findByName(moduleName: string, name: string, partial: boolean = false): SymbolEntry | null {
        const table = SymbolTableCache.of(moduleName)
        for (const sym of table) {
            if (sym.name === name) return sym
        }
        if (!partial) return null
        for (const sym of table) {
            if (sym.name.indexOf(name) !== -1) return sym
        }
        return null
    }
}

/**
 * art::OatQuickMethodHeader precedes the raw code chunk generated by the compiler:
 *   uint32_t vmap_table_offset_;
 *   uint32_t code_size_;   // highest bit is the should_deoptimize flag
 *   uint8_t  code_[0];
 * Returns 0 when the bytes before `addr` do not look like a valid header.
 */
function tryOatHeaderCodeSize(addr: NativePointer, maxSpan: number, gran: number): number {
    try {
        const header = new OatQuickMethodHeader(addr.sub(8))
        const vmapOffset = header.vmap_table_offset
        if (vmapOffset < 0 || vmapOffset > 0x10000) return 0
        const size = header.GetCodeSize()
        if (size <= 0 || size > maxSpan || (size % gran) !== 0) return 0
        const md = Process.findModuleByAddress(addr)
        if (md !== null && addr.add(size).compare(md.base.add(md.size)) > 0) return 0
        // The recovered body must at least start with a decodable instruction.
        Instruction.parse(addr)
        return size
    } catch (e) {
        return 0
    }
}

export function getFunctionBoundary(addr: NativePointer, options: FunctionBoundaryOptions = {}): FunctionBoundary {
    const arch = CfgAnalyzer.detectArch()
    const gran = CfgAnalyzer.granularity(arch)
    const maxSpan = options.maxSpan === undefined ? CfgAnalyzer.DEFAULT_MAX_SPAN : options.maxSpan

    // On 32 bit ARM the low bit of a function pointer selects Thumb mode.
    const start = (arch === 'arm' && !addr.and(1).isNull()) ? addr.sub(1) : addr
    const md = Process.findModuleByAddress(start)
    const moduleName = md === null ? null : md.name

    const isSane = (size: number): boolean => size > 0 && size <= maxSpan && (size % gran) === 0
    const make = (size: number, source: FunctionBoundarySource, confidence: FunctionBoundary['confidence'],
                  symbolName: string | null, cfg: CfgResult | null): FunctionBoundary => ({
        start,
        end: start.add(size),
        size,
        source,
        confidence,
        moduleName,
        symbolName,
        cfg,
    })

    let symbolName: string | null = null

    if (options.prefer !== 'cfg') {

        // 1. compiler provided code size
        if (options.oatHeader === true) {
            const oatSize = tryOatHeaderCodeSize(start, maxSpan, gran)
            if (oatSize > 0) return make(oatSize, 'oat-header', 'exact', null, null)
        }

        // 2. ELF st_size
        const hit = SymbolTableCache.containing(start)
        if (hit !== null) {
            symbolName = hit.sym.name
            const size = hit.sym.size - hit.offset
            if (isSane(size)) return make(size, 'symbol-size', 'exact', symbolName, null)
        } else {
            const exact = SymbolTableCache.exact(start)
            if (exact !== null) symbolName = exact.name
        }

        // 3. distance to the next function symbol: only an upper bound, several
        //    functions may live in between, so let the CFG tighten it.
        const next = SymbolTableCache.nextAfter(start)
        if (next !== null) {
            const size = next.address.sub(start).toInt32()
            if (isSane(size)) {
                if (options.allowCfg !== false && options.refineSymbolNext !== false) {
                    const cfg = CfgAnalyzer.analyze(start, {
                        maxSpan: size,
                        maxInsns: options.maxInsns,
                        linearSweepOnIndirect: options.linearSweepOnIndirect,
                        collectCalls: options.collectCalls,
                    })
                    if (cfg.size > 0 && cfg.size < size && cfg.end.compare(next.address) <= 0) {
                        const refined: FunctionBoundary['confidence'] =
                            cfg.confidence === 'high' ? 'high' : (cfg.confidence === 'medium' ? 'medium' : 'low')
                        return make(cfg.size, 'cfg-bounded', refined, symbolName, cfg)
                    }
                }
                return make(size, 'symbol-next', 'medium', symbolName, null)
            }
        }
    }

    // 4. lightweight CFG
    if (options.allowCfg !== false) {
        const cfg = CfgAnalyzer.analyze(start, options)
        if (cfg.size > 0) {
            const confidence: FunctionBoundary['confidence'] =
                cfg.confidence === 'high' ? 'high' : (cfg.confidence === 'medium' ? 'medium' : 'low')
            return make(cfg.size, 'cfg', confidence, symbolName, cfg)
        }
    }

    return make(0, 'unknown', 'low', symbolName, null)
}

export function getFunctionSize(addr: NativePointer, options: FunctionBoundaryOptions = {}): number {
    return getFunctionBoundary(addr, options).size
}

export function describeBoundary(b: FunctionBoundary): string {
    let disp = `FunctionBoundary< ${b.start} -> ${b.end} >`
    disp += ` size: ${b.size} ( 0x${b.size.toString(16)} )`
    disp += ` | source: ${b.source} | confidence: ${b.confidence}`
    disp += ` | module: ${b.moduleName === null ? '?' : b.moduleName}`
    disp += ` | symbol: ${b.symbolName === null ? formatSymbol(b.start) : b.symbolName}`
    if (b.cfg !== null) {
        disp += ` | cfg: insns ${b.cfg.insnCount}, blocks ${b.cfg.blockCount}, returns ${b.cfg.returns.length}, plt ${b.cfg.pltCalls.length}, indirect ${b.cfg.indirectBranches.length}`
    }
    return disp
}

export interface AnnotateOptions {
    /** Resolve `bl` / `call` targets through DebugSymbol. Default true. */
    calls?: boolean
    /** Render intra function branch targets as relative `+0xNN` labels. Default true. */
    branches?: boolean
    /** Mark return / trap instructions. Default true. */
    returns?: boolean
}

const TRAP_MNEMONICS: string[] = ['brk', 'udf', 'ud2', 'hlt']

/** Resolve a direct call/branch target, seeing through PLT stubs. */
function describeTarget(target: NativePointer, arch: CfgArch): string {
    const stub = inspectPltStub(target, arch)
    if (stub === null) return formatSymbol(target)
    return stub.target === null
        ? `[plt unbound] ${formatSymbol(target)}`
        : `[plt] ${formatSymbol(stub.target)}`
}

/**
 * Build the trailing annotation of one disassembled instruction.
 *
 * Call targets are resolved with DebugSymbol (C++ names demangled, cached) and
 * seen through PLT stubs down to the real callee, branches inside the function
 * become relative labels so they can be matched against the offset column, and
 * returns / traps / indirect jumps get marked.
 */
export function annotateInstruction(insn: Instruction, start: NativePointer, end: NativePointer, options: AnnotateOptions = {}): string {
    const arch = CfgAnalyzer.detectArch()
    const kind = classifyInstruction(insn, arch)
    const knownEnd: boolean = end.compare(start) > 0

    switch (kind) {
        case 'call': {
            if (options.calls === false) return ''
            const target = branchTarget(insn)
            return target === null ? '' : `   ; -> ${describeTarget(target, arch)}`
        }
        case 'indirectCall': {
            if (options.calls === false) return ''
            const resolved = indirectTarget(insn, arch)
            if (resolved === null) return '   ; -> [indirect call]'
            return resolved.target === null
                ? `   ; -> [plt unbound] got ${resolved.gotSlot}`
                : `   ; -> [plt] ${formatSymbol(resolved.target)}`
        }
        case 'indirect': {
            const resolved = indirectTarget(insn, arch)
            if (resolved !== null) {
                return resolved.target === null
                    ? `   <== plt tail call (got ${resolved.gotSlot})`
                    : `   <== plt tail call -> ${formatSymbol(resolved.target)}`
            }
            return isJumpTableBranch(insn, arch)
                ? '   <== indirect branch (jump table?)'
                : '   <== indirect branch (target unknown)'
        }
        case 'return':
            if (options.returns === false) return ''
            return TRAP_MNEMONICS.indexOf(insn.mnemonic) !== -1
                ? `   <== trap (${insn.mnemonic})`
                : '   <== return'
        case 'jump':
        case 'branch': {
            const target = branchTarget(insn)
            if (target === null) return ''
            const relative = (): string => options.branches === false ? '' : `   ; -> +0x${target.sub(start).toString(16)}`
            if (knownEnd && target.compare(start) >= 0 && target.compare(end) < 0) return relative()
            // Leaving the function: a PLT stub is an external tail call, anything
            // else is a jump into neighbouring code.
            const external = `   ; -> ${describeTarget(target, arch)}${kind === 'jump' ? ' [tail]' : ''}`
            if (!knownEnd) {
                const targetModule = Process.findModuleByAddress(target)
                const startModule = Process.findModuleByAddress(start)
                if (targetModule !== null && startModule !== null &&
                    targetModule.name === startModule.name && target.compare(start) >= 0 &&
                    !isPltStub(target, arch)) {
                    return relative()
                }
            }
            return external
        }
        default:
            return ''
    }
}

/**
 * Disassemble the whole recovered function. `num` caps the instruction count,
 * `-1` prints everything up to the recovered end.
 */
export function showFunctionAsm(addr: NativePointer, options: ShowFunctionAsmOptions = {}): FunctionBoundary {
    const boundary = getFunctionBoundary(addr, options)
    const num = options.num === undefined ? -1 : options.num
    const annotate: AnnotateOptions = options.annotate === undefined ? {} : options.annotate

    newLine()
    LOGD(`👉 ${formatSymbol(boundary.start)}`)
    LOGZ(`[ ${describeBoundary(boundary)} ]`)
    if (boundary.confidence === 'low') LOGW(`[ boundary confidence is LOW, the result may over/under extend ]`)
    newLine()

    if (boundary.size <= 0) {
        LOGE(`Unable to determine the function boundary of ${boundary.start}, falling back to 20 instructions`)
    }

    const md = Process.findModuleByAddress(boundary.start)
    const gran = CfgAnalyzer.granularity()
    const wholeFunction = num === -1 && boundary.size > 0
    const maxCount = wholeFunction
        ? Math.ceil(boundary.size / gran) + 4
        : (num === -1 ? 20 : num)

    let insns: Instruction
    try {
        insns = Instruction.parse(boundary.start) as Instruction
    } catch (e) {
        LOGE(`Cannot decode an instruction at ${boundary.start}`)
        newLine()
        return boundary
    }

    let index = 0
    let offset = 0
    while (index < maxCount) {
        if (wholeFunction && insns.address.compare(boundary.end) >= 0) break
        index++

        const indexStr = `[${index.toString().padStart(5, ' ')}|${ptr(offset).toString().padEnd(7, ' ')}]`
        const rel = md === null ? '?' : insns.address.sub(md.base)
        LOGD(`${indexStr} ${insns.address} | ${rel}  ${insns.toString()}${annotateInstruction(insns, boundary.start, boundary.end, annotate)}`)

        offset += insns.size
        try {
            insns = Instruction.parse(insns.next) as Instruction
        } catch (e) {
            LOGE(`${indexStr} ${insns.next} <--- UNDECODABLE, stop`)
            break
        }
    }

    newLine()
    return boundary
}

declare global {
    var FunctionBoundaryUtil: {
        getFunctionBoundary: typeof getFunctionBoundary
        getFunctionSize: typeof getFunctionSize
        showFunctionAsm: typeof showFunctionAsm
        describeBoundary: typeof describeBoundary
        annotateInstruction: typeof annotateInstruction
        SymbolTableCache: typeof SymbolTableCache
    }
    var getFunctionBoundary: (addr: NativePointer | string | number, options?: FunctionBoundaryOptions) => FunctionBoundary
    var getFunctionSize: (addr: NativePointer | string | number, options?: FunctionBoundaryOptions) => number
    /** Disassemble a whole function, boundary resolved by metadata first then CFG. */
    var showFunctionAsm: (addr: NativePointer | string | number, options?: ShowFunctionAsmOptions) => FunctionBoundary
}

const toPtr = (addr: NativePointer | string | number): NativePointer =>
    (typeof addr === 'string' || typeof addr === 'number') ? ptr(addr) : addr

globalThis.getFunctionBoundary = (addr, options = {}) => getFunctionBoundary(toPtr(addr), options)
globalThis.getFunctionSize = (addr, options = {}) => getFunctionSize(toPtr(addr), options)
globalThis.showFunctionAsm = (addr, options = {}) => showFunctionAsm(toPtr(addr), options)

globalThis.FunctionBoundaryUtil = {
    getFunctionBoundary,
    getFunctionSize,
    showFunctionAsm,
    describeBoundary,
    annotateInstruction,
    SymbolTableCache,
}
