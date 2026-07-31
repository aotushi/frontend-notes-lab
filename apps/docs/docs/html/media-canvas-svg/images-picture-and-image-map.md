# 图片、picture、srcset 与热区

## 问题

HTML 中与图片有关的元素和属性分别解决什么问题？`img`、`picture`、`srcset`、`sizes`、图片热区、`alt` 和 `title` 应该如何使用？

## 结论

图片能力应先按用途区分：

| 需求 | 使用方式 | 核心作用 |
| --- | --- | --- |
| 嵌入一张图片 | `<img>` | 提供图片地址、替代文本和固有尺寸 |
| 给图片添加说明 | `<figure>`、`<figcaption>` | 将图片与标题或说明组织成一个完整内容单元 |
| 同一内容选择合适尺寸 | `img[srcset][sizes]` | 让浏览器按布局宽度和设备像素比选择候选资源 |
| 切换格式或构图 | `<picture>`、`<source>`、`<img>` | 按来源顺序选择支持的格式或符合媒体条件的图片 |
| 创建可点击区域 | `<map>`、`<area>`、`img[usemap]` | 在一张图片上定义多个链接热区 |
| 显示矢量图 | `<img src="icon.svg">` 或内联 `<svg>` | 前者把 SVG 当图片使用，后者允许操作内部图形 |

### `img`、`srcset` 和 `sizes`

`srcset` 列出候选图片，`sizes` 描述图片在当前布局中的预计显示宽度：

- `hero-640.jpg 640w` 中的 `640w` 表示该文件的固有宽度是 640 像素，不是 CSS 宽度。
- `sizes="(max-width: 640px) 100vw, 960px"` 从左向右匹配：视口不超过 640px 时，图片槽位约为整个视口宽度；否则约为 960px。
- 浏览器根据槽位宽度、设备像素比 DPR、可用候选资源等信息选择图片，结果不应被理解为固定的 JavaScript `if/else`。
- 同一个 `srcset` 不能混用 `640w` 这类宽度描述符和 `2x` 这类像素密度描述符。宽度描述符通常需要配合 `sizes`；密度描述符适合显示尺寸固定的头像、图标等图片。

完整的候选选择过程可参考 [`img srcset` 和 `sizes` 如何选择响应式图片？](/html/embedded-content/responsive-images-srcset)。

### `picture` 和 `source` 的选择顺序

`picture` 用于切换图片格式或构图，不负责显示图片本身。浏览器按文档顺序检查每个 `<source>`：

1. 检查 `media` 条件是否匹配、`type` 格式是否支持。
2. 采用第一个可用的 `<source>`。
3. 如果该来源有多个 `srcset` 候选，再结合 `sizes` 和 DPR 选择其中一个。
4. 没有可用的 `<source>` 时，回退到必需的 `<img>`。

因此来源顺序很重要，通常将更希望采用的 AVIF 放在 WebP 和 JPEG 前面。每个格式都应提供自己的完整候选列表；不能只给 AVIF 一个地址，却只在 JPEG 回退中提供不同宽度。

### `alt`、`title`、`width` 和 `height`

- **信息图片：** `alt` 简洁表达图片传递的信息，不写“图片”“照片”等无意义前缀。
- **功能图片：** 图片位于链接或按钮中时，`alt` 描述操作或目标，例如“搜索”“返回首页”。
- **装饰图片：** 使用 `alt=""`，使辅助技术忽略它；不要直接省略 `alt`。
- **复杂图片：** `alt` 提供简短概括，并在图片附近提供图表数据或详细说明。
- **`title`：** 只能作为额外提示，不能替代 `alt` 或其他可访问名称，也不应简单重复 `alt`。
- **`width` 和 `height`：** 填写图片的固有像素尺寸，值不带 `px`。浏览器可以据此提前确定宽高比并预留空间，最终显示大小仍可由 CSS 调整。

首屏关键图片不应使用 `loading="lazy"`；确认它是页面主要图片时，可以考虑 `fetchpriority="high"`。非首屏图片通常可以使用 `loading="lazy"`，并同样提供 `width` 和 `height`。

### 图片热区

客户端图片热区由三部分组成：

