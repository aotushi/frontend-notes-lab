# 盒模型与 box-sizing

## 问题

CSS 盒模型是什么？`content-box` 和 `border-box` 有什么区别？

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

## 参考来源

- [MDN: CSS box model](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model)
- [MDN: The box model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)
- [MDN: box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-sizing)
