# 前端攻击防范与跨域

## 问题

如何防范 Web 前端攻击？如何解决跨域问题？

## 结论

前端安全不是单个 API 能解决的问题，常见风险包括 XSS、CSRF、点击劫持、混合内容、开放重定向、依赖包风险、敏感信息泄漏等。

常见防护：

- XSS：默认转义输出，避免拼接 HTML，必要时使用可信 HTML 清洗；部署 CSP。
- CSRF：使用 `SameSite` Cookie、CSRF Token、校验 Origin/Referer。
- Web 注入：把 HTML、URL、CSS、JavaScript 不同上下文分开编码，不把不可信字符串拼进可执行上下文。
- 点击劫持：使用 CSP `frame-ancestors` 或 `X-Frame-Options`。
- 敏感信息：不要把 token、密钥、个人敏感信息放入可被前端脚本随意读取的位置。
- 依赖安全：锁定版本、审计依赖、避免引入无人维护脚本。

跨域是浏览器同源策略限制下，脚本访问不同源资源受到约束。同源要求协议、域名、端口都相同。

常见跨域方案：

| 方案 | 适合场景 |
| --- | --- |
| CORS | 标准跨域 API 访问 |
| 反向代理 | 开发环境或服务端统一代理 |
| JSONP | 历史方案，只支持 GET，不推荐新项目 |
| postMessage | 页面窗口、iframe 跨源通信 |
| WebSocket | 持久连接，服务端自行校验 Origin |

CORS 示例：

```http
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Credentials: true
```

携带 Cookie 时，不能使用 `Access-Control-Allow-Origin: *`，必须明确源，并在前端设置 `credentials`。

## Demo

```js
fetch('https://api.example.com/user', {
  credentials: 'include'
});
```

面试回答：

> 前端安全常见风险有 XSS、CSRF、点击劫持和敏感信息泄漏。XSS 重点是输出转义和 CSP；CSRF 重点是 SameSite、Token 和 Origin 校验；点击劫持用 `frame-ancestors`。跨域来自同源策略，标准解决方案是 CORS；iframe 或窗口通信用 `postMessage`；开发代理只能解决服务端请求路径，不改变浏览器安全模型。

Web 注入攻击面试回答：

> Web 注入本质是不可信输入进入了浏览器可解释的上下文。XSS 是最常见的前端注入问题，防护重点是模板默认转义、上下文敏感编码、避免 `innerHTML`、限制第三方脚本并配置 CSP。CSRF 不是注入脚本，而是借用户身份发起跨站请求，防护重点是 SameSite、Token 和 Origin 校验。

源码和图片保护面试回答：

> 前端源码和图片无法做到绝对防复制。源码已经发到浏览器，只能通过构建压缩、混淆、权限控制、服务端鉴权、水印、短期签名 URL、防盗链和版权追踪提高成本。图片防盗链依赖服务端校验 Referer、签名、Cookie 或鉴权，不能只靠前端代码。

CSP 面试回答：

> CSP（Content-Security-Policy）是一份由服务端通过响应头（或 `<meta>`）下发的资源白名单，告诉浏览器哪些来源的脚本、样式、图片、连接等可以加载和执行。它的核心价值是纵深防御：即使页面已经被注入 XSS，浏览器也会因为脚本来源不在白名单、或属于被禁止的内联脚本 / `eval` 而拒绝执行，从而把注入危害大幅压低。
>
> 除了限制外域脚本，CSP 还能做不少事：`frame-ancestors` 控制谁能用 iframe 嵌入本页，用于防点击劫持；`form-action` 限制表单能提交到哪些地址；`connect-src` 限制 XHR / fetch / WebSocket 的目标；`upgrade-insecure-requests` 把 HTTP 子请求自动升级为 HTTPS；`report-uri` / `report-to` 把违规行为上报到指定接口，可用于线上攻击监控。需要放行个别内联脚本时用 `nonce` 或 `hash`，而不是直接开 `unsafe-inline`。

一个典型的 CSP 响应头：

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example; frame-ancestors 'none'; report-uri /csp-report
```

### 网络劫持

网络劫持指攻击者在用户与服务器之间的网络链路上篡改或替换传输内容，分为两类：

**DNS 劫持**：攻击者篡改 DNS 解析结果，将目标域名指向错误的 IP（如钓鱼服务器），用户请求到达攻击者服务器而非真实服务器。防御：HTTPS（TLS 证书校验防止伪装）、DNSSEC（DNS 查询结果签名验证）。

**HTTP 劫持**：运营商或中间节点在 HTTP 明文传输过程中拦截并修改响应内容（如注入广告代码、弹窗等），因为 HTTP 是明文的，中间节点可以任意修改。防御：**全站 HTTPS**——TLS 加密后中间节点无法读取和修改报文内容，且证书不匹配时浏览器会直接告警。

```
DNS 劫持：用户 → DNS 查询 → [攻击者返回错误 IP] → 请求到钓鱼服务器
HTTP 劫持：用户 → 请求 → [中间节点修改响应内容] → 用户收到被篡改的页面
防御方案：全站 HTTPS，域名强制 HSTS（HTTP Strict Transport Security）
```

## 参考来源

- [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
