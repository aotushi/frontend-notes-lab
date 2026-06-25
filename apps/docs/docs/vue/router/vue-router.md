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

### 路由定义常用字段

```js
const routes = [
  {
    path: '/user/:id',          // 路径，支持动态参数
    name: 'User',               // 命名路由，编程式导航可用 name 跳转
    component: () => import('@/views/User.vue'),  // 懒加载
    meta: { requiresAuth: true, keepAlive: false }, // 路由元信息，守卫/缓存控制
    props: true,                // 将 params 作为 props 传入组件
    redirect: '/login',         // 重定向（也可以是对象或函数）
    alias: '/u/:id',            // 别名，访问 /u/1 等同于 /user/1
    children: [                 // 嵌套路由
      { path: 'profile', component: Profile }
    ]
  }
]
```

`meta` 常见约定字段：`requiresAuth`（需要登录）、`keepAlive`（是否缓存）、`title`（页面标题）、`roles`（需要的角色）。

### 声明式导航 vs 编程式导航

| | 声明式 | 编程式 |
| --- | --- | --- |
| 方式 | `<router-link :to="...">` | `this.$router.push/replace/go` |
| 适用 | 模板中固定链接 | JS 逻辑中动态跳转（如登录成功后跳转） |
| 渲染结果 | 默认渲染为 `<a>` 标签 | 无 DOM 产出 |

**声明式导航：**

```html
<router-link to="/home">首页</router-link>
<router-link :to="{ name: 'User', params: { id: 1 } }">用户</router-link>
<router-link :to="{ path: '/search', query: { q: 'vue' } }">搜索</router-link>
<!-- replace 属性：替换当前历史记录而不是新增 -->
<router-link :to="'/login'" replace>登录</router-link>
```

**编程式导航（`$router` 方法汇总）：**

```js
// push — 新增历史记录（可后退）
this.$router.push('/home')
this.$router.push({ path: '/home' })
this.$router.push({ name: 'User', params: { id: 1 } })   // 命名路由 + params
this.$router.push({ path: '/search', query: { q: 'vue' } }) // path + query

// replace — 替换当前记录（不可后退）
this.$router.replace('/login')

// go — 在历史栈中移动
this.$router.go(1)   // 前进一步
this.$router.go(-1)  // 后退一步，等同于 back()

// back / forward
this.$router.back()
this.$router.forward()
```

> ⚠️ `push` 使用 `path` 时 `params` 会被忽略，必须改用 `name` 或将参数拼入 `path`：
> ```js
> // ❌ params 不生效
> router.push({ path: '/user', params: { id: 1 } })
> // ✅ 正确做法
> router.push({ name: 'User', params: { id: 1 } })
> router.push({ path: `/user/1` })
> ```

### 编程式导航重复跳转报错

Vue Router 3.1+ 起 `push` / `replace` 返回 Promise。当跳转目标与当前路由**完全相同**时，导航被判定为冗余而中止，Promise 被 reject，控制台抛出 `NavigationDuplicated`（"Avoided redundant navigation to current location"）。声明式 `<router-link>` 内部已处理，不会报这个错。

**Vue Router 3 的处理方式：**

```js
// 方式 1：单次调用 catch 掉
this.$router.push('/same').catch(() => {})

// 方式 2：全局重写 push / replace，统一吞掉重复导航错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}
```

**Vue Router 4：** 重复导航默认**静默失败**，不再抛错，无需特殊处理。如需感知失败原因，用返回值判断：

```js
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

const failure = await router.push('/same')
if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
  // 重复导航被忽略
}
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

### 路由 props 传参（解耦组件与路由）

默认情况下组件内用 `this.$route.params.id` 读取参数，与路由强耦合。通过路由 `props` 选项可将参数解耦为组件 props：

**布尔模式**（将 `params` 映射为同名 props）：

```js
{ path: '/user/:id', component: User, props: true }

