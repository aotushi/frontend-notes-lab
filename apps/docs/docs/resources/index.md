# 资料源

这个页面同步自 `raw-notes/00_资料收藏.md`，用于沉淀可长期复用的数据源和学习入口。

## 收录标准

- 优先级：官方文档 > 标准规范 > 可验证数据源 > 长期维护开源项目 > 高质量专题文章。
- 面试题库只用于查漏补缺；正式结论仍要回到规范、官方文档或可运行 demo 校准。
- 旧题库和不再维护的资料可以作为离线素材池，但不能直接作为结论来源。
- 失效、广告搬运痕迹明显、缺少作者和原始出处的资源不进入正式页。
- 每次新增资源时同步记录用途，避免链接堆积成不可维护的收藏夹。

## 权威文档与规范

| 分类 | 名称 | 用途 |
| --- | --- | --- |
| Web 平台 | [MDN Web Docs](https://developer.mozilla.org/) | HTML、CSS、JavaScript、Web API、HTTP 的日常查询入口 |
| HTML | [WHATWG HTML Living Standard](https://html.spec.whatwg.org/) | HTML 解析、元素语义、脚本处理等最终规范依据 |
| CSS | [CSS Working Group Editor Drafts](https://drafts.csswg.org/) | CSS 规范草案、属性行为和模块边界 |
| JavaScript | [ECMAScript Language Specification](https://tc39.es/ecma262/) | JavaScript 语言语义、执行模型、内置对象规范 |
| JavaScript | [TC39 Proposals](https://github.com/tc39/proposals) | 跟踪新语法和新 API 的提案阶段 |
| TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) | TypeScript 类型系统和语言特性官方学习入口 |
| HTTP | [HTTP RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) | HTTP 语义、方法、状态码、头字段的规范来源 |
| 兼容性 | [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) | 浏览器兼容性数据源 |
| Web 测试 | [web-platform-tests](https://github.com/web-platform-tests/wpt) | Web 平台跨浏览器测试用例 |

## 框架与工程文档

| 分类 | 名称 | 用途 |
| --- | --- | --- |
| Vue | [Vue 官方文档](https://vuejs.org/) | Vue 3、Composition API、响应式、组件模型 |
| React | [React 官方文档](https://react.dev/) | React 组件、Hooks、并发渲染相关概念 |
| 构建 | [Vite 官方文档](https://vite.dev/guide/) | 现代前端构建、开发服务器、插件机制 |
| 测试 | [Vitest 官方文档](https://vitest.dev/) | 单元测试、组件测试、覆盖率 |
| E2E | [Playwright 官方文档](https://playwright.dev/) | 端到端测试、浏览器自动化 |
| Node.js | [Node.js API 文档](https://nodejs.org/api/) | Node.js 运行时 API、模块、异步模型 |
| 性能 | [web.dev](https://web.dev/) | Web 性能、Core Web Vitals、PWA、可访问性实践 |
| 浏览器 | [Chrome for Developers](https://developer.chrome.com/docs) | DevTools、Chrome 平台能力、性能调试 |

## 面试与题库

| 名称 | 用途 |
| --- | --- |
| [Front End Interview Handbook](https://www.frontendinterviewhandbook.com/) | 面试准备结构清晰，适合建立复习路径 |
| [front-end-interview-handbook GitHub](https://github.com/yangshun/front-end-interview-handbook) | 可查看源码、更新记录和 issue |
| [Front-end Developer Interview Questions](https://h5bp.org/Front-end-Developer-Interview-Questions/) | 经典问题清单，适合作为主题覆盖检查 |
| [Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question) | 中文题库沉淀较多，适合查漏补缺 |
| [山月前端面试题](https://q.shanyue.tech/) | 题目有工程场景感，适合补充实战问法 |
| [前端面试派](https://www.mianshipai.com/) | 按大厂面试流程组织的中文前端题库，适合补充题型覆盖和面试问法 |

## 归档题库素材池

这些资料即使不再更新，也仍然有素材价值。使用方式不是直接引用答案，而是在新增面试题文档时，把它们作为候选题库：挑选仍然适用于现代前端的问题，再用官方文档、规范或 demo 校准结论。

| 名称 | 适合抽取的内容 | 跳过的内容 |
| --- | --- | --- |
| [木易杨前端进阶博客](https://github.com/yygmind/blog) | 执行上下文、作用域闭包、this、原型链、深浅拷贝、防抖节流等 JavaScript 基础专题 | 与旧框架版本强绑定的实现细节 |
| [FE-Interview](https://github.com/lgwebdream/FE-Interview) | HTML、CSS、JavaScript、浏览器、网络、安全、工程化中的题目清单 | 过时依赖、旧版框架 API、jQuery 相关题 |
| [FE-Interview-Questions](https://github.com/poetries/FE-Interview-Questions) | 按模块组织的前端高频问题，可作为分类迁移参考 | 未标注来源且无法校准的答案 |
| [fe-interview](https://github.com/haizlin/fe-interview) | 大量每日题，适合发现遗漏主题和冷门问法 | 信息密度低、重复、旧生态问题 |
| [前端面试派](https://github.com/mianshipai/mianshipai-web) | 大厂面试流程、面试技巧和前端题型组织，可作为当前题库覆盖检查 | README 标注开源免费但仓库根目录暂无 LICENSE，正文结论仍需用官方文档或规范校准 |

## 维护动作

### 新增

新增资源时补齐三项：分类、名称、用途。只写链接不写用途的资源先留在 `raw-notes/`，不要进入正式页。

新增归档题库时额外补齐两项：适合抽取的内容、明确跳过的内容。

### 删除

删除低质量资源时保留一条处理记录，说明删除原因。这样后续不会反复把同一个低价值来源加回来。

### 修改

当资源迁移、改名或维护状态变化时，更新链接和用途描述。不要只改 URL。

### 查询

查某个知识点时按这个顺序定位来源：先查站内分类文档，再查本页权威资料源，然后查面试题库，最后查归档题库素材池。
