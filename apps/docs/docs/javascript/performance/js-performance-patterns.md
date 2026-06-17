# JavaScript 性能模式

## 问题

JavaScript 性能优化应该从哪些层面回答？如何判断 CPU 占用高、长任务、内存泄漏、频繁 DOM 操作、过度同步布局、事件高频触发和大数据处理问题？防抖、节流、懒执行、缓存、Web Worker 分别适合什么场景？

## 结论

### 理解路径

性能题不要直接罗列技巧。先定位瓶颈属于加载、执行、渲染、内存还是网络，再选择对应手段。JavaScript 本身常见瓶颈是主线程长任务、重复计算、频繁布局读写、事件高频触发、内存持续增长和大对象序列化。

### JavaScript 什么时候会占用 CPU？

1. 大循环、复杂递归、排序、解析、加密、压缩等计算密集任务。
2. 高频事件中做重计算，例如 `scroll`、`resize`、`mousemove`。
3. 微任务链过长，导致主线程长时间不让出。
4. 频繁 DOM 读写触发布局计算。
5. JSON 解析、字符串拼接、正则回溯消耗过高。
6. 内存泄漏导致 GC 频繁运行。

### 如何排查页面 CPU 占用高？

1. 用 Performance 面板录制问题操作。
2. 查看 Main 线程长任务和函数调用火焰图。
3. 区分脚本执行、样式布局、绘制、GC 的耗时。
4. 定位高频调用或单次耗时长的函数。
5. 用采样日志或性能标记缩小范围。
6. 优化后用同样操作重新录制对比。

### 如何减少主线程长任务？

1. 拆分长任务，让浏览器有机会处理输入和渲染。
2. 把非关键任务延后到空闲时间。
3. 把 CPU 密集任务放到 Web Worker。
4. 减少重复计算，使用缓存或预计算。
5. 用虚拟列表减少一次性 DOM 数量。

### 防抖和节流有什么区别？

| 策略 | 行为 | 场景 |
| --- | --- | --- |
| 防抖 debounce | 多次触发只在停止后一段时间执行 | 搜索输入、表单校验、窗口大小变化后的最终计算 |
| 节流 throttle | 固定时间窗口最多执行一次 | 滚动位置上报、拖拽、鼠标移动、进度同步 |

防抖关注“最后一次”，节流关注“固定频率”。

### 如何优化 DOM 相关性能？

1. 批量读取布局信息，再批量写入样式。
2. 避免在循环中交替读写 `offsetWidth`、`getBoundingClientRect()` 等布局属性。
3. 大批量插入节点时使用 `DocumentFragment` 或一次性渲染。
4. 列表很长时使用虚拟列表。
5. 动画优先使用 `transform` 和 `opacity`。
6. 高频事件使用 passive listener、节流或 rAF 对齐。

### 缓存和记忆化适合什么？

缓存适合纯函数、重复输入、计算成本高且结果可复用的场景。缓存不适合无限增长或输入空间极大的场景；长期缓存要有容量、过期或弱引用策略。

### 什么时候使用 Web Worker？

当任务计算量大、与 DOM 无关、会明显阻塞主线程时，可以放到 Worker。典型场景包括大 JSON 解析、数据聚合、图像处理、压缩解压、加密、复杂搜索。需要注意 Worker 通信和数据复制成本，较小任务放进 Worker 可能得不偿失。

### 如何优化循环和数组处理？

1. 先降低算法复杂度，再考虑微优化。
2. 避免在循环里重复计算不变量。
3. 大数组链式调用可读性高，但会产生中间数组；热点路径可以合并遍历。
4. 需要提前退出时用 `for...of`、`some`、`every`、`find`，不要强行 `map`。
5. 不要在性能无证据时牺牲可读性。

## Demo

### 防抖

```js
function debounce(fn, delay) {
  let timer

  return function debounced(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

### 用 rAF 对齐滚动更新

```js
let scheduled = false

window.addEventListener('scroll', () => {
  if (scheduled) return
  scheduled = true

  requestAnimationFrame(() => {
    scheduled = false
    updateScrollIndicator(window.scrollY)
  })
}, { passive: true })
```

### 性能标记

```js
performance.mark('task:start')
runExpensiveTask()
performance.mark('task:end')
performance.measure('task', 'task:start', 'task:end')
```

## 参考来源

- [MDN: Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
- [MDN: Long Tasks API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming)
- [web.dev: Optimize long tasks](https://web.dev/articles/optimize-long-tasks)
- [web.dev: Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
