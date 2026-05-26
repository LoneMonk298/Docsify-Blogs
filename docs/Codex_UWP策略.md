# Codex UWP 单独走 Clash Verge 代理技术记录

## 1. 背景与目标

在 Windows 环境下，Codex 桌面应用需要稳定访问 OpenAI 相关服务，但我希望代理只对 Codex 生效，不影响浏览器、微信、游戏等其他软件的正常直连网络。

本方案目标：

- 仅让 Codex 通过 Clash Verge 本地代理访问 OpenAI 服务。
- 保持系统其他应用默认直连，不启用全局代理或 TUN 接管。
- 解决 Codex 作为 UWP/AppContainer 应用时无法直接访问 `127.0.0.1` 本地代理端口的问题。
- 提供可验证、可复现、便于后续排障的配置和使用流程。

## 2. 问题根源

### 2.1 节点链路问题

部分香港节点对 OpenAI 相关域名或 `443` HTTPS 连接存在拦截、限流或 TLS 握手异常，常见表现包括：

- `schannel: failed to receive handshake`
- TLS 握手失败
- HTTPS 连接超时
- OpenAI 域名无法稳定访问

切换到新加坡、日本、美国等可用海外节点后，OpenAI 相关链路恢复正常。

### 2.2 Codex 的 UWP/AppContainer 限制

Codex 桌面应用运行在 Windows 应用沙箱环境中。该类应用默认受到 AppContainer 网络隔离限制，通常不能直接访问本机回环地址：

```text
127.0.0.1
localhost
::1
```

因此，即使 Clash Verge 已经在本机监听 `127.0.0.1:7890`，Codex 也可能无法直接连接该代理端口。

这不是 Clash 配置错误，而是 Windows 对 UWP/AppContainer 应用的回环访问限制。

### 2.3 使用诉求

需要实现：

```text
Codex -> 127.0.0.1:7890 -> Clash Verge -> 可用海外节点 -> OpenAI
```

同时保持：

```text
其他应用 -> 默认网络直连
```

因此不适合使用全局代理或 TUN 模式接管系统流量。

## 3. 方案原理

本方案由三部分组成：

1. Clash Verge 提供固定本地代理端口。
2. Windows 回环豁免允许 Codex 访问本机代理端口。
3. BAT 启动脚本只为 Codex 进程注入代理环境变量。

整体流量路径：

```text
Codex
  |
  | HTTP_PROXY / HTTPS_PROXY / ALL_PROXY
  v
127.0.0.1:7890
  |
  v
Clash Verge
  |
  v
新加坡 / 日本 / 美国等可用节点
  |
  v
OpenAI 服务
```

该方式只改变 Codex 进程的网络出口，不改变系统全局网络行为。

## 4. Clash Verge 配置要点

建议核心配置如下：

```yaml
mixed-port: 7890
mode: rule
allow-lan: false
external-controller: 127.0.0.1:9091

tun:
  enable: false
```

### 4.1 mixed-port

```yaml
mixed-port: 7890
```

固定 Clash 本地混合代理端口，方便脚本、`curl`、Codex 环境变量统一指向：

```text
127.0.0.1:7890
```

混合端口通常可同时兼容 HTTP 和 SOCKS5 代理请求。

### 4.2 rule 模式

```yaml
mode: rule
```

使用规则模式，按域名或规则分流。OpenAI 相关域名走代理，其余流量可按配置直连。

建议 OpenAI 相关域名走代理，例如：

```yaml
rules:
  - DOMAIN-SUFFIX,openai.com,PROXY
  - DOMAIN-SUFFIX,chatgpt.com,PROXY
  - DOMAIN-SUFFIX,oaiusercontent.com,PROXY
  - DOMAIN-SUFFIX,oaistatic.com,PROXY
  - DOMAIN-SUFFIX,auth0.com,PROXY
  - MATCH,DIRECT
```

实际策略组名称需按 Clash Verge 配置中的代理组名称调整，例如 `PROXY`、`Proxy`、`🚀 节点选择` 等。

### 4.3 关闭 allow-lan

```yaml
allow-lan: false
```

关闭局域网共享代理，避免局域网其他设备访问本机 Clash 代理端口，降低不必要的暴露面。

### 4.4 关闭 TUN

```yaml
tun:
  enable: false
```

TUN 会接管系统网络路由，容易变成全局代理或影响其他应用网络行为，不符合“仅 Codex 走代理”的目标。

当前方案使用“端口代理 + 进程环境变量”，可以更精准地只影响 Codex。

### 4.5 DNS 配置

DNS 配置建议区分国内外解析，避免 DNS 污染、解析异常或域名跳转失败。

重点是确保 OpenAI 相关域名在 Clash 规则内正确解析并走代理节点。

## 5. UWP 回环豁免

Codex 作为 UWP/AppContainer 应用，默认不能稳定访问本机回环地址。需要执行一次回环豁免：

```powershell
CheckNetIsolation LoopbackExempt -a -n=OpenAI.Codex_2p2nqsd0c76g0
```

执行后，Codex 可以访问：

```text
127.0.0.1:7890
localhost:7890
```

### 5.1 验证豁免状态

```powershell
CheckNetIsolation LoopbackExempt -s
```

如果列表中出现：

```text
OpenAI.Codex_2p2nqsd0c76g0
```

说明回环豁免已经生效。

### 5.2 权限影响说明

回环豁免只放开 UWP/AppContainer 应用访问本机回环网络的能力，不等于解除全部沙箱限制。

