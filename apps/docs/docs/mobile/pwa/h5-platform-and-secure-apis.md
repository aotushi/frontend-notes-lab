# H5 平台能力、PWA 与安全上下文

## 问题

为什么说 H5 是开放平台？哪些 H5 能力需要 HTTPS？Service Worker、SharedWorker、Application Cache、录屏、电子签名怎么回答？

## 结论

H5 可以理解为浏览器提供的一组开放平台能力：语义化 HTML、CSS 布局、JavaScript、媒体、Canvas/SVG/WebGL、存储、网络、Worker、设备能力、PWA、可访问性和安全模型。

很多现代能力只在安全上下文中可用，通常要求 HTTPS 或 localhost：

- Service Worker / PWA 离线缓存
- Geolocation
- Clipboard
- MediaDevices / 摄像头麦克风
- Device Orientation / Motion
- Web Bluetooth / USB / Serial 等设备 API
- 部分存储、权限和传感器能力

Application Cache 已废弃，不应作为新项目方案。离线能力应使用 Service Worker + Cache API。SharedWorker 可以让同源多个页面共享一个 worker 上下文，适合多标签页共享连接、协调状态等，但兼容和生命周期要实测。

## Demo

注册 Service Worker：

```js
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('/sw.js');
}
```

电子签名通常用 Canvas 记录 pointer 轨迹：

```js
canvas.addEventListener('pointermove', (event) => {
  if (event.buttons !== 1) return;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
});
```

录屏可以用 Screen Capture API 和 MediaRecorder：

```js
const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
const recorder = new MediaRecorder(stream);
const chunks = [];

recorder.ondataavailable = (event) => chunks.push(event.data);
recorder.start();
```

iOS WebApp 全屏通常依赖 PWA 添加到主屏幕，以及相关 Apple meta 标签；浏览器地址栏不能被普通网页强制隐藏，只能由用户滚动、PWA 模式或容器控制。

面试回答：

> H5 是浏览器开放能力集合，不只是几个标签。现代 H5 能力很多要求安全上下文，例如 Service Worker、摄像头麦克风、定位、剪贴板和传感器。Application Cache 已废弃，离线用 Service Worker。电子签名适合 Canvas，录屏用 `getDisplayMedia` 和 `MediaRecorder`，但要 HTTPS、权限和兼容性兜底。

## 参考来源

- [MDN: Secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN: MediaDevices.getDisplayMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
