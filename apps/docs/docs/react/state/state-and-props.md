# state 与 props

## 问题

setState 是同步还是异步？批量更新是怎么工作的？state 和 props 有什么区别？props 为什么是只读的？

## 结论

### 理解路径

React 用 state 管理组件内部数据，用 props 接收外部传入数据。`setState` 在 React 控制的上下文中是异步批量更新的，在原生事件或定时器中是同步的。理解这一点是写出正确 React 代码的关键。

### state vs props

| | state | props |
| --- | --- | --- |
| 归属 | 组件自身内部 | 从父组件传入 |
| 可变性 | 只能通过 `setState` 修改 | 只读，不能直接修改 |
| 初始化 | `constructor` 或 `useState` | 由父组件决定 |
| 触发重渲染 | 是 | 是（父组件传入新值时） |
| 类比 | 函数内部变量 | 函数参数 |

### props 为什么只读

React 要求组件像纯函数一样：**相同的 props 输入，必须产生相同的 UI 输出**。如果子组件能修改 props，数据流向就会变得不可预测，难以调试。

子 → 父的数据流通过**回调函数**实现：

```jsx
// 父组件传回调
<Child onUpdate={value => setData(value)} />

// 子组件调用回调
props.onUpdate(newValue)
```

### setState 是异步的吗？

**在 React 合成事件和生命周期中是异步批量更新，在原生事件和定时器中是同步的。**

```jsx
// 合成事件中 — 异步批量
handleClick() {
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // 拿到的是旧值！
}

// setTimeout 中 — 同步立即更新
setTimeout(() => {
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // 拿到新值
}, 0)
```

> React 18 起，所有更新（包括 setTimeout）都默认批量处理。

**为什么设计成异步？**

- 避免每次 `setState` 都触发 render，可以把同一次事件中的多次更新合并为一次
- 保证 state 和 props 的同步性

### setState 批量更新

同一事件处理函数中多次 setState 会被合并，相同 key 只保留最后一次：

```jsx
this.setState({ count: 1 })
this.setState({ count: 2 }) // 最终 count = 2，只触发一次 render
```

如果需要基于**当前最新 state** 更新，使用函数形式：

```jsx
this.setState(prevState => ({ count: prevState.count + 1 }))
this.setState(prevState => ({ count: prevState.count + 1 }))
// count 真正 +2，因为每个更新函数拿到的是上一次的结果
```

### setState 的第二个参数

setState 是异步的，如果需要在 state 更新后立即执行某些操作，可以用回调：

```jsx
this.setState({ count: newCount }, () => {
  // 此时 state 已更新
  console.log(this.state.count)
})
```

等价于在 `componentDidUpdate` 中处理。

### 函数组件中的 state（useState）

```jsx
const [count, setCount] = useState(0)

// 直接设置
setCount(count + 1)

// 基于前一个值（推荐）
setCount(prev => prev + 1)
```

**useState 返回数组而不是对象**：为了让调用者可以自由命名，使用解构赋值更简洁。如果返回对象，多次调用时需要起别名，比较麻烦。

### PropTypes 校验

```jsx
import PropTypes from 'prop-types'

MyComponent.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  onClick: PropTypes.func
}

MyComponent.defaultProps = {
  age: 18
}
```

TypeScript 项目通常用接口/类型定义替代 PropTypes，更严格、有 IDE 支持。

### setState 调用的原理

`setState` 入口函数充当分发器，根据入参将其分发到不同的功能函数：
1. 调用 `enqueueSetState` 将新 state 加入更新队列
2. 调用 `enqueueUpdate` 检查当前是否处于批量更新阶段
3. 若处于批量更新，将组件加入 `dirtyComponents` 队列；若不在，直接执行 `performUpdateIfNecessary` 触发更新

关键：`isBatchingUpdates` 变量控制是否进行批量更新。合成事件和生命周期中该值为 `true`，原生事件和定时器中为 `false`。

### setState 和 replaceState 的区别

- **setState()**：将新 state 与当前 state **合并**（类似 `Object.assign`），只覆盖传入的 key，其他 key 保留
- **replaceState()**：**完全替换** state，新 state 中没有的 key 会从 state 中移除

`replaceState` 是 `React.createClass` 时代的方法，`extends Component` 中不可用，现代 React 基本不用。

### this.state 和 setState 的区别

- `this.state` 用于**读取**当前状态值，或在 constructor 中**初始化** state
- `setState` 用于**修改** state，会触发重新渲染

直接修改 `this.state.xxx = value` 不会触发渲染，必须通过 `setState`。

### state 从 reducer 注入组件的过程

通过 `react-redux` 的 `connect` 和 `mapStateToProps` 实现：

```javascript
// mapStateToProps 从 store 中取出需要的 state 片段作为 props
const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
```

流程：`dispatch(action)` → `reducer` 处理返回新 state → `store` 更新 → `connect` 监听到变化 → 重新执行 `mapStateToProps` → 组件收到新 props → re-render。

### getDefaultProps 的作用

`getDefaultProps` 是 `React.createClass` 时代用来设置 props 默认值的方法（ES5 写法）。现代 `extends Component` 中用静态属性 `defaultProps` 替代：

```javascript
// 旧写法
getDefaultProps() { return { title: 'React' } }

// 现代写法
MyComponent.defaultProps = { title: 'React' }
// 或 class 中
static defaultProps = { title: 'React' }
```

### props 改变时更新组件的方法

1. **`componentWillReceiveProps`（已废弃）**：在子组件 render 前可比较新旧 props，调用 `setState`
2. **`getDerivedStateFromProps`（React 16.3+ 推荐）**：静态方法，根据新 props 返回新 state（或 null 表示不变）

```javascript
static getDerivedStateFromProps(nextProps, prevState) {
  if (nextProps.type !== prevState.type) {
    return { type: nextProps.type }
  }
  return null
}
```

### 面试回答

> state 是组件自己管理的内部数据，props 是父传子的参数。props 只读，保证单向数据流可预测。`setState` 在 React 控制的合成事件和生命周期中是异步批量的，多次调用会合并，这样减少渲染次数；在原生事件/定时器中是同步的（React 18 全部改成批量）。需要基于最新 state 更新时，用函数式 setState。

## 参考来源

- [React: State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React: Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