- `img[usemap="#floor-map"]` 通过井号引用图片地图。
- `<map name="floor-map">` 的 `name` 必须与 `usemap` 对应。
- 有 `href` 的 `<area>` 是链接，必须使用 `alt` 说明链接目的。

`shape` 和 `coords` 共同定义区域：

| `shape` | `coords` 含义 |
| --- | --- |
| `rect` | `x1,y1,x2,y2`，矩形左上角和右下角 |
| `circle` | `x,y,r`，圆心和半径 |
| `poly` | `x1,y1,x2,y2,...`，按顺序组成多边形的顶点 |
| `default` | 图片中未被其他热区覆盖的区域，不写 `coords` |

热区适合结构简单、位置固定的平面图或示意图。复杂或需要精细响应式交互的图形通常更适合 SVG，因为 SVG 保留 DOM 结构，其中的链接可以获得可访问名称和键盘焦点。无论采用哪种图形方案，重要入口都应同时提供普通文本链接；Canvas 没有原生的图形语义，不能直接作为可访问图片热区的等价替代。

下面的完整页面把这些规则放在同一个实例中：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>产品与展厅介绍</title>
  <style>
    /* CSS 决定最终尺寸；HTML 的 width、height 提供固有宽高比。 */
    img {
      display: block;
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <main>
    <h1>产品介绍</h1>

    <figure>
      <picture>
        <!-- 按顺序检查格式；每种格式都有完整的宽度候选。 -->
        <source
          type="image/avif"
          srcset="/images/dashboard-640.avif 640w,
                  /images/dashboard-960.avif 960w,
                  /images/dashboard-1280.avif 1280w"
          sizes="(max-width: 640px) 100vw, (max-width: 960px) 80vw, 960px"
        >
        <source
          type="image/webp"
          srcset="/images/dashboard-640.webp 640w,
                  /images/dashboard-960.webp 960w,
                  /images/dashboard-1280.webp 1280w"
          sizes="(max-width: 640px) 100vw, (max-width: 960px) 80vw, 960px"
        >

        <!-- img 提供 JPEG 回退、替代文本和无单位的固有宽高。 -->
        <img
          src="/images/dashboard-960.jpg"
          srcset="/images/dashboard-640.jpg 640w,
                  /images/dashboard-960.jpg 960w,
                  /images/dashboard-1280.jpg 1280w"
          sizes="(max-width: 640px) 100vw, (max-width: 960px) 80vw, 960px"
          alt="数据仪表盘展示本月销售额、订单量和转化率"
          width="1280"
          height="720"
          fetchpriority="high"
        >
      </picture>
      <figcaption>产品仪表盘概览</figcaption>
    </figure>

    <section aria-labelledby="floor-heading">
      <h2 id="floor-heading">展厅导览</h2>
      <!-- usemap 的 #floor-map 必须对应 map 的 name。 -->
      <img
        src="/images/floor-map.png"
        alt="展厅平面图：入口左侧是 A 展位，右侧是 B 展位"
        usemap="#floor-map"
        width="800"
        height="450"
        loading="lazy"
      >
      <map id="floor-map" name="floor-map">
        <!-- circle：圆心 x=160、y=180，半径 r=70。 -->
        <area
          shape="circle"
          coords="160,180,70"
          href="/booths/a"
          alt="前往 A 展位：前端开发"
        >
        <!-- rect：左上角 (430,100)，右下角 (700,300)。 -->
        <area
          shape="rect"
          coords="430,100,700,300"
          href="/booths/b"
          alt="前往 B 展位：数据可视化"
        >
      </map>
      <!-- 为触屏、键盘和辅助技术用户提供等价的普通链接。 -->
      <ul>
        <li><a href="/booths/a">A 展位：前端开发</a></li>
        <li><a href="/booths/b">B 展位：数据可视化</a></li>
      </ul>
    </section>
  </main>
</body>
</html>
```

## 参考来源

- [MDN: `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img)
- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [MDN: `<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture)
- [MDN: `<area>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area)
- [WHATWG: Image maps](https://html.spec.whatwg.org/multipage/image-maps.html)
- [W3C WAI: `alt` decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [W3C WAI: Image Maps](https://www.w3.org/WAI/tutorials/images/imagemap/)
