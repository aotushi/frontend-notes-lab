# DOM 事件与节点操作

### 理解路径

DOM 是浏览器把 HTML 文档暴露给 JavaScript 的对象模型。事件机制解决"用户或浏览器动作如何传递给节点"，节点操作解决"如何查找、读取和修改文档结构"。它们都属于浏览器宿主 API，不属于 ECMAScript 语言核心。

### DOM 事件是什么？

DOM 事件是文档或浏览器窗口中发生的特定交互瞬间。它可以来自用户操作，也可以来自浏览器或脚本触发。

常见事件：

1. 用户操作：`click`、`input`、`keydown`、`mouseover`。
2. 页面和资源状态：`load`、`DOMContentLoaded`、`error`。
3. 表单和焦点：`submit`、`change`、`focus`、`blur`。

事件是 JavaScript 和 DOM 之间交互的入口。JavaScript 本身提供语法和执行能力，浏览器通过 DOM 事件把页面动作通知给 JavaScript。

### DOM 事件流是什么？

浏览器事件传播通常分为捕获、目标和冒泡三个阶段。

1. 捕获阶段：事件从 `window`、`document` 等外层对象向目标元素传播。
2. 目标阶段：事件到达真实触发的目标元素。
3. 冒泡阶段：事件从目标元素向外层祖先节点回传。

早期浏览器事件模型曾分别强调"捕获型事件流"和"冒泡型事件流"。现代 DOM 事件模型把两者合并到同一套传播流程中：先捕获，再到目标，再冒泡。

`addEventListener` 第三个参数或 options 中的 `capture` 可以决定监听捕获阶段还是冒泡阶段：

```js
button.addEventListener('click', onClick, { capture: false })
```

目标元素上的监听器会在目标阶段触发。注册为捕获监听器的回调通常先于冒泡监听器执行，但目标阶段不应理解成"目标元素不接收捕获监听器"。

常用控制方法：

1. `event.preventDefault()`：阻止默认行为，例如阻止链接跳转或表单默认提交。
2. `event.stopPropagation()`：阻止事件继续向后续传播阶段传播。
3. `event.stopImmediatePropagation()`：阻止当前节点上后续监听器执行，并停止传播。

### DOM 事件有哪些绑定方式？

常见事件绑定方式有三类：

| 方式 | 示例 | 特点 |
| --- | --- | --- |
| HTML 内联事件 | `<button onclick="handleClick()">按钮</button>` | 写法直观，但结构、行为耦合，不利于维护 |
| DOM0 属性绑定 | `button.onclick = handleClick` | 简单，但同一事件属性后赋值会覆盖前一个处理函数 |
| DOM2 事件监听 | `button.addEventListener('click', handleClick)` | 可绑定多个监听器，可配置捕获、一次性监听和被动监听 |

实际项目优先使用 `addEventListener`：

```js
function handleClick(event) {
  console.log(event.currentTarget)
}

button.addEventListener('click', handleClick)
```

需要解绑时，必须传入同一个函数引用：

```js
button.removeEventListener('click', handleClick)
```

### 事件委托有什么作用？

事件委托把子元素事件统一绑定到稳定的父元素上，利用冒泡阶段识别真实触发目标。

适用场景：

1. 列表项会动态增删。
2. 子元素数量多，需要减少监听器数量。
3. 多个子元素共享同类交互逻辑。

```js
list.addEventListener('click', (event) => {
  const item = event.target.closest('[data-id]')
  if (!item || !list.contains(item)) return
  console.log(item.dataset.id)
})
```

不是所有事件都适合委托。例如 `focus` / `blur` 默认不冒泡，可改用 `focusin` / `focusout`。

### 如何封装普通绑定和委托绑定？

事件绑定工具函数可以同时支持普通绑定和委托绑定。关键点是：如果传入选择器，就从事件目标向上查找匹配元素；如果没有传入选择器，就直接以绑定元素作为 `this`。

