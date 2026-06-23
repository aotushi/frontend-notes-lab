# Vuex 状态管理

### 理解路径

Vuex 解决多组件共享状态时"状态难以追踪、数据流混乱"的问题，通过单向数据流和严格的变更规则，让状态变更可预测、可调试。

### Vuex 核心概念

```
State（数据）
  ↓ Getters（派生/计算）
  ↓ Mutation（同步变更，commit 触发）
  ↓ Action（异步操作，dispatch 触发，内部 commit Mutation）
  ↓ Module（模块化，namespaced: true 开启命名空间）
```

```js
const store = createStore({
  state: () => ({
    count: 0,
    user: null
  }),
  getters: {
    // 基于 state 的计算值，有缓存
    doubleCount: (state) => state.count * 2
  },
  mutations: {
    // 唯一可以修改 state 的地方，必须是同步函数
    increment(state, payload) {
      state.count += payload.amount
    }
  },
  actions: {
    // 可以包含异步操作
    async fetchUser({ commit }, userId) {
      const user = await api.getUser(userId)
      commit('setUser', user)
    }
  },
  modules: {
    cart: cartModule // { state, getters, mutations, actions }
  }
})
```

**调用方式**：

```js
// 读取
store.state.count
store.getters.doubleCount

// 触发变更
store.commit('increment', { amount: 1 })       // 同步
store.dispatch('fetchUser', userId)            // 异步
```

**为什么不能在 Action 外直接修改 state？**

Vuex 严格模式下，直接修改 `state` 会报错。强制通过 `mutation` 变更，使 devtools 能追踪每次变更的来源和时间点。

### 命名空间模块

```js
const userModule = {
  namespaced: true,
  state: () => ({ profile: null }),
  mutations: {
    setProfile(state, profile) { state.profile = profile }
  }
}

// 使用时需加模块名前缀
store.commit('user/setProfile', data)
store.state.user.profile
```

### 刷新页面状态丢失

Vuex 状态存在内存中，刷新即丢失。三种解决方案：

**方案 1：手动持久化（轻量需求）**

```js
// 读取时从 localStorage 恢复
const store = createStore({
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token) // 同步持久化
    }
  }
})
```

**方案 2：vuex-persistedstate 插件（推荐）**

```js
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  plugins: [
    createPersistedState({
      paths: ['user', 'cart'] // 只持久化指定模块
    })
  ]
})
```

**方案 3：换用 Pinia + pinia-plugin-persistedstate**

Vue 3 推荐用 Pinia 代替 Vuex，配合持久化插件更简洁。

### action vs mutation 区别

| | mutation | action |
| --- | --- | --- |
| 触发方式 | `store.commit(type, payload)` | `store.dispatch(type, payload)` |
| 是否同步 | 必须同步 | 可以异步（axios、setTimeout 等） |
| 能否直接改 state | 是（唯一合法途径） | 否（只能 commit mutation） |
| 参数 | `(state, payload)` | `(context, payload)`，context 含 state/getters/commit/dispatch |
| 常见用途 | 数据赋值 | 异步请求后再 commit |

**为什么 mutation 必须同步？**

Vuex devtools 会在每次 commit 后对 state 拍一次快照，支持 time-travel 调试。如果 mutation 包含异步操作，devtools 无法知道状态在什么时间点改变，快照就失效了。异步逻辑统一放 action，action 完成后再 commit，保证变更时序可追踪。

### Vuex vs localStorage

| | Vuex | localStorage |
| --- | --- | --- |
| 存储位置 | 内存 | 磁盘（浏览器本地文件） |
| 响应式 | 是（改变自动触发视图更新） | 否 |
| 刷新后 | 丢失 | 保留 |
| 存储类型 | 任意 JS 值 | 只能字符串（对象需 JSON 序列化） |
| 适用场景 | 组件间共享、需要响应式的临时状态 | 跨页面/跨会话持久化（token、主题偏好等） |

两者可以配合使用：Vuex 管响应式状态，localStorage 做持久化（见刷新页面状态丢失方案）。

### Redux vs Vuex

两者都基于 Flux 单向数据流，核心思想相同：单一数据源、变化可预测。区别在于实现细节：

| | Redux | Vuex |
| --- | --- | --- |
| 绑定框架 | 框架无关（常与 React 搭配） | 专为 Vue 设计 |
| 修改状态 | dispatch action → reducer 返回新 state | commit mutation 直接改 state |
| 异步 | 需要中间件（thunk / saga） | 内置 action 支持异步 |
| 视图更新 | 需手动 subscribe 或用 react-redux | Vue 响应式自动触发 |
| 样板代码 | 较多（action type 常量 + reducer switch） | 较少（mutation 直接按名索引） |

### Vuex 和单纯的全局对象有什么区别

两者都能跨组件共享数据，但区别明显：

1. **响应式**：Vuex 的 state 是响应式的，组件读取 state 后，state 变化会自动触发组件重渲染；普通全局对象的属性变化不会自动通知组件。
2. **变更追踪**：Vuex 规定只能通过 commit mutation 改变 state，devtools 能记录每次变更（time-travel 调试）；全局对象可以随意修改，无法追踪变更来源。
3. **严格模式**：Vuex 支持严格模式，绕过 mutation 直接修改 state 会报错；全局对象没有这种约束。

### 严格模式

严格模式下，**任何不是由 mutation 引起的 state 变更都会抛出错误**，确保所有状态变更都能被 devtools 追踪。

```js
const store = new Vuex.Store({
  strict: true  // 开启严格模式
})
```

> 严格模式会深度监测 state 树，**不要在生产环境开启**，会有性能损耗。通常只在开发环境启用：

```js
strict: process.env.NODE_ENV !== 'production'
```

### 批量使用 Vuex getter（mapGetters）

`mapGetters` 将 store 中的 getter 映射到局部计算属性：

```js
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['total', 'discountTotal'])
    // 等价于：total() { return this.$store.getters.total }
  }
}
```

也可以重命名：`...mapGetters({ localTotal: 'total' })`

### 批量使用 Vuex mutation（mapMutations）

`mapMutations` 将 mutation 映射到组件方法：

```js
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations({ setNumber: 'SET_NUMBER' })
    // this.setNumber(10) 等价于 this.$store.commit('SET_NUMBER', 10)
  }
}
```

同理还有 `mapState`（映射 state 到 computed）和 `mapActions`（映射 action 到 methods）。

## 参考来源

- [Vuex: 核心概念](https://vuex.vuejs.org/zh/guide/state.html)
- [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)
- [Vuex: 导航守卫与 Action](https://vuex.vuejs.org/zh/guide/actions.html)
