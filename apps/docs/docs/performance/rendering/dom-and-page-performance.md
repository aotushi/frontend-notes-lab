# DOM、渲染与页面性能优化

## 问题

页面为什么需要性能优化？大量 DOM、图片、脚本、Canvas 或长列表如何优化？

## 结论

性能优化要先明确瓶颈：网络、资源体积、主线程执行、DOM 规模、样式布局、绘制合成、缓存策略、服务端响应都有可能影响体验。面试回答最好按链路拆，而不是只列“懒加载、节流、防抖”。

常见方向：

| 场景 | 优化重点 |
| --- | --- |
| 图片很多 | 响应式图片、懒加载、压缩、现代格式、占位尺寸 |
| DOM 很多 | 减少节点数量、批量更新、虚拟列表、分页或窗口化 |
| 频繁 DOM 操作 | 读写分离、缓存选择器结果、避免同步布局抖动 |
| 10 万级列表 | 虚拟滚动，只渲染视口附近数据 |
| Canvas 绘制 | 降低绘制频率、离屏缓存、按需重绘、控制像素比 |
| 脚本执行慢 | 分包、延迟加载、Web Worker、减少长任务 |
| 首屏慢 | 关键资源优先级、SSR/预渲染、骨架屏、减少阻塞资源 |

HTML 渲染和 Canvas 渲染没有绝对谁更快。HTML/DOM 适合语义内容、表单、可访问性和可维护布局；Canvas 适合大量自绘图形、游戏、图表和像素级绘制。Canvas 牺牲了浏览器原生可访问性和 DOM 结构，不能为了“性能”盲目替换。

### 回流（重排）与重绘

**回流**：渲染树中元素的尺寸、位置或结构发生变化，浏览器需要重新计算布局，影响当前元素及周围元素。

**重绘**：元素外观变化，但不影响布局位置，浏览器只需重新绘制该元素。

> 触发回流必然触发重绘；触发重绘不一定触发回流。

**常见触发回流的操作：**
- 页面首次渲染、浏览器窗口大小改变
- 元素的尺寸、位置、字体大小变化
- 添加或删除可见 DOM 元素
- 激活 CSS 伪类（如 `:hover`）
- 读取某些布局属性（`offsetWidth`、`scrollTop`、`getBoundingClientRect` 等）——触发强制同步布局

**常见触发重绘的属性：**
`color`、`background-color`、`visibility`、`outline`、`border-radius`、`box-shadow` 等。

**减少回流与重绘的措施：**

1. 尽量在低层级 DOM 节点操作，减少影响范围
2. 避免使用 `table` 布局，一处改动可能引发整表重排
3. 批量修改样式：用切换 class 代替逐条修改 inline style
4. 将多个 DOM 读操作或写操作放在一起，避免读写穿插（读写分离利用**渲染队列**）
5. 使用 `DocumentFragment` 在内存中批量操作后再一次性插入
6. 将元素设为 `display: none` 后操作，操作完毕再显示（`none` 状态不触发回流重绘）
7. 动画元素设为 `position: absolute` 或 `fixed`，脱离文档流，避免影响其他元素
8. 优先使用 `transform`、`opacity` 制作动画，走合成阶段，不触发布局和绘制

**浏览器渲染队列机制**：浏览器会把所有回流、重绘操作收集进队列，达到数量或时间阈值后批量处理，将多次操作压缩为一次。但读取布局信息（`offsetWidth` 等）会强制立即刷新队列，所以读写穿插会绕过此优化。

**DocumentFragment 的价值**：

`DocumentFragment` 是一个不在真实 DOM 树中的轻量文档节点，对其进行的 DOM 操作不触发重排重绘。将所有节点操作在 Fragment 上完成后，一次性插入文档，减少重排次数。

```js
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li')
  li.textContent = `item ${i}`
  fragment.appendChild(li)
}
list.appendChild(fragment)  // 只触发一次回流
```

