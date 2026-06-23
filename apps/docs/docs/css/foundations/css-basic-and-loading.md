# CSS 引入方式与 @import

## 问题

页面中引入 CSS 有哪些方式？`<link rel="stylesheet">` 和 `@import` 有什么区别？

## 结论

CSS 可以通过行内样式、`<style>`、`<link rel="stylesheet">` 和 `@import` 引入。真实项目里，页面级样式优先使用 `<link rel="stylesheet">`；`@import` 更适合在 CSS 文件内部组织依赖，但不适合作为关键 CSS 的主要加载方式。

`<link>` 是 HTML 的外部资源链接机制，浏览器解析 HTML 时就能发现并下载样式表，预加载扫描器也更容易提前发现它。`@import` 是 CSS 语法，必须等包含它的 CSS 被下载并解析后，浏览器才会继续发现被导入的样式表，关键路径通常更长。

层叠结果仍然遵循来源、层、优先级和顺序规则：当来源、层和优先级相同，后声明的样式覆盖先声明的样式。不要把“后加载”简单等同于“优先级更高”，真正决定覆盖关系的是 CSS cascade。

## Demo

```html
<!-- 推荐：页面关键样式用 link，让浏览器尽早发现资源 -->
<link rel="stylesheet" href="/assets/base.css">
<link rel="stylesheet" href="/assets/page.css">

<!-- 可用但不推荐承载关键样式：需要先解析当前 CSS，才发现被 import 的 CSS -->
<style>
  @import url("/assets/theme.css");
</style>

<!-- 最高耦合，通常只用于动态样式或极少量一次性样式 -->
<button style="color: green">保存</button>
```

`@import` 还要注意语法位置：它通常必须写在样式表顶部，在普通样式规则之前，否则后面的 `@import` 可能无效或行为不符合预期。

```css
@import url("./tokens.css");
@import url("./layout.css");

.card {
  padding: 16px;
}
```

## 面试回答

页面引入 CSS 主要有行内样式、内部样式表、`link` 外链样式和 CSS 里的 `@import`。项目里优先用 `link`，因为浏览器解析 HTML 时就能发现资源并并行下载；`@import` 要等 CSS 下载并解析后才发现后续样式，容易拉长关键渲染路径。覆盖关系不要只看加载方式，还要按 cascade 判断：来源、层、优先级相同的时候，后声明的规则胜出。

### CSS 中可继承与不可继承属性有哪些

**不可继承属性（部分常见）：**

- `display`
- 盒模型属性：`width`、`height`、`margin`、`border`、`padding`
- 背景属性：`background`、`background-color`、`background-image` 等
- 定位属性：`float`、`clear`、`position`、`top`、`right`、`bottom`、`left`、`z-index`、`overflow`
- 文本装饰：`vertical-align`、`text-decoration`、`text-shadow`
- 轮廓：`outline-style`、`outline-width`、`outline-color`

**可继承属性（部分常见）：**

- 字体系列：`font-family`、`font-weight`、`font-size`、`font-style`
- 文本系列：`text-indent`、`text-align`、`line-height`、`word-spacing`、`letter-spacing`、`text-transform`、`color`
- 元素可见性：`visibility`
- 列表属性：`list-style`
- 光标：`cursor`

记忆思路：**视觉呈现类**（尺寸、边框、背景、定位）不继承；**文字排版类**（字体、颜色、行高、对齐）可继承。

### CSS3 中有哪些新特性

CSS3 新增主要特性：

- **新增选择器**：`:not()`、`:nth-child()`、`[attr^=val]` 等属性选择器
- **圆角**：`border-radius`
- **阴影**：`box-shadow`、`text-shadow`
- **渐变**：`linear-gradient()`、`radial-gradient()`
- **变换**：`transform`（平移、旋转、缩放、倾斜）
- **过渡**：`transition`
- **动画**：`animation` + `@keyframes`
- **弹性布局**：`display: flex`
- **网格布局**：`display: grid`
- **媒体查询**：`@media`
- **自定义属性（CSS 变量）**：`--color: red; color: var(--color)`
- **多列布局**：`column-count`、`column-width`
- **滤镜**：`filter`
- **混合模式**：`mix-blend-mode`

## 参考来源

- [MDN: `<link>`: The External Resource Link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link)
- [MDN: `@import`](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)
- [MDN: Cascade and inheritance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts)
