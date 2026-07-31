# `meta viewport` 有什么作用？

## 问题

为什么移动端页面通常要写 `<meta name="viewport" content="width=device-width, initial-scale=1">`？它设置的是哪个视口？布局视口、视觉视口、理想视口分别是什么？不同尺寸 API 测量的又是哪一层？

## 结论

`meta viewport` 是移动端页面的视口声明。它主要告诉移动端浏览器：不要继续使用兼容旧桌面网页的宽布局视口再缩小整页，而要按设备屏幕在 `100%` 缩放下对应的 CSS 像素宽度建立布局视口。

普通响应式页面使用下面这条声明即可：

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

- `width=device-width`：让布局视口宽度对齐设备屏幕对应的 CSS 像素宽度。
- `initial-scale=1`：页面首次打开时使用 `100%` 初始缩放比例。
- 它只建立正确的移动端布局基准，不会自动修复固定宽度、图片体积、字号、断点或安全区问题。

### 理解路径

1. 早期移动浏览器为了兼容桌面网页，可能先用约 `980px` 的宽视口排版，再把整页缩小到手机屏幕。
2. `width=device-width` 让布局视口改用设备屏幕对应的 CSS 像素宽度。
3. `initial-scale=1` 让页面首次显示时不额外放大或缩小。
4. CSS 根据布局视口排版；用户缩放或软键盘出现后，当前真正可见的是视觉视口。

### CSS 像素、DPR 和 `device-width`

下面三个量描述的是不同层次：

| 名称 | 浏览器中的对应项 | 含义 |
| --- | --- | --- |
| 设备物理像素 | 没有稳定、通用的直接读数 | 屏幕硬件实际拥有的像素数量，不等于 CSS 布局宽度 |
| DPR | `window.devicePixelRatio` | 当前显示环境中设备像素与 CSS 像素之间的比例 |
| 屏幕的 CSS 像素尺寸 | `screen.width / screen.height` | 浏览器以 CSS 像素表示的屏幕尺寸 |

例如，一块横向拥有 `1170` 个物理像素、DPR 为 `3` 的手机屏幕，可以直观理解为约 `390 CSS px`。这是帮助理解的近似模型，不应反过来用 `screen.width × DPR` 推断所有设备的硬件规格：桌面页面缩放、系统缩放和外接屏切换都可能改变浏览器报告的 DPR。

`device-width` 不是物理像素，也不是 JavaScript 变量。它是 `meta viewport` 的特殊值，表示设备屏幕在当前环境中对应的 CSS 像素宽度。设置后，常规移动页面的布局视口宽度通常会接近这一宽度。

```txt
设备物理像素宽度 / DPR ≈ 屏幕的 CSS 像素宽度
                                   ↓
                         width=device-width
                                   ↓
                         用这个宽度建立布局视口
```

### 布局视口、视觉视口与理想视口

| 视口 | 是什么 | 常用读数 | 什么时候变化 |
| --- | --- | --- | --- |
| 布局视口 layout viewport | 浏览器计算 CSS 布局时使用的区域；媒体查询、`vw` 和大多数页面排版依赖它 | `document.documentElement.clientWidth / clientHeight` | 浏览器窗口、设备方向或布局视口策略变化时 |
| 视觉视口 visual viewport | 用户当前真正看见的布局视口区域，不大于布局视口 | `window.visualViewport?.width / height / scale` | 双指缩放、软键盘和浏览器动态界面出现时 |
| 理想视口 ideal viewport | 移动端教学中对“设备在 `100%` 缩放下适合排版的 CSS 像素宽度”的称呼，不是独立 DOM 对象 | `device-width` 用来让布局视口对齐它 | 主要由设备和显示环境决定 |

未缩放时，布局视口与视觉视口通常大小相近；双指放大或软键盘弹出后，布局视口可以保持不变，视觉视口则会缩小。MDN 将视觉视口定义为布局视口中当前可见的部分。

### 参数分别影响什么？

