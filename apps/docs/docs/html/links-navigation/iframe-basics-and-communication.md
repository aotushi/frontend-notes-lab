# iframe 使用场景、sandbox 与通信

## 问题

`iframe` 有哪些使用场景、优缺点？`sandbox` 有什么作用？父子页面如何通信？跨域 iframe 有哪些限制？如何防止页面被 iframe 嵌入？

## 结论

`iframe` 会在当前页面中嵌入另一个独立浏览上下文。它适合隔离第三方内容、嵌入地图/支付/广告/文档预览、微前端隔离、在线编辑器预览等场景。

优点是隔离上下文、可嵌入第三方页面、可配合 `sandbox` 限制能力。缺点是性能成本高、SEO 和可访问性复杂、父子通信需要显式设计，并且高度自适应、历史记录、焦点管理、跨域访问都容易踩坑。

`frame` 是历史框架集元素，现代页面不应使用；`iframe` 仍然可用，但应谨慎。

`sandbox` 默认会施加一组强限制，可以按需放开：

```html
<iframe
  src="/preview"
  sandbox="allow-scripts allow-forms"
  title="代码预览"
></iframe>
```

常见 token：

| token | 作用 |
| --- | --- |
| `allow-scripts` | 允许执行脚本 |
| `allow-forms` | 允许提交表单 |
| `allow-popups` | 允许弹窗 |
| `allow-same-origin` | 允许保持原源身份 |
| `allow-top-navigation-by-user-activation` | 允许用户触发的顶层导航 |

父子页面同源时，可以直接访问 DOM：

```js
const iframe = document.querySelector('iframe');
const childDoc = iframe.contentDocument;
```

跨域时不能直接读写 DOM，应使用 `postMessage`：

```js
iframe.contentWindow.postMessage({ type: 'ping' }, 'https://child.example');

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://child.example') return;
  console.log(event.data);
});
```

防止被其它站点 iframe 嵌入，应优先使用 HTTP 响应头：

```http
Content-Security-Policy: frame-ancestors 'self'
X-Frame-Options: SAMEORIGIN
```

`frame-ancestors` 是现代 CSP 指令，表达能力比 `X-Frame-Options` 更强。

iframe 高度自适应常见方案：

- 同源：父页面读取子页面 `scrollHeight`。
- 跨域：子页面通过 `postMessage` 把高度发给父页面。
- 简单场景：用固定高度、响应式容器或 CSS 约束。

`iframe` 更改 `src` 可能产生历史记录。需要避免影响后退/前进时，可考虑用 `location.replace()`、动态重建 iframe，或把状态管理交给父页面。

## Demo

```html
<iframe
  id="preview"
  src="https://child.example/preview"
  title="内容预览"
  sandbox="allow-scripts"
></iframe>
```

面试回答：

> `iframe` 是独立浏览上下文，适合隔离第三方内容、支付、地图、预览等，但性能、SEO、焦点、历史记录和通信成本都更高。同源 iframe 可以直接访问 DOM，跨域必须用 `postMessage`，并校验 `origin`。`sandbox` 用来限制 iframe 能力；防止被嵌入应使用 CSP `frame-ancestors` 或 `X-Frame-Options`。

## 参考来源

- [MDN: `<iframe>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- [MDN: Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [MDN: CSP frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
