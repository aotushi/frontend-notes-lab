# 浏览器内核与渲染引擎

## 问题

如何理解浏览器内核？常见浏览器内核和渲染流程怎么回答？

## 结论

“浏览器内核”在面试中通常指浏览器渲染引擎及其周边能力，不只是 JavaScript 引擎。渲染引擎负责解析 HTML/CSS、构建 DOM/CSSOM、布局、绘制和合成；JavaScript 引擎负责执行 JS。

常见对应关系：

| 浏览器 | 渲染引擎 | JS 引擎 |
| --- | --- | --- |
| Chrome / Edge | Blink | V8 |
| Safari | WebKit | JavaScriptCore |
| Firefox | Gecko | SpiderMonkey |

渲染流程可以概括为：

1. 解析 HTML 生成 DOM。
2. 解析 CSS 生成 CSSOM。
3. DOM 和 CSSOM 形成渲染树或布局树。
4. 计算布局。
5. 绘制并合成图层。
6. JS、样式变化、布局变化会触发后续更新。

## Demo

下面的代码会改变布局属性，浏览器需要重新计算布局：

```js
box.style.width = '320px';
console.log(box.offsetWidth);
```

面试回答：

> 浏览器内核通常指渲染引擎，负责 HTML/CSS 解析、布局、绘制和合成；JS 引擎是其中独立的一部分。Chrome/Edge 主要是 Blink + V8，Safari 是 WebKit + JavaScriptCore，Firefox 是 Gecko + SpiderMonkey。回答时应把渲染引擎和 JS 引擎分开。

## 参考来源

- [MDN: How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)
- [web.dev: Rendering performance](https://web.dev/articles/rendering-performance)
