# 重排、重绘与隐藏方式

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- display:none, visiblity: hidden; opacity: 0之间的区别
- 有什么不同的方式可以隐藏内容？
- chrome字体如何小于12px?
- 为什么会发生样式抖动?
- 重排和重绘

## 结论

本页只处理 CSS 对渲染树、布局、绘制和可见性的影响。行高、文本溢出、图片间隙等排版问题归入“文本、字体与排版”。

### display:none, visiblity: hidden; opacity: 0之间的区别

- `display: none` （不占空间，不能点击）（回流+重绘）
- `visibility: hidden` （**占据空间**，不可点击）（重绘）
- `opacity: 0`（**占据空间**，可以点击）（重建图层，性能较高）

更多：[分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/100)

### 有什么不同的方式可以隐藏内容？

隐藏内容要先区分目标：是否占布局空间、是否可点击、是否仍暴露给辅助技术、是否只是视觉裁剪。

- `display: none`：元素不生成盒子，不占布局空间，通常也不会暴露给屏幕阅读器。
- `visibility: hidden`：元素仍占布局空间，但不可见，通常不可交互。
- `opacity: 0`：元素透明但仍占布局空间，仍可能响应点击和聚焦。
- `position: absolute` 加负向偏移：元素脱离正常流，可移出视口；更适合视觉隐藏但保留可访问内容时配合严格的 visually-hidden 模式。
- `clip-path` 或旧式 `clip`：裁剪可见区域，常见于视觉隐藏文本。
- `width: 0; height: 0; overflow: hidden`：通过尺寸和溢出裁剪隐藏内容。
- `transform: scale(0)`：视觉缩放到不可见，但布局和交互影响要谨慎验证。

### chrome字体如何小于12px?

- 老版：`webkit-text-size-adjust: none`
- 新版：`webkit-transform: scale(.8, .8)`

### 为什么会发生样式抖动?

因为没有指定元素具体高度和宽度，比如数据还没有加载进来时元素高度是 100px(假设这里是 100px)，数据加载进来后，因为有了数据，然后元素被撑大，所有出现了抖动

### 重排和重绘

> https://juejin.cn/post/6844904083212468238


##### 重绘重排区别
重绘和重排是浏览器渲染页面的两个过程，它们有以下区别：
* 重绘是指元素的外观发生改变，但不影响布局的情况，例如改变颜色、背景、边框等。
* 重排是指元素的几何属性发生改变，影响了布局的情况，例如改变位置、大小、内容等。
* 重排往往有重绘。因此，在优化页面性能时，应该尽量减少重排和重绘的次数和范围。

##### 哪些操作导致重排
[[六 性能优化#2.重排和重绘的优化#1.触发布局与重绘的操作有哪些?]]


##### 哪些操作会导致重绘
- 更新元素的颜色
- 文本方向
- 阴影

##### 重排优化

###### 1.减少重排范围
* 尽可能直接在目标元素上操作,而不用操作父元素/兄弟元素
* 不使用table布局,1个小改动会造成整个table重新布局

###### 2.减少重排次数
* 样式集中改变 class代替style
* 分离读写操作
* 将DOM元素离线操作
* 使用absolute或fixed脱离文档流
* 优化动画

面试回答：

> 减少重排和重绘的核心是减少影响范围和次数。样式修改尽量合并，通过 class 批量切换；布局读取和写入分离，避免读写交错触发布局抖动；复杂 DOM 操作可离线处理后一次性插入；动画优先使用 `transform`、`opacity` 这类不触发布局的属性，并避免 table 等牵一发动全身的布局结构。

**样式集中改变**

**分离读写操作**
读操作放在一起,写入操作放在一起

**将DOM离线** !!
* 使用 display:none
* documentFragment
* 复制节点,副本操作,然后替换

```js


// 缓存 DOM 元素（只获取一次）
const container = document.getElementById('container');

// 合并样式操作（减少回流）
Object.assign(container.style, {
  width: '100px',
  height: '200px',
  border: '10px solid red',
  color: 'red'
});

// 离线后的操作（复用缓存对象）
// 假设后续需要修改部分属性
Object.assign(container.style, {
  width: '200px',     // 覆盖原有宽度
  backgroundColor: 'blue' // 新增背景色
});
```

**优化动画**
* 动画效果应用position为absolute/fixed
* 启用GPU加速的属性: CSS转换, CSS33D变换transform webgl, 视频

## Demo

待补充：对比三种隐藏方式的占位、点击和布局影响；展示布局读写交错导致的重排。
