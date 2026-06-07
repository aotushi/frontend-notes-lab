# CSS 基础与引入方式

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- CSS
- 常规问题
- 页面中引入CSS文有几种方式
- link 与 @import 的区别
- li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### CSS

> https://segmentfault.com/a/1190000013325778
> [常规](https://evelance.notion.site/3deb29fe2f464eaa938606bbbb2fc3e4)


#### 常规问题
##### 初始化CSS原因? 
- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。
- 当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。
- 最简单的初始化方法： `* { padding: 0; margin: 0; }` （强烈不建议）
- 使用 `normalize.css`
##### min-width, max-width,width的包含关系(优先级)是什么?
**属性的含义：**
- `min-width` 限制元素的最小宽度
- `max-width` 限制元素的最大宽度
- `width` 元素的宽度
**三者之间的优先级：**
`min-width` 和 `max-width` 的优先级都高于 `width`。即使 `width` 后面加上 `!important`。
- 当浏览器缩小导致元素宽度小于 `min-width` 时，元素的 `width` 就会被 `min-width` 的值取代，浏览器出现滚动条来容纳元素。
- 当浏览器放大导致元素的宽度大于 `max-width` 时，元素的 `width` 就会被 `max-width` 值取代。
- 当 `min-width` 值大于 `max-width` 时，则以 `min-width` 值为准。
**所以三者优先级排序： min-width > max-width > width**

#### 元素竖向的百分比设定是相对于父容器的高度吗
- 对于 height 属性来说是的。
- 对于 **margin-top/bottom(padding-top/bottom) 来讲不是**，而是**相对于容器的宽度**计算的


#### 页面中引入CSS文有几种方式
向页面中添加样式表的时候，层叠机制的原理是次序决定优先级。

如果为某个元素应用样式时，有两个或更多特殊性相等的规则相互竞争，则后声明的样式胜出。

* 行内样式
* 内部样式表
* 链接 `<link type="text/css" rel="stylesheet" href="style.css">`
* 导入 `@import url(style.css)`

```css
//行内
<div style="color: green; margin-top: 30px;border: 1px solid red;width: 500px">行内样式实例1</div>

//内部样式表
<style> 
p { color: #6478de; border: red 1px solid; } 
</style>

//链入外部样式
<link type="text/css" rel="stylesheet" href="style.css" >

//导入外部样式
<style> @import "qt_02_style.css"; </style>
```

#### link 与 @import 的区别
就结论而言，强烈建议使用`link`标签，慎用`@import`方式。

> https://segmentfault.com/a/1190000015950516

**区别**
* 从属关系: `@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是HTML提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。
* 加载顺序: 加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。
* 兼容性: `@import`是CSS2.1才有的语法，故只可在 IE5+ 才能识别；`link`标签不存在兼容性问题。
* DOM可控性: `@import`不能被DOM控制


#### 盒模型

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


#### px、rem和em的区别
> https://github.com/Easay/issuesSets/issues/19

* px（像素）：相对长度单位，像素px是相对于显示器屏幕分辨率而言的。

* em：相对长度单位。相对于父元素的字体大小。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。
任意浏览器的默认字体高都是16px。所有未经调整的浏览器都符合: 1em=16px。为了简化font-size的换算，需要在css中的body选择器中声明Font-size=62.5%，这就使em值变为 `16px*62.5%=10px`, 这样`12px=1.2em, 10px=1em`, 也就是说只需要将你的原来的px数值除以10，然后换上em作为单位就行了。
```css
body {
  font-size: 62.5%; /* 设置为 10px */
}

h1 {
  font-size: 2.4em; /* 相当于 24px */
}

p {
  font-size: 1.6em; /* 相当于 16px */
}
```

* rem：是CSS3新增的一个相对单位。使用rem为元素设定字体大小时，仍然是相对大小，但相对的只是HTML根元素。通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。

##### vw vh vmin vmax
1vh等于1%的视口高度。例如，浏览器高度是900px，那么`1vh = 900*1%=9px`，同理，若视口宽度是750px,则1vw是7.5px。

vh和vw是相对于视口的宽度和高度，而vmin和vmax则关于视口高度和宽度两者的最小或者最大值。例如，如果浏览器的高宽分别为700px和1100px，则1vmin=7px，1vmax=11px；如果高宽分别是1080px和800px,则1vmin=8px,1vmax=10.8px。

##### 使用场景
假设有一个元素，你需要让它始终在屏幕上可见。只要对其高度和宽度使用vmin单位，并赋予其低于100的值就可以做到了。例如，可以这样定义一个至少有两个边触摸到屏幕的方形：
```css
.box {
    height: 100vmin;
    width: 100vmin;
}
```
如果需要让这个方框始终铺满整个视口的可见区域：
```css
.box {
    height: 100vmax;
    width: 100vmax;
}
```


##### 盒模型内部/外部显示类型
> 了解
> https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model#补充：内部和外部显示类型

外部显示类型: 外部显示类型来决定盒子是块级还是内联
内部显示类型: 决定了盒子内部元素是如何布局的, 默认情况下是按照**正常文档流**布局. 可以通过display:flex等方式改变内部显示类型.

#### 浮动
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


#### 说说BFC的理解
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

#### line-height理解
行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS中起高度作用的是 height 和 line-height，没有定义 height 属性，最终其表现作用一定是 line-height 。


####  display:none, visiblity: hidden; opacity: 0之间的区别
- `display: none` （不占空间，不能点击）（回流+重绘）
- `visibility: hidden` （**占据空间**，不可点击）（重绘）
- `opacity: 0`（**占据空间**，可以点击）（重建图层，性能较高）

更多：[分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/100)

#### 浏览器如何解析 CSS 选择器的，换句话说 CSS 的匹配规则是什么？

从右向左，提高查找效率
- 浏览器根据选择器过滤掉 DOM 中的元素，并向上遍历其父元素以确定匹配项。
- 选择器链的长度越短，浏览器可以越快地确定该元素是否与选择器匹配。
（div p em）
- 如果从左到右，有无数多个 div 都得向下查找，效率低
- 反之，只有当当前元素是 em 时，才会向上查找，效率高

**例如**：
- 使用这个选择器 `p span`，浏览器首先找到所有`<span>`元素，然后一直向上遍历其父元素直到根以找到`<p>`元素。
- 对于特定的`<span>`，一旦找到`<p>` ，它就知道 `<span>` 匹配并可以停止匹配。


#### 文字超长的省略号写法
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


#### 图片为什么有左右上下间隙,怎么去除?
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

#### chrome字体如何小于12px?
- 老版：`webkit-text-size-adjust: none`
- 新版：`webkit-transform: scale(.8, .8)`


#### 为什么会发生样式抖动?
因为没有指定元素具体高度和宽度，比如数据还没有加载进来时元素高度是 100px(假设这里是 100px)，数据加载进来后，因为有了数据，然后元素被撑大，所有出现了抖动

#### css 如何匹配前 N 个子元素及最后 N 个子元素
- 如何匹配最前三个子元素: `:nth-child(-n+3)`
- 如何匹配最后三个子元素: `:nth-last-child(-n+3)`
#### li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？
- **场景：**
    - 有时，在写页面的时候，会需要将这个块状元素横排显示，此时就需要将 display 属性设置为 inline-block，此时问题出现了，在两个元素之间会出现大约8px左右的空白间隙。
- **原因：**
    - 浏览器的默认行为是把 inline 元素间的空白字符（空格换行tab）渲染成一个空格，也就是我们上面的代码 `<li>` 换行后会产生换行字符，而它会变成一个空格，当然空格就占用一个字符的宽度。
- **解决：**
    - 给 ul 标签设置 `font-size: 0;` 并为 li 元素重新设置 `font-size: XXpx;`


#### 选择器优先级
[[CSS-CSS选择器#优先级]]
CSS中的优先级规则分为两大类，一类称为**继承**，另一类称为**级联**。
* 继承的优先级是最低的;
* 级联优先级:
	* 开发者设置的CSS样式；
	* @layer规则中的CSS样式；
	* 用户设置的CSS样式；
	* 浏览器内置的CSS样式。
* 每个级联层中优先级计算公式:
	* 将不同选择器分配不同数值,选择器数值越高,优先级越高,但不会超过它上一级的优先级

计算公式:
* 0级 通配符,选择符,逻辑伪类
* 1级 元素
* 2级 类 属性 伪类
* 3级 ID
* 4级 行内样式

##### 计算优先级
<span style="color:blue">一个选择器的优先级可以说是由四个部分相加 (分量)，可以认为是个十百千 — 四位数的四个位数：</span>

1. **千位**： 如果声明在 [`style`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#attr-style) 的属性（内联样式）则该位得一分。这样的声明没有选择器，所以它得分总是1000。
2. **百位**： 选择器中包含<u>ID选择器</u>则该位得一分。
3. **十位**： 选择器中包含<u>类选择器、属性选择器、伪类</u>则该位得一分。
4. **个位**：选择器中包含<u>元素、伪元素选择器</u>则该位得一分。

**注**: <span style="color:blue">通配符选择器 (`*`)，组合符 (`+`, `>`, `~`, ' ')，和否定伪类 (`:not`) 不会影响优先级。</span>


#### flex弹性布局

##### 是什么?
是一种一维布局模型，它提供了强大的空间分布和对齐能力，能够有效地处理不同尺寸的元素布局。Flexbox布局是CSS3中引入的一种新的布局模式，特别适用于响应式设计和不确定内容尺寸的情况。

##### flex容器6属性及作用
* **flex-direction**  主轴的方向（即子元素的排列方向: row | row-reverse | column | column-reverse。默认row。
* **flex-wrap** 子元素是否需要换行.可选值有:nowrap | wrap | wrap-reverse。默认nowrap。
* **flex-flow** 上面两项合并写法
* **justify-content** 子元素在主轴的对齐方式
	* flex-start
	* flex-end
	* center
	* space-between  两端对齐，项目之间的间隔都相等。
	* space-around   每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
* **align-items** 子元素在交叉轴上的对齐方式
	* flex-start  交叉轴的起点对齐
	* flex-end
	* center   交叉轴的起点对齐
	* baseline 项目的第一行文字的基线对齐。
	* stretch  默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。
* **align-content** 定义了多根交叉轴存在时子元素在交叉轴上的对齐方式。如果项目只有一根轴线，该属性不起作用。

##### flex元素6属性
* order 定义子元素的排列顺序(在主轴上数字越小越靠前)
* flex-grow 元素的放大比例,默认为0.如果都为1,则每项元素在空间扩大时等分剩余空间
* flex-shrink 元素的缩小比例
	* 默认为1,空间不足时均等比例缩小;用0来表示禁止缩小.
	* 如果一个子元素的flex-shrink属性为0,其它子元素的为1.则空间不足时,前者不缩小.
	* 负值对该属性无效
* flex-basis 默认值为auto,表示元素占据主轴空间的原大小.
  * 可以设置具体数值或auto
  * 如果值为auto,则元素大小将根据内容自动调整.

* flex 上面3项的缩写. 
  * `flex:1`表示项目会根据剩余空间按等比例放大/缩小(相等于 1 1 0%).最后值不为auto就不会按本身宽度而均分计算.
  * `flex:none`  等价于`flex:0 0 auto`  盒子没有很大或缩小,基于各自内容自适应大小,采用本身默认大小
  * `flex:100px` 等价于`flex:1 1 100px`，表示项目会根据剩余空间按比例放大，也会按比例缩小，基准长度为100像素.
* align-self 单个元素的对齐方式


##### 实例

###### flex布局解决最后一行两边分布的问题
**解决前:**
![[Pasted image 20250227160455.png]]

**解决后:**
![[Pasted image 20250227160433.png]]

**解决方案:**

```html
<div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
    <div class="item">7</div>
    <span></span>
    <span></span>
  </div>
```


**方案说明:**
 如果我们每一行显示的个数为 n，那我们可以最后一行子项的后面加上 n-2 个 span 元素，span 元素的宽度和其它子项元素宽度一样，但不用设置高度。
**为什么是添加 n-2 个 span 元素呢 ？**
- 当最后一行只有 1 个子元素时，他会默认靠左，不用处理
- 当最后一行子元素正好时，我们就不用关心这个问题。
所以要去掉这两种情况，只需要加 n-2 个 span 元素就好


#### Grid布局

##### 是什么
Grid 布局则是将容器划分成行和列，产生单元格，然后指定项目所在的单元格，可以看作是二维布局。

##### 优缺点
- **grid 布局的优点：**
    1. 固定和灵活的轨道尺寸
    2. 可以使用行号，名称或通过定位网格区域将项目放置在网格上的精确位置。网格还包含一种算法，用于控制未在网格上显示位置的项目的放置。
    3. 在需要时添加其他行和列
    4. 网格包含对齐功能，以便我们可以控制项目放置到网格区域后的对齐方式，以及整个网格的对齐方式。
    5. 可以将多个项目放入网格单元格或区域中，它们可以彼此部分重叠。然后可以用 z-index 属性控制该分层。
- **grid 布局的缺点：**
    - 兼容性不太好


###### 如何实现响应式flex布局
通过使用媒体查询和弹性盒子属性，实现响应式Flex布局，以适应不同的屏幕尺寸。
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flexbox Responsive Layout</title>
  <style>
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }

    .item {
      flex: 1 0 calc(33.333% - 20px);
      margin-bottom: 20px;
      background-color: #ccc;
      text-align: center;
      padding: 10px;
    }

    @media (max-width: 768px) {
      .item {
        flex: 1 0 calc(50% - 20px);
      }
    }

    @media (max-width: 480px) {
      .item {
        flex: 1 0 calc(100% - 20px);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
    <div class="item">Item 5</div>
    <div class="item">Item 6</div>
  </div>
</body>
</html>
```

###### 等高列
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Equal Height Columns with Flexbox</title>
  <style>
    .container {
      display: flex;
    }

    .column {
      flex: 1;
      padding: 20px;
      background-color: #ccc;
    }

    .column:first-child {
      margin-right: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="column">
      <h2>Column 1</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam malesuada felis vel augue accumsan, at posuere neque tincidunt. Sed pulvinar, nisi in fringilla fringilla, lorem nisl semper purus, vel consequat ipsum nibh vitae libero.</p>
    </div>
    <div class="column">
      <h2>Column 2</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam malesuada felis vel augue accumsan, at posuere neque tincidunt. Sed pulvinar, nisi in fringilla fringilla, lorem nisl semper purus, vel consequat ipsum nibh vitae libero. Proin dictum arcu a libero pulvinar auctor. </p>
      <p>Praesent lobortis erat vel justo finibus, nec ullamcorper quam pretium. Vivamus sed ipsum ligula. Donec lobortis sodales massa eu placerat.</p>
    </div>
  </div>
</body>
</html>
```


#### position

##### position属性有那些值
position 属性用于指定一个元素在文档中的定位方式.
position有四个常用属性值：relative、absolute、fixed、static。三个不常用的：inherit、initial、sticky、unset

不设置Position的值或设置了position:static，top，left，right，bottom不起作用.
通过position属性，我们可以让元素相对于其正常位置，父元素或者浏览器窗口进行偏移。

##### position属性值介绍

###### static
默认值. 不设定position或者设定position:static都不会对这个div（或者别的标签）的布局有影响. top，left，right，bottom不会起作用

###### relative
* 相对定位. 未脱离文档流,**基于元素的margin左上角进行偏移**,不会影响其它元素的位置
* left和right同时存在，仅left有效;当top和bottom同时存在仅top有效。

###### absolute
* 绝对定位. 元素脱离了文档流,**绝对定位元素相对于最近的非static祖先元素定位**。基于祖先元素的左上角位置, 不包含margin区域, 从padding区域开始计算.
* 当祖先元素不存在时，则相对于ICB（inital container block, 初始包含块）,可以理解为窗口/body元素.
* 关于盒子层叠的次序，可以设置一个叫z-index的属性，值越大，离眼睛越近。

###### fixed
* 固定定位. 以浏览器的窗口为参考点进行定位.
* 当出现滚动条时，对象不会随着滚动，IE6以下不支持该属性。

###### sticky
* 磁贴定位. 
* 像position:relative和position:fixed的合体:

##### 实例

###### 1.声明为fixed/absolute时
* 该元素将变为块级元素(例子,span设置absolute后,可以设置宽高)
* 如果该元素是块元素且宽度是100%,则宽度变为auto

###### 2.实现水平垂直居中
> 见下面


#### 重排和重绘
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


#### css问题总结

##### 用css实现瀑布流
利用column-count和break-inside这两个CSS3属性即可

<iframe src="https://codesandbox.io/embed/staging-frog-598uwu?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="css3 瀑布流"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   


##### 有什么不同的方式可以隐藏内容？
> https://www.frontendinterviewhandbook.com/zh/css-questions#有什么不同的方式可以隐藏内容使其仅适用于屏幕阅读器'
> 注意,链接提供的方法中涉及的Metadata格式化规范方法, WAI-ARIA规范和隐藏元素不太相关.

* display: none;：这是最常见的一种隐藏元素的方法。该属性可以完全从页面中删除元素，并在布局中不占用空间。然而，这种方法会将元素完全从文档流中删除，包括任何子元素和事件监听器。

* visibility: hidden;：这种方法与 display: none; 类似，但元素仍会占用布局空间。元素仍保留在文档流中，但对用户不可见，并且不会响应事件。

* opacity: 0;：该属性将元素的不透明度设置为 0，使元素在页面上不可见，但仍会保留在文档流中并响应事件。

* position: absolute;：将元素的 position 属性设置为absolute，可以将其从文档流中移除并相对于其最近的定位祖先进行定位。可以通过将 left 或 top 属性设置为负值来将元素移出视图区域。

* clip-path: polygon(0 0, 0 0, 0 0, 0 0);：该属性可以将元素裁剪成一个多边形，通过将其所有点的坐标设置为相同的值（例如，0），可以将元素完全裁剪并隐藏。

* height: 0; width: 0; overflow: hidden;：该属性将元素的高度和宽度设置为 0，并将其 overflow 属性设置为 hidden，以将其内容隐藏在元素内部。

* transform: scale(0);：该属性将元素缩放为 0，使其在页面上不可见，但仍会保留在文档流中并响应事件。


##### css水平居中,垂直居中, 水平垂直居中

*水平居中*
- 行内元素: `text-align: center`
- 块级元素: `margin: 0 auto`
- position:absolute +left:50%+ transform:translateX(-50%)
- `display:flex + justify-content: center`

*垂直居中*
- 行内元素 line-height
- 块级元素
	- flex
		- `display:flex + align-items: center`
		- display:table+display:table-cell + vertical-align: middle;
	- grid
	- table-cell
	- 定位+translate
		-  position：absolute +top:50%+ transform:translateY(-50%)

**水平垂直居中**
* flex
* absolute+left/top+margin 或者 absolute+left/top+transform
* absolute+(left/right/top/bottom) + margin
* tabel-cell + vertical-align

```css

// flex
display: flex;
justify-content: center;
align-items: center;


// 定位+margin-1
position: absolute;
top: 50%;
left: 50%;
margin-top: -halfOfWidthpx;
margin-left: -halfOfWidthpx;

// 定位+margin-2
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
margin: auto;


//定位+translate
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%)

//父元素 table-cell
display: table-cell
vertical-align: middle;
```


##### 单行文本溢出
```css
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```

##### 多行文本溢出
```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2; // 最多显示几行
-webkit-box-orient: vertical;
```


#### 使用css画一个三角形/圆形/半圆
> https://github.com/Easay/issuesSets/issues/7


##### 三角形


* border
* border+transform
* 伪元素
* linear-gradient
* clip-path
* svg
<iframe src="https://codesandbox.io/embed/san-jiao-xing-3mqln7?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="三角形"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>


**border方式**
```css
div {
	width: 0px;
	height: 0px;
	border-width: 0 40px 40px;
	border-style: solid;
	border-color: transparent transparent green;
}
```

**clip-path方式**
clip-path属性使用裁剪方式创建元素的可显示区域，区域内的部分显示，区域外的隐藏。
```css
#triangle{
	width:100px;
	height:100px;
	background: red;
	clip-path:polygon(0 100%,50% 0,100% 100%);
}
```

##### 圆形/半圆/扇形
```css
.circle {
    border-radius: 50%
}


