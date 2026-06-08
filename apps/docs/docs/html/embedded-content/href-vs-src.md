# href、src 与 link 区别

## 问题

`href`、`src`、`link` 有什么区别？`src` 或 `href` 为空会有什么问题？

## 结论

| 名称 | 是什么 | 常见位置 | 作用 |
| --- | --- | --- | --- |
| `href` | hypertext reference，超文本引用 | `a`、`link`、`area`、`base` | 建立当前文档和目标资源的关系 |
| `src` | source，资源来源 | `img`、`script`、`iframe`、`video`、`audio` | 把外部资源加载或嵌入当前上下文 |
| `link` | HTML 元素 | `head` 中常见 | 通过 `rel` + `href` 描述资源关系 |

更准确地说：

- `href` 表示当前文档和目标资源之间的关系，例如链接跳转、样式表、canonical。
- `src` 表示把外部资源嵌入或加载进当前上下文，例如图片、脚本、iframe、视频。
- `<link>` 是 HTML 元素，常通过 `rel` + `href` 描述资源关系，例如 stylesheet、preload、icon。

空 `href` 和空 `src` 都应避免：

- `href=""` 通常指向当前页面，点击可能导致刷新或重复导航。
- `src=""` 可能让浏览器请求当前页面作为资源，造成额外请求或错误解析。
- 链接如果还没有目标，动作应使用 `button`，不要用空链接占位。

普通脚本的 `src` 还会影响解析阻塞行为；`link rel="stylesheet"` 会影响渲染；`a href` 则主要表达导航关系。

## Demo

```html
<a href="/docs">跳转到文档</a>
<link rel="stylesheet" href="/app.css">
<img src="/logo.png" alt="Logo">
<script src="/app.js" defer></script>
```

面试回答：

> `href` 是超文本引用，描述当前文档与目标资源的关系；`src` 是 source，表示把资源加载或嵌入当前文档。`link` 是元素，通常通过 `rel` 和 `href` 建立资源关系。空 `href` 会指向当前页面，空 `src` 可能触发多余请求，都不建议使用。

## 参考来源

- [MDN: `<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [MDN: `<link>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
- [MDN: `<img>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
