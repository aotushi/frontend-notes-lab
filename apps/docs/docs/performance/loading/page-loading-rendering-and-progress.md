# 页面加载、渲染、白屏与进度反馈

## 问题

输入 URL 到页面展示发生了什么？如何加快渲染、避免白屏、做加载进度条、理解重绘回流和渐进式渲染？

## 结论

页面加载可以按链路回答：

1. URL 解析、缓存检查、DNS、TCP/TLS。
2. 发起 HTTP 请求并接收 HTML。
3. 解析 HTML，发现 CSS、JS、图片、字体等资源。
4. 构建 DOM/CSSOM，布局、绘制、合成。
5. JS 执行、异步数据、框架挂载和水合。
6. 用户交互和后续更新。

优化方向：

- 减少关键资源体积和数量。
- 关键 CSS 内联或优先加载，非关键资源延后。
- JS 分包、`defer`、动态导入。
- 图片懒加载、响应式图片、稳定宽高。
- SSR/SSG/骨架屏减少白屏感。
- 避免强制同步布局和频繁重排。

## Demo

简单进度反馈：

```html
<progress id="progress" value="0" max="100"></progress>
```

```js
let value = 0;
const timer = setInterval(() => {
  value = Math.min(value + 8, 90);
  progress.value = value;
}, 200);

window.addEventListener('load', () => {
  clearInterval(timer);
  progress.value = 100;
});
```

IntersectionObserver 统计元素出现：

```js
const counts = new WeakMap();

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      counts.set(entry.target, (counts.get(entry.target) || 0) + 1);
    }
  }
});
```

面试回答：

> 页面性能要按网络、资源、解析、渲染、执行、交互链路拆。白屏优化包括减少关键资源、SSR/SSG、骨架屏、关键 CSS、延迟非关键 JS。重排是布局重新计算，重绘是像素重新绘制；频繁读写布局会造成 layout thrashing。进度条通常是体验反馈，真实进度要结合资源加载和业务状态。

## 参考来源

- [MDN: How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)
- [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
