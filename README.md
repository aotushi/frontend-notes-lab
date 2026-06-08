# Frontend Notes Lab

实验驱动的前端面试知识库。项目目标不是简单搬运题库，而是把前端面试题整理成可校准、可验证、可继续扩展的文档站：每个知识点尽量给出明确结论、权威资料来源和可运行 demo。

## 项目特点

- **面试题文档化**：把零散问答拆成独立知识点，按 HTML、CSS、JavaScript、Vue、React、网络、性能等主题组织。
- **结论优先**：页面先给可以直接回答的结论，再补充解释、demo、面试回答和参考来源。
- **实验验证**：关键问题配套独立 demo，例如 `async` / `defer` 执行顺序、资源加载时序、CSS reset 与 normalize 对比。
- **权威校准**：优先引用 MDN、WHATWG、W3C、web.dev、Chrome Developers 等长期维护资料。
- **Worker 一体部署**：Cloudflare Worker 同时承载静态文档和 `/api/*` demo 接口。

## 技术栈

- 文档站：VitePress + Vue 3
- Demo 静态资源：原生 HTML / CSS / JavaScript
- API：Cloudflare Worker + Hono
- 部署：Cloudflare Workers Static Assets
- 包管理：npm workspaces

## 目录结构

```txt
frontend-notes-lab/
├─ apps/
│  ├─ docs/
│  │  └─ docs/                    # VitePress 文档源码
│  │     ├─ .vitepress/            # 站点配置、主题组件
│  │     ├─ public/demos/          # 独立可运行 demo
│  │     ├─ html/
│  │     ├─ css/
│  │     ├─ javascript/
│  │     ├─ vue/
│  │     └─ ...                    # 其它前端主题
│  └─ worker/
│     ├─ src/                      # Worker API 和路由
│     └─ wrangler.jsonc            # Worker + 静态资源部署配置
├─ raw-notes/                      # 原始资料池，不直接展示
├─ scripts/                        # 题库索引、构建辅助脚本
└─ AGENTS.md                       # 文档更新和质量策略
```

## 本地运行

安装依赖：

```bash
npm install
```

只编辑普通文档时，启动 VitePress：

```bash
npm run dev
```

需要验证带 Worker API 的 demo 时，启动 Worker 本地服务：

```bash
npm run dev:worker
```

`npm run dev:worker` 会先构建 VitePress，再用 Wrangler 本地运行 Worker 和静态资源。此模式下 `/api/*` 由 Worker 处理，其它路径由静态文档资源处理。

## 常用命令

```bash
npm run build          # 构建文档站，并执行时序图 lint
npm run typecheck      # 检查 docs 和 worker 类型
npm run preview        # 预览 VitePress 构建结果
npm run deploy         # 使用 apps/worker/wrangler.jsonc 部署 Worker
npm run deploy:full    # 先构建，再部署
```

当前根目录部署脚本为：

```bash
wrangler deploy --config apps/worker/wrangler.jsonc
```

在 Cloudflare Git 集成中推荐配置：

```txt
Root directory: /
Build command: npm run build
Deploy command: npm run deploy
```

不要在仓库根目录直接使用裸命令 `npx wrangler deploy`，因为这是 npm workspace 根目录，Wrangler 无法自动判断具体 Worker 应用。

## 架构说明

项目采用轻量 monorepo：

- `apps/docs` 只负责文档站和可静态访问的 demo 页面。
- `apps/worker` 只负责 Worker API、延迟资源、动态 demo 接口和最终静态资源承载。
- VitePress 开发服务里也注册了 demo API middleware，使普通本地开发能够验证部分动态案例。
- 生产环境由 Worker 统一入口承载：`/api/*` 先进入 Hono 路由，其它请求交给 Cloudflare Static Assets。

这种拆分保留了前后端边界，又避免把部署拆成 Pages + Worker 两套系统。

## 文档组织

正式文档放在 `apps/docs/docs/` 下，按主题分类：

- `resources/`：资料源和长期参考资料
- `html/`：HTML、语义化、资源加载、表单、媒体、存储等
- `css/`：按 CSS 官方模块思路组织，包括基础语法与层叠、选择器、盒模型、布局、响应式、排版、渲染与性能等
- `javascript/`：语言基础、执行机制、异步、模块化、DOM/BOM、性能和手写题
- `typescript/`、`vue/`、`react/`、`browser/`、`network/`、`performance/` 等其它主题

单篇知识点通常采用：

```txt
问题
结论
Demo
面试回答
参考来源
```

难理解的结论会使用站内组件做渐进解释；正文保留高密度结论，细节通过点击释义、右侧面板或 demo 展开。

## Demo 规范

每个 demo 应尽量是独立可运行页面，放在：

```txt
apps/docs/docs/public/demos/
```

推荐做法：

- 页面能直接验证文档中的结论。
- HTML、CSS、JS 尽量拆成真实文件，避免大量模板字符串。
- 如果多个案例 HTML 相同，只展示差异 CSS 或差异 JS。
- 有时序关系时优先使用统一的 `TimelineTrace` 组件或统一设计语言。
- demo 不应只做装饰图，必须帮助读者观察行为差异。

## 本地题库语料

`raw-notes/` 和 `.scratch/questions.jsonl` 只作为候选资料池，不直接进入正式站点。

```bash
npm run build:questions
```

该命令会根据配置整理候选题库，生成 JSONL 语料。正式采纳时需要人工判断质量、时效性和分类归属。当前默认把 jQuery、webpack 相关题目标记为过时风险，迁移正式文档时通常跳过。

## 内容维护原则

- 不把“迁移审计”“原答案审计”“覆盖候选题”等过程性内容写入站点。
- 过时或低质量题目可以删除，但正式页面只保留整理后的结论和解释。
- 关键定义优先链接到权威资料的具体小节或锚点。
- 修改导航、组件或 Worker 配置后应运行构建或类型检查。
- Cloudflare 远程数据写入、D1 远程迁移等操作必须先本地验证，并在明确授权后执行。
