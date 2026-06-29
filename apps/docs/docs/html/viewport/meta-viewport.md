# `meta viewport` 有什么作用？

## 问题

为什么移动端页面通常要写 `<meta name="viewport" content="width=device-width, initial-scale=1">`？它设置的是哪个视口？布局视口、视觉视口、理想视口分别是什么？`width`、`initial-scale`、`user-scalable`、`viewport-fit` 分别影响什么？

## 结论

`meta viewport` 是移动端页面的视口声明。它主要告诉移动端浏览器：不要再用早期桌面网页兼容模式下的宽布局视口去缩小整页，而是按设备屏幕在 `100%` 缩放下对应的 CSS 像素宽度来建立布局视口。

现代移动端页面的基础写法是：

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

理解 `device-width` 前，先分清三个量：

| 名称                                      | 是否是字段 / 读数                                                     | 含义                                                                   | 例子或读数                             |
| ----------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| 设备物理像素宽度                          | 不是 `meta viewport` 字段，也没有稳定的直接浏览器读数                 | 屏幕硬件横向真实拥有的设备像素数量。它描述屏幕本身，不等于 CSS 布局宽度。 | 一块手机屏幕可能是 `1170` 物理像素宽   |
| <ConceptNote label="DPR" title="DPR 从哪里来？" :sections="[{ title: '直观定义', body: 'DPR 是 Device Pixel Ratio，中文常说设备像素比。它表示当前 Web 环境中 1 个 CSS 像素通常由多少个物理像素显示。' }, { title: '实际来源', body: 'DPR 不是页面开发者设置的，也不是浏览器凭空决定的。底层来源是设备屏幕的物理像素密度和操作系统的显示坐标体系；浏览器再把这套体系映射到 Web 的 CSS 像素中，并通过 window.devicePixelRatio 暴露给网页。' }, { title: '原生类比', items: ['iOS 里常见的是 point 与 scale 的关系。', 'Android 里常见的是 dp 与 density 的关系。', 'Web 里对应的是 CSS px 与 DPR 的关系。'] }, { title: '计算角色', code: '设备物理像素宽度 / DPR ≈ 设备屏幕的 CSS 像素宽度\n\n例子：\n1170 物理像素 / DPR 3 = 390 CSS px' }, { title: '边界', body: 'DPR 本身不是高清效果的来源。高清效果来自屏幕拥有更多物理像素；DPR 只是把这种物理像素密度折算成网页可以使用的 CSS 像素比例。普通移动设备默认状态下，DPR 通常可以当成稳定值；桌面缩放、系统缩放、外接屏切换等场景可能改变它。' }, { title: '校准来源', links: [{ label: 'MDN: window.devicePixelRatio', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio' }, { label: 'MDN: Device pixel', href: 'https://developer.mozilla.org/en-US/docs/Glossary/Device_pixel' }] }]" /> | 浏览器读数是 `window.devicePixelRatio`                                | 设备像素比，表示 `1` 个 CSS 像素通常由多少个物理像素显示。               | `window.devicePixelRatio` 可能读到 `3` |
| 设备屏幕的 CSS 像素宽度                    | 在 `meta viewport` 里写作 `device-width`；`screen.width` 返回屏幕的 CSS 像素宽度 | 设备屏幕在 `100%` 缩放下对应的 CSS 像素宽度，也就是移动端排版使用的宽度。 | `1170 / 3 = 390 CSS px`                |

所以，`device-width` 不是设备物理像素宽度，而是设备屏幕在 `100%` 缩放下对应的 CSS 像素宽度。这里没有第二个比率：`设备物理像素宽度 / DPR` 得到的那个 CSS 像素宽度，就是 `device-width` 表示的宽度，也是移动端页面通常希望布局视口对齐的理想宽度。

注意：“设备物理像素宽度”只是解释硬件屏幕用的概念，不是 `meta viewport` 的字段，也不是 Web API 里可直接稳定读取的属性。浏览器里更常见、也更适合网页布局判断的是 CSS 像素宽度，例如 `screen.width`、`document.documentElement.clientWidth` 和 `device-width`。

这行代码不是一句整体口号，而是几组关系：

