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

## 参考来源

- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)
- [MDN: `prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN: `color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
- [WCAG: Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
