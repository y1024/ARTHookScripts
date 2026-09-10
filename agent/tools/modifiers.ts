// jetbrains://clion/navigate/reference?project=libart&path=~/bin/aosp/art/libdexfile/dex/modifiers.h
export class ArtModifiers {

    static kAccPublic = 0x0001;  // class, field, method, ic
    static kAccPrivate = 0x0002;  // field, method, ic
    static kAccProtected = 0x0004;  // field, method, ic
    static kAccStatic = 0x0008;  // field, method, ic
    static kAccFinal = 0x0010;  // class, field, method, ic
    static kAccSynchronized = 0x0020;  // method (only allowed on natives)
    static kAccSuper = 0x0020;  // class (not used in dex)
    static kAccVolatile = 0x0040;  // field
    static kAccBridge = 0x0040;  // method (1.5)
    static kAccTransient = 0x0080;  // field
    static kAccVarargs = 0x0080;  // method (1.5)
    static kAccNative = 0x0100;  // method
    static kAccInterface = 0x0200;  // class, ic
    static kAccAbstract = 0x0400;  // class, method, ic
    static kAccStrict = 0x0800;  // method
    static kAccSynthetic = 0x1000;  // class, field, method, ic
    static kAccAnnotation = 0x2000;  // class, ic (1.5)
    static kAccEnum = 0x4000;  // class, field, ic (1.5)

    static kAccJavaFlagsMask = 0xffff;  // bits set from Java sources (low 16)

    static kAccConstructor = 0x00010000;  // method (dex only) <(cl)init>
    static kAccDeclaredSynchronized = 0x00020000;  // method (dex only)
    static kAccClassIsProxy = 0x00040000;  // class  (dex only)
    // Set to indicate that the ArtMethod is obsolete and has a different DexCache + DexFile from its

    // declaring class. This flag may only be applied to methods.
    static kAccObsoleteMethod = 0x00040000;  // method (runtime)
    // Used by a method to denote that its execution does not need to go through slow path interpreter.
    static kAccSkipAccessChecks = 0x00080000;  // method (runtime, not native)
    // Used by a class to denote that the verifier has attempted to check it at least once.
    static kAccVerificationAttempted = 0x00080000;  // class (runtime)
    static kAccSkipHiddenapiChecks = 0x00100000;  // class (runtime)
    // This is set by the class linker during LinkInterfaceMethods. It is used by a method to represent
    // that it was copied from its declaring class into another class. All methods marked kAccMiranda
    // and kAccDefaultConflict will have this bit set. Any kAccDefault method contained in the methods_
    // array of a concrete class will also have this bit set.
    static kAccCopied = 0x00100000;  // method (runtime)

    // ...

    // Runtime only ART access flags (Android 10), everything above kAccJavaFlagsMask.
    // Several bits are overloaded: the meaning depends on the member kind and on
    // whether the method is native. Values mirror frida-java-bridge/lib/android.js.
    static kAccMiranda = 0x00200000;                       // method (runtime, not native)
    static kAccDefault = 0x00400000;                       // method (runtime)
    static kAccDefaultConflicting = 0x00800000;            // method (runtime)
    static kAccCompileDontBother = 0x02000000;             // method (runtime)
    static kAccIntrinsic = 0x04000000;                     // method (runtime)
    static kAccRuntimeOnly = 0x04000000;                   // field (runtime)
    static kAccSingleImplementation = 0x08000000;          // method (runtime)
    static kAccPublicApi = 0x10000000;                     // field, method (runtime)
    static kAccCorePlatformApi = 0x20000000;               // field, method (runtime)
    static kAccFastInterpreterToInterpreterInvoke = 0x40000000;  // method (runtime)
    static kAccPreviouslyWarm = 0x80000000;                // method (runtime)
    static kAccCriticalNative = 0x00200000;                // method (runtime, native only)
    static kAccFastNative = 0x00080000;                    // method (runtime, native only)