| 片段                 | 左边字段        | 右边值         | 它们之间的关系                               | 读数或现象                                                   |
| -------------------- | --------------- | -------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `name="viewport"`    | `name`          | `viewport`     | 说明这条 `meta` 配置的是浏览器视口           | 浏览器按视口规则解析 `content`                               |
| `content="..."`      | `content`       | 多个配置项     | 承载具体视口配置，配置项用逗号分隔           | 里面的 `width`、`initial-scale` 生效                         |
| `width=device-width` | `width`         | `device-width` | 把**布局视口宽度**设为设备屏幕在 `100%` 缩放下的 **CSS 像素宽度** | `document.documentElement.clientWidth` 通常接近这个 CSS 宽度 |
| `initial-scale=1`    | `initial-scale` | `1`            | 设置页面首次打开时的初始缩放比例             | `window.visualViewport?.scale` 通常接近 `1`                  |

`width=device-width` 中，`width` 指的是布局视口宽度，<ConceptNote label="device-width" title="device-width 是什么宽度？" :sections="[{ title: '直观定义', body: 'device-width 不是设备的物理像素宽度，而是设备屏幕在 100% 缩放下对应的 CSS 像素宽度。它和“设备屏幕的 CSS 像素宽度”是同一个量，只是出现在 meta viewport 配置里时写作 device-width。' }, { title: '计算流程', code: '设备物理像素宽度 / window.devicePixelRatio ≈ 设备屏幕的 CSS 像素宽度\n设备屏幕的 CSS 像素宽度 ≈ device-width\n\n例子：\n1170 物理像素 / DPR 3 = 390 CSS px\n390 CSS px ≈ device-width' }, { title: '读数关系', body: '一台手机屏幕物理宽度可能是 1170px，DPR 为 3 时，设备屏幕的 CSS 像素宽度就是 390 CSS px。这个 390 CSS px 就是 device-width 表示的宽度。写了 width=device-width 后，浏览器通常会用这个宽度建立布局视口，document.documentElement.clientWidth 也通常会接近这个值。' }, { title: '比率边界', body: '这里没有另一个比率。真正的比率是 DPR，它只负责把物理像素宽度折算成 CSS 像素宽度。device-width 不是比率，而是折算后的 CSS 像素宽度。' }, { title: '字段边界', body: '设备物理像素宽度不是 meta viewport 字段，也没有稳定的直接浏览器读数。它只是解释硬件像素如何按 DPR 折算成 CSS 像素宽度时用到的概念。网页布局里通常读 CSS 像素宽度和 DPR，再用它们理解物理像素与 CSS 像素的关系。' }, { title: '校准来源', links: [{ label: 'MDN: meta viewport 中 width 和 device-width 的定义', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport#usage_notes' }, { label: 'MDN: Mobile viewports 中对 device-width 的解释', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/CSSOM_view/Viewport_concepts#mobile_viewports' }, { label: 'MDN: devicePixelRatio 是物理像素与 CSS 像素的比例', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio' }, { label: 'MDN: screen.width 返回 CSS 像素宽度', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Screen/width' }] }]" /> 指的是设备屏幕在 `100%` 缩放下对应的 CSS 像素宽度。所以这里的 `=` 不是给某个 JavaScript 变量赋值，而是告诉浏览器：用这个 CSS 宽度来建立布局视口。浏览器完成计算后，`document.documentElement.clientWidth` 通常会读到这个布局宽度。

```txt
width=device-width
  |        |
  |        -> 设备屏幕在 100% 缩放下对应的 CSS 像素宽度
  |
  -> 布局视口宽度：CSS 排版、媒体查询、vw 主要依赖的宽度

结果：
布局视口宽度 ≈ 理想视口宽度
document.documentElement.clientWidth ≈ device-width
```

这样，媒体查询、`vw`、固定定位和流式布局拿到的都是移动端应有的宽度。页面内部如何分栏、字号如何变化、图片如何选资源、安全区和 `1px` 如何处理，则交给 CSS 响应式适配解决。

### 理解路径

1. 移动浏览器为了兼容旧桌面网页，默认可能使用一个较宽的布局视口，再把整页缩小到手机屏幕里。
2. 设备物理像素宽度先按 DPR 折算成设备屏幕的 CSS 像素宽度，例如 `1170 / 3 = 390 CSS px`。
3. 这个 CSS 像素宽度在 `meta viewport` 里用 `device-width` 表示；`width=device-width` 让布局视口使用它。
4. `initial-scale=1` 让页面初始显示时不额外放大或缩小。
5. CSS 布局主要看布局视口；用户当前实际看见的区域是视觉视口。

### 三个视口分别是什么？

移动端适配里通常要区分三个视口：

