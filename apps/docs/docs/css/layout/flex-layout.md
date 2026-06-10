# flex 弹性布局

## 问题

- flex弹性布局

## 结论

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

## Demo

待补充。

## 参考来源

待补充。
