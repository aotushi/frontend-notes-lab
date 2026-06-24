<script setup>
import PiniaColadaDemo from '../components/PiniaColadaDemo.vue'
</script>

# Pinia 状态管理

### 理解路径

Pinia 是 Vue 3 官方推荐的状态管理库，是 Vuex 的精神继承者。去掉了 Mutations、简化了模块系统、原生支持 TypeScript，是 Vue 3 项目的首选。

### Pinia vs Vuex 区别

这是面试最高频的问题。

| 对比 | Vuex 4 | Pinia |
| --- | --- | --- |
| Mutations | 必须通过 mutation 同步修改 state | **无 Mutations**，action 可直接修改 state，同步异步都支持 |
| 模块系统 | `modules` 嵌套，需 `namespaced: true` | 每个 store 天然独立，无需命名空间 |
| TypeScript | 支持较弱，类型推导复杂 | 原生 TypeScript，完整类型推导 |
| devtools | 支持 | 支持（时间旅行、热重载） |
| 包体积 | 较大 | 更小（~1KB gzip） |
| API 风格 | Options API | Options API + **Composition API（Setup Store）** |
| Vue 版本 | Vue 2 / Vue 3 | Vue 2 / Vue 3 |

**一句话：Pinia = Vuex 去掉 Mutations + 扁平模块 + 更好的 TypeScript 支持。**

### 安装与配置

```sh
npm install pinia
```

```js
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

### 定义 Store

**方式一：Options Store**（写法类似 Vuex，有 state/getters/actions）

```js
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    age: 0,
    isLoggedIn: false
  }),
  getters: {
    // 基于 state 的计算值，有缓存
    displayName: (state) => state.name || '游客',
    isAdult: (state) => state.age >= 18
  },
  actions: {
    // 同步和异步都在 actions 里
    setUser(user) {
      this.name = user.name
      this.age = user.age
      this.isLoggedIn = true
    },
    async fetchUser(id) {
      const user = await api.getUser(id)
      this.setUser(user)
    },
    logout() {
      this.name = ''
      this.age = 0
      this.isLoggedIn = false
    }
  }
})
```

**方式二：Setup Store**（Composition API 风格，更灵活）

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // ref → state
  const name = ref('')
  const age = ref(0)

  // computed → getter
  const displayName = computed(() => name.value || '游客')

  // function → action
  function setUser(user) {
    name.value = user.name
    age.value = user.age
  }

  return { name, age, displayName, setUser }
})
```

> Setup Store 可以使用任何组合式函数（composable），更适合复杂逻辑。

### 使用 Store

```vue
<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// 直接访问（整个 store 对象是响应式的）
console.log(userStore.name)
userStore.fetchUser(1)

// 解构 state/getter 时需用 storeToRefs 保持响应式
// 直接解构会丢失响应式：const { name } = userStore ❌
const { name, age, displayName } = storeToRefs(userStore)

// action 可以直接解构（函数不需要 storeToRefs）
const { setUser, logout } = userStore
</script>

<template>
  <div>{{ displayName }}（{{ age }}岁）</div>
  <button @click="logout">退出</button>
</template>
```

### 修改 State 的方式

```js
const store = useUserStore()

// 方式 1：直接修改（简单场景可用）
store.name = '张三'

// 方式 2：$patch 对象形式（批量修改）
store.$patch({
  name: '李四',
  age: 28
})

// 方式 3：$patch 函数形式（需要条件判断时）
store.$patch((state) => {
  state.name = '王五'
  if (state.age < 18) state.age = 18
})

// 方式 4：action（推荐，逻辑封装在 store 内）
store.setUser({ name: '赵六', age: 30 })
```

> 推荐用 action 封装修改逻辑，保持 store 内聚；`$patch` 适合组件层的批量更新。

### Getters

Getters 等同于 Vuex 的 getter，对 state 的计算派生值，有缓存：

```js
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    // 基本用法
    totalCount: (state) => state.items.length,
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price, 0),

    // getter 调用另一个 getter（通过 this）
    discountPrice() {
      return this.totalPrice * 0.9
    },

    // 返回函数以接收参数（此时不再缓存）
    getItemById: (state) => (id) => state.items.find(item => item.id === id)
  }
})
```

### Actions 处理异步

Pinia 的 action 直接支持异步，不需要像 Vuex 一样分 action + mutation：

```js
actions: {
  async fetchUserList() {
    try {
      this.loading = true
      const list = await api.getUserList()
      this.list = list
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }
  }
}
```

action 之间可以互相调用：

```js
actions: {
  async login(credentials) {
    const user = await api.login(credentials)
    this.setUser(user)           // 调用同 store 的其他 action
    await cartStore.loadCart()   // 调用其他 store 的 action
  }
}
```

### Store 里应该放什么状态

**应该放：**
- 多个组件共享的状态（用户信息、购物车、全局配置）
- 跨路由需要持久访问的数据
- 需要统一管理变更来源的状态

**不应该放：**
- 单个组件的局部 UI 状态（弹窗开关、输入框值）
- 一次性的请求结果（用完即丢，不需要共享）
- 表单草稿（除非需要跨组件共享）

### 持久化（pinia-plugin-persistedstate）

Pinia 状态也存在内存，刷新丢失。配合插件持久化到 localStorage：

