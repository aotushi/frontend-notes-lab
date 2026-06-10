# position 定位

## 问题

- position
- 滚动后导航固定顶部
- containing block 与文档流顺序

## 结论

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

## Demo

待补充。

## 参考来源

待补充。