.container{ //半圆
    width: 100px;
    height: 50px;
    background: red;
    border-radius: 50px 50px 0 0;
}

.container{ //扇形
    width: 50px;
    height: 50px;
    background: red;
    border-radius: 50px 0 0;
}
```


##### inline-block元素间间距问题
> [去除inline-block元素间间距的N种方法 « 张鑫旭-鑫空间-鑫生活 (zhangxinxu.com)](https://www.zhangxinxu.com/wordpress/2012/04/inline-block-space-remove-去除间距/)

- 移除空格
- 使用margin负值
- 使用font-size:0
- letter-spacing
- word-spacing


##### 布局案例
###### 1.左侧固定右侧自适应
**1-1.float方案**
缺点: 初始渲染后,无法自动适应宽高,有空白
<iframe src="https://codesandbox.io/embed/bu-ju-zuo-ce-gu-ding-you-ce-zi-gua-ying-ez6btk?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="布局-左侧固定右侧自适应"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

**1-2.flex方案**
<HTML>
<iframe height="300" style="width:100%;" src="https://codepen.io/westover/embed/MYWbNvO?default-tab=html%2Cresult"></iframe>
</HTML>


###### 2.圣杯布局
**2.1 浮动方案**
<iframe src="https://codesandbox.io/embed/bu-ju-sheng-bei-bu-ju-yt3zf5?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="布局-圣杯布局"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


###### 3.双飞翼布局
**3.1 浮动方案**
<iframe src="https://codesandbox.io/embed/bu-ju-shuang-fei-yi-bu-ju-fnjxv4?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="布局-双飞翼布局"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


##### 单行/多行文本居中
使用line-height实现
<iframe src="https://codesandbox.io/embed/wen-ben-chu-li-wc1nq3?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="文本处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


#### CSS 预处理器 //?

CSS 预处理器的原理: 是将类 CSS 语言通过 **Webpack 编译** 转成浏览器可读的真正 CSS。在这层编译之上，便可以赋予 CSS 更多更强大的功能，常用功能:

- 嵌套
- 变量
- 循环语句
- 条件语句
- 自动前缀
- 单位转换
- mixin 复用

```js
//less
0.嵌套 &代表当前选择器的父级.使用嵌套（nesting）代替层叠或与层叠结合使用

