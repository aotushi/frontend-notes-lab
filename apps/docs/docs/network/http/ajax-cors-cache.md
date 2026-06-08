# Ajax、CORS 与浏览器缓存

## 问题

Ajax 是什么？如何创建 Ajax？Ajax 如何处理跨域和缓存？

## 结论

Ajax 指页面不刷新，通过脚本向服务器请求数据并更新局部 UI 的技术模式。传统实现使用 `XMLHttpRequest`，现代项目通常使用 `fetch`。

```js
const response = await fetch('/api/users', {
  method: 'GET',
  headers: {
    Accept: 'application/json'
  }
});

const users = await response.json();
```

Ajax 跨域受同源策略限制。标准方案是 CORS，由服务端返回允许的响应头；前端代理只是在开发或服务端层面转发请求，不能让浏览器忽略安全模型。

```http
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Credentials: true
```

携带 Cookie 时，不能使用 `Access-Control-Allow-Origin: *`，还需要前端设置：

```js
fetch('https://api.example.com/profile', {
  credentials: 'include'
});
```

Ajax 缓存问题优先由 HTTP 缓存头控制，例如 `Cache-Control`、`ETag`、`Last-Modified`。临时绕过缓存可以给 URL 添加版本号或时间戳，但长期方案应该是正确缓存策略。

```js
fetch(`/api/list?v=${buildVersion}`);
```

旧题常问 Ajax 与 Flash。现代回答可以说明 Flash 已退出主流 Web 平台，不适合作为新项目方案；Ajax/fetch 是标准 Web 能力。

## Demo

XMLHttpRequest 版本：

```js
function request(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send();
  });
}
```

面试回答：

> Ajax 是不刷新页面发起异步请求并局部更新 UI 的模式，传统用 XHR，现代多用 fetch。跨域由浏览器同源策略限制，标准方案是服务端配置 CORS；带 Cookie 时不能用通配 `*`。缓存问题应优先用 HTTP 缓存头解决，时间戳只能算临时绕过缓存。

## 参考来源

- [MDN: Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
