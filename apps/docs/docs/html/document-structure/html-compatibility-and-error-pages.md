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
