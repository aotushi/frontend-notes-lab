# 浏览器本地存储

## 问题

Cookie、LocalStorage、SessionStorage 有什么区别？前端存储方式有哪些？IndexedDB 有哪些特点？Cookie 有哪些字段？

## 结论

### 浏览器本地存储方式及使用场景

#### Cookie

最早的本地存储方案，4KB 大小限制，每次 HTTP 请求自动携带。

**特性：**
- 名称一旦创建不可修改
- 不可跨域共享（受同源策略约束）
- 每个域名限制 20 个 Cookie
- 存在安全问题：被截获后可利用 Session 信息

**使用场景：**
- 与 Session 结合，存储 `sessionId` 进行身份认证
- 统计页面点击次数等轻量会话数据

#### LocalStorage

HTML5 引入，大小约 5MB，**持久存储**（不主动清除永不过期）。

**优点：** 容量大、持久、不随 HTTP 请求发送  
**缺点：** 受同源策略限制，IE8 以下不支持，隐私模式无法访问

**常用 API：**
```javascript
localStorage.setItem('key', 'value');       // 存储
localStorage.getItem('key');                // 读取
localStorage.removeItem('key');             // 删除单项
localStorage.clear();                       // 清空
localStorage.key(index);                    // 按索引获取 key
```

**使用场景：** 换肤配置、不常变动的用户偏好信息

#### SessionStorage

与 LocalStorage 类似，但**窗口/标签页关闭后即失效**，且只在同一窗口内共享（不跨标签页）。

**常用 API：**
```javascript
sessionStorage.setItem('key', 'value');
sessionStorage.getItem('key');
sessionStorage.removeItem('key');
sessionStorage.clear();
sessionStorage.key(index);
```

**使用场景：** 临时会话数据（游客登录信息、临时浏览记录）

### Cookie 有哪些字段，作用分别是什么

| 字段 | 作用 |
| --- | --- |
| **Name** | Cookie 名称 |
| **Value** | Cookie 值（如认证 Token） |
| **Size** | Cookie 大小 |
| **Path** | 可访问此 Cookie 的页面路径（如 `/test`） |
| **Domain** | 可访问此 Cookie 的域名，子域可读取父域 Cookie |
| **Expires/Max-Age** | 过期时间；未设置则为 Session（浏览器关闭即失效） |
| **Secure** | 仅在 HTTPS 下发送 |
| **HttpOnly** | 禁止 JS 通过 `document.cookie` 访问，防止 XSS 窃取 |
| **SameSite** | 控制跨站请求是否携带（Strict/Lax/None），防 CSRF |

**总结：** 服务器通过 `Set-Cookie` 响应头配置 Cookie。`expires` 控制失效时间，`domain`+`path` 限制 URL 范围，`secure` 要求 HTTPS，`HttpOnly` 仅服务器可读，`SameSite` 防跨站攻击。

### Cookie、LocalStorage、SessionStorage 区别

| 维度 | Cookie | LocalStorage | SessionStorage |
| --- | --- | --- | --- |
| **大小** | 4KB | ~5MB | ~5MB |
| **生命周期** | 可设置过期时间 | 永久（手动清除才失效） | 窗口关闭即失效 |
| **HTTP 请求** | 自动携带 | 不携带 | 不携带 |
| **跨窗口共享** | 同源可共享 | 同源可共享 | 仅同窗口 |
| **服务器交互** | 与服务器交互 | 纯本地存储 | 纯本地存储 |

需要存储大量数据时，应使用 **IndexedDB**（浏览器内置 NoSQL 数据库）。

### 前端存储的方式有哪些？

| 方式 | 特点 |
| --- | --- |
| **Cookie** | 4KB，请求自动携带，每域限 20 个，兼容性好 |
| **LocalStorage** | 5MB，持久，键值对，IE8+ |
| **SessionStorage** | 5MB，会话级，仅同窗口，IE8+ |
| **Web SQL** | 2010 年被 W3C 废弃，类 SQLite 关系型 DB，Firefox 未实现 |
| **IndexedDB** | HTML5 标准，NoSQL，键值对，异步，支持大量数据 |

### IndexedDB 有哪些特点？

- **键值对存储**：对象仓库（Object Store）形式，支持所有 JS 类型（含对象）
- **异步操作**：不锁死浏览器，防止大量数据读写阻塞页面
- **支持事务**：一系列操作要么全部成功，要么全部回滚
- **同源限制**：每个数据库对应创建它的域名，不可跨域访问
- **储存空间大**：一般不少于 250MB，甚至无上限
- **支持二进制**：可存储 `ArrayBuffer`、`Blob` 等二进制数据

## 参考来源

- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN: Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
