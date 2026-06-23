# React 组件通信

## 问题

React 组件之间如何通信？跨层级数据如何传递？什么是 Context？如何解决 props 层级过深的问题？

## 结论

### 理解路径

React 遵循单向数据流：父 → 子通过 props，子 → 父通过回调。当组件层级较深或无嵌套关系时，需要 Context 或全局状态管理。

### 父子通信

**父 → 子：props**

```jsx
const Child = ({ name }) => <p>{name}</p>
const Parent = () => <Child name='React' />
```

**子 → 父：回调函数**

```jsx
const Child = ({ onUpdate }) => (
  <button onClick={() => onUpdate('new value')}>更新</button>
)

const Parent = () => {
  const [data, setData] = useState('')
  return <Child onUpdate={setData} />
}
```

### 跨级通信（Context）

当组件层级较深，中间组件只是"搬运" props 而自身不使用，这叫 **props drilling（层层透传）**。Context 可以绕过中间层：

```jsx
// 创建 Context
const ThemeContext = React.createContext('light')

// 祖先组件提供值
function App() {
  return (
    <ThemeContext.Provider value='dark'>
      <Layout />  {/* 中间组件不需要传 theme */}
    </ThemeContext.Provider>
  )
}

// 深层子组件消费
function Button() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>按钮</button>
}
```

### 非嵌套关系组件

兄弟组件或完全不相关的组件通信，常用方案：

1. **状态提升（最常见）**：把共享状态提到最近的公共父组件。

2. **发布/订阅（EventEmitter）**：简单场景手动实现。

```jsx
// 自定义事件总线
const bus = {
  handlers: {},
  on(event, fn) { (this.handlers[event] ??= []).push(fn) },
  emit(event, data) { this.handlers[event]?.forEach(fn => fn(data)) },
  off(event, fn) { this.handlers[event] = this.handlers[event]?.filter(f => f !== fn) }
}

// 组件 A 发送
bus.emit('user-updated', { name: 'Alice' })

// 组件 B 接收（记得在 useEffect cleanup 中 off）
useEffect(() => {
  const handler = (data) => setUser(data)
  bus.on('user-updated', handler)
  return () => bus.off('user-updated', handler)
}, [])
```

3. **全局状态管理**：Redux、Zustand、Jotai 等（见 [Redux](/react/state/redux)）。

### 解决 props drilling

| 方案 | 适用场景 |
| --- | --- |
| 状态提升 | 层级不深，两三层以内 |
| Context | 跨多层的全局数据（主题、语言、用户信息） |
| Redux / Zustand | 复杂应用，大量组件需要共享状态 |

### 通信方式总结

| 场景 | 方式 |
| --- | --- |
| 父 → 子 | props |
| 子 → 父 | 回调函数（props 传函数，子调用） |
| 兄弟组件 | 状态提升到父组件 |
| 跨多级 | Context / 全局状态管理 |
| 任意组件 | 发布订阅 / Redux |

## 参考来源

- [React: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
