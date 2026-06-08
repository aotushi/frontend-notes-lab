# Document、DOM 树与渲染树

## 问题

`window` 和 `document` 有什么区别？DOM 在 JavaScript 中有什么作用？DOM 树和渲染树有什么区别？`attribute` 和 `property` 有什么区别？

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