// 组件内直接用 props 接收，无需 $route
export default { props: ['id'] }
```

**对象模式**（传入静态固定值）：

```js
{ path: '/about', component: About, props: { from: 'navbar' } }
```

**函数模式**（自由组合 params、query 或自定义值）：

```js
{
  path: '/search/:keyword',
  component: Search,
  props: route => ({
    keyword: route.params.keyword,
    page: route.query.page,
    extra: 'static'
  })
}
```

### params 和 query 的区别

| 对比 | params | query |
| --- | --- | --- |
| 引入方式 | 必须用 `name` 跳转，不能用 `path` | `path` 或 `name` 均可 |
| URL 表现 | 不显示在 URL 中（`/user/123`，需路由定义 `:id`） | 显示在 URL 问号后（`/user?id=123`） |
| 刷新后 | **丢失**（URL 中无对应参数时） | **不丢失**（参数在 URL 中） |
| 类比 | 类似 HTTP POST | 类似 HTTP GET |

```js
// params：必须用 name，URL 不含参数键名
router.push({ name: 'User', params: { id: 123 } })
this.$route.params.id

// query：path/name 均可，URL 显示参数
router.push({ path: '/user', query: { id: 123 } })
this.$route.query.id
```

> 如果参数需要在页面刷新后保留，用 `query`；如果只是页面跳转传参且不想暴露在 URL 中，用 `params`（但要注意刷新丢失问题）。

### hash vs history 路由模式

| 对比 | hash 模式 | history 模式 |
| --- | --- | --- |
| URL 形式 | `example.com/#/user/1` | `example.com/user/1` |
| 实现原理 | `location.hash` + `hashchange` 事件 | HTML5 History API：`pushState` / `popState` |
| 服务端配置 | 无需配置（`#` 后的内容不发给服务器） | 需要将所有路径返回 `index.html` |
| SEO | 不友好（搜索引擎不抓 hash 部分） | 友好 |
| 刷新行为 | 正常（hash 不触发页面请求） | 直接访问 `/user/1` 需服务端配合 |

**`pushState` 相比直接修改 hash 的优势：**

1. `pushState()` 可以设置与当前同源的**任意路径**，hash 只能修改 `#` 后的部分
2. `pushState()` 可以设置与当前**完全相同的 URL** 也会入栈；hash 值必须变化才触发
3. `pushState()` 通过 `stateObject` 可以携带**任意类型数据**；hash 只能附加字符串
4. `pushState()` 可以额外设置 `title` 属性
5. hash 模式下，`#` 前的 URL 才会发给服务器，后端未配置也不会返回 404；history 模式下前端 URL 必须与后端路由一致，否则刷新返回 404

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

需要在路由跳转过程中插入逻辑（如登录验证、权限控制、页面标题更新）时使用导航守卫。分三类，按触发范围不同选择。

**守卫参数说明：**

每个守卫接收三个参数：
- `to`：即将进入的目标路由对象（含 `path/name/params/query/meta` 等）
- `from`：当前正要离开的路由对象
- `next`：调用它才能继续导航（不调用则导航中断）
  - `next()` — 确认，继续导航
  - `next('/login')` / `next({ name: 'Login' })` — 跳转到另一个地址
  - `next(false)` — 中断导航，返回 `from` 对应的 URL

> Vue Router 4 中组件内守卫可直接 `return` 替代 `next()`，全局守卫仍推荐 `next()`。

---

**1. 全局守卫**（作用于所有路由）

全局有三个钩子：`beforeEach`、`beforeResolve`、`afterEach`

```js
// beforeEach — 全局前置守卫，最常用，做登录权限拦截
router.beforeEach((to, from, next) => {
  const userInfo = sessionStorage.getItem('userData')
  if (!userInfo) {
    // 未登录：是登录页则放行，否则跳转登录
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
```

```js
// beforeResolve — 全局解析守卫（2.5.0+）
// 在 beforeRouteEnter 调用之后、导航确认之前调用
// 适合需要确保异步组件和守卫都已解析完成的场景
router.beforeResolve((to, from, next) => {
  next()
})
```

```js
// afterEach — 全局后置钩子，无 next 参数，导航已完成
// 常用：切换后滚动条回到顶部、更新页面 title
router.afterEach((to, from) => {
  window.scrollTo(0, 0)
  document.title = to.meta.title || '默认标题'
})
```

---

**2. 路由独享守卫**（`beforeEnter`，只对单条路由生效）