| 视口                     | 完整释义                                                                                                                 | 对应字段或写法                                          | 主要用途                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------- |
| 布局视口 layout viewport | 浏览器用来计算 CSS 布局的视口。媒体查询、`position: fixed`、百分比布局和大多数 CSS 尺寸判断都依赖它。                    | `document.documentElement.clientWidth` / `clientHeight` | 判断 CSS 实际按多宽排版                        |
| 视觉视口 visual viewport | 用户当前真正看见的区域。用户缩放、软键盘弹出、浏览器地址栏变化时，它可能小于布局视口。                                   | `window.visualViewport?.width` / `height` / `scale`     | 处理软键盘、缩放后可见区域、贴近当前屏幕的浮层 |
| 理想视口 ideal viewport  | 设备屏幕在 `100%` 缩放下对应的 CSS 像素宽度。它不是一个独立 DOM 节点，而是移动端页面希望布局视口对齐的目标宽度。 | `width=device-width` 中的 `device-width`                | 让布局视口对齐这个 CSS 宽度                    |

设置推荐的 `meta viewport` 后，在未缩放的常规移动页面中，布局视口宽度通常会接近理想视口宽度。视觉视口仍会随着缩放、软键盘和浏览器 UI 变化而变化。

### 参数分别影响什么？

| 参数                              | 影响对象       | 推荐程度       | 说明                                                                          |
| --------------------------------- | -------------- | -------------- | ----------------------------------------------------------------------------- |
| `width=device-width`              | 布局视口       | 推荐           | 让布局视口按设备屏幕在 `100%` 缩放下对应的 CSS 像素宽度计算，是移动端响应式页面的基础 |
| `initial-scale=1`                 | 初始缩放       | 推荐           | 页面首次显示时不额外缩放，通常和 `width=device-width` 一起写                  |
| `height=device-height`            | 布局视口高度   | 很少用         | 移动端地址栏、底部工具栏和软键盘会让高度变化复杂，通常不用它控制布局          |
| `minimum-scale` / `maximum-scale` | 用户缩放范围   | 不推荐默认使用 | 容易限制用户放大页面                                                          |
| `user-scalable=no`                | 用户缩放能力   | 不推荐         | 会影响低视力用户阅读，也可能被浏览器基于可访问性策略忽略                      |
| `viewport-fit=cover`              | 安全区显示方式 | 特定场景使用   | 允许内容延伸到刘海屏、圆角屏或底部手势区域，需要配合 `env(safe-area-inset-*)` |

带安全区域的全屏页面可以加入 `viewport-fit=cover`，并在 CSS 中处理安全区域。完整模板、视口读数 Demo 和反例代码见 [移动端视口案例](/html/viewport/mobile-viewport-cases)。

### 和 CSS 响应式是什么关系？

`meta viewport` 只负责建立正确的移动端布局基准。它不会自动解决固定宽度、图片体积、字号缩放、底部安全区、视觉 `1px` 或横屏布局。

可以把分工记成：

| 层次            | 负责什么                                             | 继续阅读                                                      |
| --------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| HTML 移动端基础 | 声明视口、解释布局视口 / 视觉视口 / 理想视口         | [移动端视口案例](/html/viewport/mobile-viewport-cases)        |
| CSS 响应式适配  | 布局、断点、容器查询、单位、图片、安全区、视觉 `1px` | [响应式与条件规则](/css/responsive/)                          |
| CSS 案例代码    | 可落地的响应式代码片段                               | [响应式适配案例](/css/responsive/responsive-adaptation-cases) |

## 案例

本页只保留视口概念和参数关系，具体案例集中在 [移动端视口案例](/html/viewport/mobile-viewport-cases)：

- 视口指标验证：读取布局视口、视觉视口、缩放比例和 DPR。
- 移动端基础模板：给出生产页面的基础 HTML 和 CSS 入口。
- 安全区页面模板：演示 `viewport-fit=cover` 和 `env(safe-area-inset-*)`。
- 反例：说明为什么不默认禁用缩放，也不把按 DPR 改 viewport 缩放作为通用方案。

## 参考来源

- [MDN: `<meta name="viewport">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [MDN: Viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts)
- [MDN: Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)
- [MDN: Device pixel](https://developer.mozilla.org/en-US/docs/Glossary/Device_pixel)
- [MDN: Window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
- [MDN: Screen.width](https://developer.mozilla.org/en-US/docs/Web/API/Screen/width)
- [web.dev: Learn CSS sizing](https://web.dev/learn/css/sizing)
- [web.dev: The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units)
