# 浏览器安全：XSS、CSRF 及其他

## 问题

什么是 XSS？如何防御？什么是 CSRF？如何防御？中间人攻击？网络劫持？前端安全有哪些？

## 结论

### 什么是 XSS 攻击？

XSS（Cross-Site Scripting，跨站脚本攻击）是一种代码注入攻击。攻击者向网站注入恶意脚本，使之在用户浏览器上运行，从而盗取 Cookie、localStorage、DOM 数据，发起 DoS 攻击，或破坏页面结构。

**三种类型：**

| 类型 | 恶意代码存放位置 | 典型场景 |
| --- | --- | --- |
| **存储型** | 数据库 | 论坛发帖、商品评论 |
| **反射型** | URL 参数 | 网站搜索、跳转链接 |
| **DOM 型** | 前端 JS 读取并执行 URL 参数 | 纯前端渲染，取 hash/参数拼 DOM |

DOM 型与前两种的关键区别：取出和执行恶意代码由**浏览器端 JS** 完成，属于前端自身漏洞；存储型和反射型属于服务端安全漏洞。

### 如何防御 XSS 攻击？

- **输入/输出转义**：对插入到 HTML 的内容做充分转义（`<`、`>`、`"`、`'`、`&`）
- **使用 CSP（Content Security Policy）**：通过 HTTP 响应头 `Content-Security-Policy` 或 `<meta>` 标签建立白名单，告诉浏览器哪些外部资源可加载和执行
- **Cookie 设置 `HttpOnly`**：防止 JS 通过 `document.cookie` 读取敏感 Cookie
- **避免服务端渲染时直接拼接用户输入**

### 什么是 CSRF 攻击？

CSRF（Cross-Site Request Forgery，跨站请求伪造）：攻击者诱导已登录用户访问第三方网站，由该网站向目标网站发起跨站请求，利用浏览器自动携带 Cookie 的特性冒充用户操作。

**三种攻击类型：**
- **GET 型**：在 `<img src="攻击URL">` 中构造请求，页面加载即触发
- **POST 型**：隐藏表单 + 自动提交
- **链接型**：`<a href="攻击URL">` 诱导点击

### 如何防御 CSRF 攻击？

- **同源检测**：服务器验证请求头中的 `Origin` 或 `Referer`，不在许可范围内则拒绝
- **CSRF Token**：服务器下发随机 Token，每次请求携带，服务器验证一致性
- **Double Cookie 验证**：在 URL 参数中也传入 Cookie 中的某个值，服务器对比
- **SameSite Cookie**：设置 `SameSite=Strict` 或 `SameSite=Lax`，限制第三方请求不携带 Cookie

### 什么是中间人攻击？如何防范？

中间人攻击（MITM）：攻击者在通信双方之间独立建立联系，转发（并可能篡改）双方数据，使双方误以为在直接通信。

攻击流程（以 HTTP 为例）：
1. 客户端请求被中间人截获
2. 中间人将自己生成的伪造公钥发给客户端
3. 客户端用伪公钥加密数据，中间人解密后再用真实公钥加密转发

**防范方式**：全站使用 **HTTPS**（TLS）+ 证书固定（Certificate Pinning），通过 CA 机构签发的证书验证服务器真实身份。

### 有哪些可能引起前端安全的问题？

- **XSS**：代码注入，脚本在用户浏览器执行
- **CSRF**：利用 Cookie 冒充用户发起请求
- **iframe 滥用**：第三方 iframe 可执行 JS、弹对话框，破坏用户体验
- **恶意第三方库**：npm 依赖被植入恶意代码

### 网络劫持有哪几种？如何防范？

**两种类型：**

**① DNS 劫持**（已被监管，较少见）
- DNS 强制解析：修改运营商本地 DNS 记录，引导流量到缓存服务器
- 302 跳转方式：监控出口流量，对可劫持内容发起 302 跳转

**② HTTP 劫持**（依然常见）
- HTTP 明文传输，运营商可修改响应内容（例如插入广告）
- **防范方式：全站 HTTPS**，加密后运营商无法获取明文，无法注入内容

## 参考来源

- [MDN: XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)
- [MDN: CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)
- [OWASP: Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