```js
function bindEvent(element, type, selector, handler) {
  if (typeof selector === 'function') {
    handler = selector
    selector = null
  }

  element.addEventListener(type, (event) => {
    if (!selector) {
      handler.call(element, event)
      return
    }

    const target = event.target.closest(selector)
    if (!target || !element.contains(target)) return

    handler.call(target, event)
  })
}

bindEvent(button, 'click', function (event) {
  event.preventDefault()
  console.log(this.textContent)
})

bindEvent(list, 'click', 'li', function () {
  console.log(this.textContent)
})
```

这个封装适合解释委托思路。真实项目中如果需要解绑，还应让函数返回清理函数，或显式保存内部监听器引用。

### `target` 和 `currentTarget` 有什么区别？

`event.target` 是最初触发事件的节点，`event.currentTarget` 是当前正在执行监听器的节点。

在事件委托中，通常用 `target` 找到被点击的子元素，用 `currentTarget` 表示绑定监听器的父元素。

```js
list.addEventListener('click', (event) => {
  console.log(event.target)
  console.log(event.currentTarget)
})
```

### DOM 查询和操作有哪些注意点？

1. `querySelector` / `querySelectorAll` 使用 CSS 选择器，表达能力强。
2. `getElementById` 返回单个元素，适合直接按 id 查询。
3. `getElementsByClassName`、`getElementsByTagName` 返回动态集合，DOM 变化后集合也会变化。
4. `querySelectorAll` 返回静态集合，查询后不会随 DOM 自动更新。
5. `getAttribute` / `setAttribute` 读写 HTML 属性，和元素对象属性不完全等价。
6. 频繁读写布局属性可能触发同步布局，应批量读写。
7. 大量插入节点时可以使用 `DocumentFragment` 或一次性 HTML 片段。

常见创建和修改节点 API：

| 能力 | API |
| --- | --- |
| 创建元素节点 | `document.createElement('h3')` |
| 创建文本节点 | `document.createTextNode('text')` |
| 追加子节点 | `parent.appendChild(node)` |
| 插入到指定节点前 | `parent.insertBefore(newNode, existingNode)` |
| 替换子节点 | `parent.replaceChild(newNode, oldNode)` |
| 删除子节点 | `parent.removeChild(node)` |

示例：

```js
const title = document.createElement('h3')
title.textContent = 'DOM API'
title.setAttribute('data-type', 'demo')

const fragment = document.createDocumentFragment()
fragment.appendChild(title)

container.appendChild(fragment)
```

### 如何判断页面滚动到底部？

页面滚动到底部时，「已滚动距离 + 视口高度 ≈ 内容总高度」。常用于无限滚动、触底加载：

```js
function isReachBottom(threshold = 0) {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const viewportHeight = window.innerHeight
  const contentHeight = document.documentElement.scrollHeight
  return scrollTop + viewportHeight >= contentHeight - threshold
}

window.addEventListener('scroll', () => {
  if (isReachBottom(100)) loadMore()
})
```

判断某个滚动容器是否到底，把 `window` 换成元素：

```js
function isContainerReachBottom(el, threshold = 0) {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - threshold
}
```

`scroll` 事件高频触发，实际项目应配合节流，或改用 `IntersectionObserver` 观察底部哨兵元素，避免频繁读取布局属性。

### 事件委托

```html
<ul id="todo-list">
  <li data-id="1">Learn JS</li>
  <li data-id="2">Review DOM</li>
</ul>

<script>
  const list = document.querySelector('#todo-list')

  list.addEventListener('click', (event) => {
    const item = event.target.closest('li[data-id]')
    if (!item) return
    console.log(item.dataset.id)
  })
</script>
```

## 参考来源

- [MDN: Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)
- [MDN: Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
- [MDN: EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN: Event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target)
- [MDN: Event.currentTarget](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget)
- [MDN: Document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
- [MDN: Document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
- [MDN: DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
