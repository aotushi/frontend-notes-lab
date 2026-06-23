# Redux 状态管理

## 问题

Redux 解决什么问题？工作流程是什么？如何处理异步？connect 的作用是什么？Redux 中间件是什么？

## 结论

### 理解路径

Redux 是框架无关的状态管理库，核心理念：**单一数据源、状态只读、纯函数修改**。React 配合 react-redux 使用，通过 `connect` 或 Hooks 将 store 注入组件。

### Redux 解决什么问题

React 单向数据流在大型应用中面临问题：组件间共享状态需要层层传递 props，深层组件难以共享数据，数据流向不可追踪。Redux 用一个全局 store 解决：

- 所有组件从同一个 store 获取状态
- 状态变更有严格流程，可追踪、可调试（devtools time-travel）
- 数据流清晰：`dispatch(action) → reducer → new state → 视图更新`

### 工作流程

```
用户操作 → dispatch(action) → reducer(state, action) → new state → store → 订阅的视图更新
```

```jsx
// 1. 定义 reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 }
    case 'DECREMENT': return { count: state.count - 1 }
    default: return state
  }
}

// 2. 创建 store
import { createStore } from 'redux'
const store = createStore(counterReducer)

// 3. 派发 action
store.dispatch({ type: 'INCREMENT' })

// 4. 读取状态
store.getState() // { count: 1 }

// 5. 订阅变化
store.subscribe(() => console.log(store.getState()))
```

### 三大原则

1. **单一数据源**：整个应用的 state 存储在一个 store 中
2. **state 是只读的**：唯一改变 state 的方式是 dispatch action
3. **纯函数修改**：reducer 是纯函数，接收旧 state 和 action，返回新 state（不能直接修改旧 state）

### 异步处理

Redux 原生只支持同步，异步需要中间件：

**redux-thunk（轻量，推荐入门）**：

```jsx
// action creator 返回函数而不是对象
export const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'FETCH_USER_START' })
  const user = await api.getUser(id)
  dispatch({ type: 'FETCH_USER_SUCCESS', payload: user })
}

// 使用
store.dispatch(fetchUser(1))
```

**redux-saga（功能强大，用 generator）**：

```jsx
function* fetchUserSaga(action) {
  try {
    const user = yield call(api.getUser, action.id)
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
  } catch (e) {
    yield put({ type: 'FETCH_USER_FAILED', error: e })
  }
}
```

| | redux-thunk | redux-saga |
| --- | --- | --- |
| 体积 | 极小（~20行） | 较大 |
| 学习成本 | 低 | 高（需懂 generator） |
| 功能 | 基础 | 并发控制、取消、竞态处理等 |
| 适用 | 简单异步 | 复杂异步流 |

### connect 的作用（react-redux）

`connect` 是 HOC，把 Redux store 的 state 和 dispatch 注入组件的 props：

```jsx
import { connect } from 'react-redux'

// mapStateToProps：从 store 取需要的数据
const mapStateToProps = (state) => ({
  count: state.counter.count
})

// mapDispatchToProps：把 dispatch 封装成方法
const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: 'INCREMENT' })
})

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
```

现代写法用 Hooks 替代 connect：

```jsx
import { useSelector, useDispatch } from 'react-redux'

function Counter() {
  const count = useSelector(state => state.counter.count)
  const dispatch = useDispatch()
  return (
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>
      {count}
    </button>
  )
}
```

### 中间件

中间件是对 `dispatch` 的增强，形式为：

```javascript
const middleware = store => next => action => {
  // 在 action 到达 reducer 前/后执行逻辑
  console.log('dispatching', action)
  next(action) // 调用下一个中间件或原始 dispatch
}
```

应用中间件：

```jsx
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
const store = createStore(reducer, applyMiddleware(thunk, logger))
```

### Redux vs Vuex

| | Redux | Vuex |
| --- | --- | --- |
| 框架绑定 | 框架无关 | 专为 Vue |
| 修改 state | dispatch action → reducer 返回新 state | commit mutation 直接修改 |
| 异步 | 需中间件（thunk/saga） | 内置 action 支持异步 |
| 样板代码 | 多 | 少 |

