# 类组件与函数组件

## 问题

类组件和函数组件有什么区别？什么是 PureComponent？HOC、render props、Hooks 分别解决什么问题？什么是受控/非受控组件？ref 怎么用？

## 结论

### 理解路径

React 组件有两种形式：基于 ES6 class 的类组件和函数组件。Hooks 出现后，函数组件可以完全替代类组件。围绕组件还有一组关键特性：性能优化（PureComponent/memo）、逻辑复用（HOC/render props/Hooks）、表单控制（受控/非受控）、DOM 引用（ref）。

### 类组件 vs 函数组件

| | 类组件 | 函数组件 |
| --- | --- | --- |
| 状态 | `this.state` + `setState` | `useState` |
| 生命周期 | 生命周期方法 | `useEffect` 模拟 |
| this | 需要处理 this 绑定 | 无 this 问题 |
| 设计思想 | 面向对象，继承 | 函数式，纯函数 |
| 性能优化 | `shouldComponentUpdate` / PureComponent | `React.memo` + `useMemo` / `useCallback` |
| 未来方向 | 逐渐淡出 | 官方推荐 |

**选择标准**：现代 React（16.8+）优先用函数组件 + Hooks，逻辑更清晰，复用更容易。

### PureComponent

`React.PureComponent` 相当于在 class 组件中自动实现了 `shouldComponentUpdate`，进行 **props 和 state 的浅比较**。如果都没有变化，跳过 render。

```jsx
// 类组件用 PureComponent
class MyList extends React.PureComponent {
  render() { return <ul>{this.props.items.map(i => <li key={i}>{i}</li>)}</ul> }
}

// 函数组件等价物：React.memo
const MyList = React.memo(({ items }) => (
  <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
))
```

**注意**：浅比较对引用类型只比地址，不比内容。如果传入对象/数组且内部值变了但引用没变，不会触发更新。

### HOC / render props / Hooks

三者都是解决**组件逻辑复用**的方案，演化路径：HOC → render props → Hooks。

**HOC（高阶组件）**：接收组件返回新组件的函数。

```jsx
function withAuth(WrappedComponent) {
  return function AuthWrapper(props) {
    if (!isLoggedIn()) return <Redirect to='/login' />
    return <WrappedComponent {...props} />
  }
}
export default withAuth(Dashboard)
```

缺点：props 可能被覆盖，多层 HOC 嵌套不直观。

**render props**：通过 props 传入渲染函数，将数据共享给调用方。

```jsx
<DataFetcher url='/api/user' render={data => <UserCard data={data} />} />
```

缺点：嵌套地狱，无法在 return 外访问数据。

**Hooks**：在函数组件内直接使用状态和副作用，是现代推荐方案。

```jsx
function useAuth() {
  const [user, setUser] = useState(null)
  useEffect(() => { fetchUser().then(setUser) }, [])
  return user
}

function Dashboard() {
  const user = useAuth()
  return <div>{user?.name}</div>
}
```

### 受控组件 vs 非受控组件

**受控组件**：表单值由 React state 控制，每次变化都触发 onChange 更新 state。

```jsx
function Form() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
```

**非受控组件**：表单值存在 DOM 中，用 ref 在需要时读取。

```jsx
function Form() {
  const inputRef = useRef(null)
  const handleSubmit = () => alert(inputRef.current.value)
  return <input ref={inputRef} defaultValue='默认值' />
}
```

| | 受控组件 | 非受控组件 |
| --- | --- | --- |
| 值存在哪里 | React state | DOM |
| 更新方式 | onChange → setState | 不监听，用时读取 |
| 适合场景 | 需要实时验证/联动/格式化 | 简单表单、文件上传 |

### ref 的使用

ref 用于访问 DOM 元素或组件实例，三种创建方式：

```jsx
// 1. useRef（函数组件推荐）
const inputRef = useRef(null)
<input ref={inputRef} />
inputRef.current.focus()

// 2. React.createRef（类组件）
this.myRef = React.createRef()
<div ref={this.myRef} />

// 3. 回调 ref
<input ref={el => this.input = el} />
```

**forwardRef**：让父组件通过 ref 访问子组件内部 DOM（函数组件默认无法直接接收 ref）：

```jsx
const FancyInput = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} />
))

// 父组件
const ref = useRef()
<FancyInput ref={ref} />
ref.current.focus() // 访问子组件内部 input
```

**注意**：ref 在 render 阶段 DOM 还未挂载，不能在 render 中访问，要在 `componentDidMount` 或 `useEffect` 中使用。

### Fragment 和 Portals

