# HTML 兼容、乱码、错误页与基础结构

## 问题

404 页面、`.html` 与 `.htm`、乱码、CDATA、XHTML、XML/HTML/SGML、页面三层结构和复杂页面布局方法论怎么回答？

## 结论

这类题属于 HTML 基础和页面工程经验，不是安全题。

常见回答：

- 404 页面：告诉用户资源不存在，提供返回首页、搜索、导航和错误上报入口。
- `.html` 与 `.htm`：历史文件扩展名差异，现代服务器都可配置，语义上没有本质区别。
- 乱码：常见原因是文件编码、HTTP `Content-Type` charset、`meta charset`、数据库编码不一致。
- XHTML：以 XML 规则解析 HTML，要求更严格；`application/xhtml+xml` 下语法错误可能直接导致页面解析失败。
- CDATA：XML 中用于放置不被解析为标记的文本；现代 HTML 中很少需要。
- 页面三层：HTML 结构、CSS 表现、JavaScript 行为。
- 复杂页面布局：先划分语义结构和内容优先级，再设计布局容器、响应式断点和组件边界。

## 常见问题

### 浏览器乱码的原因是什么？如何解决？

**乱码的常见原因：**

- 网页源文件编码（如 GBK）和内容中文字的编码（如 UTF-8）不一致。
- HTML 文件编码是 GBK，但数据库中存储的数据是 UTF-8，程序直接输出未经转换。
- 服务器未通过 HTTP `Content-Type` 响应头声明字符集，浏览器自动检测编码失败。
- `<meta charset>` 声明的编码和文件实际编码不匹配。

**解决办法：**

- 统一整条链路编码为 UTF-8：文件存储、HTTP 响应头、HTML `<meta charset="utf-8">`、数据库均使用 UTF-8。
- 确保 `<meta charset="utf-8">` 写在 `<head>` 最前面（应在前 1024 字节内）。
- 如果文件编码是 GBK 而数据库是 UTF-8，程序在查询结果输出前进行编码转换。
- 乱码已出现时，可以在浏览器"查看 > 文字编码"菜单中切换编码辅助确认原因，但根本解决方案是统一编码而不是每次手动切换。

```html
<!-- 正确做法：charset 尽早声明，且文件本身也应以 UTF-8 编码保存 -->
<head>
  <meta charset="utf-8">
  <title>页面标题</title>
</head>
```

## Demo

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>页面标题</title>
  </head>
  <body>
    <main>...</main>
  </body>
</html>
```

面试回答：

> HTML 兼容基础题要回到结构、编码和 HTTP。乱码通常是文件编码、响应头、meta、数据库编码不一致。XHTML 用 XML 规则解析，更严格，错误可能导致页面不能显示。404 页面除了提示错误，还应提供恢复路径和上报能力。HTML/CSS/JS 分别负责结构、表现和行为。

## 参考来源

- [MDN: Character encoding](https://developer.mozilla.org/en-US/docs/Glossary/Character_encoding)
- [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
