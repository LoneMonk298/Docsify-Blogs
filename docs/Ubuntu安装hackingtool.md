# Ubuntu配置Hackingtool V2.0

> \[!WARNING] 禁止覆盖系统默认 Python 版本
> Ubuntu 的底层系统工具（如 `apt` 包管理器、终端、防火墙 UFW 等）深度依赖系统自带的 Python 版本

***

## 源码编译安装 Python 3.10

### 1. 安装编译依赖项

编译 Python 需要一系列系统级的基础库（如 SSL、SQLite3、 zlib 等），缺少任何一个都会导致编译出来的 Python 缺少功能（比如 pip 无法下载 HTTPS 包）。
打开终端（Ctrl+ALT+T），执行：

```bash
sudo apt update
sudo apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev \
libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget -y
```

### 2. 下载 Python 3.10 源码

我们将其下载到系统的临时目录 `/tmp` 中，编译完后可以随意删除，不会污染系统。

```bash
cd /tmp
# 这里以 Python 3.10.13 最终稳定版为例
wget https://www.python.org/ftp/python/3.10.13/Python-3.10.13.tgz
```

### 3. 解压并进入目录

```bash
tar -xvf Python-3.10.13.tgz
cd Python-3.10.13
```

### 4. 配置编译选项

执行 `configure` 脚本进行环境检测。加上 `--enable-optimizations` 参数会进行 PGO 优化，编译出的 Python 运行速度会快大概 10%-20%，但会延长编译时间。

```bash
./configure --enable-optimizations
```

### 5. 编译与安装（注意使用 altinstall）

这一步是最耗时的，根据 CPU 性能不同，通常需要 **5 到 10 分钟**，请耐心等待，不要中断。

```bash
# -j$(nproc) 会自动调用你 CPU 的所有核心一起编译，加快速度
make -j$(nproc)
# 必须用 altinstall，绝对不能用 make install！
sudo make altinstall
```

> [!TIP] **科普：`install`** **vs** **`altinstall`**
> - `make install`：会直接覆盖掉系统原有的 `python3` 和 `pip3` 命令。
> - `make altinstall`：只会安装为 `python3.10` 和 `pip3.10`，完全不影响原有的 `python3`。

### 6. 验证安装成果

```bash
python3.10 --version
# 预期输出：Python 3.10.13
pip3.10 --version
# 预期输出：pip 23.x from /usr/local/lib/python3.10/site-packages/pip (python 3.10)
```

***

## 多版本 Python 共存的使用方式

此时你的系统状态如下：

- 输入 `python3` 或 `python3.8` -> 调用系统原生版本
- 输入 `python3.10` -> 调用你刚编译的版本
  那么，在实际项目或安全工具中，我们该如何正确使用呢？

### 方法一：直接显式调用

最简单粗暴的方式，明确告诉系统用哪个解释器执行：

```bash
# 运行 Python 脚本
python3.10 my_script.py
# 使用特定版本的 pip 安装包
python3.10 -m pip install requests
```

*缺点：如果脚本内部 import 了其他模块，且这些模块只装在 3.10 环境下，直接用* *`python3`* *运行就会报错* *`ModuleNotFoundError`。*

### 方法二：使用虚拟环境

这是解决多版本冲突的**推荐做法**。无论你用原生 3.8 还是新装的 3.10，都应该养成用虚拟环境的习惯。它可以把项目依赖完全隔离在一个文件夹里。

```bash
# 1. 在当前目录下，基于 python3.10 创建一个名为 'venv310' 的虚拟环境
python3.10 -m venv venv310
# 2. 激活虚拟环境
source venv310/bin/activate
# 3. 查看当前环境（注意命令行最前面会多出一个 (venv310) 的前缀）
python --version  # 此时直接输入 python，它就是 3.10！
pip --version     # 此时直接输入 pip，它也是属于 3.10 的！
# 4. 在这个环境里随便装包，绝对不会污染系统的 Python 3.8/3等其它版本
pip install requests nmap python-nmap
# 5. 退出虚拟环境（回到系统默认的环境）
deactivate
```

### 方法三：修改工具的启动脚本

很多从 GitHub 下载的黑客工具，它的启动脚本（比如 `start.sh`）里面第一行可能硬编码了 `#!/usr/bin/env python3`。由于系统默认 python3 是 3.8，运行就会报错。
**解决办法：**
用 `vim` 或 `nano` 打开该工具的启动脚本，把第一行改成：

```bash
#!/usr/bin/env python3.10
```

或者直接在运行时强制指定：

```bash
python3.10 start.sh
```

***

## 善后清理(可选)

既然是源码编译，编译过程中产生了大量的中间文件（`.o` 文件等），大概会占用几百 MB 空间。安装成功后，可以放心地把 `/tmp` 下的源码目录删掉，**丝毫不影响已经安装好的 Python 3.10**。

```bash
cd ~
rm -rf /tmp/Python-3.10.13*
```

***

## 安装hackingtool

从 GitHub 下载 hackingtool 并解压到当前目录：
```bash
git clone https://github.com/Z4nzu/hackingtool.git
cd hackingtool
# 安装 rich 第三方模块
sudo python3.10 -m pip install rich
# 安装 curl 命令，用于下载文件
sudo apt install curl -y
# 创建软链接，将 curl 命令指向 /usr/sbin 目录，使sudo用户也能使用
sudo ln -sf /usr/bin/curl /usr/sbin/curl
# 执行安装脚本
sudo python3.10 install.py
# 安装完成后，你可以直接运行 hackingtool 命令打开工具
hackingtool
```
## 总结

1. 遇到 apt 装不上的情况，**源码编译 +** **`altinstall`** 是万能药。
2. python多版本下载与共存，避免系统默认版本被覆盖。
3. 把 **虚拟环境 (`venv`)** 刻进DNA里，它是解决多版本冲突、权限不足、依赖混乱的最优解。
   希望这篇指南能帮你彻底搞定 Ubuntu 下的 Python 版本管理问题并成功安装 hackingtool！如果觉得有用，欢迎点赞收藏\~