**Fragment**：允许组件返回多个根元素，不会产生额外 DOM 节点。

```jsx
return (
  <React.Fragment>
    <h1>标题</h1>
    <p>内容</p>
  </React.Fragment>
)
// 简写
return <>
  <h1>标题</h1>
  <p>内容</p>
</>
```

**Portals**：将子节点渲染到父组件 DOM 层级之外（常用于 Modal、Tooltip）。

```jsx
ReactDOM.createPortal(
  <Modal />,
  document.getElementById('modal-root') // 挂载到 body 下的独立节点
)
```

典型场景：父组件有 `overflow: hidden` 或 `z-index` 限制，需要把 Modal 挂到更高层级。

### React Fiber

React 15 的 diff 是同步递归，长时间占用 JS 线程会导致页面卡顿。Fiber 是 React 16 引入的新协调架构：

- 将渲染任务切分成可中断的小单元（fiber 节点）
- 可以"让出" CPU，优先响应用户交互
- 高优先级任务（用户输入）可以打断低优先级任务（数据更新）

核心价值：保持应用在复杂更新下仍能流畅响应用户操作。

### 面试回答

> 函数组件更轻量，配合 Hooks 已能完全替代类组件。类组件靠生命周期和 `this` 管理状态，函数组件靠 Hooks，没有 this 烦恼。PureComponent 做浅比较优化，等价于函数组件的 `React.memo`。HOC、render props、Hooks 都解决逻辑复用问题，Hooks 最简洁。受控组件值在 state 里，非受控组件值在 DOM 里用 ref 取。

### Component、Element、Instance 的区别

- **Element（元素）**：普通 JS 对象，描述 DOM 节点或组件要呈现的样子。通过 JSX 或 `React.createElement()` 创建，创建后不可变。
- **Component（组件）**：可以是函数或 class，接收 props，返回 Element 树。
- **Instance（实例）**：class 组件中 `this` 指向的对象，用来存储本地状态和响应生命周期。函数组件没有实例。

React 帮你创建和管理实例，通常不需要手动创建组件实例。

### React.createClass 和 extends Component 的区别

`React.createClass` 是 ES5 时代的写法，现已废弃；`extends React.Component` 是 ES6 class 写法，是当前标准。主要区别：

| | `React.createClass` | `extends Component` |
| --- | --- | --- |
| this 绑定 | 自动绑定所有方法 | 需手动 bind 或用箭头函数 |
| 状态初始化 | `getInitialState()` | constructor 中 `this.state = ...` |
| 默认 props | `getDefaultProps()` | 静态属性 `defaultProps` |
| Mixins | 支持 `mixins` 属性 | 不支持（用 HOC/Hooks 替代） |

### 对 componentWillReceiveProps 的理解

当组件接收到新 props 时执行，初始化 render 时不执行。可以在此根据新 props 更新 state，旧 props 通过 `this.props` 仍可访问。

**注意**：该方法在 React 16.3 中被标记为不安全（`UNSAFE_componentWillReceiveProps`），React 16.3 引入 `getDerivedStateFromProps` 作为替代。

### 哪些方法会触发 React 重新渲染？render 做什么？

**触发重新渲染的情况：**
- `setState()` 被调用（setState 传 null 例外，不触发 render）
- 父组件重新渲染（即使传入的 props 未变化）
- `forceUpdate()` 调用

**render 做的事：**
- 对新旧 VNode 进行 diff 对比
- 找出差异，生成最小化更新补丁
- 批量更新真实 DOM

### React 如何判断什么时候重新渲染组件？

组件状态（state/props）改变时，React 默认会重新渲染，因为 `shouldComponentUpdate` 默认返回 `true`。

可以重写 `shouldComponentUpdate(nextProps, nextState)` 返回 `false` 来跳过渲染；或使用 `PureComponent`（自动浅比较）；函数组件使用 `React.memo`。

### React 声明组件有哪几种方法

三种方式：

1. **函数组件**（现代推荐）：纯函数，接收 props 返回 JSX，配合 Hooks 使用
2. **ES6 class 组件**：继承 `React.Component`，有生命周期和 `this`
3. **React.createClass**（已废弃）：ES5 写法，不推荐

函数组件没有实例，不能访问 `this`，不能直接使用生命周期方法（用 `useEffect` 替代）。

### 对有状态组件和无状态组件的理解及使用场景

**有状态组件**：维护自身 state，可访问生命周期，适合需要状态管理的场景。可以是 class 组件或用 Hooks 的函数组件。

