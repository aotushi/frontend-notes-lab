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
