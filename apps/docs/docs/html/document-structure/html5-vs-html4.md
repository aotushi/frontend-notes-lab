# HTML5 与 HTML4 有什么不同？

## 问题

如何区分 HTML 和 HTML5？HTML5 新增了哪些能力？移除了哪些元素？HTML5 页面结构和 HTML4 有什么不同？

## 结论

面试里不要把 HTML5 只理解成“多了几个标签”。HTML5 更准确地代表现代 HTML 平台的一批能力：更简单的 doctype、语义化结构元素、媒体元素、增强表单、Canvas、Web Storage、History、Web Worker、WebSocket 等。

文档结构层面的重点：

- doctype 简化为 `<!doctype html>`。
- 新增或强化语义结构元素：`header`、`nav`、`main`、`article`、`section`、`aside`、`footer`。
- 媒体和图形能力：`audio`、`video`、`canvas`、`svg`。
- 表单控件增强：`email`、`url`、`date`、`search` 等输入类型。
- 本地能力和 Web API：`localStorage`、`sessionStorage`、History、Worker、WebSocket 等。

HTML5 移除了或不再推荐一批纯表现或可用性差的元素，例如 `font`、`center`、`big`、`strike`、`tt`、`frame`、`frameset`。现代页面应使用 CSS 负责表现，用语义元素负责结构。

常见被移除或不推荐作为现代答案重点的元素：

- 表现类：`font`、`center`、`big`、`strike`、`tt`。
- 框架集：`frame`、`frameset`、`noframes`。
- 旧插件能力：`applet`。
- 容易混淆或已废弃：`acronym` 等。

旧资料里常提“IE8 通过 html5shiv 支持新标签”。这是历史兼容知识，不适合作为现代面试重点。今天更重要的是：理解语义结构、渐进增强和目标浏览器兼容边界。

## Demo

HTML4 风格常见结构：

```html
<div id="header"></div>
<div id="nav"></div>
<div id="content"></div>
<div id="footer"></div>
```

HTML5 语义结构：

```html
<header>...</header>
<nav>...</nav>
<main>
  <article>...</article>
</main>
<footer>...</footer>
```

面试回答：

> HTML5 的区别包括更简单的 doctype、新的语义化结构元素、媒体和图形元素、增强表单、本地存储、History、Worker、WebSocket 等 Web API。文档结构上，HTML5 推荐用 `header`、`nav`、`main`、`article`、`section`、`footer` 表达区域，而不是全靠 `div` 和 class。纯表现元素和框架集元素已经不适合作为现代页面结构。

## 常见问题

### Web Worker 是什么？如何使用？

Web Worker 让 JavaScript 可以在后台线程运行，不阻塞主线程和页面渲染。适合处理 CPU 密集型任务，例如大数组计算、图像处理、复杂数据转换等。

Worker 和主线程之间通过 `postMessage` 传递消息，不共享 DOM。

基本使用步骤：

1. 检测浏览器支持
2. 创建 Worker 文件（独立 JS 文件）
3. 在主线程创建 Worker 实例并监听消息

```js
// 主线程
if ('Worker' in window) {
  const worker = new Worker('/worker.js');

  // 向 Worker 发送数据
  worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

  // 接收 Worker 返回结果
  worker.addEventListener('message', (e) => {
    console.log('Worker 返回：', e.data);
  });
}
```

```js
// worker.js（Worker 文件）
self.addEventListener('message', (e) => {
  const result = e.data.numbers.reduce((sum, n) => sum + n, 0);
  // 把结果发回主线程
  self.postMessage(result);
});
```

Worker 无法访问 DOM、`window`、`document`。需要频繁通信或传递大量数据时注意拷贝成本，可使用 Transferable Objects（如 ArrayBuffer）转移所有权避免复制。

### HTML5 drag API 有哪些事件？

HTML5 拖放 API 提供了一组原生拖放事件，分别作用于被拖动元素和目标元素：

| 事件 | 事件主体 | 触发时机 |
| --- | --- | --- |
| `dragstart` | 被拖放元素 | 开始拖放时触发 |
| `drag` | 被拖放元素 | 正在拖放过程中持续触发 |
| `dragenter` | 目标元素 | 被拖放元素进入目标元素时触发 |
| `dragover` | 目标元素 | 被拖放元素在目标元素内移动时触发 |
| `dragleave` | 目标元素 | 被拖放元素移出目标元素时触发 |
| `drop` | 目标元素 | 在目标元素上放下被拖放元素时触发 |
| `dragend` | 被拖放元素 | 整个拖放操作结束时触发 |

使用时需要给元素加 `draggable="true"`，并在目标元素的 `dragover` 事件中调用 `event.preventDefault()` 才能触发 `drop`：

```html
<div draggable="true" id="item">拖我</div>
<div id="target">放这里</div>
```

```js
const item = document.getElementById('item');
const target = document.getElementById('target');

item.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', item.id);
});

target.addEventListener('dragover', (e) => {
  // 必须阻止默认行为才能接受 drop
  e.preventDefault();
});

target.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  target.appendChild(document.getElementById(id));
});
```

## 参考来源

- [MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [MDN: HTML content categories](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Guides/Content_categories)
- [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [MDN: HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
