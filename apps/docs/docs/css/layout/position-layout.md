# position 定位

## 问题

`position` 有哪些值？`relative`、`absolute`、`fixed`、`sticky` 分别相对谁定位？什么是包含块？为什么 `sticky`、`fixed`、`z-index` 有时不生效？如何用定位实现居中或顶部吸附？

## 结论

### 理解路径

1. `position` 决定元素是否仍在正常文档流中，以及 `top`、`right`、`bottom`、`left` 或逻辑方向的 `inset-*` 偏移量是否参与计算。
2. `relative` 和 `sticky` 仍保留正常流占位；`absolute` 和 `fixed` 会脱离正常流，不再为原位置保留空间。
3. 定位元素的偏移不是永远相对父元素，而是相对它的包含块。`absolute`、`fixed`、`sticky` 的高频问题都要回到包含块和滚动容器。
4. `z-index` 解决的是同一层叠上下文里的堆叠顺序；层叠上下文不同，单纯调大数字不一定有用。
5. 面试中不要只背属性值，要能解释：是否脱离文档流、定位参照是谁、是否创建层叠上下文、常见失效原因和典型写法。

### position 有哪些值

| 值 | 是否保留正常流占位 | 定位参照 | 常见用途 |
| --- | --- | --- | --- |
| `static` | 保留 | 正常流 | 默认值。`top`、`right`、`bottom`、`left`、`z-index` 对普通 `static` 元素无效。 |
| `relative` | 保留 | 元素自身原本位置 | 小范围位移、作为 `absolute` 后代的定位参照。 |
| `absolute` | 不保留 | 先向上找最近一个“被定位过”的祖先；找到了就以它为坐标系，找不到才相对页面初始区域 | 角标、下拉层、弹窗内部定位、绝对居中。 |
| `fixed` | 不保留 | 通常是视口；若祖先建立 fixed containing block，则可能相对该祖先 | 固定导航、浮动操作按钮、固定遮罩。 |
| `sticky` | 保留 | 平时在正常位置占位；滚动到 `top` 这类阈值后，贴在最近滚动容器的指定边上，直到被父级边界推走 | 表头吸附、分组标题吸附、侧边目录吸附。 |

`inherit`、`initial`、`unset`、`revert`、`revert-layer` 是 CSS 全局关键字，不是定位模型本身。回答 `position` 的布局值时，重点放在 `static`、`relative`、`absolute`、`fixed`、`sticky`。

### relative 和 absolute 怎么区分

`relative` 是“先在正常流里排好，再相对自己原位置偏移”。它没有脱离文档流，原位置仍然占着，所以其他元素会按它未偏移时的位置排版。

```css
.badge {
  position: relative;
  top: -2px;
}
```

`absolute` 是“从正常流拿出来，再相对包含块定位”。它不再占据原位置，兄弟元素会当它不存在一样排版。

```css
.card {
  position: relative;
}

.card__tag {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

这段代码里 `.card` 的 `position: relative` 不一定是为了移动 `.card`，而是为了让 `.card__tag` 的包含块变成 `.card`。这也是“父相子绝”的真实含义。

### 包含块怎么答

包含块决定定位元素的偏移和百分比尺寸按谁计算。不要把它简化成“父元素”，因为很多时候最近父元素并不是定位参照。

| 元素类型 | 包含块规则 |
| --- | --- |
| `static`、`relative`、`sticky` | 通常由最近的块容器祖先或建立格式化上下文的祖先形成。 |
| `absolute` | 先找最近的 `position` 不为 `static` 的祖先；找到后，用这个祖先的 padding box 作为坐标区域。 |
| `fixed` | 通常是视口；连续媒体里表现为相对 viewport 固定。 |
| `absolute` / `fixed` 的特殊情况 | 如果祖先存在非 `none` 的 `transform`、`filter`、`perspective`、`contain: paint`、相关 `will-change`、`content-visibility: auto` 等，也可能成为包含块。 |

因此，“`fixed` 一定相对浏览器窗口”是不完整的。移动端或复杂页面里，如果外层容器写了 `transform: translateZ(0)`、`filter`、`contain` 等，内部 `position: fixed` 可能看起来像相对父容器固定，并且随该容器一起移动。解决思路通常是：把 fixed 元素移到不受这些属性影响的 DOM 层级，或者去掉不必要的包含块触发属性。

### absolute 和 fixed 有什么共同点和不同点

共同点：

- 都会脱离正常文档流，不为原位置保留空间。
- 都通过 `top`、`right`、`bottom`、`left` 或 `inset` 系列属性确定位置。
- 都会为自身内容建立新的块格式化上下文。
- 都可能受到包含块影响，尤其是祖先存在 `transform`、`filter`、`contain` 等属性时。

不同点：

- `absolute` 通常用于组件内部定位，参照最近定位祖先。
- `fixed` 通常用于视口级固定，滚动页面时位置保持不变。
- `fixed` 总会创建新的层叠上下文；`absolute` 只有在 `z-index` 不是 `auto` 时创建新的层叠上下文。

### sticky 为什么经常不生效

`sticky` 可以理解为：元素先按正常流排版，滚动到指定阈值后进入吸附状态，直到被自己的包含块边界限制住。

最常见的失效原因：

- 没有设置对应轴上的阈值，例如只写 `position: sticky`，没有写 `top: 0` 或 `inset-block-start: 0`。
- 祖先元素设置了 `overflow: hidden`、`auto`、`scroll`、`overlay`，导致 sticky 绑定到这个滚动机制祖先，而不是你以为的页面视口。
- sticky 元素或它的父级高度不足，没有足够滚动距离让它进入吸附状态。
- 在表格、弹性布局、网格布局或嵌套滚动容器中使用时，滚动容器和包含块边界与预期不一致。

吸顶导航的现代写法通常不需要 JavaScript：

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}
```

