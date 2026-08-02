# 盒模型与 box-sizing

## 问题

CSS 盒模型是什么？`content-box` 和 `border-box` 有什么区别？`offsetWidth` 如何计算？负 `margin` 会怎样影响布局？

## 结论

CSS 盒模型把一个元素看成从内到外的四层盒子：`content`、`padding`、`border`、`margin`。`box-sizing` 决定 `width` / `height` 计算到哪一层。

- `content-box` 是默认值：`width` / `height` 只表示内容区，最终占用尺寸还要加上 `padding` 和 `border`。
- `border-box`：`width` / `height` 表示边框盒，`padding` 和 `border` 会挤占内容区，但最终边框外尺寸保持为声明值。
- `margin` 不属于 `box-sizing` 的计算范围，它始终是盒子外部与其它盒子的间隔。

这里要区分两个概念：MDN 讲盒模型时会把盒子分成 `content box`、`padding box`、`border box`、`margin box` 四个区域；但当前 `box-sizing` 属性的常用取值只有 `content-box` 和 `border-box`。所以 `padding box`、`margin box` 是盒模型区域，不应直接当成现代 CSS 中可用的 `box-sizing` 值来记。

现代项目常用下面的全局写法，让组件尺寸更容易预测：

```css
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}
```

### `offsetWidth` 如何按盒模型计算？

`offsetWidth` 是 DOM 几何属性，返回元素边框盒的布局宽度，通常包含内容宽度、左右 `padding`、左右 `border` 和垂直滚动条宽度，不包含 `margin`。

```html
<div id="box"></div>
```

```css
#box {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  margin: 10px;
}
```

这个元素的 `offsetWidth` 是：

```text
100 + 10 * 2 + 1 * 2 = 122
```

如果希望 `offsetWidth` 接近声明的 `100px`，应把盒模型切到 `border-box`：

```css
#box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #ccc;
}
```

注意 `offsetWidth` 是整数布局值，涉及缩放、子像素和滚动条时，结果可能和 `getBoundingClientRect().width` 不完全一样。

### 负 `margin` 会怎样影响布局？

负 `margin` 仍然参与正常流布局，不等于 `transform` 视觉位移。它会改变元素的 margin box，从而影响自己和后续元素的排布。

常见方向可以这样理解：

| 写法 | 常见效果 |
| --- | --- |
| `margin-left: -20px` | 元素向左靠，后续布局仍按新的 margin box 计算 |
| `margin-top: -20px` | 元素向上靠，可能和前面的内容更接近或重叠 |
| `margin-right: -20px` | 元素占用的右侧外部空间变小，后续行内或布局内容可能靠近 |
| `margin-bottom: -20px` | 元素下方外部空间变小，后续块可能上移 |

负 margin 常用于少量视觉对齐或旧布局技巧，但它会影响正常流，维护成本较高。现代布局里优先考虑 Grid/Flex、`gap`、定位或 `transform`，只有明确需要改变布局占用关系时再用负 margin。

## Demo

同样声明 `width: 200px; padding: 24px; border: 8px solid`，两种盒模型的最终宽度不同。

```html
<div class="box content-box">content-box</div>
<div class="box border-box">border-box</div>
```

```css
.box {
  width: 200px;
  padding: 24px;
  border: 8px solid #0f766e;
}

.content-box {
  box-sizing: content-box;
  /* 最终占用宽度 = 200 + 24 * 2 + 8 * 2 = 264px */
}

.border-box {
  box-sizing: border-box;
  /* 最终占用宽度 = 200px，内容区宽度被压缩 */
}
```

如果面试题问“为什么很多 reset 会设置 `box-sizing: border-box`”，核心原因不是它更符合规范，而是它让组件边界尺寸等于声明尺寸，布局和响应式计算更直观。

## 面试回答

CSS 盒模型由内容区、内边距、边框和外边距组成。默认的 `content-box` 下，`width` 和 `height` 只控制内容区，所以元素最终占用空间还要加上 `padding` 和 `border`。`border-box` 下，声明的宽高就是边框盒尺寸，`padding` 和 `border` 包含在里面，因此更适合组件化布局。注意 `margin` 永远在盒子外部，不参与 `box-sizing` 的宽高计算。

### margin 和 padding 的使用场景

- 需要在 `border` **外侧**添加空白，且空白处**不需要背景色**时，使用 `margin`；
- 需要在 `border` **内侧**添加空白，且空白处**需要背景色**时，使用 `padding`。

其他区别：
- `margin` 可以为负值，`padding` 不能为负值；
- `margin` 在垂直方向会发生折叠（margin collapse），`padding` 不会；
- 点击区域（事件响应区域）包含 `padding`，不包含 `margin`。

### 替换元素的概念及计算规则

**替换元素**的内容来自文档结构之外，浏览器把这个外部对象的呈现结果放进元素生成的盒子中。典型例子有 `<img>`、`<video>`、`<iframe>` 和 `<embed>`；`<input>` 不能整体归为替换元素，其中 `input[type="image"]` 才是明确的替换元素。

替换元素的特性：

- 外部内容不参与普通 CSS 盒内排版，但元素生成的盒子仍能设置 `width`、`height`、`margin`、`border`、`object-fit` 和 `object-position` 等样式；
- 替换内容**通常**带有固有宽度、固有高度或固有宽高比，例如图片文件的像素尺寸，但并非所有替换元素都有完整的固有尺寸；
- 是否作为行内级盒或块级盒参与布局仍由 `display` 决定，不能把所有替换元素都理解成固定的“行内元素”；
- `vertical-align`、基线对齐和尺寸计算等规则与普通文本盒不同。

尺寸计算要结合三类信息，而不是机械套用一个固定的优先级公式：

| 信息 | 例子 | 作用 |
| --- | --- | --- |
| CSS 尺寸约束 | `width`、`height`、`min-*`、`max-*` | 直接控制或限制最终使用尺寸 |
| HTML 尺寸属性 | `<img width="800" height="450">` | 为图片等元素提供尺寸提示，并可提前保留比例空间 |
| 固有尺寸与固有比例 | 图片原始宽高、视频比例 | 未明确设置 CSS 尺寸时参与计算；只确定一边时可推导另一边 |

```html
<img
  src="cover.jpg"
  alt="文章封面"
  width="800"
  height="450"
  class="cover"
>
```

```css
.cover {
  width: min(100%, 40rem);
  height: auto;
}
```

HTML 的 `width` 和 `height` 提供 `800 / 450` 的比例提示；CSS 把显示宽度限制在容器内，`height: auto` 再依据固有比例计算高度。若替换内容缺少某类固有信息，浏览器会按对应元素和 CSS Sizing 规则使用其它已知尺寸或默认对象尺寸，不能概括成“所有元素默认 `300×150`”。

## 参考来源

- [MDN: CSS box model](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model)
- [MDN: The box model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)
- [MDN: box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-sizing)
- [MDN: HTMLElement.offsetWidth](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth)
- [MDN: margin](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)
- [MDN: Replaced elements](https://developer.mozilla.org/en-US/docs/Glossary/Replaced_elements)
- [MDN: Sizing replaced elements](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_images/Replaced_element)
