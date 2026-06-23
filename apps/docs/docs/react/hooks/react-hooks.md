# React Hooks

## 问题

Hooks 解决了哪些问题？useState 为什么返回数组？Hooks 的使用限制是什么？useEffect 和 useLayoutEffect 有什么区别？

## 结论

### 理解路径

React 16.8 引入 Hooks，让函数组件拥有状态和副作用能力，解决了类组件的逻辑复用难、this 问题、以及相关逻辑被生命周期拆散等痛点。

### Hooks 解决的三大问题

**1. 逻辑复用困难**

类组件复用逻辑只能靠 HOC 或 render props，导致"嵌套地狱"。自定义 Hook 可以把状态逻辑提取出来，在多个组件中复用：

```jsx
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return size
}
```

**2. 生命周期导致相关逻辑分散**

类组件中，同一功能的逻辑分散在 `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` 三个钩子中。`useEffect` 把它们集中在一处：

```jsx
useEffect(() => {
  // 订阅（对应 componentDidMount/componentDidUpdate）
  subscribe(props.id)
  // 清理（对应 componentWillUnmount）
  return () => unsubscribe(props.id)
}, [props.id])
```

**3. class 的复杂性**

`this` 绑定、箭头函数 vs 普通函数、constructor 都增加了心智负担。函数组件没有 `this`，代码更直观。

### 常用 Hooks

```jsx
// 状态
const [count, setCount] = useState(0)

// 副作用（fetch、事件监听、定时器）
useEffect(() => {
  // 执行
  return () => { /* cleanup */ }
}, [deps])

// 上下文
const theme = useContext(ThemeContext)

// 引用 DOM 或可变值
const inputRef = useRef(null)

// 性能优化：缓存函数
const handleClick = useCallback(() => doSomething(a), [a])

// 性能优化：缓存计算值
const value = useMemo(() => expensive(a, b), [a, b])

// 类似 Redux 的本地状态管理
const [state, dispatch] = useReducer(reducer, initialState)
```

### useState 返回数组而非对象

数组解构可以自由命名，对象解构必须和属性同名：

```jsx
// 返回数组 — 随意命名
const [count, setCount] = useState(0)
const [name, setName] = useState('')

// 如果返回对象 — 多次使用时需要起别名
const { state: count, setState: setCount } = useState(0)
const { state: name, setState: setName } = useState('')
```

返回数组可以直接按顺序解构，使用更简洁。

### Hooks 的两条限制

1. **只能在函数顶层调用**，不能在条件、循环、嵌套函数中调用
2. **只能在 React 函数组件或自定义 Hook 中调用**

```jsx
// ❌ 错误：条件中调用
if (condition) {
  const [val, setVal] = useState(0)
}

// ✅ 正确
const [val, setVal] = useState(0)
if (condition) {
  // 使用 val
}
```

**为什么有这个限制？**

Hooks 的状态是按调用**顺序**存在链表中的。如果在条件分支中调用，每次渲染的调用顺序可能不同，React 就无法正确找到对应的状态。

### useEffect vs useLayoutEffect

| | useEffect | useLayoutEffect |
| --- | --- | --- |
| 执行时机 | 浏览器绘制后异步执行 | DOM 更新后、浏览器绘制前同步执行 |
| 是否阻塞渲染 | 否 | 是（同步阻塞） |
| 适用场景 | 绝大多数副作用（fetch、订阅） | 需要读取 DOM 尺寸、防止闪烁 |
| SSR | 安全 | 警告（服务端无 DOM） |

实践建议：先用 `useEffect`，出现页面闪烁再换 `useLayoutEffect`。

### useState 常见陷阱

**直接修改数组/对象不触发更新**（引用未变）：

```jsx
// ❌ 错误
const [list, setList] = useState([1, 2, 3])
list.push(4)
setList(list) // 引用没变，不触发更新

// ✅ 正确：返回新数组
setList([...list, 4])
```

**初始值只在首次渲染生效**，后续 props 变化不会重置 state：

```jsx
const [value, setValue] = useState(props.initial)
// props.initial 之后变了，value 不会自动跟着变
// 需要配合 useEffect 处理
useEffect(() => {
  setValue(props.initial)
}, [props.initial])
```

### Hooks 与生命周期对照

| 类组件 | Hooks |
| --- | --- |
| `componentDidMount` | `useEffect(() => {}, [])` |
| `componentDidUpdate` | `useEffect(() => {}, [deps])` |
| `componentWillUnmount` | `useEffect` cleanup 函数 |
| `shouldComponentUpdate` | `React.memo` + `useMemo` |
| `getDerivedStateFromProps` | `useState` + 在渲染时直接派生 |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` 读取 DOM |

### 面试回答

> Hooks 让函数组件能有状态和副作用，解决了三个问题：HOC 嵌套地狱（自定义 Hook 复用逻辑）、生命周期逻辑分散（useEffect 集中管理）、class 的 this 复杂性。useState 返回数组是为了自由命名。Hooks 必须在函数顶层调用，因为 React 靠调用顺序来维护状态链表，条件分支会打乱顺序。useEffect 是异步的，useLayoutEffect 在浏览器绘制前同步执行，用于防止 DOM 闪烁。

## 参考来源

- [React: Hooks Reference](https://react.dev/reference/react)
- [React: Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React: Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