```js
const routes = [
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      // 只在进入这条路由时触发，不影响其他路由
      const role = sessionStorage.getItem('role')
      if (role === 'admin') {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

---

**3. 组件内守卫**（在组件选项中定义，有三个）

```js
export default {
  // 进入组件前触发
  // ⚠️ 此时组件实例尚未创建，无法访问 this
  // 需要通过 next(vm => {}) 回调才能访问组件实例
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm 就是组件实例
      if (from.path === '/order') {
        vm.isFromOrder = true
      }
    })
  },

  // 当前路由改变但组件被复用时触发
  // 典型场景：动态路由 /user/:id，从 /user/1 跳到 /user/2
  // 组件不会重新挂载，但需要响应参数变化
  beforeRouteUpdate(to, from, next) {
    this.userId = to.params.id
    this.fetchUser(this.userId)
    next()
  },

  // 离开当前组件前触发
  // 常用于：表单未保存时提示"确认离开？"
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('有未保存的内容，确认离开？')
      confirmed ? next() : next(false)
    } else {
      next()
    }
  }
}
```

---

**守卫速查表：**

| 守卫 | 类型 | 有 `next` | 能访问 `this` | 用途 |
| --- | --- | --- | --- | --- |
| `beforeEach` | 全局 | ✅ | ❌ | 登录验证、权限拦截 |
| `beforeResolve` | 全局 | ✅ | ❌ | 确保异步守卫/组件都已解析 |
| `afterEach` | 全局 | ❌ | ❌ | 滚动顶部、更新标题 |
| `beforeEnter` | 路由独享 | ✅ | ❌ | 单路由的特殊权限 |
| `beforeRouteEnter` | 组件内 | ✅（回调） | ❌（用回调） | 进入前预加载数据 |
| `beforeRouteUpdate` | 组件内 | ✅ | ✅ | 动态参数变化时刷新数据 |
| `beforeRouteLeave` | 组件内 | ✅ | ✅ | 离开前保存/确认提示 |

### 完整导航解析顺序

**情境一：从 A 组件离开、第一次进入 B 组件**

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

**情境二：结合 keep-alive 的触发顺序**

路由组件被 `<keep-alive>` 包裹时，切换不会销毁组件，生命周期有所不同：

```
// 首次进入（与普通相同）
beforeRouteEnter → beforeCreate → created → mounted → activated

// 离开（不销毁，触发 deactivated）
beforeRouteLeave → deactivated

// 再次进入（跳过 created/mounted，直接激活）
beforeRouteEnter → activated
```

> `beforeDestroy` / `destroyed` 不会触发，因为组件被缓存而非销毁。`activated` 适合做"每次进入时刷新数据"的场景。

配合 `meta.keepAlive` 按路由控制是否缓存：

```vue
<!-- App.vue -->
<keep-alive>
  <router-view v-if="$route.meta.keepAlive" />
</keep-alive>
<router-view v-if="!$route.meta.keepAlive" />
```

```js
// 路由配置
{ path: '/list', component: List, meta: { keepAlive: true } }
```

**情境三：导航行为被触发到导航完成的完整过程（含组件生命周期）**

假设从 A 组件离开，第一次进入 B 组件：

1. 导航行为被触发，导航未被确认
2. `beforeRouteLeave`（A 的组件内守卫，可取消路由离开）
3. `beforeEach`（全局前置守卫，可用于登录验证、全局 loading）
4. `beforeRouteUpdate`（在重用的组件里调用，2.2+）
5. `beforeEnter`（路由独享守卫）
6. 解析异步路由组件
7. `beforeRouteEnter`（B 的组件内守卫，此时组件实例未创建）
8. `beforeResolve`（全局解析守卫，2.5+，标示解析阶段完成）
9. 导航被确认
10. `afterEach`（全局后置钩子）
11. B 组件生命周期：`beforeCreate` → `created` → `beforeMount`
12. `deactivated`（若 A 是 keep-alive 缓存组件，触发 deactivated 而非 destroyed）
13. `mounted`（B 组件挂载完成）
14. `activated`（若 B 是 keep-alive 缓存组件）
15. 执行 `beforeRouteEnter` 传给 `next` 的回调函数

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