| 参数 | 影响对象 | 建议 | 说明 |
| --- | --- | --- | --- |
| `width=device-width` | 布局视口宽度 | 推荐 | 移动端响应式页面的基础 |
| `initial-scale=1` | 初始缩放 | 推荐 | 页面首次显示时不额外缩放 |
| `height=device-height` | 布局视口高度 | 很少使用 | 移动端浏览器界面和软键盘会让高度关系变得复杂 |
| `minimum-scale` / `maximum-scale` | 用户缩放范围 | 不建议默认设置 | 容易限制低视力用户放大页面 |
| `user-scalable=no` | 用户缩放能力 | 不推荐 | 会产生可访问性问题，也可能被浏览器忽略 |
| `viewport-fit=cover` | 异形屏覆盖范围 | 按需使用 | 让页面延伸到刘海、圆角或手势区域，必须配合安全区变量 |
| `interactive-widget` | 软键盘等交互控件如何影响视口 | 表单型应用按需使用 | 支持 `resizes-visual`、`resizes-content` 和 `overlays-content` |

`interactive-widget` 的默认值是 `resizes-visual`：软键盘通常缩小视觉视口而不改变布局视口。需要让软键盘同时改变布局视口时，可以在确认目标浏览器支持后使用 `interactive-widget=resizes-content`；`overlays-content` 则表示软键盘覆盖内容而不缩小两个视口。

<a id="viewport-cases"></a>

### 尺寸 API 与对应范围

这些 API 不能统一称为“视口宽度”，因为它们分别测量屏幕、浏览器窗口、布局视口、视觉视口和完整内容：

| 测量对象 | API | 返回什么 | 主要边界 |
| --- | --- | --- | --- |
| 整块屏幕 | `screen.width / screen.height` | 屏幕的 CSS 像素尺寸 | 不等于网页可用空间，不应用来代替媒体查询 |
| 屏幕可用区域 | `screen.availWidth / availHeight` | 排除部分系统界面后的可用尺寸 | 系统任务栏等会造成差异 |
| 浏览器外部窗口 | `window.outerWidth / outerHeight` | 整个浏览器窗口尺寸 | 包含浏览器边框和界面，不是页面布局尺寸 |
| 布局视口（含滚动条） | `window.innerWidth / innerHeight` | 页面窗口内部尺寸 | 垂直滚动条会计入 `innerWidth` |
| 布局视口（不含滚动条） | `document.documentElement.clientWidth / clientHeight` | 根元素对应的可布局区域 | 通常更适合读取页面实际布局宽度 |
| 视觉视口 | `visualViewport.width / height / scale` | 当前可见尺寸和缩放比例 | 双指缩放、软键盘和浏览器动态界面可能改变它 |
| 视觉视口偏移 | `visualViewport.offsetLeft / offsetTop` | 视觉视口相对布局视口原点的偏移 | 缩放后平移页面时更有意义 |
| 完整文档内容 | `document.documentElement.scrollWidth / scrollHeight` | 包括溢出内容在内的完整尺寸 | 大于 `clientWidth / clientHeight` 通常说明存在可滚动内容 |
| 像素密度 | `window.devicePixelRatio` | 设备像素与 CSS 像素的比例 | 页面缩放、系统缩放和显示器切换可能使它变化 |

下面的实例使用当前浏览器真实读数，并用一张本地示意图标明这些 API 测量的位置。调整浏览器宽度、页面缩放或在移动设备上弹出软键盘，可以观察不同读数是否一起变化。

<DemoFrame
  src="/demos/meta-viewport/index.html"
  title="meta viewport 尺寸 API 实例"
  height="980"
/>

### 完整移动端实例

