# 瀑布流、居中和经典布局案例

## 问题

- 瀑布流、居中和经典布局案例

## 结论

### css问题总结

##### 用css实现瀑布流
利用column-count和break-inside这两个CSS3属性即可

<iframe src="https://codesandbox.io/embed/staging-frog-598uwu?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="css3 瀑布流"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   



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


## Demo

待补充。

## 参考来源

待补充。
