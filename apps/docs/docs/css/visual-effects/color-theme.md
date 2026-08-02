# 颜色主题与深色模式

## 问题

如何实现黑白主题或深色模式切换？只用 CSS 能做到什么，什么时候需要 JavaScript 参与？

## 结论

主题切换本质上是把一组语义化颜色 token 切换到另一组值。不要在组件里散落 `#fff`、`#000` 这类硬编码颜色，而是先定义背景、文字、边框、强调色、危险色等语义变量，再让组件消费这些变量。

### 基础方案：CSS 自定义属性

```css
:root {
  color-scheme: light;
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-border: #d1d5db;
  --color-accent: #0f766e;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --color-bg: #111827;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-accent: #5eead4;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}

.card {
  border: 1px solid var(--color-border);
}
```

组件只引用 `var(--color-*)`，主题切换时不用逐个改组件规则。

### 跟随系统主题

如果只需要跟随系统深浅色，可以用 `prefers-color-scheme`：

```css
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --color-bg: #111827;
    --color-text: #f9fafb;
    --color-border: #374151;
    --color-accent: #5eead4;
  }
}
```

`color-scheme` 会让浏览器内置控件、滚动条、表单控件等按对应主题绘制。它不能替代自定义颜色变量，只是告诉浏览器当前页面支持哪些配色方案。

### 用户手动切换

用户手动切换需要 JavaScript 保存偏好，并把状态写到根节点：

```js
const root = document.documentElement
const savedTheme = localStorage.getItem('theme')

if (savedTheme) {
  root.dataset.theme = savedTheme
}

function setTheme(theme) {
  root.dataset.theme = theme
  localStorage.setItem('theme', theme)
}
```

实际项目里通常需要三种状态：

| 状态 | 含义 |
| --- | --- |
| `light` | 用户强制浅色 |
| `dark` | 用户强制深色 |
| `system` | 跟随系统 `prefers-color-scheme` |

不要只切 `body` 背景色。深色模式还要检查文字、边框、阴影、占位符、焦点环、代码块、图表、图片、表单控件和禁用态。颜色还要满足对比度要求，不能为了“黑白主题”让正文变成低对比灰色。

## Demo

```html
<button type="button" onclick="setTheme('light')">浅色</button>
<button type="button" onclick="setTheme('dark')">深色</button>
<article class="card">主题色来自 CSS 变量。</article>
```

```css
.card {
  padding: 16px;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
}
```

### 常见的图片格式及使用场景

先分清矢量图和位图：SVG 用几何描述图形，适合需要任意缩放的图标与图表；JPEG、PNG、WebP、AVIF 等位图由像素组成，更适合照片、截图和复杂纹理。

| 格式 | 压缩与能力 | 适用场景 | 主要边界 |
| --- | --- | --- | --- |
| **JPEG** | 有损压缩，不支持透明和动画 | 照片、兼容性回退 | 文字边缘和透明图不适合反复有损压缩 |
| **PNG** | 无损压缩，支持 Alpha 透明 | UI 截图、需要精确像素或透明背景的图片 | 照片通常比现代有损格式大 |
| **WebP** | 支持有损、无损、透明和动画 | 照片、缩略图、透明位图、动图 | 具体体积取决于编码参数，不能用固定百分比概括 |
| **AVIF** | 支持有损、无损、透明、动画、高位深和 HDR | 对体积与画质要求较高的现代图片 | 编码成本可能较高；面向旧环境时需要回退 |
| **SVG** | 矢量，可缩放，可由 CSS 控制部分样式 | Logo、图标、图表、简单插图 | 不适合像素复杂的照片；外部来源需考虑脚本与链接安全 |
| **GIF** | 无损压缩但每帧最多 256 色，支持动画和简单透明 | 兼容历史内容或非常简单的动画 | 照片和高质量动画体积、画质都不理想 |
| **APNG** | 无损全彩动画，支持 Alpha 透明 | 需要清晰透明边缘的短 UI 动画 | 通常比有损动画格式大 |
| **BMP / ICO** | BMP 通常体积大；ICO 可封装多尺寸图标 | BMP 基本不用于页面内容；ICO 主要用于站点图标兼容 | 不属于常规内容图片首选 |

选择时按下面的顺序判断：

1. Logo、图标和图表优先考虑 SVG；照片通常从 AVIF、WebP 或 JPEG 中选择；需要无损细节和透明像素时考虑 PNG。
2. 不根据格式名称假设体积，使用真实素材和目标质量参数比较编码结果。
3. 同一张图片需要多种格式回退时使用 `<picture>`，把现代格式放在前面，最后保留普通 `<img>`：

```html
<picture>
  <source srcset="cover.avif" type="image/avif">
  <source srcset="cover.webp" type="image/webp">
  <img
    src="cover.jpg"
    alt="文章封面"
    width="1200"
    height="675"
  >
</picture>
```

不同显示尺寸和像素密度下如何选择图片资源，继续阅读 [`srcset` 与 `sizes`](/html/embedded-content/responsive-images-srcset)。

### 对 CSS Sprites 的理解

CSS Sprites（精灵图）：将多张小图合并到一张大图，利用 `background-image`、`background-position`、`background-repeat` 组合定位来显示指定图片区域。

**优点：**
- 减少 HTTP 请求数，提升页面加载性能（HTTP/1.1 下效果明显）；
- 合并后总体积通常小于各图之和（元数据共享）。

**缺点：**
- 制作和维护成本高，需要精确测量每个图标的坐标；
- 高分辨率（Retina）屏适配麻烦；
- 改动一个图标需要重新生成整张精灵图。

**现代替代方案：** SVG Sprite（`<symbol>` + `<use>`）、图标字体（Icon Font）、内联 SVG。HTTP/2 多路复用使得多图请求开销大幅降低，CSS Sprites 不再是首选优化手段。

## 参考来源

- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)
- [MDN: `prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN: `color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- [MDN: Image file type and format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types)
- [MDN: `<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture)
- [WCAG: Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