### Redux 中间件是什么？接受几个参数？柯里化两端参数是什么？

Redux 中间件是对 `dispatch` 的增强，使用了**函数柯里化**（三层嵌套）：

```javascript
// middleware 签名：({ getState, dispatch }) => next => action => {}
const logger = store => next => action => {
  console.log('before:', store.getState())
  next(action) // 调用下一个中间件
  console.log('after:', store.getState())
}
```

- 第一层参数 `store`：提供 `getState` 和 `dispatch` 方法
- 第二层参数 `next`：下一个中间件的 dispatch，或最终的原始 dispatch
- 第三层参数 `action`：当前被派发的 action

### Redux 请求中间件如何处理并发

使用 **redux-saga** 处理并发（基于 generator 和 Effect）：

```javascript
import { call, put, takeLatest } from 'redux-saga/effects'

function* fetchUser(action) {
  const user = yield call(api.fetchUser, action.id)
  yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
}

// takeLatest：只保留最新请求，自动取消之前未完成的请求
function* watchFetchUser() {
  yield takeLatest('FETCH_USER_REQUEST', fetchUser)
}
```

- `takeLatest`：只保留最新一次请求（解决竞态问题）
- `takeEvery`：每次都执行
- `race`：多个请求竞速，取最快的

### Redux 状态管理器和变量挂载到 window 的区别

| | Redux | window 变量 |
| --- | --- | --- |
| 数据流 | 单向，可追踪 | 随意读写，不可追踪 |
| 调试 | 支持 devtools time-travel | 无工具支持 |
| 响应式 | 变化自动触发组件更新 | 无响应式 |
| 隔离性 | 与视图层分离，可测试 | 全局污染 |

Redux 的核心价值不只是"存数据"，而是提供了完整的状态管理模式（可预测、可回溯、可测试）。

### Mobx 和 Redux 的区别

**共同点**：都是解决状态管理混乱问题的工具，都有 store 概念，都支持与 React 集成。

**区别**：

| | Redux | Mobx |
| --- | --- | --- |
| 数据结构 | 单一 store，plain object | 多个 store，observable 对象 |
| 更新方式 | 不可变 state，纯函数 reducer | 可变 state，直接修改 |
| 响应方式 | 手动 connect/subscribe | 自动追踪依赖，自动更新 |
| 样板代码 | 多 | 少 |
| 调试 | 容易（纯函数，devtools） | 较难（响应式追踪不直观） |
| 适合场景 | 复杂业务，需要可预测性 | 快速开发，数据关系复杂 |

### Redux 和 Vuex 的区别与共同思想

**区别**：
- Vuex 用 `mutation` 替代 Redux 的 `reducer + action` 组合，无需 switch，直接修改 state
- Vuex 利用 Vue 响应式系统自动渲染，无需手动订阅
- Vuex 内置 `action` 支持异步，Redux 需要中间件

**共同思想**：
- 单一数据源
- 状态变化可预测
- 本质都是对 MVVM 数据层的抽象，将数据从视图中分离

### Redux 中间件如何拿到 store 和 action

```javascript
// applyMiddleware 源码层面，每个 middleware 接收 store 作为参数
const middlewareAPI = {
  getState: store.getState,
  dispatch: (...args) => dispatch(...args)
}
// 第一次调用传入 store，返回 next => action => {} 函数
const chain = middlewares.map(middleware => middleware(middlewareAPI))
// 第二次调用传入 next，组成调用链
dispatch = compose(...chain)(store.dispatch)
```

中间件通过第一层参数的 `store.getState()` 获取当前 state，通过 `store.dispatch` 再次派发 action；通过第三层参数直接拿到 action 对象。

### 面试回答

> Redux 解决多组件共享状态难以追踪的问题，用单一 store + 严格的 action → reducer 流程让状态变更可预测。异步用 thunk（简单）或 saga（复杂）中间件扩展 dispatch。react-redux 的 connect / useSelector 把 store 注入组件，useDispatch 发送 action。中间件是三层柯里化函数，依次接收 store、next、action。

## 参考来源

- [Redux: Getting Started](https://redux.js.org/introduction/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [react-redux: Hooks](https://react-redux.js.org/api/hooks)
