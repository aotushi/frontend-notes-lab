# CSS 绘制基础形状

## 问题

如何用 CSS 画三角形、圆形、半圆和扇形？

## 结论

CSS 可以用边框、圆角、裁剪路径和渐变绘制基础形状。面试中重点不是背某一种写法，而是说明它们的原理和适用边界：简单装饰可用 CSS，复杂图形或语义图标更适合 SVG。

三角形的经典写法是让元素宽高为 `0`，再用不同方向的透明边框和一个有色边框形成斜边。圆形、半圆和扇形通常由 `border-radius` 控制。更灵活的不规则形状可以用 `clip-path`。

## Demo

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 60px solid #168a7a;
}
```

```css
.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #168a7a;
}

.semi-circle {
  width: 120px;
  height: 60px;
  border-radius: 60px 60px 0 0;
  background: #168a7a;
}

.sector {
  width: 80px;
  height: 80px;
  border-radius: 80px 0 0;
  background: #168a7a;
}
```

```css
.clip-triangle {
  width: 100px;
  height: 100px;
  background: #168a7a;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
```

### 实现一个宽高自适应的正方形

**方式一：vw 单位**

```css
.square {
  width: 10vw;
  height: 10vw;
}
```

**方式二：padding-top 百分比（padding 的百分比相对于父元素宽度）**

```css
.square {
  width: 20%;
  height: 0;
  padding-top: 20%; /* 与 width 相等，形成正方形 */
  background: orange;
  position: relative;
}
/* 内容放在伪元素或绝对定位子元素中 */
```

**方式三：aspect-ratio（推荐）**

```css
.square {
  width: 20%;
  aspect-ratio: 1 / 1;
  background: tomato;
}
```

**方式四：伪元素 margin-top**

```css
.square {
  width: 30%;
  overflow: hidden;
}

.square::after {
  content: '';
  display: block;
  margin-top: 100%; /* 100% 相对于父元素宽度 */
}
```

### 画一个梯形

利用 border 的斜边特性绘制梯形：

**直角梯形：**

```css
.trapezoid {
  height: 0;
  width: 100px;
  border-bottom: 100px solid red;
  border-right: 40px solid transparent;
}
```

**等腰梯形：**

```css
.trapezoid {
  height: 0;
  width: 100px;
  border-width: 0 40px 100px 40px;
  border-style: none solid solid;
  border-color: transparent transparent red;
}
```

原理与三角形相同：宽高为 0 时，border 的四条边各自形成三角形；设置 `width` 后底边有宽度，加上两侧透明斜边，就形成梯形。

## 面试回答

CSS 画形状可以分三类：三角形常用透明 border 和有色 border；圆形、半圆、扇形常用固定宽高加 `border-radius`; 不规则形状可以用 `clip-path`。如果图形有语义、需要复杂路径或要复用成图标，SVG 通常更合适。

## 参考来源

- [MDN: `border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)
- [MDN: `clip-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)
- [MDN: CSS backgrounds and borders](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_backgrounds_and_borders)
- [MDN: `aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
