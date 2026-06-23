# transform、transition 与 animation 的区别

## 问题

`transform` 和 `animation` 有什么区别？`transition` 和 `animation` 又该怎么选？

## 结论

### 理解路径

先分清职责：`transform` 描述「形变结果」（静态状态），`transition` / `animation` 描述「如何过渡到这个状态」（驱动方式）。`transition` 需要状态触发、只有起止两端；`animation` 用关键帧可多段、自动播放、循环。

### `transform` 是什么？

`transform` 描述元素的形变：`translate`、`scale`、`rotate`、`skew`。它本身不产生动画，只是把元素变换到某个状态。关键优势是 `transform`（和 `opacity`）通常只在合成阶段处理，不触发重排，动画性能好。

```css
.box {
  transform: translateX(100px) scale(1.2);
}
```

### `transition` 怎么用？

`transition` 在属性值发生变化时自动补间，产生过渡。它需要一个「触发」（如 `:hover`、切换类名），且只有起止两个状态。

```css
.box {
  transition: transform 0.3s ease;
}

.box:hover {
  transform: scale(1.1);
}
```

### `animation` 怎么用？

`animation` 配合 `@keyframes` 定义多个关键帧，可以自动播放、循环、分多段，不需要外部状态触发。

```css
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.box {
  animation: pulse 1s ease-in-out infinite;
}
```

### 三者区别速查

| 维度 | `transform` | `transition` | `animation` |
| --- | --- | --- | --- |
| 作用 | 描述形变结果（静态） | 属性变化的补间过渡 | 关键帧驱动的动画 |
| 是否需要触发 | 不涉及 | 需要状态变化触发 | 可自动播放 |
| 中间状态 | 无 | 只有起止两端 | 可定义多个关键帧 |
| 循环 | 不涉及 | 不能 | 可 `infinite` 循环 |
| 典型场景 | 位移、缩放、旋转 | hover、显隐过渡 | 加载动画、循环动效 |

所以「`transform` vs `animation`」严格说不在同一层面：`transform` 是被动画的「属性」，`transition` / `animation` 是「驱动方式」。最常见的组合，是用 `transition` / `animation` 去驱动 `transform` 和 `opacity`，获得高性能动画。

### 为什么动画优先用 `transform` 和 `opacity`？

浏览器渲染分 layout → paint → composite。修改 `width`、`top` 等会触发重排重绘；修改 `transform`、`opacity` 通常只在合成阶段处理，可由 GPU 加速，更流畅。能用 `transform` 表达的位移，就不要用 `margin` / `top` 做动画。

### 对 requestAnimationFrame 的理解

`requestAnimationFrame` 是浏览器提供的专门用于请求动画帧的 API，告诉浏览器在下次重绘之前调用指定回调更新动画。

**语法：**

```js
const id = window.requestAnimationFrame(callback)
// callback 会被传入 DOMHighResTimeStamp 参数，表示当前帧的时间戳

// 取消动画
window.cancelAnimationFrame(id)
```

**相比 `setTimeout` 实现动画的优势：**

- **CPU 节能**：页面不可见（隐藏/最小化）时，浏览器会暂停 `requestAnimationFrame` 的回调，避免无意义渲染；`setTimeout` 会继续执行。
- **帧率同步**：回调执行时机与浏览器刷新频率（通常 60fps/16.7ms）对齐，不会在同一帧触发多次，也不会丢帧；`setTimeout` 的固定间隔和屏幕刷新不同步，容易卡顿。
- **集中 DOM 操作**：每帧内所有回调集中处理，减少强制回流次数。

**属于宏任务**，会在微任务执行完成后再执行。

## 参考来源

- [MDN: transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)
- [MDN: transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)
- [MDN: animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
- [web.dev: Animations and performance](https://web.dev/articles/animations-guide)
