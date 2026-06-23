# React Router

## 问题

React Router 的实现原理是什么？Link 和 a 标签有什么区别？BrowserRouter 和 HashRouter 有什么不同？如何获取路由参数？

## 结论

### 理解路径

React Router 在 history/hash 模式的基础上封装了一层，让 URL 变化能映射到组件渲染。核心是：URL 变化 → 匹配 Route → 渲染对应组件，整个过程不刷新页面。

### 实现原理

React Router 底层依赖 `history` 库，提供两种路由模式：

- **BrowserRouter**：用 `history.pushState` / `popstate` 事件，URL 格式干净（`/user/1`）
- **HashRouter**：用 `location.hash` / `hashchange` 事件，URL 带 `#`（`/#/user/1`）

每次 URL 变化时，Router 遍历注册的 Route 列表，找到匹配的 path，渲染对应组件。

### BrowserRouter vs HashRouter

| | BrowserRouter | HashRouter |
| --- | --- | --- |
| URL 格式 | `example.com/user/1` | `example.com/#/user/1` |
| 实现 | H5 History API | hash + hashchange |
| 服务端配置 | 需要将所有路径返回 `index.html` | 无需（hash 不发到服务器） |
| SEO | 友好 | 不友好（搜索引擎忽略 hash） |

**Nginx 配置（BrowserRouter 必须）**：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 路由配置（React Router v5）

```jsx
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/user/:id' component={User} />
        <Redirect from='/users/:id' to='/user/:id' />
      </Switch>
    </BrowserRouter>
  )
}
```

**Switch** 的作用：只渲染第一个匹配的 Route。没有 Switch 时，`/user/1` 可能同时匹配 `/` 和 `/user/:id`，导致两个组件都渲染。

### Link vs a 标签

```jsx
// Link — React Router 管理的跳转，不刷新页面
<Link to='/about'>关于</Link>

// a — 原生 HTML，会完整刷新页面
<a href='/about'>关于</a>
```

`<Link>` 底层：阻止 `<a>` 的默认跳转行为，用 `history.push` 更新 URL，React Router 监听到变化后重新渲染匹配组件。

### 获取路由参数

**动态路由参数（`:id`）**：

```jsx
// 路由定义
<Route path='/user/:id' component={User} />

// 组件内获取（v5）
const { id } = this.props.match.params
// 或 Hooks
const { id } = useParams()
```

**查询参数（?key=value）**：

```jsx
// URL: /search?q=react&page=1
const location = useLocation()
const params = new URLSearchParams(location.search)
params.get('q')    // 'react'
params.get('page') // '1'
```

**获取历史对象**：

```jsx
const history = useHistory() // v5
history.push('/other-page')
history.goBack()
```

### 重定向

```jsx
// v5 声明式重定向
<Redirect from='/old' to='/new' />

// 编程式（v5）
this.props.history.push('/new')
useHistory().push('/new')
```

### 路由懒加载

```jsx
const User = React.lazy(() => import('./pages/User'))

<Suspense fallback={<Loading />}>
  <Route path='/user' component={User} />
</Suspense>
```

### 路由变化时重新渲染同一个组件

当路由变化但渲染的是同一个组件时（例如从 `/news/top` 跳转到 `/news/hot`），组件不会卸载重建，需要在生命周期/Hooks 中监听路由变化并重新请求数据：

```javascript
// 类组件（v5）
componentDidMount() {
  this.fetchData(this.props.location)
}
componentWillReceiveProps(nextProps) {
  if (nextProps.location.pathname !== this.props.location.pathname) {
    this.fetchData(nextProps.location)
  }
}

// 函数组件（Hooks）
const location = useLocation()
useEffect(() => {
  fetchData(location.pathname)
}, [location.pathname])
```

### React Router 4 的 Switch 有什么用

`<Switch>` 只渲染第一个与当前 URL 匹配的 `<Route>` 或 `<Redirect>`。

没有 `<Switch>` 时，`/login` 路径会同时匹配 `path="/"` 和 `path="/login"`，导致两个组件都渲染。加上 `<Switch>` 后只匹配第一个，再配合 `exact` 做精确匹配：

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route exact path="/login" component={Login} />
</Switch>
```

### 如何配置 React-Router 实现路由切换

**方式一：声明式（JSX）**

```jsx
import { BrowserRouter, Route, Switch } from 'react-router-dom'

<BrowserRouter>
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/user/:id" component={User} />
  </Switch>
</BrowserRouter>
```

**方式二：配置式（v6+）**

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
])

<RouterProvider router={router} />
```

### 面试回答

> React Router 基于 history API（BrowserRouter）或 hash（HashRouter）实现无刷新路由跳转。URL 变化时 Router 找到匹配的 Route 并渲染对应组件。`<Link>` 阻止了 `<a>` 默认跳转，改用 history.push 更新 URL，实现 SPA 内页面切换。BrowserRouter 需要服务端配合把所有路径返回 index.html，HashRouter 不需要。Switch 保证只渲染第一个匹配的路由。

## 参考来源

- [React Router: Basic Routing](https://reactrouter.com/en/main/start/tutorial)
- [React Router: useParams](https://reactrouter.com/en/main/hooks/use-params)
