(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function t() {
  let t = null;
  return Java.perform((function() {
    t = Java.use("android.app.ActivityThread").currentApplication();
  })), t;
}

function e() {
  let t = "";
  return Java.perform((function() {
    let e = Java.use("android.app.ActivityThread").currentApplication();
    t = e.getApplicationContext().getPackageName();
  })), t;
}

function a() {
  let t = "";
  return Java.perform((function() {
    let e = Java.use("android.app.ActivityThread").currentApplication();
    t = e.getApplicationContext().getCacheDir().getPath();
  })), t;
}

function i() {
  let t = "";
  return Java.perform((function() {
    let e = Java.use("android.app.ActivityThread").currentApplication();
    t = e.getApplicationContext().getFilesDir().getPath();
  })), t;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), globalThis.getApplication = t, globalThis.getPackageName = e, globalThis.getCacheDir = a, 
globalThis.getFilesDir = i;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.getJavaMembersFromClass = exports.describeJavaField = exports.prettyTypeDescriptor = void 0;

const e = require("../android/implements/10/art/mirror/ArtMethod"), t = require("../tools/modifiers"), n = [];

function s(e) {
  if (null == e || 0 === e.length) return "?";
  let t = 0, n = 0;
  for (;n < e.length && "[" === e.charAt(n); ) t++, n++;
  const s = e.slice(n);
  let a;
  switch (s.charAt(0)) {
   case "V":
    a = "void";
    break;

   case "Z":
    a = "boolean";
    break;

   case "B":
    a = "byte";
    break;

   case "S":
    a = "short";
    break;

   case "C":
    a = "char";
    break;

   case "I":
    a = "int";
    break;

   case "J":
    a = "long";
    break;

   case "F":
    a = "float";
    break;

   case "D":
    a = "double";
    break;

   case "L":
    a = (s.endsWith(";") ? s.slice(1, s.length - 1) : s.slice(1)).replace(/\//g, ".");
    break;

   default:
    a = s;
  }
  let l = "";
  for (let e = 0; e < t; e++) l += "[]";
  return a + l;
}

function a(e) {
  if (null == e) return "?";
  if ("string" == typeof e) return s(e);
  if ("object" == typeof e) {
    if ("string" == typeof e.className && e.className.length > 0) return e.className;
    if ("string" == typeof e.name && e.name.length > 0) return s(e.name);
  }
  return `${e}`;
}

function l(e) {
  if (null == e) return "null";
  const t = typeof e;
  if ("string" === t) return `"${e}"`;
  if ("number" === t || "boolean" === t) return `${e}`;
  try {
    const t = `${e}`;
    if ("[object Object]" !== t) return t;
  } catch (e) {}
  try {
    return JSON.stringify(e);
  } catch (t) {
    return `${e}`;
  }
}

function r(e, n) {
  const s = e._p;
  let r = !1, o = null, c = "?";
  if (Array.isArray(s)) {
    r = 1 === s[1];
    try {
      o = ptr(s[3]);
    } catch (e) {
      o = null;
    }
    c = a(s[2]);
  }
  if ("?" === c) try {
    c = a(e.fieldReturnType);
  } catch (e) {}
  let i = "", u = "";
  if (null !== o) try {
    const e = getArtFieldSpec(o);
    i = PrettyAccessFlags(e.accessFlags, "field");
    const n = t.ArtModifiers.PrettyRuntimeAccessFlags(e.accessFlags, "field");
    "" !== n && (i += `[${n}]`), i.length > 0 && (i += " "), u = `${r ? "statics offset" : "field offset"} 0x${e.offset.toString(16)}`;
  } catch (e) {}
  let h = `${i}${c} ${n}`;
  if (r) {
    let t;
    try {
      t = l(e.value);
    } catch (e) {
      t = "<unreadable>";
    }
    h += ` = ${t}`;
  }
  const f = [];
  return "" !== u && f.push(u), null !== o && f.push(`ArtField ${o}`), f.length > 0 && (h += `   // ${f.join(" | ")}`), 
  h;
}

exports.prettyTypeDescriptor = s, exports.describeJavaField = r;

var o = [];

function c(e = "com.unity3d.player.UnityPlayer") {
  const t = [], n = [], s = [];
  0 == o.length && Java.enumerateClassLoaders({
    onMatch: function(e) {
      o.push(e);
    },
    onComplete: function() {}
  });
  return Java.perform((() => {
    let a;
    try {
      a = Java.use(e);
    } catch {
      a = (e => {
        let t = null;
        return o.forEach((n => {
          try {
            null != n.findClass(e) && (t = cls);
          } catch (e) {}
        })), t;
      })(e);
    }
    try {
      a.$ownMembers.forEach((e => {
        try {
          if (Object.getOwnPropertyNames(a[e]).includes("_p")) {
            const t = a[e];
            n.push(t), s.push(e);
          } else {
            const n = a[e].overloads;
            t.push(...n);
          }
        } catch (e) {}
      }));
    } catch (e) {}
  })), {
    methods: t,
    fields: n,
    fields_name: s
  };
}

exports.getJavaMembersFromClass = c, globalThis.filterJavaMethods = (t, n) => {
  if (null == t || "" == t) throw new Error("methodNameFilter can't be empty");
  n = i(n);
  let s = 0;
  if (null == n) try {
    enumClassesList(!0).forEach((e => a(e)));
  } catch (e) {} else a(n);
  function a(n) {
    const a = c(n);
    try {
      a.methods.forEach((n => {
        if (n.methodName.includes(t)) {
          const t = new e.ArtMethod(n.handle);
          LOGD(`\n\t[${++s}] ${t.methodName}`);
        }
      }));
    } catch (e) {
      LOGE(e);
    }
  }
};

const i = e => {
  if ("number" == typeof e) {
    if (e >= n.length) throw new Error(`index out of range, current length is ${n.length}`);
    return n[e];
  }
  return e;
};

globalThis.listJavaMethods = (t = "com.unity3d.player.UnityPlayer", n = !1, s = !1) => {
  let a = 0, l = 0;
  const o = c(t = i(t));
  LOGD(`\n\n${t}`);
  try {
    LOGD("\n[*] Fields :"), o.fields.forEach(((e, t) => {
      const n = ++a;
      LOGD(`\n\t[${n}] ${r(e, o.fields_name[t])}`);
    })), newLine();
  } catch (e) {
    LOGE(e);
  }
  try {
    LOGD("\n[*] Methods :"), o.methods.forEach((t => {
      const a = new e.ArtMethod(t.handle);
      if (n) LOGD(`\n\t[${++l}] ${a.methodName}`); else {
        const e = a.toString().split("\n").map(((e, t) => 0 == t ? e : `\n\t${e}`)).join("");
        LOGD(`\n\t[${++l}] ${e}`);
      }
      s && a.showSmali();
    })), newLine();
  } catch (e) {
    LOGE(e);
  }
}, globalThis.m = globalThis.listJavaMethods, globalThis.enumClassesList = (e = !1) => {
  let t = -1, s = [];
  if (e || newLine(), n.splice(0, n.length), Java.enumerateLoadedClasses({
    onMatch: function(a) {
      n.push(a), s.push(a), e || LOGD(`[${++t}] ${a}`);
    },
    onComplete: function() {}
  }), e) return s;
  LOGZ(`\nTotal classes: ${t + 1}\n`);
}, globalThis.findJavaClasses = (e, t = !1, s = !0) => {
  let a = -1;
  function l(t) {
    Java.classFactory.loader = t, LOGW(`Using loader: ${Java.classFactory.loader}`), 
    Java.enumerateLoadedClasses({
      onMatch: function(t) {
        if (t.includes(e) && (n.push(t), LOGD(`[${++a}] ${t}`), s)) {
          const e = chooseClasses(a, !0);
          let t = -1;
          null != e && e.length > 0 && LOGZ(`\t[${++t}] ${e[0]}}]`);
        }
      },
      onComplete: function() {
        LOGZ(`\nTotal classes: ${a + 1}\n`);
      }
    });
  }
  newLine(), n.splice(0, n.length), t ? Java.enumerateClassLoaders({
    onMatch: function(e) {
      l(e);
    },
    onComplete: function() {}
  }) : l(Java.classFactory.loader);
}, globalThis.chooseClasses = (e, t = !1) => {
  let n = i(e), s = -1, a = [];
  if (Java.perform((() => {
    try {
      Java.choose(n, {
        onMatch: function(e) {
          t ? a.push(e) : LOGD(`[${++s}] ${e}`);
        },
        onComplete: function() {
          t || LOGZ(`\nTotal instance: ${s + 1}\n`);
        }
      });
    } catch (e) {}
  })), t) return a;
}, globalThis.listFieldsInstance = (e, t) => {
  let n = i(e), s = -1;
  newLine(), Java.perform((() => {
    try {
      Java.choose(n, {
        onMatch: function(e) {
          if (null != t && t.includes("0x") && `${e}`.includes(t)) {
            LOGD(`\n[${++s}] ${e}`);
            let t = 0;
            for (let n in e) `${e[n]}`.includes("Java.Field") && LOGD(`[${++t}] ${n} : ${e[n]}`);
            return "stop";
          }
          {
            LOGD(`\n[${++s}] ${e}`);
            let t = 0;
            for (let n in e) `${e[n]}`.includes("Java.Field") && LOGD(`[${++t}] ${n} : ${e[n]}`);
          }
        },
        onComplete: function() {
          LOGZ(`\nTotal instance: ${s + 1}\n`);
        }
      });
    } catch (e) {}
  }));
}, globalThis.lfs = globalThis.listFieldsInstance, globalThis.prettyTypeDescriptor = s, 
globalThis.describeJavaField = r;

},{"../android/implements/10/art/mirror/ArtMethod":86,"../tools/modifiers":119}],3:[function(require,module,exports){
"use strict";

var S;

function e(S) {
  return getValueFromStatus("Name", S);
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.SIGNAL = void 0, function(S) {
  S[S.SIGHUP = 1] = "SIGHUP", S[S.SIGINT = 2] = "SIGINT", S[S.SIGQUIT = 3] = "SIGQUIT", 
  S[S.SIGILL = 4] = "SIGILL", S[S.SIGTRAP = 5] = "SIGTRAP", S[S.SIGABRT = 6] = "SIGABRT", 
  S[S.SIGIOT = 6] = "SIGIOT", S[S.SIGBUS = 7] = "SIGBUS", S[S.SIGFPE = 8] = "SIGFPE", 
  S[S.SIGKILL = 9] = "SIGKILL", S[S.SIGUSR1 = 10] = "SIGUSR1", S[S.SIGSEGV = 11] = "SIGSEGV", 
  S[S.SIGUSR2 = 12] = "SIGUSR2", S[S.SIGPIPE = 13] = "SIGPIPE", S[S.SIGALRM = 14] = "SIGALRM", 
  S[S.SIGTERM = 15] = "SIGTERM", S[S.SIGSTKFLT = 16] = "SIGSTKFLT", S[S.SIGCHLD = 17] = "SIGCHLD", 
  S[S.SIGCONT = 18] = "SIGCONT", S[S.SIGSTOP = 19] = "SIGSTOP", S[S.SIGTSTP = 20] = "SIGTSTP", 
  S[S.SIGTTIN = 21] = "SIGTTIN", S[S.SIGTTOU = 22] = "SIGTTOU", S[S.SIGURG = 23] = "SIGURG", 
  S[S.SIGXCPU = 24] = "SIGXCPU", S[S.SIGXFSZ = 25] = "SIGXFSZ", S[S.SIGVTALRM = 26] = "SIGVTALRM", 
  S[S.SIGPROF = 27] = "SIGPROF", S[S.SIGWINCH = 28] = "SIGWINCH", S[S.SIGIO = 29] = "SIGIO", 
  S[S.SIGPOLL = 29] = "SIGPOLL", S[S.SIGPWR = 30] = "SIGPWR", S[S.SIGSYS = 31] = "SIGSYS", 
  S[S.SIGUNUSED = 31] = "SIGUNUSED", S[S.__SIGRTMIN = 32] = "__SIGRTMIN";
}(S = exports.SIGNAL || (exports.SIGNAL = {})), globalThis.readProcStatus = S => {
  const e = `/proc/${null == S ? "self" : S}/status`, I = new NativeFunction(Module.findExportByName("libc.so", "fopen"), "pointer", [ "pointer", "pointer" ])(Memory.allocUtf8String(e), Memory.allocUtf8String("r")), t = new NativeFunction(Module.findExportByName("libc.so", "fread"), "int", [ "pointer", "size_t", "size_t", "pointer" ]), r = Memory.alloc(4096);
  t(r, 1, 4096, I), new NativeFunction(Module.findExportByName("libc.so", "fclose"), "int", [ "pointer" ])(I);
  return r.readCString();
}, globalThis.readProcTasks = () => {
  const S = "/proc/self/task", e = new NativeFunction(Module.findExportByName("libc.so", "opendir"), "pointer", [ "pointer" ]), I = new NativeFunction(Module.findExportByName("libc.so", "readdir"), "pointer", [ "pointer" ]), t = e(Memory.allocUtf8String(S));
  if (t.isNull()) return console.error("Failed to open directory:", S), [];
  const r = [];
  try {
    let S = I(t);
    for (;!S.isNull(); ) {
      const e = S.readCString();
      "." !== e && ".." !== e && r.push(e), S = I(t);
    }
  } finally {
    t.writePointer(NULL);
  }
  return r;
}, globalThis.getValueFromStatus = (S, e) => {
  let I = readProcStatus(e), t = new RegExp(S + ".*", "g"), r = I.match(t);
  return null == r ? "unknown" : r[0].split(":")[1].trim();
}, globalThis.currentThreadName = () => e(Process.getCurrentThreadId()).toString(), 
globalThis.listThreads = (S = 20) => {
  let I = 0, t = Process.getCurrentThreadId();
  Process.enumerateThreads().sort(((S, e) => e.id - S.id)).slice(0, S).forEach((S => {
    let r = `${`[${++I}]`.padEnd(6, " ")} ${S.id} ${S.state} | ${e(S.id)}`;
    t == S.id ? LOGE(r) : LOGD(r);
  }));
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.hookJavaLoadLibrary = void 0;

const a = () => {
  Java.perform((() => {
    Java.use("java.lang.System").loadLibrary.implementation = function(a) {
      console.log("Loading library:" + a);
      return this.loadLibrary(a);
    };
  }));
};

exports.hookJavaLoadLibrary = a;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./hook_LoadLibrary");

},{"./hook_LoadLibrary":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./JavaUtil"), require("./Context"), require("./Theads"), require("./hooks/include");

},{"./Context":1,"./JavaUtil":2,"./Theads":3,"./hooks/include":5}],7:[function(require,module,exports){

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./mirror/include"), require("./SizeOfClass");

},{"./SizeOfClass":7,"./mirror/include":11}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HeapReference = void 0;

const e = require("../../../JSHandle");

class t extends e.JSHandle {
  static Size=4;
  _factory;
  constructor(e, t) {
    super(t.readU32()), this._factory = e;
  }
  static fromRef(e, r) {
    return new t(e, r);
  }
  get root() {
    return this._factory(this.handle);
  }
  toString() {
    return `HeapReference<${this.handle}> [U32]`;
  }
}

exports.HeapReference = t;

},{"../../../JSHandle":13}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./HeapReference"), require("./IArtMethod");

},{"./HeapReference":9,"./IArtMethod":10}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./art/include");

},{"./art/include":8}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.JSHandle = exports.JSHandleNotImpl = void 0;

class e {
  handle;
  constructor(e) {
    this.handle = "number" == typeof e ? ptr(e) : e;
  }
  toString() {
    return `JSHandle< ${this.handle} >`;
  }
  show() {
    LOGD(this.toString());
  }
}

exports.JSHandleNotImpl = e;

class t extends e {
  get CurrentHandle() {
    return this.handle;
  }
  get SizeOfClass() {
    return 0;
  }
  get VirtualClassOffset() {
    return 0;
  }
  get VirtualTableList() {
    if (this.VirtualClassOffset === Process.pointerSize) {
      const e = this.handle.readPointer(), t = [];
      let r = 0;
      for (;;) {
        const s = e.add(r * Process.pointerSize).readPointer();
        if (s.isNull()) break;
        t.push(s), r++;
      }
      return t;
    }
    return [];
  }
  VirtualTablePrint() {
    this.VirtualTableList.map(((e, t) => `[${t}] ${e}`)).forEach(LOGD);
  }
  toString() {
    return `JSHandle< ${this.handle} >`;
  }
}

exports.JSHandle = t, globalThis.setExp = (e = (e => (LOGE(`\nCatch Exception:\nTYPE:${e.type} | NCONTEXT: ${e.nativeContext} | ADDRESS: ${e.address} { ${DebugSymbol.fromAddress(e.address)} }`), 
PrintStackTraceNative(e.context, "", !1, !0), !0))) => {
  Process.setExceptionHandler((t => !e(t)));
};

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ArtObject = void 0;

const e = require("./Interface/art/mirror/HeapReference"), t = require("../tools/StdString"), r = require("./Utils/SymHelper"), n = require("./JSHandle");

class i extends n.JSHandle {}

class s extends n.JSHandle {
  klass_=this.handle;
  monitor_=this.klass_.add(4);
  constructor(e) {
    super(e);
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass);
  }
  get SizeOfClass() {
    return super.SizeOfClass + 8;
  }
  get klass() {
    return new e.HeapReference((e => new ArtClass(e)), ptr(this.klass_.readU32()));
  }
  get monitor() {
    return this.monitor_.readU32();
  }
  simpleDisp() {
    if (this.handle.isNull()) return `ArtObject<${this.handle}>`;
    const e = this.PrettyTypeOf();
    return `ArtObject<${this.handle}> <- ${e}`;
  }
  toString() {
    let e = `ArtObject< ${this.handle} >`;
    return this.handle.isNull(), e;
  }
  sizeInCodeUnitsComplexOpcode() {
    return (0, r.callSym)("_ZNK3art11Instruction28SizeInCodeUnitsComplexOpcodeEv", "libdexfile.so", [ "pointer" ], [ "pointer" ], this.handle);
  }
  static PrettyTypeOf(e) {
    return t.StdString.fromPointers((0, r.callSym)("_ZN3art6mirror6Object12PrettyTypeOfENS_6ObjPtrIS1_EE", "libart.so", [ "pointer", "pointer", "pointer" ], [ "pointer" ], e.handle)).toString();
  }
  PrettyTypeOf() {
    try {
      return t.StdString.fromPointers((0, r.callSym)("_ZN3art6mirror6Object12PrettyTypeOfEv", "libart.so", [ "pointer", "pointer", "pointer" ], [ "pointer" ], this.handle)).toString();
    } catch (e) {
      return "ERROR -> PrettyTypeOf";
    }
  }
  static CopyObject(e, t, n) {
    return new s((0, r.callSym)("_ZN3art6mirror6Object10CopyObjectENS_6ObjPtrIS1_EES3_m", "libart.so", [ "pointer" ], [ "pointer", "pointer", "int" ], e.handle, t.handle, n));
  }
  Clone(e) {
    return new s((0, r.callSym)("_ZN3art6mirror6Object5CloneEPNS_6ThreadE", "libart.so", [ "pointer" ], [ "pointer", "pointer" ], this.handle, e.handle));
  }
  FindFieldByOffset(e) {
    return new i((0, r.callSym)("_ZN3art6mirror6Object17FindFieldByOffsetENS_12MemberOffsetE", "libart.so", [ "pointer" ], [ "pointer", "int" ], this.handle, e));
  }
  static GenerateIdentityHashCode() {
    return (0, r.callSym)("_ZN3art6mirror6Object24GenerateIdentityHashCodeEv", "libart.so", [ "int" ], []);
  }
}

exports.ArtObject = s, globalThis.ArtObject = s;

},{"../tools/StdString":110,"./Interface/art/mirror/HeapReference":9,"./JSHandle":13,"./Utils/SymHelper":21}],15:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.TraceManager = void 0;

const e = require("./functions/ExecuteSwitchImplCpp"), t = require("./functions/DefineClass"), a = require("./functions/OpenCommon"), o = require("./functions/LinkerManager");

class r {
  static startTrace(e) {
    console.log("startTrace", e);
  }
  static stopTrace(e) {
    console.log("stopTrace", e);
  }
  static TraceJava2Java() {}
  static TraceJava2Native() {}
  static TraceNative2Java() {}
  static TraceNative2Native() {}
  static Trace_OpenCommon() {
    a.OpenCommonHookManager.getInstance().enableHook();
  }
  static Trace_DefineClass() {
    t.DefineClassHookManager.getInstance().enableHook();
  }
  static Trace_CallConstructors() {
    o.linkerManager.Hook_CallConstructors();
  }
  static Trace_ExecuteSwitchImplCpp() {
    e.ExecuteSwitchImplCppManager.enableHook();
  }
  static TraceArtMethodInvoke() {
    HookArtMethodInvoke();
  }
  static TraceException() {
    logSoLoad(), Process.setExceptionHandler((e => {
      LOGE(`TYPE:${e.type} | NCONTEXT: ${e.nativeContext} | ADDRESS: ${e.address} { ${DebugSymbol.fromAddress(e.address)} }`), 
      PrintStackTraceNative(e.context, "", !1, !0);
    }));
  }
}

exports.TraceManager = r, setImmediate((() => {}));

}).call(this)}).call(this,require("timers").setImmediate)

},{"./functions/DefineClass":28,"./functions/ExecuteSwitchImplCpp":30,"./functions/LinkerManager":31,"./functions/OpenCommon":32,"timers":155}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

const t = require("../implements/10/art/mirror/ArtMethod");

globalThis.pathToArtMethod = e => {
  const r = e.lastIndexOf("."), o = e.substring(0, r), s = e.substring(r + 1);
  let l = null;
  return Java.perform((() => {
    const e = Java.use(o)[s].handle;
    l = new t.ArtMethod(e);
  })), l;
}, globalThis.toArtMethod = globalThis.pathToArtMethod;

},{"../implements/10/art/mirror/ArtMethod":86}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.CfgAnalyzer = exports.clearPltCache = exports.pltCallTarget = exports.indirectTarget = exports.isPltStub = exports.inspectPltStub = exports.refineIndirect = exports.isJumpTableBranch = exports.resolveGotSlot = exports.isPrologue = exports.classifyInstruction = exports.branchTarget = void 0;

const t = [ "eq", "ne", "cs", "hs", "cc", "lo", "mi", "pl", "vs", "vc", "hi", "ls", "ge", "lt", "gt", "le", "al", "nv" ];

function e(t) {
  return null != t && "reg" === t.type ? `${t.value}` : null;
}

function n(t) {
  return null != t && "mem" === t.type && void 0 !== t.value ? t.value : null;
}

function r(t) {
  const e = t.operands;
  return Array.isArray(e) ? e : null;
}

function l(t) {
  try {
    const e = t.readPointer();
    return e.isNull() ? null : e;
  } catch (t) {
    return null;
  }
}

function s(t) {
  try {
    const e = Instruction.parse(t);
    return e.size > 0 ? e : null;
  } catch (t) {
    return null;
  }
}

function c(t) {
  const e = r(t);
  if (null !== e && e.length > 0) {
    if (e[0] && "mem" === e[0].type) return null;
    for (let t = e.length - 1; t >= 0; t--) {
      const n = e[t];
      if (n && ("imm" === n.type || "cimm" === n.type) && void 0 !== n.value && null !== n.value) try {
        return ptr(n.value);
      } catch (t) {
        return null;
      }
    }
    return null;
  }
  const n = /0x[0-9a-fA-F]+/.exec(t.opStr || "");
  return null === n ? null : ptr(n[0]);
}

function u(e) {
  const n = e.mnemonic;
  switch (n) {
   case "ret":
   case "brk":
   case "udf":
    return "return";

   case "br":
    return "indirect";

   case "blr":
    return "indirectCall";

   case "bl":
    return "call";

   case "b":
    return "jump";

   case "cbz":
   case "cbnz":
   case "tbz":
   case "tbnz":
    return "branch";

   case "nop":
    return "padding";
  }
  return n.length > 2 && "b" === n.charAt(0) && "." === n.charAt(1) && -1 !== t.indexOf(n.slice(2)) ? "branch" : "fallthrough";
}

function a(e) {
  const n = e.mnemonic, r = e.opStr || "";
  switch (n) {
   case "bx":
    return /(^|,\s*)lr\s*$/.test(r) ? "return" : "indirect";

   case "blx":
    return null !== c(e) ? "call" : "indirectCall";

   case "bl":
    return "call";

   case "pop":
    return /\bpc\b/.test(r) ? "return" : "fallthrough";

   case "mov":
    return "pc,lr" === r.replace(/\s+/g, "") ? "return" : "fallthrough";

   case "cbz":
   case "cbnz":
   case "tbz":
   case "tbnz":
    return "branch";

   case "nop":
    return "padding";

   case "udf":
    return "return";
  }
  if ("b" === n || "b.w" === n) return "jump";
  const l = n.length > 2 && ".w" === n.slice(-2) ? n.slice(0, -2) : n;
  return 3 === l.length && "b" === l.charAt(0) && -1 !== t.indexOf(l.slice(1)) ? "branch" : "fallthrough";
}

function i(t) {
  const e = t.mnemonic;
  switch (e) {
   case "ret":
   case "retf":
   case "iret":
   case "iretq":
   case "hlt":
   case "ud2":
    return "return";

   case "call":
    return null !== c(t) ? "call" : "indirectCall";

   case "jmp":
    return null !== c(t) ? "jump" : "indirect";

   case "nop":
    return "padding";
  }
  return e.length > 1 && "j" === e.charAt(0) ? "branch" : "fallthrough";
}

function o(t, e) {
  switch (e) {
   case "arm64":
    return u(t);

   case "arm":
    return a(t);

   default:
    return i(t);
  }
}

function p(t, e) {
  const n = t.mnemonic, r = (t.opStr || "").replace(/\s+/g, " ");
  return "arm64" === e ? !("sub" !== n || !/^sp, sp, #/.test(r)) || (!("stp" !== n || !/x29, x30/.test(r)) || !("stp" !== n || !/\[sp, #-/.test(r))) : "arm" === e ? !("push" !== n || !/\blr\b/.test(r)) || !("sub" !== n || !/^sp, sp, #/.test(r)) : !("push" !== n || !/^(rbp|ebp)$/.test(r)) || !("sub" !== n || !/^(rsp|esp), (rsp|esp), /.test(r));
}

function d(t, l = y.detectArch()) {
  const c = r(t);
  if (null === c || 0 === c.length) return null;
  if ("ia32" === l || "x64" === l) {
    if ("jmp" !== t.mnemonic && "call" !== t.mnemonic) return null;
    const e = n(c[0]);
    if (null === e || void 0 === e.base) return null;
    const r = `${e.base}`.toLowerCase();
    return "rip" !== r && "eip" !== r ? null : {
      slot: t.next.add(e.disp),
      page: null,
      disp: e.disp
    };
  }
  if ("arm64" !== l) return null;
  if ("br" !== t.mnemonic && "blr" !== t.mnemonic) return null;
  const u = e(c[0]);
  if (null === u) return null;
  let a = null, i = 0;
  for (let l = 1; l <= 3; l++) {
    const c = s(t.address.sub(4 * l));
    if (null === c) break;
    const o = r(c);
    if (null === o || o.length < 2) continue;
    if ("ldr" !== c.mnemonic || e(o[0]) !== u) continue;
    const p = n(o[1]);
    if (null !== p) {
      if (void 0 !== p.index) return null;
      a = void 0 === p.base ? null : `${p.base}`, i = p.disp;
      break;
    }
  }
  if (null === a) return null;
  for (let n = 1; n <= 4; n++) {
    const l = s(t.address.sub(4 * n));
    if (null === l) break;
    if ("adrp" !== l.mnemonic) continue;
    const c = r(l);
    if (!(null === c || c.length < 2) && (e(c[0]) === a && ("imm" === c[1].type || "cimm" === c[1].type))) try {
      const t = ptr(c[1].value);
      return {
        slot: t.add(i),
        page: t,
        disp: i
      };
    } catch (t) {
      return null;
    }
  }
  return null;
}

function f(t, l = y.detectArch()) {
  if ("arm64" !== l) return !1;
  if ("br" !== t.mnemonic) return !1;
  const c = r(t);
  if (null === c || 0 === c.length) return !1;
  const u = e(c[0]);
  if (null === u) return !1;
  for (let l = 1; l <= 4; l++) {
    const c = s(t.address.sub(4 * l));
    if (null === c) break;
    const a = c.mnemonic;
    if ("ldr" !== a && "ldrsw" !== a && "ldrsb" !== a && "ldrsh" !== a) continue;
    const i = r(c);
    if (null === i || i.length < 2) continue;
    if (e(i[0]) !== u) continue;
    const o = n(i[1]);
    if (null !== o && void 0 !== o.index) return !0;
  }
  return !1;
}

function b(t, e = y.detectArch()) {
  return null !== d(t, e) ? "plt" : f(t, e) ? "jumpTable" : "unknown";
}

exports.branchTarget = c, exports.classifyInstruction = o, exports.isPrologue = p, 
exports.resolveGotSlot = d, exports.isJumpTableBranch = f, exports.refineIndirect = b;

const h = new Map;

function m(t, e = y.detectArch()) {
  const n = `${e}:${t}`;
  if (h.has(n)) return h.get(n);
  let r = null;
  if ("arm64" === e) {
    let n = t, c = !1, u = !1;
    for (let a = 0; a < 4 && null === r; a++) {
      const a = s(n);
      if (null === a) break;
      const i = a.mnemonic;
      if ("adrp" === i) c = !0; else if ("ldr" === i && c) u = !0; else if ("add" !== i || !c) {
        if (("br" === i || "blr" === i) && c && u) {
          const n = d(a, e);
          null !== n && (r = {
            stub: t,
            gotSlot: n.slot,
            target: l(n.slot)
          });
          break;
        }
        break;
      }
      n = a.next;
    }
  } else if ("ia32" === e || "x64" === e) {
    const n = s(t);
    if (null !== n && "jmp" === n.mnemonic) {
      const s = d(n, e);
      null !== s && (r = {
        stub: t,
        gotSlot: s.slot,
        target: l(s.slot)
      });
    }
  }
  return h.set(n, r), r;
}

function g(t, e = y.detectArch()) {
  return null !== m(t, e);
}

function x(t, e = y.detectArch()) {
  const n = d(t, e);
  return null === n ? null : {
    gotSlot: n.slot,
    target: l(n.slot)
  };
}

function S(t, e = y.detectArch()) {
  const n = m(t, e);
  return null === n ? null : n.target;
}

function A() {
  h.clear();
}

exports.inspectPltStub = m, exports.isPltStub = g, exports.indirectTarget = x, exports.pltCallTarget = S, 
exports.clearPltCache = A;

class y {
  static DEFAULT_MAX_SPAN=65536;
  static DEFAULT_MAX_INSNS=2e4;
  static DEFAULT_MAX_SWEEP_BYTES=512;
  static detectArch() {
    const t = Process.arch;
    return "arm64" === t || "arm" === t || "ia32" === t || "x64" === t ? t : "arm64";
  }
  static granularity(t = y.detectArch()) {
    return "arm64" === t ? 4 : "arm" === t ? 2 : 1;
  }
  static analyze(t, e = {}) {
    const n = y.detectArch(), r = void 0 === e.maxSpan ? y.DEFAULT_MAX_SPAN : e.maxSpan, u = void 0 === e.maxInsns ? y.DEFAULT_MAX_INSNS : e.maxInsns, a = void 0 === e.maxSweepBytes ? y.DEFAULT_MAX_SWEEP_BYTES : e.maxSweepBytes, i = !1 !== e.collectCalls;
    let p = t;
    "arm" !== n || p.and(1).isNull() || (p = p.sub(1));
    const f = p.add(r), h = new Set, x = [ p ], S = [], A = [], k = [], C = [], T = [];
    let v = p, w = 0, z = 0, $ = !1;
    const P = t => t.compare(p) >= 0 && t.compare(f) < 0, _ = (t, e) => {
      const n = t.address.add(t.size);
      "padding" !== e && n.compare(v) > 0 && (v = n);
    }, E = (t, e) => {
      k.push({
        from: t,
        stub: null === e ? null : e.stub,
        gotSlot: null === e ? null : e.gotSlot,
        target: null === e ? null : e.target
      });
    };
    for (;x.length > 0 && !$; ) {
      let t = x.pop(), e = 0;
      for (;!$; ) {
        if (w >= u) {
          $ = !0;
          break;
        }
        if (!P(t)) break;
        const r = t.toString();
        if (h.has(r)) break;
        h.add(r);
        const a = s(t);
        if (null === a) {
          T.push(t);
          break;
        }
        const p = o(a, n);
        switch (_(a, p), w++, e++, p) {
         case "return":
          S.push(t);
          break;

         case "indirect":
         case "indirectCall":
          if ("plt" === b(a, n)) {
            const e = d(a, n);
            if (E(t, null === e ? null : {
              stub: t,
              gotSlot: e.slot,
              target: l(e.slot)
            }), "indirectCall" === p) {
              t = a.next;
              continue;
            }
            break;
          }
          if (C.push(t), "indirectCall" === p) {
            t = a.next;
            continue;
          }
          break;

         case "jump":
          {
            const e = c(a);
            if (null !== e) {
              const r = m(e, n);
              if (null !== r) {
                E(t, r);
                break;
              }
              if (P(e)) {
                t = e;
                continue;
              }
            }
            break;
          }

         case "branch":
          {
            const e = c(a);
            null !== e && P(e) && !g(e, n) && x.push(e), t = a.next;
            continue;
          }

         case "call":
          if (i) {
            const e = c(a);
            null !== e && A.push({
              from: t,
              to: e
            });
          }
          t = a.next;
          continue;

         default:
          t = a.next;
          continue;
        }
        break;
      }
      e > 0 && z++;
    }
    let I = !1;
    if (C.length > 0 && !1 !== e.linearSweepOnIndirect && !$) {
      const t = y.linearSweep(v, f, n, u - w, a);
      t.end.compare(v) > 0 && (v = t.end, w += t.insnCount, I = !0, t.truncated && ($ = !0));
    }
    let j;
    return j = (S.length > 0 || k.length > 0) && 0 !== w ? 0 !== C.length || $ || 0 !== T.length ? "medium" : "high" : "low", 
    {
      start: p,
      end: v,
      size: v.sub(p).toInt32(),
      arch: n,
      insnCount: w,
      blockCount: z,
      returns: S,
      calls: A,
      pltCalls: k,
      indirectBranches: C,
      undecodable: T,
      truncated: $,
      linearSwept: I,
      confidence: j
    };
  }
  static linearSweep(t, e, n = y.detectArch(), r = 256, l = y.DEFAULT_MAX_SWEEP_BYTES) {
    let c = t, u = t, a = 0, i = 0, d = !1;
    const f = t.add(l), b = f.compare(e) < 0 ? f : e;
    for (;c.compare(b) < 0; ) {
      if (a >= r) {
        d = !0;
        break;
      }
      const t = s(c);
      if (null === t) break;
      if ("padding" === o(t, n)) {
        if (i++, i >= 2) break;
        c = t.next;
        continue;
      }
      if (i = 0, p(t, n)) break;
      if (g(c, n)) break;
      a++;
      const e = t.address.add(t.size);
      e.compare(u) > 0 && (u = e), c = t.next;
    }
    return {
      end: u,
      insnCount: a,
      truncated: d
    };
  }
  static describe(t) {
    let e = `Cfg< ${t.start} -> ${t.end} > size: ${t.size} ( 0x${t.size.toString(16)} )`;
    return e += ` | arch: ${t.arch} | confidence: ${t.confidence}`, e += ` | insns: ${t.insnCount} | blocks: ${t.blockCount} | returns: ${t.returns.length}`, 
    e += ` | calls: ${t.calls.length} | plt: ${t.pltCalls.length} | indirect: ${t.indirectBranches.length}`, 
    t.undecodable.length > 0 && (e += ` | undecodable: ${t.undecodable.length}`), t.truncated && (e += " | TRUNCATED"), 
    t.linearSwept && (e += " | linear-swept"), e;
  }
}

exports.CfgAnalyzer = y, Reflect.set(globalThis, "CfgAnalyzer", y), Reflect.set(globalThis, "inspectPltStub", m), 
Reflect.set(globalThis, "resolveGotSlot", d), globalThis.isPltStub = t => g("string" == typeof t || "number" == typeof t ? ptr(t) : t), 
globalThis.clearPltCache = A, globalThis.analyzeFunctionCfg = (t, e = {}) => {
  const n = y.analyze("string" == typeof t || "number" == typeof t ? ptr(t) : t, e);
  return LOGD(y.describe(n)), n;
};

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.showFunctionAsm = exports.annotateInstruction = exports.describeBoundary = exports.getFunctionSize = exports.getFunctionBoundary = exports.SymbolTableCache = void 0;

const e = require("../implements/10/art/OatQuickMethodHeader"), n = require("./CfgAnalyzer"), t = require("./SymHelper");

class r {
  static tables=new Map;
  static clear() {
    r.tables.clear();
  }
  static cachedModules() {
    return Array.from(r.tables.keys());
  }
  static of(e) {
    const n = r.tables.get(e);
    if (void 0 !== n) return n;
    const t = [];
    try {
      const n = Process.findModuleByName(e);
      if (null !== n) for (const e of n.enumerateSymbols()) "function" === e.type && (e.address.isNull() || t.push({
        address: e.address,
        name: e.name,
        size: void 0 === e.size ? 0 : e.size
      }));
    } catch (n) {
      LOGW(`SymbolTableCache: enumerateSymbols('${e}') failed -> ${n}`);
    }
    return t.sort(((e, n) => e.address.compare(n.address))), r.tables.set(e, t), t;
  }
  static lowerBound(e, n) {
    let t = 0, r = e.length;
    for (;t < r; ) {
      const s = t + r >>> 1;
      e[s].address.compare(n) < 0 ? t = s + 1 : r = s;
    }
    return t;
  }
  static tableOf(e) {
    const n = Process.findModuleByAddress(e);
    return null === n ? null : r.of(n.name);
  }
  static exact(e) {
    const n = r.tableOf(e);
    if (null === n) return null;
    const t = r.lowerBound(n, e);
    return t < n.length && n[t].address.equals(e) ? n[t] : null;
  }
  static containing(e) {
    const n = r.tableOf(e);
    if (null === n) return null;
    const t = r.lowerBound(n, e);
    if (0 === t) return null;
    const s = n[t - 1];
    if (s.size <= 0) return null;
    const o = e.sub(s.address).toInt32();
    return o < 0 || o >= s.size ? null : {
      sym: s,
      offset: o
    };
  }
  static nextAfter(e) {
    const n = r.tableOf(e);
    if (null === n) return null;
    const t = r.lowerBound(n, e);
    return t < n.length && n[t].address.compare(e) > 0 ? n[t] : t + 1 < n.length ? n[t + 1] : null;
  }
  static stats(e) {
    const n = r.of(e), t = n.filter((e => e.size > 0)).length;
    return `SymbolTable< ${e} > functions: ${n.length} | with st_size: ${t}`;
  }
  static findByName(e, n, t = !1) {
    const s = r.of(e);
    for (const e of s) if (e.name === n) return e;
    if (!t) return null;
    for (const e of s) if (-1 !== e.name.indexOf(n)) return e;
    return null;
  }
}

function s(n, t, r) {
  try {
    const s = new e.OatQuickMethodHeader(n.sub(8)), o = s.vmap_table_offset;
    if (o < 0 || o > 65536) return 0;
    const l = s.GetCodeSize();
    if (l <= 0 || l > t || l % r != 0) return 0;
    const a = Process.findModuleByAddress(n);
    return null !== a && n.add(l).compare(a.base.add(a.size)) > 0 ? 0 : (Instruction.parse(n), 
    l);
  } catch (e) {
    return 0;
  }
}

function o(e, t = {}) {
  const o = n.CfgAnalyzer.detectArch(), l = n.CfgAnalyzer.granularity(o), a = void 0 === t.maxSpan ? n.CfgAnalyzer.DEFAULT_MAX_SPAN : t.maxSpan, c = "arm" !== o || e.and(1).isNull() ? e : e.sub(1), i = Process.findModuleByAddress(c), u = null === i ? null : i.name, d = e => e > 0 && e <= a && e % l == 0, f = (e, n, t, r, s) => ({
    start: c,
    end: c.add(e),
    size: e,
    source: n,
    confidence: t,
    moduleName: u,
    symbolName: r,
    cfg: s
  });
  let m = null;
  if ("cfg" !== t.prefer) {
    if (!0 === t.oatHeader) {
      const e = s(c, a, l);
      if (e > 0) return f(e, "oat-header", "exact", null, null);
    }
    const e = r.containing(c);
    if (null !== e) {
      m = e.sym.name;
      const n = e.sym.size - e.offset;
      if (d(n)) return f(n, "symbol-size", "exact", m, null);
    } else {
      const e = r.exact(c);
      null !== e && (m = e.name);
    }
    const o = r.nextAfter(c);
    if (null !== o) {
      const e = o.address.sub(c).toInt32();
      if (d(e)) {
        if (!1 !== t.allowCfg && !1 !== t.refineSymbolNext) {
          const r = n.CfgAnalyzer.analyze(c, {
            maxSpan: e,
            maxInsns: t.maxInsns,
            linearSweepOnIndirect: t.linearSweepOnIndirect,
            collectCalls: t.collectCalls
          });
          if (r.size > 0 && r.size < e && r.end.compare(o.address) <= 0) {
            const e = "high" === r.confidence ? "high" : "medium" === r.confidence ? "medium" : "low";
            return f(r.size, "cfg-bounded", e, m, r);
          }
        }
        return f(e, "symbol-next", "medium", m, null);
      }
    }
  }
  if (!1 !== t.allowCfg) {
    const e = n.CfgAnalyzer.analyze(c, t);
    if (e.size > 0) {
      const n = "high" === e.confidence ? "high" : "medium" === e.confidence ? "medium" : "low";
      return f(e.size, "cfg", n, m, e);
    }
  }
  return f(0, "unknown", "low", m, null);
}

function l(e, n = {}) {
  return o(e, n).size;
}

function a(e) {
  let n = `FunctionBoundary< ${e.start} -> ${e.end} >`;
  return n += ` size: ${e.size} ( 0x${e.size.toString(16)} )`, n += ` | source: ${e.source} | confidence: ${e.confidence}`, 
  n += ` | module: ${null === e.moduleName ? "?" : e.moduleName}`, n += ` | symbol: ${null === e.symbolName ? (0, 
  t.formatSymbol)(e.start) : e.symbolName}`, null !== e.cfg && (n += ` | cfg: insns ${e.cfg.insnCount}, blocks ${e.cfg.blockCount}, returns ${e.cfg.returns.length}, plt ${e.cfg.pltCalls.length}, indirect ${e.cfg.indirectBranches.length}`), 
  n;
}

exports.SymbolTableCache = r, exports.getFunctionBoundary = o, exports.getFunctionSize = l, 
exports.describeBoundary = a;

const c = [ "brk", "udf", "ud2", "hlt" ];

function i(e, r) {
  const s = (0, n.inspectPltStub)(e, r);
  return null === s ? (0, t.formatSymbol)(e) : null === s.target ? `[plt unbound] ${(0, 
  t.formatSymbol)(e)}` : `[plt] ${(0, t.formatSymbol)(s.target)}`;
}

function u(e, r, s, o = {}) {
  const l = n.CfgAnalyzer.detectArch(), a = (0, n.classifyInstruction)(e, l), u = s.compare(r) > 0;
  switch (a) {
   case "call":
    {
      if (!1 === o.calls) return "";
      const t = (0, n.branchTarget)(e);
      return null === t ? "" : `   ; -> ${i(t, l)}`;
    }

   case "indirectCall":
    {
      if (!1 === o.calls) return "";
      const r = (0, n.indirectTarget)(e, l);
      return null === r ? "   ; -> [indirect call]" : null === r.target ? `   ; -> [plt unbound] got ${r.gotSlot}` : `   ; -> [plt] ${(0, 
      t.formatSymbol)(r.target)}`;
    }

   case "indirect":
    {
      const r = (0, n.indirectTarget)(e, l);
      return null !== r ? null === r.target ? `   <== plt tail call (got ${r.gotSlot})` : `   <== plt tail call -> ${(0, 
      t.formatSymbol)(r.target)}` : (0, n.isJumpTableBranch)(e, l) ? "   <== indirect branch (jump table?)" : "   <== indirect branch (target unknown)";
    }

   case "return":
    return !1 === o.returns ? "" : -1 !== c.indexOf(e.mnemonic) ? `   <== trap (${e.mnemonic})` : "   <== return";

   case "jump":
   case "branch":
    {
      const t = (0, n.branchTarget)(e);
      if (null === t) return "";
      const c = () => !1 === o.branches ? "" : `   ; -> +0x${t.sub(r).toString(16)}`;
      if (u && t.compare(r) >= 0 && t.compare(s) < 0) return c();
      const d = `   ; -> ${i(t, l)}${"jump" === a ? " [tail]" : ""}`;
      if (!u) {
        const e = Process.findModuleByAddress(t), s = Process.findModuleByAddress(r);
        if (null !== e && null !== s && e.name === s.name && t.compare(r) >= 0 && !(0, n.isPltStub)(t, l)) return c();
      }
      return d;
    }

   default:
    return "";
  }
}

function d(e, r = {}) {
  const s = o(e, r), l = void 0 === r.num ? -1 : r.num, c = void 0 === r.annotate ? {} : r.annotate;
  newLine(), LOGD(`👉 ${(0, t.formatSymbol)(s.start)}`), LOGZ(`[ ${a(s)} ]`), "low" === s.confidence && LOGW("[ boundary confidence is LOW, the result may over/under extend ]"), 
  newLine(), s.size <= 0 && LOGE(`Unable to determine the function boundary of ${s.start}, falling back to 20 instructions`);
  const i = Process.findModuleByAddress(s.start), d = n.CfgAnalyzer.granularity(), f = -1 === l && s.size > 0, m = f ? Math.ceil(s.size / d) + 4 : -1 === l ? 20 : l;
  let b;
  try {
    b = Instruction.parse(s.start);
  } catch (e) {
    return LOGE(`Cannot decode an instruction at ${s.start}`), newLine(), s;
  }
  let g = 0, y = 0;
  for (;g < m && !(f && b.address.compare(s.end) >= 0); ) {
    g++;
    const e = `[${g.toString().padStart(5, " ")}|${ptr(y).toString().padEnd(7, " ")}]`, n = null === i ? "?" : b.address.sub(i.base);
    LOGD(`${e} ${b.address} | ${n}  ${b.toString()}${u(b, s.start, s.end, c)}`), y += b.size;
    try {
      b = Instruction.parse(b.next);
    } catch (n) {
      LOGE(`${e} ${b.next} <--- UNDECODABLE, stop`);
      break;
    }
  }
  return newLine(), s;
}

exports.annotateInstruction = u, exports.showFunctionAsm = d;

const f = e => "string" == typeof e || "number" == typeof e ? ptr(e) : e;

globalThis.getFunctionBoundary = (e, n = {}) => o(f(e), n), globalThis.getFunctionSize = (e, n = {}) => l(f(e), n), 
globalThis.showFunctionAsm = (e, n = {}) => d(f(e), n), globalThis.FunctionBoundaryUtil = {
  getFunctionBoundary: o,
  getFunctionSize: l,
  showFunctionAsm: d,
  describeBoundary: a,
  annotateInstruction: u,
  SymbolTableCache: r
};

},{"../implements/10/art/OatQuickMethodHeader":50,"./CfgAnalyzer":17,"./SymHelper":21}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.hookJavaClass = void 0;

var e = !1;

function o(o, s, t = []) {
  s = null == s || null == s ? (e, o, s) => ({
    skipOriginal: !1,
    parseValue: !0
  }) : s, Java.perform((() => {
    var a;
    try {
      a = "string" == typeof o ? Java.use(o) : o;
    } catch {
      return void LOGE(`NOT FOUND ${o}`);
    }
    a.class.getDeclaredMethods().forEach((i => {
      const n = i.getName();
      if (n.includes("$") || n.includes("native") || n.includes("synchronized")) return void LOGW(`Skip Hook -> ${o}.${n}`);
      if (n.includes("$") || n.includes("init") || n.includes("ctor")) return void LOGW(`Skip Hook -> ${o}.${n}`);
      if (t.includes(n)) return;
      LOGW(`Hooking ${o}.${n}`);
      const r = i.getParameterTypes().map((e => e.className)).join(",");
      a[n].overloads.forEach((t => {
        t && (t.implementation = function() {
          const a = s(n, r, arguments) || {};
          let i;
          if (a.before && a.before(this, arguments), a.skipOriginal || (i = t.apply(this, arguments)), 
          a.after && (i = a.after(this, arguments, i)), a.parseValue) {
            let s = `${o}.${n}`;
            if (e) {
              const o = Java.use("com.google.gson.Gson").$new();
              let t = 0 == arguments.length ? "" : Array.prototype.slice.call(arguments).map((e => o.toJson(e))).join("','");
              if (i) {
                if (e) {
                  const e = o.toJson(i);
                  LOGD(`${s}([96m'${t}'[0m) => [93m${e}[0m`);
                }
              } else LOGD(`${s}([96m'${t}'[0m)`);
            } else {
              const e = 0 == arguments.length ? "" : Array.prototype.slice.call(arguments).map(String).join("','");
              i ? LOGD(`${s}([96m'${e}'[0m) => [93m${i}[0m`) : LOGD(`${s}([96m'${e}'[0m)`);
            }
          }
          return i;
        });
      }));
    }));
  }));
}

exports.hookJavaClass = o, Reflect.set(globalThis, "hookJavaClass", o);

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.showNativeAsm = exports.resolveNativeAddress = exports.isUnboundJniStub = void 0;

const e = require("./SymHelper"), t = require("./FunctionBoundary"), r = [ "art_jni_dlsym_lookup_stub", "art_jni_dlsym_lookup_critical_stub", "art_jni_dlsym_lookup_fast_stub", "art_quick_generic_jni_trampoline" ];

function o(t) {
  let o;
  try {
    o = (0, e.formatSymbol)(t);
  } catch (e) {
    return !1;
  }
  return r.some((e => -1 !== o.indexOf(e)));
}

function n(e, r = {}) {
  if (null == e) throw new Error("resolveNativeAddress: target is null");
  if ("number" == typeof e) return ptr(e);
  if (e instanceof NativePointer) return e;
  if ("object" == typeof e) {
    const t = e;
    if (void 0 !== t.handle && void 0 !== t.data) {
      const e = t.data;
      if (null == e || e.isNull()) throw new Error(`resolveNativeAddress: ArtMethod ${t.handle} has no native implementation (data is null)`);
      return e;
    }
    throw new Error(`resolveNativeAddress: unsupported object ${e}`);
  }
  if ("string" != typeof e) throw new Error(`resolveNativeAddress: unsupported target ${e}`);
  const o = e.trim();
  if (0 === o.length) throw new Error("resolveNativeAddress: empty target");
  const n = o.indexOf("!");
  if (n > 0) {
    const e = o.slice(0, n), r = o.slice(n + 1).trim(), s = Process.findModuleByName(e);
    if (null === s) throw new Error(`resolveNativeAddress: module '${e}' is not loaded`);
    if (/^0x[0-9a-fA-F]+$/.test(r)) return s.base.add(ptr(r));
    if (/^[0-9a-fA-F]{6,16}$/.test(r)) return s.base.add(ptr(`0x${r}`));
    const i = s.findExportByName(r);
    if (null !== i) return i;
    const a = t.SymbolTableCache.findByName(e, r, !0);
    if (null !== a) return LOGZ(`resolveNativeAddress: '${r}' matched symbol ${a.name}`), 
    a.address;
    throw new Error(`resolveNativeAddress: symbol '${r}' not found in ${e}`);
  }
  if (/^0x[0-9a-fA-F]+$/.test(o)) return ptr(o);
  if (/^[0-9a-fA-F]{8,16}$/.test(o)) return ptr(`0x${o}`);
  const s = Module.findExportByName(null, o);
  if (null !== s) return s;
  if (!1 !== r.fromJavaMethod && o.indexOf(".") > 0) {
    let e = null;
    try {
      e = pathToArtMethod(o);
    } catch (t) {
      e = null;
    }
    if (null != e) {
      const t = e.data;
      if (t.isNull()) throw new Error(`resolveNativeAddress: ${o} has no native implementation (data is null)`);
      return t;
    }
  }
  try {
    const e = DebugSymbol.findFunctionsNamed(o);
    if (e.length > 0) return e[0];
  } catch (e) {}
  throw new Error(`resolveNativeAddress: cannot resolve '${o}' to an address`);
}

function s(r, s = {}) {
  const i = n(r, s);
  !1 !== s.warnUnbound && o(i) && (newLine(), LOGW(`⚠ ${i} -> ${(0, e.formatSymbol)(i)}`), 
  LOGW("  This is an ART JNI lookup stub, the real native implementation is not registered yet."), 
  LOGW("  Call the java method once (or hook RegisterNatives) and try again."));
  return LOGD(`👉 ${"string" == typeof r ? `${r} -> ` : ""}${i} | ${(0, e.formatSymbol)(i)}`), 
  (0, t.showFunctionAsm)(i, s);
}

exports.isUnboundJniStub = o, exports.resolveNativeAddress = n, exports.showNativeAsm = s, 
globalThis.showNativeAsm = s, globalThis.resolveNativeAddress = n, globalThis.isUnboundJniStub = o;

},{"./FunctionBoundary":18,"./SymHelper":21}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.clearSymbolCache = exports.formatSymbol = exports.demangleName = exports.getSym = exports.callSym = void 0;

const e = require("../../tools/functions"), n = require("../functions/SymbolManager"), t = require("../JSHandle"), l = !1;

function o(e, n, t, ...l) {
  try {
    return new NativeFunction(e, n, t)(...l);
  } catch (e) {
    throw e;
  }
}

function r(e, n) {
  return e.map(((e, l) => "int" == n[l] ? parseInt(e.toString()) : e instanceof NativePointer ? e : e instanceof t.JSHandle ? e.handle : "number" == typeof e ? e : "string" == typeof e ? Memory.allocUtf8String(e) : ptr(e)));
}

function i(e, n, t, l, ...i) {
  return o(u(e, n), t, l, ...r(i, l));
}

exports.callSym = i;

const a = new Map;

function u(t, o = "libart.so", r = !1) {
  if (a.has(t)) return a.get(t);
  if (null == t || null == o || "" == t || "" == o) throw new Error("Usage: getSym(symName: string, md: string, check: boolean = false)");
  const i = Process.getModuleByName(o);
  if (null == i) throw new Error(`module ${o} not found`);
  let u = i.findExportByName(t);
  if (null == u) {
    let e = i.enumerateSymbols().filter((e => e.name == t && (!r || "function" == e.type)));
    if (e.length > 1) return u = e[0].address, LOGW(`find too many symbol, just ret first | size : ${e.length}`), 
    u;
    if (1 == e.length) return u = e[0].address, u;
  }
  if (null == u) {
    let o = n.SymbolManager.SymbolFilter(null, (0, e.demangleName_onlyFunctionName)(t));
    if (l && LOGD(`debug -> symbol ${t} found in ${o} -> ${o.address}`), "function" != o.type) throw new Error(`symbol ${o.name} not a function [ ${o.type} ]`);
    u = o.address;
  }
  if (l && LOGD(`debug -> symbol ${t} found in ${o} -> ${u}`), null == u) throw new Error(`symbol ${t} not found`);
  if (r) {
    if (0 == i.enumerateSymbols().filter((e => e.name == t && "object" == e.type)).length) throw new Error(`symbol ${t} not found`);
  }
  return a.set(t, u), u;
}

exports.getSym = u, Reflect.set(globalThis, "getSym", u), Reflect.set(globalThis, "callSym", i);

let s = null, m = null, c = !1;

function f() {
  if (null !== s) return s;
  let e = Module.findExportByName("libc++.so", "__cxa_demangle");
  if (null == e && (e = Module.findExportByName("libunwindstack.so", "__cxa_demangle")), 
  null == e && (e = Module.findExportByName("libbacktrace.so", "__cxa_demangle")), 
  null == e && (e = Module.findExportByName(null, "__cxa_demangle")), null == e) throw Error("can not find export function -> __cxa_demangle");
  return s = new NativeFunction(e, "pointer", [ "pointer", "pointer", "pointer", "pointer" ]), 
  s;
}

function d() {
  if (!c) {
    c = !0;
    const e = Module.findExportByName("libc.so", "free");
    m = null === e ? null : new NativeFunction(e, "void", [ "pointer" ]);
  }
  return m;
}

function y(e) {
  const n = f();
  let t = Memory.allocUtf8String(e), l = NULL, o = NULL, r = Memory.alloc(Process.pageSize), i = n(t, l, o, r);
  if (0 === r.readInt()) {
    let n = i.readUtf8String();
    if (!i.isNull() && !i.equals(t)) {
      const e = d();
      null !== e && e(i);
    }
    return null == n || n == e ? "" : n;
  }
  return "";
}

exports.demangleName = y, globalThis.demangleName = y;

const g = new Map;

function b(e) {
  const n = e.toString(), t = g.get(n);
  if (void 0 !== t) return t;
  let l;
  try {
    const n = DebugSymbol.fromAddress(e), t = Process.findModuleByAddress(e), o = null !== t ? t.name : null === n.moduleName ? "?" : n.moduleName, r = n.name;
    if (null !== r && r.length > 0) {
      let t = r;
      if (0 === r.indexOf("_Z")) try {
        const e = y(r);
        "" !== e && (t = e);
      } catch (e) {}
      l = `${o}!${t}`;
      const i = n.address.isNull() ? null : e.sub(n.address);
      null === i || i.isNull() || (l += `+0x${i.toString(16)}`);
    } else l = null === t ? `${e}` : `${o}!0x${e.sub(t.base).toString(16)}`;
    null !== n.fileName && n.fileName.length > 0 && (l += `  (${n.fileName}:${null === n.lineNumber ? "?" : n.lineNumber})`);
  } catch (n) {
    l = `${e}`;
  }
  return g.set(n, l), l;
}

function p() {
  g.clear(), a.clear();
}

exports.formatSymbol = b, exports.clearSymbolCache = p, globalThis.formatSymbol = e => b("string" == typeof e || "number" == typeof e ? ptr(e) : e), 
globalThis.clearSymbolCache = p;

},{"../../tools/functions":115,"../JSHandle":13,"../functions/SymbolManager":33}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.PrintStackTraceNative = exports.hookThread = void 0;

const t = require("./libcfuncs"), e = () => {
  LOGW(`MAIN Thread ID : ${Process.id}`);
  const e = Module.findExportByName("libc.so", "pthread_create");
  new NativeFunction(e, "int", [ "pointer", "pointer", "pointer", "pointer" ]);
  Interceptor.attach(e, {
    onEnter: function(e) {
      const r = e[0];
      this.__pthread_ptr = r;
      const n = new t.pthread_attr_t(e[1]);
      this.__attr = n;
      const a = new NativeFunction(e[2], "pointer", [ "pointer" ]);
      this.__start_routine = a;
      const i = a.isNull() ? "NULL" : DebugSymbol.fromAddress(a);
      this.__debugInfo = i;
      const o = e[3];
      this.__data = o;
    },
    onLeave: function() {
      try {
        const e = t.libC.getpid();
        let n = `${e}`;
        try {
          n += ` [ ${r(e)} ] `;
        } catch {}
        const a = this.__pthread_ptr.readPointer().add(16).readU32();
        let i = `${a}`;
        try {
          i += ` [ ${r(a)} ] `;
        } catch {}
        LOGW(`\ntid : ${n} -> ${i}`), LOGD(`pthread_create:\n\t__pthread_ptr=${this.__pthread_ptr}\n\t__attr=${this.__attr}\n\t__start_routine=${this.__debugInfo} @ ${this.__start_routine}\n\t__data=${this.__data}`), 
        (0, exports.PrintStackTraceNative)(this.context, "\t");
      } catch (t) {}
    }
  });
};

function r(e = t.libC.gettid()) {
  let r = "unknown";
  try {
    const t = new File("/proc/self/task/" + e + "/comm", "r");
    r = t.readLine().toString().trimEnd(), t.close();
  } catch (t) {
    throw t;
  }
  return r;
}

exports.hookThread = e;

const n = (t, e = "", r = !1, n = !1, a = !1, i = 6) => {
  const o = Thread.backtrace(t, r ? Backtracer.FUZZY : Backtracer.ACCURATE).slice(0, i).map(DebugSymbol.fromAddress).map(((t, r) => `${e}[ ${r} ] ${t}`)).map((t => {
    if (n && t.includes("!") && t.includes("+")) {
      const e = t.slice(t.indexOf("!") + 1, t.indexOf("+"));
      let r = demangleName(e);
      return t.slice(0, t.indexOf("!") + 1) + r + t.slice(t.indexOf("+") - 2);
    }
    return t;
  })).join("\n");
  return a ? o : LOGZ(o);
};

exports.PrintStackTraceNative = n, globalThis.hookThread = exports.hookThread, globalThis.getThreadName = r, 
globalThis.PrintStackTraceNative = exports.PrintStackTraceNative;

},{"./libcfuncs":24}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./ArtMethodHelper"), require("./SymHelper"), require("./JavaHooker"), 
require("./libcfuncs"), require("./ThreadHooker"), require("./syscalls"), require("./CfgAnalyzer"), 
require("./FunctionBoundary"), require("./NativeAsm");

},{"./ArtMethodHelper":16,"./CfgAnalyzer":17,"./FunctionBoundary":18,"./JavaHooker":19,"./NativeAsm":20,"./SymHelper":21,"./ThreadHooker":22,"./libcfuncs":24,"./syscalls":25}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.libC = exports.pthread_attr_t = void 0;

const t = require("../implements/10/art/Globals"), i = require("../../Java/Theads"), e = require("./syscalls");

class s {
  mPtr;
  flags;
  stack_base;
  stack_size;
  guard_size;
  sched_policy;
  sched_priority;
  flags_a;
  stack_base_a;
  stack_size_a;
  guard_size_a;
  sched_policy_a;
  sched_priority_a;
  constructor(i) {
    i.isNull() ? (this.mPtr = NULL, this.flags = 0, this.stack_base = NULL, this.stack_size = 0, 
    this.guard_size = 0, this.sched_policy = 0, this.sched_priority = 0) : (this.mPtr = i, 
    this.flags_a = i, this.stack_base_a = this.flags_a.add(4), this.stack_size_a = this.stack_base_a.add(t.PointerSize), 
    this.guard_size_a = this.stack_size_a.add(t.PointerSize), this.sched_policy_a = this.guard_size_a.add(t.PointerSize), 
    this.sched_priority_a = this.sched_policy_a.add(4), this.flags = this.flags_a.readU32(), 
    this.stack_base = this.stack_base_a.readPointer(), this.stack_size = this.stack_size_a.readU32(), 
    this.guard_size = this.guard_size_a.readU32(), this.sched_policy = this.sched_policy_a.readS32(), 
    this.sched_priority = this.sched_priority_a.readS32());
  }
  toStringComplex() {
    return `pthread_attr_t { flags=${this.flags}, stack_base=${this.stack_base}, stack_size=${this.stack_size}, guard_size=${this.guard_size}, sched_policy=${this.sched_policy}, sched_priority=${this.sched_priority} }`;
  }
  toString() {
    return this.mPtr.isNull() ? "{ NULL }" : `{ f=${this.flags}, sb=${this.stack_base}, ss=${this.stack_size}, gs=${this.guard_size}, s_policy=${this.sched_policy}, s_priority=${this.sched_priority} }`;
  }
}

exports.pthread_attr_t = s;

class a {
  static malloc(t) {
    return Memory.alloc(t);
  }
  static sleep(t) {
    return new NativeFunction(Module.findExportByName("libc.so", "sleep"), "int", [ "int" ])(t);
  }
  static usleep(t) {
    return new NativeFunction(Module.findExportByName("libc.so", "usleep"), "int", [ "int" ])(t);
  }
  static pause() {
    return new NativeFunction(Module.findExportByName("libc.so", "pause"), "int", [])();
  }
  static syscall(t, ...i) {
    const s = new NativeFunction(Module.findExportByName("libc.so", "syscall"), "int", [ "int", ..."pointer" ]);
    return LOGD(`called syscall ( ${e.SYSCALL[t]}, ${i} )`), s(t, i);
  }
  static brk(t) {
    return new NativeFunction(Module.findExportByName("libc.so", "brk"), "int", [ "pointer" ])(t);
  }
  static raise=(t = i.SIGNAL.SIGSTOP) => new NativeFunction(Module.findExportByName("libc.so", "raise"), "int", [ "int" ])(t);
  static kill(t, e = i.SIGNAL.SIGSTOP) {
    return new NativeFunction(Module.findExportByName("libc.so", "kill"), "int", [ "int", "int" ])(t, e);
  }
  static pthread_kill(t, e = i.SIGNAL.SIGSTOP) {
    return new NativeFunction(Module.findExportByName("libc.so", "pthread_kill"), "int", [ "int", "int" ])(t, e);
  }
  static exit(t) {
    new NativeFunction(Module.findExportByName("libc.so", "exit"), "void", [ "int" ])(t);
  }
  static fork() {
    return new NativeFunction(Module.findExportByName("libc.so", "fork"), "int", [])();
  }
  static gettid() {
    return new NativeFunction(Module.findExportByName("libc.so", "gettid"), "int", [])();
  }
  static getpid() {
    return new NativeFunction(Module.findExportByName("libc.so", "getpid"), "int", [])();
  }
  static getppid() {
    return new NativeFunction(Module.findExportByName("libc.so", "getppid"), "int", [])();
  }
  static getuid() {
    return new NativeFunction(Module.findExportByName("libc.so", "getuid"), "int", [])();
  }
  static getgid() {
    return new NativeFunction(Module.findExportByName("libc.so", "getgid"), "int", [])();
  }
  static calloc(t, i) {
    return new NativeFunction(Module.findExportByName("libc.so", "calloc"), "pointer", [ "int", "int" ])(t, i);
  }
  static free(t) {
    new NativeFunction(Module.findExportByName("libc.so", "free"), "void", [ "pointer" ])(t);
  }
  static getenv(t) {
    const i = new NativeFunction(Module.findExportByName("libc.so", "getenv"), "pointer", [ "pointer" ]);
    try {
      return ptr(i(Memory.allocUtf8String(t))).readUtf8String();
    } catch (t) {
      return null;
    }
  }
  static getprogname() {
    const t = new NativeFunction(Module.findExportByName("libc.so", "getprogname"), "pointer", []);
    try {
      return ptr(t()).readUtf8String();
    } catch (t) {
      return null;
    }
  }
}

exports.libC = a;

},{"../../Java/Theads":3,"../implements/10/art/Globals":38,"./syscalls":25}],25:[function(require,module,exports){
"use strict";

var _;

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.SYSCALL = void 0, function(_) {
  _[_.__NR_io_setup = 0] = "__NR_io_setup", _[_.__NR_io_destroy = 1] = "__NR_io_destroy", 
  _[_.__NR_io_submit = 2] = "__NR_io_submit", _[_.__NR_io_cancel = 3] = "__NR_io_cancel", 
  _[_.__NR_io_getevents = 4] = "__NR_io_getevents", _[_.__NR_setxattr = 5] = "__NR_setxattr", 
  _[_.__NR_lsetxattr = 6] = "__NR_lsetxattr", _[_.__NR_fsetxattr = 7] = "__NR_fsetxattr", 
  _[_.__NR_getxattr = 8] = "__NR_getxattr", _[_.__NR_lgetxattr = 9] = "__NR_lgetxattr", 
  _[_.__NR_fgetxattr = 10] = "__NR_fgetxattr", _[_.__NR_listxattr = 11] = "__NR_listxattr", 
  _[_.__NR_llistxattr = 12] = "__NR_llistxattr", _[_.__NR_flistxattr = 13] = "__NR_flistxattr", 
  _[_.__NR_removexattr = 14] = "__NR_removexattr", _[_.__NR_lremovexattr = 15] = "__NR_lremovexattr", 
  _[_.__NR_fremovexattr = 16] = "__NR_fremovexattr", _[_.__NR_getcwd = 17] = "__NR_getcwd", 
  _[_.__NR_lookup_dcookie = 18] = "__NR_lookup_dcookie", _[_.__NR_eventfd2 = 19] = "__NR_eventfd2", 
  _[_.__NR_epoll_create1 = 20] = "__NR_epoll_create1", _[_.__NR_epoll_ctl = 21] = "__NR_epoll_ctl", 
  _[_.__NR_epoll_pwait = 22] = "__NR_epoll_pwait", _[_.__NR_dup = 23] = "__NR_dup", 
  _[_.__NR_dup3 = 24] = "__NR_dup3", _[_.__NR3264_fcntl = 25] = "__NR3264_fcntl", 
  _[_.__NR_inotify_init1 = 26] = "__NR_inotify_init1", _[_.__NR_inotify_add_watch = 27] = "__NR_inotify_add_watch", 
  _[_.__NR_inotify_rm_watch = 28] = "__NR_inotify_rm_watch", _[_.__NR_ioctl = 29] = "__NR_ioctl", 
  _[_.__NR_ioprio_set = 30] = "__NR_ioprio_set", _[_.__NR_ioprio_get = 31] = "__NR_ioprio_get", 
  _[_.__NR_flock = 32] = "__NR_flock", _[_.__NR_mknodat = 33] = "__NR_mknodat", _[_.__NR_mkdirat = 34] = "__NR_mkdirat", 
  _[_.__NR_unlinkat = 35] = "__NR_unlinkat", _[_.__NR_symlinkat = 36] = "__NR_symlinkat", 
  _[_.__NR_linkat = 37] = "__NR_linkat", _[_.__NR_renameat = 38] = "__NR_renameat", 
  _[_.__NR_umount2 = 39] = "__NR_umount2", _[_.__NR_mount = 40] = "__NR_mount", _[_.__NR_pivot_root = 41] = "__NR_pivot_root", 
  _[_.__NR_nfsservctl = 42] = "__NR_nfsservctl", _[_.__NR3264_statfs = 43] = "__NR3264_statfs", 
  _[_.__NR3264_fstatfs = 44] = "__NR3264_fstatfs", _[_.__NR3264_truncate = 45] = "__NR3264_truncate", 
  _[_.__NR3264_ftruncate = 46] = "__NR3264_ftruncate", _[_.__NR_fallocate = 47] = "__NR_fallocate", 
  _[_.__NR_faccessat = 48] = "__NR_faccessat", _[_.__NR_chdir = 49] = "__NR_chdir", 
  _[_.__NR_fchdir = 50] = "__NR_fchdir", _[_.__NR_chroot = 51] = "__NR_chroot", _[_.__NR_fchmod = 52] = "__NR_fchmod", 
  _[_.__NR_fchmodat = 53] = "__NR_fchmodat", _[_.__NR_fchownat = 54] = "__NR_fchownat", 
  _[_.__NR_fchown = 55] = "__NR_fchown", _[_.__NR_openat = 56] = "__NR_openat", _[_.__NR_close = 57] = "__NR_close", 
  _[_.__NR_vhangup = 58] = "__NR_vhangup", _[_.__NR_pipe2 = 59] = "__NR_pipe2", _[_.__NR_quotactl = 60] = "__NR_quotactl", 
  _[_.__NR_getdents64 = 61] = "__NR_getdents64", _[_.__NR3264_lseek = 62] = "__NR3264_lseek", 
  _[_.__NR_read = 63] = "__NR_read", _[_.__NR_write = 64] = "__NR_write", _[_.__NR_readv = 65] = "__NR_readv", 
  _[_.__NR_writev = 66] = "__NR_writev", _[_.__NR_pread64 = 67] = "__NR_pread64", 
  _[_.__NR_pwrite64 = 68] = "__NR_pwrite64", _[_.__NR_preadv = 69] = "__NR_preadv", 
  _[_.__NR_pwritev = 70] = "__NR_pwritev", _[_.__NR3264_sendfile = 71] = "__NR3264_sendfile", 
  _[_.__NR_pselect6 = 72] = "__NR_pselect6", _[_.__NR_ppoll = 73] = "__NR_ppoll", 
  _[_.__NR_signalfd4 = 74] = "__NR_signalfd4", _[_.__NR_vmsplice = 75] = "__NR_vmsplice", 
  _[_.__NR_splice = 76] = "__NR_splice", _[_.__NR_tee = 77] = "__NR_tee", _[_.__NR_readlinkat = 78] = "__NR_readlinkat", 
  _[_.__NR3264_fstatat = 79] = "__NR3264_fstatat", _[_.__NR3264_fstat = 80] = "__NR3264_fstat", 
  _[_.__NR_sync = 81] = "__NR_sync", _[_.__NR_fsync = 82] = "__NR_fsync", _[_.__NR_fdatasync = 83] = "__NR_fdatasync", 
  _[_.__NR_sync_file_range2 = 84] = "__NR_sync_file_range2", _[_.__NR_sync_file_range = 84] = "__NR_sync_file_range", 
  _[_.__NR_timerfd_create = 85] = "__NR_timerfd_create", _[_.__NR_timerfd_settime = 86] = "__NR_timerfd_settime", 
  _[_.__NR_timerfd_gettime = 87] = "__NR_timerfd_gettime", _[_.__NR_utimensat = 88] = "__NR_utimensat", 
  _[_.__NR_acct = 89] = "__NR_acct", _[_.__NR_capget = 90] = "__NR_capget", _[_.__NR_capset = 91] = "__NR_capset", 
  _[_.__NR_personality = 92] = "__NR_personality", _[_.__NR_exit = 93] = "__NR_exit", 
  _[_.__NR_exit_group = 94] = "__NR_exit_group", _[_.__NR_waitid = 95] = "__NR_waitid", 
  _[_.__NR_set_tid_address = 96] = "__NR_set_tid_address", _[_.__NR_unshare = 97] = "__NR_unshare", 
  _[_.__NR_futex = 98] = "__NR_futex", _[_.__NR_set_robust_list = 99] = "__NR_set_robust_list", 
  _[_.__NR_get_robust_list = 100] = "__NR_get_robust_list", _[_.__NR_nanosleep = 101] = "__NR_nanosleep", 
  _[_.__NR_getitimer = 102] = "__NR_getitimer", _[_.__NR_setitimer = 103] = "__NR_setitimer", 
  _[_.__NR_kexec_load = 104] = "__NR_kexec_load", _[_.__NR_init_module = 105] = "__NR_init_module", 
  _[_.__NR_delete_module = 106] = "__NR_delete_module", _[_.__NR_timer_create = 107] = "__NR_timer_create", 
  _[_.__NR_timer_gettime = 108] = "__NR_timer_gettime", _[_.__NR_timer_getoverrun = 109] = "__NR_timer_getoverrun", 
  _[_.__NR_timer_settime = 110] = "__NR_timer_settime", _[_.__NR_timer_delete = 111] = "__NR_timer_delete", 
  _[_.__NR_clock_settime = 112] = "__NR_clock_settime", _[_.__NR_clock_gettime = 113] = "__NR_clock_gettime", 
  _[_.__NR_clock_getres = 114] = "__NR_clock_getres", _[_.__NR_clock_nanosleep = 115] = "__NR_clock_nanosleep", 
  _[_.__NR_syslog = 116] = "__NR_syslog", _[_.__NR_ptrace = 117] = "__NR_ptrace", 
  _[_.__NR_sched_setparam = 118] = "__NR_sched_setparam", _[_.__NR_sched_setscheduler = 119] = "__NR_sched_setscheduler", 
  _[_.__NR_sched_getscheduler = 120] = "__NR_sched_getscheduler", _[_.__NR_sched_getparam = 121] = "__NR_sched_getparam", 
  _[_.__NR_sched_setaffinity = 122] = "__NR_sched_setaffinity", _[_.__NR_sched_getaffinity = 123] = "__NR_sched_getaffinity", 
  _[_.__NR_sched_yield = 124] = "__NR_sched_yield", _[_.__NR_sched_get_priority_max = 125] = "__NR_sched_get_priority_max", 
  _[_.__NR_sched_get_priority_min = 126] = "__NR_sched_get_priority_min", _[_.__NR_sched_rr_get_interval = 127] = "__NR_sched_rr_get_interval", 
  _[_.__NR_restart_syscall = 128] = "__NR_restart_syscall", _[_.__NR_kill = 129] = "__NR_kill", 
  _[_.__NR_tkill = 130] = "__NR_tkill", _[_.__NR_tgkill = 131] = "__NR_tgkill", _[_.__NR_sigaltstack = 132] = "__NR_sigaltstack", 
  _[_.__NR_rt_sigsuspend = 133] = "__NR_rt_sigsuspend", _[_.__NR_rt_sigaction = 134] = "__NR_rt_sigaction", 
  _[_.__NR_rt_sigprocmask = 135] = "__NR_rt_sigprocmask", _[_.__NR_rt_sigpending = 136] = "__NR_rt_sigpending", 
  _[_.__NR_rt_sigtimedwait = 137] = "__NR_rt_sigtimedwait", _[_.__NR_rt_sigqueueinfo = 138] = "__NR_rt_sigqueueinfo", 
  _[_.__NR_rt_sigreturn = 139] = "__NR_rt_sigreturn", _[_.__NR_setpriority = 140] = "__NR_setpriority", 
  _[_.__NR_getpriority = 141] = "__NR_getpriority", _[_.__NR_reboot = 142] = "__NR_reboot", 
  _[_.__NR_setregid = 143] = "__NR_setregid", _[_.__NR_setgid = 144] = "__NR_setgid", 
  _[_.__NR_setreuid = 145] = "__NR_setreuid", _[_.__NR_setuid = 146] = "__NR_setuid", 
  _[_.__NR_setresuid = 147] = "__NR_setresuid", _[_.__NR_getresuid = 148] = "__NR_getresuid", 
  _[_.__NR_setresgid = 149] = "__NR_setresgid", _[_.__NR_getresgid = 150] = "__NR_getresgid", 
  _[_.__NR_setfsuid = 151] = "__NR_setfsuid", _[_.__NR_setfsgid = 152] = "__NR_setfsgid", 
  _[_.__NR_times = 153] = "__NR_times", _[_.__NR_setpgid = 154] = "__NR_setpgid", 
  _[_.__NR_getpgid = 155] = "__NR_getpgid", _[_.__NR_getsid = 156] = "__NR_getsid", 
  _[_.__NR_setsid = 157] = "__NR_setsid", _[_.__NR_getgroups = 158] = "__NR_getgroups", 
  _[_.__NR_setgroups = 159] = "__NR_setgroups", _[_.__NR_uname = 160] = "__NR_uname", 
  _[_.__NR_sethostname = 161] = "__NR_sethostname", _[_.__NR_setdomainname = 162] = "__NR_setdomainname", 
  _[_.__NR_getrlimit = 163] = "__NR_getrlimit", _[_.__NR_setrlimit = 164] = "__NR_setrlimit", 
  _[_.__NR_getrusage = 165] = "__NR_getrusage", _[_.__NR_umask = 166] = "__NR_umask", 
  _[_.__NR_prctl = 167] = "__NR_prctl", _[_.__NR_getcpu = 168] = "__NR_getcpu", _[_.__NR_gettimeofday = 169] = "__NR_gettimeofday", 
  _[_.__NR_settimeofday = 170] = "__NR_settimeofday", _[_.__NR_adjtimex = 171] = "__NR_adjtimex", 
  _[_.__NR_getpid = 172] = "__NR_getpid", _[_.__NR_getppid = 173] = "__NR_getppid", 
  _[_.__NR_getuid = 174] = "__NR_getuid", _[_.__NR_geteuid = 175] = "__NR_geteuid", 
  _[_.__NR_getgid = 176] = "__NR_getgid", _[_.__NR_getegid = 177] = "__NR_getegid", 
  _[_.__NR_gettid = 178] = "__NR_gettid", _[_.__NR_sysinfo = 179] = "__NR_sysinfo", 
  _[_.__NR_mq_open = 180] = "__NR_mq_open", _[_.__NR_mq_unlink = 181] = "__NR_mq_unlink", 
  _[_.__NR_mq_timedsend = 182] = "__NR_mq_timedsend", _[_.__NR_mq_timedreceive = 183] = "__NR_mq_timedreceive", 
  _[_.__NR_mq_notify = 184] = "__NR_mq_notify", _[_.__NR_mq_getsetattr = 185] = "__NR_mq_getsetattr", 
  _[_.__NR_msgget = 186] = "__NR_msgget", _[_.__NR_msgctl = 187] = "__NR_msgctl", 
  _[_.__NR_msgrcv = 188] = "__NR_msgrcv", _[_.__NR_msgsnd = 189] = "__NR_msgsnd", 
  _[_.__NR_semget = 190] = "__NR_semget", _[_.__NR_semctl = 191] = "__NR_semctl", 
  _[_.__NR_semtimedop = 192] = "__NR_semtimedop", _[_.__NR_semop = 193] = "__NR_semop", 
  _[_.__NR_shmget = 194] = "__NR_shmget", _[_.__NR_shmctl = 195] = "__NR_shmctl", 
  _[_.__NR_shmat = 196] = "__NR_shmat", _[_.__NR_shmdt = 197] = "__NR_shmdt", _[_.__NR_socket = 198] = "__NR_socket", 
  _[_.__NR_socketpair = 199] = "__NR_socketpair", _[_.__NR_bind = 200] = "__NR_bind", 
  _[_.__NR_listen = 201] = "__NR_listen", _[_.__NR_accept = 202] = "__NR_accept", 
  _[_.__NR_connect = 203] = "__NR_connect", _[_.__NR_getsockname = 204] = "__NR_getsockname", 
  _[_.__NR_getpeername = 205] = "__NR_getpeername", _[_.__NR_sendto = 206] = "__NR_sendto", 
  _[_.__NR_recvfrom = 207] = "__NR_recvfrom", _[_.__NR_setsockopt = 208] = "__NR_setsockopt", 
  _[_.__NR_getsockopt = 209] = "__NR_getsockopt", _[_.__NR_shutdown = 210] = "__NR_shutdown", 
  _[_.__NR_sendmsg = 211] = "__NR_sendmsg", _[_.__NR_recvmsg = 212] = "__NR_recvmsg", 
  _[_.__NR_readahead = 213] = "__NR_readahead", _[_.__NR_brk = 214] = "__NR_brk", 
  _[_.__NR_munmap = 215] = "__NR_munmap", _[_.__NR_mremap = 216] = "__NR_mremap", 
  _[_.__NR_add_key = 217] = "__NR_add_key", _[_.__NR_request_key = 218] = "__NR_request_key", 
  _[_.__NR_keyctl = 219] = "__NR_keyctl", _[_.__NR_clone = 220] = "__NR_clone", _[_.__NR_execve = 221] = "__NR_execve", 
  _[_.__NR3264_mmap = 222] = "__NR3264_mmap", _[_.__NR3264_fadvise64 = 223] = "__NR3264_fadvise64", 
  _[_.__NR_swapon = 224] = "__NR_swapon", _[_.__NR_swapoff = 225] = "__NR_swapoff", 
  _[_.__NR_mprotect = 226] = "__NR_mprotect", _[_.__NR_msync = 227] = "__NR_msync", 
  _[_.__NR_mlock = 228] = "__NR_mlock", _[_.__NR_munlock = 229] = "__NR_munlock", 
  _[_.__NR_mlockall = 230] = "__NR_mlockall", _[_.__NR_munlockall = 231] = "__NR_munlockall", 
  _[_.__NR_mincore = 232] = "__NR_mincore", _[_.__NR_madvise = 233] = "__NR_madvise", 
  _[_.__NR_remap_file_pages = 234] = "__NR_remap_file_pages", _[_.__NR_mbind = 235] = "__NR_mbind", 
  _[_.__NR_get_mempolicy = 236] = "__NR_get_mempolicy", _[_.__NR_set_mempolicy = 237] = "__NR_set_mempolicy", 
  _[_.__NR_migrate_pages = 238] = "__NR_migrate_pages", _[_.__NR_move_pages = 239] = "__NR_move_pages", 
  _[_.__NR_rt_tgsigqueueinfo = 240] = "__NR_rt_tgsigqueueinfo", _[_.__NR_perf_event_open = 241] = "__NR_perf_event_open", 
  _[_.__NR_accept4 = 242] = "__NR_accept4", _[_.__NR_recvmmsg = 243] = "__NR_recvmmsg", 
  _[_.__NR_arch_specific_syscall = 244] = "__NR_arch_specific_syscall", _[_.__NR_wait4 = 260] = "__NR_wait4", 
  _[_.__NR_prlimit64 = 261] = "__NR_prlimit64", _[_.__NR_fanotify_init = 262] = "__NR_fanotify_init", 
  _[_.__NR_fanotify_mark = 263] = "__NR_fanotify_mark", _[_.__NR_name_to_handle_at = 264] = "__NR_name_to_handle_at", 
  _[_.__NR_open_by_handle_at = 265] = "__NR_open_by_handle_at", _[_.__NR_clock_adjtime = 266] = "__NR_clock_adjtime", 
  _[_.__NR_syncfs = 267] = "__NR_syncfs", _[_.__NR_setns = 268] = "__NR_setns", _[_.__NR_sendmmsg = 269] = "__NR_sendmmsg", 
  _[_.__NR_process_vm_readv = 270] = "__NR_process_vm_readv", _[_.__NR_process_vm_writev = 271] = "__NR_process_vm_writev", 
  _[_.__NR_kcmp = 272] = "__NR_kcmp", _[_.__NR_finit_module = 273] = "__NR_finit_module", 
  _[_.__NR_sched_setattr = 274] = "__NR_sched_setattr", _[_.__NR_sched_getattr = 275] = "__NR_sched_getattr", 
  _[_.__NR_renameat2 = 276] = "__NR_renameat2", _[_.__NR_seccomp = 277] = "__NR_seccomp", 
  _[_.__NR_getrandom = 278] = "__NR_getrandom", _[_.__NR_memfd_create = 279] = "__NR_memfd_create", 
  _[_.__NR_bpf = 280] = "__NR_bpf", _[_.__NR_execveat = 281] = "__NR_execveat", _[_.__NR_userfaultfd = 282] = "__NR_userfaultfd", 
  _[_.__NR_membarrier = 283] = "__NR_membarrier", _[_.__NR_mlock2 = 284] = "__NR_mlock2", 
  _[_.__NR_copy_file_range = 285] = "__NR_copy_file_range", _[_.__NR_preadv2 = 286] = "__NR_preadv2", 
  _[_.__NR_pwritev2 = 287] = "__NR_pwritev2", _[_.__NR_pkey_mprotect = 288] = "__NR_pkey_mprotect", 
  _[_.__NR_pkey_alloc = 289] = "__NR_pkey_alloc", _[_.__NR_pkey_free = 290] = "__NR_pkey_free", 
  _[_.__NR_statx = 291] = "__NR_statx", _[_.__NR_io_pgetevents = 292] = "__NR_io_pgetevents", 
  _[_.__NR_rseq = 293] = "__NR_rseq", _[_.__NR_kexec_file_load = 294] = "__NR_kexec_file_load", 
  _[_.__NR_clock_gettime64 = 403] = "__NR_clock_gettime64", _[_.__NR_clock_settime64 = 404] = "__NR_clock_settime64", 
  _[_.__NR_clock_adjtime64 = 405] = "__NR_clock_adjtime64", _[_.__NR_clock_getres_time64 = 406] = "__NR_clock_getres_time64", 
  _[_.__NR_clock_nanosleep_time64 = 407] = "__NR_clock_nanosleep_time64", _[_.__NR_timer_gettime64 = 408] = "__NR_timer_gettime64", 
  _[_.__NR_timer_settime64 = 409] = "__NR_timer_settime64", _[_.__NR_timerfd_gettime64 = 410] = "__NR_timerfd_gettime64", 
  _[_.__NR_timerfd_settime64 = 411] = "__NR_timerfd_settime64", _[_.__NR_utimensat_time64 = 412] = "__NR_utimensat_time64", 
  _[_.__NR_pselect6_time64 = 413] = "__NR_pselect6_time64", _[_.__NR_ppoll_time64 = 414] = "__NR_ppoll_time64", 
  _[_.__NR_io_pgetevents_time64 = 416] = "__NR_io_pgetevents_time64", _[_.__NR_recvmmsg_time64 = 417] = "__NR_recvmmsg_time64", 
  _[_.__NR_mq_timedsend_time64 = 418] = "__NR_mq_timedsend_time64", _[_.__NR_mq_timedreceive_time64 = 419] = "__NR_mq_timedreceive_time64", 
  _[_.__NR_semtimedop_time64 = 420] = "__NR_semtimedop_time64", _[_.__NR_rt_sigtimedwait_time64 = 421] = "__NR_rt_sigtimedwait_time64", 
  _[_.__NR_futex_time64 = 422] = "__NR_futex_time64", _[_.__NR_sched_rr_get_interval_time64 = 423] = "__NR_sched_rr_get_interval_time64", 
  _[_.__NR_pidfd_send_signal = 424] = "__NR_pidfd_send_signal", _[_.__NR_io_uring_setup = 425] = "__NR_io_uring_setup", 
  _[_.__NR_io_uring_enter = 426] = "__NR_io_uring_enter", _[_.__NR_io_uring_register = 427] = "__NR_io_uring_register", 
  _[_.__NR_open_tree = 428] = "__NR_open_tree", _[_.__NR_move_mount = 429] = "__NR_move_mount", 
  _[_.__NR_fsopen = 430] = "__NR_fsopen", _[_.__NR_fsconfig = 431] = "__NR_fsconfig", 
  _[_.__NR_fsmount = 432] = "__NR_fsmount", _[_.__NR_fspick = 433] = "__NR_fspick", 
  _[_.__NR_pidfd_open = 434] = "__NR_pidfd_open", _[_.__NR_clone3 = 435] = "__NR_clone3", 
  _[_.__NR_close_range = 436] = "__NR_close_range", _[_.__NR_openat2 = 437] = "__NR_openat2", 
  _[_.__NR_pidfd_getfd = 438] = "__NR_pidfd_getfd", _[_.__NR_faccessat2 = 439] = "__NR_faccessat2", 
  _[_.__NR_process_madvise = 440] = "__NR_process_madvise", _[_.__NR_epoll_pwait2 = 441] = "__NR_epoll_pwait2", 
  _[_.__NR_mount_setattr = 442] = "__NR_mount_setattr", _[_.__NR_quotactl_fd = 443] = "__NR_quotactl_fd", 
  _[_.__NR_landlock_create_ruleset = 444] = "__NR_landlock_create_ruleset", _[_.__NR_landlock_add_rule = 445] = "__NR_landlock_add_rule", 
  _[_.__NR_landlock_restrict_self = 446] = "__NR_landlock_restrict_self", _[_.__NR_memfd_secret = 447] = "__NR_memfd_secret", 
  _[_.__NR_process_mrelease = 448] = "__NR_process_mrelease", _[_.__NR_futex_waitv = 449] = "__NR_futex_waitv", 
  _[_.__NR_set_mempolicy_home_node = 450] = "__NR_set_mempolicy_home_node", _[_.__NR_cachestat = 451] = "__NR_cachestat", 
  _[_.__NR_fchmodat2 = 452] = "__NR_fchmodat2", _[_.__NR_map_shadow_stack = 453] = "__NR_map_shadow_stack", 
  _[_.__NR_futex_wake = 454] = "__NR_futex_wake", _[_.__NR_futex_wait = 455] = "__NR_futex_wait", 
  _[_.__NR_futex_requeue = 456] = "__NR_futex_requeue", _[_.__NR_statmount = 457] = "__NR_statmount", 
  _[_.__NR_listmount = 458] = "__NR_listmount", _[_.__NR_lsm_get_self_attr = 459] = "__NR_lsm_get_self_attr", 
  _[_.__NR_lsm_set_self_attr = 460] = "__NR_lsm_set_self_attr", _[_.__NR_lsm_list_modules = 461] = "__NR_lsm_list_modules", 
  _[_.__NR_syscalls = 462] = "__NR_syscalls", _[_.__NR_fcntl = 25] = "__NR_fcntl", 
  _[_.__NR_statfs = 43] = "__NR_statfs", _[_.__NR_fstatfs = 44] = "__NR_fstatfs", 
  _[_.__NR_truncate = 45] = "__NR_truncate", _[_.__NR_ftruncate = 46] = "__NR_ftruncate", 
  _[_.__NR_lseek = 62] = "__NR_lseek", _[_.__NR_sendfile = 71] = "__NR_sendfile", 
  _[_.__NR_newfstatat = 79] = "__NR_newfstatat", _[_.__NR_fstat = 80] = "__NR_fstat", 
  _[_.__NR_mmap = 222] = "__NR_mmap", _[_.__NR_fadvise64 = 223] = "__NR_fadvise64", 
  _[_.__NR_fcntl64 = 25] = "__NR_fcntl64", _[_.__NR_statfs64 = 43] = "__NR_statfs64", 
  _[_.__NR_fstatfs64 = 44] = "__NR_fstatfs64", _[_.__NR_truncate64 = 45] = "__NR_truncate64", 
  _[_.__NR_ftruncate64 = 46] = "__NR_ftruncate64", _[_.__NR_llseek = 62] = "__NR_llseek", 
  _[_.__NR_sendfile64 = 71] = "__NR_sendfile64", _[_.__NR_fstatat64 = 79] = "__NR_fstatat64", 
  _[_.__NR_fstat64 = 80] = "__NR_fstat64", _[_.__NR_mmap2 = 222] = "__NR_mmap2", _[_.__NR_fadvise64_64 = 223] = "__NR_fadvise64_64";
}(_ = exports.SYSCALL || (exports.SYSCALL = {}));

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ValueHandle = void 0;

class e {
  value_=NULL;
  constructor(e) {
    this.value_ = e;
  }
  get value() {
    return this.value_;
  }
  get Invalid_8() {
    return this.value_ > ptr(255);
  }
  get Invalid_16() {
    return this.value_ > ptr(65535);
  }
  get Invalid_32() {
    return this.value_ > ptr(4294967295);
  }
  get Invalid_64() {
    return this.value_ > ptr(0x10000000000000000);
  }
  ReadAs64() {
    return this.value_;
  }
  ReadAs32() {
    return this.Invalid_32 ? ptr(Memory.alloc(Process.pageSize).writePointer(this.value_).readU32()) : this.value_;
  }
  ReadAs16() {
    return this.Invalid_16 ? ptr(Memory.alloc(Process.pageSize).writePointer(this.value_).readU16()) : this.value_;
  }
  ReadAs8() {
    return this.Invalid_8 ? ptr(Memory.alloc(Process.pageSize).writePointer(this.value_).readU8()) : this.value_;
  }
}

exports.ValueHandle = e;

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.getArtMethodSpec = exports.getArtRuntimeSpec = void 0;

const e = require("./machine-code"), n = 4, t = Process.pointerSize, r = 1, o = 8, i = 16, l = 256, a = 524288, s = 2097152, d = 1073741824, u = 524288, c = 134217728, f = 1048576, p = 2097152, m = 268435456, g = 268435456, h = 0, v = 3 * t, b = 3 * t;

let I = null;

const T = 92, P = {
  exceptions: "propagate"
};

function S(e) {
  null === I && (I = new NativeFunction(Module.findExportByName("libc.so", "__system_property_get"), "int", [ "pointer", "pointer" ], P));
  const n = Memory.alloc(T);
  return I(Memory.allocUtf8String(e), n), n.readUtf8String();
}

function A() {
  return parseInt(S("ro.build.version.sdk"), 10);
}

function M() {
  return S("ro.build.version.codename");
}

let y = null;

function R(e, n) {
  if (null !== y) return y;
  const {classLinker: r, internTable: o} = n.offset, i = e.add(r).readPointer(), l = e.add(o).readPointer(), a = 4 === t ? 100 : 200, s = a + 100 * t, d = A();
  let u = null;
  for (let e = a; e !== s; e += t) {
    if (i.add(e).readPointer().equals(l)) {
      let n;
      n = d >= 30 || "R" === M() ? 6 : d >= 29 ? 4 : d >= 23 ? 3 : 5;
      const r = e + n * t;
      let o;
      o = d >= 23 ? r - 2 * t : r - 3 * t, u = {
        offset: {
          quickResolutionTrampoline: o,
          quickImtConflictTrampoline: r - t,
          quickGenericJniTrampoline: r,
          quickToInterpreterBridgeTrampoline: r + t
        }
      };
      break;
    }
  }
  return null !== u && (y = u), u;
}

function x(e) {
  if ("lea" !== e.mnemonic) return null;
  const n = e.operands[1].value.disp;
  return n < 256 || n > 1024 ? null : n;
}

function _(e) {
  if ("add.w" !== e.mnemonic) return null;
  const n = e.operands;
  if (3 !== n.length) return null;
  const t = n[2];
  return "imm" !== t.type ? null : t.value;
}

function k(e) {
  if ("add" !== e.mnemonic) return null;
  const n = e.operands;
  if (3 !== n.length) return null;
  if ("sp" === n[0].value || "sp" === n[1].value) return null;
  const t = n[2];
  if ("imm" !== t.type) return null;
  const r = t.value.valueOf();
  return r < 256 || r > 1024 ? null : r;
}

const C = {
  ia32: x,
  x64: x,
  arm: _,
  arm64: k
};

function J(n) {
  const t = n["art::Runtime::DeoptimizeBootImage"];
  return void 0 === t ? null : (0, e.parseInstructionsAt)(t, C[Process.arch], {
    limit: 30
  });
}

function w(e = Java.api) {
  const n = e.vm, r = e.artRuntime, o = 4 === t ? 200 : 384, i = o + 100 * t, l = A(), a = M();
  let s = null;
  for (let e = o; e !== i; e += t) {
    if (r.add(e).readPointer().equals(n)) {
      let n, o = null;
      l >= 33 || "Tiramisu" === a ? (n = [ e - 4 * t ], o = e - t) : l >= 30 || "R" === a ? (n = [ e - 3 * t, e - 4 * t ], 
      o = e - t) : n = l >= 29 ? [ e - 2 * t ] : l >= 27 ? [ e - v - 3 * t ] : [ e - v - 2 * t ];
      for (const e of n) {
        const n = e - t, i = n - t;
        let a;
        a = l >= 24 ? i - 8 * t : l >= 23 ? i - 7 * t : i - 4 * t;
        const d = {
          offset: {
            heap: a,
            threadList: i,
            internTable: n,
            classLinker: e,
            jniIdManager: o
          }
        };
        if (null !== R(r, d)) {
          s = d;
          break;
        }
      }
      break;
    }
  }
  if (null === s) throw new Error("Unable to determine Runtime field offsets");
  return s.offset.instrumentation = J(e), s.offset.jniIdsIndirection = z(), s;
}

function E(e) {
  return "cmp" === e.mnemonic ? e.operands[0].value.disp : null;
}

function U(e) {
  return "ldr.w" === e.mnemonic ? e.operands[1].value.disp : null;
}

function j(e, n) {
  if (null === n) return null;
  const {mnemonic: t} = e, {mnemonic: r} = n;
  return "cmp" === t && "ldr" === r || "bl" === t && "str" === r ? n.operands[1].value.disp : null;
}

exports.getArtRuntimeSpec = w;

const q = {
  ia32: E,
  x64: E,
  arm: U,
  arm64: j
};

function z() {
  const n = Module.findExportByName("libart.so", "_ZN3art7Runtime12SetJniIdTypeENS_9JniIdTypeE");
  if (null === n) return null;
  const t = (0, e.parseInstructionsAt)(n, q[Process.arch], {
    limit: 20
  });
  if (null === t) throw new Error("Unable to determine Runtime.jni_ids_indirection_ offset");
  return t;
}

function B(e) {
  const n = Java.api, t = w(n).offset, r = t.jniIdManager, o = t.jniIdsIndirection;
  if (null !== r && null !== o) {
    const t = n.artRuntime;
    if (t.add(o).readInt() !== h) {
      const o = t.add(r).readPointer();
      return n["art::jni::JniIdManager::DecodeMethodId"](o, e);
    }
  }
  return e;
}

function N() {
  let e;
  return Java.perform((() => {
    const n = Java.api, t = Java.vm.getEnv(), r = t.findClass("android/os/Process"), o = B(t.getStaticMethodId(r, "getElapsedCpuTime", "()J"));
    t.deleteLocalRef(r);
    const i = Process.getModuleByName("libandroid_runtime.so"), l = i.base, a = l.add(i.size), s = A(), d = s <= 21 ? 8 : Process.pointerSize;
    let u = null, c = null, f = 2;
    for (let e = 0; 64 !== e && 0 !== f; e += 4) {
      const n = o.add(e);
      if (null === u) {
        const t = n.readPointer();
        t.compare(l) >= 0 && t.compare(a) < 0 && (u = e, f--);
      }
      if (null === c) {
        281 == (2950692863 & n.readU32()) && (c = e, f--);
      }
    }
    if (0 !== f) throw new Error("Unable to determine ArtMethod field offsets");
    const p = u + d, m = s <= 21 ? p + 32 : p + Process.pointerSize;
    e = {
      size: m,
      offset: {
        jniCode: u,
        quickCode: p,
        accessFlags: c
      }
    }, "artInterpreterToCompiledCodeBridge" in n && (e.offset.interpreterCode = u - d);
  })), e;
}

exports.getArtMethodSpec = N, globalThis.getArtFieldSpec = e => ({
  declaringClass: e.add(0).readPointer(),
  accessFlags: e.add(t).readU32(),
  fieldDexIdx: e.add(t + 4).readU32(),
  offset: e.add(t + 8).readU32()
}), globalThis.getArtMethodSpec = N, globalThis.getAndroidSystemProperty = S, globalThis.getAndroidApiLevel = A, 
globalThis.getAndroidCodename = M, globalThis.getArtRuntimeSpec = w, globalThis.D = () => {
  Interceptor.detachAll();
};

},{"./machine-code":105}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.DefineClassHookManager = void 0;

const e = require("../implements/10/art/dexfile/DexFile"), n = require("./DexFileManager");

class t extends n.DexFileManager {
  static instance=null;
  constructor() {
    super();
  }
  static getInstance() {
    return null == t.instance && (t.instance = new t), t.instance;
  }
  get defineClassAddress() {
    return this.artSymbolFilter([ "ClassLinker", "DefineClass", "Thread", "DexFile" ]).address;
  }
  dexClassFiles=[];
  addDexClassFiles(e) {
    this.hasDexFile(e) || (this.dexClassFiles.push(e), this.dexClassFiles.forEach((e => {
      this.dexFiles.some((n => n.location == e.location)) || this.dexFiles.push(e);
    })));
  }
  static MD=new CModule('\n        #include <stdio.h>\n        #include <glib.h>\n        #include <gum/gumprocess.h>\n        #include <gum/guminterceptor.h>\n\n        extern void _frida_log(const gchar * message);\n\n        static void frida_log(const char * format, ...) {\n            gchar * message;\n            va_list args;\n            va_start (args, format);\n            message = g_strdup_vprintf (format, args);\n            va_end (args);\n            _frida_log (message);\n            g_free (message);\n        }\n\n        extern void gotDexFile(void* dexFile);\n\n        void(*it)(void* dexFile);\n\n        extern GHashTable *ptrHash;\n\n        void IterDexFile(void* callback) {\n            if (ptrHash == NULL) ptrHash = g_hash_table_new_full(g_direct_hash, g_direct_equal, NULL, NULL);\n            guint size = g_hash_table_size(ptrHash);\n            if (size == 0) {\n                frida_log("IterDexFile -> ptrHash is empty");\n            } else {\n                GHashTableIter iter;\n                gpointer key, value;\n                g_hash_table_iter_init(&iter, ptrHash);\n                while (g_hash_table_iter_next(&iter, &key, &value)) {\n                    ((void(*)(void*))callback)(key);\n                }\n            }\n        }\n\n        gboolean filterPtr(void* ptr) {\n            if (ptrHash == NULL) {\n                ptrHash = g_hash_table_new_full(g_direct_hash, g_direct_equal, NULL, NULL);\n            }\n            if (g_hash_table_contains(ptrHash, ptr)) {\n                // frida_log("Filter PASS -> %p", ptr);\n                return 0;\n            } else {\n                g_hash_table_add(ptrHash, ptr);\n                return 1;\n            }\n        }\n\n        void onEnter(GumInvocationContext *ctx) {\n            void* dexFile = gum_invocation_context_get_nth_argument(ctx,5);\n            if (filterPtr(dexFile)) {\n                gotDexFile(dexFile);\n            }\n        }\n\n    ', {
    ptrHash: Memory.alloc(Process.pointerSize),
    _frida_log: new NativeCallback((e => {
      LOGZ(e.readCString());
    }), "void", [ "pointer" ]),
    gotDexFile: new NativeCallback((n => {
      const s = new e.DexFile(n);
      t.getInstance().addDexClassFiles(s);
    }), "void", [ "pointer" ])
  });
  IterDexFile(n) {
    let s = NULL;
    s = null == n || null == n ? new NativeCallback((n => {
      const s = new e.DexFile(n);
      LOGD(`IterDexFile -> ${n} | ${s.location}`), t.getInstance().addDexClassFiles(s);
    }), "void", [ "pointer" ]) : new NativeCallback(n, "void", [ "pointer" ]), new NativeFunction(t.MD.IterDexFile, "void", [ "pointer" ])(s);
  }
  enableHook(n = !1) {
    n ? (LOGD("EnableHook -> DefineClassHookManager"), Interceptor.attach(this.defineClassAddress, {
      onEnter: function(s) {
        const i = new e.DexFile(s[5]);
        if (t.getInstance().addDexClassFiles(i), !n) return;
        let a = "ClassLinker::DefineClass(\n";
        a += `\tClassLinker* instance = ${s[0]}\n`, a += `\tThread* self = ${s[1]}\n`, a += `\tconst char* descriptor = ${s[2]} | ${s[2].readCString()}\n`, 
        a += `\tsize_t hash = ${s[3]}\n`, a += `\tHandle<mirror::ClassLoader> class_loader = ${s[4]}\n`, 
        a += `\tconst DexFile& dex_file = ${s[5]}\n`, a += `\tconst dex::ClassDef& dex_class_def = ${s[6]}\n`, 
        a += ")", this.passDis = a, this.needShow = !t.getInstance().hasDexFile(i);
      },
      onLeave: function(e) {
        this.needShow && n && (LOGD(this.passDis), LOGD(`retval [ ObjPtr<mirror::Class> ] = ${e}`), 
        newLine());
      }
    })) : Interceptor.attach(this.defineClassAddress, t.MD);
  }
}

exports.DefineClassHookManager = t, globalThis.IterDexFile = t.getInstance().IterDexFile.bind(t.getInstance());

},{"../implements/10/art/dexfile/DexFile":74,"./DexFileManager":29}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.DexFileManager = void 0;

const e = require("./SymbolManager");

class i extends e.SymbolManager {
  static dexFiles=[];
  constructor() {
    super();
  }
  get dexFiles() {
    return i.dexFiles;
  }
  addDexFile(e) {
    this.hasDexFile(e) || i.dexFiles.push(e);
  }
  removeDexFile(e) {
    i.dexFiles = i.dexFiles.filter((i => i != e));
  }
  hasDexFile(e) {
    return this.dexFiles.some((i => i == e));
  }
}

exports.DexFileManager = i;

const s = (e, i, s = !1) => {
  LOGD(`[${null == i ? "*" : i}] DexFile<${e.handle}>`), LOGZ(`\tlocation = ${e.location}`), 
  LOGZ(`\tchecksum = ${e.location_checksum} | is_compact_dex = ${e.is_compact_dex}`), 
  LOGZ(`\tbegin = ${e.begin} | size = ${e.size} | data_begin = ${e.data_begin} | data_size = ${e.data_size}`), 
  s && e.location.endsWith(".dex") && e.dump(), newLine();
}, l = (e, l = !0) => {
  let t = 0;
  LOGZ(`Waitting for dex files... \nInter ${i.dexFiles.length} dex files.`), i.dexFiles.forEach((i => {
    0 == t && clear(), l && !i.location.includes("/data/app/") || s(i, ++t, e);
  }));
};

globalThis.listDexFiles = (e = !0) => {
  l(!1, e);
}, globalThis.dumpDexFiles = (e = !0) => {
  l(!0, e);
};

},{"./SymbolManager":33}],30:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ExecuteSwitchImplCppManager = void 0;

const e = require("../implements/10/art/interpreter/SwitchImplContext"), t = require("../implements/10/art/Instrumentation/Instrumentation"), r = require("../implements/10/art/interpreter/interpreter"), i = require("../../tools/common"), c = require("../Utils/SymHelper");

class p {
  constructor() {}
  static get execute_switch_impl_cpp_1_0() {
    return (0, c.getSym)("_ZN3art11interpreter20ExecuteSwitchImplCppILb1ELb0EEEvPNS0_17SwitchImplContextE", "libart.so");
  }
  static get execute_switch_impl_cpp_0_1() {
    return (0, c.getSym)("_ZN3art11interpreter20ExecuteSwitchImplCppILb0ELb1EEEvPNS0_17SwitchImplContextE", "libart.so");
  }
  static get execute_switch_impl_cpp_1_1() {
    return (0, c.getSym)("_ZN3art11interpreter20ExecuteSwitchImplCppILb1ELb1EEEvPNS0_17SwitchImplContextE", "libart.so");
  }
  static get execute_switch_impl_cpp_0_0() {
    return (0, c.getSym)("_ZN3art11interpreter20ExecuteSwitchImplCppILb0ELb0EEEvPNS0_17SwitchImplContextE", "libart.so");
  }
  static onValueChanged(e, t) {
    "filterThreadId" != e && "filterMethodName" != e || (LOGZ(`ExecuteSwitchImplCpp Got New Value -> ${e} -> ${t}`), 
    "filterThreadId" == e && (p.filterThreadId = t), "filterMethodName" == e && (p.filterMethodName = t));
  }
  static get execute_functions() {
    return [ p.execute_switch_impl_cpp_1_0, p.execute_switch_impl_cpp_0_1, p.execute_switch_impl_cpp_1_1, p.execute_switch_impl_cpp_0_0 ].filter((e => null != e));
  }
  static filterThreadId=-1;
  static filterMethodName="";
  static enableHook() {
    r.interpreter.CanUseMterp = !0, t.Instrumentation.ForceInterpretOnly(), p.execute_functions.forEach((t => {
      Interceptor.attach(t, {
        onEnter: function(t) {
          const r = new e.SwitchImplContext(t[0]);
          if (r.shadow_frame.method.methodName.includes(p.filterMethodName) && -1 != p.filterThreadId && p.filterThreadId != Process.getCurrentThreadId()) {
            const e = `${Process.getCurrentThreadId()} ${r.self.GetThreadName()}`, t = r.shadow_frame.link.method, i = t ? t.PrettyMethod(!1) : "null", c = r.self.GetCurrentMethod().PrettyMethod(!1);
            LOGD(`${e} \n${i} -> ${c}`);
          }
        }
      });
    }));
  }
}

exports.ExecuteSwitchImplCppManager = p, setImmediate((() => {
  i.KeyValueStore.getInstance().subscribe(p);
}));

}).call(this)}).call(this,require("timers").setImmediate)

},{"../../tools/common":111,"../Utils/SymHelper":21,"../implements/10/art/Instrumentation/Instrumentation":41,"../implements/10/art/interpreter/SwitchImplContext":82,"../implements/10/art/interpreter/interpreter":84,"timers":155}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.linkerManager = void 0;

const n = require("../Utils/SymHelper");

class _ {
  static get linkerName() {
    return "arm" == Process.arch ? "linker" : "linker64";
  }
  static get linkerPath() {
    return Process.findModuleByName(_.linkerName).path;
  }
  static get call_array_address() {
    try {
      return (0, n.getSym)("__dl__ZL10call_arrayIPFviPPcS1_EEvPKcPT_jbS5_", _.linkerName);
    } catch (n) {
      return NULL;
    }
  }
  static get call_function_address() {
    try {
      return (0, n.getSym)("__dl__ZL13call_functionPKcPFviPPcS2_ES0_", _.linkerName);
    } catch (n) {
      return NULL;
    }
  }
  static getSoName(t) {
    return (0, n.callSym)("__dl__ZNK6soinfo10get_sonameEv", _.linkerName, "pointer", [ "pointer" ], t).readCString();
  }
  static cm_include="\n    #include <stdio.h>\n    #include <gum/gumprocess.h>\n    #include <gum/guminterceptor.h>\n    ";
  static cm_code="\n    #if defined(__LP64__)\n    #define USE_RELA 1\n    #endif\n     \n    // http://aosp.app/android-14.0.0_r1/xref/bionic/libc/include/link.h\n    #if defined(__LP64__)\n    #define ElfW(type) Elf64_ ## type\n    #else\n    #define ElfW(type) Elf32_ ## type\n    #endif\n     \n    // http://aosp.app/android-14.0.0_r1/xref/bionic/libc/kernel/uapi/asm-generic/int-ll64.h\n    typedef signed char __s8;\n    typedef unsigned char __u8;\n    typedef signed short __s16;\n    typedef unsigned short __u16;\n    typedef signed int __s32;\n    typedef unsigned int __u32;\n    typedef signed long long __s64;\n    typedef unsigned long long __u64;\n     \n    // http://aosp.app/android-14.0.0_r1/xref/bionic/libc/kernel/uapi/linux/elf.h\n    typedef __u32 Elf32_Addr;\n    typedef __u16 Elf32_Half;\n    typedef __u32 Elf32_Off;\n    typedef __s32 Elf32_Sword;\n    typedef __u32 Elf32_Word;\n    typedef __u64 Elf64_Addr;\n    typedef __u16 Elf64_Half;\n    typedef __s16 Elf64_SHalf;\n    typedef __u64 Elf64_Off;\n    typedef __s32 Elf64_Sword;\n    typedef __u32 Elf64_Word;\n    typedef __u64 Elf64_Xword;\n    typedef __s64 Elf64_Sxword;\n     \n    typedef struct dynamic {\n      Elf32_Sword d_tag;\n      union {\n        Elf32_Sword d_val;\n        Elf32_Addr d_ptr;\n      } d_un;\n    } Elf32_Dyn;\n    typedef struct {\n      Elf64_Sxword d_tag;\n      union {\n        Elf64_Xword d_val;\n        Elf64_Addr d_ptr;\n      } d_un;\n    } Elf64_Dyn;\n    typedef struct elf32_rel {\n      Elf32_Addr r_offset;\n      Elf32_Word r_info;\n    } Elf32_Rel;\n    typedef struct elf64_rel {\n      Elf64_Addr r_offset;\n      Elf64_Xword r_info;\n    } Elf64_Rel;\n    typedef struct elf32_rela {\n      Elf32_Addr r_offset;\n      Elf32_Word r_info;\n      Elf32_Sword r_addend;\n    } Elf32_Rela;\n    typedef struct elf64_rela {\n      Elf64_Addr r_offset;\n      Elf64_Xword r_info;\n      Elf64_Sxword r_addend;\n    } Elf64_Rela;\n    typedef struct elf32_sym {\n      Elf32_Word st_name;\n      Elf32_Addr st_value;\n      Elf32_Word st_size;\n      unsigned char st_info;\n      unsigned char st_other;\n      Elf32_Half st_shndx;\n    } Elf32_Sym;\n    typedef struct elf64_sym {\n      Elf64_Word st_name;\n      unsigned char st_info;\n      unsigned char st_other;\n      Elf64_Half st_shndx;\n      Elf64_Addr st_value;\n      Elf64_Xword st_size;\n    } Elf64_Sym;\n    typedef struct elf32_phdr {\n      Elf32_Word p_type;\n      Elf32_Off p_offset;\n      Elf32_Addr p_vaddr;\n      Elf32_Addr p_paddr;\n      Elf32_Word p_filesz;\n      Elf32_Word p_memsz;\n      Elf32_Word p_flags;\n      Elf32_Word p_align;\n    } Elf32_Phdr;\n    typedef struct elf64_phdr {\n      Elf64_Word p_type;\n      Elf64_Word p_flags;\n      Elf64_Off p_offset;\n      Elf64_Addr p_vaddr;\n      Elf64_Addr p_paddr;\n      Elf64_Xword p_filesz;\n      Elf64_Xword p_memsz;\n      Elf64_Xword p_align;\n    } Elf64_Phdr;\n     \n    // http://aosp.app/android-14.0.0_r1/xref/bionic/linker/linker_soinfo.h\n    typedef void (*linker_dtor_function_t)();\n    typedef void (*linker_ctor_function_t)(int, char**, char**);\n     \n    #if defined(__work_around_b_24465209__)\n    #define SOINFO_NAME_LEN 128\n    #endif\n     \n    typedef struct {\n      #if defined(__work_around_b_24465209__)\n        char old_name_[SOINFO_NAME_LEN];\n      #endif\n        const ElfW(Phdr)* phdr;\n        size_t phnum;\n      #if defined(__work_around_b_24465209__)\n        ElfW(Addr) unused0; // DO NOT USE, maintained for compatibility.\n      #endif\n        ElfW(Addr) base;\n        size_t size;\n       \n      #if defined(__work_around_b_24465209__)\n        uint32_t unused1;  // DO NOT USE, maintained for compatibility.\n      #endif\n       \n        ElfW(Dyn)* dynamic;\n       \n      #if defined(__work_around_b_24465209__)\n        uint32_t unused2; // DO NOT USE, maintained for compatibility\n        uint32_t unused3; // DO NOT USE, maintained for compatibility\n      #endif\n       \n        void* next;\n        uint32_t flags_;\n       \n        const char* strtab_;\n        ElfW(Sym)* symtab_;\n       \n        size_t nbucket_;\n        size_t nchain_;\n        uint32_t* bucket_;\n        uint32_t* chain_;\n       \n      #if !defined(__LP64__)\n        ElfW(Addr)** unused4; // DO NOT USE, maintained for compatibility\n      #endif\n       \n      #if defined(USE_RELA)\n        ElfW(Rela)* plt_rela_;\n        size_t plt_rela_count_;\n       \n        ElfW(Rela)* rela_;\n        size_t rela_count_;\n      #else\n        ElfW(Rel)* plt_rel_;\n        size_t plt_rel_count_;\n       \n        ElfW(Rel)* rel_;\n        size_t rel_count_;\n      #endif\n       \n        linker_ctor_function_t* preinit_array_;\n        size_t preinit_array_count_;\n       \n        linker_ctor_function_t* init_array_;\n        size_t init_array_count_;\n        linker_dtor_function_t* fini_array_;\n        size_t fini_array_count_;\n       \n        linker_ctor_function_t init_func_;\n        linker_dtor_function_t fini_func_;\n\n        // ...\n\n    } soinfo;\n\n    extern void onEnter_call_constructors(GumCpuContext *ctx, soinfo* si, const char* soName, linker_ctor_function_t* init_array, size_t init_array_count, linker_dtor_function_t* fini_array, size_t fini_array_count);\n\n    extern const char* get_soName(soinfo* si);\n\n    linker_ctor_function_t* get_init_array(soinfo* si) {\n        return si->init_array_;\n    }\n\n    size_t get_init_array_count(soinfo* si) {\n        return si->init_array_count_;\n    }\n\n    linker_dtor_function_t* get_fini_array(soinfo* si) {\n        return si->fini_array_;\n    }\n\n    size_t get_fini_array_count(soinfo* si) {\n        return si->fini_array_count_;\n    }\n\n    void onEnter(GumInvocationContext *ctx) {\n        soinfo* info = (soinfo*)gum_invocation_context_get_nth_argument(ctx,0);\n        onEnter_call_constructors(ctx->cpu_context, info, get_soName(info), get_init_array(info), get_init_array_count(info), get_fini_array(info), get_fini_array_count(info));\n    }\n\n    ";
  static cm=null;
  static MapMdCalled=new Map;
  static soLoadCallbacks=new Map;
  static addOnSoLoadCallback(n, _) {
    this.soLoadCallbacks.has(n) ? this.soLoadCallbacks.get(n).push(_) : this.soLoadCallbacks.set(n, [ _ ]);
  }
  static Hook_CallConstructors(t = 10, e = !0, r = !0) {
    "arm" == Process.arch ? _.cm_code = _.cm_include + "#define __work_around_b_24465209__ 1" + _.cm_code : _.cm_code = _.cm_include + "#define __LP64__ 1" + _.cm_code, 
    _.cm = new CModule(_.cm_code, {
      get_soName: (0, n.getSym)("__dl__ZNK6soinfo10get_sonameEv", _.linkerName),
      onEnter_call_constructors: new NativeCallback(((n, i, a, o, d, l, f) => {
        const s = a.readCString(), c = Process.findModuleByName(s);
        if (this.soLoadCallbacks.has(s) && this.soLoadCallbacks.get(s).forEach((n => n(c))), 
        r) {
          if (_.MapMdCalled.has(s)) {
            let n = _.MapMdCalled.get(s);
            return n++, void _.MapMdCalled.set(s, n);
          }
          _.MapMdCalled.set(s, 1);
        }
        if (LOGD(`call_constructors soName: ${s} `), 0 != d) {
          LOGD(`\tinit_array: ${o} | init_array_count: ${d}`);
          let n = "", _ = d > t ? t : d;
          for (let t = 0; t < _; t++) {
            let _ = o.add(t * Process.pointerSize).readPointer();
            n += `\t\t${DebugSymbol.fromAddress(_).toString()}\n`;
          }
          n = n.substring(0, n.length - 1), LOGD(`\tinit_array detail: \n${n}`), d > t && LOGZ(`\t\t... ${d - t} more ...\n`);
        } else LOGZ(`\tinit_array_count: ${d}`);
        if (e) if (0 != f) {
          LOGD(`\tfini_array: ${l} | fini_array_count: ${f}`);
          let n = "", _ = f > t ? t : f;
          for (let t = 0; t < _; t++) {
            let _ = l.add(t * Process.pointerSize).readPointer();
            n += `\t\t${DebugSymbol.fromAddress(_).toString()}\n`;
          }
          n = n.substring(0, n.length - 1), LOGD(`\tfini_array detail: \n${n}`), f > t && LOGZ(`\t\t... ${f - t} more ...\n`);
        } else LOGZ(`\tfini_array_count: ${f}`);
        LOGO("\n-----------------------------------------------------------\n");
      }), "void", [ "pointer", "pointer", "pointer", "pointer", "int", "pointer", "int" ])
    }), Interceptor.attach((0, n.getSym)("__dl__ZN6soinfo17call_constructorsEv", _.linkerName), _.cm);
  }
  static get_init_array_count(n) {
    return new NativeFunction(_.cm.get_init_array_count, "pointer", [ "pointer" ])(n);
  }
  static get_init_array(n) {
    const t = new NativeFunction(_.cm.get_init_array, "pointer", [ "pointer" ])(n), e = _.get_init_array_count(n).toUInt32(), r = [];
    for (let n = 0; n < e; n++) r.push(t.add(n * Process.pointerSize).readPointer());
    return r;
  }
  static get_fini_array_count(n) {
    return new NativeFunction(_.cm.get_fini_array_count, "pointer", [ "pointer" ])(n);
  }
  static get_fini_array(n) {
    const t = new NativeFunction(_.cm.get_fini_array, "pointer", [ "pointer" ])(n), e = _.get_fini_array_count(n).toUInt32(), r = [];
    for (let n = 0; n < e; n++) r.push(t.add(n * Process.pointerSize).readPointer());
    return r;
  }
}

exports.linkerManager = _, globalThis.linkerName = _.linkerName, globalThis.linkerPath = _.linkerPath, 
globalThis.call_array_address = _.call_array_address, globalThis.call_function_address = _.call_function_address;

},{"../Utils/SymHelper":21}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.OpenCommonHookManager = void 0;

const e = require("./DexFileManager");

class n extends e.DexFileManager {
  static instance=null;
  constructor() {
    super();
  }
  static getInstance() {
    return null == n.instance && (n.instance = new n), n.instance;
  }
  get openCommonAddress() {
    return this.dexfileSymbolFilter([ "DexFileLoader", "OpenCommon" ], [ "ArtDexFileLoader" ]).address;
  }
  enableHook() {
    LOGD("EnableHook -> OpenCommonHookManager"), Interceptor.attach(this.openCommonAddress, {
      onEnter: function(e) {
        let n = "DexFileLoader::OpenCommon(\n";
        n += `\tDexFileLoader instance = ${e[0]}\n`, n += `\tstd::shared_ptr<DexFileContainer> container = ${e[1]}\n`, 
        n += `\tconst uint8_t* base = ${e[2]}\n`, n += `\tsize_t size = ${e[3]}\n`, n += `\tconst std::string& location = ${e[4]}\n`, 
        n += `\tstd::optional<uint32_t> location_checksum = ${e[5]}\n`, n += `\tconst OatDexFile* oat_dex_file = ${e[6]}\n`, 
        n += `\tbool verify = ${e[7]}\n`, n += `\tbool verify_checksum = ${e[8]}\n`, n += `\tstd::string* error_msg = ${e[9]}\n`, 
        n += `\tDexFileLoaderErrorCode* error_code = ${e[10]}\n`, n += ")", this.passDis = n;
      },
      onLeave: function(e) {
        LOGD(this.passDis), LOGD(`retval [std::unique_ptr<DexFile>]: ${e}`), newLine();
      }
    });
  }
}

exports.OpenCommonHookManager = n;

},{"./DexFileManager":29}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.SymbolManager = void 0;

const e = require("../../tools/common"), t = require("../../tools/logger");

class l {
  static get artModule() {
    return Process.getModuleByName("libart.so");
  }
  static get artBaseAddress() {
    return Module.findBaseAddress("libart.so");
  }
  static get artSymbol() {
    return this.artModule.enumerateSymbols();
  }
  artSymbolFilter(e, t) {
    return l.symbolFilter(l.artSymbol, e, t);
  }
  static get dexDileModule() {
    return Process.getModuleByName("libdexfile.so");
  }
  static get dexfileAddress() {
    return Module.findBaseAddress("libdexfile.so");
  }
  static get dexfileSymbol() {
    return this.dexDileModule.enumerateSymbols();
  }
  dexfileSymbolFilter(e, t) {
    return l.symbolFilter(l.dexfileSymbol, e, t);
  }
  static SymbolFilter(e, t, r) {
    let o = null;
    if (null == e || null == e) {
      let e = l.symbolFilter(this.artSymbol, t, r, !1);
      if (null == e && (e = l.symbolFilter(this.dexfileSymbol, t, r, !1)), null == e) throw new Error("can not find symbol");
      return e;
    }
    return "string" == typeof e ? o = Process.getModuleByName(e) : e instanceof Module && (o = e), 
    l.symbolFilter(o.enumerateSymbols(), t);
  }
  static symbolFilter(l, r, o = [], s = !0) {
    let i = l.filter((e => r.every((t => -1 != e.name.indexOf(t)))));
    if (i = i.filter((e => o.every((t => -1 == e.name.indexOf(t))))), 0 == i.length && s) throw new Error("can not find symbol");
    return i.length > 1 && (e.DEBUG && (0, t.LOGW)(`find too many symbol, just ret first | size : ${i.length}`), 
    i.length < 5 && i.forEach((e => {
      LOGZ(JSON.stringify(e));
    }))), i[0];
  }
}

exports.SymbolManager = l;

},{"../../tools/common":111,"../../tools/logger":118}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.whenSoLoad = exports.logSoLoad = exports.waitSoLoad = void 0;

const o = require("../implements/10/art/Globals"), t = require("../../tools/common"), e = require("../Utils/libcfuncs"), n = (o, t = 10) => {
  (0, exports.whenSoLoad)(o, (() => {
    e.libC.sleep(t);
  }));
};

exports.waitSoLoad = n;

const a = () => (0, exports.whenSoLoad)(void 0);

exports.logSoLoad = a;

var l = new Map;

const i = (e, n, a, i = !0) => {
  const s = {
    onEnter: function(o) {
      this.path = "";
      try {
        this.path = String(o[0].readCString()), LOGD(this.path);
      } catch (o) {
        t.DEBUG && LOGE(o);
      }
      r(i, this.path) && null != this.path && this.path.includes(e) && null != n && n(e);
    },
    onLeave: function(o) {
      r(i, this.path) && null != this.path && this.path.includes(e) && null != a && a(e);
    }
  };
  function r(o, t) {
    if (o) return !l.has(t) && (l.set(t, !0), !0);
  }
  const h = Module.findExportByName(null, "dlopen"), p = Module.findExportByName(null, "android_dlopen_ext"), d = Memory.alloc(o.PointerSize);
  null != h && Interceptor.attach(h, s, d.writeInt(0)), null != p && Interceptor.attach(p, s, d.writeInt(1));
};

exports.whenSoLoad = i, globalThis.logSoLoad = exports.logSoLoad, globalThis.waitSoLoad = exports.waitSoLoad, 
globalThis.whenSoLoad = exports.whenSoLoad;

},{"../../tools/common":111,"../Utils/libcfuncs":24,"../implements/10/art/Globals":38}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./DefineClass"), require("./SymbolManager"), require("./DefineClass"), 
require("./OpenCommon"), require("./LinkerManager"), require("./ExecuteSwitchImplCpp"), 
require("./dlopen");

},{"./DefineClass":28,"./ExecuteSwitchImplCpp":30,"./LinkerManager":31,"./OpenCommon":32,"./SymbolManager":33,"./dlopen":34}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ClassLinker = void 0;

const e = require("../../../Utils/SymHelper"), i = require("../../../JSHandle"), _ = require("./Globals");

class t extends i.JSHandle {
  boot_class_path_=this.CurrentHandle;
  boot_dex_files_=this.boot_class_path_.add(_.PointerSize);
  dex_caches_=this.boot_dex_files_.add(_.PointerSize);
  class_loaders_=this.dex_caches_.add(_.PointerSize);
  boot_class_table_=this.class_loaders_.add(_.PointerSize);
  new_class_roots_=this.boot_class_table_.add(_.PointerSize);
  new_bss_roots_boot_oat_files_=this.new_class_roots_.add(_.PointerSize);
  failed_dex_cache_class_lookups_=this.new_bss_roots_boot_oat_files_.add(_.PointerSize);
  class_roots_=this.failed_dex_cache_class_lookups_.add(_.PointerSize);
  static kFindArrayCacheSize=ptr(16);
  find_array_class_cache_=this.class_roots_.add(4);
  find_array_class_cache_next_victim_=this.find_array_class_cache_.add(4);
  init_done_=this.find_array_class_cache_next_victim_.add(_.PointerSize);
  log_new_roots_=this.init_done_.add(_.PointerSize);
  fast_class_not_found_exceptions_=this.log_new_roots_.add(_.PointerSize);
  quick_resolution_trampoline_=this.fast_class_not_found_exceptions_.add(_.PointerSize);
  quick_imt_conflict_trampoline_=this.quick_resolution_trampoline_.add(_.PointerSize);
  quick_generic_jni_trampoline_=this.quick_imt_conflict_trampoline_.add(_.PointerSize);
  quick_to_interpreter_bridge_trampoline_=this.quick_generic_jni_trampoline_.add(_.PointerSize);
  image_pointer_size_=this.quick_to_interpreter_bridge_trampoline_.add(_.PointerSize);
  cha_=this.image_pointer_size_.add(_.PointerSize);
  constructor(e) {
    super(e);
  }
  get CurrentHandle() {
    return this.handle;
  }
  get SizeOfClass() {
    return this.cha_.add(_.PointerSize).sub(this.handle).toInt32();
  }
  toString() {
    return `ClassLinker<${this.handle}>`;
  }
  IsReadOnly() {
    return (0, e.callSym)("_ZNK3art7DexFile10IsReadOnlyEv", "libdexfile.so", "bool", [ "pointer" ], this.handle);
  }
  LookupClass(i, _) {
    return (0, e.callSym)("_ZN3art11ClassLinker11LookupClassEPNS_6ThreadEPKcNS_6ObjPtrINS_6mirror11ClassLoaderEEE", "libart.so", "pointer", [ "pointer", "pointer", "pointer" ], this.handle, Memory.allocUtf8String(i), _);
  }
}

exports.ClassLinker = t;

},{"../../../JSHandle":13,"../../../Utils/SymHelper":21,"./Globals":38}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.GcRoot = void 0;

const t = require("../../../JSHandle");

class e extends t.JSHandle {
  static Size=4;
  lsthandle;
  _factory;
  constructor(t, e) {
    super(e.readU32()), this.lsthandle = e, this._factory = t;
  }
  get root() {
    return this._factory(this.handle);
  }
  toString() {
    return `GcRoot<(read32)${this.lsthandle} -> ${this.handle}>`;
  }
}

exports.GcRoot = e;

},{"../../../JSHandle":13}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.PointerSize = exports.Arch = exports.kInsnsSizeBits = exports.kInsnsSizeShift = exports.kFlagPreHeaderInsnsSize = exports.kFlagPreHeaderTriesSize = exports.kFlagPreHeaderOutsSize = exports.kFlagPreHeaderInsSize = exports.kFlagPreHeaderRegisterSize = exports.kTriesSizeSizeShift = exports.kOutsSizeShift = exports.kInsSizeShift = exports.kRegistersSizeShift = exports.kBitsPerByte = void 0, 
exports.kBitsPerByte = 8, exports.kRegistersSizeShift = ptr(12), exports.kInsSizeShift = ptr(8), 
exports.kOutsSizeShift = ptr(4), exports.kTriesSizeSizeShift = ptr(0), exports.kFlagPreHeaderRegisterSize = ptr(1).shl(0), 
exports.kFlagPreHeaderInsSize = ptr(1).shl(1), exports.kFlagPreHeaderOutsSize = ptr(1).shl(2), 
exports.kFlagPreHeaderTriesSize = ptr(1).shl(3), exports.kFlagPreHeaderInsnsSize = ptr(1).shl(4), 
exports.kInsnsSizeShift = 5, exports.kInsnsSizeBits = 16 * exports.kBitsPerByte - exports.kInsnsSizeShift, 
exports.Arch = Process.arch, exports.PointerSize = Process.pointerSize;

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ArtInstruction = void 0;

const t = require("../../../JSHandle"), e = require("../../../../tools/StdString"), n = require("../../../Utils/SymHelper"), r = require("./Instrumentation/InstructionList"), i = require("console"), s = !1;

class o extends t.JSHandleNotImpl {
  constructor(t) {
    super(t);
  }
  toString() {
    let t = `ArtInstruction<${this.handle}>`;
    return this.handle.isNull() || (t += `\n\t SizeInCodeUnits=${this.SizeInCodeUnits}`, 
    t += `\n\t DumpHexLE=${this.dumpHexLE()}`), t;
  }
  static cached_kInstructionNames=[];
  static get kInstructionNames() {
    if (o.cached_kInstructionNames.length > 0) return o.cached_kInstructionNames;
    let t = [], e = (0, n.getSym)("_ZN3art11Instruction17kInstructionNamesE", "libdexfile.so", !0);
    for (;!e.readPointer().isNull(); ) t.push(e.readPointer().readCString()), e = e.add(Process.pointerSize);
    return o.cached_kInstructionNames = new Array(...t), t;
  }
  static cached_kInstructionDescriptors=[];
  static get kInstructionDescriptors() {
    try {
      if (o.cached_kInstructionDescriptors.length > 0) return o.cached_kInstructionDescriptors;
      const t = (0, n.getSym)("_ZN3art11Instruction23kInstructionDescriptorsE", "libdexfile.so", !0), e = [];
      let r = t, i = 255;
      for (;i-- > 0; ) e.push(new a(r)), r = r.add(a.SizeOfClass);
      return o.cached_kInstructionDescriptors = new Array(...e), e;
    } catch (t) {
      LOGE(`NOT SUPPORT ANDROID VERSION \n${t}`);
    }
  }
  static cached_kInstructionDescriptorsMap=[];
  static get InstructionGroup() {
    if (o.cached_kInstructionDescriptorsMap.length > 0) return o.cached_kInstructionDescriptorsMap;
    let t = [];
    return o.kInstructionDescriptors.forEach(((e, n) => {
      t.push([ o.kInstructionNames[n], e ]);
    })), o.cached_kInstructionDescriptorsMap = new Array(...t), t;
  }
  dumpString(t) {
    return e.StdString.fromPointers((0, n.callSym)("_ZNK3art11Instruction10DumpStringEPKNS_7DexFileE", "libdexfile.so", [ "pointer", "pointer", "pointer" ], [ "pointer", "pointer" ], this, t));
  }
  dumpHex(t = 3) {
    return e.StdString.fromPointers((0, n.callSym)("_ZNK3art11Instruction7DumpHexEm", "libdexfile.so", [ "pointer", "pointer", "pointer" ], [ "pointer", "pointer" ], this.handle, t));
  }
  dumpHexLE(t = 3) {
    const r = this.SizeInCodeUnits / 2;
    return `${r} - ${e.StdString.fromPointers((0, n.callSym)("_ZNK3art11Instruction9DumpHexLEEm", "libdexfile.so", [ "pointer", "pointer", "pointer" ], [ "pointer", "int" ], this.handle, r > t ? r : t))}`;
  }
  sizeInCodeUnitsComplexOpcode() {
    return (0, n.callSym)("_ZNK3art11Instruction28SizeInCodeUnitsComplexOpcodeEv", "libdexfile.so", [ "pointer" ], [ "pointer" ], this.handle);
  }
  static At(t) {
    return new o(t);
  }
  RelativeAt(t) {
    return o.At(this.handle.add(t));
  }
  Next() {
    return this.RelativeAt(this.SizeInCodeUnits);
  }
  clone() {
    var t = Memory.alloc(this.SizeInCodeUnits);
    return Memory.copy(t, this.handle, this.SizeInCodeUnits), o.At(t);
  }
  get current() {
    return this.handle;
  }
  get SizeInCodeUnits() {
    const t = this.Fetch16();
    let e = o.InstructionGroup[t][1].size_in_code_units;
    return e < 0 ? 2 * this.sizeInCodeUnitsComplexOpcode() : 2 * e;
  }
  Fetch16(t = 0) {
    return this.handle.add(t).readU8();
  }
  get opcode() {
    return this.Fetch16();
  }
  get opName_RunTime() {
    return (0, i.assert)(this.opcode < o.kInstructionNames.length, `opcode ${this.opcode} out of range`), 
    o.kInstructionNames[this.opcode];
  }
  get opName() {
    return (0, i.assert)(this.opcode < o.kInstructionNames.length, `opcode ${this.opcode} out of range`), 
    r.Opcode.getOpName(this.opcode);
  }
}

exports.ArtInstruction = o;

class a extends t.JSHandleNotImpl {
  verify_flags_=this.handle;
  format_=this.verify_flags_.add(4);
  index_type_=this.format_.add(1);
  flags_=this.index_type_.add(1);
  size_in_code_units_=this.flags_.add(1);
  toString() {
    return `InstructionDescriptor<${this.handle}> | format: ${this.format.name} @ ${this.format.handle} | size_in_code_units: ${this.size_in_code_units} @ `;
  }
  static get SizeOfClass() {
    return ptr(4).add(1).add(1).add(1).add(1);
  }
  get verify_flags() {
    return this.verify_flags_.readU32();
  }
  get format() {
    return new u(this.format_.readU8());
  }
  get index_type() {
    return new c(this.index_type_.readU8());
  }
  get flags() {
    return new d(this.flags_.readU8());
  }
  get size_in_code_units() {
    return this.size_in_code_units_.readS8();
  }
}

class d extends t.JSHandle {
  enumMap=new Map([ [ 1, "kBranch" ], [ 2, "kContinue" ], [ 4, "kSwitch" ], [ 8, "kThrow" ], [ 16, "kReturn" ], [ 32, "kInvoke" ], [ 64, "kUnconditional" ], [ 128, "kExperimental" ] ]);
  flags=this.CurrentHandle.toInt32();
  get name() {
    return this.enumMap.get(this.flags) || "unknown";
  }
  get value() {
    return this.flags;
  }
  get value_ptr() {
    return ptr(this.value);
  }
}

class c extends t.JSHandle {
  enumMap=new Map([ [ 0, "kIndexUnknown" ], [ 1, "kIndexNone" ], [ 2, "kIndexTypeRef" ], [ 3, "kIndexStringRef" ], [ 4, "kIndexMethodRef" ], [ 5, "kIndexFieldRef" ], [ 6, "kIndexFieldOffset" ], [ 7, "kIndexVtableOffset" ], [ 8, "kIndexMethodAndProtoRef" ], [ 9, "kIndexCallSiteRef" ], [ 10, "kIndexMethodHandleRef" ], [ 11, "kIndexProtoRef" ] ]);
  index_type=this.CurrentHandle.toInt32();
  get name() {
    return this.enumMap.get(this.index_type) || "unknown";
  }
  get value() {
    return this.index_type;
  }
  get value_ptr() {
    return ptr(this.value);
  }
}

class u extends t.JSHandle {
  enumMap=new Map([ [ 0, "k10x" ], [ 1, "k12x" ], [ 2, "k11n" ], [ 3, "k11x" ], [ 4, "k10t" ], [ 5, "k20t" ], [ 6, "k22x" ], [ 7, "k21t" ], [ 8, "k21s" ], [ 9, "k21h" ], [ 10, "k21c" ], [ 11, "k23x" ], [ 12, "k22b" ], [ 13, "k22t" ], [ 14, "k22s" ], [ 15, "k22c" ], [ 16, "k32x" ], [ 17, "k30t" ], [ 18, "k31t" ], [ 19, "k31i" ], [ 20, "k31c" ], [ 21, "k35c" ], [ 22, "k3rc" ], [ 23, "k45cc" ], [ 24, "k4rcc" ], [ 25, "k51l" ] ]);
  format=this.CurrentHandle.toUInt32();
  get name() {
    return this.enumMap.get(this.format) || "unknown";
  }
  get value() {
    return this.format;
  }
  get value_ptr() {
    return ptr(this.value);
  }
}

globalThis.InstructionGroup = () => o.InstructionGroup, Reflect.set(globalThis, "ArtInstruction", o);

},{"../../../../tools/StdString":110,"../../../JSHandle":13,"../../../Utils/SymHelper":21,"./Instrumentation/InstructionList":40,"console":128}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.Opcode = void 0;

class t {
  static NOP=0;
  static MOVE=1;
  static MOVE_FROM16=2;
  static MOVE_16=3;
  static MOVE_WIDE=4;
  static MOVE_WIDE_FROM16=5;
  static MOVE_WIDE_16=6;
  static MOVE_OBJECT=7;
  static MOVE_OBJECT_FROM16=8;
  static MOVE_OBJECT_16=9;
  static MOVE_RESULT=10;
  static MOVE_RESULT_WIDE=11;
  static MOVE_RESULT_OBJECT=12;
  static MOVE_EXCEPTION=13;
  static RETURN_VOID=14;
  static RETURN=15;
  static RETURN_WIDE=16;
  static RETURN_OBJECT=17;
  static CONST_4=18;
  static CONST_16=19;
  static CONST=20;
  static CONST_HIGH16=21;
  static CONST_WIDE_16=22;
  static CONST_WIDE_32=23;
  static CONST_WIDE=24;
  static CONST_WIDE_HIGH16=25;
  static CONST_STRING=26;
  static CONST_STRING_JUMBO=27;
  static CONST_CLASS=28;
  static MONITOR_ENTER=29;
  static MONITOR_EXIT=30;
  static CHECK_CAST=31;
  static INSTANCE_OF=32;
  static ARRAY_LENGTH=33;
  static NEW_INSTANCE=34;
  static NEW_ARRAY=35;
  static FILLED_NEW_ARRAY=36;
  static FILLED_NEW_ARRAY_RANGE=37;
  static FILL_ARRAY_DATA=38;
  static THROW=39;
  static GOTO=40;
  static GOTO_16=41;
  static GOTO_32=42;
  static PACKED_SWITCH=43;
  static SPARSE_SWITCH=44;
  static CMPL_FLOAT=45;
  static CMPG_FLOAT=46;
  static CMPL_DOUBLE=47;
  static CMPG_DOUBLE=48;
  static CMP_LONG=49;
  static IF_EQ=50;
  static IF_NE=51;
  static IF_LT=52;
  static IF_GE=53;
  static IF_GT=54;
  static IF_LE=55;
  static IF_EQZ=56;
  static IF_NEZ=57;
  static IF_LTZ=58;
  static IF_GEZ=59;
  static IF_GTZ=60;
  static IF_LEZ=61;
  static UNUSED_3E=62;
  static UNUSED_3F=63;
  static UNUSED_40=64;
  static UNUSED_41=65;
  static UNUSED_42=66;
  static UNUSED_43=67;
  static AGET=68;
  static AGET_WIDE=69;
  static AGET_OBJECT=70;
  static AGET_BOOLEAN=71;
  static AGET_BYTE=72;
  static AGET_CHAR=73;
  static AGET_SHORT=74;
  static APUT=75;
  static APUT_WIDE=76;
  static APUT_OBJECT=77;
  static APUT_BOOLEAN=78;
  static APUT_BYTE=79;
  static APUT_CHAR=80;
  static APUT_SHORT=81;
  static IGET=82;
  static IGET_WIDE=83;
  static IGET_OBJECT=84;
  static IGET_BOOLEAN=85;
  static IGET_BYTE=86;
  static IGET_CHAR=87;
  static IGET_SHORT=88;
  static IPUT=89;
  static IPUT_WIDE=90;
  static IPUT_OBJECT=91;
  static IPUT_BOOLEAN=92;
  static IPUT_BYTE=93;
  static IPUT_CHAR=94;
  static IPUT_SHORT=95;
  static SGET=96;
  static SGET_WIDE=97;
  static SGET_OBJECT=98;
  static SGET_BOOLEAN=99;
  static SGET_BYTE=100;
  static SGET_CHAR=101;
  static SGET_SHORT=102;
  static SPUT=103;
  static SPUT_WIDE=104;
  static SPUT_OBJECT=105;
  static SPUT_BOOLEAN=106;
  static SPUT_BYTE=107;
  static SPUT_CHAR=108;
  static SPUT_SHORT=109;
  static INVOKE_VIRTUAL=110;
  static INVOKE_SUPER=111;
  static INVOKE_DIRECT=112;
  static INVOKE_STATIC=113;
  static INVOKE_INTERFACE=114;
  static UNUSED_73=115;
  static INVOKE_VIRTUAL_RANGE=116;
  static INVOKE_SUPER_RANGE=117;
  static INVOKE_DIRECT_RANGE=118;
  static INVOKE_STATIC_RANGE=119;
  static INVOKE_INTERFACE_RANGE=120;
  static UNUSED_79=121;
  static UNUSED_7A=122;
  static NEG_INT=123;
  static NOT_INT=124;
  static NEG_LONG=125;
  static NOT_LONG=126;
  static NEG_FLOAT=127;
  static NEG_DOUBLE=128;
  static INT_TO_LONG=129;
  static INT_TO_FLOAT=130;
  static INT_TO_DOUBLE=131;
  static LONG_TO_INT=132;
  static LONG_TO_FLOAT=133;
  static LONG_TO_DOUBLE=134;
  static FLOAT_TO_INT=135;
  static FLOAT_TO_LONG=136;
  static FLOAT_TO_DOUBLE=137;
  static DOUBLE_TO_INT=138;
  static DOUBLE_TO_LONG=139;
  static DOUBLE_TO_FLOAT=140;
  static INT_TO_BYTE=141;
  static INT_TO_CHAR=142;
  static INT_TO_SHORT=143;
  static ADD_INT=144;
  static SUB_INT=145;
  static MUL_INT=146;
  static DIV_INT=147;
  static REM_INT=148;
  static AND_INT=149;
  static OR_INT=150;
  static XOR_INT=151;
  static SHL_INT=152;
  static SHR_INT=153;
  static USHR_INT=154;
  static ADD_LONG=155;
  static SUB_LONG=156;
  static MUL_LONG=157;
  static DIV_LONG=158;
  static REM_LONG=159;
  static AND_LONG=160;
  static OR_LONG=161;
  static XOR_LONG=162;
  static SHL_LONG=163;
  static SHR_LONG=164;
  static USHR_LONG=165;
  static ADD_FLOAT=166;
  static SUB_FLOAT=167;
  static MUL_FLOAT=168;
  static DIV_FLOAT=169;
  static REM_FLOAT=170;
  static ADD_DOUBLE=171;
  static SUB_DOUBLE=172;
  static MUL_DOUBLE=173;
  static DIV_DOUBLE=174;
  static REM_DOUBLE=175;
  static ADD_INT_2ADDR=176;
  static SUB_INT_2ADDR=177;
  static MUL_INT_2ADDR=178;
  static DIV_INT_2ADDR=179;
  static REM_INT_2ADDR=180;
  static AND_INT_2ADDR=181;
  static OR_INT_2ADDR=182;
  static XOR_INT_2ADDR=183;
  static SHL_INT_2ADDR=184;
  static SHR_INT_2ADDR=185;
  static USHR_INT_2ADDR=186;
  static ADD_LONG_2ADDR=187;
  static SUB_LONG_2ADDR=188;
  static MUL_LONG_2ADDR=189;
  static DIV_LONG_2ADDR=190;
  static REM_LONG_2ADDR=191;
  static AND_LONG_2ADDR=192;
  static OR_LONG_2ADDR=193;
  static XOR_LONG_2ADDR=194;
  static SHL_LONG_2ADDR=195;
  static SHR_LONG_2ADDR=196;
  static USHR_LONG_2ADDR=197;
  static ADD_FLOAT_2ADDR=198;
  static SUB_FLOAT_2ADDR=199;
  static MUL_FLOAT_2ADDR=200;
  static DIV_FLOAT_2ADDR=201;
  static REM_FLOAT_2ADDR=202;
  static ADD_DOUBLE_2ADDR=203;
  static SUB_DOUBLE_2ADDR=204;
  static MUL_DOUBLE_2ADDR=205;
  static DIV_DOUBLE_2ADDR=206;
  static REM_DOUBLE_2ADDR=207;
  static ADD_INT_LIT16=208;
  static RSUB_INT=209;
  static MUL_INT_LIT16=210;
  static DIV_INT_LIT16=211;
  static REM_INT_LIT16=212;
  static AND_INT_LIT16=213;
  static OR_INT_LIT16=214;
  static XOR_INT_LIT16=215;
  static ADD_INT_LIT8=216;
  static RSUB_INT_LIT8=217;
  static MUL_INT_LIT8=218;
  static DIV_INT_LIT8=219;
  static REM_INT_LIT8=220;
  static AND_INT_LIT8=221;
  static OR_INT_LIT8=222;
  static XOR_INT_LIT8=223;
  static SHL_INT_LIT8=224;
  static SHR_INT_LIT8=225;
  static USHR_INT_LIT8=226;
  static UNUSED_E3=227;
  static UNUSED_E4=228;
  static UNUSED_E5=229;
  static UNUSED_E6=230;
  static UNUSED_E7=231;
  static UNUSED_E8=232;
  static UNUSED_E9=233;
  static UNUSED_EA=234;
  static UNUSED_EB=235;
  static UNUSED_EC=236;
  static UNUSED_ED=237;
  static UNUSED_EE=238;
  static UNUSED_EF=239;
  static UNUSED_F0=240;
  static UNUSED_F1=241;
  static UNUSED_F2=242;
  static UNUSED_F3=243;
  static UNUSED_F4=244;
  static UNUSED_F5=245;
  static UNUSED_F6=246;
  static UNUSED_F7=247;
  static UNUSED_F8=248;
  static UNUSED_F9=249;
  static INVOKE_POLYMORPHIC=250;
  static INVOKE_POLYMORPHIC_RANGE=251;
  static INVOKE_CUSTOM=252;
  static INVOKE_CUSTOM_RANGE=253;
  static CONST_METHOD_HANDLE=254;
  static CONST_METHOD_TYPE=255;
  static CONST_CLASS_JUMBO=255;
  static CHECK_CAST_JUMBO=511;
  static INSTANCE_OF_JUMBO=767;
  static NEW_INSTANCE_JUMBO=1023;
  static NEW_ARRAY_JUMBO=1279;
  static FILLED_NEW_ARRAY_JUMBO=1535;
  static IGET_JUMBO=1791;
  static IGET_WIDE_JUMBO=2047;
  static IGET_OBJECT_JUMBO=2303;
  static IGET_BOOLEAN_JUMBO=2559;
  static IGET_BYTE_JUMBO=2815;
  static IGET_CHAR_JUMBO=3071;
  static IGET_SHORT_JUMBO=3327;
  static IPUT_JUMBO=3583;
  static IPUT_WIDE_JUMBO=3839;
  static IPUT_OBJECT_JUMBO=4095;
  static IPUT_BOOLEAN_JUMBO=4351;
  static IPUT_BYTE_JUMBO=4607;
  static IPUT_CHAR_JUMBO=4863;
  static IPUT_SHORT_JUMBO=5119;
  static SGET_JUMBO=5375;
  static SGET_WIDE_JUMBO=5631;
  static SGET_OBJECT_JUMBO=5887;
  static SGET_BOOLEAN_JUMBO=6143;
  static SGET_BYTE_JUMBO=6399;
  static SGET_CHAR_JUMBO=6655;
  static SGET_SHORT_JUMBO=6911;
  static SPUT_JUMBO=7167;
  static SPUT_WIDE_JUMBO=7423;
  static SPUT_OBJECT_JUMBO=7679;
  static SPUT_BOOLEAN_JUMBO=7935;
  static SPUT_BYTE_JUMBO=8191;
  static SPUT_CHAR_JUMBO=8447;
  static SPUT_SHORT_JUMBO=8703;
  static INVOKE_VIRTUAL_JUMBO=8959;
  static INVOKE_SUPER_JUMBO=9215;
  static INVOKE_DIRECT_JUMBO=9471;
  static INVOKE_STATIC_JUMBO=9727;
  static INVOKE_INTERFACE_JUMBO=9983;
  static getOpName(t) {
    return Object.getOwnPropertyNames(this).find((_ => this[_] === t)) || "UNKNOWN";
  }
}

exports.Opcode = t, Reflect.set(globalThis, "OpCode", t);

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.Instrumentation = void 0;

const e = require("./InstrumentationListener"), t = require("../../../../android"), _ = require("../../../../Utils/SymHelper"), n = require("../../../../JSHandle");

class s extends n.JSHandle {
  instrumentation_stubs_installed_=this.CurrentHandle;
  entry_exit_stubs_installed_=this.instrumentation_stubs_installed_.add(1);
  interpreter_stubs_installed_=this.entry_exit_stubs_installed_.add(1);
  interpret_only_=this.interpreter_stubs_installed_.add(1);
  forced_interpret_only_=this.interpret_only_.add(1);
  have_method_entry_listeners_=this.forced_interpret_only_.add(1);
  have_method_exit_listeners_=this.have_method_entry_listeners_.add(1);
  have_method_unwind_listeners_=this.have_method_exit_listeners_.add(1);
  have_dex_pc_listeners_=this.have_method_unwind_listeners_.add(1);
  have_field_read_listeners_=this.have_dex_pc_listeners_.add(1);
  have_field_write_listeners_=this.have_field_read_listeners_.add(1);
  have_exception_thrown_listeners_=this.have_field_write_listeners_.add(1);
  have_watched_frame_pop_listeners_=this.have_exception_thrown_listeners_.add(1);
  have_branch_listeners_=this.have_watched_frame_pop_listeners_.add(1);
  have_exception_handled_listeners_=this.have_branch_listeners_.add(1);
  requested_instrumentation_levels_=this.have_exception_handled_listeners_.add(1);
  constructor(e) {
    super(e);
  }
  static get Instance() {
    const e = Java.api.artRuntime.add((0, t.getArtRuntimeSpec)().offset.instrumentation);
    return new s(e);
  }
  toString() {
    let e = `Instrumentation< ${this.handle} >`;
    return this.handle.isNull() || (e += `\n\t instrumentation_stubs_installed=${this.instrumentation_stubs_installed}`, 
    e += `\n\t entry_exit_stubs_installed=${this.entry_exit_stubs_installed}`, e += `\n\t interpreter_stubs_installed=${this.interpreter_stubs_installed}`, 
    e += `\n\t interpret_only=${this.interpret_only}`, e += `\n\t forced_interpret_only=${this.forced_interpret_only}`, 
    e += `\n\t have_method_entry_listeners=${this.have_method_entry_listeners}`, e += `\n\t have_method_exit_listeners=${this.have_method_exit_listeners}`, 
    e += `\n\t have_method_unwind_listeners=${this.have_method_unwind_listeners}`, e += `\n\t have_dex_pc_listeners=${this.have_dex_pc_listeners}`, 
    e += `\n\t have_field_read_listeners=${this.have_field_read_listeners}`, e += `\n\t have_field_write_listeners=${this.have_field_write_listeners}`, 
    e += `\n\t have_exception_thrown_listeners=${this.have_exception_thrown_listeners}`, 
    e += `\n\t have_watched_frame_pop_listeners=${this.have_watched_frame_pop_listeners}`, 
    e += `\n\t have_branch_listeners=${this.have_branch_listeners}`, e += `\n\t have_exception_handled_listeners=${this.have_exception_handled_listeners}`, 
    e += `\n\t requested_instrumentation_levels=${this.requested_instrumentation_levels}`), 
    e;
  }
  get instrumentation_stubs_installed() {
    return 1 == this.instrumentation_stubs_installed_.readU8();
  }
  get entry_exit_stubs_installed() {
    return 1 == this.entry_exit_stubs_installed_.readU8();
  }
  get interpreter_stubs_installed() {
    return 1 == this.interpreter_stubs_installed_.readU8();
  }
  get interpret_only() {
    return 1 == this.interpret_only_.readU8();
  }
  get forced_interpret_only() {
    return 1 == this.forced_interpret_only_.readU8();
  }
  get have_method_entry_listeners() {
    return 1 == this.have_method_entry_listeners_.readU8();
  }
  get have_method_exit_listeners() {
    return 1 == this.have_method_exit_listeners_.readU8();
  }
  get have_method_unwind_listeners() {
    return 1 == this.have_method_unwind_listeners_.readU8();
  }
  get have_dex_pc_listeners() {
    return 1 == this.have_dex_pc_listeners_.readU8();
  }
  get have_field_read_listeners() {
    return 1 == this.have_field_read_listeners_.readU8();
  }
  get have_field_write_listeners() {
    return 1 == this.have_field_write_listeners_.readU8();
  }
  get have_exception_thrown_listeners() {
    return 1 == this.have_exception_thrown_listeners_.readU8();
  }
  get have_watched_frame_pop_listeners() {
    return 1 == this.have_watched_frame_pop_listeners_.readU8();
  }
  get have_branch_listeners() {
    return 1 == this.have_branch_listeners_.readU8();
  }
  get have_exception_handled_listeners() {
    return 1 == this.have_exception_handled_listeners_.readU8();
  }
  get requested_instrumentation_levels() {
    return this.requested_instrumentation_levels_;
  }
  static ForceInterpretOnly() {
    s.Instance.interpret_only_.writeU8(1), s.Instance.forced_interpret_only_.writeU8(1);
  }
  static AddListener(t, n) {
    (0, _.callSym)("_ZN3art15instrumentation15Instrumentation11AddListenerEPNS0_23InstrumentationListenerEj", "libart.so", "void", [ "pointer", "pointer", "int" ], s.Instance.handle, new e.InstrumentationListener(t).VirtualPtr, n);
  }
}

exports.Instrumentation = s, globalThis.Instrumentation = s;

},{"../../../../JSHandle":13,"../../../../Utils/SymHelper":21,"../../../../android":27,"./InstrumentationListener":42}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.InstrumentationEvent = exports.InstrumentationListener = exports.InstrumentationListenerJsProxImpl = void 0;

const e = require("../mirror/ArtMethod"), t = require("../../../../Object"), n = require("../Type/JValue"), r = require("../Thread"), i = require("../ObjPtr");

class o {
  static LOGD_ENABLE=!0;
  constructor() {}
  MethodEntered(e, t, n, r) {
    o.LOGD_ENABLE && LOGD(`MethodEntered: ${n.PrettyMethod(!1)}`);
  }
  MethodExited(e, t, n, r, i) {
    o.LOGD_ENABLE && LOGD(`MethodExited: ${n.PrettyMethod(!1)}`);
  }
  MethodUnwind(e, t, n, r) {
    o.LOGD_ENABLE && LOGD(`MethodUnwind: ${n.PrettyMethod(!1)}`);
  }
  DexPcMoved(e, t, n, r) {
    o.LOGD_ENABLE && LOGD(`DexPcMoved: ${n.PrettyMethod(!1)}`);
  }
  FieldRead(e, t, n, r, i) {
    o.LOGD_ENABLE && LOGD(`FieldRead: ${n.PrettyMethod(!1)}`);
  }
  FieldWritten(e, t, n, r, i, d) {
    o.LOGD_ENABLE && LOGD(`FieldWritten: ${n.PrettyMethod(!1)}`);
  }
  ExceptionThrown(e, t) {
    o.LOGD_ENABLE && LOGD(`ExceptionThrown: ${t}`);
  }
  ExceptionHandled(e, t) {
    o.LOGD_ENABLE && LOGD(`ExceptionHandled: ${t}`);
  }
  Branch(e, t, n, r) {
    o.LOGD_ENABLE && LOGD(`Branch: ${t.PrettyMethod(!1)}`);
  }
  WatchedFramePop(e, t) {
    o.LOGD_ENABLE && LOGD(`WatchedFramePop: ${t}`);
  }
}

exports.InstrumentationListenerJsProxImpl = o;

class d {
  virtual_ptr;
  calls;
  calls_ptr;
  static MaxAlloc=20;
  constructor(o) {
    this.calls = o, this.virtual_ptr = Memory.alloc(2 * Process.pointerSize), this.calls_ptr = Memory.alloc(Process.pointerSize * d.MaxAlloc), 
    this.virtual_ptr.writePointer(this.calls_ptr), this.CallsRefGet(s.kMethodEntered).writePointer(new NativeCallback(((e, t, n, r) => {
      LOGW(`kMethodEntered: ${e} ${t} ${n} ${r}`);
    }), "void", [ "pointer", "pointer", "pointer", "pointer" ])), this.CallsRefGet(s.kMethodExited).writePointer(new NativeCallback(((t, o, d, a, l) => {
      const s = new r.ArtThread(t), h = new i.ObjPtr(o), c = new e.ArtMethod(d), p = new n.JValue(l);
      this.calls.MethodExited(s, h, c, a.toUInt32(), p);
    }), "void", [ "pointer", "pointer", "pointer", "pointer", "pointer" ])), this.CallsRefGet(s.kMethodUnwind).writePointer(new NativeCallback(((t, n, o, d) => {
      const a = new r.ArtThread(t), l = new i.ObjPtr(n), s = new e.ArtMethod(o);
      this.calls.MethodUnwind(a, l, s, d.toUInt32());
    }), "void", [ "pointer", "pointer", "pointer", "pointer" ])), this.CallsRefGet(s.kDexPcMoved).writePointer(new NativeCallback(((t, n, o, d) => {
      const a = new r.ArtThread(t), l = new i.ObjPtr(n), s = new e.ArtMethod(o);
      this.calls.DexPcMoved(a, l, s, d.toUInt32());
    }), "void", [ "pointer", "pointer", "pointer", "pointer" ])), this.CallsRefGet(s.kFieldRead).writePointer(new NativeCallback(((n, o, d, a, l) => {
      const s = new r.ArtThread(n), h = new i.ObjPtr(o), c = new e.ArtMethod(d), p = new t.ArtObject(l);
      this.calls.FieldRead(s, h, c, a.toUInt32(), p);
    }), "void", [ "pointer", "pointer", "pointer", "pointer", "pointer" ])), this.CallsRefGet(s.kFieldWritten).writePointer(new NativeCallback(((o, d, a, l, s, h) => {
      const c = new r.ArtThread(o), p = new i.ObjPtr(d), k = new e.ArtMethod(a), w = new t.ArtObject(s), E = new n.JValue(h);
      this.calls.FieldWritten(c, p, k, l.toUInt32(), w, E);
    }), "void", [ "pointer", "pointer", "pointer", "pointer", "pointer", "pointer" ])), 
    this.CallsRefGet(s.kExceptionThrown).writePointer(new NativeCallback(((e, t) => {
      const n = new r.ArtThread(e), o = new i.ObjPtr(t);
      this.calls.ExceptionThrown(n, o);
    }), "void", [ "pointer", "pointer" ])), this.CallsRefGet(s.kExceptionHandled).writePointer(new NativeCallback(((e, t) => {
      const n = new r.ArtThread(e), o = new i.ObjPtr(t);
      this.calls.ExceptionHandled(n, o);
    }), "void", [ "pointer", "pointer" ])), this.CallsRefGet(s.kBranch).writePointer(new NativeCallback(((t, n, i, o) => {
      const d = new r.ArtThread(t), a = new e.ArtMethod(n);
      this.calls.Branch(d, a, i.toUInt32(), o.toInt32());
    }), "void", [ "pointer", "pointer", "pointer", "pointer" ]));
  }
  CallsRefGet(e) {
    return this.calls_ptr.add(Process.pointerSize * e);
  }
  get VirtualPtr() {
    return this.virtual_ptr;
  }
}

var a, l, s;

exports.InstrumentationListener = d, function(e) {
  e[e.kInstrumentNothing = 0] = "kInstrumentNothing", e[e.kInstrumentWithInstrumentationStubs = 1] = "kInstrumentWithInstrumentationStubs", 
  e[e.kInstrumentWithInterpreter = 2] = "kInstrumentWithInterpreter";
}(a || (a = {})), function(e) {
  e[e.kMethodEntered = 1] = "kMethodEntered", e[e.kMethodExited = 2] = "kMethodExited", 
  e[e.kMethodUnwind = 4] = "kMethodUnwind", e[e.kDexPcMoved = 8] = "kDexPcMoved", 
  e[e.kFieldRead = 16] = "kFieldRead", e[e.kFieldWritten = 32] = "kFieldWritten", 
  e[e.kExceptionThrown = 64] = "kExceptionThrown", e[e.kBranch = 128] = "kBranch", 
  e[e.kWatchedFramePop = 512] = "kWatchedFramePop", e[e.kExceptionHandled = 1024] = "kExceptionHandled";
}(l = exports.InstrumentationEvent || (exports.InstrumentationEvent = {})), function(e) {
  e[e.kMethodEntered = 0] = "kMethodEntered", e[e.kMethodExited = 1] = "kMethodExited", 
  e[e.kMethodUnwind = 2] = "kMethodUnwind", e[e.kDexPcMoved = 3] = "kDexPcMoved", 
  e[e.kFieldRead = 4] = "kFieldRead", e[e.kFieldWritten = 5] = "kFieldWritten", e[e.kExceptionThrown = 6] = "kExceptionThrown", 
  e[e.kExceptionHandled = 7] = "kExceptionHandled", e[e.kBranch = 8] = "kBranch", 
  e[e.kWatchedFramePop = 9] = "kWatchedFramePop";
}(s || (s = {}));

},{"../../../../Object":14,"../ObjPtr":55,"../Thread":62,"../Type/JValue":64,"../mirror/ArtMethod":86}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.InstrumentationStackFrame = void 0;

const t = require("../../../../JSHandle"), e = require("../../../../Object"), r = require("../Globals"), i = require("../mirror/ArtMethod");

class n extends t.JSHandle {
  this_object_=this.CurrentHandle;
  method_=this.this_object_.add(r.PointerSize);
  return_pc_=this.method_.add(r.PointerSize);
  frame_id_=this.return_pc_.add(r.PointerSize);
  interpreter_entry_=this.frame_id_.add(r.PointerSize);
  constructor(t) {
    super(t);
  }
  toString() {
    let t = `InstrumentationStackFrame< ${this.handle} >`;
    return this.handle.isNull() || (t += `\n${this.this_object}`, t += `\n${this.method}`, 
    t += `\n${this.return_pc}`, t += `\n${this.frame_id}`, t += `\n${this.interpreter_entry}`), 
    t;
  }
  get SizeOfClass() {
    return super.SizeOfClass + this.interpreter_entry_.add(4).sub(this.handle).toInt32();
  }
  get this_object() {
    return new e.ArtObject(this.this_object_.readPointer());
  }
  get method() {
    return new i.ArtMethod(this.method_.readPointer());
  }
  get return_pc() {
    return this.return_pc_.readPointer();
  }
  get frame_id() {
    return this.frame_id_.readU32();
  }
  get interpreter_entry() {
    return 1 == this.interpreter_entry_.readU8();
  }
  Dump() {
    return `Frame ${this.frame_id_} ${this.method.PrettyMethod()}:${this.return_pc_} this=${this.this_object}`;
  }
}

exports.InstrumentationStackFrame = n;

},{"../../../../JSHandle":13,"../../../../Object":14,"../Globals":38,"../mirror/ArtMethod":86}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.InstrumentationStackPopper = void 0;

const e = require("../../../../JSHandle"), t = require("../Globals"), r = require("../Thread");

class s extends e.JSHandle {
  self_=this.CurrentHandle;
  instrumentation_=this.self_.add(t.PointerSize);
  frames_to_remove_=this.instrumentation_.add(t.PointerSize);
  constructor(e) {
    super(e);
  }
  toString() {
    let e = `InstrumentationStackPopper< ${this.handle} >`;
    return this.handle.isNull() || (e += `\n${this.self}`, e += `\n${this.frames_to_remove}`), 
    e;
  }
  get SizeOfClass() {
    return super.SizeOfClass + this.frames_to_remove_.add(4).sub(this.handle).toInt32();
  }
  get self() {
    return new r.ArtThread(this.self_.readPointer());
  }
  get frames_to_remove() {
    return this.frames_to_remove_.readU32();
  }
}

exports.InstrumentationStackPopper = s;

},{"../../../../JSHandle":13,"../Globals":38,"../Thread":62}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.SmaliWriter = void 0;

const t = require("../../../../JSHandle"), s = require("../Instruction"), i = require("./InstructionList");

class e extends t.JSHandleNotImpl {
  base;
  current;
  offset;
  insnsMap;
  insnsSize;
  constructor(t) {
    super(t), this.base = t, this.current = t, this.offset = 0, this.insnsMap = new Map, 
    this.insnsSize = 0;
  }
  reset(t) {
    this.current = t, this.offset = t.sub(this.base).toInt32();
  }
  skip(t, s = !0) {
    this.current = this.current.add(t), this.offset += t, s && (this.insnsSize += 1);
  }
  writeInsns(t) {
    const s = t.current, i = t.SizeInCodeUnits, e = this.current;
    Memory.copy(e, s, i), this.skip(i, !1), this.insnsSize += i, this.insnsMap.set(s, e);
  }
  flush() {
    this.forEachInsns((t => {
      const s = t.opName;
      (s.includes("GOTO") || s.includes("IF_")) && e.fixRelativeBranchOffset(t, this.insnsMap);
    }));
  }
  forEachInsns(t) {
    let i = new s.ArtInstruction(this.base);
    for (;t(i), !(i.current > this.current); ) i = i.Next();
  }
  static fixRelativeBranchOffset(t, s) {
    const e = !1, r = t.opcode;
    if (r == i.Opcode.GOTO || r == i.Opcode.GOTO_16 || r == i.Opcode.GOTO_32) ; else if (t.opName.includes("IF_")) {
      const i = t.current.add(2), r = 2 * i.readU16();
      e;
      const n = Array.from(s.entries()).find((([s, i]) => i.equals(t.current)))?.[0];
      if (void 0 !== n) {
        const c = n.add(r);
        e;
        const h = Array.from(s.entries()).find((([t, s]) => t.equals(c)));
        if (void 0 !== h) {
          const [, s] = h;
          e;
          const r = s.sub(t.current).toInt32();
          i.writeU16(r);
        } else e;
      } else e;
    }
    return t;
  }
  putNop(t = 1) {
    for (let s = 0; s < 2 * t; s++) this.current.writeU8(i.Opcode.NOP), this.skip(1);
  }
  putGoto(t) {}
  putReturn() {
    this.current.writeU8(i.Opcode.RETURN_VOID), this.skip(1), this.current.writeU8(0), 
    this.skip(1);
  }
  putConstString(t, s) {
    this.current.writeU8(i.Opcode.CONST_STRING), this.skip(1), this.current.writeU8(t), 
    this.skip(1), this.current.writeU16(s), this.skip(2);
  }
  putIfNez(t, s) {
    this.current.writeU8(i.Opcode.IF_NEZ), this.skip(1), this.current.writeU8(t), this.skip(1), 
    this.current.writeU16(s), this.skip(2);
  }
  putMoveResult(t) {
    this.current.writeU8(i.Opcode.MOVE_RESULT), this.skip(1), this.current.writeU8(t), 
    this.skip(1);
  }
  putMoveResultObject(t) {
    this.current.writeU8(i.Opcode.MOVE_RESULT_OBJECT), this.skip(1), this.current.writeU8(t), 
    this.skip(1);
  }
  putNewInstance(t, s) {
    this.current.writeU8(i.Opcode.NEW_INSTANCE), this.skip(1), this.current.writeU8(t), 
    this.skip(1), this.current.writeU16(s), this.skip(2);
  }
  putInvokeStatic(t, s) {
    this.current.writeU8(i.Opcode.INVOKE_STATIC), this.skip(1), this.current.writeU8(t.length), 
    this.skip(1), this.current.writeU16(s), this.skip(2);
  }
}

exports.SmaliWriter = e;

},{"../../../../JSHandle":13,"../Instruction":39,"./InstructionList":40}],46:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.SmaliInlineManager = void 0;

const e = require("../interpreter/interpreter"), t = require("../mirror/ArtMethod"), r = require("./SmaliWriter"), n = require("console");

class o {
  static recoverMap=new Map;
  static enable() {
    o.handleException();
  }
  static convertToArtMethod(e) {
    return e instanceof NativePointer && (e = new t.ArtMethod(e)), "number" == typeof e && (e = new t.ArtMethod(ptr(e))), 
    "string" == typeof e && (e = pathToArtMethod(e)), (0, n.assert)(e instanceof t.ArtMethod, "method must be ArtMethod"), 
    e;
  }
  static traceSingleMethod(e) {
    if (e = o.convertToArtMethod(e), o.recoverMap.has(e)) throw new Error("method already traced");
    const t = o.Impl_CP(e);
    o.recoverMap.set(e, {
      src: e.DexInstructions().CodeItem.insns_start,
      new: t.newStart
    }), e.SetCodeItem(t.newStart), e.DexInstructions().CodeItem.insns_size_in_code_units = t.insnsSize;
  }
  static restoreSingleMethod(e) {
    if (e = o.convertToArtMethod(e), !o.recoverMap.has(e)) return;
    const {src: t, new: r} = o.recoverMap.get(e);
    e.SetCodeItem(t);
  }
  static Impl_Inline() {}
  static Impl_CP(e) {
    const t = (e = o.convertToArtMethod(e)).GetCodeItemPack(), n = t.headerSize + 2 * t.insnsSize;
    var i = Memory.alloc(n);
    Memory.copy(i, t.headerStart, t.headerSize);
    const a = new r.SmaliWriter(i.add(t.headerSize));
    return a.putNop(), e.forEachSmali(((e, t) => {
      a.writeInsns(e), a.putNop();
    })), a.flush(), {
      newStart: i,
      insnsMap: a.insnsMap,
      insnsSize: a.insnsSize / 2
    };
  }
  static handleException() {
    e.interpreter.addMoveToExceptionHandleCalledListener(((e, t, r, n) => (e == NULL && LOGE(`MoveToExceptionHandleCalledListener -> ${r.toString()}`), 
    e)));
  }
}

exports.SmaliInlineManager = o, setImmediate((() => {
  o.enable();
})), Reflect.set(globalThis, "SmaliInlineManager", o);

}).call(this)}).call(this,require("timers").setImmediate)

},{"../interpreter/interpreter":84,"../mirror/ArtMethod":86,"./SmaliWriter":45,"console":128,"timers":155}],47:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.UnUsedInstructionManager = void 0;

const e = require("../../../../JSHandle"), t = require("../../../../../tools/intercepter"), n = require("../../../../Utils/SymHelper"), a = require("../Instruction"), s = require("../ShadowFrame"), r = require("./InstructionList");

class i extends r.Opcode {}

class o extends e.JSHandleNotImpl {
  static listenerMap=new Map;
  static registerListener(e, t) {
    this.listenerMap.has(e) || this.listenerMap.set(e, []), this.listenerMap.get(e).push(t);
  }
  static removeListener(e) {
    this.listenerMap.delete(e);
  }
  static catchUnexpectedOpcode() {
    const e = (0, n.getSym)("_ZN3art11interpreter16UnexpectedOpcodeEPKNS_11InstructionERKNS_11ShadowFrameE", "libart.so");
    new NativeFunction(e, "pointer", [ "pointer", "pointer" ]);
    (0, t.R)(e, new NativeCallback(((e, t) => {
      let n = new a.ArtInstruction(e), r = new s.ShadowFrame(t);
      LOGD(`UnexpectedOpcode ${n.toString()} ${r.toString()}`);
    }), "pointer", [ "pointer", "pointer" ]));
  }
  static mapModify=new Map;
  static ModSmaliInstruction(e = "com.unity3d.player.UnityPlayer.UnitySendMessage", t = 66) {
    const n = pathToArtMethod(e), s = n.GetDexFile();
    if (s.is_compact_dex) throw new Error("not support compact dex");
    const r = n.DexInstructions().CodeItem.insns_start.add(t), l = new a.ArtInstruction(r).SizeInCodeUnits;
    LOGD(`ins_ptr_patch_start ${r} ins_ptr_patch_len ${l}`);
    const c = r.readByteArray(l);
    if (o.mapModify.set(r, c), s.IsReadOnly() && s.EnableWrite(), r.writeU32(i.UNUSED_3E), 
    l > 1) for (let e = r.add(1); e < r.add(l); e = e.add(1)) e.writeU8(0);
  }
  static newClass() {
    return Java.registerClass({
      name: "com.Test.CallbackClass",
      superClass: Java.use("java.lang.Object"),
      implements: void 0,
      methods: {
        OnCalled: {
          returnType: "void",
          argumentTypes: [ "boolean" ],
          implementation: function(e) {
            LOGW(`called CallbackClass -> OnCalled ${e}`);
          }
        }
      }
    });
  }
  static test() {
    return o.newClass().OnCalled.handle;
  }
}

exports.UnUsedInstructionManager = o, setImmediate((() => {
  o.catchUnexpectedOpcode();
})), Reflect.set(globalThis, "UnUsedInstructionManager", o), globalThis.ModSmaliInstruction = o.ModSmaliInstruction, 
globalThis.test = () => {
  Java.perform((() => {
    LOGD(o.test());
  }));
}, globalThis.testCallSendMessage = () => {
  Java.perform((() => {
    var e = Java.use("java.lang.String");
    Java.use("com.unity3d.player.UnityPlayer").UnitySendMessage(e.$new("1"), e.$new("2"), e.$new("3"));
  }));
};

}).call(this)}).call(this,require("timers").setImmediate)

},{"../../../../../tools/intercepter":117,"../../../../JSHandle":13,"../../../../Utils/SymHelper":21,"../Instruction":39,"../ShadowFrame":57,"./InstructionList":40,"timers":155}],48:[function(require,module,exports){
"use strict";

var e, t, n;

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.InstrumentationLevel = exports.InstrumentationEvent = exports.InterpreterHandlerTable = void 0, 
function(e) {
  e[e.kMainHandlerTable = 0] = "kMainHandlerTable", e[e.kAlternativeHandlerTable = 1] = "kAlternativeHandlerTable", 
  e[e.kNumHandlerTables = 2] = "kNumHandlerTables";
}(e = exports.InterpreterHandlerTable || (exports.InterpreterHandlerTable = {})), 
function(e) {
  e[e.kMethodEntered = 1] = "kMethodEntered", e[e.kMethodExited = 2] = "kMethodExited", 
  e[e.kMethodUnwind = 4] = "kMethodUnwind", e[e.kDexPcMoved = 8] = "kDexPcMoved", 
  e[e.kFieldRead = 16] = "kFieldRead", e[e.kFieldWritten = 32] = "kFieldWritten", 
  e[e.kExceptionThrown = 64] = "kExceptionThrown", e[e.kBranch = 128] = "kBranch", 
  e[e.kWatchedFramePop = 512] = "kWatchedFramePop", e[e.kExceptionHandled = 1024] = "kExceptionHandled";
}(t = exports.InstrumentationEvent || (exports.InstrumentationEvent = {})), function(e) {
  e[e.kInstrumentNothing = 0] = "kInstrumentNothing", e[e.kInstrumentWithInstrumentationStubs = 1] = "kInstrumentWithInstrumentationStubs", 
  e[e.kInstrumentWithInterpreter = 2] = "kInstrumentWithInterpreter";
}(n = exports.InstrumentationLevel || (exports.InstrumentationLevel = {}));

},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./enum"), require("./SmaliWriter"), require("./UnUsedInstruction"), 
require("./InstructionList"), require("./SmalinInlineManager"), require("./Instrumentation"), 
require("./InstrumentationListener"), require("./InstrumentationStackFrame"), require("./InstrumentationStackPopper");

},{"./InstructionList":40,"./Instrumentation":41,"./InstrumentationListener":42,"./InstrumentationStackFrame":43,"./InstrumentationStackPopper":44,"./SmaliWriter":45,"./SmalinInlineManager":46,"./UnUsedInstruction":47,"./enum":48}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.OatQuickMethodHeader = void 0;

const e = require("../../../JSHandle"), t = 2147483648, d = 2147483647;

class s extends e.JSHandle {
  vmap_table_offset_=this.handle.add(0);
  code_size_=this.handle.add(4);
  code_=this.handle.add(8);
  constructor(e) {
    super(e);
  }
  toString() {
    return `${this.handle} -> vmap_table_offset: ${this.vmap_table_offset} code_size: ${this.code_size} code: ${this.code}`;
  }
  get vmap_table_offset() {
    return this.vmap_table_offset_.readU32();
  }
  get code_size() {
    return this.code_size_.readU32();
  }
  get code() {
    return this.code_;
  }
  GetOptimizedCodeInfoPtr() {
    return this.code.sub(this.vmap_table_offset_);
  }
  GetCodeSize() {
    return ptr(this.code_size).and(d).toUInt32();
  }
  GetCodeSizeAddr() {
    return this.code_size_;
  }
  IsOptimized() {
    return 0 != this.GetCodeSize() && 0 != this.vmap_table_offset;
  }
}

exports.OatQuickMethodHeader = s;

},{"../../../JSHandle":13}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.MemMap = void 0;

const e = require("../../../../../tools/StdString"), t = require("../../../../JSHandle"), i = require("../Globals");

class s extends t.JSHandleNotImpl {
  name_=this.handle;
  begin_=this.name_.add(3 * i.PointerSize);
  size_=this.begin_.add(i.PointerSize);
  base_begin_=this.size_.add(i.PointerSize);
  base_size_=this.base_begin_.add(i.PointerSize);
  prot_=this.base_size_.add(i.PointerSize);
  reuse_=this.prot_.add(i.PointerSize);
  already_unmapped_=this.reuse_.add(i.PointerSize);
  redzone_size_=this.already_unmapped_.add(i.PointerSize);
  toString() {
    let e = `MemMap<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t name = ${this.name} @ ${this.name_}`, 
    e += `\n\t begin = ${this.begin} @ ${this.begin_}`, e += `\n\t size = ${this.size} | ${ptr(this.size)} @ ${this.size_}`, 
    e += `\n\t base_begin = ${this.base_begin} @ ${this.base_begin_}`, e += `\n\t base_size = ${this.base_size} | ${ptr(this.base_size)} @ ${this.base_size_}`, 
    e += `\n\t prot = ${this.prot} | ${ptr(this.prot)} @ ${this.prot_}`, e += `\n\t reuse = ${this.reuse} @ ${this.reuse_}`, 
    e += `\n\t already_unmapped = ${this.already_unmapped} @ ${this.already_unmapped_}`, 
    e += `\n\t redzone_size = ${this.redzone_size} | ${ptr(this.redzone_size)} @ ${this.redzone_size_}`), 
    e;
  }
  get name() {
    return new e.StdString(this.name_).toString();
  }
  get begin() {
    return this.begin_.readPointer();
  }
  get size() {
    return this.size_.toInt32();
  }
  get base_begin() {
    return this.base_begin_.readPointer();
  }
  get base_size() {
    return this.base_size_.toInt32();
  }
  get prot() {
    return this.prot_.toInt32();
  }
  get reuse() {
    return 0 != this.reuse_.toInt32();
  }
  get already_unmapped() {
    return 0 != this.already_unmapped_.toInt32();
  }
  get redzone_size() {
    return this.redzone_size_.toInt32();
  }
}

exports.MemMap = s;

},{"../../../../../tools/StdString":110,"../../../../JSHandle":13,"../Globals":38}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.OatDexFile = void 0;

const t = require("../../../../../tools/StdString"), e = require("../../../../JSHandle"), i = require("../../../../Utils/SymHelper"), _ = require("../Globals"), n = require("./OatFile");

class a extends e.JSHandle {
  oat_file_=this.CurrentHandle;
  dex_file_location_=this.oat_file_.add(_.PointerSize);
  canonical_dex_file_location_=this.dex_file_location_.add(3 * _.PointerSize);
  dex_file_location_checksum_=this.canonical_dex_file_location_.add(3 * _.PointerSize);
  dex_file_pointer_=this.dex_file_location_checksum_.add(_.PointerSize);
  lookup_table_data_=this.dex_file_pointer_.add(_.PointerSize);
  method_bss_mapping_=this.lookup_table_data_.add(_.PointerSize);
  type_bss_mapping_=this.method_bss_mapping_.add(_.PointerSize);
  string_bss_mapping_=this.type_bss_mapping_.add(_.PointerSize);
  oat_class_offsets_pointer_=this.string_bss_mapping_.add(_.PointerSize);
  lookup_table_=this.oat_class_offsets_pointer_.add(_.PointerSize);
  dex_layout_sections_=this.lookup_table_.add(_.PointerSize);
  constructor(t) {
    super(t);
  }
  get SizeOfClass() {
    return this.dex_layout_sections_.add(_.PointerSize).sub(this.CurrentHandle).toInt32();
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass).add(this.VirtualClassOffset);
  }
  get VirtualClassOffset() {
    return 0;
  }
  toString() {
    let t = `OatDexFile<${this.handle}>`;
    return this.handle.isNull() || (t += `\n\t oat_file = ${this.oat_file_}`, t += `\n\t dex_file_location = ${this.dex_file_location} @ ${this.dex_file_location_}`, 
    t += `\n\t canonical_dex_file_location = ${this.canonical_dex_file_location} @ ${this.canonical_dex_file_location_}`, 
    t += `\n\t dex_file_location_checksum = ${this.dex_file_location_checksum} | ${ptr(this.dex_file_location_checksum)} @ ${this.dex_file_location_checksum_}`, 
    t += `\n\t dex_file_pointer = ${this.dex_file_pointer} @ ${this.dex_file_pointer_}`, 
    t += `\n\t lookup_table_data = ${this.lookup_table_data} @ ${this.lookup_table_data_}`, 
    t += `\n\t method_bss_mapping = ${this.method_bss_mapping} @ ${this.method_bss_mapping_}`, 
    t += `\n\t type_bss_mapping = ${this.type_bss_mapping} @ ${this.type_bss_mapping_}`, 
    t += `\n\t string_bss_mapping = ${this.string_bss_mapping} @ ${this.string_bss_mapping_}`, 
    t += `\n\t oat_class_offsets_pointer = ${this.oat_class_offsets_pointer} @ ${this.oat_class_offsets_pointer_}`, 
    t += `\n\t lookup_table = ${this.lookup_table} @ ${this.lookup_table_}`, t += `\n\t dex_layout_sections = ${this.dex_layout_sections} @ ${this.dex_layout_sections_}`), 
    t;
  }
  get oat_file() {
    return this.oat_file_.isNull() ? null : new n.OatFile(this.oat_file_.readPointer());
  }
  get dex_file_location() {
    return new t.StdString(this.dex_file_location_).toString();
  }
  get canonical_dex_file_location() {
    return new t.StdString(this.canonical_dex_file_location_).toString();
  }
  get dex_file_location_checksum() {
    return this.dex_file_location_checksum_.readUInt();
  }
  get dex_file_pointer() {
    return this.dex_file_pointer_.readPointer();
  }
  get lookup_table_data() {
    return this.lookup_table_data_.readPointer();
  }
  get method_bss_mapping() {
    return this.method_bss_mapping_.readPointer();
  }
  get type_bss_mapping() {
    return this.type_bss_mapping_.readPointer();
  }
  get string_bss_mapping() {
    return this.string_bss_mapping_.readPointer();
  }
  get oat_class_offsets_pointer() {
    return this.oat_class_offsets_pointer_.readU32();
  }
  get lookup_table() {
    return this.lookup_table_.readPointer();
  }
  get dex_layout_sections() {
    return this.dex_layout_sections_.readPointer();
  }
  static OpenWithElfFile(t, e, _, n, a) {
    return (0, i.callSym)("_ZN3art7OatFile15OpenWithElfFileEiPNS_7ElfFileEPNS_8VdexFileERKNSt3__112basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEPKcPSB_", "libart.so", "pointer", [ "int", "pointer", "pointer", "pointer", "pointer" ], t, e, _, n, a);
  }
  static Open(t, e, _, n, a, o, l) {
    return (0, i.callSym)("_ZN3art7OatFile4OpenEiRKNSt3__112basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEES9_bbPKcPNS_6MemMapEPS7_", "libart.so", "pointer", [ "int", "pointer", "pointer", "bool", "bool", "pointer", "pointer" ], t, e, _, n, a, o, l);
  }
  static Open2(t, e, _, n, a, o, l, s) {
    return (0, i.callSym)("_ZN3art7OatFile4OpenEiiiRKNSt3__112basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEbbPKcPNS_6MemMapEPS7_", "libart.so", "pointer", [ "int", "int", "int", "pointer", "bool", "bool", "pointer", "pointer" ], t, e, _, n, a, o, l, s);
  }
}

exports.OatDexFile = a;

class o extends a {
  static hookOpen_1() {
    Interceptor.attach((0, i.getSym)("_ZN3art7OatFile4OpenEiRKNSt3__112basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEES9_bbPKcPNS_6MemMapEPS7_", "libart.so"), {
      onEnter: function(e) {
        LOGD(`OatDexFile::Open(\n\tzip_fd=${e[0]}, \n\tfilename=${new t.StdString(e[1])}, \n\tlocation=${new t.StdString(e[2])}, \n\texecutable=${e[3]}, \n\tlow_4gb=${e[4]}, \n\tabs_dex_location=${new t.StdString(e[5])}, \n\treservation=${e[6]}`);
      }
    });
  }
  static hookOpen_2() {
    Interceptor.attach((0, i.getSym)("_ZN3art7OatFile4OpenEiiiRKNSt3__112basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEbbPKcPNS_6MemMapEPS7_", "libart.so"), {
      onEnter: function(e) {
        LOGD(`OatDexFile::Open(\n\tzip_fd=${e[0]}, \n\tvdex_fd=${e[1]}, \n\toat_fd=${e[2]}, \n\toat_location=${new t.StdString(e[3])}, \n\texecutable=${e[4]}, \n\tlow_4gb=${e[5]}, \n\tabs_dex_location=${new t.StdString(e[6])}, \n\treservation=${e[7]}`);
      }
    });
  }
  static hookOpenWithElfFile() {
    Interceptor.attach((0, i.getSym)("_ZN3art7OatFile15OpenWithElfFileEiPNS_7ElfFileEPNS_8VdexFileERKNSt3__112basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEPKcPSB_", "libart.so"), {
      onEnter: function(e) {
        LOGD(`OatDexFile::OpenWithElfFile(\n\tzip_fd=${e[0]}, \n\telf_file=${e[1]}, \n\tvdex_file=${e[2]}, \n\tlocation=${new t.StdString(e[3])}, \n\tabs_dex_location=${new t.StdString(e[4])})`);
      }
    });
  }
  static hookOpen_3() {
    Interceptor.attach((0, i.getSym)("_ZN3art11OatFileBase11OpenOatFileINS_10ElfOatFileEEEPS0_iiiRKNSt3__112basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEESC_bbbPKcPNS_6MemMapEPSA_", "libart.so"), {
      onEnter: function(e) {
        LOGD(`OatDexFile::OpenOatFile(\n\tzip_fd=${e[0]}, \n\tvdex_filename=${new t.StdString(e[1])}, \n\telf_filename=${new t.StdString(e[2])}, \n\tlocation=${new t.StdString(e[3])}, \n\twritable=${e[4]}, \n\texecutable=${e[5]}, \n\tlow_4gb=${e[6]}, \n\tabs_dex_location=${new t.StdString(e[7])}, \n\treservation=${e[8]}`);
      }
    });
  }
  static hookOpen_4() {
    Interceptor.attach((0, i.getSym)("_ZN3art13DlOpenOatFile4LoadERKNSt3__112basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEbbbPNS_6MemMapEPS7_", "libart.so"), {
      onEnter: function(e) {
        LOGD(`DlOpenOatFile::Load(\n\telf_filename=${new t.StdString(e[1])}, \n\twritable=${e[2]}, \n\texecutable=${e[3]}, \n\tlow_4gb=${e[4]}, \n\treservation=${e[5]}`), 
        e[2] = ptr(1);
      }
    });
  }
  static hookOpen_5() {
    Interceptor.attach((0, i.getSym)("_ZN3art10ElfOatFile4LoadEibbbPNS_6MemMapEPNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEE", "libart.so"), {
      onEnter: function(e) {
        LOGD(`OatDexFile::Load(\n\telf_filename=${new t.StdString(e[1])}, \n\twritable=${e[2]}, \n\texecutable=${e[3]}, \n\tlow_4gb=${e[4]}, \n\treservation=${e[5]}`), 
        e[2] = ptr(1);
      }
    });
  }
}

},{"../../../../../tools/StdString":110,"../../../../JSHandle":13,"../../../../Utils/SymHelper":21,"../Globals":38,"./OatFile":53}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.OatFile = void 0;

const e = require("../../../../../tools/StdString"), t = require("../../../../JSHandle"), _ = require("../Globals");

class i extends t.JSHandle {
  location_=this.currentHandle;
  vdex_=this.location_.add(3 * _.PointerSize);
  begin_=this.vdex_.add(_.PointerSize);
  end_=this.begin_.add(_.PointerSize);
  data_bimg_rel_ro_begin_=this.end_.add(_.PointerSize);
  data_bimg_rel_ro_end_=this.data_bimg_rel_ro_begin_.add(_.PointerSize);
  bss_begin_=this.data_bimg_rel_ro_end_.add(_.PointerSize);
  bss_end_=this.bss_begin_.add(_.PointerSize);
  bss_methods_=this.bss_end_.add(_.PointerSize);
  bss_roots_=this.bss_methods_.add(_.PointerSize);
  is_executable_=this.bss_roots_.add(_.PointerSize);
  vdex_begin_=this.is_executable_.add(_.PointerSize);
  vdex_end_=this.vdex_begin_.add(_.PointerSize);
  oat_dex_files_storage_=this.vdex_end_.add(_.PointerSize);
  oat_dex_files_=this.oat_dex_files_storage_.add(_.PointerSize);
  secondary_lookup_lock_=this.oat_dex_files_.add(_.PointerSize);
  secondary_oat_dex_files_=this.secondary_lookup_lock_.add(_.PointerSize);
  string_cache_=this.secondary_oat_dex_files_.add(_.PointerSize);
  uncompressed_dex_files_=this.string_cache_.add(_.PointerSize);
  constructor(e) {
    super(e);
  }
  get SizeOfClass() {
    return this.uncompressed_dex_files_.add(_.PointerSize).sub(this.CurrentHandle).toInt32();
  }
  get VirtualClassOffset() {
    return _.PointerSize;
  }
  get currentHandle() {
    return this.handle.add(super.SizeOfClass).add(this.VirtualClassOffset);
  }
  toString() {
    let e = `OatFile<${this.handle}>`;
    return e += `\n\tlocation_: ${this.location} @ ${this.location_}`, e += `\n\tbegin: ${this.begin} | end: ${this.end}`, 
    e += `\n\tdata_bimg_rel_ro_begin: ${this.data_bimg_rel_ro_begin} | data_bimg_rel_ro_end: ${this.data_bimg_rel_ro_end}`, 
    e += `\n\tbss_begin: ${this.bss_begin} | bss_end: ${this.bss_end}`, e += `\n\tbss_methods: ${this.bss_methods} | bss_roots: ${this.bss_roots}`, 
    e += `\n\tis_executable: ${this.is_executable}`, e += `\n\tvdex_begin: ${this.vdex_begin} | vdex_end: ${this.vdex_end}`, 
    e += `\n\toat_dex_files_storage: ${this.oat_dex_files_storage} | oat_dex_files: ${this.oat_dex_files}`, 
    e;
  }
  get location() {
    return new e.StdString(this.location_).toString();
  }
  get begin() {
    return this.begin_.readPointer();
  }
  get end() {
    return this.end_.readPointer();
  }
  get data_bimg_rel_ro_begin() {
    return this.data_bimg_rel_ro_begin_.readPointer();
  }
  get data_bimg_rel_ro_end() {
    return this.data_bimg_rel_ro_end_.readPointer();
  }
  get bss_begin() {
    return this.bss_begin_.readPointer();
  }
  get bss_end() {
    return this.bss_end_.readPointer();
  }
  get bss_methods() {
    return this.bss_methods_.readPointer();
  }
  get bss_roots() {
    return this.bss_roots_.readPointer();
  }
  get is_executable() {
    return 1 === this.is_executable_.readU8();
  }
  get vdex_begin() {
    return this.vdex_begin_.readPointer();
  }
  get vdex_end() {
    return this.vdex_end_.readPointer();
  }
  get oat_dex_files_storage() {
    return this.oat_dex_files_storage_.readPointer();
  }
  get oat_dex_files() {
    return this.oat_dex_files_.readPointer();
  }
  get secondary_lookup_lock() {
    return this.secondary_lookup_lock_.readPointer();
  }
  get secondary_oat_dex_files() {
    return this.secondary_oat_dex_files_.readPointer();
  }
  get string_cache() {
    return this.string_cache_.readPointer();
  }
  get uncompressed_dex_files() {
    return this.uncompressed_dex_files_.readPointer();
  }
}

exports.OatFile = i;

},{"../../../../../tools/StdString":110,"../../../../JSHandle":13,"../Globals":38}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./OatFile"), require("./OatDexFile"), require("./MemMap");

},{"./MemMap":51,"./OatDexFile":52,"./OatFile":53}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ObjectReference = exports.ObjPtr = void 0;

const e = require("../../../JSHandle");

class r extends e.JSHandle {
  constructor(e) {
    super(e);
  }
  get value() {
    return this.handle.readPointer();
  }
  toString() {
    return `${this.handle} -> ${this.value}`;
  }
}

exports.ObjPtr = r;

class t extends e.JSHandle {
  reference_=this.handle;
  static SizeOfClass=4;
  constructor(e) {
    super(e);
  }
  get reference() {
    return ptr(this.reference_.readU32());
  }
}

exports.ObjectReference = t;

},{"../../../JSHandle":13}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.QuickMethodFrameInfo = void 0;

const e = require("../../../JSHandle");

class o extends e.JSHandle {
  constructor(e) {
    super(e);
  }
}

exports.QuickMethodFrameInfo = o;

},{"../../../JSHandle":13}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ShadowFrame = void 0;

const e = require("./dexfile/CodeItemInstructionAccessor"), t = require("../../../Utils/SymHelper"), r = require("./Instruction"), s = require("./mirror/ArtMethod"), n = require("../../../JSHandle"), i = require("../../../Object"), o = require("./ObjPtr"), d = require("./Globals"), _ = require("./Type/JValue");

class h extends n.JSHandle {
  link_=this.CurrentHandle;
  method_=this.link_.add(d.PointerSize);
  result_register_=this.method_.add(d.PointerSize);
  dex_pc_ptr_=this.result_register_.add(d.PointerSize);
  dex_instructions_=this.dex_pc_ptr_.add(d.PointerSize);
  lock_count_data_=this.dex_instructions_.add(d.PointerSize);
  number_of_vregs_=this.lock_count_data_.add(d.PointerSize);
  dex_pc_=this.number_of_vregs_.add(4);
  cached_hotness_countdown_=this.dex_pc_.add(4);
  hotness_countdown_=this.cached_hotness_countdown_.add(2);
  frame_flags_=this.hotness_countdown_.add(2);
  vregs_=this.frame_flags_.add(4);
  constructor(e) {
    super(e);
  }
  toString() {
    let e = `ShadowFrame<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t link_: ${this.link_}`, e += `\n\t method_: ${this.method_} -> ${this.method.PrettyMethod()}`, 
    e += `\n\t result_register: ${this.result_register}`, e += `\n\t dex_pc_ptr: ${this.dex_pc_ptr}`, 
    e += `\n\t dex_instructions: ${this.dex_instructions.toString().split("\n").map(((e, t) => 0 == t ? e : `\n\t${e}`)).join("")}`, 
    e += `\n\t number_of_vregs: ${this.NumberOfVRegs}`, e += `\n\t dex_pc: ${this.dex_pc} | GetDexPC: ${this.GetDexPC()}`, 
    e += `\n\t cached_hotness_countdown: ${this.cached_hotness_countdown}`, e += `\n\t hotness_countdown: ${this.hotness_countdown}`, 
    e += `\n\t frame_flags: ${this.frame_flags}`, e += `\n\t vregs_: ${this.vregs_}`), 
    e;
  }
  get link() {
    return new h(this.link_.readPointer());
  }
  get method() {
    if (this.method_.isNull()) return null;
    try {
      return new s.ArtMethod(this.method_.readPointer());
    } catch (e) {
      return null;
    }
  }
  get result_register() {
    return new _.JValue(this.result_register_.readPointer());
  }
  get dex_pc_ptr() {
    return this.dex_pc_ptr_.readPointer();
  }
  get dex_instructions() {
    return new r.ArtInstruction(this.dex_instructions_.readPointer());
  }
  get lock_count_data() {
    return this.lock_count_data_.readPointer();
  }
  get NumberOfVRegs() {
    return this.number_of_vregs_.readU32();
  }
  get dex_pc() {
    return this.dex_pc_.readU32();
  }
  get cached_hotness_countdown() {
    return this.cached_hotness_countdown_.readS16();
  }
  get hotness_countdown() {
    return this.hotness_countdown_.readS16();
  }
  get frame_flags() {
    return this.frame_flags_.readU32();
  }
  set dex_pc(e) {
    this.dex_pc_.writeU32(e);
  }
  set dex_pc_ptr(e) {
    this.dex_pc_ptr_.writePointer(e);
  }
  get DexInstructions() {
    return e.CodeItemInstructionAccessor.fromDexFile(this.method.GetDexFile(), this.dex_instructions_);
  }
  get vregs() {
    const e = [];
    for (let t = 0; t < this.NumberOfVRegs; t++) e.push(this.vregs_.add(4 * t).readInt());
    return e;
  }
  get vreg_refs() {
    const e = [];
    for (let t = 0; t < this.NumberOfVRegs; t++) e.push(this.GetVRegReference(t));
    return e;
  }
  SetVRegReference(e, t) {
    this.vregs_.add(4 * this.NumberOfVRegs + e * d.PointerSize).writePointer(t.handle);
  }
  GetVRegReference(e) {
    let t = new o.ObjectReference(this.vregs_.add(4 * this.NumberOfVRegs + e * o.ObjectReference.SizeOfClass)).reference;
    return new i.ArtObject(t);
  }
  GetVReg(e) {
    return this.vregs_.add(4 * e).readU32();
  }
  SetVReg(e, t) {
    this.vregs_.add(4 * e).writeU32(t);
  }
  GetVRegFloat(e) {
    return this.vregs_.add(4 * e).readFloat();
  }
  SetVRegFloat(e, t) {
    this.vregs_.add(4 * e).writeFloat(t);
  }
  GetVRegLong(e) {
    return this.vregs_.add(4 * e).readS64();
  }
  SetVRegLong(e, t) {
    this.vregs_.add(4 * e).writeS64(t);
  }
  GetVRegDouble(e) {
    return this.vregs_.add(4 * e).readDouble();
  }
  SetVRegDouble(e, t) {
    this.vregs_.add(4 * e).writeDouble(t);
  }
  sizeInCodeUnitsComplexOpcode() {
    return (0, t.callSym)("_ZNK3art11Instruction28SizeInCodeUnitsComplexOpcodeEv", "libdexfile.so", [ "pointer" ], [ "pointer" ], this.handle);
  }
  GetThisObject() {
    return new i.ArtObject((0, t.callSym)("_ZNK3art11ShadowFrame13GetThisObjectEt", "libart.so", [ "pointer", "uint16" ], [ "pointer", "uint16" ], this.handle, 0));
  }
  GetThisObject_num_ins(e) {
    return new i.ArtObject((0, t.callSym)("_ZNK3art11ShadowFrame13GetThisObjectEt", "libart.so", [ "pointer", "uint16" ], [ "pointer", "uint16" ], this.handle, e));
  }
  GetDexPC() {
    return this.dex_pc_ptr_.isNull() ? this.dex_pc_ : this.dex_instructions_.sub(this.dex_pc_ptr_);
  }
  GetCachedHotnessCountdown() {
    return this.cached_hotness_countdown;
  }
  SetCachedHotnessCountdown(e) {
    this.cached_hotness_countdown_.writeS16(e);
  }
  GetHotnessCountdown() {
    return this.hotness_countdown;
  }
  SetHotnessCountdown(e) {
    this.hotness_countdown_.writeS16(e);
  }
  SetDexPC(e) {
    this.dex_pc = e.toUInt32(), this.dex_pc_ptr = NULL;
  }
  get backTrace() {
    const e = [];
    let t = this;
    for (;!t.link.handle.isNull(); ) e.push(t), t = t.link;
    return e;
  }
  printBackTrace(e = !0) {
    this.backTrace.map(((t, r) => `${r}: ${e ? t.method.PrettyMethod() : t.method}`)).forEach(LOGD);
  }
  printBackTraceWithSmali(e = !0, t = 3) {
    this.backTrace.forEach(((s, n) => {
      const i = s.method;
      LOGD(`${n}: ${e ? i.PrettyMethod() : i}`);
      const o = i.GetDexFile();
      let d = s.dex_pc_ptr.isNull() ? i.DexInstructions().InstructionAt() : new r.ArtInstruction(s.dex_pc_ptr), _ = t;
      const h = i.DexInstructions().CodeItem.ins_size;
      let c = "";
      for (c += "\t" + s.vregs.map(((e, t) => t < h ? `p${t}=${e}` : `v${t}=${e}`)).join(", ") + "\n", 
      c += "\t" + s.vreg_refs.map(((e, t) => 0 != s.vregs[t] ? t < h ? `p${t}=${e.simpleDisp()}` : `v${t}=${e.simpleDisp()}` : "null")).join("\n\t") + "\n", 
      LOGZ(c), c = `\t---------- smaliLines:${t} ----------\n`; --_ >= 0 && d.Next().SizeInCodeUnits > 0; ) {
        const e = d.handle.sub(i.DexInstructions().insns);
        c += `\t${d.handle} ${e} -> ${d.dumpString(o)}\n`, d = d.Next();
      }
      LOGN(c);
    }));
  }
}

exports.ShadowFrame = h, globalThis.ShadowFrame = h;

},{"../../../JSHandle":13,"../../../Object":14,"../../../Utils/SymHelper":21,"./Globals":38,"./Instruction":39,"./ObjPtr":55,"./Type/JValue":64,"./dexfile/CodeItemInstructionAccessor":72,"./mirror/ArtMethod":86}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.CHAStackVisitor = void 0;

const t = require("./StackVisitor");

class e extends t.StackVisitor {
  constructor(t) {
    super(t);
  }
}

exports.CHAStackVisitor = e;

},{"./StackVisitor":60}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.CatchBlockStackVisitor = void 0;

const t = require("./StackVisitor");

class e extends t.StackVisitor {
  constructor(t) {
    super(t);
  }
}

exports.CatchBlockStackVisitor = e;

},{"./StackVisitor":60}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.StackWalkKind = exports.VRegKind = exports.StackVisitor = void 0;

const t = require("../QuickMethodFrameInfo"), e = require("../OatQuickMethodHeader"), r = require("../../../../../tools/StdString"), i = require("../../../../Utils/SymHelper"), n = require("../mirror/ArtMethod"), a = require("../../../../JSHandle"), o = require("../../../../Object"), s = require("../ShadowFrame"), d = require("../Globals"), c = require("../Thread");

class l extends a.JSHandle {
  thread_=this.CurrentHandle;
  walk_kind_=this.thread_.add(d.PointerSize);
  cur_shadow_frame_=this.walk_kind_.add(d.PointerSize);
  cur_quick_frame_=this.cur_shadow_frame_.add(d.PointerSize);
  cur_quick_frame_pc_=this.cur_quick_frame_.add(d.PointerSize);
  cur_oat_quick_method_header_=this.cur_quick_frame_pc_.add(d.PointerSize);
  num_frames_=this.cur_oat_quick_method_header_.add(d.PointerSize);
  cur_depth_=this.num_frames_.add(d.PointerSize);
  current_code_info_=this.cur_depth_.add(d.PointerSize);
  current_inline_frames_=this.current_code_info_.add(d.PointerSize);
  context_=this.current_inline_frames_.add(d.PointerSize);
  check_suspended_=this.context_.add(d.PointerSize);
  constructor(t) {
    super(t);
  }
  toString() {
    let t = `StackVisitor< ${this.handle} >`;
    return this.handle.isNull() || (t += `\n${this.thread}`, t += `\n${this.walk_kind}`, 
    t += `\n${this.cur_shadow_frame}`, t += `\n${this.cur_quick_frame}`, t += `\n${this.cur_quick_frame_pc}`, 
    t += `\n${this.cur_oat_quick_method_header}`, t += `\n${this.num_frames}`, t += `\n${this.cur_depth}`, 
    t += `\n${this.current_code_info}`, t += `\n${this.current_inline_frames}`, t += `\n${this.context}`, 
    t += `\n${this.check_suspended}`), t;
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass).add(this.VirtualClassOffset);
  }
  get SizeOfClass() {
    return this.check_suspended_.add(d.PointerSize).sub(this.CurrentHandle).toInt32();
  }
  get VirtualClassOffset() {
    return d.PointerSize;
  }
  get thread() {
    return new c.ArtThread(this.thread_.readPointer());
  }
  get walk_kind() {
    return this.walk_kind_.readU32();
  }
  get cur_shadow_frame() {
    return new s.ShadowFrame(this.cur_shadow_frame_.readPointer());
  }
  get cur_quick_frame() {
    return new n.ArtMethod(this.cur_quick_frame_.readPointer().readPointer());
  }
  get cur_quick_frame_pc() {
    return this.cur_quick_frame_pc_.readPointer();
  }
  get cur_oat_quick_method_header() {
    return new e.OatQuickMethodHeader(this.cur_oat_quick_method_header_.readPointer());
  }
  get num_frames() {
    return this.num_frames_.readPointer().toInt32();
  }
  get cur_depth() {
    return this.cur_depth_.readPointer().toInt32();
  }
  get current_code_info() {
    return this.current_code_info_.readPointer();
  }
  get current_inline_frames() {
    return this.current_inline_frames_.readPointer();
  }
  get context() {
    return this.context_.readPointer();
  }
  get check_suspended() {
    return 1 == this.check_suspended_.readU8();
  }
  static fromThread(t, e, r, n = !0) {
    return new l((0, i.callSym)("_ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEb", "libart.so", "pointer", [ "pointer", "pointer", "int", "bool" ], t, e, r, n));
  }
  GetDexPc(t) {
    return (0, i.callSym)("_ZNK3art12StackVisitor8GetDexPcEb", "libart.so", "int", [ "pointer", "int" ], this.CurrentHandle, t);
  }
  GetMethod() {
    return new n.ArtMethod((0, i.callSym)("_ZNK3art12StackVisitor9GetMethodEv", "libart.so", "pointer", [ "pointer" ], this.CurrentHandle));
  }
  GetGPR(t) {
    return (0, i.callSym)("_ZNK3art12StackVisitor6GetGPREj", "libart.so", "pointer", [ "pointer", "int" ], this.handle, t);
  }
  GetVRegPairFromOptimizedCode(t, e, r, n, a) {
    return (0, i.callSym)("_ZNK3art12StackVisitor28GetVRegPairFromOptimizedCodeEPNS_9ArtMethodEtNS_8VRegKindES3_Pm", "libart.so", "pointer", [ "pointer", "pointer", "short", "int", "int" ], this.handle, t.handle, e, r, n, a).isNull();
  }
  GetGPRAddress(t) {
    return (0, i.callSym)("_ZNK3art12StackVisitor13GetGPRAddressEj", "libart.so", "pointer", [ "pointer", "int" ], this.handle, t);
  }
  SanityCheckFrame() {
    (0, i.callSym)("_ZNK3art12StackVisitor16SanityCheckFrameEv", "libart.so", "void", [ "pointer" ], this.handle);
  }
  SetMethod(t) {
    (0, i.callSym)("_ZN3art12StackVisitor9SetMethodEPNS_9ArtMethodE", "libart.so", "void", [ "pointer", "pointer" ], this.handle, t.handle);
  }
  ComputeNumFrames(t, e) {
    return (0, i.callSym)("_ZN3art12StackVisitor16ComputeNumFramesEPNS_6ThreadENS0_13StackWalkKindE", "libart.so", "int", [ "pointer", "pointer", "int" ], this.handle, t, e);
  }
  WalkStack_0(t) {
    (0, i.callSym)("_ZN3art12StackVisitor9WalkStackILNS0_16CountTransitionsE0EEEvb", "libart.so", "void", [ "pointer", "bool" ], this.handle, t);
  }
  WalkStack_1(t) {
    (0, i.callSym)("_ZN3art12StackVisitor9WalkStackILNS0_16CountTransitionsE1EEEvb", "libart.so", "void", [ "pointer", "bool" ], this.handle, t);
  }
  GetReturnPc() {
    return (0, i.callSym)("_ZNK3art12StackVisitor11GetReturnPcEv", "libart.so", "pointer", [ "pointer" ], this.handle);
  }
  SetReturnPc(t) {
    (0, i.callSym)("_ZN3art12StackVisitor11SetReturnPcEm", "libart.so", "void", [ "pointer", "pointer" ], this.handle, t);
  }
  DescribeStack(t) {
    (0, i.callSym)("_ZN3art12StackVisitor13DescribeStackEPNS_6ThreadE", "libart.so", "void", [ "pointer", "pointer" ], this.handle, t.handle);
  }
  GetVRegFromOptimizedCode(t, e, r, n) {
    return (0, i.callSym)("_ZNK3art12StackVisitor24GetVRegFromOptimizedCodeEPNS_9ArtMethodEtNS_8VRegKindEPj", "libart.so", "int", [ "pointer", "pointer", "short", "int", "int" ], this.handle, t.handle, e, r, n);
  }
  GetVRegPair(t, e, r, n, a) {
    return (0, i.callSym)("_ZNK3art12StackVisitor11GetVRegPairEPNS_9ArtMethodEtNS_8VRegKindES3_Pm", "libart.so", "int", [ "pointer", "pointer", "short", "int", "int" ], this.handle, t.handle, e, r, n, a);
  }
  SetVReg(t, e, r, n) {
    return (0, i.callSym)("_ZN3art12StackVisitor7SetVRegEPNS_9ArtMethodEtjNS_8VRegKindE", "libart.so", "int", [ "pointer", "pointer", "short", "int", "int" ], this.handle, t.handle, e, r, n);
  }
  GetVReg(t, e, r) {
    return (0, i.callSym)("_ZNK3art12StackVisitor7GetVRegEPNS_9ArtMethodEtNS_8VRegKindEPj", "libart.so", "int", [ "pointer", "pointer", "short", "int", "int" ], this.handle, t.handle, e, r);
  }
  GetNativePcOffset() {
    return (0, i.callSym)("_ZN3art12StackVisitor19GetNativePcOffsetEv", "libart.so", "int", [ "pointer" ], this.handle);
  }
  SetVRegPair(t, e, r, n, a) {
    return (0, i.callSym)("_ZN3art12StackVisitor11SetVRegPairEPNS_9ArtMethodEtmNS_8VRegKindES3_", "libart.so", "int", [ "pointer", "pointer", "short", "int", "int", "int" ], this.handle, t.handle, e, r, n, a);
  }
  DescribeLocation() {
    return r.StdString.fromPointer((0, i.callSym)("_ZNK3art12StackVisitor16DescribeLocationEv", "libart.so", "pointer", [ "pointer" ], this.handle));
  }
  GetCurrentQuickFrameInfo() {
    return new t.QuickMethodFrameInfo((0, i.callSym)("_ZNK3art12StackVisitor24GetCurrentQuickFrameInfoEv", "libart.so", "pointer", [ "pointer" ], this.handle));
  }
  IsAccessibleGPR(t) {
    return (0, i.callSym)("_ZNK3art12StackVisitor15IsAccessibleGPREj", "libart.so", "bool", [ "pointer", "int" ], this.handle, t);
  }
  GetFPR(t) {
    return (0, i.callSym)("_ZNK3art12StackVisitor6GetFPREj", "libart.so", "pointer", [ "pointer", "int" ], this.handle, t);
  }
  GetVRegPairFromDebuggerShadowFrame(t, e, r, n) {
    return (0, i.callSym)("_ZNK3art12StackVisitor34GetVRegPairFromDebuggerShadowFrameEtNS_8VRegKindES1_Pm", "libart.so", "int", [ "pointer", "int", "int", "int" ], this.handle, t, e, r, n);
  }
  GetVRegFromDebuggerShadowFrame(t, e) {
    return (0, i.callSym)("_ZNK3art12StackVisitor30GetVRegFromDebuggerShadowFrameEtNS_8VRegKindEPj", "libart.so", "int", [ "pointer", "short", "pointer" ], this.handle, t, e);
  }
  GetRegisterPairIfAccessible(t, e, r, n) {
    return (0, i.callSym)("_ZNK3art12StackVisitor27GetRegisterPairIfAccessibleEjjNS_8VRegKindEPm", "libart.so", "int", [ "pointer", "int", "int", "int", "int" ], this.handle, t, e, r, n);
  }
  GetRegisterIfAccessible(t, e, r) {
    return (0, i.callSym)("_ZNK3art12StackVisitor23GetRegisterIfAccessibleEjNS_8VRegKindEPj", "libart.so", "int", [ "pointer", "int", "int" ], this.handle, t, e, r);
  }
  IsAccessibleFPR(t) {
    return (0, i.callSym)("_ZNK3art12StackVisitor15IsAccessibleFPREj", "libart.so", "bool", [ "pointer", "int" ], this.handle, t);
  }
  GetThisObject() {
    return new o.ArtObject((0, i.callSym)("_ZNK3art12StackVisitor13GetThisObjectEv", "libart.so", "pointer", [ "pointer" ], this.handle));
  }
  GetNextMethodAndDexPc(t, e) {
    return (0, i.callSym)("_ZN3art12StackVisitor20GetNextMethodAndDexPcEPPNS_9ArtMethodEPj", "libart.so", "bool", [ "pointer", "pointer", "pointer" ], this.handle, t, e);
  }
}

var _, h;

exports.StackVisitor = l, function(t) {
  t[t.kReferenceVReg = 0] = "kReferenceVReg", t[t.kIntVReg = 1] = "kIntVReg", t[t.kFloatVReg = 2] = "kFloatVReg", 
  t[t.kLongLoVReg = 3] = "kLongLoVReg", t[t.kLongHiVReg = 4] = "kLongHiVReg", t[t.kDoubleLoVReg = 5] = "kDoubleLoVReg", 
  t[t.kDoubleHiVReg = 6] = "kDoubleHiVReg", t[t.kConstant = 7] = "kConstant", t[t.kImpreciseConstant = 8] = "kImpreciseConstant", 
  t[t.kUndefined = 9] = "kUndefined";
}(_ = exports.VRegKind || (exports.VRegKind = {})), function(t) {
  t[t.kIncludeInlinedFrames = 0] = "kIncludeInlinedFrames", t[t.kSkipInlinedFrames = 1] = "kSkipInlinedFrames";
}(h = exports.StackWalkKind || (exports.StackWalkKind = {}));

},{"../../../../../tools/StdString":110,"../../../../JSHandle":13,"../../../../Object":14,"../../../../Utils/SymHelper":21,"../Globals":38,"../OatQuickMethodHeader":50,"../QuickMethodFrameInfo":56,"../ShadowFrame":57,"../Thread":62,"../mirror/ArtMethod":86}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./StackVisitor"), require("./CHAStackVisitor"), require("./CatchBlockStackVisitor");

},{"./CHAStackVisitor":58,"./CatchBlockStackVisitor":59,"./StackVisitor":60}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ArtThread = void 0;

const t = require("./Thread_Inl"), r = require("../../../Utils/SymHelper"), e = require("../../../../tools/StdString"), a = require("./mirror/ArtMethod"), n = require("../../../JSHandle"), i = require("./Globals");

class o extends n.JSHandle {
  tls32_;
  tls64_;
  tlsPtr_;
  interpreter_cache_;
  wait_mutex_;
  wait_cond_;
  wait_monitor_;
  debug_disallow_read_barrier_;
  poison_object_cookie_;
  checkpoint_overflow_;
  custom_tls_;
  is_runtime_thread_;
  constructor(t) {
    super(t);
  }
  toString() {
    let t = `ArtThread<${this.handle}>`;
    return this.handle.isNull() || (t += `\n\t ThreadName=${this.GetThreadName()}`, 
    t += `\n\t is_started=${this.is_started}`), t;
  }
  get tls_ptr_managed_stack() {
    return new t.ManagedStack(this.tlsPtr_.managed_stack.readPointer());
  }
  get tls_ptr_stack_begin() {
    return this.tlsPtr_.stack_begin.readPointer();
  }
  get tls_ptr_stack_size() {
    return this.tlsPtr_.stack_size.readPointer().toInt32();
  }
  get tls_ptr_stack_end() {
    return this.tlsPtr_.stack_end.readPointer();
  }
  get tls_ptr_name() {
    return this.tlsPtr_.name.readCString();
  }
  get tls_ptr_self() {
    return new o(this.tlsPtr_.self.readPointer());
  }
  get tls_ptr_jni_env() {
    return this.tlsPtr_.jni_env.readPointer();
  }
  get is_started() {
    return 1 == (0, r.getSym)("_ZN3art6Thread11is_started_E", "libart.so").readU8();
  }
  GetThreadName() {
    return e.StdString.from((0, r.callSym)("_ZNK3art6Thread13GetThreadNameEv", "libart.so", "pointer", [ "pointer" ], this.CurrentHandle));
  }
  SetThreadName(t) {
    (0, r.callSym)("_ZN3art6Thread13SetThreadNameEPKc", "libart.so", "void", [ "pointer", "pointer" ], this.CurrentHandle, Memory.allocUtf8String(t));
  }
  DumpJavaStack(t = !0, a = !0) {
    let n = new e.StdString;
    return (0, r.callSym)("_ZNK3art6Thread13DumpJavaStackERNSt3__113basic_ostreamIcNS1_11char_traitsIcEEEEbb", "libart.so", "void", [ "pointer", "bool", "bool" ], this.CurrentHandle, n, t, a), 
    n.disposeToString();
  }
  NumberOfHeldMutexes() {
    return (0, r.callSym)("_ZNK3art6Thread19NumberOfHeldMutexesEv", "libart.so", "int", [ "pointer" ], this.CurrentHandle);
  }
  SetClassLoaderOverride(t) {
    (0, r.callSym)("_ZN3art6Thread22SetClassLoaderOverrideEP8_jobject", "libart.so", "void", [ "pointer", "pointer" ], this.CurrentHandle, t.handle);
  }
  FindDebuggerShadowFrame(t) {
    return (0, r.callSym)("_ZN3art6Thread23FindDebuggerShadowFrameEm", "libart.so", "pointer", [ "pointer", "int" ], this.CurrentHandle, t);
  }
  Park(t = !0, e = 10) {
    (0, r.callSym)("_ZN3art6Thread4ParkEbl", "libart.so", "void", [ "pointer", "pointer", "pointer" ], this.CurrentHandle, ptr(t ? 1 : 0), ptr(e));
  }
  Unpark() {
    (0, r.callSym)("_ZN3art6Thread6UnparkEv", "libart.so", "void", [ "pointer" ], this.CurrentHandle);
  }
  Notify() {
    (0, r.callSym)("_ZN3art6Thread6NotifyEv", "libart.so", "void", [ "pointer" ], this.CurrentHandle);
  }
  static GetNativePriority() {
    return (0, r.callSym)("_ZN3art6Thread17GetNativePriorityEv", "libart.so", "int", []);
  }
  CanLoadClasses() {
    return !!(0, r.callSym)("_ZNK3art6Thread14CanLoadClassesEv", "libart.so", "int", [ "pointer" ], this.CurrentHandle);
  }
  GetCurrentMethod(t = 0, e = !0, n = !0) {
    return new a.ArtMethod((0, r.callSym)("_ZNK3art6Thread16GetCurrentMethodEPjbb", "libart.so", "pointer", [ "pointer", "pointer", "pointer", "pointer" ], this.CurrentHandle, ptr(t), ptr(e ? 1 : 0), ptr(n ? 1 : 0)));
  }
  Interrupt() {
    (0, r.callSym)("_ZN3art6Thread9InterruptEPS0_", "libart.so", "void", [ "pointer" ], this.CurrentHandle);
  }
  IsInterrupted() {
    return !!(0, r.callSym)("_ZN3art6Thread13IsInterruptedEv", "libart.so", "int", [ "pointer" ], this.CurrentHandle);
  }
  Interrupted() {
    return !!(0, r.callSym)("_ZN3art6Thread11InterruptedEv", "libart.so", "int", [ "pointer" ], this.CurrentHandle);
  }
  IsSystemDaemon() {
    return !!(0, r.callSym)("_ZNK3art6Thread14IsSystemDaemonEv", "libart.so", "int", [ "pointer" ], this.CurrentHandle);
  }
  static IsAotCompiler() {
    return !!(0, r.callSym)("_ZN3art6Thread13IsAotCompilerEv", "libart.so", "int", []);
  }
  ProtectStack(t = !0) {
    return !!(0, r.callSym)("_ZN3art6Thread12ProtectStackEb", "libart.so", "int", [ "pointer", "bool" ], this.CurrentHandle, t);
  }
  UnprotectStack() {
    (0, r.callSym)("_ZN3art6Thread14UnprotectStackEv", "libart.so", "void", [ "pointer" ], this.CurrentHandle);
  }
  HandleScopeContains(t) {
    return !!(0, r.callSym)("_ZNK3art6Thread19HandleScopeContainsEP8_jobject", "libart.so", "int", [ "pointer", "pointer" ], this.CurrentHandle, t.handle);
  }
  static Attach_3(t, e, a) {
    return new o((0, r.callSym)("_ZN3art6Thread6AttachEPKcbP8_jobject", "libart.so", "pointer", [ "pointer", "bool", "pointer" ], Memory.allocUtf8String(t), e, a.handle));
  }
  static Attach_4(t, e, a, n) {
    return new o((0, r.callSym)("_ZN3art6Thread6AttachEPKcbP8_jobjectb", "libart.so", "pointer", [ "pointer", "bool", "pointer", "bool" ], Memory.allocUtf8String(t), e, a.handle, n));
  }
}

exports.ArtThread = o;

},{"../../../../tools/StdString":110,"../../../JSHandle":13,"../../../Utils/SymHelper":21,"./Globals":38,"./Thread_Inl":63,"./mirror/ArtMethod":86}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ManagedStack = exports.RuntimeStats = exports.StateAndFlags = void 0;

const t = require("../../../JSHandle"), e = require("./ShadowFrame"), s = require("./Globals");

class a extends t.JSHandleNotImpl {
  as_struct;
  as_atomic_int=this.handle.add(4);
  as_int=this.handle.add(4);
  constructor(t) {
    super(t), this.as_struct = {
      flags: this.handle,
      state: this.handle
    };
  }
  toString() {
    let t = `StateAndFlags<${this.handle}>`;
    return this.handle.isNull() || (t += `\n\t flags=${this.flags}`, t += `\n\t state=${this.state}`), 
    t;
  }
  get flags() {
    return this.as_struct.flags.readU16();
  }
  get state() {
    return this.as_struct.state.readU16();
  }
  get as_atomic_int_value() {
    return this.as_atomic_int.readS32();
  }
  get as_int_value() {
    return this.as_int.readS32();
  }
  static get SizeOfClass() {
    return 12;
  }
}

exports.StateAndFlags = a;

class _ extends t.JSHandleNotImpl {
  allocated_objects=this.handle;
  allocated_bytes=this.allocated_objects.add(8);
  freed_objects=this.allocated_bytes.add(8);
  freed_bytes=this.freed_objects.add(8);
  gc_for_alloc_count=this.freed_bytes.add(8);
  class_init_count=this.gc_for_alloc_count.add(8);
  class_init_time_ns=this.class_init_count.add(8);
  toString() {
    let t = `RuntimeStats<${this.handle}>`;
    return this.handle.isNull() || (t += `\n\t allocated_objects=${this.allocated_objects}`, 
    t += `\n\t allocated_bytes=${this.allocated_bytes}`, t += `\n\t freed_objects=${this.freed_objects}`, 
    t += `\n\t freed_bytes=${this.freed_bytes}`, t += `\n\t gc_for_alloc_count=${this.gc_for_alloc_count}`, 
    t += `\n\t class_init_count=${this.class_init_count}`, t += `\n\t class_init_time_ns=${this.class_init_time_ns}`), 
    t;
  }
  static get SizeOfClass() {
    return 56;
  }
}

exports.RuntimeStats = _;

class i extends t.JSHandleNotImpl {
  tagged_top_quick_frame_;
  link_;
  top_shadow_frame_;
  constructor(t) {
    super(t), this.tagged_top_quick_frame_ = {
      tagged_sp_: this.handle
    }, this.link_ = this.tagged_top_quick_frame_.tagged_sp_.add(s.PointerSize), this.top_shadow_frame_ = this.link_.add(s.PointerSize);
  }
  toString() {
    let t = `ManagedStack<${this.handle}>`;
    return this.handle.isNull() || (t += `\n\t tagged_sp=${this.tagged_sp}`, t += `\n\t link=${this.link}`, 
    t += `\n\t top_shadow_frame=${this.top_shadow_frame}`), t;
  }
  get link() {
    return new i(this.link_.readPointer());
  }
  get top_shadow_frame() {
    return new e.ShadowFrame(this.top_shadow_frame_.readPointer());
  }
  get tagged_sp() {
    return this.tagged_top_quick_frame_.tagged_sp_;
  }
}

exports.ManagedStack = i;

},{"../../../JSHandle":13,"./Globals":38,"./ShadowFrame":57}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.JValue = void 0;

const t = require("../../../../JSHandle"), e = require("../../../../Object");

class s extends t.JSHandleNotImpl {
  z=this.handle;
  b=this.z.add(1);
  c=this.b.add(1);
  s=this.c.add(2);
  i=this.s.add(2);
  j=this.i.add(4);
  f=this.j.add(8);
  d=this.f.add(4);
  l=this.d.add(8);
  constructor(t) {
    super(t);
  }
  get z_() {
    return this.z.readU8();
  }
  get b_() {
    return this.b.readS8();
  }
  get c_() {
    return this.c.readU16();
  }
  get s_() {
    return this.s.readS16();
  }
  get i_() {
    return this.i.readS32();
  }
  get j_() {
    return this.j.readS64();
  }
  get f_() {
    return this.f.readFloat();
  }
  get d_() {
    return this.d.readDouble();
  }
  get l_() {
    return new e.ArtObject(this.l.readPointer());
  }
  GetGCRoot() {
    return this.l;
  }
  toString() {
    let t = `JValue<${this.handle}>`;
    return this.handle.isNull() || (t += `\n\t z=${this.z_}`, t += `\n\t b=${this.b_}`, 
    t += `\n\t c=${this.c_}`, t += `\n\t s=${this.s_}`, t += `\n\t i=${this.i_}`, t += `\n\t j=${this.j_}`, 
    t += `\n\t f=${this.f_}`, t += `\n\t d=${this.d_}`, t += `\n\t l=${this.l_}`), t;
  }
}

exports.JValue = s;

},{"../../../../JSHandle":13,"../../../../Object":14}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.JavaString = void 0;

const t = require("../../../../Object");

class e extends t.ArtObject {
  count_=this.CurrentHandle;
  hash_code_=this.count_.add(4);
  str_data_;
  constructor(t) {
    super(t), this.str_data_ = {
      data_: this.hash_code_.add(4),
      entry_point_from_quick_compiled_code_: this.hash_code_.add(4)
    };
  }
  toString() {
    let t = `JavaString<${this.handle}>`;
    return this.handle.isNull() || (t += `\n\t count_=${this.count_} <- ${this.count}`, 
    t += `\n\t hash_code_=${this.hash_code_} <- ${this.hash_code}`, t += `\n\t str_data_=${this.str_data_.data_} -> '${this.value}'`), 
    t;
  }
  get count() {
    return this.count_.readS32();
  }
  get hash_code() {
    return this.hash_code_.readU32();
  }
  get value_ptr() {
    return this.str_data_.data_;
  }
  get value() {
    return this.value_ptr.readCString();
  }
  static caseToJavaString(t) {
    return new e(t.handle);
  }
}

exports.JavaString = e;

},{"../../../../Object":14}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.Throwable = void 0;

const e = require("../../../../Interface/art/mirror/HeapReference"), t = require("../../../../Object");

class s extends t.ArtObject {
  backtrace_=this.CurrentHandle;
  cause_=this.backtrace_.add(e.HeapReference.Size);
  detail_message_=this.cause_.add(e.HeapReference.Size);
  stack_trace_=this.detail_message_.add(e.HeapReference.Size);
  suppressed_exceptions_=this.stack_trace_.add(e.HeapReference.Size);
  toString() {
    let e = `Throwable<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t backtrace_=${this.backtrace_} <- ${this.backtrace.root}`, 
    e += `\n\t cause_=${this.cause_} <- ${this.cause.root}`, e += `\n\t detail_message_=${this.detail_message_} <- ${this.detail_message.root}`, 
    e += `\n\t stack_trace_=${this.stack_trace_} <- ${this.stack_trace.root}`, e += `\n\t suppressed_exceptions_=${this.suppressed_exceptions_} <- ${this.suppressed_exceptions.root}`), 
    e;
  }
  get backtrace() {
    return new e.HeapReference((e => new t.ArtObject(e)), this.backtrace_);
  }
  get cause() {
    return new e.HeapReference((e => new s(e)), this.cause_);
  }
  get detail_message() {
    return new e.HeapReference((e => new t.ArtObject(e)), this.detail_message_);
  }
  get stack_trace() {
    return new e.HeapReference((e => new t.ArtObject(e)), this.stack_trace_);
  }
  get suppressed_exceptions() {
    return new e.HeapReference((e => new t.ArtObject(e)), this.suppressed_exceptions_);
  }
}

exports.Throwable = s;

},{"../../../../Interface/art/mirror/HeapReference":9,"../../../../Object":14}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./JValue"), require("./jobject"), require("./JavaString"), require("./Throwable");

},{"./JValue":64,"./JavaString":65,"./Throwable":66,"./jobject":68}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.jobject = void 0;

const e = require("../../../../JSHandle");

class t extends e.JSHandleNotImpl {
  constructor(e) {
    super(e);
  }
  toString() {
    let e = `jobject<${this.handle}>`;
    return this.handle.isNull(), e;
  }
}

exports.jobject = t;

},{"../../../../JSHandle":13}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.CodeItemDataAccessor = void 0;

const e = require("../Globals"), s = require("./CodeItemInstructionAccessor");

class t extends s.CodeItemInstructionAccessor {
  registers_size_=this.CurrentHandle.add(0);
  ins_size_=this.CurrentHandle.add(2);
  outs_size_=this.CurrentHandle.add(4);
  tries_size_=this.CurrentHandle.add(6);
  constructor(e, s, t = 0, i = 0, r = 0, _ = 0) {
    "number" == typeof e && (super(e, s), this.registers_size_.writeU16(t), this.ins_size_.writeU16(i), 
    this.outs_size_.writeU16(r), this.tries_size_.writeU16(_));
  }
  toString() {
    let e = `CodeItemDataAccessor<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t registers_size_: ${this.registers_size}`, 
    e += `\n\t ins_size_: ${this.ins_size}`, e += `\n\t outs_size_: ${this.outs_size}`, 
    e += `\n\t tries_size_: ${this.tries_size}`), e;
  }
  get SizeOfClass() {
    return t.SIZE_OF_CodeItemDataAccessor + super.SizeOfClass;
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass);
  }
  get registers_size() {
    return this.registers_size_.readU16();
  }
  get ins_size() {
    return this.ins_size_.readU16();
  }
  get outs_size() {
    return this.outs_size_.readU16();
  }
  get tries_size() {
    return this.tries_size_.readU16();
  }
  set registers_size(e) {
    this.registers_size_.writeU16(e);
  }
  set ins_size(e) {
    this.ins_size_.writeU16(e);
  }
  set outs_size(e) {
    this.outs_size_.writeU16(e);
  }
  set tries_size(e) {
    this.tries_size_.writeU16(e);
  }
  static fromRef(s) {
    const i = Object.create(t.prototype);
    return i.handle = s, i.registers_size_ = s.add(8 + e.PointerSize), i.ins_size_ = i.registers_size_.add(2), 
    i.outs_size_ = i.ins_size_.add(2), i.tries_size_ = i.outs_size_.add(2), Reflect.defineProperty(i, "insns_", s.add(8)), 
    Reflect.defineProperty(i, "insns_size_in_code_units_", s), i;
  }
}

exports.CodeItemDataAccessor = t;

},{"../Globals":38,"./CodeItemInstructionAccessor":72}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.CodeItemDebugInfoAccessor = void 0;

const e = require("./CodeItemDataAccessor"), t = require("../Globals");

class s extends e.CodeItemDataAccessor {
  dex_file_=this.CurrentHandle.add(0);
  debug_info_offset_=this.CurrentHandle.add(t.PointerSize);
  constructor(e, t, s, i, r, o, d = NULL, f = 0) {
    super(e, t, s, i, r, o), this.dex_file_.writePointer(d), this.debug_info_offset_.writeU32(f);
  }
  toString() {
    let e = `CodeItemDebugInfoAccessor< ${this.handle} >`;
    return this.handle.isNull() || (e += `\ndex_file_: ${this.dex_file}`, e += `\ndebug_info_offset_: ${this.debug_info_offset}`), 
    e;
  }
  get SizeOfClass() {
    return s.SIZE_OF_CodeItemDebugInfoAccessor + super.SizeOfClass;
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass);
  }
  get dex_file() {
    return this.dex_file_.readPointer();
  }
  get debug_info_offset() {
    return this.debug_info_offset_.readU32();
  }
  set dex_file(e) {
    this.dex_file_.writePointer(e);
  }
  set debug_info_offset(e) {
    this.debug_info_offset_.writeU32(e);
  }
}

exports.CodeItemDebugInfoAccessor = s;

},{"../Globals":38,"./CodeItemDataAccessor":70}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.CodeItemInstructionAccessor = void 0;

const e = require("./StandardDexFile"), s = require("./CompactDexFile"), t = require("../../../../JSHandle"), n = require("../Instruction"), i = require("../Globals");

class r extends t.JSHandle {
  static SIZE_OF_CodeItemInstructionAccessor=4 + i.PointerSize;
  static SIZE_OF_CodeItemDebugInfoAccessor=i.PointerSize + 4;
  static SIZE_OF_CodeItemDataAccessor=8;
  CodeItem;
  insns_size_in_code_units_=this.CurrentHandle;
  insns_=this.CurrentHandle.add(4);
  constructor(e = 0, s = NULL) {
    if ("number" == typeof e && 0 == e && s.isNull()) {
      const t = r.SIZE_OF_CodeItemInstructionAccessor + r.SIZE_OF_CodeItemDataAccessor + r.SIZE_OF_CodeItemDebugInfoAccessor;
      super(Memory.alloc(t)), this.CurrentHandle.add(0).writeU32(e), this.CurrentHandle.add(4).writePointer(s);
    }
  }
  toString() {
    let e = `CodeItemInstructionAccessor<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\tinsns_size_in_code_units: ${this.insns_size_in_code_units} | insns: ${this.insns} | insns_size_in_bytes: ${this.InsnsSizeInBytes()}`, 
    e += `\n\n\tinsns: ${this.CodeItem.toString().split("\n").map(((e, s) => 0 == s ? e : `\n\t${e}`)).join("")}`), 
    e;
  }
  static CodeItem(t, n) {
    return t.is_compact_dex ? new s.CompactDexFile_CodeItem(n) : new e.StandardDexFile_CodeItem(n);
  }
  static fromDexFile(e, s) {
    const t = new r;
    if (e.is_compact_dex) {
      const n = r.CodeItem(e, s);
      t.insns_size_in_code_units = n.insns_size_in_code_units, t.insns = n.insns_start, 
      t.CodeItem = n;
    } else {
      const n = r.CodeItem(e, s);
      t.insns_size_in_code_units = n.insns_size_in_code_units, t.insns = n.insns_start, 
      t.CodeItem = n;
    }
    return t;
  }
  static fromArtMethod(e) {
    const s = e.GetDexFile(), t = e.GetCodeItem();
    return r.fromDexFile(s, t);
  }
  get SizeOfClass() {
    return r.SIZE_OF_CodeItemInstructionAccessor + super.SizeOfClass;
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass);
  }
  get insns_size_in_code_units() {
    return this.insns_size_in_code_units_.readU32();
  }
  get insns() {
    return this.insns_.readPointer();
  }
  set insns_size_in_code_units(e) {
    this.insns_size_in_code_units_.writeU32(e);
  }
  set insns(e) {
    this.insns_.writePointer(e);
  }
  InsnsSizeInBytes() {
    return 2 * this.insns_size_in_code_units;
  }
  InstructionAt(e = 0) {
    return n.ArtInstruction.At(this.insns.add(e));
  }
}

exports.CodeItemInstructionAccessor = r, globalThis.fromDexFile = r.fromDexFile, 
globalThis.fromArtMethod = r.fromArtMethod;

},{"../../../../JSHandle":13,"../Globals":38,"../Instruction":39,"./CompactDexFile":73,"./StandardDexFile":78}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.CompactDexFile_CodeItem = exports.CompactDexFile = void 0;

const s = require("./DexFile"), e = require("../Globals");

class t extends s.DexFile {
  constructor(s) {
    super(s);
  }
}

exports.CompactDexFile = t;

class n extends s.DexFile_CodeItem {
  fields_=this.CurrentHandle;
  insns_count_and_flags_=this.fields_.add(2);
  insns_=this.insns_count_and_flags_.add(2);
  constructor(s) {
    super(s);
  }
  toString() {
    let s = `CompactDexFile::CodeItem<${this.handle}>`;
    return s += `\n\tfields: ${this.fields} | insns_count_and_flags: ${this.insns_count_and_flags} | insns: ${this.insns_start}`, 
    s += `\n\tregisters_size: ${this.registers_size} | ins_size: ${this.ins_size} | outs_size: ${this.outs_size} | tries_size: ${this.tries_size}`, 
    s += `\n\tinsns_size_in_code_units: ${this.insns_size_in_code_units} | extension_preheader: ${this.extension_preheader}`, 
    s;
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass);
  }
  get fields() {
    return ptr(this.fields_.readU16());
  }
  get insns_count_and_flags() {
    return ptr(this.insns_count_and_flags_.readU16());
  }
  set insns_count_and_flags(s) {
    this.insns_count_and_flags_.writeU16(s.toInt32());
  }
  set fields(s) {
    this.fields_.writeU16(s.toUInt32());
  }
  get registers_size() {
    return this.fields.toUInt32() >> 12;
  }
  get ins_size() {
    return this.fields.and(3840).toUInt32() >> 8;
  }
  set ins_size(s) {
    this.fields = ptr(s << 8 | this.fields.toUInt32());
  }
  get outs_size() {
    return (240 & this.fields.toUInt32()) >> 4;
  }
  get tries_size() {
    return (15 & this.fields.toUInt32()) >> 0;
  }
  get insns_size_in_code_units() {
    return this.insns_count_and_flags.shr(e.kInsnsSizeShift).toUInt32();
  }
  set insns_size_in_code_units(s) {
    this.insns_count_and_flags = ptr(s << e.kInsnsSizeShift | this.insns_count_and_flags.toUInt32());
  }
  get extension_preheader() {
    return this.insns_count_and_flags.shl(e.kInsnsSizeShift).toUInt32();
  }
  get header_start() {
    return this.CurrentHandle;
  }
  get header_size() {
    return this.insns_.sub(this.CurrentHandle).toUInt32();
  }
  get insns_start() {
    return this.insns_;
  }
  get insns_size() {
    return 2 * this.insns_size_in_code_units;
  }
}

exports.CompactDexFile_CodeItem = n;

},{"../Globals":38,"./DexFile":74}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.DexFile_CodeItem = exports.DexFile = void 0;

const e = require("./DexFileStructs"), t = require("./Header"), i = require("../../../../../tools/StdString"), s = require("./DexIndex"), d = require("../../../../Utils/SymHelper"), r = require("../../../../JSHandle"), n = require("../Oat/OatDexFile"), a = require("../Globals");

class o extends r.JSHandle {
  static Standard_InsnsOffset=16;
  static Compact_InsnsOffset=12;
  v_table=this.handle;
  begin_=this.currentHandle;
  size_=this.begin_.add(1 * a.PointerSize);
  data_begin_=this.size_.add(1 * a.PointerSize);
  data_size_=this.data_begin_.add(1 * a.PointerSize);
  location_=this.data_size_.add(1 * a.PointerSize);
  location_checksum_=this.location_.add(3 * a.PointerSize);
  header_=this.location_checksum_.add(4).add(4);
  string_ids_=this.header_.add(1 * a.PointerSize);
  type_ids_=this.string_ids_.add(1 * a.PointerSize);
  field_ids_=this.type_ids_.add(1 * a.PointerSize);
  method_ids_=this.field_ids_.add(1 * a.PointerSize);
  proto_ids_=this.method_ids_.add(1 * a.PointerSize);
  class_defs_=this.proto_ids_.add(1 * a.PointerSize);
  method_handles_=this.class_defs_.add(1 * a.PointerSize);
  num_method_handles_=this.method_handles_.add(1 * a.PointerSize);
  call_site_ids_=this.num_method_handles_.add(1 * a.PointerSize);
  num_call_site_ids_=this.call_site_ids_.add(1 * a.PointerSize);
  hiddenapi_class_data_=this.num_call_site_ids_.add(1 * a.PointerSize);
  oat_dex_file_=this.hiddenapi_class_data_.add(1 * a.PointerSize);
  container_=this.oat_dex_file_.add(1 * a.PointerSize);
  is_compact_dex_=this.container_.add(1 * a.PointerSize);
  hiddenapi_domain_=this.is_compact_dex_.add(4);
  constructor(e) {
    super(e);
  }
  get VirtualClassOffset() {
    return a.PointerSize;
  }
  get currentHandle() {
    return this.handle.add(super.SizeOfClass).add(this.VirtualClassOffset);
  }
  get SizeOfClass() {
    return super.SizeOfClass + this.hiddenapi_domain_.add(4).sub(this.currentHandle).toInt32() + this.VirtualClassOffset;
  }
  toString() {
    let e = `DexFile<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t location: ${this.location} @ ${this.location_}`, 
    e += `\n\t location_checksum: ${this.location_checksum} ( ${ptr(this.location_checksum)} ) is_compact_dex: ${this.is_compact_dex}`, 
    e += `\n\t begin: ${this.begin} size: ${this.size} ( ${ptr(this.size)} ) | data_begin: ${this.data_begin} data_size: ${this.data_size} ( ${ptr(this.data_size)} )`, 
    e += `\n\t oat_dex_file_ ${this.oat_dex_file_}`, e += `\n\t string_ids: ${this.string_ids}`, 
    e += `\n\t type_ids: ${this.type_ids}`, e += `\n\t field_ids: ${this.field_ids}`, 
    e += `\n\t method_ids: ${this.method_ids}`, e += `\n\t proto_ids: ${this.proto_ids}`, 
    e += `\n\t class_defs: ${this.class_defs}`, e += `\n\t method_handles: ${this.method_handles} num_method_handles: ${this.num_method_handles}`, 
    e += `\n\t call_site_ids: ${this.call_site_ids} num_call_site_ids: ${this.num_call_site_ids}`, 
    e += `\n\t hiddenapi_class_data: ${this.hiddenapi_class_data}`, e += `\n\n${this.header}`), 
    e;
  }
  get begin() {
    return this.begin_.readPointer();
  }
  get size() {
    return this.size_.readU32();
  }
  get data_begin() {
    return this.data_begin_.readPointer();
  }
  get data_size() {
    return this.data_size_.readU32();
  }
  get location() {
    try {
      return new i.StdString(this.location_).toString();
    } catch (e) {
      return "ERROR";
    }
  }
  get location_checksum() {
    return this.location_checksum_.readU32();
  }
  get header() {
    const e = this.header_.readPointer();
    return this.is_compact_dex ? new t.CompactDexHeader(e) : new t.StandardDexHeader(e);
  }
  get string_ids() {
    return this.string_ids_.readPointer();
  }
  StringDataByIdx(t) {
    const i = t instanceof s.DexStringIndex ? t.index : t;
    if (i < 0 || i > this.NumStringIds()) throw new Error("index out of range");
    const d = this.string_ids.add(i * s.DexStringIndex.SizeOfClass).readU32(), r = this.data_begin.add(d);
    return e.LEB128String.from(r);
  }
  NumStringIds() {
    return this.header.string_ids_size;
  }
  FindStringId(e) {
    for (let t = 0; t < this.NumStringIds(); t++) {
      if (this.StringDataByIdx(t).str == e) return t;
    }
    return -1;
  }
  get type_ids() {
    return this.type_ids_.readPointer();
  }
  NumTypeIds() {
    return this.header.type_ids_size;
  }
  GetTypeId(t) {
    const i = t instanceof s.DexTypeIndex ? t.index : t;
    if (i < 0 || i > this.NumTypeIds()) throw new Error("index out of range");
    return new e.DexTypeId(this.type_ids.add(i * e.DexTypeId.SizeOfClass));
  }
  GetTypeDescriptor(e) {
    return this.StringDataByIdx(this.GetTypeId(e).descriptor_idx).str;
  }
  get field_ids() {
    return this.field_ids_.readPointer();
  }
  NumFieldIds() {
    return this.header.field_ids_size;
  }
  GetFieldId(t) {
    if (t < 0 || t > this.header.field_ids_size) throw new Error("index out of range");
    return new e.DexFieldId(this.field_ids.add(t * e.DexFieldId.SizeOfClass));
  }
  GetFieldAnnotations(t) {
    return new e.DexFieldAnnotationsItem(this.data_begin.add(0 == t.fields_size ? NULL : t.class_annotations_off_.add(a.PointerSize)));
  }
  get proto_ids() {
    return this.proto_ids_.readPointer();
  }
  NumProtoIds() {
    return this.header.proto_ids_size;
  }
  GetProtoId(t) {
    const i = t instanceof s.DexTypeIndex ? t.index : t;
    if (i < 0 || i > this.header.proto_ids_size) throw new Error("index out of range");
    return new e.DexProtoId(this.proto_ids.add(i * e.DexProtoId.SizeOfClass));
  }
  GetShorty(e) {
    return this.StringDataByIdx(this.GetProtoId(e).shorty_idx).str;
  }
  GetReturnTypeDescriptor(e) {
    return this.StringDataByIdx(e.return_type_idx).str;
  }
  GetProtoParameters(t) {
    return new e.DexTypeList(this.data_begin.add(t.parameters_off));
  }
  get method_ids() {
    return this.method_ids_.readPointer();
  }
  GetMethodId(t) {
    if (t < 0 || t > this.header.method_ids_size) throw new Error("index out of range");
    return new e.DexMethodId(this.method_ids.add(t * e.DexMethodId.SizeOfClass));
  }
  get class_defs() {
    return this.class_defs_.readPointer();
  }
  GetClassDef(t) {
    if (t < 0 || t > this.header.class_defs_size) throw new Error("index out of range");
    return new e.DexClassDef(this.class_defs.add(t * e.DexClassDef.SizeOfClass));
  }
  GetClassDescriptor(t) {
    const i = t instanceof e.DexClassDef ? t.class_idx.index : t, s = this.type_ids.add(i * e.DexClassDef.SizeOfClass).readU32();
    return this.StringDataByIdx(s).str;
  }
  FindClassDef(t) {
    return new e.DexClassDef(this.data_begin.add(this.header.class_defs_off).add(t.index * e.DexClassDef.SizeOfClass));
  }
  GetAnnotationsDirectory(t) {
    return new e.DexAnnotationsDirectoryItem(this.data_begin.add(t.annotations_off));
  }
  GetClassAnnotationSet(t) {
    return new e.DexAnnotationSetItem(this.data_begin.add(t.class_annotations_off));
  }
  NumClassDefs() {
    return this.header.class_defs_size;
  }
  GetInterfacesList(t) {
    return new e.DexTypeList(this.data_begin.add(t.interfaces_off));
  }
  get method_handles() {
    return this.method_handles_.readPointer();
  }
  get num_method_handles() {
    return this.num_method_handles_.readU32();
  }
  NumMethodHandles() {
    return this.num_method_handles;
  }
  GetMethodHandle(t) {
    if (t < 0 || t > this.num_method_handles) throw new Error("index out of range");
    return new e.DexMethodHandleItem(this.method_handles.add(t * e.DexMethodHandleItem.SizeOfClass));
  }
  get call_site_ids() {
    return this.call_site_ids_.readPointer();
  }
  get num_call_site_ids() {
    return this.num_call_site_ids_.readU32();
  }
  NumCallSiteIds() {
    return this.num_call_site_ids;
  }
  GetCallSiteId(t) {
    if (t < 0 || t > this.num_call_site_ids) throw new Error("index out of range");
    return new e.DexCallSiteIdItem(this.call_site_ids.add(t * e.DexCallSiteIdItem.SizeOfClass));
  }
  get hiddenapi_class_data() {
    return this.hiddenapi_class_data_.readPointer();
  }
  get oat_dex_file() {
    return this.oat_dex_file_.isNull() ? null : new n.OatDexFile(this.oat_dex_file_.readPointer());
  }
  get container() {
    return this.container_.readPointer();
  }
  get is_compact_dex() {
    try {
      return "cdex001" == this.begin.readCString();
    } catch (e) {
      return !1;
    }
  }
  get hiddenapi_domain() {
    return this.hiddenapi_domain_.readPointer();
  }
  get DexInstsOffset() {
    return this.is_compact_dex ? o.Compact_InsnsOffset : o.Standard_InsnsOffset;
  }
  dump(e, t) {
    let i = this.location;
    i = i.substring(i.lastIndexOf("/") + 1);
    let s = null == e ? `${this.begin}_${this.size}_${i}` : e, d = null == t ? getFilesDir() : t;
    dumpMem(this.begin, this.size, s, d, !1), LOGZ(`\t[SaveTo] => ${d}/${s}`);
  }
  PrettyMethod(e, t = !0) {
    return i.StdString.fromPointers((0, d.callSym)("_ZNK3art7DexFile12PrettyMethodEjb", "libdexfile.so", [ "pointer", "pointer", "pointer" ], [ "pointer", "pointer", "pointer" ], this.handle, ptr(e), t ? ptr(1) : NULL)).toString();
  }
  CalculateChecksum() {
    return (0, d.callSym)("_ZNK3art7DexFile17CalculateChecksumEv", "libdexfile.so", "uint32", [ "pointer" ], this.handle);
  }
  IsReadOnly() {
    if (this.is_compact_dex) return LOGE("IsReadOnly() not supported for compact dex files \n\t rm -rf /data/app/xxx/oat first"), 
    !1;
    return !(0, d.callSym)("_ZNK3art7DexFile10IsReadOnlyEv", "libdexfile.so", "pointer", [ "pointer" ], this.handle).isNull();
  }
  DisableWrite() {
    if (this.is_compact_dex) return LOGE("DisableWrite() not supported for compact dex files \n\t rm -rf /data/app/xxx/oat first"), 
    !1;
    return !(0, d.callSym)("_ZNK3art7DexFile12DisableWriteEv", "libdexfile.so", "pointer", [ "pointer" ], this.handle).isNull();
  }
  EnableWrite() {
    if (this.is_compact_dex) return LOGE("EnableWrite() not supported for compact dex files \n\t rm -rf /data/app/xxx/oat first"), 
    !1;
    return !(0, d.callSym)("_ZNK3art7DexFile11EnableWriteEv", "libdexfile.so", "pointer", [ "pointer" ], this.handle).isNull();
  }
  PrettyType(e) {
    return (0, d.callSym)("_ZNK3art7DexFile10PrettyTypeENS_3dex9TypeIndexE", "libdexfile.so", "pointer", [ "pointer", "pointer" ], this.handle, e.index);
  }
  static FindTryItem(e, t, i) {
    return (0, d.callSym)("_ZN3art7DexFile11FindTryItemEPKNS_3dex7TryItemEjj", "libdexfile.so", "int32", [ "pointer", "uint", "uint" ], e.handle, t, i);
  }
  FindStringId_(t) {
    return new e.DexStringId((0, d.callSym)("_ZNK3art7DexFile12FindStringIdEPKc", "libdexfile.so", "pointer", [ "pointer", "pointer" ], this.handle, Memory.allocUtf8String(t)));
  }
  FindClassDef_(e) {
    return (0, d.callSym)("_ZNK3art7DexFile12FindClassDefENS_3dex9TypeIndexE", "libdexfile.so", "pointer", [ "pointer", "pointer" ], this.handle, e.index);
  }
  FindCodeItemOffset(e, t) {
    return (0, d.callSym)("_ZNK3art7DexFile18FindCodeItemOffsetERKNS_3dex8ClassDefEj", "libdexfile.so", "uint32", [ "pointer", "pointer", "uint" ], this.handle, e.handle, t);
  }
}

exports.DexFile = o;

class _ extends r.JSHandle {
  constructor(e) {
    super(e);
  }
}

exports.DexFile_CodeItem = _, Reflect.set(globalThis, "DexFile", o);

},{"../../../../../tools/StdString":110,"../../../../JSHandle":13,"../../../../Utils/SymHelper":21,"../Globals":38,"../Oat/OatDexFile":52,"./DexFileStructs":75,"./DexIndex":76,"./Header":77}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.LEB128String = exports.DexFieldAnnotationsItem = exports.DexAnnotationSetItem = exports.DexAnnotationItem = exports.DexAnnotationsDirectoryItem = exports.DexMethodHandleItem = exports.DexCallSiteIdItem = exports.DexMethodId = exports.DexProtoId = exports.DexFieldId = exports.DexTypeId = exports.DexStringId = exports.DexClassDef = exports.DexTryItem = exports.DexTypeList = exports.DexTypeItem = void 0;

const e = require("./DexIndex"), t = require("../../../../JSHandle"), s = require("../Globals");

class i extends t.JSHandleNotImpl {
  type_idx_=this.handle;
  constructor(e) {
    super(e);
  }
  toString() {
    let e = `TypeItem<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t type_idx: ${this.type_idx}`), e;
  }
  get type_idx() {
    return new e.DexTypeIndex(this.type_idx_);
  }
  static SizeOfClass=s.PointerSize;
}

exports.DexTypeItem = i;

class n extends t.JSHandleNotImpl {
  size_=this.handle;
  list_=this.size_.add(4);
  constructor(e) {
    super(e);
  }
  toString() {
    let e = `TypeList<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t size: ${this.size}`, e += `\n\t list: ${this.list}`), 
    e;
  }
  get size() {
    return this.size_.readU32();
  }
  get list() {
    let e = [];
    for (let t = 0; t < this.size; t++) e.push(new i(this.list_.add(t * i.SizeOfClass)));
    return e;
  }
}

exports.DexTypeList = n;

class d extends t.JSHandleNotImpl {
  type_idx_=this.handle;
  constructor(e) {
    super(e);
  }
  get type_idx() {
    return new e.DexTypeIndex(this.type_idx_);
  }
  toString() {
    let e = `TryItem<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t type_idx: ${this.type_idx}`), e;
  }
}

exports.DexTryItem = d;

class r extends t.JSHandleNotImpl {
  class_idx_=this.handle;
  pad1_=this.class_idx_.add(e.DexTypeIndex.SizeOfClass);
  access_flags_=this.pad1_.add(2);
  superclass_idx_=this.access_flags_.add(4);
  pad2_=this.superclass_idx_.add(e.DexTypeIndex.SizeOfClass);
  interfaces_off_=this.pad2_.add(2);
  source_file_idx_=this.interfaces_off_.add(4);
  annotations_off_=this.source_file_idx_.add(e.DexStringIndex.SizeOfClass);
  class_data_off_=this.annotations_off_.add(4);
  static_values_off_=this.class_data_off_.add(4);
  constructor(e) {
    super(e);
  }
  toString() {
    let e = `ClassDef<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t class_idx: ${this.class_idx}`, e += `\n\t access_flags: ${this.access_flags}`, 
    e += `\n\t superclass_idx: ${this.superclass_idx}`, e += `\n\t interfaces_off: ${this.interfaces_off}`, 
    e += `\n\t source_file_idx: ${this.source_file_idx}`, e += `\n\t annotations_off: ${this.annotations_off}`, 
    e += `\n\t class_data_off: ${this.class_data_off}`, e += `\n\t static_values_off: ${this.static_values_off}`), 
    e;
  }
  static get SizeOfClass() {
    return e.DexTypeIndex.SizeOfClass + 2 + 4 + e.DexTypeIndex.SizeOfClass + 2 + 4 + e.DexStringIndex.SizeOfClass + 4 + 4 + 4;
  }
  get class_idx() {
    return new e.DexTypeIndex(this.class_idx_.readU16());
  }
  get access_flags() {
    return this.access_flags_.readU32();
  }
  get superclass_idx() {
    return new e.DexTypeIndex(this.superclass_idx_.readU16());
  }
  get interfaces_off() {
    return this.interfaces_off_.readU32();
  }
  get source_file_idx() {
    return new e.DexStringIndex(this.source_file_idx_.readU32());
  }
  get annotations_off() {
    return this.annotations_off_.readU32();
  }
  get class_data_off() {
    return this.class_data_off_.readU32();
  }
  get static_values_off() {
    return this.static_values_off_.readU32();
  }
}

exports.DexClassDef = r;

class a extends t.JSHandleNotImpl {
  string_data_off_=this.handle;
  constructor(e) {
    super(e);
  }
  get string_data_off() {
    return this.string_data_off_.readU32();
  }
  toString() {
    let e = `StringId<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t string_data_off: ${this.string_data_off} -> ${ptr(this.string_data_off)}`), 
    e;
  }
}

exports.DexStringId = a;

class _ extends t.JSHandleNotImpl {
  descriptor_idx_=this.handle;
  constructor(e) {
    super(e);
  }
  get descriptor_idx() {
    return new e.DexStringIndex(this.descriptor_idx_.readU32());
  }
  toString() {
    let e = `TypeId<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t descriptor_idx: ${this.descriptor_idx}`), 
    e;
  }
  static get SizeOfClass() {
    return 4;
  }
}

exports.DexTypeId = _;

class o extends t.JSHandleNotImpl {
  class_idx_=this.handle;
  type_idx_=this.class_idx_.add(e.DexTypeIndex.SizeOfClass);
  name_idx_=this.type_idx_.add(e.DexTypeIndex.SizeOfClass);
  constructor(e) {
    super(e);
  }
  get class_idx() {
    return new e.DexTypeIndex(this.class_idx_.readU16());
  }
  get type_idx() {
    return new e.DexTypeIndex(this.type_idx_.readU16());
  }
  get name_idx() {
    return new e.DexStringIndex(this.name_idx_.readU16());
  }
  static get SizeOfClass() {
    return 8;
  }
  toString() {
    let e = `FieldId<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t class_idx: ${this.class_idx}`, e += `\n\t type_idx: ${this.type_idx}`, 
    e += `\n\t name_idx: ${this.name_idx}`), e;
  }
}

exports.DexFieldId = o;

class l extends t.JSHandleNotImpl {
  shorty_idx_=this.handle;
  return_type_idx_=this.shorty_idx_.add(e.DexStringIndex.SizeOfClass);
  pad_=this.return_type_idx_.add(2);
  parameters_off_=this.pad_.add(2);
  constructor(e) {
    super(e);
  }
  get shorty_idx() {
    return new e.DexStringIndex(this.shorty_idx_.readU16());
  }
  get return_type_idx() {
    return new e.DexTypeIndex(this.return_type_idx_.readU16());
  }
  get parameters_off() {
    return this.parameters_off_.readU32();
  }
  static get SizeOfClass() {
    return 12;
  }
  toString() {
    let e = `ProtoId<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t shorty_idx: ${this.shorty_idx}`, e += `\n\t return_type_idx: ${this.return_type_idx}`, 
    e += `\n\t parameters_off: ${this.parameters_off}`), e;
  }
}

exports.DexProtoId = l;

class h extends t.JSHandleNotImpl {
  class_idx_=this.handle;
  proto_idx_=this.class_idx_.add(e.DexTypeIndex.SizeOfClass);
  name_idx_=this.proto_idx_.add(e.DexProtoIndex.SizeOfClass);
  constructor(e) {
    super(e);
  }
  get class_idx() {
    return new e.DexTypeIndex(this.class_idx_.readU16());
  }
  get proto_idx() {
    return new e.DexProtoIndex(this.proto_idx_.readU16());
  }
  get name_idx() {
    return new e.DexStringIndex(this.name_idx_.readU32());
  }
  static get SizeOfClass() {
    return 8;
  }
  toString() {
    let e = `MethodId<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t class_idx: ${this.class_idx}`, e += `\n\t proto_idx: ${this.proto_idx}`, 
    e += `\n\t name_idx: ${this.name_idx}`), e;
  }
}

exports.DexMethodId = h;

class x extends t.JSHandleNotImpl {
  data_off_=this.handle;
  constructor(e) {
    super(e);
  }
  get data_off() {
    return this.data_off_.readU32();
  }
  static get SizeOfClass() {
    return 4;
  }
  tostring() {
    let e = `CallSiteIdItem<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t data_off: ${this.data_off}`), e;
  }
}

exports.DexCallSiteIdItem = x;

class f extends t.JSHandleNotImpl {
  method_handle_type_=this.handle;
  reserved1_=this.method_handle_type_.add(2);
  field_or_method_idx_=this.reserved1_.add(2);
  reserved2_=this.field_or_method_idx_.add(2);
  constructor(e) {
    super(e);
  }
  get method_handle_type() {
    return this.method_handle_type_.readU16();
  }
  get field_or_method_idx() {
    return this.field_or_method_idx_.readU16();
  }
  static get SizeOfClass() {
    return 8;
  }
  tostring() {
    let e = `MethodHandleItem<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t method_handle_type: ${this.method_handle_type}`, 
    e += `\n\t field_or_method_idx: ${this.field_or_method_idx}`), e;
  }
}

exports.DexMethodHandleItem = f;

class u extends t.JSHandleNotImpl {
  class_annotations_off_=this.handle;
  fields_size_=this.class_annotations_off_.add(4);
  methods_size_=this.fields_size_.add(4);
  parameters_size_=this.methods_size_.add(4);
  constructor(e) {
    super(e);
  }
  get class_annotations_off() {
    return this.class_annotations_off_.readU32();
  }
  get fields_size() {
    return this.fields_size_.readU32();
  }
  get methods_size() {
    return this.methods_size_.readU32();
  }
  get parameters_size() {
    return this.parameters_size_.readU32();
  }
  static get SizeOfClass() {
    return 16;
  }
  toString() {
    let e = `AnnotationsDirectoryItem<${this.handle}>`;
    if (this.handle.isNull()) return e;
    e += `\n\t class_annotations_off: ${this.class_annotations_off}`, e += `\n\t fields_size: ${this.fields_size}`, 
    e += `\n\t methods_size: ${this.methods_size}`, e += `\n\t parameters_size: ${this.parameters_size}`;
  }
}

exports.DexAnnotationsDirectoryItem = u;

class c extends t.JSHandleNotImpl {
  visibility_=this.handle;
  annotation_=this.visibility_.add(1);
  constructor(e) {
    super(e);
  }
  get visibility() {
    return this.visibility_.readU8();
  }
  get annotation() {
    return this.annotation_.readU8();
  }
  static get SizeOfClass() {
    return 2;
  }
  toString() {
    let e = `AnnotationItem<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t visibility: ${this.visibility}`, e += `\n\t annotation: ${this.annotation}`), 
    e;
  }
}

exports.DexAnnotationItem = c;

class p extends t.JSHandleNotImpl {
  size_=this.handle;
  entries_=this.size_.add(c.SizeOfClass);
  constructor(e) {
    super(e);
  }
  get size() {
    return this.size_.readU32();
  }
  get entries() {
    let e = [];
    for (let t = 0; t < this.size; t++) e.push(this.entries_.add(4 * t).readU32());
    return e;
  }
  static get SizeOfClass() {
    return 8;
  }
  toString() {
    let e = `AnnotationSetItem<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t size: ${this.size}`, e += `\n\t entries: ${this.entries}`), 
    e;
  }
}

exports.DexAnnotationSetItem = p;

class g extends t.JSHandleNotImpl {
  field_idx_=this.handle;
  annotations_off_=this.field_idx_.add(4);
  constructor(e) {
    super(e);
  }
  get field_idx() {
    return this.field_idx_.readU32();
  }
  get annotations_off() {
    return this.annotations_off_.readU32();
  }
  static get SizeOfClass() {
    return 8;
  }
  toString() {
    let e = `FieldAnnotationsItem<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t field_idx: ${this.field_idx}`, e += `\n\t annotations_off: ${this.annotations_off}`), 
    e;
  }
}

exports.DexFieldAnnotationsItem = g;

class m {
  handle=NULL;
  size_=NULL;
  data_=NULL;
  constructor(e) {
    this.handle = e, this.size_ = this.handle, this.data_ = this.size_.add(1);
  }
  static from(e) {
    return new m(e);
  }
  get data_ptr() {
    return this.data_;
  }
  get size() {
    return this.size_.readU8();
  }
  get str() {
    try {
      return this.data_.readCString();
    } catch (e) {
      return "";
    }
  }
  toString() {
    let e = this.DecodeUnsignedLeb128_TS(this.handle);
    return `${e.bytesRead} | ${e.size} | ${this.str}`;
  }
  test(e = 1e4) {
    const t = Date.now();
    for (let t = 0; t < e; t++) this.DecodeUnsignedLeb128_TS(this.handle);
    const s = Date.now();
    LOGD(`DecodeUnsignedLeb128_TS (times:${e}) cost : ${s - t} ms`);
    const i = Date.now();
    for (let t = 0; t < e; t++) this.DecodeUnsignedLeb128_MD(this.handle);
    const n = Date.now();
    LOGD(`DecodeUnsignedLeb128_MD (times:${e}) cost : ${n - i} ms`);
  }
  DecodeUnsignedLeb128_TS(e) {
    let t = e, s = t.readU8();
    if (t = t.add(1), s > 127) {
      let e = t.readU8();
      t = t.add(1), s = 127 & s | (127 & e) << 7, e > 127 && (e = t.readU8(), t = t.add(1), 
      s |= (127 & e) << 14, e > 127 && (e = t.readU8(), t = t.add(1), s |= (127 & e) << 21, 
      e > 127 && (e = t.readU8(), t = t.add(1), s |= e << 28)));
    }
    return {
      size: s,
      bytesRead: t
    };
  }
  DecodeUnsignedLeb128_MD(e) {
    const t = new NativeFunction(this.cmd.DecodeUnsignedLeb128, "uint32", [ "pointer" ]), s = Memory.alloc(Process.pointerSize).writePointer(e);
    return {
      size: t(s),
      bytesRead: s.readPointer()
    };
  }
  static md=null;
  get cmd() {
    return null == m.md && (m.md = new CModule("\n            #include <gum/gumprocess.h>\n            \n            uint32_t DecodeUnsignedLeb128(const uint8_t** data) {\n                const uint8_t* ptr = *data;\n                int result = *(ptr++);\n                if (result > 0x7f) {\n                    int cur = *(ptr++);\n                    result = (result & 0x7f) | ((cur & 0x7f) << 7);\n                    if (cur > 0x7f) {\n                    cur = *(ptr++);\n                    result |= (cur & 0x7f) << 14;\n                    if (cur > 0x7f) {\n                        cur = *(ptr++);\n                        result |= (cur & 0x7f) << 21;\n                        if (cur > 0x7f) {\n                        cur = *(ptr++);\n                        result |= cur << 28;\n                        }\n                    }\n                    }\n                }\n                *data = ptr;\n                return (uint32_t)(result);\n            }\n        ")), 
    m.md;
  }
}

exports.LEB128String = m, globalThis.DexClassDef = r, globalThis.DexStringId = a, 
globalThis.DexTypeId = _, globalThis.DexFieldId = o, globalThis.DexProtoId = l, 
globalThis.DexMethodId = h;

},{"../../../../JSHandle":13,"../Globals":38,"./DexIndex":76}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.DexStringIndex = exports.DexProtoIndex = exports.DexTypeIndex = exports.DexIndex = void 0;

const e = require("../../../../ValueHandle");

class t extends e.ValueHandle {
  constructor(e) {
    e instanceof NativePointer ? super(e) : super(ptr(e));
  }
  toString() {
    return `DexIndex<${this.value_}>`;
  }
}

exports.DexIndex = t;

class n extends t {
  get index() {
    return this.ReadAs16().toInt32();
  }
  static get SizeOfClass() {
    return 2;
  }
  toString() {
    return `TypeIndex<${this.index}>`;
  }
}

exports.DexTypeIndex = n;

class r extends t {
  get index() {
    return this.ReadAs16().toInt32();
  }
  static get SizeOfClass() {
    return 2;
  }
  toString() {
    return `ProtoIndex<${this.index}>`;
  }
}

exports.DexProtoIndex = r;

class s extends t {
  get index() {
    return this.ReadAs32().toInt32();
  }
  static get SizeOfClass() {
    return 4;
  }
  toString() {
    return `StringIndex<${this.index}>`;
  }
}

exports.DexStringIndex = s;

},{"../../../../ValueHandle":26}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.StandardDexHeader = exports.CompactDexHeader = exports.DexHeader = void 0;

const e = require("../../../../JSHandle");

class t extends e.JSHandle {
  magic_=this.CurrentHandle;
  checksum_=this.magic_.add(8);
  signature_=this.checksum_.add(4);
  file_size_=this.signature_.add(1 * t.kSha1DigestSize);
  header_size_=this.file_size_.add(4);
  endian_tag_=this.header_size_.add(4);
  link_size_=this.endian_tag_.add(4);
  link_off_=this.link_size_.add(4);
  map_off_=this.link_off_.add(4);
  string_ids_size_=this.map_off_.add(4);
  string_ids_off_=this.string_ids_size_.add(4);
  type_ids_size_=this.string_ids_off_.add(4);
  type_ids_off_=this.type_ids_size_.add(4);
  proto_ids_size_=this.type_ids_off_.add(4);
  proto_ids_off_=this.proto_ids_size_.add(4);
  field_ids_size_=this.proto_ids_off_.add(4);
  field_ids_off_=this.field_ids_size_.add(4);
  method_ids_size_=this.field_ids_off_.add(4);
  method_ids_off_=this.method_ids_size_.add(4);
  class_defs_size_=this.method_ids_off_.add(4);
  class_defs_off_=this.class_defs_size_.add(4);
  data_size_=this.class_defs_off_.add(4);
  data_off_=this.data_size_.add(4);
  constructor(e) {
    super(e);
  }
  static get kDexMagicSize() {
    return 4;
  }
  static get kDexVersionLen() {
    return 4;
  }
  static get kSha1DigestSize() {
    return 20;
  }
  static get kClassDefinitionOrderEnforcedVersion() {
    return 37;
  }
  get SizeOfClass() {
    return 112;
  }
  toString() {
    const e = this.magic_.readByteArray(t.kDexMagicSize), s = Array.from(new Uint8Array(e)).map((e => e.toString(16).padStart(2, "0"))).join(" "), _ = this.magic_.add(t.kDexMagicSize).readByteArray(t.kDexVersionLen), i = Array.from(new Uint8Array(_)).map((e => e.toString(16).padStart(2, "0"))).join(" ");
    let d = `DexHeader<${this.handle}>`;
    return this.handle.isNull() || (d += `\n\t magic: ${this.magic.replace("\n", "")} | ${s} | ${i}`, 
    d += `\n\t checksum: ${this.checksum}`, d += `\n\t signature: ${this.signature}`, 
    d += `\n\t file_size: ${this.file_size} | ${ptr(this.file_size)}`, d += `\n\t header_size: ${this.header_size} | ${ptr(this.header_size)}`, 
    d += `\n\t endian_tag: ${this.endian_tag}`, d += `\n\t link_size: ${this.link_size}`, 
    d += `\n\t link_off: ${this.link_off}`, d += `\n\t map_off: ${this.map_off}`, d += `\n\t string_ids_size: ${this.string_ids_size}`, 
    d += `\n\t string_ids_off: ${this.string_ids_off}`, d += `\n\t type_ids_size: ${this.type_ids_size}`, 
    d += `\n\t type_ids_off: ${this.type_ids_off}`, d += `\n\t proto_ids_size: ${this.proto_ids_size}`, 
    d += `\n\t proto_ids_off: ${this.proto_ids_off}`, d += `\n\t field_ids_size: ${this.field_ids_size}`, 
    d += `\n\t field_ids_off: ${this.field_ids_off}`, d += `\n\t method_ids_size: ${this.method_ids_size}`, 
    d += `\n\t method_ids_off: ${this.method_ids_off}`, d += `\n\t class_defs_size: ${this.class_defs_size}`, 
    d += `\n\t class_defs_off: ${this.class_defs_off}`, d += `\n\t data_size: ${this.data_size}`, 
    d += `\n\t data_off: ${this.data_off}`), d;
  }
  GetVersion() {
    return this.magic_.add(t.kDexMagicSize).readU32();
  }
  get magic() {
    return this.magic_.readCString();
  }
  get checksum() {
    return ptr(this.checksum_.readU32());
  }
  get signature() {
    return this.signature_.readU32();
  }
  get file_size() {
    return this.file_size_.readU32();
  }
  get header_size() {
    return this.header_size_.readU32();
  }
  get endian_tag() {
    return this.endian_tag_.readU32();
  }
  get link_size() {
    return this.link_size_.readU32();
  }
  get link_off() {
    return ptr(this.link_off_.readU32());
  }
  get map_off() {
    return ptr(this.map_off_.readU32());
  }
  get string_ids_size() {
    return this.string_ids_size_.readU32();
  }
  get string_ids_off() {
    return ptr(this.string_ids_off_.readU32());
  }
  get type_ids_size() {
    return this.type_ids_size_.readU32();
  }
  get type_ids_off() {
    return ptr(this.type_ids_off_.readU32());
  }
  get proto_ids_size() {
    return this.proto_ids_size_.readU32();
  }
  get proto_ids_off() {
    return ptr(this.proto_ids_off_.readU32());
  }
  get field_ids_size() {
    return this.field_ids_size_.readU32();
  }
  get field_ids_off() {
    return ptr(this.field_ids_off_.readU32());
  }
  get method_ids_size() {
    return this.method_ids_size_.readU32();
  }
  get method_ids_off() {
    return ptr(this.method_ids_off_.readU32());
  }
  get class_defs_size() {
    return this.class_defs_size_.readU32();
  }
  get class_defs_off() {
    return ptr(this.class_defs_off_.readU32());
  }
  get data_size() {
    return this.data_size_.readU32();
  }
  get data_off() {
    return ptr(this.data_off_.readU32());
  }
}

exports.DexHeader = t;

class s extends t {
  feature_flags_=this.CurrentHandle.add(0);
  debug_info_offsets_pos_=this.feature_flags_.add(4);
  debug_info_offsets_table_offset_=this.debug_info_offsets_pos_.add(4);
  debug_info_base_=this.debug_info_offsets_table_offset_.add(4);
  owned_data_begin_=this.debug_info_base_.add(4);
  owned_data_end_=this.owned_data_begin_.add(4);
  constructor(e) {
    super(e);
  }
  get CurrentHandle() {
    return super.CurrentHandle.add(super.SizeOfClass);
  }
  get SizeOfClass() {
    return this.owned_data_end_.add(4).sub(this.CurrentHandle).toUInt32();
  }
  toString() {
    let e = super.toString();
    return e = e.replace("DexHeader<", "CompactDexHeader<"), this.handle.isNull() || (e += `\n\t feature_flags: ${this.feature_flags}`, 
    e += `\n\t debug_info_offsets_pos: ${this.debug_info_offsets_pos}`, e += `\n\t debug_info_offsets_table_offset: ${this.debug_info_offsets_table_offset}`, 
    e += `\n\t debug_info_base: ${this.debug_info_base}`, e += `\n\t owned_data_begin: ${this.owned_data_begin}`, 
    e += `\n\t owned_data_end: ${this.owned_data_end}`), e;
  }
  get feature_flags() {
    return this.feature_flags_.readU32();
  }
  get debug_info_offsets_pos() {
    return this.debug_info_offsets_pos_.readU32();
  }
  get debug_info_offsets_table_offset() {
    return this.debug_info_offsets_table_offset_.readU32();
  }
  get debug_info_base() {
    return this.debug_info_base_.readU32();
  }
  get owned_data_begin() {
    return this.owned_data_begin_.readU32();
  }
  get owned_data_end() {
    return this.owned_data_end_.readU32();
  }
}

exports.CompactDexHeader = s;

class _ extends t {
  constructor(e) {
    super(e);
  }
  toString() {
    let e = super.toString();
    return e = e.replace("DexHeader<", "StandardDexHeader<"), this.handle.isNull(), 
    e;
  }
}

exports.StandardDexHeader = _;

},{"../../../../JSHandle":13}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.StandardDexFile_CodeItem = exports.StandardDexFile = void 0;

const e = require("./DexFile");

class s extends e.DexFile {}

exports.StandardDexFile = s;

class i extends e.DexFile_CodeItem {
  registers_size_=this.CurrentHandle;
  ins_size_=this.CurrentHandle.add(2);
  outs_size_=this.CurrentHandle.add(4);
  tries_size_=this.CurrentHandle.add(6);
  debug_info_off_=this.CurrentHandle.add(8);
  insns_size_in_code_units_=this.CurrentHandle.add(12);
  insns_=this.CurrentHandle.add(16);
  constructor(e) {
    super(e);
  }
  toString() {
    let e = `StandardDexFile::CodeItem<${this.handle}>`;
    return e += `\n\tregisters_size: ${this.registers_size} | ins_size: ${this.ins_size} | outs_size: ${this.outs_size} | tries_size: ${this.tries_size} | debug_info_off: ${this.debug_info_off} | insns_size_in_code_units: ${this.insns_size_in_code_units} | insns: ${this.insns}`, 
    e;
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass);
  }
  get registers_size() {
    return this.registers_size_.readU16();
  }
  get insns() {
    return this.insns_;
  }
  get ins_size() {
    return this.ins_size_.readU16();
  }
  get outs_size() {
    return this.outs_size_.readU16();
  }
  get tries_size() {
    return this.tries_size_.readU16();
  }
  get debug_info_off() {
    return this.debug_info_off_.readU32();
  }
  get insns_size_in_code_units() {
    return this.insns_size_in_code_units_.readU32();
  }
  set registers_size(e) {
    this.registers_size_.writeU16(e);
  }
  set ins_size(e) {
    this.ins_size_.writeU16(e);
  }
  set outs_size(e) {
    this.outs_size_.writeU16(e);
  }
  set tries_size(e) {
    this.tries_size_.writeU16(e);
  }
  set debug_info_off(e) {
    this.debug_info_off_.writeU32(e);
  }
  set insns_size_in_code_units(e) {
    this.insns_size_in_code_units_.writeU32(e);
  }
  get header_start() {
    return this.CurrentHandle;
  }
  get header_size() {
    return this.insns_.sub(this.CurrentHandle).toUInt32();
  }
  get insns_start() {
    return this.insns_;
  }
  get insns_size() {
    return 2 * this.insns_size_in_code_units;
  }
}

exports.StandardDexFile_CodeItem = i;

},{"./DexFile":74}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./CodeItemInstructionAccessor"), require("./CodeItemDebugInfoAccessor"), 
require("./CodeItemDataAccessor"), require("./StandardDexFile"), require("./CompactDexFile"), 
require("./DexFileStructs"), require("./DexIndex"), require("./DexFile"), require("./Header");

},{"./CodeItemDataAccessor":70,"./CodeItemDebugInfoAccessor":71,"./CodeItemInstructionAccessor":72,"./CompactDexFile":73,"./DexFile":74,"./DexFileStructs":75,"./DexIndex":76,"./Header":77,"./StandardDexFile":78}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./ClassLinker"), require("./Globals"), require("./GcRoot"), require("./Instruction"), 
require("./OatQuickMethodHeader"), require("./QuickMethodFrameInfo"), require("./ObjPtr"), 
require("./Thread"), require("./Thread_Inl"), require("./ShadowFrame"), require("./bridge"), 
require("./dexfile/include"), require("./interpreter/include"), require("./mirror/include"), 
require("./Oat/include"), require("./runtime/include"), require("./StackVisitor/include"), 
require("./Instrumentation/include"), require("./Type/include");

},{"./ClassLinker":36,"./GcRoot":37,"./Globals":38,"./Instruction":39,"./Instrumentation/include":49,"./Oat/include":54,"./OatQuickMethodHeader":50,"./ObjPtr":55,"./QuickMethodFrameInfo":56,"./ShadowFrame":57,"./StackVisitor/include":61,"./Thread":62,"./Thread_Inl":63,"./Type/include":67,"./bridge":69,"./dexfile/include":79,"./interpreter/include":83,"./mirror/include":91,"./runtime/include":94}],81:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.InstructionHandler = void 0;

const e = require("../../../../../tools/intercepter"), t = require("../../../../JSHandle"), n = require("../../../../Utils/SymHelper");

class r extends t.JSHandleNotImpl {
  static Hook_InstructionHandler() {
    const t = (0, n.getSym)("_ZN3art11interpreter18InstructionHandlerILb0ELb1EE45HandlePendingExceptionWithInstrumentationImplEPKNS_15instrumentation15InstrumentationE");
    (0, e.R)(t, new NativeCallback((() => {
      LOGD("Called InstructionHandler()");
    }), "void", []));
  }
}

exports.InstructionHandler = r, setImmediate((() => {}));

}).call(this)}).call(this,require("timers").setImmediate)

},{"../../../../../tools/intercepter":117,"../../../../JSHandle":13,"../../../../Utils/SymHelper":21,"timers":155}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.SwitchImplContext = void 0;

const e = require("../../../../JSHandle"), t = require("../ShadowFrame"), r = require("../Globals"), s = require("../Type/JValue"), i = require("../Thread"), n = require("../dexfile/CodeItemDataAccessor");

class o extends e.JSHandleNotImpl {
  _self=this.handle;
  _accessor=this._self.add(r.PointerSize);
  _shadow_frame=this._accessor.add(r.PointerSize);
  _result_register=this._shadow_frame.add(r.PointerSize);
  _interpret_one_instruction=this._result_register.add(r.PointerSize);
  _result=this._interpret_one_instruction.add(r.PointerSize);
  constructor(e) {
    super(e);
  }
  get self() {
    return new i.ArtThread(this._self.readPointer());
  }
  get accessor() {
    return n.CodeItemDataAccessor.fromRef(this._accessor.readPointer());
  }
  get shadow_frame() {
    return new t.ShadowFrame(this._shadow_frame.readPointer());
  }
  get result_register() {
    return new s.JValue(this._result_register.readPointer());
  }
  get interpret_one_instruction() {
    return !!this._interpret_one_instruction.readU8();
  }
  get result() {
    return new s.JValue(this._result.readPointer());
  }
  toString() {
    let e = `SwitchImplContext<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t self=${this._self.readPointer()} <- ${this._self}`, 
    e += `\n\t accessor_=${this._accessor.readPointer()} <- ${this._accessor}`, e += `\n\t shadow_frame_=${this._shadow_frame.readPointer()} <- ${this._shadow_frame}`, 
    e += `\n\t result_register=${this.result_register} <- ${this._result_register}`, 
    e += `\n\t interpret_one_instruction=${this.interpret_one_instruction} <- ${this._interpret_one_instruction}`, 
    e += `\n\t result_=${this._result.readPointer()} <- ${this._result}`), e;
  }
}

exports.SwitchImplContext = o;

},{"../../../../JSHandle":13,"../Globals":38,"../ShadowFrame":57,"../Thread":62,"../Type/JValue":64,"../dexfile/CodeItemDataAccessor":70}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./interpreter"), require("./SwitchImplContext"), require("./InstructionHandler");

},{"./InstructionHandler":81,"./SwitchImplContext":82,"./interpreter":84}],84:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.interpreter = void 0;

const e = require("../../../../../tools/common"), t = require("../../../../JSHandle"), r = require("../../../../Utils/SymHelper"), a = require("../../../../../tools/intercepter"), n = require("../ShadowFrame");

class o extends t.JSHandleNotImpl {
  static _CanUseMterp=!1;
  static get CanUseMterp() {
    return o._CanUseMterp;
  }
  static set CanUseMterp(e) {
    o._CanUseMterp = e;
  }
  static Hook_CanUseMterp() {
    const e = (0, r.getSym)("_ZN3art11interpreter11CanUseMterpEv");
    Interceptor.attach(e, {
      onLeave(e) {
        e.replace(o._CanUseMterp ? ptr(1) : NULL);
      }
    });
  }
  static Hook_AbortTransaction() {
    const e = (0, r.getSym)("_ZN3art11interpreter17AbortTransactionFEPNS_6ThreadEPKcz");
    try {
      (0, a.R)(e, new NativeCallback((() => {
        LOGD("Called AbortTransaction()");
      }), "void", []));
    } catch (e) {}
  }
  static Hook_AbortTransactionV() {
    const e = (0, r.getSym)("_ZN3art11interpreter17AbortTransactionVEPNS_6ThreadEPKcSt9__va_list");
    try {
      (0, a.R)(e, new NativeCallback((() => {
        LOGD("Called AbortTransactionV()");
      }), "void", []));
    } catch (e) {}
  }
  static Hook_MoveToExceptionHandler() {
    const e = (0, r.getSym)("_ZN3art11interpreter22MoveToExceptionHandlerEPNS_6ThreadERNS_11ShadowFrameEPKNS_15instrumentation15InstrumentationE"), t = new NativeFunction(e, "pointer", [ "pointer", "pointer", "pointer" ]);
    try {
      (0, a.R)(e, new NativeCallback(((e, r, a) => {
        let o = t(e, r, a);
        new n.ShadowFrame(r);
        return o;
      }), "pointer", [ "pointer", "pointer", "pointer" ]));
    } catch (e) {}
  }
  static onValueChanged(e, t) {
    "CanUseMterp" == e && (LOGZ(`ArtInterpreter Got New Value -> ${e} -> ${t}`), "CanUseMterp" == e && (o.CanUseMterp = t));
  }
  static moveToExceptionHandleCalledListeners=[];
  static addMoveToExceptionHandleCalledListener(e) {
    o.moveToExceptionHandleCalledListeners.push(e);
  }
}

exports.interpreter = o, setImmediate((() => {
  e.KeyValueStore.getInstance().subscribe(o);
})), setImmediate((() => {
  try {
    o.Hook_CanUseMterp(), o.Hook_MoveToExceptionHandler();
  } catch (e) {}
})), Reflect.set(globalThis, "ArtInterpreter", o);

}).call(this)}).call(this,require("timers").setImmediate)

},{"../../../../../tools/common":111,"../../../../../tools/intercepter":117,"../../../../JSHandle":13,"../../../../Utils/SymHelper":21,"../ShadowFrame":57,"timers":155}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ArtClass = void 0;

const e = require("../../../../Interface/art/mirror/HeapReference"), s = require("../../../../../tools/StdString"), t = require("../../../../Object"), a = require("./ClassLoader"), i = require("./ClassExt"), r = require("./DexCache"), _ = require("./IfTable");

class d extends t.ArtObject {
  isVirtualClass=!1;
  class_loader_=this.CurrentHandle;
  component_type_=this.class_loader_.add(e.HeapReference.Size);
  dex_cache_=this.component_type_.add(e.HeapReference.Size);
  ext_data_=this.dex_cache_.add(e.HeapReference.Size);
  iftable_=this.ext_data_.add(e.HeapReference.Size);
  name_=this.iftable_.add(e.HeapReference.Size);
  super_class_=this.name_.add(e.HeapReference.Size);
  vtable_=this.super_class_.add(e.HeapReference.Size);
  ifields_=this.vtable_.add(e.HeapReference.Size);
  methods_=this.ifields_.add(8);
  sfields_=this.methods_.add(8);
  access_flags_=this.sfields_.add(8);
  class_flags_=this.access_flags_.add(4);
  class_size_=this.class_flags_.add(4);
  clinit_thread_id_=this.class_size_.add(4);
  dex_class_def_idx_=this.clinit_thread_id_.add(8);
  constructor(e) {
    super(e);
  }
  get SizeOfClass() {
    return this.dex_class_def_idx_.add(4).sub(this.CurrentHandle).add(this.super_class.SizeOfClass).toInt32();
  }
  get CurrentHandle() {
    return this.handle.add(super.SizeOfClass).add(this.VirtualClassOffset);
  }
  toString() {
    let e = `ArtClass< ${this.handle} >`;
    return this.handle.isNull() || (e += `\n\t class_loader: ${this.class_loader} -> ArtClassLoader< ${this.class_loader.root.handle} >`, 
    e += `\n\t component_type: ${this.component_type} -> ArtClass< ${this.component_type.root.handle} >`, 
    e += `\n\t dex_cache: ${this.dex_cache} -> DexCache<P:${this.dex_cache.root.handle} >`, 
    e += `\n\t ext_data: ${this.ext_data}`, e += `\n\t iftable: ${this.iftable}`, e += `\n\t name: ${this.name} -> ${this.name_str}`, 
    e += `\n\t super_class: ${this.super_class} -> ArtClass< ${this.super_class.root.handle} >`, 
    e += `\n\t vtable: ${this.vtable}`, e += `\n\t ifields: ${this.ifields} | ${ptr(this.ifields)}`, 
    e += `\n\t methods: ${this.methods} | ${ptr(this.methods)}`, e += `\n\t sfields: ${this.sfields} | ${ptr(this.sfields)}`, 
    e += `\n\t access_flags: ${this.access_flags} -> ${this.access_flags_string}`, e += `\n\t class_flags: ${this.class_flags}`, 
    e += `\n\t class_size: ${this.class_size}`, e += `\n\t clinit_thread_id: ${this.clinit_thread_id}`, 
    e += `\n\t dex_class_def_idx: ${this.dex_class_def_idx}`), e;
  }
  get class_loader() {
    return new e.HeapReference((e => new a.ArtClassLoader(e)), this.class_loader_);
  }
  get component_type() {
    return new e.HeapReference((e => new d(e)), this.component_type_);
  }
  get dex_cache() {
    return new e.HeapReference((e => new r.DexCache(e)), this.dex_cache_);
  }
  get ext_data() {
    return new e.HeapReference((e => new i.ClassExt(e)), this.ext_data_);
  }
  get iftable() {
    return new e.HeapReference((e => new _.IfTable(e)), this.iftable_);
  }
  get name() {
    return new e.HeapReference((e => new s.StdString(e)), this.name_);
  }
  name_str() {
    return s.StdString.from(this.name.root.handle);
  }
  get super_class() {
    return new e.HeapReference((e => new d(e)), this.super_class_);
  }
  get vtable() {
    return new e.HeapReference((e => new NativePointer(e)), this.vtable_);
  }
  get ifields() {
    return this.ifields_.readU64().toNumber();
  }
  get methods() {
    return this.methods_.readU64().toNumber();
  }
  get sfields() {
    return this.sfields_.readU64().toNumber();
  }
  get access_flags() {
    return this.access_flags_.readU32();
  }
  get access_flags_string() {
    const e = PrettyAccessFlags(this.access_flags, "class"), s = PrettyRuntimeAccessFlags(this.access_flags, "class");
    return "" === s ? e : `${e}[${s}]`;
  }
  get class_flags() {
    return this.class_flags_.readU32();
  }
  get class_size() {
    return this.class_size_.readU32();
  }
  get clinit_thread_id() {
    return this.clinit_thread_id_.readS32();
  }
  get dex_class_def_idx() {
    return this.dex_class_def_idx_.readS32();
  }
}

exports.ArtClass = d, globalThis.ArtClass = d;

},{"../../../../../tools/StdString":110,"../../../../Interface/art/mirror/HeapReference":9,"../../../../Object":14,"./ClassExt":87,"./ClassLoader":88,"./DexCache":89,"./IfTable":90}],86:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ArtMethod = void 0;

const e = require("../dexfile/CodeItemInstructionAccessor"), t = require("../OatQuickMethodHeader"), n = require("../../../../Utils/SymHelper"), i = require("../../../../Utils/CfgAnalyzer"), r = require("../../../../Utils/FunctionBoundary"), o = require("../../../../../tools/modifiers"), s = require("../../../../../tools/common"), d = require("../../../../../tools/StdString"), a = require("../../../../../tools/enum"), h = require("../../../../JSHandle"), l = require("../Globals"), _ = require("./ArtClass"), c = require("../Thread"), u = require("./DexCache"), m = require("../GcRoot");

class g extends h.JSHandle {
  declaring_class_=this.CurrentHandle;
  access_flags_=this.declaring_class_.add(m.GcRoot.Size);
  dex_code_item_offset_=this.access_flags_.add(4);
  dex_method_index_=this.dex_code_item_offset_.add(4);
  method_index_=this.dex_method_index_.add(4);
  hotness_count_=this.CurrentHandle.add(m.GcRoot.Size + 12 + 2);
  imt_index_=this.CurrentHandle.add(m.GcRoot.Size + 12 + 2);
  ptr_sized_fields_;
  constructor(e) {
    "string" == typeof e && (e = pathToArtMethod(e).handle), super(e);
    try {
      this.ptr_sized_fields_ = {
        data_: this.handle.add(getArtMethodSpec().offset.jniCode),
        entry_point_from_quick_compiled_code_: this.handle.add(getArtMethodSpec().offset.quickCode)
      };
    } catch (e) {
      this.ptr_sized_fields_ = {
        data_: this.imt_index_.add(4),
        entry_point_from_quick_compiled_code_: this.imt_index_.add(4).add(l.PointerSize)
      };
    }
  }
  get SizeOfClass() {
    return getArtMethodSpec().size + super.SizeOfClass;
  }
  get currentHandle() {
    return this.handle.add(super.SizeOfClass);
  }
  get declaring_class() {
    return new m.GcRoot((e => new _.ArtClass(e)), this.declaring_class_);
  }
  get access_flags() {
    return ptr(this.access_flags_.readU32());
  }
  get access_flags_string() {
    const e = o.ArtModifiers.PrettyAccessFlags(this.access_flags, "method"), t = o.ArtModifiers.PrettyRuntimeAccessFlags(this.access_flags, "method");
    return "" === t ? e : `${e}[${t}]`;
  }
  get dex_code_item_offset() {
    return this.dex_code_item_offset_.readU32();
  }
  get dex_method_index() {
    return this.dex_method_index_.readU16();
  }
  get method_index() {
    return this.method_index_.readU16();
  }
  get hotness_count() {
    return this.hotness_count_.readU16();
  }
  get imt_index() {
    return this.imt_index_.readU16();
  }
  get data() {
    return this.ptr_sized_fields_.data_.readPointer();
  }
  get jniCode() {
    return this.data;
  }
  get entry_point_from_quick_compiled_code() {
    return this.ptr_sized_fields_.entry_point_from_quick_compiled_code_.readPointer();
  }
  PrettyMethod(e = !0) {
    if (this.handle.isNull()) return "NULL";
    const t = new d.StdString;
    return Java.api["art::ArtMethod::PrettyMethod"](t, this.handle, e ? 1 : 0), t.disposeToString();
  }
  toString() {
    let e = `ArtMethod< ${this.handle} >`;
    return e += `\n\t ${this.methodName}`, this.handle.isNull() || (e += `\n\t declaring_class: ${this.declaring_class} -> ArtClass< ${this.declaring_class.root.handle} >`, 
    e += `\n\t access_flags: ${this.access_flags} -> ${this.access_flags_string}`, e += `\n\t dex_code_item_offset: ${this.dex_code_item_offset} | ${ptr(this.dex_code_item_offset)} -> ${this.GetCodeItem()}`, 
    e += `\n\t dex_method_index: ${this.dex_method_index_} | ${ptr(this.dex_method_index)}`, 
    e += `\n\t method_index: ${this.method_index_} | ${ptr(this.method_index)}`, e += `\n\t hotness_count: ${this.hotness_count_} | ${ptr(this.hotness_count)}`, 
    e += `\n\t imt_index: ${this.imt_index_} | ${ptr(this.imt_index)}`, e += `\n\t data: ${this.data} -> ${(0, 
    n.formatSymbol)(this.data)}`, e += `\n\t entry_point_from_quick_compiled_code: ${this.entry_point_from_quick_compiled_code} -> ${(0, 
    n.formatSymbol)(this.entry_point_from_quick_compiled_code)}`), e;
  }
  DexInstructions() {
    return e.CodeItemInstructionAccessor.fromArtMethod(this);
  }
  PrettyJavaAccessFlags() {
    return d.StdString.fromPointers((0, n.callSym)("_ZN3art21PrettyJavaAccessFlagsEj", "libdexfile.so", [ "pointer", "pointer", "pointer" ], [ "pointer", "uint32" ], this, this.handle.add(getArtMethodSpec().offset.accessFlags).readU32()));
  }
  GetObsoleteDexCache() {
    return new u.DexCache((0, n.callSym)("_ZN3art9ArtMethod19GetObsoleteDexCacheEv", "libart.so", "pointer", [ "pointer" ], this.handle));
  }
  GetCodeItem() {
    const e = this.dex_code_item_offset;
    if (0 == e) return ptr(0);
    return this.GetDexFile().data_begin.add(e);
  }
  GetCodeItemPack() {
    const e = this.GetCodeItem(), t = this.DexInstructions().CodeItem;
    if (e.isNull()) return {
      headerStart: ptr(0),
      headerSize: 0,
      insnsStart: ptr(0),
      insnsSize: 0
    };
    const n = t.header_size, i = t.insns_size;
    return {
      headerStart: e,
      headerSize: n,
      insnsStart: e.add(n),
      insnsSize: i
    };
  }
  SetCodeItem(e) {
    this.dex_code_item_offset_.writeU32(e.sub(this.GetDexFile().data_begin).toInt32());
  }
  GetDexCache() {
    return 0 != (this.handle.add(4).readU32() & o.ArtModifiers.kAccObsoleteMethod) ? this.GetObsoleteDexCache() : new u.DexCache(this.declaring_class.root.dex_cache.root.handle);
  }
  static checkDexFile_onceFlag=!0;
  GetDexFile() {
    return this.GetDexCache().dex_file;
  }
  get methodName() {
    try {
      return `${PrettyAccessFlags(ptr(this.handle.add(getArtMethodSpec().offset.accessFlags).readU32()))}${this.PrettyMethod()}`;
    } catch (e) {
      return "ERROR";
    }
  }
  HasSameNameAndSignature(e) {
    return (0, n.callSym)("_ZN3art9ArtMethod23HasSameNameAndSignatureEPS0_", "libart.so", "bool", [ "pointer", "pointer" ], this.handle, e.handle);
  }
  GetRuntimeMethodName() {
    return (0, n.callSym)("_ZN3art9ArtMethod20GetRuntimeMethodNameEv", "libart.so", "pointer", [ "pointer" ], this.handle).readCString();
  }
  SetNotIntrinsic() {
    return (0, n.callSym)("_ZN3art9ArtMethod15SetNotIntrinsicEv", "libart.so", "void", [ "pointer" ], this.handle);
  }
  CopyFrom(e) {
    return (0, n.callSym)("_ZN3art9ArtMethod8CopyFromEPS0_NS_11PointerSizeE", "libart.so", "void", [ "pointer", "pointer", "int" ], this.handle, e.handle, l.PointerSize);
  }
  GetOatQuickMethodHeader(e = 0) {
    return new t.OatQuickMethodHeader((0, n.callSym)("_ZN3art9ArtMethod23GetOatQuickMethodHeaderEm", "libart.so", "pointer", [ "pointer", "pointer" ], this.handle, e));
  }
  FindObsoleteDexClassDefIndex() {
    return (0, n.callSym)("_ZN3art9ArtMethod28FindObsoleteDexClassDefIndexEv", "libart.so", "int", [ "pointer" ], this.handle);
  }
  GetSingleImplementation() {
    return new g((0, n.callSym)("_ZN3art9ArtMethod23GetSingleImplementationENS_11PointerSizeE", "libart.so", "pointer", [ "pointer", "int" ], this.handle, Process.pointerSize));
  }
  Invoke(e, t, i, r) {
    return (0, n.callSym)("_ZN3art9ArtMethod6InvokeEPNS_6ThreadEPjjPNS_6JValueEPKc", "libart.so", "void", [ "pointer", "pointer", "pointer", "pointer", "pointer", "pointer" ], this.handle, this.CurrentHandle, t, t.length, i.handle, Memory.allocUtf8String(r));
  }
  FindOverriddenMethod() {
    return (0, n.callSym)("_ZN3art9ArtMethod20FindOverriddenMethodENS_11PointerSizeE", "libart.so", "pointer", [ "pointer", "int" ], this.handle, Process.pointerSize);
  }
  IsOverridableByDefaultMethod() {
    return (0, n.callSym)("_ZN3art9ArtMethod28IsOverridableByDefaultMethodEv", "libart.so", "bool", [ "pointer" ], this.handle);
  }
  GetQuickenedInfo(e = 0) {
    return (0, n.callSym)("_ZN3art9ArtMethod16GetQuickenedInfoEv", "libart.so", "int", [ "pointer", "int" ], this.handle, e);
  }
  JniShortName() {
    return d.StdString.fromPointers((0, n.callSym)("_ZN3art9ArtMethod12JniShortNameEv", "libart.so", [ "pointer", "pointer", "pointer" ], [ "pointer" ], this.handle));
  }
  JniLongName() {
    return d.StdString.fromPointers((0, n.callSym)("_ZN3art9ArtMethod11JniLongNameEv", "libart.so", [ "pointer", "pointer", "pointer" ], [ "pointer" ], this.handle));
  }
  RegisterNative(e) {
    return (0, n.callSym)("_ZN3art9ArtMethod14RegisterNativeEPKv", "libart.so", "pointer", [ "pointer", "pointer" ], this.handle, e);
  }
  RegisterNativeJS(e) {
    return this.RegisterNative(new NativeCallback(e, "pointer", [ "pointer", "pointer", "pointer", "pointer" ]));
  }
  UnregisterNative() {
    return (0, n.callSym)("_ZN3art9ArtMethod16UnregisterNativeEv", "libart.so", "void", [ "pointer" ], this.handle);
  }
  static NumArgRegisters(e) {
    return (0, n.callSym)("_ZN3art9ArtMethod15NumArgRegistersEPKc", "libart.so", "int", [ "pointer" ], Memory.allocUtf8String(e));
  }
  GetInvokeType() {
    return a.InvokeType.toString((0, n.callSym)("_ZN3art9ArtMethod13GetInvokeTypeEv", "libart.so", "int", [ "pointer" ], this.handle));
  }
  test() {
    LOGD(`GetInvokeType -> ${this.GetInvokeType()}`), LOGD(`GetRuntimeMethodName -> ${this.GetRuntimeMethodName()}`), 
    LOGD(`dex_code_item_offset_ -> ${this.dex_code_item_offset} -> ${ptr(this.dex_code_item_offset)}`), 
    LOGD(`dex_method_index -> ${ptr(this.dex_method_index)}`), LOGD(`access_flags_string -> ${this.access_flags_string}`), 
    LOGD(`JniShortName -> ${this.JniShortName()}`), LOGD(`JniLongName -> ${this.JniLongName()}`), 
    LOGD(`GetQuickenedInfo -> ${this.GetQuickenedInfo()}`), LOGD(`entry_point_from_quick_compiled_code -> ${this.entry_point_from_quick_compiled_code}`), 
    newLine(), LOGD(this.GetDexFile()), LOGD(this.GetDexFile().oat_dex_file), LOGD(this.GetDexFile().oat_dex_file.oat_file);
  }
  showCode=e => {
    const t = DebugSymbol.fromAddress(this.entry_point_from_quick_compiled_code), n = DebugSymbol.fromAddress(this.data);
    t.toString().includes("libart.so!art_quick_generic_jni_trampoline") ? this.showAsm(e) : n.toString().includes("base.odex") || "base.odex" == t.moduleName ? this.showOatAsm(e) : this.showSmali(e);
  };
  showAsm(e = -1, t = !1) {
    newLine(), t && LOGD(`👉 ${this}\n`), LOGD(this.methodName), LOGZ(`[ ${(0, n.formatSymbol)(this.data)} ]`), 
    newLine();
    const o = (0, r.getFunctionBoundary)(this.data);
    LOGZ(`[ ${(0, r.describeBoundary)(o)} ]`), "low" === o.confidence && LOGW("[ boundary confidence is LOW, the result may over/under extend ]"), 
    newLine();
    const s = -1 === e && o.size > 0, d = s ? Math.ceil(o.size / i.CfgAnalyzer.granularity()) + 4 : -1 === e ? 20 : e;
    LOGW(`Showing ASM with ${s ? `function boundary (${o.size} bytes)` : `num: ${d}`}\n`);
    const a = Process.findModuleByAddress(this.data);
    let h;
    try {
      h = Instruction.parse(this.data);
    } catch (e) {
      return LOGE(`Cannot decode an instruction at ${this.data}`), void newLine();
    }
    let l = 0, _ = 0;
    for (;l < d && !(s && h.address.compare(o.end) >= 0); ) {
      l++;
      const e = `[${l.toString().padStart(5, " ")}|${ptr(_).toString().padEnd(7, " ")}]`, t = null === a ? "?" : h.address.sub(a.base), n = (0, 
      r.annotateInstruction)(h, o.start, o.end);
      LOGD(`${e} ${h.address} | ${t}  ${h.toString()}${n}`), _ += h.size;
      try {
        h = Instruction.parse(h.next);
      } catch (t) {
        LOGE(`${e} ${h.next} <--- UNDECODABLE, stop`);
        break;
      }
    }
    newLine();
  }
  showSmali(t = -1, n = !1, i = 100) {
    const r = this.DexInstructions(), o = this.GetDexFile(), s = this.GetCodeItem();
    if (!this.jniCode.isNull()) return LOGD(`👉 ${this}`), void LOGE(`jniCode is not null -> ${this.jniCode}`);
    n && (LOGD(`↓dex_file↓\n${o}\n`), LOGD(`👉 ${this}\n`), LOGD(`↓accessor↓\n${r}\n`)), 
    newLine(), LOGD(`${this.methodName} @ ${this.handle}`);
    let d = `insns_size_in_code_units: ${r.insns_size_in_code_units} - ${ptr(r.insns_size_in_code_units)}`;
    d += ` | method start: ${r.insns} | insns start ${s} | DEX: ${o.handle}`, LOGD(`\n[ ${d} ]\n`);
    const a = r.insns.sub(s).toUInt32(), h = s.readByteArray(a), l = Array.from(new Uint8Array(h)).map((e => e.toString(16).padStart(2, "0"))).join(" ");
    if (this.GetDexFile().is_compact_dex) {
      const e = r.CodeItem;
      LOGZ(`[ ${a} | ${l} ] -> [ fields : ${e.fields} | registers_size: ${e.registers_size} | ins_size: ${e.ins_size} | outs_size: ${e.outs_size} | tries_size: ${e.tries_size} | insns_count_and_flags: ${e.insns_count_and_flags} | insns_size_in_code_units: ${e.insns_size_in_code_units} ]\n`);
    } else {
      const t = e.CodeItemInstructionAccessor.CodeItem(o, this.GetCodeItem());
      LOGZ(`[ ${a} | ${l} ] \n[ registers_size: ${t.registers_size} | ins_size: ${t.ins_size} | outs_size: ${t.outs_size} | tries_size: ${t.tries_size} | debug_info_off: ${t.debug_info_off} | insns_size_in_code_units: ${t.insns_size_in_code_units} | insns: ${t.insns} ]\n`);
    }
    let _ = 0, c = 0;
    this.forEachSmali(((e, t) => {
      const n = `[${(++c).toString().padStart(3, " ")}|${ptr(_).toString().padEnd(5, " ")}]`;
      LOGD(`${n} ${e.handle} - ${e.dumpHexLE()} |  ${e.dumpString(o)}`), _ += e.SizeInCodeUnits, 
      i-- <= 0 && LOGW(`\nforce return counter -> ${i}\nThere may be a loop error, check the code ...`);
    })), newLine();
  }
  showOatAsm(e = -1, t = !1) {
    newLine(), t && LOGD(`👉 ${this}\n`), LOGD(this.methodName), LOGZ(`[ ${(0, n.formatSymbol)(this.data)} ]`), 
    newLine();
    const o = (0, r.getFunctionBoundary)(this.data, {
      oatHeader: !0
    });
    LOGZ(`[ ${(0, r.describeBoundary)(o)} ]`), "low" === o.confidence && LOGW("[ boundary confidence is LOW, the result may over/under extend ]"), 
    newLine();
    const s = -1 === e && o.size > 0, d = s ? Math.ceil(o.size / i.CfgAnalyzer.granularity()) + 4 : -1 === e ? 20 : e;
    let a;
    try {
      a = Instruction.parse(this.data);
    } catch (e) {
      return LOGE(`Cannot decode an instruction at ${this.data}`), void newLine();
    }
    let h = 0, l = 0;
    for (;h < d && !(s && a.address.compare(o.end) >= 0); ) {
      h++;
      const e = `[${h.toString().padStart(4, " ")}|${ptr(l).toString().padEnd(5, " ")}]`, t = (0, 
      r.annotateInstruction)(a, o.start, o.end);
      LOGD(`${e} ${a.address}\t${a.toString()}${t}`), l += a.size;
      try {
        a = Instruction.parse(a.next);
      } catch (t) {
        const n = a.next.readByteArray(4), i = null === n ? "??" : Array.from(new Uint8Array(n)).map((e => e.toString(16).padStart(2, "0"))).join(" ");
        LOGE(`${e} ${a.next}\t${i} <--- UNDECODABLE, stop`);
        break;
      }
    }
    newLine();
  }
  forEachSmali=e => p.bind(this)(this, e);
  HookArtMethodInvoke=() => f.HookArtMethodInvoke();
}

exports.ArtMethod = g, Reflect.set(globalThis, "ArtMethod", g);

class f extends g {
  static filterTimes_ptr=Memory.alloc(Process.pointerSize).writeInt(5);
  static filterThreadId_ptr=Memory.alloc(Process.pointerSize).writeInt(-1);
  static filterMethodName_ptr=Memory.alloc(10 * Process.pointerSize).writeUtf8String("");
  static HookArtMethodInvoke() {
    Interceptor.attach((0, n.getSym)("_ZN3art9ArtMethod6InvokeEPNS_6ThreadEPjjPNS_6JValueEPKc", "libart.so"), new CModule('\n\n            #include <stdio.h>\n            #include <glib.h>\n            #include <gum/gumprocess.h>\n            #include <gum/guminterceptor.h>\n\n            extern void _frida_log(const gchar * message);\n\n            static void frida_log(const char * format, ...) {\n                gchar * message;\n                va_list args;\n                va_start (args, format);\n                message = g_strdup_vprintf (format, args);\n                va_end (args);\n                _frida_log (message);\n                g_free (message);\n            }\n\n            typedef struct _ArtMethod ArtMethod;\n\n            extern void CalledArtMethod(ArtMethod* artMethod);\n\n            typedef guint8 jboolean;\n            typedef union _StdString StdString;\n            typedef struct _StdStringShort StdStringShort;\n            typedef struct _StdStringLong StdStringLong;\n\n            struct _StdStringShort {\n                guint8 size;\n                gchar data[(3 * sizeof (gpointer)) - sizeof (guint8)];\n            };\n\n            struct _StdStringLong {\n                gsize capacity;\n                gsize size;\n                gchar * data;\n            };\n\n            union _StdString {\n                StdStringShort s;\n                StdStringLong l;\n            };\n            \n            // std::string PrettyMethod(bool with_signature = true)\n            extern void ArtPrettyMethodFunc(StdString * result, ArtMethod * method, jboolean with_signature);\n\n            void(*it)(void* dexFile);\n\n            extern int filterTimes;\n            extern int filterThreadId;\n            extern const char* filterMethodName;\n\n            extern GHashTable *ptrHash;\n\n            gboolean filterMethodCount(void* ptr) {\n                if (ptrHash == NULL) {\n                    ptrHash = g_hash_table_new_full(g_direct_hash, g_direct_equal, NULL, NULL);\n                }\n\n                guint count = GPOINTER_TO_UINT(g_hash_table_lookup(ptrHash, ptr));\n\n                if (count >= filterTimes) {\n                    // frida_log("Filter PASS (Count >= %d ) -> %p", filterTimes, ptr);\n                    return FALSE;\n                } else {\n                    g_hash_table_insert(ptrHash, ptr, GUINT_TO_POINTER(count + 1));\n                    return TRUE;\n                }\n            }\n\n            gboolean filterThreadIdCount(GumInvocationContext *ctx) {\n                if (-1 == filterThreadId) return TRUE;\n                guint threadid = gum_invocation_context_get_thread_id(ctx);\n                return threadid == filterThreadId;\n            }\n\n            gboolean filterMethodNameCount(ArtMethod* artMethod) {\n                StdString result;\n                ArtPrettyMethodFunc(&result, artMethod, TRUE);\n                const char* methodName = result.l.data;\n                frida_log("methodName -> %s", methodName);\n                if (g_str_has_prefix(methodName, filterMethodName)) {\n                    return TRUE;\n                }\n                return FALSE;\n            }\n\n            void onEnter(GumInvocationContext *ctx) {\n                ArtMethod* artMethod = gum_invocation_context_get_nth_argument(ctx, 0);\n                if (filterMethodCount(artMethod) && filterThreadIdCount(ctx) \n                    // && filterMethodNameCount(artMethod)\n                ) {\n                    CalledArtMethod(artMethod);\n                }\n            }\n\n        ', {
      filterTimes: f.filterTimes_ptr,
      filterThreadId: f.filterThreadId_ptr,
      filterMethodName: f.filterMethodName_ptr,
      ptrHash: Memory.alloc(Process.pointerSize),
      ArtPrettyMethodFunc: (0, n.getSym)("_ZN3art9ArtMethod12PrettyMethodEb"),
      _frida_log: new NativeCallback((e => {
        LOGZ(e.readCString());
      }), "void", [ "pointer" ]),
      CalledArtMethod: new NativeCallback((e => {
        const t = new g(e);
        if (!f.includePackage.some((e => t.methodName.includes(e)))) return;
        const n = `Called [${Process.id}|${Process.getCurrentThreadId()}] -> ${t.methodName}`;
        "ERROR" == t.methodName ? LOGE(n) : LOGD(n);
      }), "void", [ "pointer" ])
    }));
  }
  static includePackage=[ "com.igaworks", "com.hippogames", "com.unity3d", "com.google" ];
  static onValueChanged(e, t) {
    "filterTimes" != e && "filterThreadId" != e && "filterMethodName" != e || (LOGZ(`ArtMethodInvoke Got New Value -> ${e} -> ${t}`), 
    "filterTimes" == e && f.filterTimes_ptr.writeInt(t), "filterThreadId" == e && f.filterThreadId_ptr.writeInt(t), 
    "filterMethodName" == e && f.filterMethodName_ptr.writeUtf8String(t));
  }
}

function p(e, t) {
  const n = e.DexInstructions(), i = n.CodeItem;
  let r = n.InstructionAt(), o = 0, s = 0;
  const d = 2 * n.insns_size_in_code_units;
  for (;!(t(r, i), o += r.SizeInCodeUnits, s == o || o >= d); ) r = r.Next(), s = o;
}

setImmediate((() => {
  s.KeyValueStore.getInstance().subscribe(f);
})), globalThis.HookArtMethodInvoke = f.HookArtMethodInvoke, globalThis.forEachSmali = p;

}).call(this)}).call(this,require("timers").setImmediate)

},{"../../../../../tools/StdString":110,"../../../../../tools/common":111,"../../../../../tools/enum":114,"../../../../../tools/modifiers":119,"../../../../JSHandle":13,"../../../../Utils/CfgAnalyzer":17,"../../../../Utils/FunctionBoundary":18,"../../../../Utils/SymHelper":21,"../GcRoot":37,"../Globals":38,"../OatQuickMethodHeader":50,"../Thread":62,"../dexfile/CodeItemInstructionAccessor":72,"./ArtClass":85,"./DexCache":89,"timers":155}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ClassExt = void 0;

const t = require("../../../../Object");

class e extends t.ArtObject {
  constructor(t) {
    super(t);
  }
  toString() {
    return `ClassExt<${this.handle}>`;
  }
}

exports.ClassExt = e;

},{"../../../../Object":14}],88:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ArtClassLoader = void 0;

const e = require("../../../../Interface/art/mirror/HeapReference"), t = require("../../../../Object");

class a extends t.ArtObject {
  packages_=this.CurrentHandle;
  parent_=this.packages_.add(e.HeapReference.Size);
  proxyCache_=this.parent_.add(e.HeapReference.Size);
  padding_=this.proxyCache_.add(e.HeapReference.Size);
  allocator_=this.padding_.add(4);
  class_table_=this.allocator_.add(8);
  constructor(e) {
    super(e);
  }
  get SizeOfClass() {
    return super.SizeOfClass + this.class_table_.add(8).sub(this.handle).toInt32();
  }
  toString() {
    let e = `ClassLoader<${this.handle}>`;
    return this.handle.isNull() || (e += `\n\t packages_: ${this.packages} | parent_: ${this.parent} | proxyCache_: ${this.proxyCache}`, 
    e += `\n\t allocator_: ${this.allocator} | class_table_: ${this.class_table}`), 
    e;
  }
  get packages() {
    return new e.HeapReference((e => new t.ArtObject(e)), this.packages_);
  }
  get parent() {
    return new e.HeapReference((e => new a(e)), this.parent_);
  }
  get proxyCache() {
    return new e.HeapReference((e => new t.ArtObject(e)), this.proxyCache_);
  }
  get allocator() {
    return new e.HeapReference((e => new t.ArtObject(e)), this.allocator_);
  }
  get class_table() {
    return ptr(this.class_table_.readU32());
  }
}

exports.ArtClassLoader = a;

},{"../../../../Interface/art/mirror/HeapReference":9,"../../../../Object":14}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.DexCache = void 0;

const e = require("../../../../Interface/art/mirror/HeapReference"), s = require("../../../../../tools/StdString"), t = require("../../../../Object"), r = require("../dexfile/DexFile");

class d extends t.ArtObject {
  location_=this.currentHandle.add(0);
  num_preresolved_strings_=this.currentHandle.add(4);
  dex_file_=this.currentHandle.add(8);
  preresolved_strings_=this.currentHandle.add(16);
  resolved_call_sites_=this.currentHandle.add(24);
  resolved_fields_=this.currentHandle.add(32);
  resolved_methods_=this.currentHandle.add(40);
  resolved_types_=this.currentHandle.add(48);
  strings_=this.currentHandle.add(56);
  num_resolved_call_sites_=this.currentHandle.add(64);
  num_resolved_fields_=this.currentHandle.add(68);
  num_resolved_method_types_=this.currentHandle.add(72);
  num_resolved_methods_=this.currentHandle.add(76);
  num_resolved_types_=this.currentHandle.add(80);
  num_strings_=this.currentHandle.add(84);
  constructor(e) {
    super(e);
  }
  toString() {
    let e = `DexCache<P:${this.handle} | C:${this.currentHandle}>`;
    return this.handle.isNull() || (e += `\n\t location: ${this.location_str} @ ${this.location.root.handle}`, 
    e += `\n\t preresolved_strings_: ${this.preresolved_strings} | num_preresolved_strings_: ${this.num_preresolved_strings} | resolved_call_sites_: ${this.resolved_call_sites}`, 
    e += `\n\t resolved_fields_: ${this.resolved_fields} | resolved_methods_: ${this.resolved_methods} | resolved_types_: ${this.resolved_types}`, 
    e += `\n\t strings_: ${this.strings} | num_resolved_call_sites_: ${this.num_resolved_call_sites} | num_resolved_fields_: ${this.num_resolved_fields}`, 
    e += `\n\t num_resolved_method_types_: ${this.num_resolved_method_types} | num_resolved_methods_: ${this.num_resolved_methods} | num_resolved_types_: ${this.num_resolved_types}`, 
    e += `\n\t num_strings_: ${this.num_strings}`), e;
  }
  get SizeOfClass() {
    return super.SizeOfClass + this.num_strings_.add(4).sub(this.CurrentHandle).toInt32();
  }
  get currentHandle() {
    return this.handle.add(super.SizeOfClass).add(this.VirtualClassOffset);
  }
  get location() {
    return new e.HeapReference((e => new s.StdString(e)), this.location_);
  }
  get location_str() {
    return s.StdString.from(this.location.root.handle);
  }
  get num_preresolved_strings() {
    return this.num_preresolved_strings_.readU32();
  }
  get dex_file() {
    return new r.DexFile(this.dex_file_.readPointer());
  }
  get preresolved_strings() {
    return this.preresolved_strings_.readPointer();
  }
  get resolved_call_sites() {
    return this.resolved_call_sites_.readPointer();
  }
  get resolved_fields() {
    return this.resolved_fields_.readPointer();
  }
  get resolved_methods() {
    return this.resolved_methods_.readPointer();
  }
  get resolved_types() {
    return this.resolved_types_.readPointer();
  }
  get strings() {
    return this.strings_.readPointer();
  }
  get num_resolved_call_sites() {
    return this.num_resolved_call_sites_.readU32();
  }
  get num_resolved_fields() {
    return this.num_resolved_fields_.readU32();
  }
  get num_resolved_method_types() {
    return this.num_resolved_method_types_.readU32();
  }
  get num_resolved_methods() {
    return this.num_resolved_methods_.readU32();
  }
  get num_resolved_types() {
    return this.num_resolved_types_.readU32();
  }
  get num_strings() {
    return this.num_strings_.readU32();
  }
}

exports.DexCache = d, Reflect.set(globalThis, "DexCache", d);

},{"../../../../../tools/StdString":110,"../../../../Interface/art/mirror/HeapReference":9,"../../../../Object":14,"../dexfile/DexFile":74}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.IfTable = void 0;

const e = require("../../../../Object");

class t extends e.ArtObject {
  constructor(e) {
    super(e);
  }
  toString() {
    return `IfTable<${this.handle}>`;
  }
}

exports.IfTable = t;

},{"../../../../Object":14}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./ArtClass"), require("./ArtMethod"), require("./ClassExt"), require("./ClassLoader"), 
require("./IfTable");

},{"./ArtClass":85,"./ArtMethod":86,"./ClassExt":87,"./ClassLoader":88,"./IfTable":90}],92:[function(require,module,exports){
(function (global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ArtRuntime = void 0;

const e = require("../../../../Utils/SymHelper"), t = require("../../../../JSHandle"), r = require("../../../../../tools/StdString");

class i extends t.JSHandle {
  constructor(e) {
    super(e);
  }
  static getInstance() {
    return new i(Java.api.artRuntime);
  }
  GetCompilerExecutable() {
    return r.StdString.fromPointers((0, e.callSym)("_ZNK3art7Runtime21GetCompilerExecutableEv", "libart.so", [ "pointer", "pointer", "pointer" ], [ "pointer" ], this.handle));
  }
}

exports.ArtRuntime = i, Reflect.set(global, "ArtRuntime", i);

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../../tools/StdString":110,"../../../../JSHandle":13,"../../../../Utils/SymHelper":21}],93:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.SuspendReason = exports.ThreadList = void 0;

const r = require("../../../../JSHandle"), a = require("../../../../Utils/SymHelper"), t = require("../Thread");

class e extends r.JSHandleNotImpl {
  constructor() {
    super(Java.api.artThreadList);
  }
  toString() {
    let r = `ThreadList<${Java.api.artThreadList}>`;
    return this.handle.isNull(), r;
  }
  static SuspendAll(r = "SuspendAll", t = !1) {
    Java.perform((() => {
      (0, a.callSym)("_ZN3art10ThreadList10SuspendAllEPKcb", "libart.so", "void", [ "pointer", "pointer", "pointer" ], Java.api.artThreadList, Memory.allocUtf8String(r), 1 == t ? ptr(1) : NULL);
    }));
  }
  static ResumeAll() {
    return (0, a.callSym)("_ZN3art10ThreadList9ResumeAllEv", "libart.so", "void", [ "pointer" ], Java.api.artThreadList);
  }
  static Register(r) {
    return (0, a.callSym)("_ZN3art10ThreadList8RegisterEPNS_6ThreadE", "libart.so", "void", [ "pointer", "pointer" ], Java.api.artThreadList, r.handle);
  }
  static WaitForOtherNonDaemonThreadsToExit() {
    return (0, a.callSym)("_ZN3art10ThreadList34WaitForOtherNonDaemonThreadsToExitEv", "libart.so", "void", [ "pointer" ], Java.api.artThreadList);
  }
  static ReleaseThreadId(r, t) {
    return (0, a.callSym)("_ZN3art10ThreadList15ReleaseThreadIdEPNS_6ThreadEj", "libart.so", "void", [ "pointer", "pointer", "int" ], Java.api.artThreadList, r, t);
  }
  static Contains(r) {
    return (0, a.callSym)("_ZN3art10ThreadList8ContainsEPNS_6ThreadE", "libart.so", "bool", [ "pointer", "pointer" ], Java.api.artThreadList, r.handle);
  }
  static VisitRootsForSuspendedThreads(r) {
    return (0, a.callSym)("_ZN3art10ThreadList29VisitRootsForSuspendedThreadsEPNS_11RootVisitorE", "libart.so", "void", [ "pointer", "pointer" ], Java.api.artThreadList, r);
  }
  static SuspendThreadByThreadId(r, t = i.kForUserCode, e = NULL) {
    return (0, a.callSym)("_ZN3art10ThreadList23SuspendThreadByThreadIdEjNS_13SuspendReasonEPb", "libart.so", "pointer", [ "pointer", "pointer", "pointer", "pointer" ], Java.api.artThreadList, ptr(r), ptr(t), e);
  }
  static Unregister(r) {
    return (0, a.callSym)("_ZN3art10ThreadList10UnregisterEPNS_6ThreadE", "libart.so", "void", [ "pointer", "pointer" ], Java.api.artThreadList, r.handle);
  }
  static FindThreadByThreadId(r) {
    return new t.ArtThread((0, a.callSym)("_ZN3art10ThreadList20FindThreadByThreadIdEj", "libart.so", "pointer", [ "pointer", "pointer" ], Java.api.artThreadList, ptr(r)));
  }
  static SuspendAllForDebugger() {
    return (0, a.callSym)("_ZN3art10ThreadList21SuspendAllForDebuggerEv", "libart.so", "void", [ "pointer" ], Java.api.artThreadList);
  }
  static ResumeAllForDebugger() {
    return (0, a.callSym)("_ZN3art10ThreadList20ResumeAllForDebuggerEv", "libart.so", "void", [ "pointer" ], Java.api.artThreadList);
  }
  static UndoDebuggerSuspensions() {
    return (0, a.callSym)("_ZN3art10ThreadList23UndoDebuggerSuspensionsEv", "libart.so", "void", [ "pointer" ], Java.api.artThreadList);
  }
  static Dump(r, t = !0) {
    return (0, a.callSym)("_ZN3art10ThreadList4DumpERNSt3__113basic_ostreamIcNS1_11char_traitsIcEEEEb", "libart.so", "void", [ "pointer", "pointer", "pointer" ], Java.api.artThreadList, r, ptr(t ? 1 : 0));
  }
  static DumpNativeStacks(r) {
    return (0, a.callSym)("_ZN3art10ThreadList16DumpNativeStacksERNSt3__113basic_ostreamIcNS1_11char_traitsIcEEEE", "libart.so", "void", [ "pointer", "pointer" ], Java.api.artThreadList, r);
  }
  static ForEach(r, t) {
    return (0, a.callSym)("_ZN3art10ThreadList7ForEachEPFvPNS_6ThreadEPvES3_", "libart.so", "void", [ "pointer", "pointer", "pointer" ], Java.api.artThreadList, r, t);
  }
  static get ThreadLists() {
    const r = Memory.alloc(Process.pointerSize), a = new Array;
    return e.ForEach(new NativeCallback(((r, e) => {
      try {
        a.push({
          thread: new t.ArtThread(r),
          context: e
        });
      } catch (r) {
        LOGE("ThreadList.ForEach ERROR" + r);
      }
    }), "void", [ "pointer", "pointer" ]), r), a;
  }
}

var i;

exports.ThreadList = e, function(r) {
  r[r.kInternal = 0] = "kInternal", r[r.kForDebugger = 1] = "kForDebugger", r[r.kForUserCode = 2] = "kForUserCode";
}(i = exports.SuspendReason || (exports.SuspendReason = {})), globalThis.SuspendAll = e.SuspendAll, 
globalThis.ResumeAll = e.ResumeAll, globalThis.ThreadLists = e.ThreadLists.map((r => r.thread.toString())), 
globalThis.SuspendThreadByThreadId = e.SuspendThreadByThreadId;

},{"../../../../JSHandle":13,"../../../../Utils/SymHelper":21,"../Thread":62}],94:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./Runtime"), require("./ThreadList");

},{"./Runtime":92,"./ThreadList":93}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.dex2oat = void 0;

const e = require("../../../../tools/StdString"), t = require("../../../../tools/intercepter"), r = require("../../../Utils/SymHelper");

class n {
  static hook_ExecAndReturnCode() {
    const n = (0, r.getSym)("_ZN3art17ExecAndReturnCodeERNSt3__16vectorINS0_12basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEENS5_IS7_EEEEPS7_", "libart.so");
    new NativeFunction(n, "int", [ "pointer", "pointer" ]);
    (0, t.R)(n, new NativeCallback(((t, r) => {
      const n = new e.StdString(r[1]);
      return LOGD(`ExecAndReturnCode arg_vector: ${t} error_msg: ${n.toString()}`), ptr(-1);
    }), "pointer", [ "pointer", "pointer" ]));
  }
  static DEX2OAT_BIN="/system/bin/dex2oat";
  static hook_exec() {
    const e = (0, r.getSym)("execv", "libc.so"), i = new NativeFunction(e, "int", [ "pointer", "pointer" ]);
    (0, t.R)(e, new NativeCallback(((e, t) => {
      const r = e.readCString(), o = t.readCString();
      return LOGD(`execv path: ${r} argv: ${o}`), r.includes(n.DEX2OAT_BIN) ? ptr(-1) : i(e, t);
    }), "pointer", [ "pointer", "pointer" ]));
    const o = (0, r.getSym)("execve", "libc.so"), c = new NativeFunction(o, "int", [ "pointer", "pointer", "pointer" ]);
    (0, t.R)(o, new NativeCallback(((e, t, r) => {
      const i = e.readCString(), o = t.readCString(), a = r.readCString();
      return LOGD(`execve file: ${i} argv: ${o} envp: ${a}`), i.includes(n.DEX2OAT_BIN) ? ptr(-1) : c(e, t, r);
    }), "pointer", [ "pointer", "pointer", "pointer" ]));
  }
}

exports.dex2oat = n, Reflect.set(globalThis, "dex2oat", n);

},{"../../../../tools/StdString":110,"../../../../tools/intercepter":117,"../../../Utils/SymHelper":21}],96:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./dex2oat");

},{"./dex2oat":95}],97:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./art/include"), require("./dex2oat/include");

},{"./art/include":80,"./dex2oat/include":96}],98:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./10/include");

},{"./10/include":97}],99:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./Object"), require("./JSHandle"), require("./android"), require("./ValueHandle"), 
require("./machine-code"), require("./TraceManager"), require("./implements/include"), 
require("./Interface/include"), require("./Utils/include"), require("./functions/include"), 
require("./jdwp/include");

},{"./Interface/include":12,"./JSHandle":13,"./Object":14,"./TraceManager":15,"./Utils/include":23,"./ValueHandle":26,"./android":27,"./functions/include":35,"./implements/include":98,"./jdwp/include":102,"./machine-code":105}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.buildString = exports.arrayBufferToHex2 = exports.arrayBufferToHex = exports.ab2str = exports.str2ab = exports.ReplyPackage = exports.RequestPackage = exports.JDWPPackage = void 0;

const t = require("./constant");

var e = 0;

function r() {
  return ++e;
}

class s {
  d_src;
  v_src;
  constructor(e = new ArrayBuffer(t.JDB.HEADERLEN)) {
    return this.d_src = e, this.v_src = new DataView(this.d_src), this.length = t.JDB.HEADERLEN, 
    this.id = r(), this;
  }
  set buffer(t) {
    this.d_src = t, this.v_src = new DataView(this.d_src);
  }
  get buffer() {
    return this.d_src;
  }
  set length(t) {
    this.v_src.setUint32(0, t, !1);
  }
  get length() {
    return this.v_src.getUint32(0, !1);
  }
  set id(t) {
    this.v_src.setUint32(4, t, !1);
  }
  get id() {
    return this.v_src.getUint32(4, !1);
  }
  set flags(t) {
    this.v_src.setUint8(8, t);
  }
  get flags() {
    return this.v_src.getUint8(8);
  }
  set data(e) {
    const r = t.JDB.HEADERLEN + e.byteLength, s = new ArrayBuffer(r), n = new DataView(s), a = new Uint8Array(this.d_src, 0, t.JDB.HEADERLEN);
    new Uint8Array(s, 0, t.JDB.HEADERLEN).set(a);
    const i = new Uint8Array(e);
    new Uint8Array(s, t.JDB.HEADERLEN).set(i), this.d_src = s, this.v_src = n, this.length = r;
  }
  get data() {
    return this.v_src.buffer.slice(t.JDB.HEADERLEN);
  }
  static get Handshake() {
    return i("JDWP-Handshake");
  }
  toString() {
    return h(this.buffer);
  }
}

exports.JDWPPackage = s;

class n extends s {
  constructor(t, e, r, s, n = new ArrayBuffer(0)) {
    super(), this.id = t, this.flags = e, this.commandSet = r, this.command = s, this.data = n, 
    this.length += n.byteLength;
  }
  set commandSet(t) {
    this.v_src.setUint8(9, t);
  }
  get commandSet() {
    return this.v_src.getUint8(9);
  }
  set command(t) {
    this.v_src.setUint8(10, t);
  }
  get command() {
    return this.v_src.getUint8(10);
  }
  static from(e, s = new ArrayBuffer(0)) {
    if (void 0 !== e.description && 0 == s.byteLength) throw new Error(`Check Arguments:\n\t${e.description}`);
    return void 0 === e.description && 0 != s.byteLength && (s = new ArrayBuffer(0), 
    LOGW("This command does not need data, force to set data to empty")), new n(r(), t.JDB.Flag.REQUEST_PACKET_TYPE, e.commandSet, e.command, s);
  }
}

exports.RequestPackage = n;

class a extends s {
  constructor(e = r(), s = t.JDB.Flag.REPLY_PACKET_TYPE, n = 0, a = new ArrayBuffer(0)) {
    super(), this.id = e, this.flags = s, this.errorCode = n, this.data = a, this.length += a.byteLength;
  }
  set errorCode(t) {
    this.v_src.setUint16(8, t);
  }
  get errorCode() {
    return this.v_src.getUint16(8);
  }
  static from(t) {
    const e = new a;
    return e.buffer = t, e;
  }
}

function i(t) {
  const e = new ArrayBuffer(t.length), r = new Uint8Array(e);
  for (let e = 0, s = t.length; e < s; e++) r[e] = 255 & t.charCodeAt(e);
  return e;
}

function o(t) {
  return Memory.alloc(t.byteLength).writeByteArray(t).readCString();
}

exports.ReplyPackage = a, exports.str2ab = i, exports.ab2str = o;

var c = NULL;

function h(t, e = !0) {
  const r = Memory.alloc(t.byteLength);
  return r.writeByteArray(t), e && (c = r), hexdump(r, {
    length: t.byteLength
  });
}

function u(t) {
  const e = new Uint8Array(t);
  let r = "";
  return e.forEach((t => r += t.toString(16).padStart(2, "0") + " ")), r.trim();
}

function g(t) {
  const e = i(t), r = new ArrayBuffer(e.byteLength + 4);
  return new DataView(r).setUint32(0, e.byteLength), new Uint8Array(r, 4).set(new Uint8Array(e)), 
  r;
}

exports.arrayBufferToHex = h, exports.arrayBufferToHex2 = u, exports.buildString = g, 
globalThis.ab2str = o, globalThis.str2ab = i, globalThis.arrayBufferToHex = h, globalThis.arrayBufferToHex2 = u;

},{"./constant":101}],101:[function(require,module,exports){
"use strict";

var t;

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.JDB = void 0, function(t) {
  let e, a;
  t.HANDSHAKE = "JDWP-Handshake", t.HEADERLEN = 11, function(t) {
    t[t.REQUEST_PACKET_TYPE = 0] = "REQUEST_PACKET_TYPE", t[t.REPLY_PACKET_TYPE = 128] = "REPLY_PACKET_TYPE";
  }(e = t.Flag || (t.Flag = {})), function(t) {
    t.VirtualMachine = class {
      static commandSet=1;
      static get Version() {
        return {
          commandSet: this.commandSet,
          command: 1
        };
      }
      static get ClassesBySignature() {
        return {
          commandSet: this.commandSet,
          command: 2
        };
      }
      static get AllClasses() {
        return {
          commandSet: this.commandSet,
          command: 3
        };
      }
      static get AllThreads() {
        return {
          commandSet: this.commandSet,
          command: 4
        };
      }
      static get TopLevelThreadGroups() {
        return {
          commandSet: this.commandSet,
          command: 5
        };
      }
      static get Dispose() {
        return {
          commandSet: this.commandSet,
          command: 6
        };
      }
      static get IDSizes() {
        return {
          commandSet: this.commandSet,
          command: 7
        };
      }
      static get Suspend() {
        return {
          commandSet: this.commandSet,
          command: 8
        };
      }
      static get Resume() {
        return {
          commandSet: this.commandSet,
          command: 9
        };
      }
      static get Exit() {
        return {
          commandSet: this.commandSet,
          command: 10
        };
      }
      static get CreateString() {
        return {
          commandSet: this.commandSet,
          command: 11,
          description: "args[0] : UTF-8 characters to use in the created string."
        };
      }
      static get Capabilities() {
        return {
          commandSet: this.commandSet,
          command: 12
        };
      }
      static get ClassPaths() {
        return {
          commandSet: this.commandSet,
          command: 13
        };
      }
    };
    t.ReferenceType = class {
      static commandSet=2;
    };
    t.ClassType = class {
      static commandSet=3;
    };
    t.ArrayType = class {
      static commandSet=4;
    };
    t.InterfaceType = class {
      static commandSet=5;
    };
    t.Method = class {
      static commandSet=6;
    };
  }(a = t.CommandSet || (t.CommandSet = {}));
}(t = exports.JDB || (exports.JDB = {}));

},{}],102:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./constant"), require("./JDWPPackage"), require("./jdb"), require("./jdwp");

},{"./JDWPPackage":100,"./constant":101,"./jdb":103,"./jdwp":104}],103:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

const e = require("./JDWPPackage"), t = require("./constant");

function n(n = Process.id, r = "127.0.0.1") {
  function a(e) {
    LOGD(e);
  }
  LOGD(`Connection -> ${r}:${n}`), Socket.connect({
    family: "ipv4",
    host: r,
    port: n
  }).then((n => {
    n.output.write(e.RequestPackage.Handshake), n.input.read(t.JDB.HANDSHAKE.length).then((function(n) {
      ab2str(n) == t.JDB.HANDSHAKE ? LOGD("Handshake Success") : LOGE((0, e.arrayBufferToHex)(n));
    })).catch(LOGE), setTimeout((() => {
      n.output.write(e.RequestPackage.from(t.JDB.CommandSet.VirtualMachine.Version).buffer), 
      setTimeout((() => {
        n.input.read(t.JDB.HEADERLEN).then((r => {
          const o = e.ReplyPackage.from(r).length - t.JDB.HEADERLEN;
          if (o > 0) {
            const c = 4096, s = o > c ? c : o;
            n.input.read(s).then((n => {
              const o = new ArrayBuffer(s + t.JDB.HEADERLEN);
              new Uint8Array(o).set(new Uint8Array(r), 0), new Uint8Array(o).set(new Uint8Array(n), t.JDB.HEADERLEN), 
              a(e.ReplyPackage.from(o));
            }));
          } else a(e.ReplyPackage.from(r));
        })).catch(LOGE);
      }), 200);
    }), 200);
  })).catch((e => {
    LOGE(e), LOGE("Check to see if you've run the `startJdwpThread()`");
  }));
}

globalThis.jdbTest = n;

},{"./JDWPPackage":100,"./constant":101}],104:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.startJdwpThread = void 0;

const t = () => {
  const t = Module.findExportByName("libart.so", "_ZN3art3Dbg9StartJdwpEv");
  if (!t) throw new Error("StartJdwp is nullptr");
  new NativeFunction(t, "void", [])();
}, r = () => {
  const t = Module.findExportByName("libart.so", "_ZN3art3Dbg8StopJdwpEv");
  if (!t) throw new Error("StopJdwp is nullptr");
  new NativeFunction(t, "void", [])();
}, e = t => {
  const r = Module.findExportByName("libart.so", "_ZN3art3Dbg14SetJdwpAllowedEb");
  if (!r) throw new Error("SetJdwpAllowed is nullptr");
  new NativeFunction(r, "void", [ "int" ])(t ? 1 : 0);
}, o = () => {
  try {
    let t = Module.findExportByName("libart.so", "_ZN3art3Dbg13IsJdwpAllowedEv");
    if (null == t) try {
      t = Process.findModuleByName("libart.so").enumerateSymbols().filter((t => "_ZN3artL12gJdwpAllowedE" == t.name))[0].address;
    } catch (t) {}
    if (t) {
      return new NativeFunction(t, "bool", [])();
    }
    throw new Error("IsJdwpAllowed is nullptr");
  } catch (t) {
    return !1;
  }
}, n = () => {
  const t = Module.findExportByName("libart.so", "_ZN3art3Dbg12GetJdwpStateEv");
  if (t) {
    return new NativeFunction(t, "pointer", [])();
  }
  throw new Error("GetJdwpState is nullptr");
}, s = () => {
  const t = Module.findExportByName("libart.so", "_ZN3art3Dbg16IsJdwpConfiguredEv");
  if (t) {
    return new NativeFunction(t, "bool", [])();
  }
  throw new Error("IsJdwpConfigured is nullptr");
};

var d;

!function(t) {
  t[t.kJdwpTransportNone = 0] = "kJdwpTransportNone", t[t.kJdwpTransportUnknown = 1] = "kJdwpTransportUnknown", 
  t[t.kJdwpTransportSocket = 2] = "kJdwpTransportSocket", t[t.kJdwpTransportAndroidAdb = 3] = "kJdwpTransportAndroidAdb";
}(d || (d = {}));

class i {
  transport=d.kJdwpTransportNone;
  server=!1;
  suspend=!1;
  host="";
  port=0;
  static tempMem=NULL;
  constructor(t, r, e, o, n) {
    this.transport = t, this.server = r, this.suspend = e, this.host = o, this.port = n;
  }
  get_pointer() {
    if (i.tempMem = Memory.alloc(8 + 3 * Process.pointerSize + 2), "arm64" == Process.arch) i.tempMem.add(0).writeInt(this.transport), 
    i.tempMem.add(4).writeU16(this.server ? 1 : 0), i.tempMem.add(6).writeU16(this.suspend ? 1 : 0), 
    i.tempMem.add(8).writeU8(2 * this.host.length), i.tempMem.add(9).writeUtf8String(this.host), 
    i.tempMem.add(32).writeU16(this.port); else {
      if ("arm" != Process.arch) throw new Error("Not support arch");
      i.tempMem = Memory.alloc(40), i.tempMem.add(0).writeInt(this.transport), i.tempMem.add(4).writeU16(this.server ? 1 : 0), 
      i.tempMem.add(6).writeU16(this.suspend ? 1 : 0), i.tempMem.add(8).writeU8(2 * this.host.length), 
      i.tempMem.add(9).writeUtf8String(this.host), i.tempMem.add(20).writeU16(this.port);
    }
    return i.tempMem;
  }
}

const p = t => {
  const r = Module.findExportByName("libart.so", "_ZN3art3Dbg13ConfigureJdwpERKNS_4JDWP11JdwpOptionsE");
  if (!r) throw new Error("ConfigureJdwp is nullptr");
  new NativeFunction(r, "void", [ "pointer" ])(t.get_pointer());
};

function a() {
  if (r(), o() || e(!0), !s()) {
    const t = new i(d.kJdwpTransportAndroidAdb, !0, !1, "127.0.0.1", 8e3);
    p(t);
  }
  t(), LOGW(`\nUseage: \n        adb forward tcp:${Process.id} jdwp:${Process.id}\n        adb reverse tcp:${Process.id} tcp:${Process.id}\n        jdb -attach ${Process.id}\n`);
}

exports.startJdwpThread = a, globalThis.startJdwpThread = a;

},{}],105:[function(require,module,exports){
function t(t, n, {limit: l}) {
  let r = t, e = null;
  for (let t = 0; t !== l; t++) {
    const t = Instruction.parse(r), l = n(t, e);
    if (null !== l) return l;
    r = t.next, e = t;
  }
  return null;
}

module.exports = {
  parseInstructionsAt: t
};

},{}],106:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./android/include"), require("./Java/include"), require("./tools/include"), 
require("./native/include");

},{"./Java/include":6,"./android/include":99,"./native/include":109,"./tools/include":116}],107:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./include"), globalThis.testArtMethod = () => {
  pathToArtMethod("com.moutai.mtsc.RandK.mixK").show(), Java.perform((() => {
    let e = pathToArtMethod("com.unity3d.player.UnityPlayer.UnitySendMessage"), t = e.GetDexFile();
    e.show();
    for (let e = t.NumStringIds(); e > t.NumStringIds() - 20; e--) LOGD(t.StringDataByIdx(e).toString());
    for (let e = t.NumTypeIds(); e > t.NumTypeIds() - 20; e--) LOGD(t.GetTypeDescriptor(e));
    newLine(), LOGD(t.StringDataByIdx(8907).str), t.PrettyMethod(41007);
  }));
}, globalThis.sendMessage = (e = "test_class", t = "test_function", a = "test_value") => {
  Java.perform((() => {
    const s = Java.use("java.lang.String");
    Java.use("com.unity3d.player.UnityPlayer").UnitySendMessage(s.$new(e), s.$new(t), s.$new(a));
  }));
};

},{"./include":106}],108:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

class e {
  address;
  constructor(e) {
    this.address = e;
  }
  getAddress() {
    return this.address;
  }
  getMethodName() {
    return this.address.readCString();
  }
  getMethodSignature() {
    return this.address.add(1 * Process.pointerSize).readCString();
  }
  getMethodImplementation() {
    return this.address.add(2 * Process.pointerSize).readPointer();
  }
  toString() {
    return `fnPtr: ${this.getMethodImplementation()} | name: ${this.getMethodName()} | signature: ${this.getMethodSignature()}`;
  }
  hook() {
    LOGZ(`Hooking : ${this.getMethodName()} @ ${this.getMethodImplementation()}`);
    (() => {
      let e = this;
      Interceptor.attach(e.getMethodImplementation(), {
        onEnter: function(t) {
          let o = e.getMethodImplementation(), r = Process.findModuleByAddress(o), s = "";
          null != r && (s += `| ${o.sub(r.base)} @ ${r.name}`), LOGD(`Called : ${e.getMethodName()} @ ${o} ${s}`), 
          LOGZ(`\targs : ${t[0]} ${t[1]} ${t[2]} ${t[3]}`);
        }
      });
    })();
  }
  next() {
    return this.address.add(3 * Process.pointerSize).readPointer();
  }
}

globalThis.hookNativeMethod = (t, o) => {
  LOGD(`looking from ${t} to ${o}`);
  let r = 0;
  for (let s = t; s < o; s = s.add(3 * Process.pointerSize)) {
    let t = new e(s);
    LOGD(t.toString()), t.hook(), r++;
  }
  LOGD(`Total methods found: ${r}`);
};

},{}],109:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./hooks");

},{"./hooks":108}],110:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.StdString = void 0;

class t {
  static STD_STRING_SIZE=3 * Process.pointerSize;
  handle;
  constructor(e = Memory.alloc(t.STD_STRING_SIZE)) {
    this.handle = e;
  }
  dispose() {
    const [t, e] = this._getData();
    e || Java.api.$delete(t);
  }
  static fromPointer(e) {
    return t.fromPointers([ e, e.add(Process.pointerSize), e.add(2 * Process.pointerSize) ]);
  }
  static fromPointers(e) {
    return 3 != e.length ? "" : t.fromPointersRetInstance(e).disposeToString();
  }
  static from(t) {
    try {
      return t.add(2 * Process.pointerSize).readCString();
    } catch (t) {
      return "ERROR";
    }
  }
  static fromPointersRetInstance(e) {
    if (3 != e.length) return new t;
    const r = new t;
    return r.handle.writePointer(e[0]), r.handle.add(Process.pointerSize).writePointer(e[1]), 
    r.handle.add(2 * Process.pointerSize).writePointer(e[2]), r;
  }
  disposeToString() {
    const t = this.toString();
    return this.dispose(), t;
  }
  toString() {
    try {
      return this._getData()[0].readUtf8String();
    } catch (e) {
      return t.from(this.handle.add(2 * Process.pointerSize));
    }
  }
  _getData() {
    const t = this.handle, e = 0 == (1 & t.readU8());
    return [ e ? t.add(1) : t.add(2 * Process.pointerSize).readPointer(), e ];
  }
}

exports.StdString = t, Reflect.set(globalThis, "StdString", t);

},{}],111:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.filterDuplicateOBJ = exports.KeyValueStore = exports.DEBUG = void 0, 
exports.DEBUG = !1, globalThis.clear = () => console.log("c"), globalThis.cls = () => clear(), 
globalThis.seeHexA = (e, t = 64, s = !0, r) => {
  let i = NULL;
  i = "number" == typeof e ? ptr(e) : e, LOG(hexdump(i, {
    length: t,
    header: s
  }), null == r ? LogColor.WHITE : r);
};

class e {
  static instance;
  subscribers=[];
  store=new Map;
  constructor() {}
  static getInstance() {
    return this.instance || (this.instance = new e), this.instance;
  }
  subscribe(e) {
    this.subscribers.push(e);
  }
  unsubscribe(e) {
    const t = this.subscribers.indexOf(e);
    -1 !== t && this.subscribers.splice(t, 1);
  }
  update(e, t) {
    this.store.set(e, t);
    for (const s of this.subscribers) s.onValueChanged(e, t);
  }
  get(e) {
    return this.store.get(e);
  }
}

exports.KeyValueStore = e;

class t {
  static set filterThreadId(t) {
    e.getInstance().update("filterThreadId", t);
  }
  static get filterThreadId() {
    return e.getInstance().get("filterThreadId") || -1;
  }
  static set filterTimes(t) {
    e.getInstance().update("filterTimes", t);
  }
  static get filterTimes() {
    return e.getInstance().get("filterTimes") || 5;
  }
  static set CanUseMterp(t) {
    e.getInstance().update("CanUseMterp", t);
  }
  static get CanUseMterp() {
    return e.getInstance().get("CanUseMterp") || !1;
  }
  static set filterMethodName(t) {
    e.getInstance().update("filterMethodName", t);
  }
  static get filterMethodName() {
    return e.getInstance().get("filterMethodName") || "";
  }
}

var s = new Map;

const r = (e, t = 10) => {
  if (s.has(e)) {
    if (s.set(e, s.get(e) + 1), s.get(e) > t) return s.delete(e), !1;
  } else s.set(e, 1);
  return !0;
};

exports.filterDuplicateOBJ = r, setImmediate((() => {
  t.filterThreadId = -1, t.filterTimes = 5, t.CanUseMterp = !1, t.filterMethodName = "";
})), Reflect.set(globalThis, "globalValueStore", t), globalThis.setfilterThreadId = e => t.filterThreadId = e, 
globalThis.setfilterTimes = e => t.filterTimes = e, globalThis.setCanUseMterp = e => t.CanUseMterp = e, 
globalThis.setfilterMethodName = e => t.filterMethodName = e;

}).call(this)}).call(this,require("timers").setImmediate)

},{"timers":155}],112:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.dlopenManager = void 0;

const a = {
  0: "RTLD_LOCAL",
  1: "RTLD_LAZY    ",
  2: "RTLD_NOW     ",
  4: "RTLD_NOLOAD  ",
  256: "RTLD_GLOBAL  ",
  4096: "RTLD_NODELETE"
};

class t {
  static needLog_G=!0;
  static init(a) {
    t.needLog_G = a, Interceptor.attach(Module.findExportByName(null, "dlopen"), {
      onEnter: function(a) {
        this.name_p = a[0].readCString(), this.flag_p = a[1].toInt32();
      },
      onLeave: function(a) {
        t.onSoLoad(this.name_p, this.flag_p, a);
      }
    }), Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"), {
      onEnter: function(a) {
        void 0 !== a[0] && null != a[0] && (this.name_p = a[0].readCString(), this.flag_p = a[1].toInt32(), 
        this.info_p = a[2].toInt32());
      },
      onLeave: function(a) {
        t.onSoLoad(this.name_p, this.flag_p, a, this.info_p);
      }
    });
  }
  static onSoLoad(e, o, n, l) {
    t.needLog_G && LOGD(`dlopen: ${o} -> ${a[o]} | ${e}`), null != t.callbacks && t.callbacks.forEach(((a, o) => {
      -1 !== e.indexOf(o) && a.forEach((a => {
        a();
      })), t.callbacks.delete(o);
    }));
  }
  static callbacks=new Map;
  static registSoLoadCallBack(a, e) {
    t.callbacks.has(a) ? t.callbacks.get(a).push(e) : t.callbacks.set(a, [ e ]);
  }
}

exports.dlopenManager = t, setImmediate((() => {
  t.init(!1);
})), globalThis.addSoLoadCallBack = (a, e) => {
  t.registSoLoadCallBack(a, e);
};

}).call(this)}).call(this,require("timers").setImmediate)

},{"timers":155}],113:[function(require,module,exports){
"use strict";

function e(e = "libil2cpp.so") {
  const s = Process.getModuleByName(e);
  LOGE(getLine(30)), LOGW("[name]:" + s.name), LOGW("[base]:" + s.base), LOGW("[size]:" + s.size), 
  LOGW("[path]:" + s.path), LOGE(getLine(30));
  const i = `${s.name}_${s.base}_${ptr(s.size)}.so`;
  t(s.base, s.size, i);
}

function t(e, t, s, i, l = !0) {
  if (t <= 0) return;
  let n = null == i ? getFilesDir() : i;
  n += null == s ? `/${e}_${t}.bin` : "/" + s;
  const o = new File(n, "wb");
  if (o && null != o) {
    Memory.protect(e, t, "rwx");
    let s = e.readByteArray(t);
    o.write(s), o.flush(), o.close(), l && (LOGZ(`\nDump ${t} bytes from ${e} to ${e.add(t)}`), 
    LOGD(`Saved to -> ${n}\n`));
  }
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), globalThis.dumpSo = e, globalThis.dumpMem = t;

},{}],114:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.InvokeType = void 0;

class t {
  static kStatic=0;
  static kDirect=1;
  static kVirtual=2;
  static kSuper=3;
  static kInterface=4;
  static kPolymorphic=5;
  static kCustom=6;
  static kMaxInvokeType=6;
  static toString(e) {
    switch (e) {
     case t.kStatic:
      return "kStatic";

     case t.kDirect:
      return "kDirect";

     case t.kVirtual:
      return "kVirtual";

     case t.kSuper:
      return "kSuper";

     case t.kInterface:
      return "kInterface";

     case t.kPolymorphic:
      return "kPolymorphic";

     case t.kCustom:
      return "kCustom";

     case t.kMaxInvokeType:
      return "kMaxInvokeType";

     default:
      return "unknown";
    }
  }
}

exports.InvokeType = t;

},{}],115:[function(require,module,exports){
"use strict";

function e(e) {
  let n = Module.findExportByName("libc++.so", "__cxa_demangle");
  if (null == n && (n = Module.findExportByName("libunwindstack.so", "__cxa_demangle")), 
  null == n && (n = Module.findExportByName("libbacktrace.so", "__cxa_demangle")), 
  null == n && (n = Module.findExportByName(null, "__cxa_demangle")), null == n) throw Error("can not find export function -> __cxa_demangle");
  let l = new NativeFunction(n, "pointer", [ "pointer", "pointer", "pointer", "pointer" ]), o = Memory.allocUtf8String(e), t = NULL, a = NULL, r = Memory.alloc(Process.pageSize), i = l(o, t, a, r);
  if (0 === r.readInt()) {
    let n = i.readUtf8String();
    return null == n || n == e ? "" : n;
  }
  return "";
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.demangleName_onlyFunctionName = exports.demangleName = void 0, exports.demangleName = e;

const n = n => e(n).split("::").map((e => e.split("(")[0]));

exports.demangleName_onlyFunctionName = n, globalThis.demangleName = e;

},{}],116:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), require("./StdString"), require("./dlopen"), require("./dump"), require("./common"), 
require("./enum"), require("./logger"), require("./modifiers"), require("./intercepter"), 
require("./version");

},{"./StdString":110,"./common":111,"./dlopen":112,"./dump":113,"./enum":114,"./intercepter":117,"./logger":118,"./modifiers":119,"./version":120}],117:[function(require,module,exports){
(function (global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.A = exports.R = exports.nop = exports.bsym = void 0;

const e = require("../android/Utils/SymHelper"), t = (t, r = "libart.so") => {
  const o = (0, e.getSym)(t, r, !1), s = demangleName(t), a = `${0 == s.length}` ? t : s;
  LOGD(`Hooking [ ${a} ] from ${r} => ${o}`), Interceptor.attach(o, {
    onEnter(e) {
      this.args = e;
    },
    onLeave(e) {
      LOGD(`\nCalled ${t}(${this.args.map((e => e.toString())).join(", ")}) => ${e}`);
    }
  });
};

exports.bsym = t;

const r = e => (0, exports.R)(e, new NativeCallback((() => {
  LOGD(`Called NOP -> ${e}`);
}), "void", []));

exports.nop = r;

const o = (t, r) => {
  "number" == typeof t && (t = ptr(t)), "string" == typeof t && (t = (0, e.getSym)(t));
  const o = DebugSymbol.fromAddress(t);
  try {
    Interceptor.replace(t, r);
  } catch (e) {
    -1 != e.message.indexOf("already hooked") ? (LOGE(`Enable Replace -> ${o.name} | ${o.address} <- already replaced , try to rehook`), 
    Interceptor.revert(t), Interceptor.replace(t, r)) : LOGE(`Enable Replace -> ${o.name} | ${o.address} <- ${e}`);
  }
};

exports.R = o;

const s = [], a = (t, r, o) => {
  "number" == typeof t && (t = ptr(t)), "string" == typeof t && (t = (0, e.getSym)(t));
  const a = DebugSymbol.fromAddress(t);
  try {
    s.push(Interceptor.attach(t, r, o)), LOGD(`Enable Attach -> ${a.name} | ${a.address}`);
  } catch (e) {
    LOGE(`Enable Attach -> ${a.name} | ${a.address} <- ${e}`);
  }
};

exports.A = a, Reflect.set(global, "bsym", exports.bsym), Reflect.set(global, "nop", exports.nop), 
Reflect.set(global, "R", exports.R);

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../android/Utils/SymHelper":21}],118:[function(require,module,exports){
"use strict";

var t, o;

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.LOGW = exports.Logger = exports.LogColor = void 0, function(t) {
  t[t.WHITE = 0] = "WHITE", t[t.RED = 1] = "RED", t[t.YELLOW = 3] = "YELLOW", t[t.C31 = 31] = "C31", 
  t[t.C32 = 32] = "C32", t[t.C33 = 33] = "C33", t[t.C34 = 34] = "C34", t[t.C35 = 35] = "C35", 
  t[t.C36 = 36] = "C36", t[t.C41 = 41] = "C41", t[t.C42 = 42] = "C42", t[t.C43 = 43] = "C43", 
  t[t.C44 = 44] = "C44", t[t.C45 = 45] = "C45", t[t.C46 = 46] = "C46", t[t.C90 = 90] = "C90", 
  t[t.C91 = 91] = "C91", t[t.C92 = 92] = "C92", t[t.C93 = 93] = "C93", t[t.C94 = 94] = "C94", 
  t[t.C95 = 95] = "C95", t[t.C96 = 96] = "C96", t[t.C97 = 97] = "C97", t[t.C100 = 100] = "C100", 
  t[t.C101 = 101] = "C101", t[t.C102 = 102] = "C102", t[t.C103 = 103] = "C103", t[t.C104 = 104] = "C104", 
  t[t.C105 = 105] = "C105", t[t.C106 = 106] = "C106", t[t.C107 = 107] = "C107";
}(t = exports.LogColor || (exports.LogColor = {}));

class L {
  static linesMap=new Map;
  static colorEndDes="[0m";
  static colorStartDes=t => `[${t}m`;
  static logL=console.log;
  static LOGW=o => LOG(o, t.YELLOW);
  static LOGE=o => LOG(o, t.RED);
  static LOGG=o => LOG(o, t.C32);
  static LOGD=o => LOG(o, t.C36);
  static LOGN=o => LOG(o, t.C35);
  static LOGO=o => LOG(o, t.C33);
  static LOGP=o => LOG(o, t.C34);
  static LOGM=o => LOG(o, t.C92);
  static LOGH=o => LOG(o, t.C96);
  static LOGZ=o => LOG(o, t.C90);
  static LOGJSON=(o, L = t.C36, O = 1) => LOG(JSON.stringify(o, null, O), L);
  static LOG=(o, O = t.WHITE) => {
    switch (O) {
     case t.WHITE:
      L.logL(o);
      break;

     case t.RED:
      console.error(o);
      break;

     case t.YELLOW:
      console.warn(o);
      break;

     default:
      L.logL("[" + O + "m" + o + "[0m");
    }
  };
  static printLogColors=() => {
    let t = "123456789";
    L.logL(`\n${getLine(16)}  listLogColors  ${getLine(16)}`);
    for (let o = 30; o <= 37; o++) L.logL(`\t\t${L.colorStartDes(o)} C${o}\t${t} ${L.colorEndDes}`);
    L.logL(getLine(50));
    for (let o = 40; o <= 47; o++) L.logL(`\t\t${L.colorStartDes(o)} C${o}\t${t} ${L.colorEndDes}`);
    L.logL(getLine(50));
    for (let o = 90; o <= 97; o++) L.logL(`\t\t${L.colorStartDes(o)} C${o}\t${t} ${L.colorEndDes}`);
    L.logL(getLine(50));
    for (let o = 100; o <= 107; o++) L.logL(`\t\t${L.colorStartDes(o)} C${o}\t${t} ${L.colorEndDes}`);
    L.logL(getLine(50));
  };
  static getLine=(t, o = "-") => {
    if (0 == t) return "";
    let O = t + "|" + o;
    if (null != L.linesMap.get(O)) return L.linesMap.get(O);
    for (var l = 0, e = ""; l < t; l++) e += o;
    return L.linesMap.set(O, e), e;
  };
  static getTextFormart=(o, O = t.WHITE, l = " ", e = -1, i = !1) => {
    null == o && (o = ""), -1 == e && (e = o.length);
    let s = L.colorStartDes(O), r = e - o.length;
    if (r > 0) {
      let t = Math.floor(r / 2), L = r - t;
      i && (t = L), s += getLine(t, l) + o + getLine(L, l);
    } else s += o;
    return s += L.colorEndDes, s;
  };
}

exports.Logger = L, function(t) {
  t[t.ANDROID_LOG_UNKNOWN = 0] = "ANDROID_LOG_UNKNOWN", t[t.ANDROID_LOG_DEFAULT = 1] = "ANDROID_LOG_DEFAULT", 
  t[t.ANDROID_LOG_VERBOSE = 2] = "ANDROID_LOG_VERBOSE", t[t.ANDROID_LOG_DEBUG = 3] = "ANDROID_LOG_DEBUG", 
  t[t.ANDROID_LOG_INFO = 4] = "ANDROID_LOG_INFO", t[t.ANDROID_LOG_WARN = 5] = "ANDROID_LOG_WARN", 
  t[t.ANDROID_LOG_ERROR = 6] = "ANDROID_LOG_ERROR", t[t.ANDROID_LOG_FATAL = 7] = "ANDROID_LOG_FATAL", 
  t[t.ANDROID_LOG_SILENT = 8] = "ANDROID_LOG_SILENT";
}(o || (o = {}));

const O = "ZZZ", l = !1;

globalThis.logcat = (t, L, l = O, e = o.ANDROID_LOG_INFO) => {
  new NativeFunction(Module.findExportByName("liblog.so", "__android_log_print"), "void", [ "int", "pointer", "pointer", "pointer" ])(4, Memory.allocUtf8String(l), Memory.allocUtf8String(t), Memory.allocUtf8String(L));
}, exports.LOGW = L.LOGW, globalThis.LOG = L.LOG, globalThis.LOGW = L.LOGW, globalThis.LOGE = L.LOGE, 
globalThis.LOGG = L.LOGG, globalThis.LOGD = L.LOGD, globalThis.LOGN = L.LOGN, globalThis.LOGO = L.LOGO, 
globalThis.LOGP = L.LOGP, globalThis.LOGH = L.LOGH, globalThis.LOGM = L.LOGM, globalThis.LOGZ = L.LOGZ, 
globalThis.LOGJSON = L.LOGJSON, globalThis.getLine = L.getLine, globalThis.printLogColors = L.printLogColors, 
globalThis.newLine = (t = 1) => L.LOG(getLine(t, "\n")), globalThis.LogColor = t;

},{}],119:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ArtModifiers = void 0;

class c {
  static kAccPublic=1;
  static kAccPrivate=2;
  static kAccProtected=4;
  static kAccStatic=8;
  static kAccFinal=16;
  static kAccSynchronized=32;
  static kAccSuper=32;
  static kAccVolatile=64;
  static kAccBridge=64;
  static kAccTransient=128;
  static kAccVarargs=128;
  static kAccNative=256;
  static kAccInterface=512;
  static kAccAbstract=1024;
  static kAccStrict=2048;
  static kAccSynthetic=4096;
  static kAccAnnotation=8192;
  static kAccEnum=16384;
  static kAccJavaFlagsMask=65535;
  static kAccConstructor=65536;
  static kAccDeclaredSynchronized=131072;
  static kAccClassIsProxy=262144;
  static kAccObsoleteMethod=262144;
  static kAccSkipAccessChecks=524288;
  static kAccVerificationAttempted=524288;
  static kAccSkipHiddenapiChecks=1048576;
  static kAccCopied=1048576;
  static kAccMiranda=2097152;
  static kAccDefault=4194304;
  static kAccDefaultConflicting=8388608;
  static kAccCompileDontBother=33554432;
  static kAccIntrinsic=67108864;
  static kAccRuntimeOnly=67108864;
  static kAccSingleImplementation=134217728;
  static kAccPublicApi=268435456;
  static kAccCorePlatformApi=536870912;
  static kAccFastInterpreterToInterpreterInvoke=1073741824;
  static kAccPreviouslyWarm=2147483648;
  static kAccCriticalNative=2097152;
  static kAccFastNative=524288;
  static PrettyRuntimeAccessFlags=(t, e = "method") => {
    const i = "number" == typeof t ? t : t.toUInt32(), a = (i & ~c.kAccJavaFlagsMask) >>> 0;
    if (0 === a) return "";
    const s = 0 != (i & c.kAccNative), r = [], n = (c, t) => {
      (a & c) >>> 0 != 0 && r.push(t);
    };
    return "method" === e ? (n(c.kAccConstructor, "Constructor"), n(c.kAccDeclaredSynchronized, "DeclaredSynchronized"), 
    n(c.kAccObsoleteMethod, "ObsoleteMethod"), n(c.kAccCopied, "Copied"), 0 != (a & c.kAccFastNative) && r.push(s ? "FastNative" : "SkipAccessChecks"), 
    0 != (a & c.kAccCriticalNative) && r.push(s ? "CriticalNative" : "Miranda"), n(c.kAccDefault, "Default"), 
    n(c.kAccDefaultConflicting, "DefaultConflicting"), n(c.kAccCompileDontBother, "CompileDontBother"), 
    n(c.kAccIntrinsic, "Intrinsic"), n(c.kAccSingleImplementation, "SingleImplementation"), 
    n(c.kAccPublicApi, "PublicApi"), n(c.kAccCorePlatformApi, "CorePlatformApi"), n(c.kAccFastInterpreterToInterpreterInvoke, "FastInterpToInterpInvoke"), 
    n(c.kAccPreviouslyWarm, "PreviouslyWarm")) : "class" === e ? (n(c.kAccClassIsProxy, "ClassIsProxy"), 
    n(c.kAccVerificationAttempted, "VerificationAttempted"), n(c.kAccSkipHiddenapiChecks, "SkipHiddenapiChecks")) : (n(c.kAccRuntimeOnly, "RuntimeOnly"), 
    n(c.kAccPublicApi, "PublicApi"), n(c.kAccCorePlatformApi, "CorePlatformApi")), r.join("|");
  };
  static PrettyAccessFlags=(t, e = "method") => {
    let i = NULL;
    if (i = "number" == typeof t ? ptr(t) : t, i.isNull()) throw new Error("access_flags is null");
    const a = c => !i.and(c).isNull();
    let s = "";
    return a(c.kAccPublic) && (s += "public "), a(c.kAccProtected) && (s += "protected "), 
    a(c.kAccPrivate) && (s += "private "), a(c.kAccAbstract) && (s += "abstract "), 
    a(c.kAccStatic) && (s += "static "), a(c.kAccFinal) && (s += "final "), a(c.kAccTransient) && (s += "field" === e ? "transient " : "method" === e ? "varargs " : ""), 
    a(c.kAccVolatile) && (s += "field" === e ? "volatile " : "method" === e ? "bridge " : ""), 
    "method" === e && a(c.kAccSynchronized) && (s += "synchronized "), a(c.kAccNative) && (s += "native "), 
    a(c.kAccStrict) && (s += "strictfp "), a(c.kAccSynthetic) && (s += "synthetic "), 
    a(c.kAccAnnotation) && (s += "annotation "), a(c.kAccEnum) && (s += "enum "), a(c.kAccInterface) && (s += "interface "), 
    "method" === e && a(c.kAccConstructor) && (s += "constructor "), s;
  };
}

exports.ArtModifiers = c, globalThis.PrettyAccessFlags = (t, e = "method") => c.PrettyAccessFlags(t, e), 
globalThis.PrettyRuntimeAccessFlags = (t, e = "method") => c.PrettyRuntimeAccessFlags(t, e), 
Reflect.set(globalThis, "ArtModifiers", c);

},{}],120:[function(require,module,exports){
"use strict";

function e(e) {
  if (!e || "string" != typeof e) return null;
  const n = e.split(".");
  if (0 === n.length) return null;
  const r = parseInt(n[0], 10);
  if (isNaN(r)) return null;
  const t = n.length > 1 ? parseInt(n[1], 10) : 0, o = n.length > 2 ? parseInt(n[2], 10) : void 0;
  return {
    major: r,
    minor: isNaN(t) ? 0 : t,
    patch: isNaN(o) ? void 0 : o,
    raw: e
  };
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.parseFridaVersion = void 0, exports.parseFridaVersion = e;

let n = e(Frida.version);

(!n || n.major >= 17) && (Module.findExportByName = function(e, n) {
  if (null === e) return Module.findGlobalExportByName(n);
  const r = Process.findModuleByName(e);
  return null === r ? null : r.findExportByName(n);
}), "function" != typeof Module.getExportByName && (Module.getExportByName = function(e, n) {
  const r = Module.findExportByName(e, n);
  if (null === r) throw new Error(`Unable to find export '${n}' in module '${e}'`);
  return r;
});

},{}],121:[function(require,module,exports){
(function (global){(function (){
"use strict";

var t = require("object.assign/polyfill")();

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */ function e(t, e) {
  if (t === e) return 0;
  for (var r = t.length, n = e.length, i = 0, o = Math.min(r, n); i < o; ++i) if (t[i] !== e[i]) {
    r = t[i], n = e[i];
    break;
  }
  return r < n ? -1 : n < r ? 1 : 0;
}

function r(t) {
  return global.Buffer && "function" == typeof global.Buffer.isBuffer ? global.Buffer.isBuffer(t) : !(null == t || !t._isBuffer);
}

var n = require("util/"), i = Object.prototype.hasOwnProperty, o = Array.prototype.slice, u = "foo" === function() {}.name;

function a(t) {
  return Object.prototype.toString.call(t);
}

function c(t) {
  return !r(t) && ("function" == typeof global.ArrayBuffer && ("function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : !!t && (t instanceof DataView || !!(t.buffer && t.buffer instanceof ArrayBuffer))));
}

var f = module.exports = y, s = /\s*function\s+([^\(\s]*)\s*/;

function l(t) {
  if (n.isFunction(t)) {
    if (u) return t.name;
    var e = t.toString().match(s);
    return e && e[1];
  }
}

function p(t, e) {
  return "string" == typeof t ? t.length < e ? t : t.slice(0, e) : t;
}

function g(t) {
  if (u || !n.isFunction(t)) return n.inspect(t);
  var e = l(t);
  return "[Function" + (e ? ": " + e : "") + "]";
}

function E(t) {
  return p(g(t.actual), 128) + " " + t.operator + " " + p(g(t.expected), 128);
}

function h(t, e, r, n, i) {
  throw new f.AssertionError({
    message: r,
    actual: t,
    expected: e,
    operator: n,
    stackStartFunction: i
  });
}

function y(t, e) {
  t || h(t, !0, e, "==", f.ok);
}

function q(t, i, o, u) {
  if (t === i) return !0;
  if (r(t) && r(i)) return 0 === e(t, i);
  if (n.isDate(t) && n.isDate(i)) return t.getTime() === i.getTime();
  if (n.isRegExp(t) && n.isRegExp(i)) return t.source === i.source && t.global === i.global && t.multiline === i.multiline && t.lastIndex === i.lastIndex && t.ignoreCase === i.ignoreCase;
  if (null !== t && "object" == typeof t || null !== i && "object" == typeof i) {
    if (c(t) && c(i) && a(t) === a(i) && !(t instanceof Float32Array || t instanceof Float64Array)) return 0 === e(new Uint8Array(t.buffer), new Uint8Array(i.buffer));
    if (r(t) !== r(i)) return !1;
    var f = (u = u || {
      actual: [],
      expected: []
    }).actual.indexOf(t);
    return -1 !== f && f === u.expected.indexOf(i) || (u.actual.push(t), u.expected.push(i), 
    b(t, i, o, u));
  }
  return o ? t === i : t == i;
}

function d(t) {
  return "[object Arguments]" == Object.prototype.toString.call(t);
}

function b(t, e, r, i) {
  if (null == t || null == e) return !1;
  if (n.isPrimitive(t) || n.isPrimitive(e)) return t === e;
  if (r && Object.getPrototypeOf(t) !== Object.getPrototypeOf(e)) return !1;
  var u = d(t), a = d(e);
  if (u && !a || !u && a) return !1;
  if (u) return q(t = o.call(t), e = o.call(e), r);
  var c, f, s = O(t), l = O(e);
  if (s.length !== l.length) return !1;
  for (s.sort(), l.sort(), f = s.length - 1; f >= 0; f--) if (s[f] !== l[f]) return !1;
  for (f = s.length - 1; f >= 0; f--) if (!q(t[c = s[f]], e[c], r, i)) return !1;
  return !0;
}

function m(t, e, r) {
  q(t, e, !0) && h(t, e, r, "notDeepStrictEqual", m);
}

function v(t, e) {
  if (!t || !e) return !1;
  if ("[object RegExp]" == Object.prototype.toString.call(e)) return e.test(t);
  try {
    if (t instanceof e) return !0;
  } catch (t) {}
  return !Error.isPrototypeOf(e) && !0 === e.call({}, t);
}

function x(t) {
  var e;
  try {
    t();
  } catch (t) {
    e = t;
  }
  return e;
}

function S(t, e, r, i) {
  var o;
  if ("function" != typeof e) throw new TypeError('"block" argument must be a function');
  "string" == typeof r && (i = r, r = null), o = x(e), i = (r && r.name ? " (" + r.name + ")." : ".") + (i ? " " + i : "."), 
  t && !o && h(o, r, "Missing expected exception" + i);
  var u = "string" == typeof i, a = !t && o && !r;
  if ((!t && n.isError(o) && u && v(o, r) || a) && h(o, r, "Got unwanted exception" + i), 
  t && o && r && !v(o, r) || !t && o) throw o;
}

function w(t, e) {
  t || h(t, !0, e, "==", w);
}

f.AssertionError = function(t) {
  this.name = "AssertionError", this.actual = t.actual, this.expected = t.expected, 
  this.operator = t.operator, t.message ? (this.message = t.message, this.generatedMessage = !1) : (this.message = E(this), 
  this.generatedMessage = !0);
  var e = t.stackStartFunction || h;
  if (Error.captureStackTrace) Error.captureStackTrace(this, e); else {
    var r = new Error;
    if (r.stack) {
      var n = r.stack, i = l(e), o = n.indexOf("\n" + i);
      if (o >= 0) {
        var u = n.indexOf("\n", o + 1);
        n = n.substring(u + 1);
      }
      this.stack = n;
    }
  }
}, n.inherits(f.AssertionError, Error), f.fail = h, f.ok = y, f.equal = function(t, e, r) {
  t != e && h(t, e, r, "==", f.equal);
}, f.notEqual = function(t, e, r) {
  t == e && h(t, e, r, "!=", f.notEqual);
}, f.deepEqual = function(t, e, r) {
  q(t, e, !1) || h(t, e, r, "deepEqual", f.deepEqual);
}, f.deepStrictEqual = function(t, e, r) {
  q(t, e, !0) || h(t, e, r, "deepStrictEqual", f.deepStrictEqual);
}, f.notDeepEqual = function(t, e, r) {
  q(t, e, !1) && h(t, e, r, "notDeepEqual", f.notDeepEqual);
}, f.notDeepStrictEqual = m, f.strictEqual = function(t, e, r) {
  t !== e && h(t, e, r, "===", f.strictEqual);
}, f.notStrictEqual = function(t, e, r) {
  t === e && h(t, e, r, "!==", f.notStrictEqual);
}, f.throws = function(t, e, r) {
  S(!0, t, e, r);
}, f.doesNotThrow = function(t, e, r) {
  S(!1, t, e, r);
}, f.ifError = function(t) {
  if (t) throw t;
}, f.strict = t(w, f, {
  equal: f.strictEqual,
  deepEqual: f.deepStrictEqual,
  notEqual: f.notStrictEqual,
  notDeepEqual: f.notDeepStrictEqual
}), f.strict.strict = f.strict;

var O = Object.keys || function(t) {
  var e = [];
  for (var r in t) i.call(t, r) && e.push(r);
  return e;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"object.assign/polyfill":152,"util/":124}],122:[function(require,module,exports){
"function" == typeof Object.create ? module.exports = function(t, e) {
  t.super_ = e, t.prototype = Object.create(e.prototype, {
    constructor: {
      value: t,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  });
} : module.exports = function(t, e) {
  t.super_ = e;
  var o = function() {};
  o.prototype = e.prototype, t.prototype = new o, t.prototype.constructor = t;
};

},{}],123:[function(require,module,exports){
module.exports = function(o) {
  return o && "object" == typeof o && "function" == typeof o.copy && "function" == typeof o.fill && "function" == typeof o.readUInt8;
};

},{}],124:[function(require,module,exports){
(function (process,global){(function (){
var e = /%[sdj%]/g;

exports.format = function(t) {
  if (!b(t)) {
    for (var r = [], o = 0; o < arguments.length; o++) r.push(n(arguments[o]));
    return r.join(" ");
  }
  o = 1;
  for (var i = arguments, s = i.length, u = String(t).replace(e, (function(e) {
    if ("%%" === e) return "%";
    if (o >= s) return e;
    switch (e) {
     case "%s":
      return String(i[o++]);

     case "%d":
      return Number(i[o++]);

     case "%j":
      try {
        return JSON.stringify(i[o++]);
      } catch (e) {
        return "[Circular]";
      }

     default:
      return e;
    }
  })), c = i[o]; o < s; c = i[++o]) d(c) || !S(c) ? u += " " + c : u += " " + n(c);
  return u;
}, exports.deprecate = function(e, t) {
  if (v(global.process)) return function() {
    return exports.deprecate(e, t).apply(this, arguments);
  };
  if (!0 === process.noDeprecation) return e;
  var r = !1;
  return function() {
    if (!r) {
      if (process.throwDeprecation) throw new Error(t);
      process.traceDeprecation ? console.trace(t) : console.error(t), r = !0;
    }
    return e.apply(this, arguments);
  };
};

var t, r = {};

function n(e, t) {
  var r = {
    seen: [],
    stylize: i
  };
  return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), 
  y(t) ? r.showHidden = t : t && exports._extend(r, t), v(r.showHidden) && (r.showHidden = !1), 
  v(r.depth) && (r.depth = 2), v(r.colors) && (r.colors = !1), v(r.customInspect) && (r.customInspect = !0), 
  r.colors && (r.stylize = o), u(r, e, r.depth);
}

function o(e, t) {
  var r = n.styles[t];
  return r ? "[" + n.colors[r][0] + "m" + e + "[" + n.colors[r][1] + "m" : e;
}

function i(e, t) {
  return e;
}

function s(e) {
  var t = {};
  return e.forEach((function(e, r) {
    t[e] = !0;
  })), t;
}

function u(e, t, r) {
  if (e.customInspect && t && w(t.inspect) && t.inspect !== exports.inspect && (!t.constructor || t.constructor.prototype !== t)) {
    var n = t.inspect(r, e);
    return b(n) || (n = u(e, n, r)), n;
  }
  var o = c(e, t);
  if (o) return o;
  var i = Object.keys(t), y = s(i);
  if (e.showHidden && (i = Object.getOwnPropertyNames(t)), z(t) && (i.indexOf("message") >= 0 || i.indexOf("description") >= 0)) return p(t);
  if (0 === i.length) {
    if (w(t)) {
      var d = t.name ? ": " + t.name : "";
      return e.stylize("[Function" + d + "]", "special");
    }
    if (O(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
    if (j(t)) return e.stylize(Date.prototype.toString.call(t), "date");
    if (z(t)) return p(t);
  }
  var x, h = "", m = !1, v = [ "{", "}" ];
  (g(t) && (m = !0, v = [ "[", "]" ]), w(t)) && (h = " [Function" + (t.name ? ": " + t.name : "") + "]");
  return O(t) && (h = " " + RegExp.prototype.toString.call(t)), j(t) && (h = " " + Date.prototype.toUTCString.call(t)), 
  z(t) && (h = " " + p(t)), 0 !== i.length || m && 0 != t.length ? r < 0 ? O(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(t), 
  x = m ? l(e, t, r, y, i) : i.map((function(n) {
    return a(e, t, r, y, n, m);
  })), e.seen.pop(), f(x, h, v)) : v[0] + h + v[1];
}

function c(e, t) {
  if (v(t)) return e.stylize("undefined", "undefined");
  if (b(t)) {
    var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return e.stylize(r, "string");
  }
  return h(t) ? e.stylize("" + t, "number") : y(t) ? e.stylize("" + t, "boolean") : d(t) ? e.stylize("null", "null") : void 0;
}

function p(e) {
  return "[" + Error.prototype.toString.call(e) + "]";
}

function l(e, t, r, n, o) {
  for (var i = [], s = 0, u = t.length; s < u; ++s) R(t, String(s)) ? i.push(a(e, t, r, n, String(s), !0)) : i.push("");
  return o.forEach((function(o) {
    o.match(/^\d+$/) || i.push(a(e, t, r, n, o, !0));
  })), i;
}

function a(e, t, r, n, o, i) {
  var s, c, p;
  if ((p = Object.getOwnPropertyDescriptor(t, o) || {
    value: t[o]
  }).get ? c = p.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : p.set && (c = e.stylize("[Setter]", "special")), 
  R(n, o) || (s = "[" + o + "]"), c || (e.seen.indexOf(p.value) < 0 ? (c = d(r) ? u(e, p.value, null) : u(e, p.value, r - 1)).indexOf("\n") > -1 && (c = i ? c.split("\n").map((function(e) {
    return "  " + e;
  })).join("\n").substr(2) : "\n" + c.split("\n").map((function(e) {
    return "   " + e;
  })).join("\n")) : c = e.stylize("[Circular]", "special")), v(s)) {
    if (i && o.match(/^\d+$/)) return c;
    (s = JSON.stringify("" + o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), 
    s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), 
    s = e.stylize(s, "string"));
  }
  return s + ": " + c;
}

function f(e, t, r) {
  return e.reduce((function(e, t) {
    return t.indexOf("\n") >= 0 && 0, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }), 0) > 60 ? r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1] : r[0] + t + " " + e.join(", ") + " " + r[1];
}

function g(e) {
  return Array.isArray(e);
}

function y(e) {
  return "boolean" == typeof e;
}

function d(e) {
  return null === e;
}

function x(e) {
  return null == e;
}

function h(e) {
  return "number" == typeof e;
}

function b(e) {
  return "string" == typeof e;
}

function m(e) {
  return "symbol" == typeof e;
}

function v(e) {
  return void 0 === e;
}

function O(e) {
  return S(e) && "[object RegExp]" === D(e);
}

function S(e) {
  return "object" == typeof e && null !== e;
}

function j(e) {
  return S(e) && "[object Date]" === D(e);
}

function z(e) {
  return S(e) && ("[object Error]" === D(e) || e instanceof Error);
}

function w(e) {
  return "function" == typeof e;
}

function E(e) {
  return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e;
}

function D(e) {
  return Object.prototype.toString.call(e);
}

function N(e) {
  return e < 10 ? "0" + e.toString(10) : e.toString(10);
}

exports.debuglog = function(e) {
  if (v(t) && (t = process.env.NODE_DEBUG || ""), e = e.toUpperCase(), !r[e]) if (new RegExp("\\b" + e + "\\b", "i").test(t)) {
    var n = process.pid;
    r[e] = function() {
      var t = exports.format.apply(exports, arguments);
      console.error("%s %d: %s", e, n, t);
    };
  } else r[e] = function() {};
  return r[e];
}, exports.inspect = n, n.colors = {
  bold: [ 1, 22 ],
  italic: [ 3, 23 ],
  underline: [ 4, 24 ],
  inverse: [ 7, 27 ],
  white: [ 37, 39 ],
  grey: [ 90, 39 ],
  black: [ 30, 39 ],
  blue: [ 34, 39 ],
  cyan: [ 36, 39 ],
  green: [ 32, 39 ],
  magenta: [ 35, 39 ],
  red: [ 31, 39 ],
  yellow: [ 33, 39 ]
}, n.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red"
}, exports.isArray = g, exports.isBoolean = y, exports.isNull = d, exports.isNullOrUndefined = x, 
exports.isNumber = h, exports.isString = b, exports.isSymbol = m, exports.isUndefined = v, 
exports.isRegExp = O, exports.isObject = S, exports.isDate = j, exports.isError = z, 
exports.isFunction = w, exports.isPrimitive = E, exports.isBuffer = require("./support/isBuffer");

var A = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function J() {
  var e = new Date, t = [ N(e.getHours()), N(e.getMinutes()), N(e.getSeconds()) ].join(":");
  return [ e.getDate(), A[e.getMonth()], t ].join(" ");
}

function R(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}

exports.log = function() {
  console.log("%s - %s", J(), exports.format.apply(exports, arguments));
}, exports.inherits = require("inherits"), exports._extend = function(e, t) {
  if (!t || !S(t)) return e;
  for (var r = Object.keys(t), n = r.length; n--; ) e[r[n]] = t[r[n]];
  return e;
};

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":123,"_process":132,"inherits":122}],125:[function(require,module,exports){
(function (global){(function (){
"use strict";

var r = [ "BigInt64Array", "BigUint64Array", "Float32Array", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray" ], t = "undefined" == typeof globalThis ? global : globalThis;

module.exports = function() {
  for (var a = [], n = 0; n < r.length; n++) "function" == typeof t[r[n]] && (a[a.length] = r[n]);
  return a;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],126:[function(require,module,exports){
"use strict";

var r = require("get-intrinsic"), t = require("./"), e = t(r("String.prototype.indexOf"));

module.exports = function(i, n) {
  var o = r(i, !!n);
  return "function" == typeof o && e(i, ".prototype.") > -1 ? t(o) : o;
};

},{"./":127,"get-intrinsic":135}],127:[function(require,module,exports){
"use strict";

var e = require("function-bind"), t = require("get-intrinsic"), r = require("set-function-length"), n = t("%TypeError%"), o = t("%Function.prototype.apply%"), i = t("%Function.prototype.call%"), u = t("%Reflect.apply%", !0) || e.call(i, o), l = t("%Object.defineProperty%", !0), p = t("%Math.max%");

if (l) try {
  l({}, "a", {
    value: 1
  });
} catch (e) {
  l = null;
}

module.exports = function(t) {
  if ("function" != typeof t) throw new n("a function is required");
  var o = u(e, i, arguments);
  return r(o, 1 + p(0, t.length - (arguments.length - 1)), !0);
};

var a = function() {
  return u(e, o, arguments);
};

l ? l(module.exports, "apply", {
  value: a
}) : module.exports.apply = a;

},{"function-bind":134,"get-intrinsic":135,"set-function-length":154}],128:[function(require,module,exports){
(function (global){(function (){
var o = require("util"), n = require("assert");

function e() {
  return (new Date).getTime();
}

var r, l = Array.prototype.slice, a = {};

r = "undefined" != typeof global && global.console ? global.console : "undefined" != typeof window && window.console ? window.console : {};

for (var t = [ [ p, "log" ], [ s, "info" ], [ w, "warn" ], [ d, "error" ], [ g, "time" ], [ m, "timeEnd" ], [ y, "trace" ], [ v, "dir" ], [ b, "assert" ] ], i = 0; i < t.length; i++) {
  var c = t[i], f = c[0], u = c[1];
  r[u] || (r[u] = f);
}

function p() {}

function s() {
  r.log.apply(r, arguments);
}

function w() {
  r.log.apply(r, arguments);
}

function d() {
  r.warn.apply(r, arguments);
}

function g(o) {
  a[o] = e();
}

function m(o) {
  var n = a[o];
  if (!n) throw new Error("No such label: " + o);
  delete a[o];
  var l = e() - n;
  r.log(o + ": " + l + "ms");
}

function y() {
  var n = new Error;
  n.name = "Trace", n.message = o.format.apply(null, arguments), r.error(n.stack);
}

function v(n) {
  r.log(o.inspect(n) + "\n");
}

function b(e) {
  if (!e) {
    var r = l.call(arguments, 1);
    n.ok(!1, o.format.apply(null, r));
  }
}

module.exports = r;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"assert":121,"util":158}],129:[function(require,module,exports){
"use strict";

var e = require("has-property-descriptors")(), o = require("get-intrinsic"), n = e && o("%Object.defineProperty%", !0);

if (n) try {
  n({}, "a", {
    value: 1
  });
} catch (e) {
  n = !1;
}

var r = o("%SyntaxError%"), l = o("%TypeError%"), t = require("gopd");

module.exports = function(e, o, i) {
  if (!e || "object" != typeof e && "function" != typeof e) throw new l("`obj` must be an object or a function`");
  if ("string" != typeof o && "symbol" != typeof o) throw new l("`property` must be a string or a symbol`");
  if (arguments.length > 3 && "boolean" != typeof arguments[3] && null !== arguments[3]) throw new l("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && "boolean" != typeof arguments[4] && null !== arguments[4]) throw new l("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && "boolean" != typeof arguments[5] && null !== arguments[5]) throw new l("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && "boolean" != typeof arguments[6]) throw new l("`loose`, if provided, must be a boolean");
  var a = arguments.length > 3 ? arguments[3] : null, u = arguments.length > 4 ? arguments[4] : null, b = arguments.length > 5 ? arguments[5] : null, f = arguments.length > 6 && arguments[6], p = !!t && t(e, o);
  if (n) n(e, o, {
    configurable: null === b && p ? p.configurable : !b,
    enumerable: null === a && p ? p.enumerable : !a,
    value: i,
    writable: null === u && p ? p.writable : !u
  }); else {
    if (!f && (a || u || b)) throw new r("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
    e[o] = i;
  }
};

},{"get-intrinsic":135,"gopd":136,"has-property-descriptors":137}],130:[function(require,module,exports){
"use strict";

var e, t = "object" == typeof Reflect ? Reflect : null, n = t && "function" == typeof t.apply ? t.apply : function(e, t, n) {
  return Function.prototype.apply.call(e, t, n);
};

function r(e) {
  console && console.warn && console.warn(e);
}

e = t && "function" == typeof t.ownKeys ? t.ownKeys : Object.getOwnPropertySymbols ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : function(e) {
  return Object.getOwnPropertyNames(e);
};

var i = Number.isNaN || function(e) {
  return e != e;
};

function o() {
  o.init.call(this);
}

module.exports = o, module.exports.once = m, o.EventEmitter = o, o.prototype._events = void 0, 
o.prototype._eventsCount = 0, o.prototype._maxListeners = void 0;

var s = 10;

function u(e) {
  if ("function" != typeof e) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e);
}

function f(e) {
  return void 0 === e._maxListeners ? o.defaultMaxListeners : e._maxListeners;
}

function c(e, t, n, i) {
  var o, s, c;
  if (u(n), void 0 === (s = e._events) ? (s = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== s.newListener && (e.emit("newListener", t, n.listener ? n.listener : n), 
  s = e._events), c = s[t]), void 0 === c) c = s[t] = n, ++e._eventsCount; else if ("function" == typeof c ? c = s[t] = i ? [ n, c ] : [ c, n ] : i ? c.unshift(n) : c.push(n), 
  (o = f(e)) > 0 && c.length > o && !c.warned) {
    c.warned = !0;
    var v = new Error("Possible EventEmitter memory leak detected. " + c.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    v.name = "MaxListenersExceededWarning", v.emitter = e, v.type = t, v.count = c.length, 
    r(v);
  }
  return e;
}

function v() {
  if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 
  0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}

function l(e, t, n) {
  var r = {
    fired: !1,
    wrapFn: void 0,
    target: e,
    type: t,
    listener: n
  }, i = v.bind(r);
  return i.listener = n, r.wrapFn = i, i;
}

function p(e, t, n) {
  var r = e._events;
  if (void 0 === r) return [];
  var i = r[t];
  return void 0 === i ? [] : "function" == typeof i ? n ? [ i.listener || i ] : [ i ] : n ? d(i) : h(i, i.length);
}

function a(e) {
  var t = this._events;
  if (void 0 !== t) {
    var n = t[e];
    if ("function" == typeof n) return 1;
    if (void 0 !== n) return n.length;
  }
  return 0;
}

function h(e, t) {
  for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];
  return n;
}

function y(e, t) {
  for (;t + 1 < e.length; t++) e[t] = e[t + 1];
  e.pop();
}

function d(e) {
  for (var t = new Array(e.length), n = 0; n < t.length; ++n) t[n] = e[n].listener || e[n];
  return t;
}

function m(e, t) {
  return new Promise((function(n, r) {
    function i(n) {
      e.removeListener(t, o), r(n);
    }
    function o() {
      "function" == typeof e.removeListener && e.removeListener("error", i), n([].slice.call(arguments));
    }
    g(e, t, o, {
      once: !0
    }), "error" !== t && L(e, i, {
      once: !0
    });
  }));
}

function L(e, t, n) {
  "function" == typeof e.on && g(e, "error", t, n);
}

function g(e, t, n, r) {
  if ("function" == typeof e.on) r.once ? e.once(t, n) : e.on(t, n); else {
    if ("function" != typeof e.addEventListener) throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
    e.addEventListener(t, (function i(o) {
      r.once && e.removeEventListener(t, i), n(o);
    }));
  }
}

Object.defineProperty(o, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return s;
  },
  set: function(e) {
    if ("number" != typeof e || e < 0 || i(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
    s = e;
  }
}), o.init = function() {
  void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), 
  this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
}, o.prototype.setMaxListeners = function(e) {
  if ("number" != typeof e || e < 0 || i(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
  return this._maxListeners = e, this;
}, o.prototype.getMaxListeners = function() {
  return f(this);
}, o.prototype.emit = function(e) {
  for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);
  var i = "error" === e, o = this._events;
  if (void 0 !== o) i = i && void 0 === o.error; else if (!i) return !1;
  if (i) {
    var s;
    if (t.length > 0 && (s = t[0]), s instanceof Error) throw s;
    var u = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
    throw u.context = s, u;
  }
  var f = o[e];
  if (void 0 === f) return !1;
  if ("function" == typeof f) n(f, this, t); else {
    var c = f.length, v = h(f, c);
    for (r = 0; r < c; ++r) n(v[r], this, t);
  }
  return !0;
}, o.prototype.addListener = function(e, t) {
  return c(this, e, t, !1);
}, o.prototype.on = o.prototype.addListener, o.prototype.prependListener = function(e, t) {
  return c(this, e, t, !0);
}, o.prototype.once = function(e, t) {
  return u(t), this.on(e, l(this, e, t)), this;
}, o.prototype.prependOnceListener = function(e, t) {
  return u(t), this.prependListener(e, l(this, e, t)), this;
}, o.prototype.removeListener = function(e, t) {
  var n, r, i, o, s;
  if (u(t), void 0 === (r = this._events)) return this;
  if (void 0 === (n = r[e])) return this;
  if (n === t || n.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete r[e], 
  r.removeListener && this.emit("removeListener", e, n.listener || t)); else if ("function" != typeof n) {
    for (i = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
      s = n[o].listener, i = o;
      break;
    }
    if (i < 0) return this;
    0 === i ? n.shift() : y(n, i), 1 === n.length && (r[e] = n[0]), void 0 !== r.removeListener && this.emit("removeListener", e, s || t);
  }
  return this;
}, o.prototype.off = o.prototype.removeListener, o.prototype.removeAllListeners = function(e) {
  var t, n, r;
  if (void 0 === (n = this._events)) return this;
  if (void 0 === n.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), 
  this._eventsCount = 0) : void 0 !== n[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete n[e]), 
  this;
  if (0 === arguments.length) {
    var i, o = Object.keys(n);
    for (r = 0; r < o.length; ++r) "removeListener" !== (i = o[r]) && this.removeAllListeners(i);
    return this.removeAllListeners("removeListener"), this._events = Object.create(null), 
    this._eventsCount = 0, this;
  }
  if ("function" == typeof (t = n[e])) this.removeListener(e, t); else if (void 0 !== t) for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
  return this;
}, o.prototype.listeners = function(e) {
  return p(this, e, !0);
}, o.prototype.rawListeners = function(e) {
  return p(this, e, !1);
}, o.listenerCount = function(e, t) {
  return "function" == typeof e.listenerCount ? e.listenerCount(t) : a.call(e, t);
}, o.prototype.listenerCount = a, o.prototype.eventNames = function() {
  return this._eventsCount > 0 ? e(this._events) : [];
};

},{}],131:[function(require,module,exports){
"use strict";

var t = require("is-callable"), r = Object.prototype.toString, l = Object.prototype.hasOwnProperty, n = function(t, r, n) {
  for (var o = 0, e = t.length; o < e; o++) l.call(t, o) && (null == n ? r(t[o], o, t) : r.call(n, t[o], o, t));
}, o = function(t, r, l) {
  for (var n = 0, o = t.length; n < o; n++) null == l ? r(t.charAt(n), n, t) : r.call(l, t.charAt(n), n, t);
}, e = function(t, r, n) {
  for (var o in t) l.call(t, o) && (null == n ? r(t[o], o, t) : r.call(n, t[o], o, t));
}, a = function(l, a, c) {
  if (!t(a)) throw new TypeError("iterator must be a function");
  var i;
  arguments.length >= 3 && (i = c), "[object Array]" === r.call(l) ? n(l, a, i) : "string" == typeof l ? o(l, a, i) : e(l, a, i);
};

module.exports = a;

},{"is-callable":145}],132:[function(require,module,exports){
const e = require("events"), r = module.exports = {};

function n() {}

r.nextTick = Script.nextTick, r.title = "Frida", r.browser = !0, r.env = {}, r.argv = [], 
r.version = "", r.versions = {}, r.EventEmitter = e, r.on = n, r.addListener = n, 
r.once = n, r.off = n, r.removeListener = n, r.removeAllListeners = n, r.emit = n, 
r.binding = function(e) {
  throw new Error("process.binding is not supported");
}, r.cwd = function() {
  return "/";
}, r.chdir = function(e) {
  throw new Error("process.chdir is not supported");
}, r.umask = function() {
  return 0;
};

},{"events":130}],133:[function(require,module,exports){
"use strict";

var t = "Function.prototype.bind called on incompatible ", n = Object.prototype.toString, r = Math.max, o = "[object Function]", e = function(t, n) {
  for (var r = [], o = 0; o < t.length; o += 1) r[o] = t[o];
  for (var e = 0; e < n.length; e += 1) r[e + t.length] = n[e];
  return r;
}, i = function(t, n) {
  for (var r = [], o = n || 0, e = 0; o < t.length; o += 1, e += 1) r[e] = t[o];
  return r;
}, p = function(t, n) {
  for (var r = "", o = 0; o < t.length; o += 1) r += t[o], o + 1 < t.length && (r += n);
  return r;
};

module.exports = function(u) {
  var a = this;
  if ("function" != typeof a || n.apply(a) !== o) throw new TypeError(t + a);
  for (var c, f = i(arguments, 1), l = r(0, a.length - f.length), h = [], y = 0; y < l; y++) h[y] = "$" + y;
  if (c = Function("binder", "return function (" + p(h, ",") + "){ return binder.apply(this,arguments); }")((function() {
    if (this instanceof c) {
      var t = a.apply(this, e(f, arguments));
      return Object(t) === t ? t : this;
    }
    return a.apply(u, e(f, arguments));
  })), a.prototype) {
    var g = function() {};
    g.prototype = a.prototype, c.prototype = new g, g.prototype = null;
  }
  return c;
};

},{}],134:[function(require,module,exports){
"use strict";

var e = require("./implementation");

module.exports = Function.prototype.bind || e;

},{"./implementation":133}],135:[function(require,module,exports){
"use strict";

var r, t = SyntaxError, e = Function, o = TypeError, n = function(r) {
  try {
    return e('"use strict"; return (' + r + ").constructor;")();
  } catch (r) {}
}, a = Object.getOwnPropertyDescriptor;

if (a) try {
  a({}, "");
} catch (r) {
  a = null;
}

var y = function() {
  throw new o;
}, p = a ? function() {
  try {
    return y;
  } catch (r) {
    try {
      return a(arguments, "callee").get;
    } catch (r) {
      return y;
    }
  }
}() : y, i = require("has-symbols")(), f = require("has-proto")(), c = Object.getPrototypeOf || (f ? function(r) {
  return r.__proto__;
} : null), u = {}, l = "undefined" != typeof Uint8Array && c ? c(Uint8Array) : r, s = {
  "%AggregateError%": "undefined" == typeof AggregateError ? r : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": "undefined" == typeof ArrayBuffer ? r : ArrayBuffer,
  "%ArrayIteratorPrototype%": i && c ? c([][Symbol.iterator]()) : r,
  "%AsyncFromSyncIteratorPrototype%": r,
  "%AsyncFunction%": u,
  "%AsyncGenerator%": u,
  "%AsyncGeneratorFunction%": u,
  "%AsyncIteratorPrototype%": u,
  "%Atomics%": "undefined" == typeof Atomics ? r : Atomics,
  "%BigInt%": "undefined" == typeof BigInt ? r : BigInt,
  "%BigInt64Array%": "undefined" == typeof BigInt64Array ? r : BigInt64Array,
  "%BigUint64Array%": "undefined" == typeof BigUint64Array ? r : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": "undefined" == typeof DataView ? r : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  "%EvalError%": EvalError,
  "%Float32Array%": "undefined" == typeof Float32Array ? r : Float32Array,
  "%Float64Array%": "undefined" == typeof Float64Array ? r : Float64Array,
  "%FinalizationRegistry%": "undefined" == typeof FinalizationRegistry ? r : FinalizationRegistry,
  "%Function%": e,
  "%GeneratorFunction%": u,
  "%Int8Array%": "undefined" == typeof Int8Array ? r : Int8Array,
  "%Int16Array%": "undefined" == typeof Int16Array ? r : Int16Array,
  "%Int32Array%": "undefined" == typeof Int32Array ? r : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": i && c ? c(c([][Symbol.iterator]())) : r,
  "%JSON%": "object" == typeof JSON ? JSON : r,
  "%Map%": "undefined" == typeof Map ? r : Map,
  "%MapIteratorPrototype%": "undefined" != typeof Map && i && c ? c((new Map)[Symbol.iterator]()) : r,
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": "undefined" == typeof Promise ? r : Promise,
  "%Proxy%": "undefined" == typeof Proxy ? r : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": "undefined" == typeof Reflect ? r : Reflect,
  "%RegExp%": RegExp,
  "%Set%": "undefined" == typeof Set ? r : Set,
  "%SetIteratorPrototype%": "undefined" != typeof Set && i && c ? c((new Set)[Symbol.iterator]()) : r,
  "%SharedArrayBuffer%": "undefined" == typeof SharedArrayBuffer ? r : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": i && c ? c(""[Symbol.iterator]()) : r,
  "%Symbol%": i ? Symbol : r,
  "%SyntaxError%": t,
  "%ThrowTypeError%": p,
  "%TypedArray%": l,
  "%TypeError%": o,
  "%Uint8Array%": "undefined" == typeof Uint8Array ? r : Uint8Array,
  "%Uint8ClampedArray%": "undefined" == typeof Uint8ClampedArray ? r : Uint8ClampedArray,
  "%Uint16Array%": "undefined" == typeof Uint16Array ? r : Uint16Array,
  "%Uint32Array%": "undefined" == typeof Uint32Array ? r : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": "undefined" == typeof WeakMap ? r : WeakMap,
  "%WeakRef%": "undefined" == typeof WeakRef ? r : WeakRef,
  "%WeakSet%": "undefined" == typeof WeakSet ? r : WeakSet
};

if (c) try {
  null.error;
} catch (r) {
  var A = c(c(r));
  s["%Error.prototype%"] = A;
}

var d = function r(t) {
  var e;
  if ("%AsyncFunction%" === t) e = n("async function () {}"); else if ("%GeneratorFunction%" === t) e = n("function* () {}"); else if ("%AsyncGeneratorFunction%" === t) e = n("async function* () {}"); else if ("%AsyncGenerator%" === t) {
    var o = r("%AsyncGeneratorFunction%");
    o && (e = o.prototype);
  } else if ("%AsyncIteratorPrototype%" === t) {
    var a = r("%AsyncGenerator%");
    a && c && (e = c(a.prototype));
  }
  return s[t] = e, e;
}, P = {
  "%ArrayBufferPrototype%": [ "ArrayBuffer", "prototype" ],
  "%ArrayPrototype%": [ "Array", "prototype" ],
  "%ArrayProto_entries%": [ "Array", "prototype", "entries" ],
  "%ArrayProto_forEach%": [ "Array", "prototype", "forEach" ],
  "%ArrayProto_keys%": [ "Array", "prototype", "keys" ],
  "%ArrayProto_values%": [ "Array", "prototype", "values" ],
  "%AsyncFunctionPrototype%": [ "AsyncFunction", "prototype" ],
  "%AsyncGenerator%": [ "AsyncGeneratorFunction", "prototype" ],
  "%AsyncGeneratorPrototype%": [ "AsyncGeneratorFunction", "prototype", "prototype" ],
  "%BooleanPrototype%": [ "Boolean", "prototype" ],
  "%DataViewPrototype%": [ "DataView", "prototype" ],
  "%DatePrototype%": [ "Date", "prototype" ],
  "%ErrorPrototype%": [ "Error", "prototype" ],
  "%EvalErrorPrototype%": [ "EvalError", "prototype" ],
  "%Float32ArrayPrototype%": [ "Float32Array", "prototype" ],
  "%Float64ArrayPrototype%": [ "Float64Array", "prototype" ],
  "%FunctionPrototype%": [ "Function", "prototype" ],
  "%Generator%": [ "GeneratorFunction", "prototype" ],
  "%GeneratorPrototype%": [ "GeneratorFunction", "prototype", "prototype" ],
  "%Int8ArrayPrototype%": [ "Int8Array", "prototype" ],
  "%Int16ArrayPrototype%": [ "Int16Array", "prototype" ],
  "%Int32ArrayPrototype%": [ "Int32Array", "prototype" ],
  "%JSONParse%": [ "JSON", "parse" ],
  "%JSONStringify%": [ "JSON", "stringify" ],
  "%MapPrototype%": [ "Map", "prototype" ],
  "%NumberPrototype%": [ "Number", "prototype" ],
  "%ObjectPrototype%": [ "Object", "prototype" ],
  "%ObjProto_toString%": [ "Object", "prototype", "toString" ],
  "%ObjProto_valueOf%": [ "Object", "prototype", "valueOf" ],
  "%PromisePrototype%": [ "Promise", "prototype" ],
  "%PromiseProto_then%": [ "Promise", "prototype", "then" ],
  "%Promise_all%": [ "Promise", "all" ],
  "%Promise_reject%": [ "Promise", "reject" ],
  "%Promise_resolve%": [ "Promise", "resolve" ],
  "%RangeErrorPrototype%": [ "RangeError", "prototype" ],
  "%ReferenceErrorPrototype%": [ "ReferenceError", "prototype" ],
  "%RegExpPrototype%": [ "RegExp", "prototype" ],
  "%SetPrototype%": [ "Set", "prototype" ],
  "%SharedArrayBufferPrototype%": [ "SharedArrayBuffer", "prototype" ],
  "%StringPrototype%": [ "String", "prototype" ],
  "%SymbolPrototype%": [ "Symbol", "prototype" ],
  "%SyntaxErrorPrototype%": [ "SyntaxError", "prototype" ],
  "%TypedArrayPrototype%": [ "TypedArray", "prototype" ],
  "%TypeErrorPrototype%": [ "TypeError", "prototype" ],
  "%Uint8ArrayPrototype%": [ "Uint8Array", "prototype" ],
  "%Uint8ClampedArrayPrototype%": [ "Uint8ClampedArray", "prototype" ],
  "%Uint16ArrayPrototype%": [ "Uint16Array", "prototype" ],
  "%Uint32ArrayPrototype%": [ "Uint32Array", "prototype" ],
  "%URIErrorPrototype%": [ "URIError", "prototype" ],
  "%WeakMapPrototype%": [ "WeakMap", "prototype" ],
  "%WeakSetPrototype%": [ "WeakSet", "prototype" ]
}, g = require("function-bind"), m = require("hasown"), S = g.call(Function.call, Array.prototype.concat), E = g.call(Function.apply, Array.prototype.splice), h = g.call(Function.call, String.prototype.replace), I = g.call(Function.call, String.prototype.slice), F = g.call(Function.call, RegExp.prototype.exec), b = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, U = /\\(\\)?/g, v = function(r) {
  var e = I(r, 0, 1), o = I(r, -1);
  if ("%" === e && "%" !== o) throw new t("invalid intrinsic syntax, expected closing `%`");
  if ("%" === o && "%" !== e) throw new t("invalid intrinsic syntax, expected opening `%`");
  var n = [];
  return h(r, b, (function(r, t, e, o) {
    n[n.length] = e ? h(o, U, "$1") : t || r;
  })), n;
}, R = function(r, e) {
  var n, a = r;
  if (m(P, a) && (a = "%" + (n = P[a])[0] + "%"), m(s, a)) {
    var y = s[a];
    if (y === u && (y = d(a)), void 0 === y && !e) throw new o("intrinsic " + r + " exists, but is not available. Please file an issue!");
    return {
      alias: n,
      name: a,
      value: y
    };
  }
  throw new t("intrinsic " + r + " does not exist!");
};

module.exports = function(r, e) {
  if ("string" != typeof r || 0 === r.length) throw new o("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && "boolean" != typeof e) throw new o('"allowMissing" argument must be a boolean');
  if (null === F(/^%?[^%]*%?$/, r)) throw new t("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var n = v(r), y = n.length > 0 ? n[0] : "", p = R("%" + y + "%", e), i = p.name, f = p.value, c = !1, u = p.alias;
  u && (y = u[0], E(n, S([ 0, 1 ], u)));
  for (var l = 1, A = !0; l < n.length; l += 1) {
    var d = n[l], P = I(d, 0, 1), g = I(d, -1);
    if (('"' === P || "'" === P || "`" === P || '"' === g || "'" === g || "`" === g) && P !== g) throw new t("property names with quotes must have matching quotes");
    if ("constructor" !== d && A || (c = !0), m(s, i = "%" + (y += "." + d) + "%")) f = s[i]; else if (null != f) {
      if (!(d in f)) {
        if (!e) throw new o("base intrinsic for " + r + " exists, but the property is not available.");
        return;
      }
      if (a && l + 1 >= n.length) {
        var h = a(f, d);
        f = (A = !!h) && "get" in h && !("originalValue" in h.get) ? h.get : f[d];
      } else A = m(f, d), f = f[d];
      A && !c && (s[i] = f);
    }
  }
  return f;
};

},{"function-bind":134,"has-proto":138,"has-symbols":139,"hasown":142}],136:[function(require,module,exports){
"use strict";

var t = require("get-intrinsic"), e = t("%Object.getOwnPropertyDescriptor%", !0);

if (e) try {
  e([], "length");
} catch (t) {
  e = null;
}

module.exports = e;

},{"get-intrinsic":135}],137:[function(require,module,exports){
"use strict";

var r = require("get-intrinsic"), e = r("%Object.defineProperty%", !0), t = function() {
  if (e) try {
    return e({}, "a", {
      value: 1
    }), !0;
  } catch (r) {
    return !1;
  }
  return !1;
};

t.hasArrayLengthDefineBug = function() {
  if (!t()) return null;
  try {
    return 1 !== e([], "length", {
      value: 1
    }).length;
  } catch (r) {
    return !0;
  }
}, module.exports = t;

},{"get-intrinsic":135}],138:[function(require,module,exports){
"use strict";

var o = {
  foo: {}
}, t = Object;

module.exports = function() {
  return {
    __proto__: o
  }.foo === o.foo && !({
    __proto__: null
  } instanceof t);
};

},{}],139:[function(require,module,exports){
"use strict";

var o = "undefined" != typeof Symbol && Symbol, e = require("./shams");

module.exports = function() {
  return "function" == typeof o && ("function" == typeof Symbol && ("symbol" == typeof o("foo") && ("symbol" == typeof Symbol("bar") && e())));
};

},{"./shams":140}],140:[function(require,module,exports){
"use strict";

module.exports = function() {
  if ("function" != typeof Symbol || "function" != typeof Object.getOwnPropertySymbols) return !1;
  if ("symbol" == typeof Symbol.iterator) return !0;
  var t = {}, e = Symbol("test"), r = Object(e);
  if ("string" == typeof e) return !1;
  if ("[object Symbol]" !== Object.prototype.toString.call(e)) return !1;
  if ("[object Symbol]" !== Object.prototype.toString.call(r)) return !1;
  for (e in t[e] = 42, t) return !1;
  if ("function" == typeof Object.keys && 0 !== Object.keys(t).length) return !1;
  if ("function" == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(t).length) return !1;
  var o = Object.getOwnPropertySymbols(t);
  if (1 !== o.length || o[0] !== e) return !1;
  if (!Object.prototype.propertyIsEnumerable.call(t, e)) return !1;
  if ("function" == typeof Object.getOwnPropertyDescriptor) {
    var n = Object.getOwnPropertyDescriptor(t, e);
    if (42 !== n.value || !0 !== n.enumerable) return !1;
  }
  return !0;
};

},{}],141:[function(require,module,exports){
"use strict";

var r = require("has-symbols/shams");

module.exports = function() {
  return r() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":140}],142:[function(require,module,exports){
"use strict";

var t = Function.prototype.call, e = Object.prototype.hasOwnProperty, o = require("function-bind");

module.exports = o.call(t, e);

},{"function-bind":134}],143:[function(require,module,exports){
"function" == typeof Object.create ? module.exports = function(t, e) {
  e && (t.super_ = e, t.prototype = Object.create(e.prototype, {
    constructor: {
      value: t,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : module.exports = function(t, e) {
  if (e) {
    t.super_ = e;
    var o = function() {};
    o.prototype = e.prototype, t.prototype = new o, t.prototype.constructor = t;
  }
};

},{}],144:[function(require,module,exports){
"use strict";

var t = require("has-tostringtag/shams")(), e = require("call-bind/callBound"), n = e("Object.prototype.toString"), r = function(e) {
  return !(t && e && "object" == typeof e && Symbol.toStringTag in e) && "[object Arguments]" === n(e);
}, o = function(t) {
  return !!r(t) || null !== t && "object" == typeof t && "number" == typeof t.length && t.length >= 0 && "[object Array]" !== n(t) && "[object Function]" === n(t.callee);
}, u = function() {
  return r(arguments);
}();

r.isLegacyArguments = o, module.exports = u ? r : o;

},{"call-bind/callBound":126,"has-tostringtag/shams":141}],145:[function(require,module,exports){
"use strict";

var t, e, n = Function.prototype.toString, o = "object" == typeof Reflect && null !== Reflect && Reflect.apply;

if ("function" == typeof o && "function" == typeof Object.defineProperty) try {
  t = Object.defineProperty({}, "length", {
    get: function() {
      throw e;
    }
  }), e = {}, o((function() {
    throw 42;
  }), null, t);
} catch (t) {
  t !== e && (o = null);
} else o = null;

var r = /^\s*class\b/, c = function(t) {
  try {
    var e = n.call(t);
    return r.test(e);
  } catch (t) {
    return !1;
  }
}, l = function(t) {
  try {
    return !c(t) && (n.call(t), !0);
  } catch (t) {
    return !1;
  }
}, u = Object.prototype.toString, f = "[object Object]", i = "[object Function]", a = "[object GeneratorFunction]", y = "[object HTMLAllCollection]", b = "[object HTML document.all class]", p = "[object HTMLCollection]", j = "function" == typeof Symbol && !!Symbol.toStringTag, s = !(0 in [ ,  ]), d = function() {
  return !1;
};

if ("object" == typeof document) {
  var h = document.all;
  u.call(h) === u.call(document.all) && (d = function(t) {
    if ((s || !t) && (void 0 === t || "object" == typeof t)) try {
      var e = u.call(t);
      return (e === y || e === b || e === p || e === f) && null == t("");
    } catch (t) {}
    return !1;
  });
}

module.exports = o ? function(n) {
  if (d(n)) return !0;
  if (!n) return !1;
  if ("function" != typeof n && "object" != typeof n) return !1;
  try {
    o(n, null, t);
  } catch (t) {
    if (t !== e) return !1;
  }
  return !c(n) && l(n);
} : function(t) {
  if (d(t)) return !0;
  if (!t) return !1;
  if ("function" != typeof t && "object" != typeof t) return !1;
  if (j) return l(t);
  if (c(t)) return !1;
  var e = u.call(t);
  return !(e !== i && e !== a && !/^\[object HTML/.test(e)) && l(t);
};

},{}],146:[function(require,module,exports){
"use strict";

var t, r = Object.prototype.toString, n = Function.prototype.toString, e = /^\s*(?:function)?\*/, o = require("has-tostringtag/shams")(), i = Object.getPrototypeOf, u = function() {
  if (!o) return !1;
  try {
    return Function("return function*() {}")();
  } catch (t) {}
};

module.exports = function(c) {
  if ("function" != typeof c) return !1;
  if (e.test(n.call(c))) return !0;
  if (!o) return "[object GeneratorFunction]" === r.call(c);
  if (!i) return !1;
  if (void 0 === t) {
    var f = u();
    t = !!f && i(f);
  }
  return i(c) === t;
};

},{"has-tostringtag/shams":141}],147:[function(require,module,exports){
"use strict";

var r = require("which-typed-array");

module.exports = function(e) {
  return !!r(e);
};

},{"which-typed-array":159}],148:[function(require,module,exports){
"use strict";

var t;

if (!Object.keys) {
  var r = Object.prototype.hasOwnProperty, e = Object.prototype.toString, o = require("./isArguments"), n = Object.prototype.propertyIsEnumerable, l = !n.call({
    toString: null
  }, "toString"), c = n.call((function() {}), "prototype"), i = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ], a = function(t) {
    var r = t.constructor;
    return r && r.prototype === t;
  }, f = {
    $applicationCache: !0,
    $console: !0,
    $external: !0,
    $frame: !0,
    $frameElement: !0,
    $frames: !0,
    $innerHeight: !0,
    $innerWidth: !0,
    $onmozfullscreenchange: !0,
    $onmozfullscreenerror: !0,
    $outerHeight: !0,
    $outerWidth: !0,
    $pageXOffset: !0,
    $pageYOffset: !0,
    $parent: !0,
    $scrollLeft: !0,
    $scrollTop: !0,
    $scrollX: !0,
    $scrollY: !0,
    $self: !0,
    $webkitIndexedDB: !0,
    $webkitStorageInfo: !0,
    $window: !0
  }, u = function() {
    if ("undefined" == typeof window) return !1;
    for (var t in window) try {
      if (!f["$" + t] && r.call(window, t) && null !== window[t] && "object" == typeof window[t]) try {
        a(window[t]);
      } catch (t) {
        return !0;
      }
    } catch (t) {
      return !0;
    }
    return !1;
  }(), p = function(t) {
    if ("undefined" == typeof window || !u) return a(t);
    try {
      return a(t);
    } catch (t) {
      return !1;
    }
  };
  t = function(t) {
    var n = null !== t && "object" == typeof t, a = "[object Function]" === e.call(t), f = o(t), u = n && "[object String]" === e.call(t), s = [];
    if (!n && !a && !f) throw new TypeError("Object.keys called on a non-object");
    var $ = c && a;
    if (u && t.length > 0 && !r.call(t, 0)) for (var w = 0; w < t.length; ++w) s.push(String(w));
    if (f && t.length > 0) for (var g = 0; g < t.length; ++g) s.push(String(g)); else for (var h in t) $ && "prototype" === h || !r.call(t, h) || s.push(String(h));
    if (l) for (var y = p(t), d = 0; d < i.length; ++d) y && "constructor" === i[d] || !r.call(t, i[d]) || s.push(i[d]);
    return s;
  };
}

module.exports = t;

},{"./isArguments":150}],149:[function(require,module,exports){
"use strict";

var e = Array.prototype.slice, t = require("./isArguments"), r = Object.keys, n = r ? function(e) {
  return r(e);
} : require("./implementation"), s = Object.keys;

n.shim = function() {
  if (Object.keys) {
    var r = function() {
      var e = Object.keys(arguments);
      return e && e.length === arguments.length;
    }(1, 2);
    r || (Object.keys = function(r) {
      return t(r) ? s(e.call(r)) : s(r);
    });
  } else Object.keys = n;
  return Object.keys || n;
}, module.exports = n;

},{"./implementation":148,"./isArguments":150}],150:[function(require,module,exports){
"use strict";

var t = Object.prototype.toString;

module.exports = function(e) {
  var o = t.call(e), r = "[object Arguments]" === o;
  return r || (r = "[object Array]" !== o && null !== e && "object" == typeof e && "number" == typeof e.length && e.length >= 0 && "[object Function]" === t.call(e.callee)), 
  r;
};

},{}],151:[function(require,module,exports){
"use strict";

var r = require("object-keys"), e = require("has-symbols/shams")(), t = require("call-bind/callBound"), o = Object, a = t("Array.prototype.push"), l = t("Object.prototype.propertyIsEnumerable"), n = e ? Object.getOwnPropertySymbols : null;

module.exports = function(t, s) {
  if (null == t) throw new TypeError("target must be an object");
  var u = o(t);
  if (1 === arguments.length) return u;
  for (var b = 1; b < arguments.length; ++b) {
    var p = o(arguments[b]), y = r(p), c = e && (Object.getOwnPropertySymbols || n);
    if (c) for (var i = c(p), v = 0; v < i.length; ++v) {
      var f = i[v];
      l(p, f) && a(y, f);
    }
    for (var h = 0; h < y.length; ++h) {
      var g = y[h];
      if (l(p, g)) {
        var m = p[g];
        u[g] = m;
      }
    }
  }
  return u;
};

},{"call-bind/callBound":126,"has-symbols/shams":140,"object-keys":149}],152:[function(require,module,exports){
"use strict";

var t = require("./implementation"), e = function() {
  if (!Object.assign) return !1;
  for (var t = "abcdefghijklmnopqrst", e = t.split(""), n = {}, r = 0; r < e.length; ++r) n[e[r]] = e[r];
  var s = Object.assign({}, n), i = "";
  for (var c in s) i += c;
  return t !== i;
}, n = function() {
  if (!Object.assign || !Object.preventExtensions) return !1;
  var t = Object.preventExtensions({
    1: 2
  });
  try {
    Object.assign(t, "xy");
  } catch (e) {
    return "y" === t[1];
  }
  return !1;
};

module.exports = function() {
  return Object.assign ? e() || n() ? t : Object.assign : t;
};

},{"./implementation":151}],153:[function(require,module,exports){
var t, e, n = module.exports = {};

function r() {
  throw new Error("setTimeout has not been defined");
}

function o() {
  throw new Error("clearTimeout has not been defined");
}

function i(e) {
  if (t === setTimeout) return setTimeout(e, 0);
  if ((t === r || !t) && setTimeout) return t = setTimeout, setTimeout(e, 0);
  try {
    return t(e, 0);
  } catch (n) {
    try {
      return t.call(null, e, 0);
    } catch (n) {
      return t.call(this, e, 0);
    }
  }
}

function u(t) {
  if (e === clearTimeout) return clearTimeout(t);
  if ((e === o || !e) && clearTimeout) return e = clearTimeout, clearTimeout(t);
  try {
    return e(t);
  } catch (n) {
    try {
      return e.call(null, t);
    } catch (n) {
      return e.call(this, t);
    }
  }
}

!function() {
  try {
    t = "function" == typeof setTimeout ? setTimeout : r;
  } catch (e) {
    t = r;
  }
  try {
    e = "function" == typeof clearTimeout ? clearTimeout : o;
  } catch (t) {
    e = o;
  }
}();

var c, s = [], l = !1, a = -1;

function f() {
  l && c && (l = !1, c.length ? s = c.concat(s) : a = -1, s.length && h());
}

function h() {
  if (!l) {
    var t = i(f);
    l = !0;
    for (var e = s.length; e; ) {
      for (c = s, s = []; ++a < e; ) c && c[a].run();
      a = -1, e = s.length;
    }
    c = null, l = !1, u(t);
  }
}

function m(t, e) {
  this.fun = t, this.array = e;
}

function p() {}

n.nextTick = function(t) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
  s.push(new m(t, e)), 1 !== s.length || l || i(h);
}, m.prototype.run = function() {
  this.fun.apply(null, this.array);
}, n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.version = "", 
n.versions = {}, n.on = p, n.addListener = p, n.once = p, n.off = p, n.removeListener = p, 
n.removeAllListeners = p, n.emit = p, n.prependListener = p, n.prependOnceListener = p, 
n.listeners = function(t) {
  return [];
}, n.binding = function(t) {
  throw new Error("process.binding is not supported");
}, n.cwd = function() {
  return "/";
}, n.chdir = function(t) {
  throw new Error("process.chdir is not supported");
}, n.umask = function() {
  return 0;
};

},{}],154:[function(require,module,exports){
"use strict";

var e = require("get-intrinsic"), r = require("define-data-property"), t = require("has-property-descriptors")(), i = require("gopd"), n = e("%TypeError%"), o = e("%Math.floor%");

module.exports = function(e, u) {
  if ("function" != typeof e) throw new n("`fn` is not a function");
  if ("number" != typeof u || u < 0 || u > 4294967295 || o(u) !== u) throw new n("`length` must be a positive 32-bit integer");
  var f = arguments.length > 2 && !!arguments[2], a = !0, p = !0;
  if ("length" in e && i) {
    var g = i(e, "length");
    g && !g.configurable && (a = !1), g && !g.writable && (p = !1);
  }
  return (a || p || !f) && (t ? r(e, "length", u, !0, !0) : r(e, "length", u)), e;
};

},{"define-data-property":129,"get-intrinsic":135,"gopd":136,"has-property-descriptors":137}],155:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var e = require("process/browser.js").nextTick, t = Function.prototype.apply, o = Array.prototype.slice, i = {}, n = 0;

function r(e, t) {
  this._id = e, this._clearFn = t;
}

exports.setTimeout = function() {
  return new r(t.call(setTimeout, window, arguments), clearTimeout);
}, exports.setInterval = function() {
  return new r(t.call(setInterval, window, arguments), clearInterval);
}, exports.clearTimeout = exports.clearInterval = function(e) {
  e.close();
}, r.prototype.unref = r.prototype.ref = function() {}, r.prototype.close = function() {
  this._clearFn.call(window, this._id);
}, exports.enroll = function(e, t) {
  clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
}, exports.unenroll = function(e) {
  clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
}, exports._unrefActive = exports.active = function(e) {
  clearTimeout(e._idleTimeoutId);
  var t = e._idleTimeout;
  t >= 0 && (e._idleTimeoutId = setTimeout((function() {
    e._onTimeout && e._onTimeout();
  }), t));
}, exports.setImmediate = "function" == typeof setImmediate ? setImmediate : function(t) {
  var r = n++, l = !(arguments.length < 2) && o.call(arguments, 1);
  return i[r] = !0, e((function() {
    i[r] && (l ? t.apply(null, l) : t.call(null), exports.clearImmediate(r));
  })), r;
}, exports.clearImmediate = "function" == typeof clearImmediate ? clearImmediate : function(e) {
  delete i[e];
};

}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)

},{"process/browser.js":153,"timers":155}],156:[function(require,module,exports){
module.exports = function(o) {
  return o && "object" == typeof o && "function" == typeof o.copy && "function" == typeof o.fill && "function" == typeof o.readUInt8;
};

},{}],157:[function(require,module,exports){
"use strict";

var r = require("is-arguments"), e = require("is-generator-function"), t = require("which-typed-array"), n = require("is-typed-array");

function o(r) {
  return r.call.bind(r);
}

var i = "undefined" != typeof BigInt, u = "undefined" != typeof Symbol, f = o(Object.prototype.toString), a = o(Number.prototype.valueOf), s = o(String.prototype.valueOf), p = o(Boolean.prototype.valueOf);

if (i) var c = o(BigInt.prototype.valueOf);

if (u) var y = o(Symbol.prototype.valueOf);

function d(r, e) {
  if ("object" != typeof r) return !1;
  try {
    return e(r), !0;
  } catch (r) {
    return !1;
  }
}

function A(r) {
  return "undefined" != typeof Promise && r instanceof Promise || null !== r && "object" == typeof r && "function" == typeof r.then && "function" == typeof r.catch;
}

function x(r) {
  return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(r) : n(r) || E(r);
}

function b(r) {
  return "Uint8Array" === t(r);
}

function w(r) {
  return "Uint8ClampedArray" === t(r);
}

function l(r) {
  return "Uint16Array" === t(r);
}

function g(r) {
  return "Uint32Array" === t(r);
}

function B(r) {
  return "Int8Array" === t(r);
}

function j(r) {
  return "Int16Array" === t(r);
}

function k(r) {
  return "Int32Array" === t(r);
}

function S(r) {
  return "Float32Array" === t(r);
}

function m(r) {
  return "Float64Array" === t(r);
}

function M(r) {
  return "BigInt64Array" === t(r);
}

function v(r) {
  return "BigUint64Array" === t(r);
}

function I(r) {
  return "[object Map]" === f(r);
}

function O(r) {
  return "undefined" != typeof Map && (I.working ? I(r) : r instanceof Map);
}

function W(r) {
  return "[object Set]" === f(r);
}

function h(r) {
  return "undefined" != typeof Set && (W.working ? W(r) : r instanceof Set);
}

function U(r) {
  return "[object WeakMap]" === f(r);
}

function V(r) {
  return "undefined" != typeof WeakMap && (U.working ? U(r) : r instanceof WeakMap);
}

function F(r) {
  return "[object WeakSet]" === f(r);
}

function D(r) {
  return F(r);
}

function P(r) {
  return "[object ArrayBuffer]" === f(r);
}

function q(r) {
  return "undefined" != typeof ArrayBuffer && (P.working ? P(r) : r instanceof ArrayBuffer);
}

function C(r) {
  return "[object DataView]" === f(r);
}

function E(r) {
  return "undefined" != typeof DataView && (C.working ? C(r) : r instanceof DataView);
}

exports.isArgumentsObject = r, exports.isGeneratorFunction = e, exports.isTypedArray = n, 
exports.isPromise = A, exports.isArrayBufferView = x, exports.isUint8Array = b, 
exports.isUint8ClampedArray = w, exports.isUint16Array = l, exports.isUint32Array = g, 
exports.isInt8Array = B, exports.isInt16Array = j, exports.isInt32Array = k, exports.isFloat32Array = S, 
exports.isFloat64Array = m, exports.isBigInt64Array = M, exports.isBigUint64Array = v, 
I.working = "undefined" != typeof Map && I(new Map), exports.isMap = O, W.working = "undefined" != typeof Set && W(new Set), 
exports.isSet = h, U.working = "undefined" != typeof WeakMap && U(new WeakMap), 
exports.isWeakMap = V, F.working = "undefined" != typeof WeakSet && F(new WeakSet), 
exports.isWeakSet = D, P.working = "undefined" != typeof ArrayBuffer && P(new ArrayBuffer), 
exports.isArrayBuffer = q, C.working = "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView && C(new DataView(new ArrayBuffer(1), 0, 1)), 
exports.isDataView = E;

var G = "undefined" != typeof SharedArrayBuffer ? SharedArrayBuffer : void 0;

function N(r) {
  return "[object SharedArrayBuffer]" === f(r);
}

function T(r) {
  return void 0 !== G && (void 0 === N.working && (N.working = N(new G)), N.working ? N(r) : r instanceof G);
}

function z(r) {
  return "[object AsyncFunction]" === f(r);
}

function H(r) {
  return "[object Map Iterator]" === f(r);
}

function J(r) {
  return "[object Set Iterator]" === f(r);
}

function K(r) {
  return "[object Generator]" === f(r);
}

function L(r) {
  return "[object WebAssembly.Module]" === f(r);
}

function Q(r) {
  return d(r, a);
}

function R(r) {
  return d(r, s);
}

function X(r) {
  return d(r, p);
}

function Y(r) {
  return i && d(r, c);
}

function Z(r) {
  return u && d(r, y);
}

function $(r) {
  return Q(r) || R(r) || X(r) || Y(r) || Z(r);
}

function _(r) {
  return "undefined" != typeof Uint8Array && (q(r) || T(r));
}

exports.isSharedArrayBuffer = T, exports.isAsyncFunction = z, exports.isMapIterator = H, 
exports.isSetIterator = J, exports.isGeneratorObject = K, exports.isWebAssemblyCompiledModule = L, 
exports.isNumberObject = Q, exports.isStringObject = R, exports.isBooleanObject = X, 
exports.isBigIntObject = Y, exports.isSymbolObject = Z, exports.isBoxedPrimitive = $, 
exports.isAnyArrayBuffer = _, [ "isProxy", "isExternal", "isModuleNamespaceObject" ].forEach((function(r) {
  Object.defineProperty(exports, r, {
    enumerable: !1,
    value: function() {
      throw new Error(r + " is not supported in userland");
    }
  });
}));

},{"is-arguments":144,"is-generator-function":146,"is-typed-array":147,"which-typed-array":159}],158:[function(require,module,exports){
(function (process){(function (){
var e = Object.getOwnPropertyDescriptors || function(e) {
  for (var t = Object.keys(e), r = {}, n = 0; n < t.length; n++) r[t[n]] = Object.getOwnPropertyDescriptor(e, t[n]);
  return r;
}, t = /%[sdj%]/g;

exports.format = function(e) {
  if (!v(e)) {
    for (var r = [], n = 0; n < arguments.length; n++) r.push(i(arguments[n]));
    return r.join(" ");
  }
  n = 1;
  for (var o = arguments, s = o.length, u = String(e).replace(t, (function(e) {
    if ("%%" === e) return "%";
    if (n >= s) return e;
    switch (e) {
     case "%s":
      return String(o[n++]);

     case "%d":
      return Number(o[n++]);

     case "%j":
      try {
        return JSON.stringify(o[n++]);
      } catch (e) {
        return "[Circular]";
      }

     default:
      return e;
    }
  })), p = o[n]; n < s; p = o[++n]) b(p) || !E(p) ? u += " " + p : u += " " + i(p);
  return u;
}, exports.deprecate = function(e, t) {
  if ("undefined" != typeof process && !0 === process.noDeprecation) return e;
  if ("undefined" == typeof process) return function() {
    return exports.deprecate(e, t).apply(this, arguments);
  };
  var r = !1;
  return function() {
    if (!r) {
      if (process.throwDeprecation) throw new Error(t);
      process.traceDeprecation ? console.trace(t) : console.error(t), r = !0;
    }
    return e.apply(this, arguments);
  };
};

var r = {}, n = /^$/;

if (process.env.NODE_DEBUG) {
  var o = process.env.NODE_DEBUG;
  o = o.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), 
  n = new RegExp("^" + o + "$", "i");
}

function i(e, t) {
  var r = {
    seen: [],
    stylize: u
  };
  return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), 
  h(t) ? r.showHidden = t : t && exports._extend(r, t), j(r.showHidden) && (r.showHidden = !1), 
  j(r.depth) && (r.depth = 2), j(r.colors) && (r.colors = !1), j(r.customInspect) && (r.customInspect = !0), 
  r.colors && (r.stylize = s), c(r, e, r.depth);
}

function s(e, t) {
  var r = i.styles[t];
  return r ? "[" + i.colors[r][0] + "m" + e + "[" + i.colors[r][1] + "m" : e;
}

function u(e, t) {
  return e;
}

function p(e) {
  var t = {};
  return e.forEach((function(e, r) {
    t[e] = !0;
  })), t;
}

function c(e, t, r) {
  if (e.customInspect && t && D(t.inspect) && t.inspect !== exports.inspect && (!t.constructor || t.constructor.prototype !== t)) {
    var n = t.inspect(r, e);
    return v(n) || (n = c(e, n, r)), n;
  }
  var o = l(e, t);
  if (o) return o;
  var i = Object.keys(t), s = p(i);
  if (e.showHidden && (i = Object.getOwnPropertyNames(t)), z(t) && (i.indexOf("message") >= 0 || i.indexOf("description") >= 0)) return f(t);
  if (0 === i.length) {
    if (D(t)) {
      var u = t.name ? ": " + t.name : "";
      return e.stylize("[Function" + u + "]", "special");
    }
    if (w(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
    if (S(t)) return e.stylize(Date.prototype.toString.call(t), "date");
    if (z(t)) return f(t);
  }
  var h, b = "", m = !1, x = [ "{", "}" ];
  (d(t) && (m = !0, x = [ "[", "]" ]), D(t)) && (b = " [Function" + (t.name ? ": " + t.name : "") + "]");
  return w(t) && (b = " " + RegExp.prototype.toString.call(t)), S(t) && (b = " " + Date.prototype.toUTCString.call(t)), 
  z(t) && (b = " " + f(t)), 0 !== i.length || m && 0 != t.length ? r < 0 ? w(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(t), 
  h = m ? a(e, t, r, s, i) : i.map((function(n) {
    return y(e, t, r, s, n, m);
  })), e.seen.pop(), g(h, b, x)) : x[0] + b + x[1];
}

function l(e, t) {
  if (j(t)) return e.stylize("undefined", "undefined");
  if (v(t)) {
    var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return e.stylize(r, "string");
  }
  return x(t) ? e.stylize("" + t, "number") : h(t) ? e.stylize("" + t, "boolean") : b(t) ? e.stylize("null", "null") : void 0;
}

function f(e) {
  return "[" + Error.prototype.toString.call(e) + "]";
}

function a(e, t, r, n, o) {
  for (var i = [], s = 0, u = t.length; s < u; ++s) k(t, String(s)) ? i.push(y(e, t, r, n, String(s), !0)) : i.push("");
  return o.forEach((function(o) {
    o.match(/^\d+$/) || i.push(y(e, t, r, n, o, !0));
  })), i;
}

function y(e, t, r, n, o, i) {
  var s, u, p;
  if ((p = Object.getOwnPropertyDescriptor(t, o) || {
    value: t[o]
  }).get ? u = p.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : p.set && (u = e.stylize("[Setter]", "special")), 
  k(n, o) || (s = "[" + o + "]"), u || (e.seen.indexOf(p.value) < 0 ? (u = b(r) ? c(e, p.value, null) : c(e, p.value, r - 1)).indexOf("\n") > -1 && (u = i ? u.split("\n").map((function(e) {
    return "  " + e;
  })).join("\n").slice(2) : "\n" + u.split("\n").map((function(e) {
    return "   " + e;
  })).join("\n")) : u = e.stylize("[Circular]", "special")), j(s)) {
    if (i && o.match(/^\d+$/)) return u;
    (s = JSON.stringify("" + o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.slice(1, -1), 
    s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), 
    s = e.stylize(s, "string"));
  }
  return s + ": " + u;
}

function g(e, t, r) {
  return e.reduce((function(e, t) {
    return t.indexOf("\n") >= 0 && 0, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }), 0) > 60 ? r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1] : r[0] + t + " " + e.join(", ") + " " + r[1];
}

function d(e) {
  return Array.isArray(e);
}

function h(e) {
  return "boolean" == typeof e;
}

function b(e) {
  return null === e;
}

function m(e) {
  return null == e;
}

function x(e) {
  return "number" == typeof e;
}

function v(e) {
  return "string" == typeof e;
}

function O(e) {
  return "symbol" == typeof e;
}

function j(e) {
  return void 0 === e;
}

function w(e) {
  return E(e) && "[object RegExp]" === N(e);
}

function E(e) {
  return "object" == typeof e && null !== e;
}

function S(e) {
  return E(e) && "[object Date]" === N(e);
}

function z(e) {
  return E(e) && ("[object Error]" === N(e) || e instanceof Error);
}

function D(e) {
  return "function" == typeof e;
}

function P(e) {
  return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e;
}

function N(e) {
  return Object.prototype.toString.call(e);
}

function T(e) {
  return e < 10 ? "0" + e.toString(10) : e.toString(10);
}

exports.debuglog = function(e) {
  if (e = e.toUpperCase(), !r[e]) if (n.test(e)) {
    var t = process.pid;
    r[e] = function() {
      var r = exports.format.apply(exports, arguments);
      console.error("%s %d: %s", e, t, r);
    };
  } else r[e] = function() {};
  return r[e];
}, exports.inspect = i, i.colors = {
  bold: [ 1, 22 ],
  italic: [ 3, 23 ],
  underline: [ 4, 24 ],
  inverse: [ 7, 27 ],
  white: [ 37, 39 ],
  grey: [ 90, 39 ],
  black: [ 30, 39 ],
  blue: [ 34, 39 ],
  cyan: [ 36, 39 ],
  green: [ 32, 39 ],
  magenta: [ 35, 39 ],
  red: [ 31, 39 ],
  yellow: [ 33, 39 ]
}, i.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red"
}, exports.types = require("./support/types"), exports.isArray = d, exports.isBoolean = h, 
exports.isNull = b, exports.isNullOrUndefined = m, exports.isNumber = x, exports.isString = v, 
exports.isSymbol = O, exports.isUndefined = j, exports.isRegExp = w, exports.types.isRegExp = w, 
exports.isObject = E, exports.isDate = S, exports.types.isDate = S, exports.isError = z, 
exports.types.isNativeError = z, exports.isFunction = D, exports.isPrimitive = P, 
exports.isBuffer = require("./support/isBuffer");

var $ = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function F() {
  var e = new Date, t = [ T(e.getHours()), T(e.getMinutes()), T(e.getSeconds()) ].join(":");
  return [ e.getDate(), $[e.getMonth()], t ].join(" ");
}

function k(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}

exports.log = function() {
  console.log("%s - %s", F(), exports.format.apply(exports, arguments));
}, exports.inherits = require("inherits"), exports._extend = function(e, t) {
  if (!t || !E(t)) return e;
  for (var r = Object.keys(t), n = r.length; n--; ) e[r[n]] = t[r[n]];
  return e;
};

var A = "undefined" != typeof Symbol ? Symbol("util.promisify.custom") : void 0;

function R(e, t) {
  if (!e) {
    var r = new Error("Promise was rejected with a falsy value");
    r.reason = e, e = r;
  }
  return t(e);
}

function U(t) {
  if ("function" != typeof t) throw new TypeError('The "original" argument must be of type Function');
  function r() {
    for (var e = [], r = 0; r < arguments.length; r++) e.push(arguments[r]);
    var n = e.pop();
    if ("function" != typeof n) throw new TypeError("The last argument must be of type Function");
    var o = this, i = function() {
      return n.apply(o, arguments);
    };
    t.apply(this, e).then((function(e) {
      process.nextTick(i.bind(null, null, e));
    }), (function(e) {
      process.nextTick(R.bind(null, e, i));
    }));
  }
  return Object.setPrototypeOf(r, Object.getPrototypeOf(t)), Object.defineProperties(r, e(t)), 
  r;
}

exports.promisify = function(t) {
  if ("function" != typeof t) throw new TypeError('The "original" argument must be of type Function');
  if (A && t[A]) {
    var r;
    if ("function" != typeof (r = t[A])) throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    return Object.defineProperty(r, A, {
      value: r,
      enumerable: !1,
      writable: !1,
      configurable: !0
    }), r;
  }
  function r() {
    for (var e, r, n = new Promise((function(t, n) {
      e = t, r = n;
    })), o = [], i = 0; i < arguments.length; i++) o.push(arguments[i]);
    o.push((function(t, n) {
      t ? r(t) : e(n);
    }));
    try {
      t.apply(this, o);
    } catch (e) {
      r(e);
    }
    return n;
  }
  return Object.setPrototypeOf(r, Object.getPrototypeOf(t)), A && Object.defineProperty(r, A, {
    value: r,
    enumerable: !1,
    writable: !1,
    configurable: !0
  }), Object.defineProperties(r, e(t));
}, exports.promisify.custom = A, exports.callbackify = U;

}).call(this)}).call(this,require('_process'))

},{"./support/isBuffer":156,"./support/types":157,"_process":132,"inherits":143}],159:[function(require,module,exports){
(function (global){(function (){
"use strict";

var r = require("for-each"), t = require("available-typed-arrays"), e = require("call-bind"), n = require("call-bind/callBound"), i = require("gopd"), o = n("Object.prototype.toString"), a = require("has-tostringtag/shams")(), u = "undefined" == typeof globalThis ? global : globalThis, l = t(), c = n("String.prototype.slice"), f = Object.getPrototypeOf, g = n("Array.prototype.indexOf", !0) || function(r, t) {
  for (var e = 0; e < r.length; e += 1) if (r[e] === t) return e;
  return -1;
}, y = {
  __proto__: null
};

r(l, a && i && f ? function(r) {
  var t = new u[r];
  if (Symbol.toStringTag in t) {
    var n = f(t), o = i(n, Symbol.toStringTag);
    if (!o) {
      var a = f(n);
      o = i(a, Symbol.toStringTag);
    }
    y["$" + r] = e(o.get);
  }
} : function(r) {
  var t = new u[r], n = t.slice || t.set;
  n && (y["$" + r] = e(n));
});

var b = function(t) {
  var e = !1;
  return r(y, (function(r, n) {
    if (!e) try {
      "$" + r(t) === n && (e = c(n, 1));
    } catch (r) {}
  })), e;
}, p = function(t) {
  var e = !1;
  return r(y, (function(r, n) {
    if (!e) try {
      r(t), e = c(n, 1);
    } catch (r) {}
  })), e;
};

module.exports = function(r) {
  if (!r || "object" != typeof r) return !1;
  if (!a) {
    var t = c(o(r), 8, -1);
    return g(l, t) > -1 ? t : "Object" === t && p(r);
  }
  return i ? b(r) : null;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"available-typed-arrays":125,"call-bind":127,"call-bind/callBound":126,"for-each":131,"gopd":136,"has-tostringtag/shams":141}]},{},[107])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZ2VudC9KYXZhL0NvbnRleHQudHMiLCJhZ2VudC9KYXZhL0phdmFVdGlsLnRzIiwiYWdlbnQvSmF2YS9UaGVhZHMudHMiLCJhZ2VudC9KYXZhL2hvb2tzL2hvb2tfTG9hZExpYnJhcnkudHMiLCJhZ2VudC9KYXZhL2hvb2tzL2luY2x1ZGUudHMiLCJhZ2VudC9KYXZhL2luY2x1ZGUudHMiLCJhZ2VudC9hbmRyb2lkL0ludGVyZmFjZS9hcnQvU2l6ZU9mQ2xhc3MudHMiLCJhZ2VudC9hbmRyb2lkL0ludGVyZmFjZS9hcnQvaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvSW50ZXJmYWNlL2FydC9taXJyb3IvSGVhcFJlZmVyZW5jZS50cyIsImFnZW50L2FuZHJvaWQvSW50ZXJmYWNlL2FydC9taXJyb3IvSUFydE1ldGhvZC50cyIsImFnZW50L2FuZHJvaWQvSW50ZXJmYWNlL2FydC9taXJyb3IvaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvSW50ZXJmYWNlL2luY2x1ZGUudHMiLCJhZ2VudC9hbmRyb2lkL0pTSGFuZGxlLnRzIiwiYWdlbnQvYW5kcm9pZC9PYmplY3QudHMiLCJhZ2VudC9hbmRyb2lkL1RyYWNlTWFuYWdlci50cyIsImFnZW50L2FuZHJvaWQvVXRpbHMvQXJ0TWV0aG9kSGVscGVyLnRzIiwiYWdlbnQvYW5kcm9pZC9VdGlscy9DZmdBbmFseXplci50cyIsImFnZW50L2FuZHJvaWQvVXRpbHMvRnVuY3Rpb25Cb3VuZGFyeS50cyIsImFnZW50L2FuZHJvaWQvVXRpbHMvSmF2YUhvb2tlci50cyIsImFnZW50L2FuZHJvaWQvVXRpbHMvTmF0aXZlQXNtLnRzIiwiYWdlbnQvYW5kcm9pZC9VdGlscy9TeW1IZWxwZXIudHMiLCJhZ2VudC9hbmRyb2lkL1V0aWxzL1RocmVhZEhvb2tlci50cyIsImFnZW50L2FuZHJvaWQvVXRpbHMvaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvVXRpbHMvbGliY2Z1bmNzLnRzIiwiYWdlbnQvYW5kcm9pZC9VdGlscy9zeXNjYWxscy50cyIsImFnZW50L2FuZHJvaWQvVmFsdWVIYW5kbGUudHMiLCJhZ2VudC9hbmRyb2lkL2FuZHJvaWQudHMiLCJhZ2VudC9hbmRyb2lkL2Z1bmN0aW9ucy9EZWZpbmVDbGFzcy50cyIsImFnZW50L2FuZHJvaWQvZnVuY3Rpb25zL0RleEZpbGVNYW5hZ2VyLnRzIiwiYWdlbnQvYW5kcm9pZC9mdW5jdGlvbnMvRXhlY3V0ZVN3aXRjaEltcGxDcHAudHMiLCJhZ2VudC9hbmRyb2lkL2Z1bmN0aW9ucy9MaW5rZXJNYW5hZ2VyLnRzIiwiYWdlbnQvYW5kcm9pZC9mdW5jdGlvbnMvT3BlbkNvbW1vbi50cyIsImFnZW50L2FuZHJvaWQvZnVuY3Rpb25zL1N5bWJvbE1hbmFnZXIudHMiLCJhZ2VudC9hbmRyb2lkL2Z1bmN0aW9ucy9kbG9wZW4udHMiLCJhZ2VudC9hbmRyb2lkL2Z1bmN0aW9ucy9pbmNsdWRlLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9DbGFzc0xpbmtlci50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvR2NSb290LnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9HbG9iYWxzLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9JbnN0cnVjdGlvbi50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvSW5zdHJ1bWVudGF0aW9uL0luc3RydWN0aW9uTGlzdC50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvSW5zdHJ1bWVudGF0aW9uL0luc3RydW1lbnRhdGlvbi50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvSW5zdHJ1bWVudGF0aW9uL0luc3RydW1lbnRhdGlvbkxpc3RlbmVyLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9JbnN0cnVtZW50YXRpb24vSW5zdHJ1bWVudGF0aW9uU3RhY2tGcmFtZS50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvSW5zdHJ1bWVudGF0aW9uL0luc3RydW1lbnRhdGlvblN0YWNrUG9wcGVyLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9JbnN0cnVtZW50YXRpb24vU21hbGlXcml0ZXIudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L0luc3RydW1lbnRhdGlvbi9TbWFsaW5JbmxpbmVNYW5hZ2VyLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9JbnN0cnVtZW50YXRpb24vVW5Vc2VkSW5zdHJ1Y3Rpb24udHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L0luc3RydW1lbnRhdGlvbi9lbnVtLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9JbnN0cnVtZW50YXRpb24vaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvT2F0UXVpY2tNZXRob2RIZWFkZXIudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L09hdC9NZW1NYXAudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L09hdC9PYXREZXhGaWxlLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9PYXQvT2F0RmlsZS50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvT2F0L2luY2x1ZGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L09ialB0ci50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvUXVpY2tNZXRob2RGcmFtZUluZm8udHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L1NoYWRvd0ZyYW1lLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9TdGFja1Zpc2l0b3IvQ0hBU3RhY2tWaXNpdG9yLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9TdGFja1Zpc2l0b3IvQ2F0Y2hCbG9ja1N0YWNrVmlzaXRvci50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvU3RhY2tWaXNpdG9yL1N0YWNrVmlzaXRvci50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvU3RhY2tWaXNpdG9yL2luY2x1ZGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L1RocmVhZC50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvVGhyZWFkX0lubC50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvVHlwZS9KVmFsdWUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L1R5cGUvSmF2YVN0cmluZy50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvVHlwZS9UaHJvd2FibGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L1R5cGUvaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvVHlwZS9qb2JqZWN0LnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9icmlkZ2UudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2RleGZpbGUvQ29kZUl0ZW1EYXRhQWNjZXNzb3IudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2RleGZpbGUvQ29kZUl0ZW1EZWJ1Z0luZm9BY2Nlc3Nvci50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvZGV4ZmlsZS9Db2RlSXRlbUluc3RydWN0aW9uQWNjZXNzb3IudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2RleGZpbGUvQ29tcGFjdERleEZpbGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2RleGZpbGUvRGV4RmlsZS50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvZGV4ZmlsZS9EZXhGaWxlU3RydWN0cy50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvZGV4ZmlsZS9EZXhJbmRleC50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvZGV4ZmlsZS9IZWFkZXIudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2RleGZpbGUvU3RhbmRhcmREZXhGaWxlLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9kZXhmaWxlL2luY2x1ZGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2luY2x1ZGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2ludGVycHJldGVyL0luc3RydWN0aW9uSGFuZGxlci50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvaW50ZXJwcmV0ZXIvU3dpdGNoSW1wbENvbnRleHQudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2ludGVycHJldGVyL2luY2x1ZGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L2ludGVycHJldGVyL2ludGVycHJldGVyLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9taXJyb3IvQXJ0Q2xhc3MudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L21pcnJvci9BcnRNZXRob2QudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L21pcnJvci9DbGFzc0V4dC50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvbWlycm9yL0NsYXNzTG9hZGVyLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9taXJyb3IvRGV4Q2FjaGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L21pcnJvci9JZlRhYmxlLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9taXJyb3IvaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9hcnQvcnVudGltZS9SdW50aW1lLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2FydC9ydW50aW1lL1RocmVhZExpc3QudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvYXJ0L3J1bnRpbWUvaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvaW1wbGVtZW50cy8xMC9kZXgyb2F0L2RleDJvYXQudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvMTAvZGV4Mm9hdC9pbmNsdWRlLnRzIiwiYWdlbnQvYW5kcm9pZC9pbXBsZW1lbnRzLzEwL2luY2x1ZGUudHMiLCJhZ2VudC9hbmRyb2lkL2ltcGxlbWVudHMvaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvaW5jbHVkZS50cyIsImFnZW50L2FuZHJvaWQvamR3cC9KRFdQUGFja2FnZS50cyIsImFnZW50L2FuZHJvaWQvamR3cC9jb25zdGFudC50cyIsImFnZW50L2FuZHJvaWQvamR3cC9pbmNsdWRlLnRzIiwiYWdlbnQvYW5kcm9pZC9qZHdwL2pkYi50cyIsImFnZW50L2FuZHJvaWQvamR3cC9qZHdwLnRzIiwiYWdlbnQvYW5kcm9pZC9tYWNoaW5lLWNvZGUuanMiLCJhZ2VudC9pbmNsdWRlLnRzIiwiYWdlbnQvbWFpbi50cyIsImFnZW50L25hdGl2ZS9ob29rcy50cyIsImFnZW50L25hdGl2ZS9pbmNsdWRlLnRzIiwiYWdlbnQvdG9vbHMvU3RkU3RyaW5nLnRzIiwiYWdlbnQvdG9vbHMvY29tbW9uLnRzIiwiYWdlbnQvdG9vbHMvZGxvcGVuLnRzIiwiYWdlbnQvdG9vbHMvZHVtcC50cyIsImFnZW50L3Rvb2xzL2VudW0udHMiLCJhZ2VudC90b29scy9mdW5jdGlvbnMudHMiLCJhZ2VudC90b29scy9pbmNsdWRlLnRzIiwiYWdlbnQvdG9vbHMvaW50ZXJjZXB0ZXIudHMiLCJhZ2VudC90b29scy9sb2dnZXIudHMiLCJhZ2VudC90b29scy9tb2RpZmllcnMudHMiLCJhZ2VudC90b29scy92ZXJzaW9uLnRzIiwibm9kZV9tb2R1bGVzL2Fzc2VydC9hc3NlcnQuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Fzc2VydC9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9hc3NlcnQvbm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9hdmFpbGFibGUtdHlwZWQtYXJyYXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NhbGwtYmluZC9jYWxsQm91bmQuanMiLCJub2RlX21vZHVsZXMvY2FsbC1iaW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvbnNvbGUtYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kZWZpbmUtZGF0YS1wcm9wZXJ0eS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zvci1lYWNoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZyaWRhLXByb2Nlc3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnVuY3Rpb24tYmluZC9pbXBsZW1lbnRhdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mdW5jdGlvbi1iaW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dldC1pbnRyaW5zaWMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ29wZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9oYXMtcHJvcGVydHktZGVzY3JpcHRvcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaGFzLXByb3RvL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2hhcy1zeW1ib2xzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2hhcy1zeW1ib2xzL3NoYW1zLmpzIiwibm9kZV9tb2R1bGVzL2hhcy10b3N0cmluZ3RhZy9zaGFtcy5qcyIsIm5vZGVfbW9kdWxlcy9oYXNvd24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9pcy1hcmd1bWVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtY2FsbGFibGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtZ2VuZXJhdG9yLWZ1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLXR5cGVkLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2ltcGxlbWVudGF0aW9uLmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2lzQXJndW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC5hc3NpZ24vaW1wbGVtZW50YXRpb24uanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LmFzc2lnbi9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc2V0LWZ1bmN0aW9uLWxlbmd0aC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy93aGljaC10eXBlZC1hcnJheS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeGVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzdEQSxNQUFBLElBQUEsUUFBQTs7QUFFQSxNQUFhLFVBQXVCLEVBQUE7RUFFekIsZ0JBQTZCO0VBRXBDLFdBQUE7SUFDSTtBQUNKO0VBRUEsWUFBVztJQUNQLE9BQU8sRUFBZTtBQUMxQjtFQUVPLFVBQUEsQ0FBVztJQUNWLEtBQUssV0FBVyxNQUNwQixFQUFlLFNBQVMsS0FBSztBQUNqQztFQUVPLGFBQUEsQ0FBYztJQUNqQixFQUFlLFdBQVcsRUFBZSxTQUFTLFFBQU8sS0FBUSxLQUFRO0FBQzdFO0VBRU8sVUFBQSxDQUFXO0lBQ2QsT0FBTyxLQUFLLFNBQVMsTUFBSyxLQUFRLEtBQVE7QUFDOUM7OztBQXZCSixRQUFBOztBQWdDQSxNQUFNLElBQW1CLENBQUMsR0FBa0IsR0FBZ0IsS0FBZ0I7RUFDeEUsS0FBSyxJQUFhLFFBQVQsSUFBcUIsTUFBTSxjQUFrQixFQUFRLFlBQzlELEtBQUssZ0JBQWdCLEVBQVE7RUFDN0IsS0FBSyxnQkFBZ0IsRUFBUSx3Q0FBd0MsRUFBUTtFQUM3RSxLQUFLLGFBQWEsRUFBUSxrQkFBa0IsRUFBUSx1QkFBdUIsRUFBUSw0QkFBNEIsRUFBUTtFQUNuSCxLQUFRLEVBQVEsU0FBUyxTQUFTLFdBQVMsRUFBUSxRQUN2RDtBQUFTLEdBR1AsSUFBYyxDQUFDLEdBQWUsS0FBc0I7RUFDdEQsSUFBSSxJQUFnQjtFQUNwQixLQUFLLHFDQUFxQyxFQUFlLFNBQVMsc0JBQ2xFLEVBQWUsU0FBUyxTQUFTO0lBQ2hCLEtBQVQsS0FBWSxTQUNaLE1BQWlCLEVBQUssU0FBUyxTQUFTLGlCQUM1QyxFQUFpQixLQUFRLEdBQU87QUFBSztBQUN2Qzs7QUFJTixXQUFXLGVBQWUsQ0FBQyxLQUFzQjtFQUM3QyxHQUFZLEdBQU87QUFBVyxHQUdsQyxXQUFXLGVBQWUsQ0FBQyxLQUFzQjtFQUM3QyxHQUFZLEdBQU07QUFBVzs7OztBQzVEakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDZkEsTUFBQSxJQUFBLFFBQUEsMENBQ0EsSUFBQSxRQUFBLDZCQUNBLElBQUEsUUFBQSxrQkFDQSxJQUFBLFFBQUEsdUJBQ0EsSUFBQSxRQUFBLHNCQUNBLElBQUEsUUFBQSxvQkFDQSxJQUFBLFFBQUEsYUFDQSxJQUFBLFFBQUEsY0FDQSxJQUFBLFFBQUE7O0FBU0EsTUFBYSxVQUFvQixFQUFBO0VBSXJCLE1BQXVCLEtBQUs7RUFFNUIsUUFBeUIsS0FBSyxNQUFNLElBQUksRUFBQTtFQUV4QyxpQkFBa0MsS0FBSyxRQUFRLElBQUksRUFBQTtF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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDekdBLE1BQUEsSUFBQSxRQUFBLDJDQUlBLElBQUEsUUFBQSw0QkFDQSxJQUFBLFFBQUEsZ0NBQ0EsSUFBQSxRQUFBLGtDQUNBLElBQUEsUUFBQSx1Q0FDQSxJQUFBLFFBQUEsbUNBQ0EsSUFBQSxRQUFBLGdDQUNBLElBQUEsUUFBQSxtQ0FFQSxJQUFBLFFBQUEsOEJBRUEs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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7SUNMQSxRQUFBLGFBQ0EsUUFBQSxlQUNBLFFBQUEsY0FDQSxRQUFBO0FBQ0EsUUFBQSxtQkFDQSxRQUFBLG1CQUVBLFFBQUE7QUFDQSxRQUFBLHdCQUNBLFFBQUEsb0JBQ0EsUUFBQTtBQUNBLFFBQUE7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaERBLFNBQWdCLEVBQWE7RUFDekIsSUFBSSxJQUF3QyxPQUFPLGlCQUFpQixhQUFhO0VBSWpGLElBSHVCLFFBQW5CLE1BQXlCLElBQWtCLE9BQU8saUJBQWlCLHFCQUFxQjtFQUNyRSxRQUFuQixNQUF5QixJQUFrQixPQUFPLGlCQUFpQixtQkFBbUI7RUFDbkUsUUFBbkIsTUFBeUIsSUFBa0IsT0FBTyxpQkFBaUIsTUFBTSxvQkFDdEQsUUFBbkIsR0FBeUIsTUFBTSxNQUFNO0VBQ3pDLElBQUksSUFBcUIsSUFBSSxlQUFlLEdBQWlCLFdBQVcsRUFBQyxXQUFXLFdBQVcsV0FBVyxjQUN0RyxJQUE2QixPQUFPLGdCQUFnQixJQUNwRCxJQUE4QixNQUM5QixJQUF3QixNQUN4QixJQUF3QixPQUFPLE1BQU0sUUFBUSxXQUM3QyxJQUF3QixFQUFTLEdBQWEsR0FBYyxHQUFRO0VBQ3hFLElBQXlCLE1BQXJCLEVBQU8sV0FBaUI7SUFDeEIsSUFBSSxJQUEyQixFQUFPO0lBQ3RDLE9BQXFCLFFBQWIsS0FBcUIsS0FBYSxJQUFXLEtBQUs7O0VBQ3ZELE9BQU87QUFDbEI7Ozs7MkVBaEJBLFFBQUE7O0FBa0JPLE1BQU0sSUFBaUMsS0FBOEIsRUFBYSxHQUFTLE1BQU0sTUFBTSxLQUFJLEtBQVEsRUFBSyxNQUFNLEtBQUs7O0FBQTdILFFBQUEsZ0NBQTZCLEdBRTFDLFdBQVcsZUFBZTs7O0FDcEIxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIn0=