### 如何优化动画？

动画需要频繁操作 DOM 或样式，容易造成性能问题。主要优化手段：

- 将动画元素的 `position` 设为 `absolute` 或 `fixed`，使其脱离文档流，回流时不影响其他元素
- 优先使用 `transform` 和 `opacity` 做动画，这两个属性的变化只走合成阶段（Compositing），不触发布局（Layout）和绘制（Paint）
- 配合 `will-change: transform` 提示浏览器提前为元素创建独立合成层
- 用 `requestAnimationFrame` 替代 `setTimeout`/`setInterval`，与屏幕刷新率同步，避免掉帧

### documentFragment 是什么？用它跟直接操作 DOM 的区别是什么？

`DocumentFragment` 是一个轻量的文档节点，不属于真实 DOM 树，对其进行的 DOM 操作**不会触发重排和重绘**。

当把 `DocumentFragment` 插入文档时，插入的是它的所有子孙节点，而非 `DocumentFragment` 本身。

**与直接操作 DOM 的区别：**

直接在文档中频繁插入/修改节点，每次操作都可能触发回流。使用 `DocumentFragment` 则是在内存中完成所有操作后，**一次性**插入到文档，只触发一次回流。

```js
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li')
  li.textContent = `item ${i}`
  fragment.appendChild(li)
}
document.getElementById('list').appendChild(fragment) // 只触发一次回流
```

### 节流与防抖（高频事件性能优化）

高频触发的事件（`scroll`、`resize`、`mousemove`、输入框 `input` 等）若不控制回调频率，会造成主线程过载。

**防抖（debounce）**：事件停止触发 n 毫秒后才执行一次。适合**等待用户输入完成后响应**的场景：
- 搜索框联想词（停止输入后再请求）
- 表单验证（停止输入后校验）
- 防止按钮多次点击重复提交

**节流（throttle）**：固定时间内最多执行一次。适合**需要持续响应但限制频率**的场景：
- 滚动事件 `scroll`（虚拟列表位置更新）
- 窗口缩放 `resize`（重新计算布局）
- 拖拽事件（限制位置更新频率）
- 动画帧控制（避免超过屏幕刷新率）

| 特性 | 防抖 | 节流 |
| --- | --- | --- |
| 执行时机 | 停止触发 n 毫秒后 | 每隔 n 毫秒至多执行一次 |
| 适用场景 | 等最终状态 | 持续过程中定频响应 |
| 典型场景 | 搜索联想、表单验证 | scroll、resize、拖拽 |

> 实现代码见 [javascript/handwritten/common-implementations](/javascript/handwritten/common-implementations)（含时间戳版/定时器版）。

## Demo

虚拟列表的核心思路是只渲染可见区：

```js
const rowHeight = 36;
const visibleCount = Math.ceil(container.clientHeight / rowHeight) + 6;

function render(scrollTop) {
  const start = Math.floor(scrollTop / rowHeight);
  const visibleItems = rows.slice(start, start + visibleCount);

  list.style.transform = `translateY(${start * rowHeight}px)`;
  list.innerHTML = visibleItems
    .map((item) => `<li style="height:${rowHeight}px">${item.name}</li>`)
    .join('');
}
```

DOM 批量更新时，避免在循环中交替读布局和写样式：

```js
const widths = cards.map((card) => card.offsetWidth);

cards.forEach((card, index) => {
  card.style.setProperty('--w', `${widths[index]}px`);
});
```

面试回答：

> 页面性能优化要从加载、执行、渲染和交互四段看。图片用懒加载、响应式资源和压缩；长列表用虚拟滚动；DOM 更新要批量处理并避免 layout thrashing；脚本要分包和延迟非关键代码；Canvas 适合大量自绘，但不替代语义 DOM。最终要用 Performance、Lighthouse、Core Web Vitals 数据验证。

## 参考来源

- [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)
- [web.dev: Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- [MDN: Lazy loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading)