**无状态组件**：不依赖自身 state，只根据 props 渲染，无副作用。优先设计为纯函数组件，性能更好，代码更简洁。

原则：能无状态就无状态，状态越少越好管理。

### render 阶段可以访问 refs 吗？

不可以。render 阶段 DOM 还未生成，`ref.current` 为 `null`。需要在 commit 阶段之后（`componentDidMount`、`componentDidUpdate`、`useEffect`）才能访问 ref。

### 在 React 中如何避免不必要的 render

- **类组件**：使用 `shouldComponentUpdate` 手动控制，或继承 `PureComponent` 做浅比较
- **函数组件**：使用 `React.memo` 包裹组件，对 props 做浅比较
- **Hooks 优化**：使用 `useMemo` 缓存计算结果，使用 `useCallback` 缓存函数引用，避免每次 render 产生新引用

### 对 React context 的理解

Context 提供了一种在组件树中共享数据的方式，不必通过 props 逐层传递。

```jsx
// 创建 context
const ThemeContext = React.createContext('light')

// 提供者
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 消费者（函数组件用 useContext）
const theme = useContext(ThemeContext)
```

适合：主题、语言、登录用户等全局配置，不适合频繁更新的数据（每次 Provider value 变化会导致所有消费组件重渲染）。

### 为什么 React 不推荐优先使用 Context

- Context 的更新会触发所有消费该 Context 的组件重渲染，若中间组件 `shouldComponentUpdate` 返回 false，更新也不会中断
- Context 增加了组件耦合度，降低了可复用性
- 频繁更新的数据放在 Context 里性能较差
- 推荐优先用 props/state，其次用成熟的状态管理库（Redux/Zustand），最后才考虑 Context

### 对 React-Intl 的理解，它的工作原理

React-Intl 是 Yahoo FormatJS 项目的一部分，提供 React 组件和 API 实现国际化（i18n）。

工作原理：在配置不同语言包（如 `zh.json`、`en.json`）后，根据当前语言设置在语言包之间切换，提供数字格式化、日期格式化、字符串翻译等能力。

```jsx
// 使用 FormattedMessage 组件
<FormattedMessage id="greeting" defaultMessage="Hello, {name}!" values={{ name: 'World' }} />
```

### React 中除构造函数外绑定 this 的方式

```javascript
// 1. 构造函数中 bind
constructor(props) {
  super(props)
  this.handleClick = this.handleClick.bind(this)
}

// 2. class 字段（箭头函数）—— 推荐
handleClick = () => {
  console.log(this.state)
}

// 3. render 中 bind（不推荐，每次 render 产生新函数）
<button onClick={this.handleClick.bind(this)}>点我</button>

// 4. render 中箭头函数（不推荐，每次 render 产生新函数）
<button onClick={() => this.handleClick()}>点我</button>
```

### React 组件的构造函数有什么作用？是否必须？

构造函数主要用于：
- 通过 `this.state = {...}` 初始化本地状态
- 绑定事件处理方法到实例

**不是必须的**。如果不需要初始化 state 也不需要手动绑定方法（用 class 字段箭头函数），可以省略构造函数。如果写了构造函数，必须先调用 `super(props)`，否则无法在构造函数中使用 `this.props`。

### React.forwardRef 是什么？有什么作用？

`React.forwardRef` 允许函数组件接收父组件传来的 `ref`，并将其转发到内部 DOM 元素或子组件上。

```jsx
const FancyInput = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} />
))

// 父组件
const inputRef = useRef()
<FancyInput ref={inputRef} />
inputRef.current.focus() // 直接访问子组件内部 input
```

主要场景：设计库组件时，让使用方能访问底层 DOM 节点；在 HOC 中向下传递 ref。

### React 组件命名推荐方式

推荐通过**引用**命名，即直接用 class 名或函数名，而不是 `displayName`：

```javascript
// 推荐
export default class TodoApp extends React.Component { /* ... */ }

// 不推荐（displayName 方式）
export default React.createClass({
  displayName: 'TodoApp',
})
```

### React 最新版本（16.x）解决了什么问题

- **Time Slicing**（时间切片）：让 CPU 密集型任务可中断，保持页面响应流畅
- **Suspense**：配合 `React.lazy` 实现异步加载组件，优雅处理加载状态
- **Hooks**（16.8）：函数组件支持 state 和生命周期，解决逻辑复用难、class this 绑定烦等问题
- **错误边界**（`componentDidCatch`）：捕获子组件错误，展示 fallback UI

### React 如何实现全局 Dialog

