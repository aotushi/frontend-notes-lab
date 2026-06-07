# Canvas 基础、绘制与内存

## 问题

Canvas 能做什么？如何画矩形、渐变、椭圆、棋盘、印章？`lineTo()`、`closePath()`、`arc()`、宽高和内存怎么回答？

## 结论

Canvas 是位图绘图表面，适合游戏、图表、签名板、海报生成、图像处理、粒子动画等大量自绘场景。它不是 DOM，也没有原生语义结构，不能替代大部分 HTML 内容。

基础规则：

- `canvas.width`、`canvas.height` 是画布像素尺寸，只能是数字，不带单位。
- CSS `width/height` 是显示尺寸。两者不一致会缩放，可能导致模糊或变形。
- 默认画布尺寸是 `300 x 150`。
- 2D Canvas 是位图；内存大约为 `width * height * 4` 字节。
- `lineTo()` 是从当前点画线到目标点；`closePath()` 是闭合当前子路径。
- `arc()` 画圆弧时角度用弧度，路径方向和起点会影响连接线。

## Demo

高 DPR 下避免模糊：

```html
<canvas id="board" style="width: 300px; height: 150px;"></canvas>
```

```js
const rect = board.getBoundingClientRect();
const dpr = window.devicePixelRatio || 1;
const ctx = board.getContext('2d');

board.width = Math.round(rect.width * dpr);
board.height = Math.round(rect.height * dpr);
ctx.scale(dpr, dpr);

const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
gradient.addColorStop(0, '#2f80ed');
gradient.addColorStop(1, '#27ae60');

ctx.fillStyle = gradient;
ctx.fillRect(20, 20, 180, 70);

ctx.beginPath();
ctx.ellipse(220, 55, 48, 28, 0, 0, Math.PI * 2);
ctx.stroke();
```

棋盘绘制核心：

```js
function drawGrid(ctx, size, rows, cols) {
  ctx.beginPath();

  for (let row = 0; row <= rows; row++) {
    ctx.moveTo(0, row * size);
    ctx.lineTo(cols * size, row * size);
  }

  for (let col = 0; col <= cols; col++) {
    ctx.moveTo(col * size, 0);
    ctx.lineTo(col * size, rows * size);
  }

  ctx.stroke();
}
```

面试回答：

> Canvas 是位图画布，适合大量自绘和像素处理。`width/height` 属性决定真实像素尺寸，不能带单位；CSS 尺寸只影响显示。默认尺寸是 300x150，内存按像素乘以 4 字节估算。高 DPR 下要放大画布像素并 `scale`，否则图像和文字容易糊。

## 参考来源

- [MDN: `<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
- [MDN: CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
- [MDN: Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
