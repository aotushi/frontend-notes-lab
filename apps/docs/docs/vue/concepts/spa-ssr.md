# SPA、SSR 与 Vue 性能优化

## 问题

SPA 和 MPA 有什么区别？什么是 SSR？Vue 有哪些性能优化手段？

## 结论

### SPA vs MPA

| 对比 | SPA（单页应用） | MPA（多页应用） |
| --- | --- | --- |
| 页面数量 | 一个 HTML，JS 控制路由 | 多个 HTML，服务端路由 |
| 页面切换 | 无刷新，JS 局部更新 | 完整页面请求/刷新 |
| 首屏速度 | 慢（需加载全量 JS） | 快（各页面独立） |
| SEO | 不友好（内容由 JS 渲染） | 友好 |
| 用户体验 | 流畅（无白屏跳转） | 有跳转感 |
| 状态管理 | 前端统一管理 | 跨页面状态难共享 |
| 适合场景 | 管理后台、应用类产品 | 内容型网站、落地页 |

SPA 首屏优化：路由懒加载、预渲染、SSR。

### Vue SSR（服务端渲染）

普通 SPA 的渲染在浏览器完成，SSR 在服务端执行 Vue 代码，生成完整 HTML 字符串返回给浏览器：

```
浏览器请求 → 服务端执行 Vue render → 返回 HTML 字符串
→ 浏览器展示（首屏快）→ hydration（激活交互）
```

**优点**：
- 首屏更快（用户不用等 JS 加载执行）
- SEO 友好（搜索引擎直接拿到完整 HTML）

**缺点**：
- 服务端压力增大（每次请求都执行渲染）
- 开发限制：`mounted` 等生命周期不在服务端执行，不能直接访问 `window`/`document`
- 需要 Node.js 服务器

**实践**：直接用 Nuxt.js（基于 Vue 的 SSR 框架），封装了所有配置。

**何时用 SSR**：电商商品页（SEO+首屏）、内容资讯类网站。后台管理系统不需要。

### Vue 性能优化

**（1）编码阶段**

- **减少 data 中的数据量**：data 中每个属性都会生成 getter/setter 并收集 watcher，纯展示数据用 `Object.freeze()` 冻结，跳过响应式处理
- **`v-if` vs `v-show`**：频繁切换用 `v-show`（复用 DOM），条件很少变化用 `v-if`（节省内存）
- **`v-for` 不与 `v-if` 连用**：把过滤逻辑移到 `computed`，避免每次渲染都遍历全部再过滤

```js
// ❌ v-for + v-if 连用
// ✅ 用 computed 提前过滤
computed: {
  activeUsers() { return this.users.filter(u => u.isActive) }
}
```

- **`v-for` 加稳定唯一 `key`**，不用 index 或随机数
- **`v-for` 绑定事件用事件代理**，把监听器挂到父元素而非每个列表项
- **路由懒加载 + 异步组件**：只在首次访问时才加载对应 chunk

```js
{ path: '/about', component: () => import('./views/About.vue') }
```

- **`keep-alive`**：缓存频繁切换的页面/组件，避免重复挂载卸载
- **防抖/节流**：高频事件（scroll、input、resize）加防抖或节流
- **第三方模块按需引入**：`import { Button } from 'vant'` 而非全量导入
- **图片懒加载**：`v-lazy` 或 `IntersectionObserver`，只在进入视口时加载
- **长列表虚拟滚动**：`vue-virtual-scroller`，只渲染可视区域 DOM

**（2）SEO 优化**

- **预渲染**（`prerender-spa-plugin`）：构建时生成静态 HTML，适合页面数量少且内容固定的场景，比 SSR 部署更简单
- **SSR**：服务端运行 Vue，返回完整 HTML，适合内容动态、SEO 要求高的场景（见上节）

**（3）打包优化**

- **Tree Shaking + Scope Hoisting**：摇掉未使用代码，合并模块减少作用域
- **Code Splitting**：路由懒加载自动分包，减小首屏体积
- **CDN 加载第三方库**：Vue、axios 等走 CDN，主 bundle 更小
- **splitChunks**：抽离公共依赖为单独 chunk，利用缓存
- **gzip/Brotli 压缩**：webpack `compression-webpack-plugin` 生成 `.gz`，Nginx 开启 `gzip_static`
- **sourceMap 策略**：生产环境用 `nosources-source-map` 或关闭，减小产物体积

**（4）用户体验**

- **骨架屏**：首屏加载时展示占位骨架，减少用户等待感
- **PWA**（Service Worker）：离线缓存静态资源，二次访问秒开
- **HTTP 缓存**：合理设置 `Cache-Control`，配合文件名 hash 做长期缓存

## 参考来源

- [Vue: 服务端渲染指南](https://cn.vuejs.org/guide/scaling-up/ssr.html)
- [Nuxt.js](https://nuxt.com/)
- [Vue: 性能优化](https://cn.vuejs.org/guide/best-practices/performance.html)
