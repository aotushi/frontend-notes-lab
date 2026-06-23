# Node.js 调试与抓包工具

## 问题

Node.js 程序怎么调试？除了 `console.log` 还有哪些手段？抓包工具 Charles 的 map local / map remote 分别解决什么问题？

## 结论

### 理解路径

调试分两类：一类是调 Node 进程本身的逻辑（断点、内存、性能），靠 Node 内置的 inspector；另一类是调前后端之间的网络请求（改返回、换接口地址），靠 Charles / Fiddler 这类代理抓包工具。

### Node.js 怎么调试？

最原始的是 `console.log`，但生产排查和复杂逻辑要用真正的断点调试。Node 内置 V8 Inspector 协议，用 `--inspect` 启动即可：

```bash
node --inspect app.js          # 启动调试，等待调试器连接
node --inspect-brk app.js      # 在第一行就断住，适合调试启动逻辑
```

启动后有几种连接方式：

1. **Chrome DevTools**：打开 `chrome://inspect`，会发现本地 Node 进程，点击即可像调试网页一样打断点、看调用栈、堆快照。
2. **VS Code**：配置 `launch.json` 的 `node` 类型，或直接用「JavaScript Debug Terminal」，支持断点、条件断点、变量监视。
3. **`node:inspector` 模块**：在代码里编程式开启调试会话。

其它常用手段：

- 性能分析：`node --prof` 生成 V8 profile，或用 DevTools 的 Performance 录制 CPU 火焰图。
- 内存泄漏：用 DevTools Memory 面板录制堆快照，对比 retained size（思路与[内存模型与垃圾回收](/javascript/execution-model/memory-and-garbage-collection)一致）。
- 日志增强：用 `debug` 库按命名空间控制输出，比裸 `console.log` 更可控。

### Charles 的 map local 和 map remote 是做什么的？

Charles 是一个 HTTP 代理抓包工具，浏览器 / App 的请求先经过它，于是它能查看、修改请求和响应。`map local` 和 `map remote` 是它最常用的两个「请求改写」功能，前端联调时非常实用：

| 功能 | 作用 | 典型场景 |
| --- | --- | --- |
| map local | 把某个请求的响应**映射到本地文件**，用本地内容替代真实返回 | 后端接口还没好，用本地 JSON 模拟返回；构造异常 / 边界数据复现 bug |
| map remote | 把请求**转发到另一个地址**（换 host / 端口 / 路径） | 让线上页面请求打到本地或测试环境的接口，调试线上问题 |

简单说：**map local 换的是「返回内容」，map remote 换的是「请求去向」**。

- 用 map local 时，Charles 拦截到匹配的 URL，直接返回你指定的本地文件，请求根本不会发到服务器。
- 用 map remote 时，请求仍然真实发出，但目标被改写，比如把 `https://api.prod.com/user` 转发到 `http://localhost:3000/user`，从而用线上环境的页面调本地的接口。

抓 HTTPS 流量需要在客户端信任 Charles 的根证书，否则只能看到加密内容。功能类似的工具还有 Fiddler、Whistle（基于 Node，可用规则文件配置，前端常用）。

## 参考来源

- [Node.js: Debugging](https://nodejs.org/en/learn/getting-started/debugging)
- [Chrome DevTools: Debug Node.js](https://developer.chrome.com/docs/devtools/javascript/)
- [Charles: Map Local](https://www.charlesproxy.com/documentation/tools/map-local/)
- [Charles: Map Remote](https://www.charlesproxy.com/documentation/tools/map-remote/)
