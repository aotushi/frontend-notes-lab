# 白屏时间

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- 白屏时间

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### 白屏时间

白屏时间是指浏览器从输入网址，到浏览器开始显示内容的时间。

Performance 接口可以获取到当前页面中与性能相关的信息,该类型的对象可以通过调用只读属性 Window.performance 来获得。

performance.timing.navigationStart: PerformanceTiming.navigationStart 是一个返回代表一个时刻的 unsigned long long 型只读属性，为紧接着在相同的浏览环境下卸载前一个文档结束之时的 Unix毫秒时间戳。如果没有上一个文档，则它的值相当于 PerformanceTiming.fetchStart。

所以将以下脚本放在 `</head>` 前面就能获取白屏时间。

```html
<script>
	new Date() - performance.timing.navigationStart
</script>
```

## Demo

待补充：在页面 head 末尾和首个可见内容处打印时间，比较旧版 `performance.timing` 与现代 PerformanceNavigationTiming。
