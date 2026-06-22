# 为新设备编写类原生 Device Tree

本指南以 LineageOS 为参考，逐步说明如何从官方固件出发，为一个新 Android 设备生成类原生的设备树（Device Tree）与供应商树（Vendor Tree）。

> 原文参考：[Uotan Wiki · 刷机百科](https://wiki.uotan.cn/index.php?title=%E4%B8%BA%E6%96%B0%E8%AE%BE%E5%A4%87%E7%BC%96%E5%86%99%E7%B1%BB%E5%8E%9F%E7%94%9Fdevice_tree)

::: warning 版本匹配
请务必根据设备当前运行的 Android 版本选择对应的 LineageOS 源码分支，**不要跨版本操作**，否则会导致编译失败或运行异常。
:::

## 前期准备

### 环境要求

- **操作系统**：Linux 物理机或虚拟机（推荐 Ubuntu 22.04+），WSL1 / WSL2 亦可
- **磁盘空间**：至少预留 **50GB** 可用空间
- **网络**：需要稳定访问 AOSP / LineageOS 源码仓库

### 获取固件

从设备官方渠道下载**完整固件包**（优先使用最新版本），确保固件未经任何第三方修改。关键镜像文件包括：

| 镜像 | 用途 |
|------|------|
| `system.img` | 系统分区，提取 framework 及系统库 |
| `vendor.img` | 供应商分区，提取 HAL、闭源驱动等 |
| `boot.img` | 内核与 ramdisk |
| `dtbo.img` | Device Tree Blob Overlay（部分设备） |

## 第一步：解包固件

使用 7-Zip 或类似工具层层解压固件包，直到获取上述关键镜像：

```bash
7z x firmware.zip -oextracted/
# 若解压结果仍是压缩包，继续解压，直至得到 .img 镜像文件
```

常见的中间格式包括 `system.new.dat.br`（Brotli 压缩的稀疏数据镜像），需要用 `brotli` 和 `sdat2img` 进一步处理。

也可以使用 DNA、TIK 等专用解包工具简化流程。

## 第二步：生成设备树

推荐使用 Python 3.8 及以上版本。

### 安装依赖

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install python3 python3-pip git-lfs libxml2-utils -y
pip3 install aospdtgen
```

### 准备目录结构

将解包后的镜像内容按分区归类放置：

```bash
mkdir -p ~/aosp/{system,vendor,product}
# system/  → 挂载或解压 system.img 的全部内容
# vendor/  → 挂载或解压 vendor.img 的全部内容
# product/ → 可选，部分设备需要
```

### 执行生成

```bash
python3 -m aospdtgen ~/aosp ~/device_tree
```

脚本会自动扫描各分区中的 `build.prop`、`init.rc` 等关键文件，推断硬件平台、屏幕参数、分区表等信息，生成初步的设备树骨架。

## 第三步：整合到源码并提取供应商文件

### 移入源码树

假设你的 LineageOS 源码位于 `~/android/lineage`：

```bash
mv ~/device_tree/* ~/android/lineage/device/<manufacturer>/<codename>/
cp vendor.img ~/android/lineage/device/<manufacturer>/<codename>/
```

其中 `<manufacturer>` 为厂商名，`<codename>` 为设备代号。

### 运行提取脚本

```bash
cd ~/android/lineage/device/<manufacturer>/<codename>
./extract-files.sh vendor.img
```

如果设备已通过 USB 连接并处于可调试状态，也可以直接从设备提取：

```bash
./extract-files.sh
```

## 常见问题：挂载 vendor.img

当提取脚本报错 `Vendor partition not found` 或 `Missing vendor blobs` 时，需要手动挂载 vendor 镜像。

### 安装工具

```bash
sudo apt install android-sdk-libsparse-utils e2fsprogs fuse2fs -y
```

### 处理稀疏镜像（如适用）

如果 `vendor.img` 是 Android sparse image 格式，需先转换为原始镜像：

```bash
simg2img vendor.img vendor.raw.img
```

### 挂载与提取

```bash
mkdir -p ~/mnt/vendor
sudo mount -o ro,loop,noatime vendor.raw.img ~/mnt/vendor
./extract-files.sh ~/mnt/vendor
sudo umount ~/mnt/vendor
```

::: tip
提取成功后，供应商树（vendor tree）会自动生成在源码根目录的 `vendor/<manufacturer>/<codename>/` 下。
:::

## 第四步：验证与调试

### 检查目录结构

使用 `tree` 命令确认文件完整性：

```bash
tree -L 2 device/<manufacturer>/<codename>
```

一个典型的 MT6768 平台设备树应包含以下文件：

```
device/<manufacturer>/<codename>/
├── Android.bp
├── Android.mk
├── AndroidProducts.mk
├── BoardConfig.mk
├── device.mk
├── extract-files.sh
├── setup-makefiles.sh
├── proprietary-files.txt
├── manifest.xml
├── system.prop
├── vendor.prop
├── odm.prop
├── prebuilts/
│   ├── dtb.img
│   └── kernel
└── rootdir/
    ├── bin/
    │   └── init.insmod.sh
    └── etc/
        ├── init.mt6768.rc
        ├── init.mt6768.usb.rc
        ├── init.recovery.mt6768.rc
        ├── fstab.enableswap
        ├── init.connectivity.rc
        ├── init.modem.rc
        └── ...
```

### 尝试编译

```bash
source build/envsetup.sh
lunch lineage_<codename>-eng
mka bacon
```

根据编译器报错信息，逐一定位设备树中的声明并修正。这是反复迭代的过程，首次编译几乎不可能一次通过。

## 常见错误与排查

| 错误 | 原因 | 解决方向 |
|------|------|---------|
| `AOSPDTGEN: Missing partition images` | system/vendor 目录内容不完整 | 确认镜像已正确解包、挂载 |
| `Unsupported Android version` | aospdtgen 版本不匹配 | 更新 aospdtgen 或切换对应版本 |
| `Vendor mismatch` | 设备代号不匹配 | 用 `fastboot getvar all` 确认设备代号 |
| `ninja: error: ... needed by ...` | 缺少依赖模块声明 | 在 `.mk` 文件中补齐缺失的模块 |
| `No rule to make target` | 文件路径在设备树中写错 | 核对 prebuilts 目录下文件的实际路径 |

## 小结

编写设备树本质上是一个「从官方固件中逆向工程出硬件信息 → 按 AOSP 规范组织文件 → 反复编译修正」的迭代过程。核心步骤总结：

1. **解包**：从官方固件中提取关键分区镜像
2. **生成**：用 `aospdtgen` 自动生成设备树骨架
3. **提取**：运行 `extract-files.sh` 拉取闭源供应商文件
4. **验证**：编译并逐一修复报错

随着迭代次数增加，设备树会日趋完善，最终得到一个可以正常编译、启动的设备树。
