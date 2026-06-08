# 触摸、软键盘、滚动穿透与设备传感器

## 问题

移动端点击 300ms 延迟、滚动穿透、软键盘遮挡、左右滑动、长按复制、摇一摇和陀螺仪怎么处理？

## 结论

现代移动端交互优先使用 Pointer Events 和 CSS `touch-action` 表达意图。旧资料里常见的 FastClick 已经不是现代首选。

常见问题：

| 场景 | 处理思路 |
| --- | --- |
| 300ms 点击延迟 | 正确 viewport、`touch-action: manipulation`，现代浏览器基本已消失 |
| 滚动穿透 | 弹层打开时锁 body 滚动，弹层内部独立滚动 |
| 软键盘遮挡输入框 | 聚焦后滚动到可视区，使用 `visualViewport` 监听可视高度变化 |
| 禁止左右滑动 | 对局部区域设置 `touch-action`，谨慎阻止默认行为 |
| 长按复制 | CSS `user-select: none` 只能提高成本，不应阻止正常可访问操作 |
| iOS 首字母大写 | `autocapitalize="off"` |
| 电话自动识别 | 用 meta 控制，或明确用 `tel:` 链接 |
| 橡皮筋效果 | 局部滚动容器、`overscroll-behavior`，iOS 下仍需实测 |

设备方向、陀螺仪、摇一摇依赖 Device Orientation / Device Motion API。现代浏览器通常要求 HTTPS、用户手势和权限授权，iOS 还需要显式调用权限请求。

## Demo

```css
.tap-target {
  touch-action: manipulation;
  min-height: 44px;
}

.modal-open {
  overflow: hidden;
}

.no-select {
  user-select: none;
  -webkit-user-select: none;
}
```

```html
<input autocapitalize="off" autocomplete="username">
<a href="tel:13800138000">13800138000</a>
```

```js
async function enableMotion() {
  if (typeof DeviceMotionEvent?.requestPermission === 'function') {
    const state = await DeviceMotionEvent.requestPermission();
    if (state !== 'granted') return;
  }

  window.addEventListener('devicemotion', (event) => {
    const acc = event.accelerationIncludingGravity;
    // 根据 acc.x / acc.y / acc.z 判断摇动强度。
  });
}
```

面试回答：

> 移动端交互要优先用标准能力：Pointer Events、`touch-action`、`visualViewport`、`overscroll-behavior`。300ms 延迟在现代浏览器基本由正确 viewport 和 `touch-action` 解决；滚动穿透要锁 body 并让弹层内部滚；软键盘遮挡要根据可视区变化滚动目标输入框。陀螺仪和摇一摇需要 HTTPS、权限和真机测试。

## 参考来源

- [MDN: Pointer events](https://developer.mozilla.org/docs/Web/API/Pointer_events)
- [MDN: `touch-action`](https://developer.mozilla.org/docs/Web/CSS/touch-action)
- [MDN: Detecting device orientation](https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Detecting_device_orientation)
