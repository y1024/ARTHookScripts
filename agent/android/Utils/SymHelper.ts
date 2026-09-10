import { demangleName_onlyFunctionName as demangleName_ } from "../../tools/functions"
import { SymbolManager } from "../functions/SymbolManager"
import { JSHandle } from "../JSHandle"

const DEBUG_LOG: boolean = false

function CallSymLocal<T>(address: NativePointer, retType: NativeType, argTypes: NativeType[], ...args: any[]): T {
    try {
        return new NativeFunction(address, retType, argTypes)(...args) as T
    } catch (error: any) {
        throw error
        LOGE(`CallSymLocal exception 👇 \n${error.stack}`)
        return null
    }
}

type ArgType = NativeType | JSHandle | NativePointer | number

function transformArgs(args: ArgType[], argTypes: NativeType[]): any[] {
    return args.map((arg: any, index: number) => {
        if (argTypes[index] == "int") return parseInt(arg.toString())
        if (arg instanceof NativePointer) return arg
        if (arg instanceof JSHandle) return arg.handle
        if (typeof arg === "number") return arg
        if (typeof arg === "string") return Memory.allocUtf8String(arg)
        return ptr(arg)
    })
}

export function callSym<T>(sym: string, md: string, retType: NativeType, argTypes: NativeType[], ...args: any[]): T {
    return CallSymLocal<T>(getSym(sym, md), retType, argTypes, ...transformArgs(args, argTypes))
}

const Cache: Map<string, NativePointer> = new Map()
export function getSym(symName: string, md: string = "libart.so", checkNotFunction: boolean = false): NativePointer | null {
    if (Cache.has(symName)) return Cache.get(symName)!
    if (symName == undefined || md == null || symName == "" || md == "")
        throw new Error(`Usage: getSym(symName: string, md: string, check: boolean = false)`)

    const module: Module = Process.getModuleByName(md)
    if (module == null) throw new Error(`module ${md} not found`)

    let address: NativePointer | null = module.findExportByName(symName)

    // add action to find in symbols
    if (address == null) {
        let res: ModuleSymbolDetails[] = module.enumerateSymbols().filter((sym: ModuleSymbolDetails) => {
            return sym.name == symName && (checkNotFunction ? sym.type == "function" : true)
        })
        if (res.length > 1) {
            address = res[0].address
            LOGW(`find too many symbol, just ret first | size : ${res.length}`)
            return address
        } else if (res.length == 1) {
            address = res[0].address
            return address
        }
    }

    // Use demangle to handle function export names, 
    // used to deal with the problem of exporting functions with the same name 
    // but different arguments under arm32 and arm64
    if (address == null) {
        let sym_ret: ModuleSymbolDetails = SymbolManager.SymbolFilter(null, demangleName_(symName))
        if (DEBUG_LOG) LOGD(`debug -> symbol ${symName} found in ${sym_ret} -> ${sym_ret.address}`)
        if (sym_ret.type != "function") throw new Error(`symbol ${sym_ret.name} not a function [ ${sym_ret.type} ]`)
        address = sym_ret.address
    }
    if (DEBUG_LOG) LOGD(`debug -> symbol ${symName} found in ${md} -> ${address}`)
    if (address == null) {
        throw new Error(`symbol ${symName} not found`)
    }
    if (checkNotFunction) {
        const syms: ModuleSymbolDetails[] = module.enumerateSymbols().filter((sym: ModuleSymbolDetails) => {
            return sym.name == symName && sym.type == "object"
        })
        if (syms.length == 0) {
            throw new Error(`symbol ${symName} not found`)
        } else {
            // LOGD(`symbol ${symName} found \n ${JSON.stringify(syms[0])}`)
        }
    }
    Cache.set(symName, address)
    return address
}

Reflect.set(globalThis, "getSym", getSym)
Reflect.set(globalThis, "callSym", callSym)

// Cached NativeFunctions: formatSymbol() demangles once per distinct address, so
// rebuilding these on every call would dominate the cost of a full disassembly.
let cxaDemangle: NativeFunction | null = null
let cxaDemangleFree: NativeFunction | null = null
let cxaDemangleFreeResolved: boolean = false

