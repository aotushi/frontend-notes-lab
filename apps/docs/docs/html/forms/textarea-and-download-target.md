# textarea 原格式输出与表单 target 下载

## 问题

如何让 `textarea` 中的内容按原格式输出？通过表单 `target="_blank"` 下载文件会被浏览器拦截吗？

## 结论

`textarea` 中的换行和空格如果要在页面中原样展示，应使用文本节点输出，并配合 CSS 保留空白，而不是直接拼接 HTML。

```html
<pre id="preview"></pre>
```

```css
#preview {
  white-space: pre-wrap;
}
```

```js
preview.textContent = textarea.value;
```

不要使用 `innerHTML` 输出用户输入，容易引入 XSS。

通过表单 `target="_blank"` 下载文件是否被拦截，取决于是否来自用户手势、浏览器弹窗策略和服务端响应。更可靠的做法：

- 用户点击按钮后提交表单或触发下载。
- 服务端返回 `Content-Disposition: attachment`。
- 同源静态文件可使用 `<a download>`。
- 跨源下载由服务端响应头决定，前端属性不总能强制。

## Demo

```html
<form action="/download" method="post" target="_blank">
  <button type="submit">下载文件</button>
</form>
```

面试回答：

> textarea 内容要原格式展示，可以用 `textContent` 输出到 `pre` 或设置 `white-space: pre-wrap` 的容器中，避免用 `innerHTML`。下载文件最好由用户手势触发，并由服务端返回 `Content-Disposition: attachment`；`target="_blank"` 是否拦截取决于浏览器弹窗策略。

## 参考来源

- [MDN: `<textarea>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
- [MDN: Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
