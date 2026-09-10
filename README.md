# 当前测试环境
Pixel XL 
android-10 (aosp)
BUILD_ID=QP1A.191005.007.A3
frida          16.7.0
frida-tools    13.6.1

`_代码中大部分是写死的结构体偏移，不能兼容不同版本的安卓，测试建议用安卓10_`

# 期望目标

根据artmethod指针去得到与之关联的dex源文件，解析dex文件，获取该方法的smali字节码，根据上述打印的代码信息来进行进一步的操作

👇 目前考虑的四种大概可行的smali inline trace方式 👇

0. Use JDB 😀

   REF: [jvmti doc](https://docs.oracle.com/javase/8/docs/platform/jvmti/jvmti.html) | 
   REF: [android source jvmti.h](https://cs.android.com/android/platform/superproject/main/+/main:art/openjdkjvmti/include/jvmti.h;l=1002) | 
   REF: [frida jvmti](https://github.com/frida/frida-java-bridge/blob/a3b0de51451dd38e9dfcbaa1fbc744745bab9579/lib/jvmti.js) | 
   REF: [how to start jdwp thread](https://github.com/axhlzy/Il2CppHookScripts/blob/fe5ea00c7930135246b37333d63c21786c3fe82b/Il2cppHook/agent/plugin/jdwp/jdwp.ts#L257) |
   REF: [jdwp protocol](https://github.com/IOActive/jdwp-shellifier)

2. Use Trace Function 😕

   通过符号以及指令格式的模式匹配定位一些关键的trace函数 
   参考源码 [trace.h](https://android.googlesource.com/platform/art/+/refs/tags/android-10.0.0_r42/runtime/trace.h#107)

3. Inline Hook Smali 😕

   - 解释执行
     
      Invoke static 覆盖原字节码调用（跳转到 Java.registerClass注册的js函数，实际就是native java method 对应一个 nativeFunctionCallback），并保存原字节码，进入新的ArtMethod执行流程后，通过 [`ManagedStack`](https://cs.android.com/android/platform/superproject/+/master:art/runtime/art_method.cc;l=379?q=art_method.cc&ss=android%2Fplatform%2Fsuperproject) 拿到上级 `fragment` 并获取 `ShadowFrame` 等同于获取到了当前java函数执行的上下文, 手动去执行我们覆盖的字节码后, 修改[上一贞](https://cs.android.com/android/platform/superproject/+/master:art/runtime/interpreter/shadow_frame.h;l=440)的[寄存器值](https://cs.android.com/android/platform/superproject/+/master:art/runtime/interpreter/shadow_frame.h;l=211)，然后执行我们自己定义的static函数，通过这个函数就可以拿到上一级的所有信息, 也就是差不多inlinehook了该java函数指定位置的smail， 关于禁止oat [turbodex](https://github.com/asLody/TurboDex/blob/master/project/turbodex/turbodex/src/main/jni/core/FastLoadDex.cpp#L13) (修改dex以后，还有一些dex缓存需要处理) 
     
   - 快速执行(oat模式)
     
      主要工作在于需要解析oat后二进制的符号信息，dump汇编的时候可用借此增加二进制的可读性，至于二进制可行性格式的inlinehook就很普通了

4. 自定义smali解释器
  具体的实现可以参考 [vmInterpret](https://github.com/maoabc/nmmp/blob/master/nmmvm/nmmvm/src/main/cpp/vm/InterpC-portable.cpp#L1065C17-L1065C18)，或者把它移植过来，像qbdi那样导出一些函数用作frida bridge，完全代理系统原有的art smali解释器以获得最佳的流程控制能力以及跨不同版本的安卓代码兼容性

5. node调试执行
   简单的想法是按照frida官网文档中关于调试js/ts的流程为关键js函数下断点 (--runtime=v8 --debug)，但是如果我们使用Intercpter.attach以后，断点下在onEnter或者onLeave中，即实现了类似于调试器断点的感觉，这里涉及到另一个问题，如何像lldb一样进行单步调试，我的想法大致分为两种：
   
   ① 使用 [stalker](https://frida.re/docs/stalker/) CP原汇编并执行
   
   ② 使用 [QBDI](https://github.com/QBDI/QBDI) 完全代理模拟执行
   
   ③ 使用大佬现成的方案 [Dwarf](https://github.com/iGio90/Dwarf)
   
   上述两种调试器方式我们都可以把断点下的更仔细，实现单步执行的效果，但是实测稳定性欠佳
   
   至于 `Dwarf` 我实测也是感觉断点稳定性欠佳
   

---

### 还想做的一些事情

- 处理一些常见的时机
  1. DefineClass
  2. OpenCommon
  3. OpenMemory
     ...

- 处理一些ART运行时的关键函数
  1. ExecuteMterpImpl / ExecuteSwitchImpl - ExecuteSwitchImplCpp
  2. doInvoke
     ...

- 从调用逻辑上来看
   java -> java |
   java -> oat |
   oat -> java |
   oat -> oat |
   java -> native |
   native -> java 

- 中间顺带处理一下dex2oat对dex优化流程的尝试


### 效果图

  ```
   [AOSP on msm8996::com.xxx.xxx ]->  pathToArtMethod("com.unity3d.player.UnityPlayer.addPhoneCallListener").showSmali()
   ↓dex_file↓
   DexFile<0xe8ffe520>
            location: /data/app/com.gzcc.xbzc-s_aRcJlPwvVinch43dmvmw==/base.apk!classes4.dex
            location_checksum: 545562129 ( 0x20849e11 ) is_compact_dex: false
            begin: 0xc771b808 size: 7865800 ( 0x7805c8 ) | data_begin: 0xc771b808 data_size: 7865800 ( 0x7805c8 )
            oat_dex_file_ 0xe8ffe578
   
   👉 0xd1413f7c -> protected void com.unity3d.player.UnityPlayer.addPhoneCallListener()
   quickCode: 0xef450581 -> art_quick_to_interpreter_bridge @ libart.so | jniCode: null | accessFlags: 0x18080004 | size: 0x1c
   
   [  1|0x0  ] 0xc7dcf1ac - 1 - 1210            | const/4 v0, #+1
   [  2|0x2  ] 0xc7dcf1ae - 2 - eb30 0803       | iput-boolean-quick v0, v3, thing@776
   [  3|0x6  ] 0xc7dcf1b2 - 2 - e530 ec02       | iget-object-quick v0, v3, // offset@748
   [  4|0xa  ] 0xc7dcf1b6 - 2 - e531 e402       | iget-object-quick v1, v3, // offset@740
   [  5|0xe  ] 0xc7dcf1ba - 2 - 1302 2000       | const/16 v2, #+32
   [  6|0x12 ] 0xc7dcf1be - 3 - e930 1401 1002  | invoke-virtual-quick {v0, v1, v2},  // vtable@276
   [  7|0x18 ] 0xc7dcf1c4 - 1 - 7300            | return-void-no-barrier

  // 解析 offset@748
  // 解析 vtable@276
   ```



showOatAsm
![showSmali](https://github.com/axhlzy/ARTHookScripts/blob/master/imgs/showOatAsm.png)

showSmali
![showOatAsm](https://github.com/axhlzy/ARTHookScripts/blob/master/imgs/showSmali.png)

dumpDexFiles
![dumpDexFiles](https://github.com/axhlzy/ARTHookScripts/blob/master/imgs/dumpDexFiles.png)

printBackTraceWithSmali
![printBackTraceWithSmali](https://github.com/axhlzy/ARTHookScripts/blob/master/imgs/printBackTraceWithSmali.png)

--- 

# 函数边界识别 & Native 反汇编

新增文件：

- `agent/android/Utils/CfgAnalyzer.ts` —— 纯 CFG / PLT 识别，独立可调，不依赖任何 ART 结构
- `agent/android/Utils/FunctionBoundary.ts` —— 元数据优先的边界解析 + 指令注解
- `agent/android/Utils/NativeAsm.ts` —— `showNativeAsm` 入口与目标地址解析

`showOatAsm` / `showAsm` 以前无法确定函数结束位置（写死 20 条 / 10 条指令），现在统一由
`getFunctionBoundary()` 解析，**元数据优先，CFG 兜底**：

| 优先级 | 数据来源 | `source` | 精度 |
| :--: | :-- | :-- | :-- |
| 1 | `art::OatQuickMethodHeader::code_size_`（紧邻代码前 8 字节，编译器写入） | `oat-header` | exact |
| 2 | ELF 符号表 `st_size` | `symbol-size` | exact |
| 3 | 到下一个函数符号的距离（只是上界），再用 CFG 收紧 | `symbol-next` / `cfg-bounded` | medium / high |
| 4 | 轻量级递归下降 CFG（PLT 感知） | `cfg` | high / medium / low |

符号表按 module 只 `enumerateSymbols()` 一次并排序缓存，之后二分查找，不会每条指令都全表扫描。

## 为什么要专门处理 PLT

ARM64 的 PLT stub 长这样：

```
adrp x16, #0x7e17d8d000
ldr  x17, [x16, #0xd20]
add  x16, x16, #0xd20
br   x17
```

它是**跳出本模块的尾调用**，不是函数内部的间接跳转。不识别的话：

- `b <plt>` 的目标落在 `maxSpan` 内，CFG 会跟着走进 stub 数组
- stub 里的 `br x17` 被当成 jump table，触发线性扫描
- 线性扫描没有字节预算，一路把整个 `.plt` 扫完（实测膨胀到 38KB / 9500+ 条指令）

现在的处理：

1. 跟随任何 `b` / `b.cond` 目标前先 `inspectPltStub()`，命中即终止该路径并记入 `pltCalls`
2. 不透明 `br` 用 `refineIndirect()` 分三类：
   - `plt` —— GOT 常量位移加载 `ldr xN,[xM,#imm]` + `adrp`，可解析出真实被调方
   - `jumpTable` —— 索引寻址 `ldr xN,[xM,xK,lsl #s]` / `ldrsw`，才是真正的 switch 表
   - `unknown`
3. 只有 `jumpTable` 触发线性扫描补齐，且预算限制为 `maxSweepBytes`（默认 `0x200`）+ 256 条指令
4. 线性扫描遇到 prologue / PLT stub / 2 个连续 nop / 不可解码字节立即停止

x86/x64 的 `jmp [rip+disp]` 同样按 PLT 处理。GOT 还没 lazy-bind 时显示 `[plt unbound]`，
绑定之后调 `clearPltCache()` 刷新缓存。

## 输出示例

```
[ FunctionBoundary< 0x7e17a26554 -> 0x7e17a26578 > size: 36 ( 0x24 ) | source: cfg-bounded
  | confidence: high | module: libfk.so | symbol: Java_com_android_boot_MainActivity_getNativeTid
  | cfg: insns 9, blocks 1, returns 1, plt 1, indirect 0 ]

[    1|0x0    ] 0x7e17a26554 | 0x897554  sub sp, sp, #0x20
[    6|0x14   ] 0x7e17a26568 | 0x897568  bl #0x7e17c301a0   ; -> [plt] libc.so!gettid
[    9|0x20   ] 0x7e17a26574 | 0x897574  ret   <== return
```

指令注解规则：

| 指令 | 注解 |
| :-- | :-- |
| `bl` / `call` | `; -> lib.so!symbol`（穿透 PLT，C++ 名自动 demangle） |
| 函数内分支 | `; -> +0x98`（与 offset 列对齐，可直接比对） |
| 跳出函数的 `b` | `; -> lib.so!symbol [tail]` |
| PLT 尾调用 | `; -> [plt] libc.so!malloc` |
| `ret` | `<== return` |
| `brk` / `udf` / `ud2` / `hlt` | `<== trap (udf)` |
| PLT 的 `br` | `<== plt tail call -> libc.so!malloc` |
| 真 jump table | `<== indirect branch (jump table?)` |

---

# REPL API

## Native 反汇编

```js
// target 可以是以下任意一种形式
showNativeAsm(ptr("0x7e17a26554"))
showNativeAsm("0x7e17a26554")                                              // 裸 hex "7e17a26554" 也接受
showNativeAsm("libfk.so!0xaa11a0")                                         // module!offset
showNativeAsm("libfk.so!Java_com_android_boot_MainActivity_getNativeTid")  // module!symbol
showNativeAsm("Java_com_android_boot_MainActivity_getNativeTid")           // 全局导出符号
showNativeAsm("com.android.boot.MainActivity.getNativeTid")                // java 方法路径 -> ArtMethod.data_
showNativeAsm(pathToArtMethod("com.x.Y.z"))                                // ArtMethod 实例

showNativeAsm(target, { num: 30 })                        // 只看前 30 条
showNativeAsm(target, { prefer: 'cfg' })                  // 跳过元数据，强制走 CFG
showNativeAsm(target, { oatHeader: true })                // 按 OAT 编译代码解析
showNativeAsm(target, { annotate: { calls: false } })     // 关掉调用注解
showNativeAsm(target, { maxSpan: 0x4000, maxSweepBytes: 0x100 })

resolveNativeAddress(target)      // 只解析地址，不反汇编
isUnboundJniStub(addr)            // data_ 是否还是 art_jni_dlsym_lookup_stub
```

> `data_` 还指向 `art_jni_dlsym_lookup_stub` 说明该 native 方法**还没被调用过**，JNI 实现
> 尚未注册。先调用一次 java 方法（或 hook `RegisterNatives`）再看，否则反汇编出来的是
> libart 的 stub 而不是目标函数。

## 边界 / CFG

```js
getFunctionBoundary(addr)                       // -> FunctionBoundary 对象
getFunctionBoundary(addr, { oatHeader: true })
getFunctionSize(addr)                           // -> number
analyzeFunctionCfg(addr)                        // 只用 CFG，跳过所有元数据
analyzeFunctionCfg(addr, { maxSpan: 0x4000, maxInsns: 5000, linearSweepOnIndirect: false })
showFunctionAsm(addr, { num: -1 })              // 反汇编整个函数
CfgAnalyzer.analyze(addr)                       // 完整 CfgResult
CfgAnalyzer.describe(cfgResult)                 // 一行摘要
CfgAnalyzer.linearSweep(from, limit)
```

`FunctionBoundary` 字段：`start` / `end` / `size` / `source` / `confidence` / `moduleName` /
`symbolName` / `cfg`。

`CfgResult` 字段：`insnCount` / `blockCount` / `returns` / `calls` / `pltCalls` /
`indirectBranches` / `undecodable` / `truncated` / `linearSwept` / `confidence`。

## 符号

```js
formatSymbol(addr)              // "libunity.so!Unity::Foo()+0x10" / "libfk.so!0xaa11a0" / 裸地址
demangleName("_ZN3foo3barEv")
isPltStub(addr)
inspectPltStub(addr)            // -> { stub, gotSlot, target }
resolveGotSlot(insn)            // -> { slot, page, disp }
clearPltCache()                 // GOT lazy-bind 之后刷新
clearSymbolCache()              // so 卸载 / 重载之后刷新
FunctionBoundaryUtil.SymbolTableCache.stats("libunity.so")              // 看 st_size 命中率
FunctionBoundaryUtil.SymbolTableCache.findByName("libfk.so", "Java_com", true)
FunctionBoundaryUtil.SymbolTableCache.clear()
```

`formatSymbol` 规则：C++ 名走 `__cxa_demangle`；符号内部地址 → `module!symbol+0xNN`；
无符号 → `module!0xoffset`；不属于任何模块（堆 / JIT 数据指针）→ 裸地址。结果全部缓存。

先用 `SymbolTableCache.stats()` 看一下 `with st_size` 的数量，如果很低说明该 so 的符号
基本不带 size，`symbol-size` 这条路走不通，实际会一直落到 `cfg-bounded`。

## ArtMethod

```js
pathToArtMethod("com.x.Y.z").show()        // 字段全览
                       .showCode()          // 自动判断 smali / oat / native
                       .showSmali()
                       .showOatAsm()        // 用 oat-header 精确定界，num=-1 打印整个函数
                       .showOatAsm(40)      // 只打印 40 条
                       .showAsm()           // native 实现，默认整个函数
                       .showAsm(20)
```

`showAsm()` 的默认值从 `10` 改成了 `-1`（整个函数）。

## 访问标志

`PrettyAccessFlags(flags, kind)` 的 `kind` 取 `"class" | "field" | "method"`（默认 `"method"`），
用于区分共用同一 bit 的标志：

| bit | field | method | class |
| :-- | :-- | :-- | :-- |
| `0x0020` | - | `synchronized` | -（`kAccSuper`，不打印） |
| `0x0040` | `volatile` | `bridge` | - |
| `0x0080` | `transient` | `varargs` | - |

新补齐的标志：`native` `strictfp` `synthetic` `annotation` `enum` `interface` `constructor`。

`PrettyRuntimeAccessFlags(flags, kind)` 解码 `kAccJavaFlagsMask`(0xffff) 以上的 ART runtime 位，
重载位按 kind + 是否 native 区分（取值对齐 `frida-java-bridge/lib/android.js`）：

| bit | native 方法 | 非 native 方法 |
| :-- | :-- | :-- |
| `0x00080000` | `FastNative` | `SkipAccessChecks` |
| `0x00200000` | `CriticalNative` | `Miranda` |

其余：`Constructor` `DeclaredSynchronized` `ObsoleteMethod` `Copied` `Default`
`DefaultConflicting` `CompileDontBother` `Intrinsic` `SingleImplementation` `PublicApi`
`CorePlatformApi` `FastInterpToInterpInvoke` `PreviouslyWarm`；class 侧：`ClassIsProxy`
`VerificationAttempted` `SkipHiddenapiChecks`。

所以 `0x18000101` 现在显示为 `public native [SingleImplementation|PublicApi]`。

## listJavaMethods 字段输出

以前 instance 字段会 `JSON.stringify` 出 frida-java-bridge 的内部 `_p` 数组：

```
[2] handler : {"_p":["<class: com.android.boot.MainActivity>",2,{...},"0x7e7023d10c","0x7e86379b2c","0x7e86379ccc"]}
```

现在：

```
[1] public static final int HANDLER_MSG_CALLJAVA = 1000   // statics offset 0x0 | ArtField 0x...
[2] private android.os.Handler handler                    // field offset 0x10 | ArtField 0x7e7023d10c
[3] public static final java.lang.String TAG = ZZZ        // statics offset 0x8 | ArtField 0x...
```

用 `_p[1]` 区分 static / instance，`getArtFieldSpec()` 取 flags 与 offset，类型描述符美化
（`I` → `int`，`Ljava/lang/String;` → `java.lang.String`，`[I` → `int[]`）。

```js
prettyTypeDescriptor("Ljava/lang/String;")     // -> "java.lang.String"
describeJavaField(field, name)
```

---

# 修复记录

- **Frida 17 兼容**：Frida 17 删除了静态 `Module.getExportByName`，而 `android.ts` 读
  `ro.build.version.sdk` 时用到它，导致任何 `ArtMethod` 操作都抛 `TypeError: not a function`
  （调用链 `getArtMethodSpec` → `getArtRuntimeSpec` → `tryGetArtClassLinkerSpec` →
  `getAndroidApiLevel` → `getAndroidSystemProperty`）。`tools/version.ts` 现在同时垫片
  `findExportByName`（带 moduleName 时做真实模块查找）和 `getExportByName`。
- **`OatQuickMethodHeader.code`**：`uint8_t code_[0]` 是柔性数组成员，应返回地址本身而不是
  `readPointer()`。修正后 `GetOptimizedCodeInfoPtr()` 才与 ART 的实现一致。
- **`ArtMethod.toString()` 字段标注错位**：标签写的是 `jniCode`，打印的却是
  `entry_point_from_quick_compiled_code`。已改正（`get jniCode()` 返回 `data` 本身是对的）。
- **`PrettyAccessFlags` 漏 `native`**：native 方法只显示 `private final`。
- **`demangleName` 内存泄漏**：`__cxa_demangle` 在 `*output_buffer == NULL` 时会 malloc 返回
  缓冲区，以前从不 free。现在会释放，且两个 `NativeFunction` 都做了缓存（`formatSymbol`
  会按地址逐个调用它，不缓存的话反汇编耗时会被它主导）。

---

# Ref
- [frida-smali-trace](https://github.com/SeeFlowerX/frida-smali-trace)