function getCxaDemangle(): NativeFunction {
    if (cxaDemangle !== null) return cxaDemangle
    let demangleAddress: NativePointer | null = Module.findExportByName("libc++.so", '__cxa_demangle')
    if (demangleAddress == null) demangleAddress = Module.findExportByName("libunwindstack.so", '__cxa_demangle')
    if (demangleAddress == null) demangleAddress = Module.findExportByName("libbacktrace.so", '__cxa_demangle')
    if (demangleAddress == null) demangleAddress = Module.findExportByName(null, '__cxa_demangle')
    if (demangleAddress == null) throw Error("can not find export function -> __cxa_demangle")
    cxaDemangle = new NativeFunction(demangleAddress, 'pointer', ['pointer', 'pointer', 'pointer', 'pointer'])
    return cxaDemangle
}

function getCxaDemangleFree(): NativeFunction | null {
    if (!cxaDemangleFreeResolved) {
        cxaDemangleFreeResolved = true
        const freeAddr: NativePointer | null = Module.findExportByName("libc.so", 'free')
        cxaDemangleFree = freeAddr === null ? null : new NativeFunction(freeAddr, 'void', ['pointer'])
    }
    return cxaDemangleFree
}

/**
 * Demangles a C++ symbol name using available libraries.
 * @param expName The mangled symbol name to demangle.
 * @returns The demangled symbol name, or an empty string if demangling failed.
 */
export function demangleName(expName: string) {
    const demangle: NativeFunction = getCxaDemangle()
    let mangledName: NativePointer = Memory.allocUtf8String(expName)
    let outputBuffer: NativePointer = NULL
    let length: NativePointer = NULL
    let status: NativePointer = Memory.alloc(Process.pageSize)
    let result: NativePointer = demangle(mangledName, outputBuffer, length, status) as NativePointer
    if (status.readInt() === 0) {
        let resultStr: string | null = result.readUtf8String()
        // __cxa_demangle malloc()s the returned buffer when *output_buffer is NULL.
        if (!result.isNull() && !result.equals(mangledName)) {
            const free: NativeFunction | null = getCxaDemangleFree()
            if (free !== null) free(result)
        }
        return (resultStr == null || resultStr == expName) ? "" : resultStr
    } else return ""
}

globalThis.demangleName = demangleName

const DebugSymbolCache: Map<string, string> = new Map()

/**
 * Render an address as `module!symbol`, resolved through DebugSymbol.
 *
 * - C++ names are demangled through __cxa_demangle
 * - an address inside a symbol becomes `module!symbol+0xNN`
 * - an unnamed address falls back to `module!0xoffset` (module relative)
 * - source info is appended when the module carries debug information
 *
 * Results are cached because DebugSymbol.fromAddress() is expensive and the
 * disassembly helpers call it once per instruction.
 */
export function formatSymbol(addr: NativePointer): string {
    const key: string = addr.toString()
    const cached: string | undefined = DebugSymbolCache.get(key)
    if (cached !== undefined) return cached

    let disp: string
    try {
        const sym: DebugSymbol = DebugSymbol.fromAddress(addr)
        const md: Module | null = Process.findModuleByAddress(addr)
        const modName: string = md !== null ? md.name : (sym.moduleName === null ? '?' : sym.moduleName)
        const name: string | null = sym.name

        if (name !== null && name.length > 0) {
            let pretty: string = name
            if (name.indexOf('_Z') === 0) {
                try {
                    const demangled: string = demangleName(name)
                    if (demangled !== '') pretty = demangled
                } catch (e) {
                    // keep the mangled name
                }
            }
            disp = `${modName}!${pretty}`
            const delta: NativePointer | null = sym.address.isNull() ? null : addr.sub(sym.address)
            if (delta !== null && !delta.isNull()) disp += `+0x${delta.toString(16)}`
        } else {
            // No symbol: fall back to a module relative offset, or the raw address
            // when it does not belong to any module (heap / jit data pointers).
            disp = md === null ? `${addr}` : `${modName}!0x${addr.sub(md.base).toString(16)}`
        }

        if (sym.fileName !== null && sym.fileName.length > 0) {
            disp += `  (${sym.fileName}:${sym.lineNumber === null ? '?' : sym.lineNumber})`
        }
    } catch (e) {
        disp = `${addr}`
    }

    DebugSymbolCache.set(key, disp)
    return disp
}

/** Drop every cached symbol / address resolution, e.g. after a module got unloaded. */
export function clearSymbolCache(): void {
    DebugSymbolCache.clear()
    Cache.clear()
}

declare global {
    var formatSymbol: (addr: NativePointer | string | number) => string
    var clearSymbolCache: () => void
}

globalThis.formatSymbol = (addr: NativePointer | string | number): string =>
    formatSymbol(typeof addr === 'string' || typeof addr === 'number' ? ptr(addr) : addr)
globalThis.clearSymbolCache = clearSymbolCache