如果需求是“滚动超过某个高度后改变样式”，再考虑 `IntersectionObserver` 或滚动监听切换 class。监听滚动时要节流，并避免在滚动回调里频繁读写布局属性。

### z-index 为什么不生效

`z-index` 不是全局越大越靠上。它至少要看三件事：

1. 元素是否参与可层叠的上下文。定位元素、flex item、grid item、`opacity < 1`、`transform`、`filter`、`isolation`、`contain`、top layer 等都可能影响层叠。
2. 当前元素和目标元素是否在同一个层叠上下文。不同层叠上下文会作为整体参与父级排序，子元素的 `z-index` 不能突破父级上下文。
3. 元素是否真的发生重叠。没有重叠时，`z-index` 看起来没有效果。

常见排查顺序：

- 给需要排序的元素建立明确的定位或确认它是 flex/grid item。
- 检查父级是否因为 `transform`、`opacity`、`filter`、`position + z-index` 等创建了新的层叠上下文。
- 把弹窗、浮层这类全局覆盖元素放到更靠近根节点的层级，或者使用统一的 z-index token 管理层级。

### position、float、display、margin collapse 怎么相互影响

- `display: none` 时元素不渲染，`position`、`float`、`z-index` 都没有可见效果。
- `position: absolute` 或 `fixed` 的元素会脱离正常流，`float` 对它不再产生浮动布局效果。
- 浮动元素和绝对定位元素都会脱离普通块流，但 float 仍会影响文字环绕，absolute/fixed 不参与文字环绕。
- 绝对定位元素的 margin 不会和其他元素发生垂直方向 margin collapse。
- `position: relative` 不会脱离文档流，所以它自身和正常流里的相邻块仍可能出现常规 margin collapse 规则。

### 定位居中怎么写

已知或未知宽高都能用 `transform` 方案：

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

如果元素宽高固定，也可以用四边归零加 `margin: auto`：

```css
.child {
  position: absolute;
  inset: 0;
  width: 240px;
  height: 120px;
  margin: auto;
}
```

`margin: 0 auto` 不能直接让绝对定位元素水平居中，是因为普通块级元素的自动外边距依赖正常流中的可用宽度；绝对定位元素已经脱离正常流，需要同时给出定位边界或使用 `left: 50% + transform`。

### 移动端 fixed 和软键盘问题怎么答

现代移动浏览器已经支持 `position: fixed`，旧答案里“iOS/Android 不支持 fixed”不宜再作为通用结论。真实问题通常出现在软键盘、地址栏收缩、可视视口变化和安全区上：

- 底部 fixed 输入框在软键盘弹出时可能被遮挡或位置跳动。
- `100vh` 在移动端可能不等于当前可视区域高度，优先评估 `dvh`、`svh`、`lvh`。
- iPhone 底部需要考虑安全区：`padding-bottom: env(safe-area-inset-bottom)`。
- 表单输入区如果需要随键盘稳定移动，很多场景更适合放在正常流或滚动容器底部，而不是强依赖全局 fixed。

## Demo

<PositionPlayground />

这个组件按左右两栏展示 `static`、`relative`、`absolute`、`fixed`、`sticky`：左侧看实际布局效果，右侧看对应代码。`fixed` 案例放在 iframe 小视口里，避免固定元素覆盖整站页面。

## 参考来源

- [MDN: position](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position)
- [MDN: Layout and the containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Containing_block)
- [MDN: Stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_context)
- [MDN: z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/z-index)
- [CSS Positioned Layout Module Level 3](https://www.w3.org/TR/css-position-3/)