    /**
     * Decode the runtime only access flags, i.e. everything the JVM level
     * PrettyAccessFlags() does not cover. Returns `A|B|C`, or '' when there is none.
     */
    public static PrettyRuntimeAccessFlags = (access_flags: NativePointer | number, kind: AccessFlagKind = "method"): string => {
        const flags: number = typeof access_flags === "number" ? access_flags : access_flags.toUInt32()
        const runtime: number = (flags & ~ArtModifiers.kAccJavaFlagsMask) >>> 0
        if (runtime === 0) return ""

        const isNative: boolean = (flags & ArtModifiers.kAccNative) !== 0
        const names: string[] = []
        const add = (bit: number, name: string): void => { if ((runtime & bit) >>> 0 !== 0) names.push(name) }

        if (kind === "method") {
            add(ArtModifiers.kAccConstructor, "Constructor")
            add(ArtModifiers.kAccDeclaredSynchronized, "DeclaredSynchronized")
            add(ArtModifiers.kAccObsoleteMethod, "ObsoleteMethod")
            add(ArtModifiers.kAccCopied, "Copied")
            // 0x00080000 and 0x00200000 mean different things for native methods
            if ((runtime & ArtModifiers.kAccFastNative) !== 0) names.push(isNative ? "FastNative" : "SkipAccessChecks")
            if ((runtime & ArtModifiers.kAccCriticalNative) !== 0) names.push(isNative ? "CriticalNative" : "Miranda")
            add(ArtModifiers.kAccDefault, "Default")
            add(ArtModifiers.kAccDefaultConflicting, "DefaultConflicting")
            add(ArtModifiers.kAccCompileDontBother, "CompileDontBother")
            add(ArtModifiers.kAccIntrinsic, "Intrinsic")
            add(ArtModifiers.kAccSingleImplementation, "SingleImplementation")
            add(ArtModifiers.kAccPublicApi, "PublicApi")
            add(ArtModifiers.kAccCorePlatformApi, "CorePlatformApi")
            add(ArtModifiers.kAccFastInterpreterToInterpreterInvoke, "FastInterpToInterpInvoke")
            add(ArtModifiers.kAccPreviouslyWarm, "PreviouslyWarm")
        } else if (kind === "class") {
            add(ArtModifiers.kAccClassIsProxy, "ClassIsProxy")
            add(ArtModifiers.kAccVerificationAttempted, "VerificationAttempted")
            add(ArtModifiers.kAccSkipHiddenapiChecks, "SkipHiddenapiChecks")
        } else {
            add(ArtModifiers.kAccRuntimeOnly, "RuntimeOnly")
            add(ArtModifiers.kAccPublicApi, "PublicApi")
            add(ArtModifiers.kAccCorePlatformApi, "CorePlatformApi")
        }

        return names.join("|")
    }

    // kAccVolatile/kAccBridge share 0x0040 and kAccTransient/kAccVarargs share 0x0080,
    // kAccSynchronized/kAccSuper share 0x0020, so the member kind is required to print the right name.
    public static PrettyAccessFlags = (access_flags: NativePointer | number, kind: AccessFlagKind = "method"): string => {
        let access_flags_local: NativePointer = NULL
        if (typeof access_flags === "number") {
            access_flags_local = ptr(access_flags)
        } else {
            access_flags_local = access_flags
        }
        if (access_flags_local.isNull()) throw new Error("access_flags is null")
        const has = (flag: number): boolean => !(access_flags_local.and(flag)).isNull()
        let result: string = ""
        if (has(ArtModifiers.kAccPublic)) {
            result += "public "
        }
        if (has(ArtModifiers.kAccProtected)) {
            result += "protected "
        }
        if (has(ArtModifiers.kAccPrivate)) {
            result += "private "
        }
        if (has(ArtModifiers.kAccAbstract)) {
            result += "abstract "
        }
        if (has(ArtModifiers.kAccStatic)) {
            result += "static "
        }
        if (has(ArtModifiers.kAccFinal)) {
            result += "final "
        }
        if (has(ArtModifiers.kAccTransient)) {
            result += kind === "field" ? "transient " : (kind === "method" ? "varargs " : "")
        }
        if (has(ArtModifiers.kAccVolatile)) {
            result += kind === "field" ? "volatile " : (kind === "method" ? "bridge " : "")
        }
        if (kind === "method" && has(ArtModifiers.kAccSynchronized)) {
            result += "synchronized "
        }
        if (has(ArtModifiers.kAccNative)) {
            result += "native "
        }
        if (has(ArtModifiers.kAccStrict)) {
            result += "strictfp "
        }
        if (has(ArtModifiers.kAccSynthetic)) {
            result += "synthetic "
        }
        if (has(ArtModifiers.kAccAnnotation)) {
            result += "annotation "
        }
        if (has(ArtModifiers.kAccEnum)) {
            result += "enum "
        }
        if (has(ArtModifiers.kAccInterface)) {
            result += "interface "
        }
        if (kind === "method" && has(ArtModifiers.kAccConstructor)) {
            result += "constructor "
        }
        return result
    }
}

// Member kind used to disambiguate access flags that share the same bit.
export type AccessFlagKind = "class" | "field" | "method"

declare global {
    var PrettyAccessFlags: (access_flags: NativePointer | number, kind?: AccessFlagKind) => string
    var PrettyRuntimeAccessFlags: (access_flags: NativePointer | number, kind?: AccessFlagKind) => string
}

globalThis.PrettyAccessFlags = (access_flags: NativePointer | number, kind: AccessFlagKind = "method") => ArtModifiers.PrettyAccessFlags(access_flags, kind)
globalThis.PrettyRuntimeAccessFlags = (access_flags: NativePointer | number, kind: AccessFlagKind = "method") => ArtModifiers.PrettyRuntimeAccessFlags(access_flags, kind)

Reflect.set(globalThis, "ArtModifiers", ArtModifiers)