1.变量声明 @+变量名称=值
2.使用变量 
 2.1作为属性值
 2.2作为属性名 @{变量名称}
 2.3作为选择器 #@{变量名称} @{#变量名称}
 2.4


3.循环语句
4.条件语句

5.自动前缀


7.混入mixin
混合（Mixin）是一种将一组属性从一个规则集包含（或混入）到另一个规则集的方法。
```

### 常规问题

##### 初始化CSS原因? 
- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。
- 当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。
- 最简单的初始化方法： `* { padding: 0; margin: 0; }` （强烈不建议）
- 使用 `normalize.css`
##### min-width, max-width,width的包含关系(优先级)是什么?
**属性的含义：**
- `min-width` 限制元素的最小宽度
- `max-width` 限制元素的最大宽度
- `width` 元素的宽度
**三者之间的优先级：**
`min-width` 和 `max-width` 的优先级都高于 `width`。即使 `width` 后面加上 `!important`。
- 当浏览器缩小导致元素宽度小于 `min-width` 时，元素的 `width` 就会被 `min-width` 的值取代，浏览器出现滚动条来容纳元素。
- 当浏览器放大导致元素的宽度大于 `max-width` 时，元素的 `width` 就会被 `max-width` 值取代。
- 当 `min-width` 值大于 `max-width` 时，则以 `min-width` 值为准。
**所以三者优先级排序： min-width > max-width > width**

### 页面中引入CSS文有几种方式

向页面中添加样式表的时候，层叠机制的原理是次序决定优先级。

如果为某个元素应用样式时，有两个或更多特殊性相等的规则相互竞争，则后声明的样式胜出。

* 行内样式
* 内部样式表
* 链接 `<link type="text/css" rel="stylesheet" href="style.css">`
* 导入 `@import url(style.css)`

```css
//行内
<div style="color: green; margin-top: 30px;border: 1px solid red;width: 500px">行内样式实例1</div>

