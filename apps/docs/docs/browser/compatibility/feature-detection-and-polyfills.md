# 浏览器兼容、特性检测与 Polyfill

## 问题

功能检测、UA 判断、Polyfill、浏览器兼容和旧 IE/Flash/jQuery 类问题怎么回答？

## 结论

现代兼容性策略优先级：

1. 明确目标浏览器和业务支持矩阵。
2. 优先使用标准能力和渐进增强。
3. 用功能检测判断能力是否存在。
4. 对缺失能力按需加载 polyfill。
5. 避免依赖 UA 字符串做核心判断。

```js
if ('IntersectionObserver' in window) {
  observeVisibility();
} else {
  loadFallback();
}
```

UA 判断容易被伪装和浏览器策略影响，只适合少数容器兼容分支。Modernizr 属于历史上常见的功能检测库，现代项目通常通过 Browserslist、core-js、构建工具和运行时特性检测组合处理。

IE 条件注释、Flash、userData、旧 jQuery 优化等题属于历史兼容知识，新项目不应作为主线答案。

## Demo

按需加载 polyfill：

```js
if (!('BroadcastChannel' in window)) {
  await import('./polyfills/broadcast-channel.js');
}
```

面试回答：

> 兼容性先看目标浏览器矩阵，再做渐进增强。能力判断优先功能检测，UA 判断只作为容器特例兜底。缺失能力按需 polyfill，构建阶段用 Browserslist 控制转译范围。IE 条件注释、Flash、userData 属于历史知识，现代项目不应依赖。

## 参考来源

- [MDN: Browser feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)
- [MDN: Polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill)
