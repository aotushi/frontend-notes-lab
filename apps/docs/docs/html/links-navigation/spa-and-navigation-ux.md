# SPA、面包屑与导航体验

## 问题

什么是单页面应用 SPA？面包屑导航有什么作用？列表页跳转详情页时接口很慢，前端如何优化体验？如何判断用户长时间未操作并跳转？

## 结论

SPA 是 Single Page Application，核心特征是首次加载一个 HTML 入口，后续页面切换主要由前端路由和 JavaScript 控制，不再每次完整刷新 HTML 文档。

SPA 优点是页面切换顺滑、适合复杂交互应用；缺点是首屏资源可能较大，SEO、可访问性、错误状态、加载状态、浏览器历史和滚动恢复都需要额外设计。

面包屑导航用于表达当前位置和层级路径：

```html
<nav aria-label="面包屑">
  <ol>
    <li><a href="/">首页</a></li>
    <li><a href="/products">商品</a></li>
    <li aria-current="page">机械键盘</li>
  </ol>
</nav>
```

列表页跳转详情页接口很慢时，可以从这些方向优化：

- 列表页预取详情页关键数据。
- 点击后立即展示骨架屏或保留列表上下文。
- 路由切换前预加载详情页 JS chunk。
- 乐观展示列表已有字段，再补充详情接口数据。
- 用 HTTP 缓存、CDN、服务端聚合降低接口耗时。
- 详情页失败时提供重试和返回入口。

判断用户长时间无操作：

```js
let timer;

function resetIdleTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    location.href = '/timeout';
  }, 60 * 60 * 1000);
}

['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((type) => {
  window.addEventListener(type, resetIdleTimer, { passive: true });
});

resetIdleTimer();
```

实际项目还要考虑后台标签页、移动端休眠、多标签页同步、服务端 session 过期时间等问题。

## Demo

```js
router.beforeEach(async (to) => {
  if (to.name === 'product-detail') {
    preloadProductDetailChunk();
    prefetchProduct(to.params.id);
  }
});
```

面试回答：

> SPA 是前端路由驱动的单页应用，切换体验好，但首屏、SEO、可访问性、错误和加载状态都要额外设计。面包屑用于表达当前位置和层级。详情页接口慢时，可以预取数据、预加载代码、用骨架屏、复用列表数据做首屏、做好失败重试。用户空闲跳转可以监听键盘、鼠标、触摸、滚动等事件重置定时器。

## 参考来源

- [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
