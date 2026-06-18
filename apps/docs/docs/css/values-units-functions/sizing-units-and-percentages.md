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

### `em` 的参考对象

`em` 不是永远参考父元素。它的参考对象取决于使用它的属性：

- 用在 `font-size` 上时，`1em` 等于父元素计算后的 `font-size`。这是因为元素自己的 `font-size` 还没有算出来，不能用自己定义自己。
- 用在 `width`、`height`、`padding`、`margin`、`border-radius` 等其它属性上时，`1em` 等于当前元素自身计算后的 `font-size`。

```css
.item {
  font-size: 1.3em; /* 参考父元素的 font-size */
  padding: 1em; /* 参考 .item 自己计算后的 font-size */
  width: 10em; /* 参考 .item 自己计算后的 font-size */
}
```

如果父元素字号是 `16px`，`.item` 的最终字号就是 `16px * 1.3 = 20.8px`；此时 `padding: 1em` 等于 `20.8px`，`width: 10em` 等于 `208px`。

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

### MDN 嵌套列表中的 `em` 字号计算

MDN values and units 练习里常见写法是给嵌套列表项设置：

```css
.ems li {
  font-size: 1.3em;
}
```

由于这里的 `em` 用在 `font-size` 上，所以每一层 `li` 都按父元素计算后的字号继续乘以 `1.3`。假设外层基准字号是浏览器默认的 `16px`：

| 元素层级 | 计算公式 | 结果 |
| --- | --- | --- |
| 第 1 层 `.ems > li` | `16px * 1.3` | `20.8px` |
| 第 2 层 `.ems > li li` | `16px * 1.3 * 1.3` | `27.04px` |
| 第 3 层 `.ems > li li li` | `16px * 1.3 * 1.3 * 1.3` | `35.152px` |

在控制台验证时，用 `getComputedStyle()` 读取计算后的真实字号：

```js
const thirdLevelLi = document.querySelector('.ems > li li li')

parseFloat(getComputedStyle(thirdLevelLi).fontSize)
```

如果要查看某个范围内所有内层 `li` 的字号，可以先选出集合再逐个读取：

```js
[...document.querySelectorAll('.ems > li:nth-child(3) li')]
  .map((li, index) => ({
    index: index + 1,
    text: li.textContent.trim(),
    fontSize: getComputedStyle(li).fontSize
  }))
```

## 面试回答

`width` 是首选尺寸，`min-width` 和 `max-width` 是约束。最终尺寸会被夹在最小值和最大值之间，`min-width` 大于 `max-width` 时最小值会胜出。百分比要看属性和包含块：宽度百分比通常看包含块宽度，高度百分比需要父级有确定高度，垂直 margin/padding 的百分比通常看包含块宽度。单位方面，`px` 是 CSS 像素，`em` 跟当前字体上下文走，`rem` 跟根字号走，`vw` / `vh` 跟视口走。

## 参考来源

- [MDN: CSS values and units](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units)
- [MDN: `min-width`](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)
- [MDN: `max-width`](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)
- [MDN: CSS box model - Margins, padding and borders](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)
