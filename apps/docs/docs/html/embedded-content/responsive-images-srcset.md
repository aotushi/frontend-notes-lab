# `img srcset` 和 `sizes` 如何选择响应式图片？

## 问题

`<img>` 的 `srcset` 和 `sizes` 分别解决什么问题？浏览器到底如何选择要下载的图片？

## 结论

- **`srcset` 提供候选资源**：每个图片地址后面的描述符说明它适合的像素密度，或者说明文件本身的固有宽度。
- **`sizes` 描述预计显示宽度**：它告诉浏览器图片在当前布局中会占据多宽的槽位，不会像 CSS 一样直接设置图片宽度。
- **浏览器负责最终选择**：浏览器会结合槽位宽度、设备像素比（DPR，即一个 CSS 像素对应多少设备像素）、缓存和网络状态选择资源，因此不能把选图过程理解成固定的 `if/else`。

`srcset` 的两类描述符不能混用：

| 描述符 | 适合场景 | 与 `sizes` 的关系 | 示例 |
| --- | --- | --- | --- |
| `1x`、`2x` 密度描述符 | 显示尺寸固定的图标、头像 | 不使用 `sizes` | `avatar.png 1x, avatar@2x.png 2x` |
| `400w`、`800w` 宽度描述符 | 宽度随布局变化的内容图、封面图 | 应准确填写 `sizes` | `hero-400.jpg 400w, hero-800.jpg 800w` |

当 `srcset` 使用 `w` 描述符时，浏览器的选择过程是：

1. 从左到右检查 `sizes`，采用第一个命中的媒体条件；最后一项通常不写条件，作为默认值。
2. 根据命中的值，得到图片预计占据的槽位宽度。
3. 将槽位宽度与 DPR 结合，估算需要的图片像素宽度。
4. 从 `srcset` 中选择合适的候选资源。浏览器可以根据缓存、网络等情况调整选择，开发者不能保证它一定下载某个文件。

实例中会同时出现三种“宽度”，需要先区分：

| 写法 | 属于哪里 | 表示什么 |
| --- | --- | --- |
| `width="1280"` | `<img>` 的 HTML 属性 | 图片的固有宽度是 1280 像素；HTML 尺寸属性只写整数，不带 `px` |
| `hero-480.jpg 480w` | `srcset` 的候选资源 | `hero-480.jpg` 文件自身宽 480 像素；`w` 是宽度描述符，不是 CSS 单位 |
| `100vw`、`50vw`、`640px` | `sizes` 的槽位宽度 | 图片在对应页面布局中预计显示多宽 |

`width="1280"` 不负责选择 `1280w` 图片，也不代表图片最终一定显示为 `1280px` 宽。它与 `height="720"` 一起声明最大候选图的固有尺寸和 `16:9` 比例，让浏览器在图片下载前预留空间；最终显示宽度由 CSS 决定。

下面的完整实例把布局分为三档，并让 CSS 与 `sizes` 一一对应：

- 视口不超过 `600px`：图片宽度为 `100vw`，即整个视口宽度。
- 视口在 `601px`～`1024px`：图片宽度为 `50vw`，即视口宽度的一半。
- 视口超过 `1024px`：图片固定显示为 `640px` 宽。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>响应式图片实例</title>

    <style>
      body {
        margin: 0;
      }

      .hero {
        display: block;
        width: 640px;
        max-width: 640px;
        height: auto;
      }

      /* 平板：图片占视口宽度的一半 */
      @media (max-width: 1024px) {
        .hero {
          width: 50vw;
        }
      }

      /* 手机：这条规则写在后面，覆盖上面的 50vw */
      @media (max-width: 600px) {
        .hero {
          width: 100vw;
        }
      }
    </style>
  </head>

  <body>
    <main>
      <!--
        480w、800w、1280w 分别是三个图片文件的真实宽度，
        不是显示宽度，也不是屏幕断点。
      -->
      <img
        class="hero"
        src="/images/hero-800.jpg"
        srcset="
          /images/hero-480.jpg 480w,
          /images/hero-800.jpg 800w,
          /images/hero-1280.jpg 1280w
        "
        sizes="
          (max-width: 600px) 100vw,
          (max-width: 1024px) 50vw,
          640px
        "
        alt="产品数据仪表盘"
        width="1280"
        height="720"
      >
    </main>
  </body>
</html>
```

`sizes` 是**从左到右匹配，命中后停止**。最后的 `640px` 没有条件，负责覆盖前面条件都不成立的屏幕：

| 当前环境 | `sizes` 得到的槽位宽度 | 结合 DPR 后的需求 | 浏览器可能选择 |
| --- | --- | --- | --- |
| `390px` 宽手机，DPR 为 `1` | `100vw = 390px` | 约 `390px` | `480w` |
| `800px` 宽平板，DPR 为 `2` | `50vw = 400px` | 约 `800px` | `800w` |
| `1440px` 宽桌面，DPR 为 `2` | 默认值 `640px` | 约 `1280px` | `1280w` |

因此，`sizes` 先回答“页面准备把图片显示多宽”，`srcset` 再回答“有哪些文件可供浏览器选择”。`480w` 不表示“视口为 480px 时使用”，浏览器也不要求槽位宽度必须与候选文件宽度完全相等。

还需要注意：

- `480w`、`800w`、`1280w` 必须与对应图片文件的真实固有宽度一致，同一个 `srcset` 不能混用 `w` 与 `x` 描述符。
- 使用 `x` 描述符时，`src` 如果存在，会作为 `1x` 候选；使用 `w` 描述符时，现代浏览器不会把 `src` 纳入候选。语法只要求 `src` 和 `srcset` 至少存在一个，但实际项目通常仍保留 `src` 作为回退。
- 使用 `w` 描述符却省略 `sizes` 时，默认值是 `100vw`。如果图片实际只占半栏，浏览器可能高估所需宽度。
- 延迟加载的图片可以使用 `sizes="auto, 100vw"`，让浏览器在布局信息可用后根据实际宽度选图；`auto` 只适用于设置了 `loading="lazy"` 的图片，后面的值用于兼容不支持该特性的浏览器。
- `srcset/sizes` 解决的是**同一内容、不同分辨率**的资源选择。需要切换裁剪、构图或 AVIF/WebP/JPEG 格式时，使用 [`<picture>` 和 `<source>`](/html/media-canvas-svg/images-picture-and-image-map)。

## 参考来源

- [MDN：使用 HTML 创建响应式图片](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [MDN：`img` 元素的 `sizes`、`src` 和 `srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#attributes)
- [WHATWG HTML：Responsive images](https://html.spec.whatwg.org/multipage/images.html#responsive-images)
- [web.dev：Descriptive syntaxes](https://web.dev/learn/images/descriptive/)
