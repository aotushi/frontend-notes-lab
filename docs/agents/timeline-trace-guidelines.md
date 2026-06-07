# TimelineTrace 时序图规范

本规范用于所有前端加载、解析、执行、事件触发类案例。目标是避免每个页面手写不同风格的时序图。

## 强制原则

- 时序图必须优先使用 `TimelineTrace` 组件。
- Markdown 文档中不允许手写一次性 `<svg>` 时序图。
- Markdown 文档中不允许手写 `.timeline__*` / `.trace-map` / `.connector-*` 这类页面私有时序图样式。
- 时序图只表达时间关系，不承担长篇解释。
- HTML 代码位置、概念解释、真实日志应放在图外。
- 概念图和实测图应分离：概念图展示稳定规则，实测日志展示本次浏览器证据。

## 图形语义

- 横条：持续过程，例如 CSS 下载、图片下载、脚本下载、解析阶段。
- 短竖条：瞬时事件，例如脚本执行、`DOMContentLoaded`、`load`。
- 虚线：等待、依赖或先决关系，例如普通脚本执行等待已解析样式表。

不要使用数字圆点表示事件顺序。事件顺序由 X 轴位置表达。

## 颜色语义

页面作者只能传 `type`，不能传任意颜色。

- `html`：HTML/parser，蓝色。
- `css`：CSS，绿色。
- `js`：JavaScript，紫色。
- `event`：页面事件，红色。
- `resource`：图片、字体、其他资源，橙色。

颜色只表示类型，不表示先后顺序、重要性或状态。

## 组件数据结构

示例：

```md
<TimelineTrace
  title="普通 script 等待 CSS"
  description="概念图：普通脚本可以被预扫描下载，但执行要等待前面已解析的样式表。"
  :max-time="1000"
  :lanes="[
    { id: 'parser', label: 'HTML Parser', type: 'html', description: '解析 / 暂停' },
    { id: 'css', label: 'slow-style.css', type: 'css', description: 'stylesheet 下载' },
    { id: 'script', label: 'blocking.js', type: 'js', description: '下载后等待 CSS' },
    { id: 'events', label: '页面事件', type: 'event', description: 'DCL / load' }
  ]"
  :spans="[
    { lane: 'parser', start: 0, end: 120, type: 'html', label: '解析 head' },
    { lane: 'css', start: 20, end: 700, type: 'css', label: '下载 CSS' },
    { lane: 'script', start: 80, end: 120, type: 'js', label: '预扫描下载脚本' }
  ]"
  :markers="[
    { lane: 'script', time: 700, type: 'js', label: '执行 blocking.js' },
    { lane: 'events', time: 900, type: 'event', label: 'DOMContentLoaded' }
  ]"
  :dependencies="[
    { from: { lane: 'css', time: 700 }, to: { lane: 'script', time: 700 }, label: 'script waits for stylesheet' }
  ]"
/>
```

## 页面作者检查清单

- 是否只使用横条、短竖条、虚线三种图形？
- 是否没有数字圆点？
- 是否没有在横条上重复写资源名？
- 是否把资源名放在泳道左侧？
- 是否用 `type` 决定颜色，而不是页面私自写颜色？
- 是否把真实日志放在图下方，而不是混进概念图？
- 是否能在 390px 宽度下横向滚动而不挤压文字？
