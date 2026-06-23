# Node.js 异步 IO 模型与进程

## 问题

Node.js 的单线程是怎么做到高并发的？libuv 在其中扮演什么角色？Node 事件循环和浏览器有什么不同？子进程有哪些创建方式、进程之间如何通信？在前后端分工里 Node 通常负责哪一部分？

## 结论

### 理解路径

Node 的并发能力来自「JS 单线程 + 底层多路复用 / 线程池」的分工：开发者写的 JS 跑在单线程上，真正耗时的 IO 交给 libuv 调度。理解 Node 先理解这条边界，再谈事件循环阶段和多进程扩展。

### 前后端分工里 Node 通常负责什么？

Node 在团队里一般承担「贴近前端、IO 密集、需要快速迭代」的那部分，而不是替代传统后端：

| 适合 Node 的工作 | 通常仍由后端（Java / Go 等）负责 |
| --- | --- |
| BFF：聚合多个后端接口、裁剪字段、适配多端 | 核心业务逻辑与强事务 |
| SSR / 同构渲染 | 关系型数据的最终落地与一致性 |
| 网关、代理、Mock、灰度 | CPU 密集型计算（大量加解密、图像处理） |
| 构建工具、脚手架、CI 脚本 | 高安全等级的资金、风控链路 |
| 实时通信（WebSocket / IM）、轻量服务 | 大数据、离线计算 |

一句话概括：Node 擅长 IO 密集和高并发连接，前端团队用它做「编排和适配」；CPU 密集和核心数据交给更适合的后端语言。

### libuv 是什么？Node 的异步 IO 怎么工作？

Node 所谓「单线程」只指执行 JS 的主线程。真正的 IO 由 [libuv](https://libuv.org/) 负责调度，它给 Node 提供了事件循环和一个线程池：

1. **网络 IO**（TCP / UDP）走操作系统的多路复用机制：Linux 的 `epoll`、macOS 的 `kqueue`、Windows 的 `IOCP`，不占用线程池。
2. **文件 IO、DNS 解析、`crypto`、`zlib`** 等没有统一异步系统调用的操作，交给 libuv 的线程池执行（默认 4 个线程，可用环境变量 `UV_THREADPOOL_SIZE` 调整，最大 1024）。

所以一个 Node 进程可以同时维持大量网络连接，主线程只在数据就绪时被回调唤醒，不会为每个连接阻塞一个线程。

```js
// 线程池大小必须在用到线程池的模块（fs / crypto 等）首次调用前设置
process.env.UV_THREADPOOL_SIZE = 8
```

### Node 事件循环和浏览器有什么不同？

浏览器事件循环只区分宏任务和微任务；Node 的事件循环由 libuv 划分成几个有序阶段，每个阶段处理一类回调：

| 阶段 | 处理内容 |
| --- | --- |
| timers | 到期的 `setTimeout` / `setInterval` 回调 |
| pending callbacks | 上一轮延迟到本轮的系统回调 |
| poll | 等待并处理 IO 事件，是事件循环的主要停留点 |
| check | `setImmediate` 回调 |
| close callbacks | `close` 事件回调，如 socket 关闭 |

两处 Node 特有的细节：

1. `process.nextTick()` 不属于任何阶段，它的队列在**每个阶段切换之间**都会被清空，优先级高于 Promise 微任务。
2. `setImmediate()`（check 阶段）和 `setTimeout(fn, 0)`（timers 阶段）的先后在主模块里不确定，但在一个 IO 回调内部，`setImmediate` 一定先于 `setTimeout`。

```js
const fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immediate'))
})
// IO 回调里：先 immediate，后 timeout
```

微任务（Promise、`queueMicrotask`）和 `process.nextTick` 在每个阶段的回调执行完后清空，这点和浏览器一致，只是 Node 多了 `nextTick` 这条更高优先级的队列。

### 子进程有哪些创建方式？进程之间如何通信？

Node 主线程是单线程，要利用多核或隔离崩溃风险，就需要多进程 / 多线程。`child_process` 提供四个 API：

| API | 特点 | 适合场景 |
| --- | --- | --- |
| `spawn` | 流式返回 stdout / stderr，不缓冲 | 输出量大、运行时间长的命令 |
| `exec` | 走 shell，缓冲完整输出后一次性返回 | 简短命令，输出小 |
| `execFile` | 不经过 shell，直接执行可执行文件 | 比 `exec` 更安全，避免 shell 注入 |
| `fork` | 专门派生 Node 脚本，自带 IPC 通道 | 跑 Node 子任务并需要通信 |

在它们之上还有两个常用模块：

- `cluster`：基于 `fork`，让多个 worker 进程共享同一个监听端口，由主进程分发连接，用于充分利用多核（详见[部署与运维](/nodejs/deployment/deploy-and-ops)）。
- `worker_threads`：创建的是线程而非进程，可通过 `SharedArrayBuffer` 共享内存，适合 CPU 密集任务，开销比进程小。

进程间通信（IPC）的常见方式：

1. `fork` / `cluster` 自带的消息通道：子进程 `process.on('message')`，父进程 `child.send(data)`，数据按结构化克隆算法序列化。
2. 标准流 `stdio`：父子之间通过 stdin / stdout 传数据。
3. 共享 socket、命名管道或文件。
4. 跨机器时走外部中间件，如 Redis、消息队列。

```js
// parent.js
const { fork } = require('child_process')
const child = fork('./worker.js')

child.send({ type: 'task', payload: 1 })
child.on('message', (msg) => {
  console.log('结果：', msg)
})

// worker.js
process.on('message', (msg) => {
  if (msg.type === 'task') {
    process.send({ ok: true, value: msg.payload * 2 })
  }
})
```

选型口诀：调外部命令用 `spawn` / `execFile`，跑 Node 子任务并通信用 `fork`，多核扩容用 `cluster`，CPU 密集且要共享内存用 `worker_threads`。

## 参考来源

- [Node.js: The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [libuv 官方文档](https://libuv.org/)
- [Node.js: Child process](https://nodejs.org/api/child_process.html)
- [Node.js: Cluster](https://nodejs.org/api/cluster.html)
- [Node.js: Worker threads](https://nodejs.org/api/worker_threads.html)