它不会赋予 Codex：

- 管理员权限
- 任意文件读写权限
- 绕过 Codex workspace sandbox 的能力
- 访问 OpenAI 账户后台的额外权限
- 绕过 Windows 文件系统权限的能力

它只影响网络路径：

```text
Codex -> 127.0.0.1 本地服务
```

## 6. BAT 启动脚本

通过 BAT 脚本为 Codex 单独注入代理环境变量。

示例：

```bat
@echo off
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
set ALL_PROXY=socks5://127.0.0.1:7890

start "" shell:AppsFolder\OpenAI.Codex_2p2nqsd0c76g0!App
```

作用：

- 只影响通过该脚本启动的 Codex 进程。
- 不修改系统全局代理。
- 不影响其他软件的网络行为。
- 同时设置 HTTP、HTTPS、SOCKS5 代理变量，提高兼容性。

如果普通权限启动后代理变量未生效，可以右键选择“以管理员身份运行”该脚本。
> [!WARNING] 注意事项
> `AppsFolder\OpenAI.Codex_2p2nqsd0c76g0!App` 为 Codex.exe 的启动文件路径，需要替换为实际路径。微软默> 认安装在 `C:\Program Files\WindowsApps\OPenAI.Codex_2p2nqsd0c76g0\app\Codex`。<br>
> 右键 Codex.exe 查看目标栏内的值。初次使用时，该路径无权限打开，需要进行相关操作。[参考资料](https://blog.csdn.net/qq_59866404/article/details/140476469)

## 7. 标准使用流程

### 7.1 启动 Clash Verge

确认：

- Clash Verge 正常运行。
- 节点选择为新加坡、日本、美国等可用节点。
- 不使用香港节点。
- TUN 模式关闭。
- 本地 mixed-port 为 `7890`。

### 7.2 首次执行回环豁免

使用管理员 PowerShell 执行：

```powershell
CheckNetIsolation LoopbackExempt -a -n=OpenAI.Codex_2p2nqsd0c76g0
```

该步骤通常只需执行一次。

### 7.3 验证代理链路

使用：

```cmd
curl -x http://127.0.0.1:7890 https://api.openai.com
```

如果返回 OpenAI 相关响应，说明：

- Clash 本地端口可用。
- 当前节点可访问 OpenAI。
- 本机到代理再到 OpenAI 的链路正常。

再验证回环豁免：

```powershell
CheckNetIsolation LoopbackExempt -s
```

确认 Codex 包名在豁免列表中。

### 7.4 使用 BAT 启动 Codex

通过配置好的 BAT 脚本启动 Codex。

此后 Codex 流量会通过 Clash 本地代理转发，其他应用仍按原系统网络配置运行。

## 8. 常见问题与判断

### 8.1 `schannel: failed to receive handshake`

原因：

当前节点对 OpenAI HTTPS/TLS 链路不稳定，常见于香港节点。

处理：

切换到新加坡、日本、美国等可用节点后重试。

### 8.2 `443` 端口连接超时

原因：

节点出口到 OpenAI 的 HTTPS 连接被阻断或质量较差。

处理：

更换节点，并重新执行：

```cmd
curl -x http://127.0.0.1:7890 https://api.openai.com
```

### 8.3 `curl` 正常，但 Codex 仍无法联网

可能原因：

- Codex 没有通过 BAT 脚本启动。
- 环境变量没有注入到 Codex 进程。
- UWP 回环豁免未生效。
- Clash 规则未覆盖 Codex 实际访问的 OpenAI 相关域名。

处理：

1. 确认回环豁免：

```powershell
CheckNetIsolation LoopbackExempt -s
```

2. 使用 BAT 脚本重新启动 Codex。
3. 检查 Clash 日志，看 Codex 相关请求是否进入代理。

### 8.4 出现 `421 Misdirected Request`

如果通过代理访问 `https://api.openai.com` 返回 `421 Misdirected Request`，通常说明请求已经成功到达 OpenAI 边缘服务。

这类响应可作为链路已打通的信号，一般不需要处理。

### 8.5 Codex 内“使用情况和计费”页面无法加载

该问题通常不代表 Codex 主功能不可用，也不代表沙箱权限异常。

可能原因：

- 账户设置页面依赖的域名没有全部走代理。
- WebView 登录态异常。
- 组织或账户权限不足。
- 账单相关服务接口访问失败。

只要 Codex 能正常对话、执行任务、访问模型，通常不影响日常使用。

## 9. 安全注意事项

回环豁免会让 Codex 能访问本机 `127.0.0.1` 上的服务。因此需要注意：

- 不要在本机无鉴权暴露敏感管理服务。
- 数据库、调试面板、本地 API 尽量设置认证。
- Clash 的 `allow-lan` 建议保持关闭。
- 只在确有需要时对指定应用开启回环豁免。

回环豁免不是提权，它只是允许指定 UWP/AppContainer 应用访问本机回环网络。

## 10. 最终结论

本方案通过：

- Clash Verge 提供固定本地代理端口；
- UWP 回环豁免解除 Codex 访问 `127.0.0.1` 的限制；
- BAT 脚本为 Codex 单独注入代理环境变量；
- 选择新加坡、日本、美国等可用节点避开香港节点链路问题；

实现了：

```text
Codex 单独走代理，系统其他应用保持直连。
```

该方案不会扩大 Codex 的文件系统权限、管理员权限或账户权限，只改变 Codex 的网络出口路径。
