# IndexedDB 与 Web SQL

## 问题

Web SQL 和 IndexedDB 是什么？现代前端应该如何选择浏览器端结构化存储？

## 结论

IndexedDB 是浏览器提供的低层级、异步、事务型对象数据库，适合保存大量结构化数据，例如离线应用数据、文件元信息、复杂缓存、草稿等。

Web SQL 是早期浏览器数据库方案，使用 SQL 语法，但规范已经废弃，不应作为现代项目选型。

| 对比项 | IndexedDB | Web SQL |
| --- | --- | --- |
| 规范状态 | 现代浏览器支持 | 已废弃 |
| 数据模型 | 对象存储、索引、事务 | SQL 表 |
| API 风格 | 异步事件/Promise 封装 | SQL 查询 |
| 适合场景 | 大量结构化离线数据 | 不推荐新项目使用 |

IndexedDB 与 Web Storage 的区别：

- Web Storage 简单同步，适合少量字符串键值。
- IndexedDB 异步、容量更大、支持索引和事务，适合复杂数据。

## Demo

```js
const request = indexedDB.open('notes', 1);

request.onupgradeneeded = () => {
  const db = request.result;
  db.createObjectStore('items', { keyPath: 'id' });
};

request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction('items', 'readwrite');
  tx.objectStore('items').put({ id: 1, title: 'HTML 面试题' });
};
```

面试回答：

> Web SQL 已废弃，不建议新项目使用。现代浏览器端结构化数据存储首选 IndexedDB；它是异步、事务型对象数据库，适合大量离线数据。少量非敏感字符串可以用 localStorage，但不要用 localStorage 承载复杂、大量或高频读写的数据。

## 参考来源

- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
