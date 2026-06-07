# 前端面试实验笔记

这里把原始前端面试资料改造成“结论 + 可验证案例 + 解释”的文档站。

第一阶段只迁移少量高价值主题，先跑通本地预览、独立 demo、Worker API 和 Cloudflare 部署链路。

## 分类

- [资料源](/resources/)
- [HTML](/html/)
- [CSS](/css/)
- [JavaScript](/javascript/)
- [TypeScript](/typescript/)
- [浏览器](/browser/)
- [网络 / HTTP](/network/)
- [Git](/git/)
- [Vue / Nuxt](/vue/)
- [React](/react/)
- [构建工具](/build-tools/)
- [工程化](/engineering/)
- [性能优化](/performance/)
- [Node.js](/nodejs/)
- [移动端](/mobile/)
- [小程序](/mini-program/)
- [项目经验](/project/)
- [DevOps](/devops/)

## 迁移规则

- 原始 Markdown 统一放在 `raw-notes/`，作为待清洗资料池。
- `raw-notes/00_资料收藏.md` 同步到 [资料源](/resources/)，只保留高质量、可长期维护的数据源。
- 正式文档写入 `docs/`，按知识点分类，每篇只保留校准后的结论。
- 分类首页展示主题组规划；侧栏只展示已经迁移完成的页面。
- 每个能验证的知识点配一个独立 demo，放在 `docs/public/demos/`。
- 需要响应头、延迟、缓存、Cookie、CORS 的 demo，由 Worker 的 `/api/demos/*` 路由提供。
