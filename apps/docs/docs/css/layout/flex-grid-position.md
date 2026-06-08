# Flex、Grid 与定位布局

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- 元素竖向的百分比设定是相对于父容器的高度吗
- px、rem和em的区别
- flex弹性布局
- Grid布局
- position
- css问题总结
- 使用css画一个三角形/圆形/半圆
- CSS 预处理器 //?

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### 元素竖向的百分比设定是相对于父容器的高度吗

- 对于 height 属性来说是的。
- 对于 **margin-top/bottom(padding-top/bottom) 来讲不是**，而是**相对于容器的宽度**计算的

### px、rem和em的区别

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

### flex弹性布局

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

### Grid布局

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

### position

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

### css问题总结

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

### 使用css画一个三角形/圆形/半圆

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

### CSS 预处理器 //?

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

## Demo

待补充：展示 Flex 居中、Grid 三列布局、`absolute` 定位参照元素、左侧固定右侧自适应布局。

## 滚动后导航固定顶部

现代实现优先使用 `position: sticky`，不需要 JavaScript 监听滚动：

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}
```

它会在元素正常流动到指定位置后固定在视口顶部。需要注意父元素不能有不合适的 `overflow` 约束，否则 sticky 可能不生效。

如果需求是“滚动超过某个高度后改变样式”，可以用 `IntersectionObserver` 或滚动监听切换 class，但要节流并避免频繁触发布局。

## containing block 与文档流顺序

`position: absolute` 的包含块通常由最近的非 `static` 定位祖先、包含块相关属性或初始包含块决定；正常流元素的布局则按父容器内容盒和文档流规则参与排版。回答时不要只说“相对父元素”，因为如果父元素没有建立包含块，绝对定位元素会继续向祖先查找。

CSS 中会影响视觉顺序但不改变 DOM 读取顺序的典型属性包括 `order`、`flex-direction: row-reverse`、`grid` 布局位置、`position` 等。屏幕阅读器和键盘焦点顺序通常仍更接近 DOM 顺序，所以不要用 CSS 视觉重排来表达真实内容顺序。
