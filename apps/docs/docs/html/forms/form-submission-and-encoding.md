# form 提交、编码与跨域

## 问题

`form` 如何提交数据？`method`、`action`、`enctype`、`target` 分别控制什么？表单可以跨域提交吗？

## 结论

`form` 是浏览器原生提交机制。`action` 决定提交地址，`method` 决定请求方法，`enctype` 决定请求体编码，`target` 决定响应在哪个浏览上下文中打开。

```html
<form action="/profile" method="post" enctype="multipart/form-data">
  <input name="avatar" type="file" />
  <button type="submit">提交</button>
</form>
```

表单可以向跨源地址提交，这是普通导航或子浏览上下文导航，不等同于脚本跨域读取响应。提交后浏览器能否把响应内容交给当前页面脚本读取，仍受同源策略限制。现代前端如果要用 `fetch`/XHR 跨域提交并读取结果，需要服务端配置 CORS。

`enctype` 常见取值：

| 值 | 适合场景 |
| --- | --- |
| `application/x-www-form-urlencoded` | 默认值，普通键值对 |
| `multipart/form-data` | 文件上传，或需要保留二进制数据边界 |
| `text/plain` | 调试用途，不适合正式接口 |

接口工具里的 `raw`、`binary` 不是 HTML 表单的 `enctype` 标准值。它们描述的是请求体发送方式：`raw` 通常发送 JSON、文本等原始请求体；`binary` 发送单段二进制内容；`form-data` 对应多段表单；`x-www-form-urlencoded` 对应 URL 编码键值对。

## Demo

下面的例子展示了原生提交与脚本拦截提交的差异：

```html
<form id="profileForm" action="/api/profile" method="post">
  <input name="name" autocomplete="name" required />
  <button>默认提交</button>
</form>

<script>
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(profileForm);

    fetch(profileForm.action, {
      method: profileForm.method,
      body: data
    });
  });
</script>
```

自动提交可以调用 `form.requestSubmit()`，它会触发表单校验和 `submit` 事件；`form.submit()` 会绕过 `submit` 事件和交互式校验，面试回答时要区分。

```js
form.requestSubmit();
```

面试回答：

> `form` 的 `action` 是提交地址，`method` 是 HTTP 方法，`enctype` 是请求体编码。文件上传必须用 `multipart/form-data`。表单本身可以提交到跨源地址，但脚本读取跨源响应仍受同源策略限制。阻止提交刷新页面通常在 `submit` 事件里调用 `preventDefault()`，然后用 `fetch` 或 XHR 发送数据。

## 参考来源

- [MDN: `<form>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [MDN: FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [WHATWG HTML: Form submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#form-submission)
