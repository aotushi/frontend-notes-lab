# Document、DOM 树与渲染树

## 问题

`window` 和 `document` 有什么区别？DOM 在 JavaScript 中有什么作用？DOM 树和渲染树有什么区别？`attribute` 和 `property` 有什么区别？`Node`、`Element`、`HTMLCollection`、`NodeList` 和 `DocumentFragment` 应该怎么区分？

## 结论

`window` 是浏览器窗口的全局对象，代表当前浏览上下文；`document` 是 `window.document`，代表当前加载的 HTML 文档。JavaScript 操作页面，本质上通常是在读写 DOM。

DOM 是浏览器把 HTML 解析后暴露给脚本的对象模型。HTML 源码会被解析成节点树，脚本可以通过 DOM API 查询、修改、创建、删除节点。

DOM 树和渲染树不同：

| 对象 | 包含什么 | 用途 |
| --- | --- | --- |
| DOM 树 | HTML 文档节点，包括不可见节点、`head`、`script` 等 | 给 JS 和浏览器表示文档结构 |
| CSSOM | CSS 规则和计算样式信息 | 表示样式规则 |
| 渲染树 | DOM 中需要参与视觉渲染的节点和样式信息 | 用于布局和绘制 |

例如 `display: none` 的元素在 DOM 中存在，但不会进入渲染树。`visibility: hidden` 的元素仍占布局空间，处理方式又不同。

`attribute` 和 `property`：

- attribute 是 HTML 标记上的属性，例如 `<input value="abc">` 里的 `value`。
- property 是 DOM 对象上的属性，例如 `input.value`。
- 标准属性通常有映射关系，但不是所有情况都同步；自定义 attribute 和 DOM property 更不能混为一谈。

### `Node` 和 `Element` 有什么区别？

`Node` 是 DOM 树中所有节点类型的基础接口，元素、文本、注释、文档本身都可以是节点。`Element` 是 `Node` 的子类型，只表示元素节点，对应 HTML 或 SVG 里的标签。

| 对象 | 表示什么 | 常见 API |
| --- | --- | --- |
| `Node` | 任意 DOM 节点 | `nodeType`、`nodeName`、`textContent`、`parentNode`、`childNodes` |
| `Element` | 元素节点 | `tagName`、`classList`、`attributes`、`children`、`querySelector()` |

```js
const title = document.querySelector('h1')
const text = title.firstChild

title instanceof Node // true
title instanceof Element // true

text instanceof Node // true
text instanceof Element // false
```

判断节点类型时不要只看 `nodeName` 字符串；需要区分元素、文本、注释时，优先使用 `nodeType` 或 `instanceof Element` 这类明确判断。

### `HTMLCollection` 和 `NodeList` 有什么区别？

`HTMLCollection` 只包含元素节点，通常由 `getElementsByTagName()`、`getElementsByClassName()`、`children` 返回。`NodeList` 可以包含任意节点，常见来源是 `querySelectorAll()` 和 `childNodes`。

| 维度 | `HTMLCollection` | `NodeList` |
| --- | --- | --- |
| 内容 | 元素节点 | 可能是元素、文本、注释等节点 |
| 常见来源 | `getElementsBy*()`、`children` | `querySelectorAll()`、`childNodes` |
| 动态性 | 通常是 live collection | `querySelectorAll()` 返回静态集合，`childNodes` 返回 live collection |
| 数组方法 | 不是数组 | 不是数组，现代浏览器支持 `forEach()` |

```js
const liveItems = document.getElementsByClassName('item')
const staticItems = document.querySelectorAll('.item')

document.body.append(document.createElement('div')).className = 'item'

liveItems.length // 会随 DOM 变化更新
staticItems.length // 保持 querySelectorAll 执行时的结果
```

如果要使用 `map()`、`filter()` 等数组方法，先显式转换：

```js
const texts = [...document.querySelectorAll('.item')].map((item) => item.textContent)
```

### 如何一次性插入多个 DOM 节点？

频繁逐个插入节点会增加样式计算、布局和绘制压力。批量创建节点时，可以先在内存中构建，再一次性挂到页面上。

常见方式：

1. 用 `DocumentFragment` 承载一批真实节点。
2. 用 `<template>` 先解析一段 HTML 片段，再克隆或插入。
3. 在框架里依赖框架自身的批处理，不绕过框架直接操作同一块 DOM。

```js
const list = document.querySelector('.list')
const fragment = document.createDocumentFragment()

for (let i = 0; i < 100; i += 1) {
  const item = document.createElement('li')
  item.textContent = `item ${i + 1}`
  fragment.append(item)
}

list.append(fragment)
```

`DocumentFragment` 本身不是最终 DOM 树里的可见节点。把它 append 到页面时，它的子节点会被移动到目标位置，fragment 会被清空。

## Demo

```html
<input id="name" value="初始值">
<script>
  const input = document.getElementById('name');

  input.value = '用户输入';

  console.log(input.getAttribute('value')); // 初始值
  console.log(input.value); // 用户输入
  console.log(window.document === document); // true
</script>
```

面试回答：

> `window` 是浏览器窗口全局对象，`document` 是当前 HTML 文档对象。DOM 是 HTML 被解析后的对象树，JS 通过 DOM API 操作页面。DOM 树包含文档结构，渲染树只包含需要参与渲染的节点和样式信息。attribute 是 HTML 标记属性，property 是 DOM 对象属性，两者有关联但不能完全等同。

## 参考来源

- [MDN: Document](https://developer.mozilla.org/en-US/docs/Web/API/Document)
- [MDN: Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)
- [MDN: Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN: Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
- [MDN: Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
- [MDN: HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)
- [MDN: NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)
- [MDN: DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)
