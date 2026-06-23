# Vue Router

### `$router` vs `$route`

| | `$router` | `$route` |
| --- | --- | --- |
| 是什么 | Vue Router 实例（路由控制器） | 当前激活路由的信息对象（只读） |
| 作用 | 导航：`push` / `replace` / `go` / `back` | 读取：`path` / `params` / `query` / `name` / `meta` |

```js
// 编程式导航
this.$router.push('/user/1')
this.$router.replace({ name: 'Home' })

// 读取当前路由信息
this.$route.params.id     // 动态路由参数
this.$route.query.keyword // 查询参数
```

### 路由传参方式

**1. 动态路由参数（params）**

路径定义中用 `:` 声明参数，URL 不含查询符：

```js
// 路由定义
{ path: '/user/:id', component: User }

// 导航（必须用 name）
router.push({ name: 'User', params: { id: 123 } })

// 读取
this.$route.params.id // '123'
```

> ⚠️ 使用 `path` 跳转时 `params` 会被忽略，改用 `query`。刷新页面 params 会丢失（URL 没有对应路径时）。

**2. 查询参数（query）**

参数追加在 URL 问号后，刷新页面不丢失：

```js
router.push({ path: '/search', query: { keyword: 'vue', page: 1 } })
// URL: /search?keyword=vue&page=1

this.$route.query.keyword // 'vue'
```

**3. 状态传参（state，Vue Router 4）**

```js
router.push({ path: '/order', state: { orderId: 123 } })
// 通过 history.state 访问，不显示在 URL 中
```

### hash vs history 路由模式

| 对比 | hash 模式 | history 模式 |
| --- | --- | --- |
| URL 形式 | `example.com/#/user/1` | `example.com/user/1` |
| 实现原理 | `location.hash` + `hashchange` 事件 | HTML5 History API：`pushState` / `popState` |
| 服务端配置 | 无需配置（`#` 后的内容不发给服务器） | 需要将所有路径返回 `index.html` |
| SEO | 不友好（搜索引擎不抓 hash 部分） | 友好 |
| 刷新行为 | 正常（hash 不触发页面请求） | 直接访问 `/user/1` 需服务端配合 |

history 模式服务端配置（Nginx 示例）：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 动态路由

**用法 1 — 路径参数匹配**：

```js
{ path: '/user/:id', component: User }

// 同一组件，参数变化时触发 watch 而非重新挂载
watch(() => route.params.id, (newId) => fetchUser(newId))
```

**用法 2 — 运行时动态添加路由**（权限路由常见做法）：

```js
// 根据用户权限动态注册路由
const adminRoute = { path: '/admin', component: Admin, meta: { requiresAuth: true } }
router.addRoute(adminRoute)
```

**路由守卫**（配合动态路由做权限控制）：

```js
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})
```

### 路由懒加载

默认情况下路由组件会在初始加载时全部打包进来，懒加载让每个路由的组件只在首次访问时才下载：

```js
// 静态导入（不懒加载）
import User from '@/views/User.vue'

// 动态导入（懒加载，推荐）
const User = () => import('@/views/User.vue')

const router = new VueRouter({
  routes: [{ path: '/user', component: User }]
})
```

配合 webpack magic comment 可以将多条路由打包进同一个 chunk：

```js
const User = () => import(/* webpackChunkName: "user" */ '@/views/User.vue')
const Profile = () => import(/* webpackChunkName: "user" */ '@/views/Profile.vue')
```

### 导航守卫

导航守卫分三类，按触发范围不同选择：

**1. 全局守卫**（`router.*`）

```js
// 前置守卫 — 最常用，做登录拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})

// 后置钩子 — 无 next，常用于切换后滚动到顶部
router.afterEach((to, from) => {
  window.scrollTo(0, 0)
})
```

**2. 路由独享守卫**（`beforeEnter`）

```js
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from, next) => {
    // 只对这条路由生效
    next()
  }
}
```

**3. 组件内守卫**

```js
export default {
  beforeRouteEnter(to, from, next) {
    // 进入前，此时组件实例尚未创建，无法用 this
    next(vm => { /* 通过回调访问 vm */ })
  },
  beforeRouteUpdate(to, from, next) {
    // 当前路由改变但组件被复用（如 /user/1 → /user/2）
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 离开前，可用于提示"确认离开？"
    next()
  }
}
```

### 完整导航解析顺序

从 A 组件离开、第一次进入 B 组件时，钩子触发顺序：

1. `beforeRouteLeave`（A 的组件内守卫）
2. `beforeEach`（全局前置）
3. `beforeRouteUpdate`（复用组件中）
4. `beforeEnter`（B 路由独享）
5. 解析异步路由组件
6. `beforeRouteEnter`（B 的组件内守卫）
7. `beforeResolve`（全局解析守卫，2.5+）
8. 导航确认
9. `afterEach`（全局后置）
10. 触发 DOM 更新（`beforeCreate` → `created` → `beforeMount` → `mounted`）
11. 调用 `beforeRouteEnter` 传给 `next` 的回调

### `$router.push` vs `location.href`

| | `$router.push` | `location.href` |
| --- | --- | --- |
| 页面刷新 | 无刷新，SPA 内部跳转 | 刷新整个页面 |
| 历史记录 | 正常压栈 | 正常跳转 |
| 适用场景 | 同一 SPA 内页面切换 | 跨站或强制刷新跳转 |

### 获取页面 hash 变化

两种方式：

**1. 监听 `$route`**（推荐，Vue Router 统一管理）：

```js
watch: {
  $route(val, oldVal) {
    console.log(val.hash)  // 当前 hash
  }
}
```

**2. 原生 `window.location.hash`**：

```js
window.addEventListener('hashchange', () => {
  console.log(window.location.hash) // '#/about'
})
```

`window.location.hash` 可读可写：读取判断当前 hash，写入时不触发页面刷新但会添加一条历史记录。

### 对前端路由的理解

早期 Web 中每次切换页面都需要向服务端请求新 HTML，体验不佳。Ajax 出现后，SPA 可以不刷新页面更新内容，但随之带来问题：所有视图共用同一个 URL，用户无法通过 URL 定位到具体页面，刷新后状态丢失，也不利于 SEO。

**前端路由**就是为解决这个问题出现的——在客户端维护一套 URL 与视图的映射关系，无需请求服务端就能实现页面切换和状态定位。

实现原理两种方案：

| 方案 | 原理 | 要点 |
| --- | --- | --- |
| **Hash 模式** | 监听 `hashchange` 事件，`#` 后内容不发给服务器 | 无需服务端配置，SEO 不友好 |
| **History 模式** | HTML5 `pushState` / `popState` API | URL 美观，需服务端配合返回 `index.html` |

两种模式都能做到：变更 URL 不触发页面刷新，JS 感知 URL 变化后渲染对应视图组件。

## 参考来源

- [Vue Router: 动态路由匹配](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html)
- [Vue Router: HTML5 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html)
- [Vue Router: 导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)
