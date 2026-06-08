# 移动端适配、viewport 与安全区域

## 问题

移动端如何适配？`viewport` 是什么？为什么设计稿常见 750px/640px？1px、刘海屏、横竖屏和最小点击区域怎么处理？

## 结论

移动端适配先从 viewport 开始。没有 viewport 时，移动浏览器可能用较宽的布局视口渲染页面，再缩小到屏幕宽度，导致文字很小。

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

常见适配策略：

| 问题 | 方案 |
| --- | --- |
| 页面自适应屏幕 | 响应式布局，优先 flex/grid、百分比、`vw`、媒体查询 |
| 设计稿 750/640 | 通常对应 2x 设备 DPR 的视觉稿，开发时换算到 CSS px |
| 1px 边框变粗 | 用 `devicePixelRatio` 思维处理，可用 transform、渐变、伪元素或直接接受设计调整 |
| 刘海屏 | `viewport-fit=cover` + `env(safe-area-inset-*)` |
| 禁止缩放 | 不推荐，影响可访问性；如果业务强约束，可设置 viewport，但要谨慎 |
| 横竖屏 | CSS 媒体查询可适配；强制横屏在普通 Web 中不可靠，通常依赖容器或提示用户 |
| 点击区域 | 推荐至少约 44 CSS px，保证手指可点 |

移动优先布局不是只给手机写样式，而是默认样式先覆盖小屏，再用媒体查询逐步增强到平板和桌面。

## Demo

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
>
```

```css
.page {
  padding:
    env(safe-area-inset-top)
    max(16px, env(safe-area-inset-right))
    env(safe-area-inset-bottom)
    max(16px, env(safe-area-inset-left));
}

.toolbar button {
  min-width: 44px;
  min-height: 44px;
}

@media (min-width: 768px) {
  .layout {
    display: grid;
    grid-template-columns: 240px 1fr;
  }
}
```

面试回答：

> 移动端适配核心是 viewport、响应式布局、DPR 和安全区域。常用 `width=device-width, initial-scale=1`，布局用 flex/grid/vw/rem/媒体查询。750px 设计稿通常是 2x 视觉稿，开发要换成 CSS px。刘海屏用 `viewport-fit=cover` 和 `env(safe-area-inset-*)`，点击区域建议至少 44px 左右。

## 参考来源

- [MDN: `<meta name="viewport">`](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta/name/viewport)
- [MDN: Viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/CSSOM_view/Viewport_concepts)
- [MDN: CSS `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