常用方式：结合 `ReactDOM.createPortal` 将 Dialog 挂载到 `body` 下的独立 DOM 节点，避免被父组件的 `overflow: hidden` 或 `z-index` 限制：

```javascript
// 创建挂载点
const modalRoot = document.getElementById('modal-root')

// Dialog 组件
function Dialog({ children, onClose }) {
  return ReactDOM.createPortal(
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  )
}
```

也可以通过全局状态（Redux/Context）控制 Dialog 的显隐，结合 Portals 渲染到合适位置。

### React 数据持久化

Redux store 中的数据在页面刷新后会丢失，解决方案：

- **redux-persist**：自动将 Redux store 同步到 localStorage/sessionStorage，刷新后自动恢复
- **localStorage/sessionStorage**：手动读写，适合简单场景
- **URL 参数**：通过路由 state 传递临时数据（`history.push('/page', { data })` ）

### 对 React 和 Vue 的理解，异同

**相同点**：都使用 Virtual DOM、都有组件化开发、都专注于视图层、都有各自的路由和状态管理生态。

**不同点**：

| | React | Vue |
| --- | --- | --- |
| 数据绑定 | 单向 | 双向（v-model） |
| 模板 | JSX | HTML 模板 |
| 数据检测 | 引用比较（需手动优化） | Proxy 自动追踪 |
| 逻辑复用 | Hooks | Composition API |
| 学习曲线 | 较陡（JS 全栈） | 较平（模板贴近 HTML） |

### 可以用 TypeScript 写 React 应用吗

可以：

```bash
# 新建项目
npx create-react-app my-app --template typescript

# 已有项目迁移
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
# 将 .js 重命名为 .tsx
```

TypeScript 项目用接口/类型定义替代 PropTypes，IDE 类型提示更强，推荐在中大型项目使用。

### React 设计思路与理念

1. **声明式编程**：描述 UI 应该是什么样子，而非怎么操作 DOM
2. **组件化**：每个功能封装成独立组件，可组合、可复用、可测试
3. **单向数据流**：数据从父到子传递，流向清晰可预测
4. **Virtual DOM**：UI 描述与 DOM 解耦，支持跨平台（React Native、SSR）
5. **函数式编程**：纯函数组件，相同输入得到相同输出

核心目标：让 UI 成为状态的函数（`UI = f(state)`），让状态变化驱动 UI 更新，开发者只需关心状态，无需手动操作 DOM。

### React 中 props.children 和 React.Children 的区别

- **`props.children`**：直接访问子节点，是子节点的原始形式（可能是 undefined、单个元素、数组等）
- **`React.Children`**：React 提供的工具方法集合，能安全处理各种 children 类型

```jsx
// React.Children.map 可安全处理 null/undefined/单个元素/数组
React.Children.map(props.children, child => {
  return React.cloneElement(child, { name: props.name }) // 给每个子组件注入 props
})

// React.Children.count 获取子节点数量
// React.Children.toArray 转换为扁平数组
```

主要区别：`React.Children.map` 能处理 children 为 null 或 undefined 的情况，而 JS 原生 `Array.map` 不能。

### React 的状态提升

将多个子组件共享的状态移动到它们最近的共同父组件中，由父组件管理状态并通过 props 分发给子组件，子组件通过回调函数通知父组件更新。

```jsx
function Parent() {
  const [value, setValue] = useState('')
  return (
    <>
      <Input value={value} onChange={setValue} />
      <Preview value={value} />
    </>
  )
}
```

适合场景：兄弟组件需要共享/同步数据时。

### React 中 constructor 和 getInitialState 的区别

两者都用于初始化 state，区别在于语法：
- `getInitialState`：ES5 `React.createClass` 方式（已废弃）
- `constructor` 中 `this.state = {}`：ES6 class 方式（现代标准）

新版本 React 中 `getInitialState` 已不可用，统一用 constructor 或 class 字段 `state = {}`。

### React 严格模式（StrictMode）

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

StrictMode 不渲染任何 UI，仅在**开发环境**为后代组件触发额外检查：
- 识别不安全的生命周期（`UNSAFE_` 系列）
- 警告过时的字符串 ref、废弃的 findDOMNode
- 检测意外副作用（在开发模式下故意调用 render 两次）
- 检测过时的 Context API

### 在 React 中遍历的方法

```jsx
// 遍历数组 — 用 map（返回值）
{arr.map((item, index) => <li key={index}>{item}</li>)}

// 遍历对象 — 用 Object.entries().map
{Object.entries(obj).map(([key, value]) => <li key={key}>{value}</li>)}

// 注意：forEach 没有返回值，不能直接用在 JSX 中
```

