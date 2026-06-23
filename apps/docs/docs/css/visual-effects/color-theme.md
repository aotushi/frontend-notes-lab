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

| 格式 | 类型 | 特点 | 适用场景 |
| --- | --- | --- | --- |
| **BMP** | 无损点阵 | 几乎无压缩，文件体积大 | 基本不用于 Web |
| **GIF** | 无损索引色 | 支持动画、透明，仅支持 8bit 索引色 | 简单动画、图标 |
| **JPEG** | 有损直接色 | 颜色丰富，压缩比高，不支持透明 | 照片、色彩丰富的图片 |
| **PNG-8** | 无损索引色 | 比 GIF 体积更小，支持透明度调节 | 小图标、Logo（无动画需求） |
| **PNG-24** | 无损直接色 | 高质量，体积比 JPEG/GIF 大 | 需要透明背景的高质量图片 |
| **SVG** | 无损矢量 | 任意缩放不失真，文件小，可 CSS 控制 | Logo、图标、插图 |
| **WebP** | 有损/无损 | 同质量下比 JPEG 小 25%~34%，比 PNG 小 26%，支持透明和动画 | 现代项目中替代 JPEG/PNG 的通用格式 |

选择原则：照片优先 WebP/JPEG；图标/Logo 优先 SVG；需要透明背景用 PNG 或 WebP；动画用 GIF 或 WebP（动图）；追求最广兼容性时 JPEG/PNG 仍是保底方案。

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
- [WCAG: Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
