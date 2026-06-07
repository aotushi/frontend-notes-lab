# 盒模型与 BFC

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- 盒模型
- 浮动
- 说说BFC的理解

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### 盒模型

##### 是什么?
>[The box model - Learn web development | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)

指网页布局中，每个 HTML 元素都可以看作是一个矩形盒子（box），包括元素的内容区域、内边距（padding）、边框（border）和外边距（margin）四个部分。

可通过`box-sizing`进行设置。根据计算宽高的区域可分为：

- `content-box` (W3C 标准盒模型) 默认使用
- `border-box` (IE 盒模型)
- `padding-box`
- `margin-box` (浏览器未实现)

##### 作用
通过设置元素的盒模型属性(box-sizing 属性)，可以控制元素的大小、位置和边距，以及元素之间的距离和排列方式。盒模型也是响应式设计和网页布局的基础。

##### 分类
* 标准盒模型
* 替代(IE)盒模型

##### 差异
主要差异在于计算元素宽度和高度时所包含的内容不同。
标准盒模型:元素的宽度和高度只包括内容区域，不包括内边距、边框和外边距。
IE盒模型: 元素的宽度和高度包括了内容区域、内边距和边框，不包括外边距

默认浏览器会使用标准模型。如果需要使用替代模型，您可以通过为其设置 box-sizing: border-box 来实现。


##### 切换
默认浏览器会使用标准模型。
替代模型  box-sizing: border-box
标准模型  box-sizing: content-box

##### 实例
所有元素都使用替代模式
设置 box-sizing 在 `<html>` 元素上，然后设置所有元素继承该属性.
```css
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
```

### 浮动

##### 浮动问题
由于浮动元素不在文档流中, 浮动元素会漂浮在文档流的块框上。
* 父元素高度无法被撑开,影响与父元素同级的元素
* 与浮动元素同级的非浮动元素（内联元素）会跟随其后
* 若非第一个元素浮动，则该元素之前的元素也需要浮动

##### 清除浮动方法
>https://github.com/Easay/issuesSets/issues/12


一般来说，元素设置为浮动后会脱离文档流，不会对文档流中其他元素造成影响。但是文本内容会记住浮动元素的大小，并在排布时避开它。造成文本环绕浮动盒子的效果。要阻止行盒子环绕在浮动盒子外面，需要给包含行盒子的元素应用clear属性。

清除浮动主要是为了解决父元素因为子元素浮动而引起的内部高度为0的问题。

###### 清除浮动的方式有：

* 父级元素定义height（不推荐）
缺点：只适合高度固定的布局，要给出精确的高度，如果高度和父级div不一样时，会产生问题。
* 结尾处加空div标签+clear:both（不推荐）
在最后加空div标签，并设定clear:both，会在空div标签上方创造出足够的垂直外边距，从而为包住浮动元素创造空间。父元素自动检测子盒子最高的高度，然后与其同高。
* 父级div定义伪类：after+zoom（推荐🌷）
IE8以上和非IE浏览器才支持:after，原理和方法2有点类似，zoom(IE专有属性)可解决ie6,ie7浮动问题。
```css
.father:after{
      content:" ";
      clear:both;
      display: block;
      /* height:0px; */
  }
```

* 父级div定义overflow:hidden
缺点：内容增多的时候容易造成不会自动换行导致内容被隐藏掉，无法显示要溢出的元素
* 父级div定义overflow:auto
当在父级div定义overflow: hidden|auto时，浏览器会自动检查浮动区域的高度。


##### 其它
* 元素浮动后,display自动变为block

### 说说BFC的理解

##### 定义

当元素在页面上垂直或水平排布时，它们之间如何相互影响，CSS有几套不同的规则，其中一套叫块级格式化上下文（Block Formatting Context）。
**格式化上下文**
Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。
最常见的 Formatting context 有 Block fomatting context (简称BFC)和 Inline formatting context (简称IFC)。

BFC是一个独立的布局环境，其中的元素布局是不受外界的影响，并且在一个BFC中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。


##### 会渲染BFC的元素
>https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
* document的根元素(`<html>`)
* 浮动(float值不为none)
* 绝对定位元素(元素position值为absolute/fixed)
* 行内块(元素display属性值为inline-block)
* 表格单元(元素display属性为table-cell,默认的HTML表格)
* 表格标题(元素display属性为table-caption,默认的HTML表格)
* 被拥有`display:table`属性隐式创建的匿名table表格
* 带有overflow属性(其值不能为visible/clip)的块元素(`因为overflow:visible元素并没有限制其内容的布局，其内容可以自由地溢出元素的边界，因此没有必要创建新的BFC来限制其影响范围。`)
* `display:flow-root`
* contain属性值为layout/content/paint的元素
* Flex子元素(属性为display:flex/inline-flex的元素的直接子元素),如果它们本身不是flex或grid或table容器.
* Grid子元素(属性为display:grid/inline-grid的元素的直接子元素),如果它们本身不是flex或grid或table容器.
* 多列容器(元素其column-count/column-width不是auto,column-count不是1)
* column-span:all


##### BFC区域布局规则
1. 内部的Box按垂直方向排列;
2. 计算BFC的高度时，浮动元素也参与计算
3. Box之间垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
4. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
5. BFC的区域不会与float box重叠。
6. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

##### BFC应用


防止margin重叠: 创建新的BFC来防止相邻元素间的margin重叠
```css
//防止margin重叠  两个p标签的上下外边距会使用两个外边距中较大的那个值,使其中一个p变为bfc区域后,外边距为两个外边距和.


将其中一个p标签变为bfc区域:
 overflow: hidden; || display: inline-block; || dispaly: flex; || display: 
```
自适应两栏布局: 利用BFC不与浮动元素重叠的特性
```html

```
清除内部浮动: BFC可以包含浮动,用来清除浮动防止父元素高度塌陷
```html
<style>
    .par {
        border: 5px solid #fcc;
        width: 300px;
        // overflow: hidden; 实现bfc后, par元素高度会计算上内部的浮动元素
    }
 
    .child {
        border: 5px solid #f66;
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>
```

- 清除浮动：
    - 子浮动，父 `overflow: hidden`（缺点：阴影和下拉菜单）
- div 垂直方向 margin 上下合并：
    - 其中一个包 div ，设置 `overflow：hidden`
- div 垂直方向 margin 内外合并：
    - 父容器 1px 透明上边框
    - 父容器 `overflow: hidden`
- 右侧 div 自适应：左边浮动，右边设置 `overflow：hidden`

## Demo

待补充：对比 `content-box` 和 `border-box` 的尺寸计算；对比普通容器和 BFC 容器中的 margin 折叠、浮动包裹效果。
