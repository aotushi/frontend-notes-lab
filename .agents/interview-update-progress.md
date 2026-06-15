# 面试题更新进度

最后更新：2026-06-15

## 当前锚点

- 当前阶段：CSS 面试题整理。
- 当前模块：CSS 布局模块。
- 线上页面：https://questions.9shi.cc/css/layout/
- 本地页面：`apps/docs/docs/css/layout/index.md`
- 当前状态：已推进到布局模块；后续继续围绕布局模块做候选题审计、合并、补充和复核。

## 当前布局模块页面

当前 CSS 布局模块已进入站点的页面：

- `apps/docs/docs/css/layout/flex-grid-position.md`：display 与布局总览。
- `apps/docs/docs/css/layout/flex-layout.md`：flex 弹性布局；2026-06-15 已审查失效草稿信息，改为组件化案例。
- `apps/docs/docs/css/layout/grid-layout.md`：Grid 布局。
- `apps/docs/docs/css/layout/position-layout.md`：position 定位。
- `apps/docs/docs/css/layout/layout-patterns.md`：瀑布流、居中和经典布局案例。

## 统计口径

进度统计按模块和页面同时记录：

- 模块状态：`todo`、`in-progress`、`organized`、`needs-review`、`verified`。
- 页面状态：是否已进入侧栏、是否已按“问题 / 结论 / Demo / 参考来源”整理、是否需要补 Demo、是否需要补权威来源。
- 候选题状态：`todo`、`merged`、`skipped`、`outdated`、`needs-review`。
- 候选题处理细节只写在本文件或聊天记录中，不写入站点正文。

## CSS 模块进度

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 基础语法与层叠 | organized | 已进入 CSS 导航和侧栏。 |
| 选择器与伪类 | organized | 已进入 CSS 导航和侧栏。 |
| 值、单位与函数 | organized | 已进入 CSS 导航和侧栏。 |
| 盒模型与格式化上下文 | organized | 已进入 CSS 导航和侧栏。 |
| 布局 | in-progress | 当前推进模块，锚点为 `/css/layout/`。 |
| 响应式与条件规则 | todo | 布局模块后续候选。 |
| 文本、字体与排版 | todo | 布局模块后续候选。 |
| 颜色、背景与视觉效果 | todo | 布局模块后续候选。 |
| 动画、变换与交互 | todo | 布局模块后续候选。 |
| 分页、打印与特殊媒介 | todo | 布局模块后续候选。 |
| CSSOM、渲染与性能 | todo | 布局模块后续候选。 |

## 继续工作规则

1. 先对照 `apps/docs/docs/css/layout/index.md` 和侧栏确认布局模块当前页面。
2. 从 `.scratch/questions.jsonl` 或 `.scratch/source-corpus/` 查候选题时，先判断质量、时效性和分类归属。
3. 相近题目优先合并到已有页面，不为低密度问题新建碎片页。
4. 关键定义、规范行为和浏览器事实优先用 MDN、WHATWG、W3C、web.dev、Chrome Developers 等来源校准。
5. 迁移来源、审计过程、跳过原因和覆盖统计不写入 `apps/docs/docs/` 下的正式正文。
