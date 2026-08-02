# 面试题更新进度

最后更新：2026-08-01

## 当前锚点

- 当前阶段：CSS 面试题迁移复核。
- 当前模块：CSS 基础、布局、视觉、动画、响应式与渲染综合复核。
- 线上页面：https://questions.9shi.cc/css/
- 本地页面：`apps/docs/docs/css/`
- 当前状态：已逐题复核语雀 CSS 篇的 58 个一级问题；补齐 display、三栏、“品”字和九宫格的多方案内容，修正 requestAnimationFrame、替换元素、CSS 模块演进、图片格式和性能优化的过时或不准确表述，并补充 CSS 到 HTML 显示类型、DPR 和响应式图片主题的入口。

## 当前布局模块页面

当前 CSS 布局模块已进入站点的页面：

- `apps/docs/docs/css/layout/flex-grid-position.md`：display 与布局总览。
- `apps/docs/docs/css/layout/flex-layout.md`：flex 弹性布局；2026-06-15 已审查失效草稿信息，改为组件化案例。
- `apps/docs/docs/css/layout/grid-layout.md`：Grid 布局；2026-06-16 已审查失效草稿信息，补充 raw-data 中 Grid、轨道、`minmax()`、九宫格和 `subgrid` 相关题，并改为组件化案例。
- `apps/docs/docs/css/layout/position-layout.md`：position 定位；2026-06-16 已审查旧草稿和 raw-data 中定位、包含块、sticky、fixed、z-index、定位居中相关题，删除过时兼容性表述并补充权威来源；2026-06-17 根据阅读反馈补充 sticky 和 absolute containing block 的场景化解释，并新增左右两栏 `PositionPlayground` 组件覆盖每个 position 值。
- `apps/docs/docs/css/layout/layout-patterns.md`：瀑布流、居中和经典布局案例；2026-06-17 已审查并移除远程 iframe 示例，修正旧浮动/表格方案边界，补充 raw-data 中瀑布流、居中、两栏/三栏、上下固定中间滚动、圣杯和双飞翼相关题，并新增本地左右两栏 `LayoutPatternsPlayground` 组件；二次补充原始笔记中的 9+ 种居中方案及适用边界。

## 统计口径

进度统计按模块和页面同时记录：

- 模块状态：`todo`、`in-progress`、`organized`、`needs-review`、`verified`。
- 页面状态：是否已进入侧栏、是否已按“问题 / 结论 / Demo / 参考来源”整理、是否需要补 Demo、是否需要补权威来源。
- 候选题状态：`todo`、`merged`、`skipped`、`outdated`、`needs-review`。
- 候选题处理细节只写在本文件或聊天记录中，不写入站点正文。

## CSS 模块进度

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 基础语法与层叠 | verified | 已复核语雀 CSS 基础题，并按模块化演进方式更新“CSS3”历史问法。 |
| 选择器与伪类 | verified | 已覆盖选择器、优先级、伪类和伪元素相关题。 |
| 值、单位与函数 | verified | 已覆盖常见单位、相对单位和百分比相关题。 |
| 盒模型与格式化上下文 | verified | 已覆盖盒模型、BFC、浮动、margin 折叠和替换元素，并修正替换元素定义与尺寸边界。 |
| 布局 | verified | 已覆盖 display、Flex、Grid、position 和经典布局；多方案题保留完整有效实现。 |
| 响应式与条件规则 | verified | 已覆盖响应式、条件规则、视口单位、DPR、高清资源、移动端适配和视觉 `1px`。 |
| 文本、字体与排版 | verified | 已覆盖行高、溢出、省略和行内间隙相关题。 |
| 颜色、背景与视觉效果 | verified | 已覆盖形状、图片格式和 CSS Sprites，并补充 AVIF、APNG 与格式回退。 |
| 动画、变换与交互 | verified | 已覆盖 transform、transition、animation 和 requestAnimationFrame，并修正事件循环与掉帧表述。 |
| 分页、打印与特殊媒介 | todo | 布局模块后续候选。 |
| CSSOM、渲染与性能 | verified | 已覆盖渲染、显隐、可视区域和性能优化，并改为以测量结果驱动选择器优化。 |

## 继续工作规则

1. 先对照 `apps/docs/docs/css/layout/index.md` 和侧栏确认布局模块当前页面。
2. 从 `.scratch/questions.jsonl` 或 `.scratch/source-corpus/` 查候选题时，先判断质量、时效性和分类归属。
3. 相近题目优先合并到已有页面，不为低密度问题新建碎片页。
4. 关键定义、规范行为和浏览器事实优先用 MDN、WHATWG、W3C、web.dev、Chrome Developers 等来源校准。
5. 迁移来源、审计过程、跳过原因和覆盖统计不写入 `apps/docs/docs/` 下的正式正文。
