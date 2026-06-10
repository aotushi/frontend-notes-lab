# 尺寸约束、单位与百分比

## 问题

`width`、`min-width`、`max-width` 的关系是什么？`height: 100%`、垂直方向 `margin` / `padding` 百分比、`px` / `em` / `rem` / `vw` / `vh` 应该怎么理解？

## 结论

`width` 给出首选宽度，`min-width` 和 `max-width` 给出约束范围。计算使用值时，浏览器会把首选宽度限制在最小值和最大值之间；当 `min-width` 大于 `max-width` 时，最小宽度约束最终会胜出。

百分比不是永远相对父元素同方向尺寸。`width: 50%` 通常相对包含块宽度；`height: 100%` 只有在包含块高度是可确定值时才稳定生效；垂直方向的 `margin-top`、`margin-bottom`、`padding-top`、`padding-bottom` 百分比通常相对包含块的内联尺寸计算，在水平书写模式下就是宽度。

长度单位要按“参考对象”记忆：

| 单位 | 参考对象 | 常见用途 |
| --- | --- | --- |
| `px` | CSS 像素，不等于物理设备像素 | 边框、图标、精确间距 |
| `em` | 当前元素自身或父级计算后的字体尺寸，取决于属性 | 组件内部跟随字号缩放 |
| `rem` | 根元素字体尺寸 | 全站字号、间距比例 |
| `vw` / `vh` | 视口宽高的 1% | 全屏区块、响应式尺寸 |
| `vmin` / `vmax` | 视口宽高中较小值/较大值的 1% | 保持视口相关比例 |

## Demo

```css
.box {
  width: 80%;
  min-width: 320px;
  max-width: 960px;
}
```

上面这段可以读成：先希望盒子占包含块宽度的 `80%`，但不能小于 `320px`，也不能大于 `960px`。

```css
html,
body,
#app {
  height: 100%;
}

.panel {
  height: 100%;
}
```

`height: 100%` 需要向上找到明确高度。只给 `.panel` 写 `height: 100%`，但父级高度都是 `auto`，这个百分比就缺少稳定基准。

```css
.ratio-box {
  width: 400px;
  padding-top: 50%;
}
```

在水平书写模式下，`padding-top: 50%` 是相对包含块宽度计算，不是相对包含块高度计算。

## 面试回答

`width` 是首选尺寸，`min-width` 和 `max-width` 是约束。最终尺寸会被夹在最小值和最大值之间，`min-width` 大于 `max-width` 时最小值会胜出。百分比要看属性和包含块：宽度百分比通常看包含块宽度，高度百分比需要父级有确定高度，垂直 margin/padding 的百分比通常看包含块宽度。单位方面，`px` 是 CSS 像素，`em` 跟当前字体上下文走，`rem` 跟根字号走，`vw` / `vh` 跟视口走。

## 参考来源

- [MDN: CSS values and units](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units)
- [MDN: `min-width`](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)
- [MDN: `max-width`](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)
- [MDN: CSS box model - Margins, padding and borders](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)