```sh
npm install pinia-plugin-persistedstate
```

```js
// main.js
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
```

```js
// 在 store 中启用
export const useUserStore = defineStore('user', {
  state: () => ({ token: '', userInfo: null }),
  persist: true  // 整个 state 持久化
  // 或按需指定：
  // persist: { paths: ['token'] }  // 只持久化 token
})
```

### storeToRefs 原理

Pinia store 本身是一个 reactive 对象，直接解构会破坏响应式（和 `reactive` 解构同理）。`storeToRefs` 内部对每个 state/getter 包装成 `ref`，保持响应式链接：

```js
// 等价于：
const name = computed(() => store.name)
const age = computed(() => store.age)
// storeToRefs 自动完成上面的操作
const { name, age } = storeToRefs(store)
```

> action 是函数，不需要 storeToRefs，直接解构即可：`const { login } = store`

## 服务端状态管理（@pinia/colada）

Pinia 管理的是**客户端业务状态**（用户信息、购物车等）。接口请求数据属于**服务端状态**，有自己的生命周期（loading、缓存、失效、重新请求），不适合直接放进 Pinia store。

`@pinia/colada` 是 Pinia 官方的服务端状态插件，专门解决这类场景。

### 与传统 axios 封装的区别

传统 axios 封装只解决"怎么发请求"，`loading/data/error` 三态、参数联动、跨组件共享全要自己写：

```js
// 每个组件自己管状态，重复代码多
const data = ref(null)
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  data.value = await getUser(params)
  loading.value = false
})
watch(params, () => { /* 手动重新请求 */ })
```

`@pinia/colada` 的思维模型：**订阅一份数据，框架保证它是最新的**。

| | 传统 axios 封装 | @pinia/colada |
| --- | --- | --- |
| loading/error/data | 每个组件自己维护 | 自动管理，跨组件共享 |
| 参数变化重新请求 | 手动 watch | key 响应式，自动触发 |
| 多组件用同一份数据 | 各自请求（重复发） | 单例共享，只发一次 |
| 写操作后刷新数据 | 手动重新请求 | `refresh()` 一行 |

### 安装与配置

```sh
npm install @pinia/colada
```

```js
// main.js
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

const app = createApp(App)
app.use(createPinia())
app.use(PiniaColada)   // 必须在 pinia 之后
app.mount('#app')
```

### defineQuery — GET 请求封装

`defineQuery` 创建一个**单例**：多个组件调用同一个 `useQueryUser()`，共享同一份缓存数据，不会重复发请求。

```js
import { defineQuery, useQuery } from '@pinia/colada'
import { ref } from 'vue'

const useQueryUser = defineQuery(() => {
  // 查询参数必须和 useQuery 放在一起
  // 这样 key 函数才能追踪到参数的变化
  const paramsRef = ref({ str: '' })

  const query = useQuery({
    key: () => ['user', paramsRef.value.str],  // key 是响应式函数
    query: () => fetch(`/api/user?str=${paramsRef.value.str}`).then(r => r.json()),
  })

  return { paramsRef, ...query }
})
```

`key` 为什么是函数：`useQuery` 内部用 `watchEffect` 执行 `key()`，Vue 自动追踪里面读取的响应式数据。`paramsRef.value.str` 变化时，key 变化，自动重新请求。

`status.value` 的值：

| 值 | 含义 |
| --- | --- |
| `'pending'` | 请求中（首次加载或 key 变化后） |
| `'success'` | 请求成功 |
| `'error'` | 请求失败 |

### defineMutation — 写操作封装

写操作（POST/PUT/DELETE/PATCH）用 `defineMutation`。写完后调 `queryUser.refresh()` 让读数据重新拉取。

```js
import { defineMutation, useMutation } from '@pinia/colada'

const useMutateUser = defineMutation(() => {
  const queryUser = useQueryUser()   // 拿到读数据的实例

  return useMutation({
    mutation: (id) =>
      fetch('/api/user/update', {
        method: 'POST',
        body: JSON.stringify({ id })
      }).then(() => {
        return queryUser.refresh()   // 写完后重新拉取数据，所有组件同步更新
      }),
  })
})
```

`useMutation` 返回的对象：

```js
{
  mutate: (vars) => void,          // 触发，不等结果
  mutateAsync: (vars) => Promise,  // 触发，可以 await
  data: ref(null),
  status: ref('idle'),
  error: ref(null),
}
```

> `mutation` 是配置项（定义做什么），`mutateAsync` 是触发方法（同时管理 status/data/error 状态）。不能直接调用 `mutation`，它只是一个普通函数定义。

### 在组件中使用

两个组件调用同一个 `useQueryUser()`，共享同一份数据。Child 触发 mutation 后，Parent 的数据也会同步更新。

<PiniaColadaDemo />

### 数据流向总结

```
用户输入
  → paramsRef.value.str 变化
  → key 变化 → useQuery 自动重新请求 → data 更新

点击按钮
  → mutateAsync(id)
  → 执行 mutation(id)：发写请求
  → 写请求完成 → queryUser.refresh()
  → 重新执行 query 函数：发读请求
  → data 更新 → 所有使用 useQueryUser() 的组件重新渲染
```

## 参考来源

- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [@pinia/colada 文档](https://pinia-colada.esm.dev/)
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)
