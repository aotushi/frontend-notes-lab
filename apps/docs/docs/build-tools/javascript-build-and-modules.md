# JavaScript 构建、模块与代码组织

## 问题

Babel、AST、模块化、代码分割、压缩混淆、Gzip、npm script 串并行和 CSS/JS 组织原则怎么回答？

## 结论

构建工具题要围绕“源代码如何变成浏览器可运行资源”回答：

- 解析：源码转成 AST。
- 转换：语法降级、插件处理、宏或编译时优化。
- 打包：分析模块依赖图，合并或拆分 chunk。
- 优化：tree-shaking、minify、scope hoisting、资源 hash。
- 压缩传输：Gzip/Brotli 由服务端或 CDN 完成。
- 按需加载：动态 `import()` 生成异步 chunk。

## Demo

动态导入：

```js
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js');
  openEditor();
});
```

npm script 串行和并行：

```json
{
  "scripts": {
    "check": "npm run lint && npm run typecheck",
    "dev:all": "concurrently \"npm:dev\" \"npm:mock\""
  }
}
```

面试回答：

> Babel 的核心是 parse、transform、generate，AST 是中间表示。打包工具从入口构建依赖图，输出 chunk；代码分割依赖动态 import；压缩混淆减少体积但不等于安全；Gzip/Brotli 是传输压缩。CSS 和 JS 组织应按模块边界、复用层级和业务领域拆分。

## 参考来源

- [Babel: What is Babel?](https://babeljs.io/docs/)
- [Rollup: ES module syntax](https://rollupjs.org/introduction/)
- [webpack: Code Splitting](https://webpack.js.org/guides/code-splitting/)
