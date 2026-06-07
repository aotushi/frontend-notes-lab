# Cookie、Session 与 Web Storage 区别

## 问题

Cookie、Session、`localStorage`、`sessionStorage` 有什么区别？Cookie 有哪些使用场景、缺点，为什么不能滥用？如何删除 Cookie，如何防止 Cookie 被盗用？

## 结论

Cookie 是浏览器随请求自动携带的小型键值数据，主要用于会话标识、登录态、灰度标记、偏好设置等。Session 通常指服务端会话数据，浏览器端只保存一个 Session ID 或登录凭证。

Web Storage 是浏览器端脚本可读写的本地存储，包括 `localStorage` 和 `sessionStorage`。它们不会随每次 HTTP 请求自动发送，适合保存非敏感的前端状态。

| 对比项 | Cookie | sessionStorage | localStorage |
| --- | --- | --- | --- |
| 容量 | 通常约 4KB 级别 | 通常更大，按浏览器实现 | 通常更大，按浏览器实现 |
| 生命周期 | 可设置 `Expires` / `Max-Age` | 当前页面会话，标签页关闭后清理 | 持久保存，除非主动清理 |
| 是否随请求发送 | 是，匹配域名和路径时自动发送 | 否 | 否 |
| JS 是否可读写 | 默认可，`HttpOnly` 后不可读 | 可 | 可 |
| 适合场景 | 会话 ID、服务端需要读取的少量状态 | 单标签页临时状态 | 非敏感长期偏好、草稿、缓存少量数据 |

Cookie 不能滥用：

- 每次请求都会携带，会增加请求体积。
- 容量小，不适合保存大数据。
- 如果未设置安全属性，容易被 XSS、CSRF、明文传输等风险影响。
- 前端可读的 Cookie 不应存放敏感信息。

更安全的 Cookie 配置：

```http
Set-Cookie: sid=...; Path=/; HttpOnly; Secure; SameSite=Lax
```

关键属性：

- `HttpOnly`：阻止 JavaScript 读取，降低 XSS 直接盗取风险。
- `Secure`：只在 HTTPS 下发送。
- `SameSite`：限制跨站请求携带 Cookie，降低 CSRF 风险。
- `Path` / `Domain`：控制作用范围，越小越好。
- `Max-Age` / `Expires`：控制过期时间。

删除 Cookie 的本质是用相同 `name`、`path`、`domain` 覆盖一个已经过期的值：

```js
document.cookie = 'token=; Max-Age=0; Path=/';
```

不同端口共享 Cookie：Cookie 不按端口隔离，只按 domain/path/secure/samesite 等规则匹配。`http://example.com:3000` 和 `http://example.com:8080` 在同一域名下可能共享 Cookie；但不同子域名是否共享取决于 `Domain` 设置。

## Demo

```js
localStorage.setItem('theme', 'dark');
sessionStorage.setItem('wizardStep', '2');
document.cookie = 'locale=zh-CN; Path=/; Max-Age=31536000; SameSite=Lax';

console.log(localStorage.getItem('theme'));
console.log(sessionStorage.getItem('wizardStep'));
console.log(document.cookie);
```

面试回答：

> Cookie 适合保存服务端需要随请求读取的少量状态，例如会话 ID；Session 通常是服务端保存的会话数据；`localStorage` 和 `sessionStorage` 是前端本地存储，不会随请求自动发送。Cookie 容量小且会增加每次请求体积，敏感登录态应设置 `HttpOnly`、`Secure`、`SameSite`，不要把敏感信息直接暴露给前端脚本。

## 参考来源

- [MDN: HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: Document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