下面提供一个完整 HTML 入口。它只包含 viewport 主题需要负责的基础设置；布局、单位和响应式策略的更多完整案例见 [**响应式适配案例**](/css/responsive/responsive-adaptation-cases)。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />

    <!--
      基础移动端视口：
      1. 布局视口使用设备屏幕对应的 CSS 像素宽度。
      2. 页面首次打开时使用 100% 缩放。
      3. 此例需要背景延伸到异形屏边缘，所以加入 viewport-fit=cover。
      普通非全屏页面通常只需要前两个值。
    -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />

    <title>移动端页面</title>

    <style>
      * {
        box-sizing: border-box;
      }

      html {
        color-scheme: light dark;
      }

      body {
        min-height: 100svh;
        margin: 0;
        font-family: system-ui, sans-serif;
      }

      /* 内容宽度保持流式，同时限制大屏上的最大阅读宽度。 */
      .page {
        width: min(100%, 72rem);
        margin-inline: auto;
        padding-top: max(16px, env(safe-area-inset-top));
        padding-right: max(16px, env(safe-area-inset-right));
        padding-bottom: max(16px, env(safe-area-inset-bottom));
        padding-left: max(16px, env(safe-area-inset-left));
      }

      /* CSS 只限制显示尺寸；资源选择仍应交给 srcset 和 sizes。 */
      img,
      video {
        display: block;
        max-width: 100%;
        height: auto;
      }

      /* 固定或吸底操作区要额外避开底部手势区域。 */
      .bottom-action {
        position: sticky;
        inset-block-end: 0;
        padding: 12px 16px;
        padding-block-end: max(12px, env(safe-area-inset-bottom));
        background: Canvas;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <h1>移动端页面</h1>

      <img
        src="/images/card-800.jpg"
        srcset="/images/card-480.jpg 480w, /images/card-800.jpg 800w"
        sizes="(width < 48rem) 100vw, 50vw"
        alt="示例内容"
        width="800"
        height="600"
      />

      <p>页面内容会根据布局视口自然排版。</p>
    </main>

    <div class="bottom-action">
      <button type="button">确认</button>
    </div>
  </body>
</html>
```

如果这是表单密集型应用，并且希望软键盘弹出时连布局视口一起缩小，可以在完成兼容性验证后将 `interactive-widget=resizes-content` 加入同一个 `content` 列表。它不是所有移动页面都必须添加的默认项。

### 两个常见误区

1. **用禁止缩放解决布局问题**

   ```html
   <!-- 不推荐作为默认模板 -->
   <meta
     name="viewport"
     content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
   />
   ```

   这会妨碍需要放大页面的用户。固定宽度溢出、字号和排版问题应通过响应式 CSS 解决，而不是禁止缩放。

2. **根据 DPR 动态修改整页缩放**

   ```js
   const scale = 1 / window.devicePixelRatio

   document.querySelector('meta[name="viewport"]')?.setAttribute(
     'content',
     `width=device-width, initial-scale=${scale}, maximum-scale=${scale}`
   )
   ```

   这是早期 `rem` 或物理 `1px` 方案中出现过的做法，会同时改变文字、图片、命中区域和缩放行为。现代页面通常保持正常 viewport，再分别处理响应式布局、高清图片和细边框。

### 与 CSS 响应式的分工

| 层次 | 负责什么 | 继续阅读 |
| --- | --- | --- |
| HTML 视口声明 | 建立移动端布局基准，说明布局视口、视觉视口和缩放规则 | 当前页面 |
| CSS 响应式规则 | 断点、容器查询、单位、流式布局、动态高度和安全区样式 | [响应式与条件规则](/css/responsive/) |
| 可复用完整代码 | 将布局、单位、图片和特殊移动端场景组合起来 | [响应式适配案例](/css/responsive/responsive-adaptation-cases) |

## 参考来源

- [MDN: `<meta name="viewport">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport)
- [MDN: Viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/CSSOM_view/Viewport_concepts)
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [MDN: `Window.innerWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth)
- [MDN: `Element.clientWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth)
- [MDN: `Screen.width`](https://developer.mozilla.org/en-US/docs/Web/API/Screen/width)
- [MDN: `Window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
- [MDN: `env()` and safe-area variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)
- [web.dev: The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units)
