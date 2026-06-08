# 图片、picture、srcset 与热区

## 问题

HTML 图像相关标签有哪些？`img`、`picture`、`srcset`、`sizes`、图片热区、`alt` 和 `title` 应该怎么回答？

## 结论

图像相关能力可以按用途分：

| 用途 | 常见标签或属性 |
| --- | --- |
| 基础图片 | `<img src alt width height>` |
| 响应式图片 | `srcset`、`sizes`、`<picture>`、`<source>` |
| 艺术方向切换 | `<picture>` 根据媒体条件切换不同裁剪或格式 |
| 图片热区 | `<map>`、`<area>`、`img[usemap]` |
| 矢量图 | inline `<svg>`、`<img src="icon.svg">` |
| 可访问文本 | `alt` 提供替代文本，`title` 只提供补充提示 |

`alt` 和 `title` 不是一回事。`alt` 是图片不可见或辅助技术读取时的替代文本；`title` 是额外提示，不可靠，也不能替代可访问名称。装饰性图片应使用空 `alt=""`。

`picture` 适合根据格式、裁剪、媒体条件换图；如果只是不同 DPR 或宽度的同一张图，用 `img srcset sizes` 就够。

## Demo

```html
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img
    src="/hero.jpg"
    srcset="/hero-640.jpg 640w, /hero-1280.jpg 1280w"
    sizes="(max-width: 720px) 100vw, 720px"
    alt="产品仪表盘截图"
    width="720"
    height="405"
  >
</picture>
```

图片加载失败时，不要在 `error` 事件里反复设置同一个坏地址；先清理回调，再换默认图：

```html
<img src="/user-avatar.png" alt="用户头像" id="avatar">

<script>
  avatar.addEventListener('error', () => {
    avatar.onerror = null;
    avatar.src = '/avatar-fallback.png';
  }, { once: true });
</script>
```

图片热区：

```html
<img src="/floor-map.png" alt="展厅平面图" usemap="#floor">

<map name="floor">
  <area shape="circle" coords="120,90,40" href="/booth/a" alt="A 展位">
  <area shape="rect" coords="200,40,320,140" href="/booth/b" alt="B 展位">
</map>
```

面试回答：

> 图片题要区分 `img`、`picture`、`srcset/sizes` 和热区。`srcset/sizes` 让浏览器按视口和 DPR 选择资源；`picture` 适合格式回退和艺术方向切换；`alt` 是替代文本，`title` 只是补充提示。图片热区用 `map/area/usemap`，但现代交互图通常更倾向 SVG 或 Canvas。

## 参考来源

- [MDN: Responsive images](https://developer.mozilla.org/docs/Web/HTML/Guides/Responsive_images)
- [MDN: `<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
- [MDN: `<map>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map)
