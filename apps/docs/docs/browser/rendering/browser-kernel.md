# 浏览器内核与渲染引擎

## 问题

如何理解浏览器内核？常见浏览器内核和渲染流程怎么回答？

## 结论

“浏览器内核”在面试中通常指浏览器渲染引擎及其周边能力，不只是 JavaScript 引擎。渲染引擎负责解析 HTML/CSS、构建 DOM/CSSOM、布局、绘制和合成；JavaScript 引擎负责执行 JS。

### 浏览器主要组成部分

| 组成部分 | 职责 |
| --- | --- |
| **用户界面** | 地址栏、前进/后退、书签等，除主窗口内容以外的 UI |
| **浏览器引擎** | 在用户界面与呈现引擎之间传送指令 |
| **呈现引擎（渲染引擎）** | 解析 HTML/CSS，将内容渲染到屏幕 |
| **网络模块** | 处理 HTTP 请求等网络调用，接口跨平台统一 |
| **UI 后端** | 绘制组合框、窗口等基础控件，底层调用操作系统 UI |
| **JavaScript 解释器** | 解析和执行 JavaScript 代码 |
| **数据存储** | 持久化层，管理 Cookie、LocalStorage、IndexedDB 等 |

注：Chrome 的每个标签页对应独立的呈现引擎实例（独立进程），实现沙箱隔离。

### 常见浏览器内核

| 内核 | 代表浏览器 | JS 引擎 | 特点 |
| --- | --- | --- | --- |
| **Blink** | Chrome、Edge、Opera（现代） | V8 | Webkit 分支，Google 主导，现主流标准 |
| **WebKit** | Safari | JavaScriptCore | 速度较快，兼容性较严格 |
| **Gecko** | Firefox | SpiderMonkey | 功能丰富，对复杂特性支持好，内存较高 |
| **Trident** | IE | JScript/Chakra | 早期主流，标准支持差，已基本退出历史 |
| **Presto** | 旧版 Opera | — | 速度快但兼容性差，Opera 已弃用改用 Blink |

国产双核浏览器（360、搜狗等）通常内置 Trident（兼容模式）+ Blink/WebKit（高速模式）切换。

### 对浏览器的理解

浏览器的主要功能是将用户选择的 Web 资源呈现出来，通过 URI 定位资源，从服务器请求后显示在窗口中，支持 HTML、PDF、图片等格式。

浏览器内部分为两部分：
- **shell**：外壳（菜单、工具栏等），提供 UI 操作，调用内核实现功能
- **内核**：核心，基于标记语言显示内容的程序或模块

W3C 负责制定 Web 标准，但各厂商对规范遵循程度不同，这是前端兼容性问题的根源。

### 对浏览器内核的理解

浏览器内核主要分为两部分：

- **渲染引擎**：负责在浏览器窗口中渲染内容。默认支持 HTML、XML 和图片，借助插件可显示 PDF 等格式
- **JS 引擎**：解析和执行 JavaScript，实现网页动态效果

最初两者耦合，后来 JS 引擎越来越独立，"内核"一词逐渐专指渲染引擎。

### 浏览器渲染过程

浏览器收到 HTML 文档后，经过以下步骤渲染页面：

1. **解析 HTML → 构建 DOM 树**：HTML 解析器将标签解析为 DOM 节点，形成树形结构。
2. **解析 CSS → 构建 CSSOM 树**：样式表被解析为带选择器和样式声明的 CSSOM 规则树。
3. **DOM + CSSOM → 渲染树（Render Tree）**：合并两棵树，只保留可见节点（`display:none` 的元素不在渲染树中）。
4. **布局（Layout / Reflow）**：根据渲染树计算每个节点的确切位置和大小。
5. **绘制（Paint）**：遍历渲染树，将节点的背景、文字、边框等绘制成像素。
6. **合成（Composite）**：将多个图层合成最终帧显示到屏幕。

> 渲染是渐进完成的——浏览器不会等全部 HTML 解析完才渲染，而是边解析边显示。这也是为什么将大资源放在页面底部或使用 `async`/`defer` 可以改善首屏体验。

