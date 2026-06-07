# audio、video、字幕、截图与媒体捕获

## 问题

`audio`、`video` 支持哪些能力？预加载、自动播放、字幕、截图、Blob 视频、媒体捕获和移动端兼容怎么回答？

## 结论

`audio` 和 `video` 是 HTML 媒体元素，常见属性包括 `controls`、`preload`、`autoplay`、`muted`、`loop`、`poster`、`playsinline`。浏览器通常会阻止带声音的自动播放；移动端想自动播放背景视频，常见条件是 `muted autoplay playsinline`，但仍要接受浏览器策略限制。

`preload` 是提示，不是强制：

| 值 | 含义 |
| --- | --- |
| `none` | 不预加载 |
| `metadata` | 只预加载元数据 |
| `auto` | 浏览器可自行决定预加载更多内容 |

字幕用 `<track>` 引入 WebVTT：

```html
<video controls src="/lesson.mp4">
  <track
    kind="captions"
    src="/lesson.zh.vtt"
    srclang="zh"
    label="中文字幕"
    default
  >
</video>
```

`Blob` 视频一般来自文件选择、MediaRecorder、接口返回或对象存储下载后的二进制数据，再通过 `URL.createObjectURL(blob)` 给 `video.src`。

## Demo

移动端背景视频：

```html
<video
  src="/intro.mp4"
  poster="/intro-poster.jpg"
  autoplay
  muted
  loop
  playsinline
></video>
```

视频截图：

```js
function captureVideoFrame(video) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext('2d').drawImage(video, 0, 0);
  return canvas.toDataURL('image/png');
}
```

如果视频资源跨源且没有 CORS 授权，截图导出会遇到 tainted canvas 问题。

媒体捕获：

```js
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: { facingMode: 'environment' }
});

video.srcObject = stream;
```

移动端补充：

- Android 是否能同时播放两个音频，取决于浏览器、系统策略和用户手势，不应承诺所有机型都支持。
- 微信或旧 X5 内核中的私有属性属于特定运行环境兼容问题，现代答案应优先讲标准属性，再说明私有属性要以目标容器实测为准。
- `poster` 铺满视频区域通常靠 CSS：`video { object-fit: cover; }`，但 poster 本身的裁剪和视频显示区域仍取决于视频元素尺寸。
- 隐藏原生控制栏或全屏按钮在不同浏览器支持不一致，业务上更稳的是不用 `controls`，自定义控制层，并处理键盘和可访问性。

面试回答：

> `video` 的自动播放受浏览器策略限制，通常静音、内联播放才更可能成功；`preload` 只是提示。字幕用 WebVTT 和 `track`。视频截图本质是把当前帧 `drawImage` 到 Canvas，再导出图片，但跨域视频会污染 Canvas。媒体捕获用 `getUserMedia`，需要 HTTPS 和用户授权。

## 参考来源

- [MDN: `<video>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video)
- [MDN: WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
- [MDN: MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