//内部样式表
<style> 
p { color: #6478de; border: red 1px solid; } 
</style>

//链入外部样式
<link type="text/css" rel="stylesheet" href="style.css" >

//导入外部样式
<style> @import "qt_02_style.css"; </style>
```

### link 与 @import 的区别

就结论而言，强烈建议使用`link`标签，慎用`@import`方式。

> https://segmentfault.com/a/1190000015950516

**区别**
* 从属关系: `@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是HTML提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。
* 加载顺序: 加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。
* 兼容性: `@import`是CSS2.1才有的语法，故只可在 IE5+ 才能识别；`link`标签不存在兼容性问题。
* DOM可控性: `@import`不能被DOM控制

### li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

- **场景：**
    - 有时，在写页面的时候，会需要将这个块状元素横排显示，此时就需要将 display 属性设置为 inline-block，此时问题出现了，在两个元素之间会出现大约8px左右的空白间隙。
- **原因：**
    - 浏览器的默认行为是把 inline 元素间的空白字符（空格换行tab）渲染成一个空格，也就是我们上面的代码 `<li>` 换行后会产生换行字符，而它会变成一个空格，当然空格就占用一个字符的宽度。
- **解决：**
    - 给 ul 标签设置 `font-size: 0;` 并为 li 元素重新设置 `font-size: XXpx;`

## Demo

待补充：对比行内样式、内部样式、`link` 和 `@import` 的加载顺序与覆盖关系。