**CSS 和 JavaScript 的阻塞影响：**
- CSS 不阻塞 DOM 解析，但阻塞渲染（CSSOM 未就绪不会合并渲染树）
- JS 既阻塞 HTML 解析也阻塞 CSS 解析；`async` 脚本下载不阻塞解析，`defer` 脚本在 DOM 就绪后顺序执行
- CSSOM 未完成时会阻塞 JS 执行（防止 JS 读到过时样式信息）

## Demo

下面的代码会改变布局属性，浏览器需要重新计算布局：

```js
box.style.width = '320px';
console.log(box.offsetWidth);
```

面试回答：

> 浏览器内核通常指渲染引擎，负责 HTML/CSS 解析、布局、绘制和合成；JS 引擎是其中独立的一部分。Chrome/Edge 主要是 Blink + V8，Safari 是 WebKit + JavaScriptCore，Firefox 是 Gecko + SpiderMonkey。回答时应把渲染引擎和 JS 引擎分开。

### 浏览器渲染优化

**① JavaScript 优化**
- 将 `<script>` 放在 `<body>` 末尾，避免阻塞 DOM 构建
- 使用 `async`（下载完立即执行，无序）或 `defer`（DOM 就绪后顺序执行）异步加载

**② CSS 优化**
- 使用 `<link>` 而非 `@import`（`@import` 会阻塞 GUI 渲染）
- CSS 写在 `<head>` 中，让浏览器尽早发起请求

**③ 减少回流（Reflow）与重绘（Repaint）**
- 操作 DOM 尽量在低层级节点，避免 `table` 布局
- 将多次 DOM 操作合并到 `documentFragment` 后一次性插入
- 读写分离：批量读取，再批量写入（利用浏览器渲染队列）
- 对不可见元素（`display:none`）操作后再显示
- 使用 `absolute`/`fixed` 使元素脱流，变化不影响其他节点

**④ 减少 DOM 和 CSS 层级深度**
- HTML 层级不宜过深，选择器从右向左匹配，层级越浅越快

### 渲染过程中遇到 JS 文件如何处理？

HTML 解析器遇到 `<script>` 标签时会**暂停文档解析**，将控制权交给 JS 引擎。JS 执行完毕后，浏览器再从中断处继续解析 HTML。

因此：
- 首屏不应加载大量 JS（会阻塞渲染）
- 可用 `defer` / `async` 让脚本异步加载，不阻塞 HTML 解析

### 什么是文档的预解析？

Webkit 和 Firefox 的优化手段：当 JS 引擎占用主线程时，另一个线程对剩余文档进行**预解析**，提前发现并请求外部资源（外部脚本、样式表、图片）。

注意：预解析不修改 DOM 树，DOM 构建依然由主解析过程完成。

### CSS 如何阻塞文档解析？

CSS 本身不改变 DOM，理论上不需要阻塞解析。但如果 CSSOM 未完成时执行 JS，JS 可能读取错误的样式信息，因此浏览器会：

1. 等待 CSSOM 构建完成
2. 再执行 JS
3. 然后继续解析文档

结论：**CSSOM 未就绪会间接阻塞 JS 执行，从而延迟文档解析**。

### 如何优化关键渲染路径？

关键渲染路径（CRP）是从 HTML 到首次显示像素的路径。优化三个指标：

1. **减少关键资源数量**：删除、延迟或标记为 `async` 非必要资源
2. **减少关键路径长度**：减少资源之间的依赖链，减少 HTTP 往返次数
3. **减少关键字节数**：压缩资源，减少传送大小

具体步骤：
- 分析当前关键资源数、字节数、路径长度
- 把非关键 CSS/JS 延迟加载
- 内联首屏关键 CSS（Critical CSS）
- 尽早下载所有关键资源

### 什么情况会阻塞渲染？

渲染的前提是生成渲染树，以下情况会阻塞：

1. **HTML 未解析完成** → DOM 树不完整，渲染树无法生成
2. **CSS 未加载/解析完成** → CSSOM 不完整，渲染树无法合并
3. **遇到 `<script>` 标签**（无 `async`/`defer`）→ 浏览器暂停 DOM 构建，等 JS 执行完毕

优化方案：
- `<script>` 放在 `<body>` 末尾，或加 `defer` / `async`
- 减少首屏 CSS 文件体积（扁平化层级）

## 参考来源

- [MDN: How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)
- [web.dev: Rendering performance](https://web.dev/articles/rendering-performance)
