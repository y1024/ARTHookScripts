// One entry point for "show me the native code behind this thing".
//
//   showNativeAsm(ptr("0x7e17a26554"))
//   showNativeAsm("0x7e17a26554")
//   showNativeAsm("libfk.so!0xaa11a0")
//   showNativeAsm("libfk.so!Java_com_android_boot_MainActivity_getNativeTid")
//   showNativeAsm("Java_com_android_boot_MainActivity_getNativeTid")
//   showNativeAsm("com.android.boot.MainActivity.getNativeTid")   // java path -> JNI impl
//   showNativeAsm(pathToArtMethod("com.x.Y.z"))                   // ArtMethod -> data_
//
// The function boundary itself comes from getFunctionBoundary(): OAT header /
// ELF st_size first, PLT aware lightweight CFG as the fallback.

import { ArtMethod } from "../implements/10/art/mirror/ArtMethod"
import { formatSymbol } from "./SymHelper"
import { FunctionBoundary, ShowFunctionAsmOptions, showFunctionAsm, SymbolTableCache } from "./FunctionBoundary"

export type NativeAsmTarget = NativePointer | number | string | ArtMethod

export interface ShowNativeAsmOptions extends ShowFunctionAsmOptions {
    /** Accept `com.pkg.Class.method` and use its JNI implementation. Default true. */
    fromJavaMethod?: boolean
    /** Warn when the address is still the unresolved ART JNI lookup stub. Default true. */
    warnUnbound?: boolean
}

// Before a native method runs for the first time ArtMethod::data_ points at one of
// these libart stubs instead of the real implementation.
const UNBOUND_JNI_STUBS: string[] = [
    'art_jni_dlsym_lookup_stub',
    'art_jni_dlsym_lookup_critical_stub',
    'art_jni_dlsym_lookup_fast_stub',
    'art_quick_generic_jni_trampoline',
]

export function isUnboundJniStub(addr: NativePointer): boolean {
    let rendered: string
    try {
        rendered = formatSymbol(addr)
    } catch (e) {
        return false
    }
    return UNBOUND_JNI_STUBS.some((stub: string) => rendered.indexOf(stub) !== -1)
}

/**
 * Turn any of the accepted target forms into a concrete code address.
 */
export function resolveNativeAddress(target: NativeAsmTarget, options: ShowNativeAsmOptions = {}): NativePointer {
    if (target === null || target === undefined) throw new Error('resolveNativeAddress: target is null')

    if (typeof target === 'number') return ptr(target)
    if (target instanceof NativePointer) return target

    // ArtMethod, or anything else exposing `handle` + `data`
    if (typeof target === 'object') {
        const candidate = target as any
        if (candidate.handle !== undefined && candidate.data !== undefined) {
            const data: NativePointer = candidate.data
            if (data === null || data === undefined || data.isNull()) {
                throw new Error(`resolveNativeAddress: ArtMethod ${candidate.handle} has no native implementation (data is null)`)
            }
            return data
        }
        throw new Error(`resolveNativeAddress: unsupported object ${target}`)
    }

    if (typeof target !== 'string') throw new Error(`resolveNativeAddress: unsupported target ${target}`)

    const spec: string = target.trim()
    if (spec.length === 0) throw new Error('resolveNativeAddress: empty target')

    // "libxx.so!0xOFFSET" | "libxx.so!symbolName"
    const bang: number = spec.indexOf('!')
    if (bang > 0) {
        const moduleName: string = spec.slice(0, bang)
        const rest: string = spec.slice(bang + 1).trim()
        const md = Process.findModuleByName(moduleName)
        if (md === null) throw new Error(`resolveNativeAddress: module '${moduleName}' is not loaded`)
        if (/^0x[0-9a-fA-F]+$/.test(rest)) return md.base.add(ptr(rest))
        if (/^[0-9a-fA-F]{6,16}$/.test(rest)) return md.base.add(ptr(`0x${rest}`))
        const exported = md.findExportByName(rest)
        if (exported !== null) return exported
        const byName = SymbolTableCache.findByName(moduleName, rest, true)
        if (byName !== null) {
            LOGZ(`resolveNativeAddress: '${rest}' matched symbol ${byName.name}`)
            return byName.address
        }
        throw new Error(`resolveNativeAddress: symbol '${rest}' not found in ${moduleName}`)
    }

    // "0xADDRESS" | bare hex
    if (/^0x[0-9a-fA-F]+$/.test(spec)) return ptr(spec)
    if (/^[0-9a-fA-F]{8,16}$/.test(spec)) return ptr(`0x${spec}`)

    // exported symbol from any loaded module
    const globalExport = Module.findExportByName(null, spec)
    if (globalExport !== null) return globalExport

    // "com.pkg.Class.method" -> ArtMethod::data_
    if (options.fromJavaMethod !== false && spec.indexOf('.') > 0) {
        let method: ArtMethod | null = null
        try {
            method = pathToArtMethod(spec)
        } catch (e) {
            method = null
        }
        if (method !== null && method !== undefined) {
            const data: NativePointer = method.data
            if (data.isNull()) {
                throw new Error(`resolveNativeAddress: ${spec} has no native implementation (data is null)`)
            }
            return data
        }
    }

    // last resort: any function carrying that name
    try {
        const named = DebugSymbol.findFunctionsNamed(spec)
        if (named.length > 0) return named[0]
    } catch (e) {
        // ignore
    }

    throw new Error(`resolveNativeAddress: cannot resolve '${spec}' to an address`)
}

/**
 * Disassemble the native function behind `target`, boundary included.
 */
export function showNativeAsm(target: NativeAsmTarget, options: ShowNativeAsmOptions = {}): FunctionBoundary {
    const addr: NativePointer = resolveNativeAddress(target, options)

    if (options.warnUnbound !== false && isUnboundJniStub(addr)) {
        newLine()
        LOGW(`⚠ ${addr} -> ${formatSymbol(addr)}`)
        LOGW(`  This is an ART JNI lookup stub, the real native implementation is not registered yet.`)
        LOGW(`  Call the java method once (or hook RegisterNatives) and try again.`)
    }

    const label: string = typeof target === 'string' ? `${target} -> ` : ''
    LOGD(`👉 ${label}${addr} | ${formatSymbol(addr)}`)

    return showFunctionAsm(addr, options)
}

declare global {
    /** Disassemble a native function: ptr / "0x.." / "lib.so!0x.." / "lib.so!sym" / java method path / ArtMethod. */
    var showNativeAsm: (target: NativeAsmTarget, options?: ShowNativeAsmOptions) => FunctionBoundary
    var resolveNativeAddress: (target: NativeAsmTarget, options?: ShowNativeAsmOptions) => NativePointer
    var isUnboundJniStub: (addr: NativePointer) => boolean
}

globalThis.showNativeAsm = showNativeAsm
globalThis.resolveNativeAddress = resolveNativeAddress
globalThis.isUnboundJniStub = isUnboundJniStub
