# a 标签、href、target 与 download

## 问题

`a` 标签有哪些用途？`href`、`target`、`download`、`rel` 分别有什么作用？空 `href`、`javascript:void(0)`、`onclick` 和嵌套 `a` 有哪些问题？

## 结论

`a` 标签的核心语义是超链接。

<ConceptNote label="只要存在有效 href，它就是一个可导航、可聚焦、可被浏览器和辅助技术识别的链接。" title="为什么 a 必须有有效 href 才是可靠链接？">

MDN 对 `<a>` 的定义重点有两层：第一，`<a>` 配合 `href` 才创建超链接；第二，有 `href` 时，元素获得焦点后按 Enter 可以激活链接。

所以 `a` 不是“看起来像链接的文字”，而是浏览器平台能识别的导航入口。它可以被复制链接地址、收藏、拖拽、右键新标签打开，也能被辅助技术列入“页面链接列表”。

如果只是打开弹窗、提交筛选、切换状态，不应该用 `href="#"` 或 `javascript:void(0)` 伪装链接；这些写法会让浏览器和辅助技术以为它是导航。动作触发应使用 `<button>`。

校准来源：

- [MDN: `<a>` with `href` creates a hyperlink](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#:~:text=with%20its%20href%20attribute%2C%20creates%20a%20hyperlink)
- [MDN: Enter activates focused links with `href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#:~:text=If%20the%20href%20attribute%20is%20present%2C%20pressing%20the%20enter%20key%20while%20focused%20on%20the%20%3Ca%3E%20element%20will%20activate%20it)
- [MDN: fake button links cause incorrect semantics](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#:~:text=Anchor%20elements%20are%20often%20abused%20as%20fake%20buttons)

</ConceptNote>

常见用途：

- 页面跳转：`<a href="/products">商品列表</a>`
- 锚点定位：`<a href="#section-api">API</a>`
- 下载文件：`<a href="/report.pdf" download>下载报告</a>`
- 邮件/电话协议：`mailto:`、`tel:`
- 新窗口打开：`target="_blank"`

`target` 常见值：

| 值 | 作用 |
| --- | --- |
| `_self` | 当前浏览上下文打开，默认值 |
| `_blank` | 新窗口或新标签页打开 |
| `_parent` | 父级浏览上下文打开 |
| `_top` | 顶层浏览上下文打开 |
| 自定义名称 | 在指定命名窗口或 iframe 中打开 |

<ConceptNote label="target=&quot;_blank&quot; 需要关注安全和性能。" title="为什么 target=_blank 要配 rel？">

`target="_blank"` 会在新的浏览上下文中打开页面。历史上，如果不加 `noopener`，新页面可能通过 `window.opener` 拿到来源页面引用，进而控制或跳转来源页面。

现代浏览器对 `<a target="_blank">` 通常已经隐式应用 `noopener`，但工程里仍建议显式写 `rel="noopener noreferrer"`：一是让意图更清楚，二是覆盖旧浏览器和非标准场景，三是让代码审查更容易判断外链安全策略。

需要区分的是：`noopener` 主要切断 `window.opener`；`noreferrer` 还会阻止发送 Referer，并且包含 `noopener` 的效果。如果业务依赖来源统计，不要不加判断地使用 `noreferrer`。

校准来源：

- [MDN: `target="_blank"` implicitly provides `noopener`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#:~:text=Setting%20target%3D%22_blank%22%20on%20%3Ca%3E%20elements%20implicitly%20provides%20the%20same%20rel%20behavior%20as%20setting%20rel%3D%22noopener%22)
- [MDN: `noopener` link type](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener)
- [MDN: `noreferrer` link type](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noreferrer)

</ConceptNote>
现代浏览器通常会隐式应用 <code>noopener</code>，但面试和代码审查中仍建议显式写：

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  新窗口打开
</a>
```

`download` 表示把链接作为下载处理，而不是导航打开。跨源下载受浏览器和响应头限制，实际项目中最好让服务端返回合适的 `Content-Disposition: attachment`。

不要使用 `href=""` 或 `href="javascript:void(0)"` 伪装按钮：

- `href=""` 通常会指向当前页面，点击可能刷新或重新导航。
- `javascript:void(0)` 会污染链接语义，不利于复制、打开新标签、可访问性和安全审查。
- 不需要导航的动作应该用 `<button>`。

`href` 和 `onclick` 同时存在时，点击会先触发点击事件；如果事件没有 `preventDefault()`，浏览器随后执行默认导航。更推荐把导航交给 `href`，把动作用 `button` 表达。

`a` 标签不能嵌套 `a`。如果想实现“整块卡片可点，内部还有其它操作”，常见做法是让卡片主链接覆盖非交互区域，内部按钮独立放置，避免交互元素嵌套。

`rel` 常见值：

| 值 | 作用 |
| --- | --- |
| `noopener` | 新页面不能通过 `window.opener` 控制来源页面 |
| `noreferrer` | 不发送 Referer，同时也包含 noopener 效果 |
| `nofollow` | 告诉搜索引擎不要跟踪该链接 |
| `ugc` | 用户生成内容链接 |
| `sponsored` | 广告或赞助链接 |

## Demo

```html
<a href="/docs">查看文档</a>
<a href="#faq">跳到 FAQ</a>
<a href="/report.pdf" download>下载报告</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  外部链接
</a>

<button type="button" onclick="openDialog()">打开弹窗</button>
```

面试回答：

> `a` 的核心是超链接，必须有有效 `href` 才是可靠链接。跳转用 `a[href]`，动作触发用 `button`。`target="_blank"` 要配 `rel="noopener noreferrer"` 防止 opener 风险；`download` 用于提示下载，但跨源下载最好由服务端响应头配合。不要用空 `href` 或 `javascript:void(0)` 伪装按钮，也不要嵌套 `a`。

## 参考来源

- [MDN: `<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)
- [MDN: Link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel)
