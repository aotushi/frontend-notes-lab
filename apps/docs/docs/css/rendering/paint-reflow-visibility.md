# 重排、重绘与隐藏方式

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- line-height理解
- display:none, visiblity: hidden; opacity: 0之间的区别
- 文字超长的省略号写法
- 图片为什么有左右上下间隙,怎么去除?
- chrome字体如何小于12px?
- 为什么会发生样式抖动?
- 重排和重绘

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### line-height理解

行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS中起高度作用的是 height 和 line-height，没有定义 height 属性，最终其表现作用一定是 line-height 。

### display:none, visiblity: hidden; opacity: 0之间的区别

- `display: none` （不占空间，不能点击）（回流+重绘）
- `visibility: hidden` （**占据空间**，不可点击）（重绘）
- `opacity: 0`（**占据空间**，可以点击）（重建图层，性能较高）

更多：[分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/100)

### 文字超长的省略号写法

##### 单行文本省略
```css
.single-line-ellipsis {
  width: 200px; /* 设置一个固定宽度，根据实际需求调整 */
  white-space: nowrap; /* 强制文本在一行内显示 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 用省略号表示超出的文本 */
}
```

##### 多行文本省略
```css

.multi-line-ellipsis {
  width: 200px; /* 设置一个固定宽度，根据实际需求调整 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 这行对于多行省略号只是辅助，主要靠下面的属性 */
  display: -webkit-box; /* 开启弹性伸缩盒子模型 */
  -webkit-line-clamp: 3; /* 显示的行数，超出部分用省略号表示，这里设置为 3 行，可根据需求修改 */
  -webkit-box-orient: vertical; /* 子元素垂直排列 */
}
```

### 图片为什么有左右上下间隙,怎么去除?

**原因：**
- 左右：因为 img 是 `inline-block` 行内块元素，行内元素之间有『换行（回车），空格，tab』时会产生左右间隙
- 上下：**行内元素默认与父容器基线对齐**，而基线与父容器底部有一定间隙，所以上下图片间有间隙。
**解决办法：**
- 移除上下间隙：
    - img 本身设置 `display: block;`
    - 父元素设置 `font-size: 0;` （基线与字体大小有关，字体为零，基线间就没距离了）
    - img 本身设置 `vertical-align: bottom;`（让inline-block的img与每行的底部对齐）
- 移除左右间距：
    - 行内元素间不要有换行，连成一行写消除间隙
    - 第一行结尾写上 `<!-- ，第二行开头跟上 -->` 。即利用注释消除间距
    - 父元素 font-size 设置 0

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
