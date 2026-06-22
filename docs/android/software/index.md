# 软件推荐

Android 实用开源软件推荐，按依赖层级排列：从底层 Root 到上层应用。

## Root 方案

### KernelSU

[官网](https://kernelsu.org/) · GPL-3.0

基于内核的 Android Root 权限方案，运行在 Linux 内核层，对用户空间拥有更强的控制力。

- 仅授权应用可感知 `su`，其余应用完全无感知
- 可定制 Root 权限的 UID、GID、capabilities、SELinux 规则
- 模块系统支持无系统修改（systemless），通过 meta-overlayfs 启用模块挂载

::: tip 适用人群
GKI 内核设备用户，看重隐蔽性与安全性。
:::

## 模块框架

### LSPosed

[GitHub](https://github.com/lsposed/lsposed) · GPL-3.0

基于 LSPlant 的 ART 钩子框架，作为 Riru / Zygisk 模块运行，提供与经典 Xposed 一致的 API。

- 兼容 Android 8.1 ~ 14
- 依赖 Magisk v24+，支持 Riru 和 Zygisk 两种载体
- 兼容经典 Xposed 模块生态，旧模块可直接运行
- 内置模块仓库，支持在应用内浏览和下载

::: tip 适用人群
需要通过 Xposed 模块深度定制系统的用户。
:::

## 通话录音

### Cally

[GitHub](https://github.com/LyoSU/cally) · GPL-3.0

一款通过 Shizuku 实现通话录音的工具，**无需 Root，无需解锁 Bootloader**，专为 Pixel 6 及以上设备优化。

- 双轨录音（上行 + 下行），内置五级回退策略，某路失败自动切换备用方案
- Material 3 Expressive UI，跟随系统动态取色
- 零遥测，无任何分析 SDK，录音文件永不访问网络
- 可选云端转录，支持自托管 OpenAI 兼容端点
- AIDL + Binder IPC 安全校验，防止其他 Shizuku 应用滥用

::: tip 适用人群
追求隐私、不想解锁 Root 的 Pixel 用户。
:::

### BCR (Basic Call Recorder)

[GitHub](https://github.com/chenxiaolong/BCR) · GPL-3.0

一款面向 Root / 自定义固件设备的简单通话录音应用，安装即用，后台静默录制。

- 支持 Android 9+，输出格式丰富（OGG/Opus、M4A/AAC、FLAC、WAV、AMR）
- 立体声录制，分离上下行声道
- 支持 Magisk 与 KernelSU 双 Root 方案
- 自动录制规则、快捷设置磁贴、可定制文件名模板
- **无网络权限**，不访问网络

::: tip 适用人群
已 Root 或刷入自定义 ROM 的用户，追求简单可靠的自动录音方案。
:::
