# Frontend Notes Lab

前端面试资料的实验驱动文档站。

## 本地运行

```bash
npm install
npm run dev
```

`npm run dev` 只运行 VitePress 文档站，适合编辑普通文档。

需要验证带 Worker API 的案例时，使用：

```bash
npm run dev:worker
```

它会先构建 VitePress，再用 Wrangler 本地运行 Worker 和静态资源。

## 本地题库语料

旧题库仓库作为本地候选语料使用，不进入正式站点，也不参与部署。

```bash
npm run build:questions
```

该命令会把配置好的题库仓库克隆到 `.scratch/source-corpus/`，并生成单个 `.scratch/questions.jsonl`。每行包含题目、答案或答案来源链接、分类、标签、来源仓库、来源路径、来源 URL 和 `isOutdated` 标记。

当前过时标记规则会命中 jQuery 和 webpack 相关题目。它们仍保留在同一个 JSONL 文件中，筛选正式文档时默认跳过。

注意：部分仓库把答案放在 GitHub issue 或评论里，仓库 Markdown 只有 issue 链接。此类记录的 `answer` 会写成“答案见原仓库链接”，后续采纳时需要打开来源链接核对。

## 架构

- `docs/`：VitePress 文档站源码
- `docs/public/demos/`：每个知识点的独立可运行 demo
- `raw-notes/`：原始迁移资料，扁平保存，不直接进入站点
- `src/routes/`：Cloudflare Worker API 路由

## 内容迁移规则

`raw-notes/` 只作为资料池。正式展示内容必须拆分到 `docs/` 的分类目录中，例如：

- `docs/resources/`
- `docs/html/`
- `docs/css/`
- `docs/javascript/`
- `docs/typescript/`
- `docs/browser/`
- `docs/network/`
- `docs/git/`
- `docs/vue/`
- `docs/react/`
- `docs/build-tools/`
- `docs/engineering/`
- `docs/performance/`
- `docs/nodejs/`
- `docs/mobile/`
- `docs/mini-program/`
- `docs/project/`
- `docs/devops/`

每个知识点独立成文，尽量配套可验证 demo。

`raw-notes/00_资料收藏.md` 是例外：它作为资料源清单同步到 `docs/resources/`，同步时需要删掉低质量来源，并补充官方文档、规范和长期维护项目。
