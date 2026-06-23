# React 生命周期

## 问题

React 组件的生命周期有哪些阶段？React 16 废弃了哪些生命周期？getDerivedStateFromProps 是什么？网络请求应在哪个生命周期中发起？

## 结论

### 理解路径

React 类组件的生命周期分三个阶段：**挂载**（首次渲染到 DOM）、**更新**（state/props 变化）、**卸载**（从 DOM 移除）。React 16 引入 Fiber 后废弃了三个"will"钩子，用更安全的替代方案代替。

### 挂载阶段

组件首次渲染，只执行一次：

```
constructor → getDerivedStateFromProps → render → componentDidMount
```

| 钩子 | 作用 |
| --- | --- |
| `constructor` | 初始化 state、绑定事件 |
| `getDerivedStateFromProps` | 根据 props 同步 state（静态方法，无 this） |
| `render` | 返回 JSX，不能有副作用 |
| `componentDidMount` | DOM 已挂载，发网络请求、添加事件监听 |

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: null }
  }

  componentDidMount() {
    fetch('/api/data').then(r => r.json()).then(data => this.setState({ data }))
  }

  render() {
    return <div>{this.state.data}</div>
  }
}
```

### 更新阶段

state 或 props 变化时触发：

```
getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate
```

| 钩子 | 作用 |
| --- | --- |
| `shouldComponentUpdate(nextProps, nextState)` | 返回 false 可跳过本次更新（性能优化） |
| `render` | 重新渲染 |
| `getSnapshotBeforeUpdate(prevProps, prevState)` | DOM 更新前捕获快照（如滚动位置），返回值传给 componentDidUpdate |
| `componentDidUpdate(prevProps, prevState, snapshot)` | DOM 已更新，可发起条件请求、操作 DOM |

```jsx
componentDidUpdate(prevProps) {
  // 仅在 userId 变化时重新请求
  if (prevProps.userId !== this.props.userId) {
    this.fetchUserData(this.props.userId)
  }
}
```

### 卸载阶段

```
componentWillUnmount
```

清理副作用：取消网络请求、移除事件监听、清除定时器。

```jsx
componentWillUnmount() {
  clearInterval(this.timer)
  window.removeEventListener('resize', this.handleResize)
}
```

### 错误处理

```
componentDidCatch(error, info)
```

捕获后代组件抛出的错误，用于渲染 fallback UI（错误边界）：

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
    logError(error, info)
  }

  render() {
    return this.state.hasError ? <h1>出错了</h1> : this.props.children
  }
}
```

### React 16 废弃的生命周期

以下三个钩子已加 `UNSAFE_` 前缀废弃，原因是 Fiber 架构下 render 阶段可中断，这些钩子可能被执行多次：

| 废弃 | 替代 |
| --- | --- |
| `componentWillMount` | `constructor` 或 `componentDidMount` |
| `componentWillReceiveProps(nextProps)` | `getDerivedStateFromProps` |
| `componentWillUpdate` | `getSnapshotBeforeUpdate` + `componentDidUpdate` |

### getDerivedStateFromProps

静态方法，在挂载和每次更新前都会调用，根据 props 返回要合并到 state 的对象（或 null 不更新）：

```jsx
static getDerivedStateFromProps(nextProps, prevState) {
  // 只在 type 变化时更新 state
  if (nextProps.type !== prevState.type) {
    return { type: nextProps.type }
  }
  return null
}
```

**注意**：React 16.4+ 中 `setState` 和 `forceUpdate` 也会触发此方法，所以要用 prevState 来判断，而不是每次无条件覆盖。

### 发起网络请求应在 componentDidMount

- `constructor`：组件未挂载，无法操作 DOM
- `componentWillMount`（已废弃）：服务端渲染时会执行两次；Fiber 下可能被多次执行
- **`componentDidMount`（推荐）**：DOM 已挂载，环境确定，只执行一次，setState 会触发额外 render 但用户无感知

函数组件等价：

```jsx
useEffect(() => {
  fetchData().then(setData)
}, []) // 空依赖 = 只在挂载时执行
```

### Hooks 对应关系

| 类组件生命周期 | Hooks 等价 |
| --- | --- |
| `constructor` | `useState` 初始值 |
| `componentDidMount` | `useEffect(() => {}, [])` |
| `componentDidUpdate` | `useEffect(() => {}, [deps])` |
| `componentWillUnmount` | `useEffect` 返回的 cleanup 函数 |
| `shouldComponentUpdate` | `React.memo` + `useMemo` |

### props 改变后在哪个生命周期处理

React 16.3 后推荐用 `getDerivedStateFromProps` 替代 `componentWillReceiveProps`：

- `getDerivedStateFromProps(nextProps, prevState)`：在 render 前执行，根据新 props 返回需要更新的 state 片段
- 若不需要更新 state，返回 `null`
- 注意：该方法在每次 render 前都会执行（包括 setState 触发的更新），判断时需要和 prevState 对比，不能无条件覆盖

### React 性能优化在哪个生命周期

主要在 `shouldComponentUpdate`：

```javascript
shouldComponentUpdate(nextProps, nextState) {
  // 只有 num 变化才重渲染
  if (this.props.num === nextProps.num) {
    return false
  }
  return true
}
```

- 接收 `nextProps` 和 `nextState`，返回 `false` 则跳过 render
- 进行的是**浅比较**，引用类型数据地址不变时即使内容变了也不会更新
- 类组件可直接继承 `PureComponent`（自动实现浅比较的 shouldComponentUpdate）
- 函数组件用 `React.memo` 实现等价效果

**更新数据时避免浅比较问题**：使用 `Object.assign({}, ...)` 或展开运算符创建新对象，保证引用地址变化。

### state 和 props 触发更新的生命周期区别

**state 更新流程：**

```
shouldComponentUpdate → componentWillUpdate → render → componentDidUpdate
```

**props 更新流程：**

```
componentWillReceiveProps(已废弃) / getDerivedStateFromProps → shouldComponentUpdate → render → componentDidUpdate
```

区别：props 更新比 state 更新多一步接收新 props 的处理阶段。两者在更新后都会经过 shouldComponentUpdate 决策。

### React 16 中新生命周期

React 16 新增：
- **`getDerivedStateFromProps`**：替代 `componentWillReceiveProps`，静态方法，挂载和更新前均执行
- **`getSnapshotBeforeUpdate`**：替代 `componentWillUpdate`，在 DOM 更新前捕获快照信息
- **`componentDidCatch`**：新增错误边界能力

React 16 废弃（加 `UNSAFE_` 前缀）：
- `UNSAFE_componentWillMount`
- `UNSAFE_componentWillReceiveProps`
- `UNSAFE_componentWillUpdate`

新的生命周期仍遵循挂载、更新、卸载三个阶段，但 Render 阶段（render 前）可被 Fiber 中断，所以移除了不安全的"will"钩子。

## 参考来源

- [React: Component lifecycle](https://react.dev/reference/react/Component)
- [React: getDerivedStateFromProps](https://react.dev/reference/react/Component#static-getderivedstatefromprops)
- [React: Error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