### 在 React 中页面重新加载时怎样保留数据

- **Redux + redux-persist**：持久化 store 到 localStorage，刷新后恢复
- **URL 参数**：将状态编码到 URL，刷新后从 URL 读取
- **sessionStorage/localStorage**：在 `componentWillUnmount` 或 `beforeunload` 时保存，进入时读取
- **History API state**：适合临时数据（`history.pushState({ data }, ...)`）

### 同时引用 react.js、react-dom.js 和 babel.js 的作用

- **react.js**：React 核心库，提供 `React.createElement`、Hooks、Context 等 API
- **react-dom.js**：React 与 DOM 的桥接层，提供 `ReactDOM.render`、`createPortal` 等
- **babel.js**：将 JSX 转换为 `React.createElement` 调用，让浏览器能理解 JSX 语法

### React 必须使用 JSX 吗

不是必须的。JSX 只是 `React.createElement(type, props, ...children)` 的语法糖：

```javascript
// JSX 写法
const el = <h1 className="title">Hello</h1>

// 等价的纯 JS 写法
const el = React.createElement('h1', { className: 'title' }, 'Hello')
```

不用 JSX 完全可以工作，但 JSX 更直观，推荐使用。React 17+ 不需要显式 `import React` 就能使用 JSX（babel 自动处理）。

### 为什么使用 JSX 的组件不写 import React 却还能工作

React 17 之前：JSX 编译为 `React.createElement()`，必须 `import React`，否则会报 `React is not defined`。

React 17 之后：新的 JSX 转换（babel 配合 `@babel/plugin-transform-react-jsx`）会自动从 `react/jsx-runtime` 引入，不需要手动 `import React`。

### 为什么使用 JSX

JSX 让 React 代码更接近 UI 的直觉表达（树形结构），相比纯 `React.createElement` 调用：
- 可读性强，层次结构一目了然
- 易于编写复杂嵌套结构
- 编译时可做静态分析和优化

React 团队不想引入新的模板语言，JSX 是 JavaScript 的语法扩展，保持了 JS 的完整能力。

### 在 React 中怎么使用 async/await

直接在事件处理函数或 `useEffect` 中使用，需要 Babel 配置支持（CRA 项目默认支持）：

```javascript
// 事件处理
handleSubmit = async (e) => {
  e.preventDefault()
  const data = await fetchData()
  this.setState({ data })
}

// useEffect（注意不能直接 async，要包一层）
useEffect(() => {
  const load = async () => {
    const data = await fetchData()
    setData(data)
  }
  load()
}, [])
```

### React.Children.map 和 JS 的 map 有什么区别

- **JS 的 `Array.map`**：要求对象必须是数组，对 null/undefined 会报错
- **`React.Children.map`**：能安全处理 children 为 null、undefined、单个元素或数组的情况，不会抛错

```javascript
// children 为 null 时
React.Children.map(null, fn)   // 返回 undefined，不报错
[null].map(fn)                  // 不报错，但结果包含 null
```

### 对 React SSR 的理解

SSR（服务端渲染）：在服务器端将 React 组件渲染成 HTML 字符串，直接返回给浏览器，再在客户端"水化"（hydrate）为可交互的应用。

**优势**：
- 更好的 SEO（爬虫可读完整 HTML）
- 更快的首屏渲染（不需要等 JS 下载执行）

**局限**：
- 服务端压力大（高并发时消耗 CPU）
- 开发限制多（部分生命周期不执行，无法访问 `window`/`document`）
- 构建部署更复杂

**React 18 SSR 改进**：支持流式渲染（Streaming SSR）和选择性水化，进一步提升首屏性能。

### React 中高阶组件运用了什么设计模式

HOC 运用了**装饰器模式（Decorator Pattern）**：在不修改原组件的前提下，通过包裹一层来增强其能力。

```javascript
// withWindowWidth 装饰了 BaseComponent，注入 windowWidth prop
function withWindowWidth(BaseComponent) {
  return class extends React.Component {
    state = { windowWidth: window.innerWidth }
    // 监听 resize 更新 state...
    render() {
      return <BaseComponent {...this.props} windowWidth={this.state.windowWidth} />
    }
  }
}
```

JavaScript 也有原生装饰器提案（`@decorator` 语法），但 HOC 是在装饰器提案标准化之前 React 社区的实践方案。

## 参考来源

- [React: Passing props to a component](https://react.dev/learn/passing-props-to-a-component)
- [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [React: Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
- [React: createPortal](https://react.dev/reference/react-dom/createPortal)
