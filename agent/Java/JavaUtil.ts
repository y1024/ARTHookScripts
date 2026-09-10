import { ArtMethod } from "../android/implements/10/art/mirror/ArtMethod"
import { ArtModifiers } from "../tools/modifiers"

// 记录一下当前遍历出来的class便于直接使用index选择
const arrayCurrentClassItems: string[] = []

interface JavaMembers {
    methods: Java.Method[]
    fields: Java.Field[]
    fields_name: string[]
}

/** `I` -> `int`, `Ljava/lang/String;` -> `java.lang.String`, `[I` -> `int[]` */
export function prettyTypeDescriptor(desc: string): string {
    if (desc === null || desc === undefined || desc.length === 0) return '?'
    let dims: number = 0
    let i: number = 0
    while (i < desc.length && desc.charAt(i) === '[') { dims++; i++ }
    const body: string = desc.slice(i)
    let base: string
    switch (body.charAt(0)) {
        case 'V': base = 'void'; break
        case 'Z': base = 'boolean'; break
        case 'B': base = 'byte'; break
        case 'S': base = 'short'; break
        case 'C': base = 'char'; break
        case 'I': base = 'int'; break
        case 'J': base = 'long'; break
        case 'F': base = 'float'; break
        case 'D': base = 'double'; break
        case 'L':
            base = (body.endsWith(';') ? body.slice(1, body.length - 1) : body.slice(1)).replace(/\//g, '.')
            break
        default: base = body
    }
    let suffix: string = ''
    for (let d = 0; d < dims; d++) suffix += '[]'
    return base + suffix
}

/** Accept both the raw descriptor string and frida-java-bridge's type object. */
function prettyFieldType(rt: any): string {
    if (rt === null || rt === undefined) return '?'
    if (typeof rt === 'string') return prettyTypeDescriptor(rt)
    if (typeof rt === 'object') {
        if (typeof rt.className === 'string' && rt.className.length > 0) return rt.className
        if (typeof rt.name === 'string' && rt.name.length > 0) return prettyTypeDescriptor(rt.name)
    }
    return `${rt}`
}

/** Never dump a Java wrapper through JSON.stringify, that leaks the internal `_p` array. */
function prettyFieldValue(value: any): string {
    if (value === null || value === undefined) return 'null'
    const t: string = typeof value
    if (t === 'string') return `"${value}"`
    if (t === 'number' || t === 'boolean') return `${value}`
    try {
        const s: string = `${value}`
        if (s !== '[object Object]') return s
    } catch (e) {
        // fall through
    }
    try {
        return JSON.stringify(value)
    } catch (e) {
        return `${value}`
    }
}

/**
 * Render one field as `<flags> <type> <name> = <value>` for statics and
 * `<flags> <type> <name>` for instance fields, followed by the object layout
 * offset and the ArtField pointer so it can be fed to the native helpers.
 */
export function describeJavaField(field: Java.Field, name: string): string {
    // frida-java-bridge Java.Field internals:
    // _p[0] holder | _p[1] fieldType (1 = static) | _p[2] fieldReturnType
    // _p[3] ArtField pointer | _p[4] getValue | _p[5] setValue
    const p: any = (field as any)._p
    let isStatic: boolean = false
    let artField: NativePointer | null = null
    let typeName: string = '?'

    if (Array.isArray(p)) {
        isStatic = p[1] === 1
        try { artField = ptr(p[3]) } catch (e) { artField = null }
        typeName = prettyFieldType(p[2])
    }
    if (typeName === '?') {
        try { typeName = prettyFieldType((field as any).fieldReturnType) } catch (e) { /* keep '?' */ }
    }

    let flags: string = ''
    let offsetInfo: string = ''
    if (artField !== null) {
        try {
            const spec = getArtFieldSpec(artField)
            flags = PrettyAccessFlags(spec.accessFlags, "field")
            const runtime: string = ArtModifiers.PrettyRuntimeAccessFlags(spec.accessFlags, "field")
            if (runtime !== '') flags += `[${runtime}]`
            if (flags.length > 0) flags += ' '
            offsetInfo = `${isStatic ? 'statics offset' : 'field offset'} 0x${spec.offset.toString(16)}`
        } catch (e) {
            // ArtField layout mismatch, still print what we have
        }
    }

    let disp: string = `${flags}${typeName} ${name}`
    if (isStatic) {
        let value: string
        try { value = prettyFieldValue(field.value) } catch (e) { value = '<unreadable>' }
        disp += ` = ${value}`
    }

    const meta: string[] = []
    if (offsetInfo !== '') meta.push(offsetInfo)
    if (artField !== null) meta.push(`ArtField ${artField}`)
    if (meta.length > 0) disp += `   // ${meta.join(' | ')}`
    return disp
}

var loaders = []
export function getJavaMembersFromClass(className: string = "com.unity3d.player.UnityPlayer"): JavaMembers {

    const ar_methods: Java.Method[] = []
    const ar_fields: Java.Field[] = []
    const ar_fields_name: string[] = []

    if (loaders.length == 0) {
        Java.enumerateClassLoaders({
            onMatch: function (loader) {
                loaders.push(loader)
            },
            onComplete: function () {
            }
        })
    }

    const testUseOtherClassLoader = (className: string) => {
        let retCls = null
        loaders.forEach((loader) => {
            try {
                let clz = loader.findClass(className)
                if (clz != null) retCls = cls
            } catch (error) {
                // console.log(error)
            }
        })
        return retCls
    }

    Java.perform(() => {
        let clazz: Java.Wrapper
        try {
            clazz = Java.use(className)
        } catch {
            clazz = testUseOtherClassLoader(className)
        }

        try {
            clazz.$ownMembers.forEach((name: string) => {
                try {
                    // fields
                    if (Object.getOwnPropertyNames(clazz[name]).includes("_p")) {
                        const field: Java.Field = clazz[name]
                        ar_fields.push(field)
                        ar_fields_name.push(name)
                    }
                    // methods
                    else {
                        const method: Java.Method[] = clazz[name].overloads
                        ar_methods.push(...method)
                    }
                } catch (error) {
                    // LOGE(error)
                }
            })
        } catch (error) {
            // LOGE(error)
        }
    })
    return { "methods": ar_methods, "fields": ar_fields, "fields_name": ar_fields_name }
}

globalThis.filterJavaMethods = (methodNameFilter: string, className: string | number | undefined) => {
    if (methodNameFilter == undefined || methodNameFilter == "") throw new Error("methodNameFilter can't be empty")
    className = checkNumParam(className)
    let index: number = 0
    if (className == undefined) {
        try {
            (enumClassesList(true) as Array<string>).forEach((className: string) => printMethod(className))
        } catch (error) {
            // LOGE(error)
        }
    } else {
        printMethod(className)
    }

    function printMethod(className: string) {
        const members: JavaMembers = getJavaMembersFromClass(className)
        try {
            members.methods.forEach((method: Java.Method) => {
                if (method.methodName.includes(methodNameFilter)) {
                    const artMethod: ArtMethod = new ArtMethod(method.handle)
                    LOGD(`\n\t[${++index}] ${artMethod.methodName}`)
                }
            })
        } catch (e) {
            LOGE(e)
        }
    }
}

const checkNumParam = (className: string | number): string => {
    if (typeof className === "number") {
        if (className >= arrayCurrentClassItems.length)
            throw new Error(`index out of range, current length is ${arrayCurrentClassItems.length}`)
        return arrayCurrentClassItems[className]
    }
    return className
}

globalThis.listJavaMethods = (className: string | number = "com.unity3d.player.UnityPlayer", simple: boolean = false, showSmali: boolean = false) => {
    let countFields: number = 0
    let countMethods: number = 0

    className = checkNumParam(className)

    const members: JavaMembers = getJavaMembersFromClass(className)
    LOGD(`\n\n${className}`)

    try {
        LOGD(`\n[*] Fields :`)
        members.fields.forEach((field: Java.Field, index: number) => {
            const currentIndex = ++countFields
            LOGD(`\n\t[${currentIndex}] ${describeJavaField(field, members.fields_name[index])}`)
        })
        newLine()
    } catch (e) {
        LOGE(e)
    }

    try {
        LOGD(`\n[*] Methods :`)
        members.methods.forEach((method: Java.Method) => {
            const artMethod: ArtMethod = new ArtMethod(method.handle)
            if (simple) {
                LOGD(`\n\t[${++countMethods}] ${artMethod.methodName}`)
            } else {
                const disp: string = artMethod.toString().split('\n').map((item, index) => index == 0 ? item : `\n\t${item}`).join('')
                LOGD(`\n\t[${++countMethods}] ${disp}`)
            }
            if (showSmali) artMethod.showSmali()
        })
        newLine()
    } catch (e) {
        LOGE(e)
    }
}

globalThis.m = globalThis.listJavaMethods

// current classloader
globalThis.enumClassesList = (ret: boolean = false) => {
    let countClasses: number = -1
    let retArray = []
    if (!ret) newLine()
    arrayCurrentClassItems.splice(0, arrayCurrentClassItems.length)
    Java.enumerateLoadedClasses({
        onMatch: function (className) {
            arrayCurrentClassItems.push(className)
            retArray.push(className)
            if (!ret) LOGD(`[${++countClasses}] ${className}`)
        },
        onComplete: function () {
        }
    })
    if (ret) return retArray
    LOGZ(`\nTotal classes: ${countClasses + 1}\n`)
}

// findJavaClasses("display",true)
globalThis.findJavaClasses = (keyword: string, depSearch: boolean = false, searchInstance = true): void => {
    let countClasses: number = -1
    newLine()
    arrayCurrentClassItems.splice(0, arrayCurrentClassItems.length)
    if (depSearch) {
        Java.enumerateClassLoaders({
            onMatch: function (loader) {
                enumClassesInner(loader)
            },
            onComplete: function () {
                // todo nothing
            }
        })
    } else {
        enumClassesInner(Java.classFactory.loader)
    }

    // enum all classloader
    function enumClassesInner(loader: Java.Wrapper) {
        (Java.classFactory as any).loader = loader
        LOGW(`Using loader: ${(Java.classFactory as any).loader}`)
        Java.enumerateLoadedClasses({
            onMatch: function (className) {
                if (className.includes(keyword)) {
                    arrayCurrentClassItems.push(className)
                    LOGD(`[${++countClasses}] ${className}`)
                    if (searchInstance) {
                        const instances: any[] | void = chooseClasses(countClasses, true)
                        let instanceCount = -1
                        if (instances != undefined && (instances as any[]).length > 0) {
                            LOGZ(`\t[${++instanceCount}] ${instances[0]}}]`)
                        }
                    }
                }
            },
            onComplete: function () {
                LOGZ(`\nTotal classes: ${countClasses + 1}\n`)
            }
        })
    }
}

globalThis.chooseClasses = (className: string | number, retArray: boolean = false) => {
    let classNameLocal: string = checkNumParam(className)
    let countClasses: number = -1
    let ret: any[] = []
    Java.perform(() => {
        try {
            Java.choose(classNameLocal, {
                onMatch: function (instance) {
                    if (retArray) {
                        ret.push(instance)
                    } else {
                        LOGD(`[${++countClasses}] ${instance}`)
                    }
                },
                onComplete: function () {
                    if (!retArray) LOGZ(`\nTotal instance: ${countClasses + 1}\n`)
                }
            })
        } catch (error) {
            // LOGE(error)
        }
    })
    if (retArray) return ret
}

globalThis.listFieldsInstance = (className: string | number, hex?:string) => {
    let classNameLocal: string = checkNumParam(className)
    let countFields: number = -1
    newLine()
    Java.perform(() => {
        try {
            Java.choose(classNameLocal, {
                onMatch: function (instance) {
                    if (hex != undefined &&  hex.includes("0x") && `${instance}`.includes(hex)) {
                        LOGD(`\n[${++countFields}] ${instance}`)
                        let index = 0
                        for (let field in instance) {
                            if (`${instance[field]}`.includes("Java.Field"))
                            LOGD(`[${++index}] ${field} : ${instance[field]}`)
                        }
                        return "stop"
                    } else {
                        LOGD(`\n[${++countFields}] ${instance}`)
                        let index = 0
                        for (let field in instance) {
                            if (`${instance[field]}`.includes("Java.Field"))
                            LOGD(`[${++index}] ${field} : ${instance[field]}`)
                        }
                    }
                },
                onComplete: function () {
                    LOGZ(`\nTotal instance: ${countFields + 1}\n`)
                }
            })
        }catch (error) {
            // LOGE(error)
        }
    })
}

globalThis.lfs = globalThis.listFieldsInstance

declare global {
    var listJavaMethods: (className: string | number, simple?: boolean, showSmali?: boolean) => void
    var m: (className: string | number) => void // alias of listJavaMethods
    var enumClassesList: (ret?: boolean) => void | Array<string>
    var findJavaClasses: (keyword: string, depSearch?: boolean, searchInstance?: boolean) => void
    var chooseClasses: (className: string | number, retArray?: boolean) => void | any[]
    var filterJavaMethods: (methodNameFilter: string, className: string | number | undefined) => void
    var listFieldsInstance: (className: string | number) => void
    var lfs : (className: string | number) => void // alias of listFieldsInstance
    /** `I` -> `int`, `Ljava/lang/String;` -> `java.lang.String`, `[I` -> `int[]` */
    var prettyTypeDescriptor: (desc: string) => string
    /** One line `<flags> <type> <name> = <value> // offset | ArtField` rendering. */
    var describeJavaField: (field: Java.Field, name: string) => string
}

globalThis.prettyTypeDescriptor = prettyTypeDescriptor
globalThis.describeJavaField = describeJavaField