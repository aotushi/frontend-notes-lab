# 浮动与清除浮动

## 问题

`float` 会带来哪些布局影响？清除浮动应该怎么做？

## 结论

`float` 会让元素向左或向右浮动，使文本和行内内容围绕它排列。浮动元素会脱离普通块布局对父元素高度的撑开效果，但仍会影响周围行盒的排布，这也是“父元素高度塌陷”和“文字环绕”的来源。

清除浮动有两个不同目标：

- 阻止后续元素继续环绕前面的浮动元素：使用 `clear`。
- 让父容器包含内部浮动元素高度：让父容器创建新的 BFC，现代写法优先使用 `display: flow-root`。

不推荐再把空标签、`zoom: 1`、固定高度当作默认方案。`overflow: hidden` 可以创建 BFC，但可能裁剪阴影、下拉菜单或绝对定位溢出内容。

## Demo

### 阻止后续元素环绕

```html
<img class="avatar" src="/images/example.png" alt="">
<p>这段文字会围绕浮动图片排列。</p>
<p class="next">这段文字从浮动元素下方开始。</p>
```

```css
.avatar {
  float: left;
  width: 96px;
  margin-right: 16px;
}

.next {
  clear: left;
}
```

### 让父容器包含内部浮动

```html
<div class="media">
  <img class="cover" src="/images/example.png" alt="">
  <p>父容器需要包住内部浮动元素。</p>
</div>
```

```css
.media {
  display: flow-root;
  border: 1px solid #94a3b8;
}

.cover {
  float: left;
  width: 120px;
  margin-right: 16px;
}
```

## 面试回答

`float` 的本意是做图文环绕，不是现代页面主布局方案。浮动元素会从普通块布局中移出，父容器不会因为它自动增高，但后面的行内内容会绕开浮动区域。清除浮动时要分清目标：如果是不让后续内容继续环绕，用 `clear`；如果是让父容器包住内部浮动，现代方案是给父容器设置 `display: flow-root` 创建 BFC。`overflow: hidden` 也能达到类似效果，但可能裁剪溢出内容，所以不是首选。

## 参考来源

- [MDN: float](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/float)
- [MDN: clear](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clear)
- [MDN: Floats](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Floats)
