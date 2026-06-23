# DOM/BOM 浏览器宿主 API

### 理解路径

DOM/BOM 不属于 ECMAScript 语言核心，而是浏览器提供给 JavaScript 的宿主 API。它们都依赖浏览器环境，但内部认知模型不同：DOM 面向文档树，BOM 面向窗口和页面生命周期，存储面向本地数据持久化，页面通信面向不同浏览上下文之间的消息传递。

### DOM/BOM 应该按哪些主题查看？

| 主题 | 内容边界 |
| --- | --- |
| [DOM 事件与节点操作](/javascript/dom-bom/dom-events-and-nodes) | 事件流、事件委托、事件对象、DOM 查询操作、滚动判断 |
| [BOM 与页面生命周期](/javascript/dom-bom/bom-and-page-lifecycle) | `window`、`location`、`history`、页面可见性、关闭前上报 |
| [浏览器存储](/javascript/dom-bom/browser-storage) | Cookie、Web Storage、IndexedDB、存储安全边界 |
| [页面通信](/javascript/dom-bom/page-communication) | `postMessage`、`BroadcastChannel`、`storage` 事件、`MessageChannel`、Service Worker 通信 |

左侧导航只保留这些主题分类；每个主题页内部再承载具体面试题。

具体示例见各主题页。

## 参考来源

- [MDN: Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)
- [MDN: Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN: Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
