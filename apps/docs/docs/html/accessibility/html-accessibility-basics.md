# HTML 可访问性基础

## 问题

前端面试中如何回答 HTML 可访问性？`label`、`alt`、ARIA、键盘操作和焦点管理分别要注意什么？

## 结论

HTML 可访问性是让页面能被更多用户和更多设备可靠使用，包括键盘用户、屏幕阅读器用户、低视力用户、临时受限用户以及语音控制等辅助技术用户。它不只是“给元素加 ARIA”，而是先使用正确的原生 HTML，再补齐名称、状态、键盘、焦点和反馈。

最重要的判断顺序：

1. 能用原生元素就先用原生元素。
2. 每个可交互控件都要有可访问名称。
3. 所有功能都应该能用键盘完成。
4. 焦点顺序要符合视觉和阅读顺序，焦点状态要可见。
5. 图片、图标、错误提示、动态更新都要有合适的文本替代或辅助技术提示。
6. ARIA 只补充语义，不补交互行为；用了 ARIA 角色，就要同时实现对应键盘交互和状态维护。

`label` 的作用是给表单控件提供可访问名称，并扩大可点击区域。推荐显式关联：

```html
<label for="email">邮箱</label>
<input id="email" name="email" type="email" autocomplete="email">
```

也可以隐式包裹：

```html
<label>
  <input name="remember" type="checkbox">
  记住登录状态
</label>
```

图片 `alt` 要按用途写：

- 信息图片：写能替代图片含义的描述。
- 装饰图片：使用空 `alt=""`，让辅助技术跳过。
- 链接图片：`alt` 描述链接目的，而不是只描述图片外观。
- 复杂图表：`alt` 给简短说明，正文或相邻区域提供完整解释。

```html
<img src="/chart.png" alt="2026 年一季度销售额较上一季度增长 18%">
<img src="/divider.png" alt="">
<a href="/download">
  <img src="/download-icon.svg" alt="下载报告">
</a>
```

键盘和焦点是高频面试点。`button`、`a[href]`、`input` 等原生控件默认可聚焦并支持键盘。不要随意给普通文本、图片或容器加 `tabindex="0"`；只有真正可交互的元素才应该进入 Tab 顺序。`tabindex="-1"` 常用于让脚本临时移动焦点，例如打开弹窗后把焦点放到标题或关闭按钮。

ARIA 的原则是“少用、正确用”。如果原生元素已经能表达语义，就不要重复加 ARIA。比如按钮直接用 `<button>`，不要写成 `<div role="button">`；后者还需要自己处理聚焦、Enter、Space、禁用状态和可访问名称。

常见场景：

| 场景 | 推荐做法 |
| --- | --- |
| 链接跳转 | 使用 `a href`，链接文本能描述目的 |
| 动作触发 | 使用 `button type="button"` 或 `button type="submit"` |
| 表单输入 | 使用 `label` 关联控件；错误提示可用 `aria-describedby` 指向说明文本 |
| 图标按钮 | 按钮内图标可 `aria-hidden="true"`，按钮本身提供 `aria-label` 或可见文本 |
| 弹窗 | 使用合适的 dialog 语义，打开后移动焦点，关闭后把焦点还给触发按钮 |
| 动态消息 | 重要状态变化可用 `aria-live`，不要让用户只能靠视觉发现 |

面试回答：

> HTML 可访问性首先依赖正确的原生元素，比如链接用 `a[href]`，操作用 `button`，输入控件配 `label`。然后保证控件有可访问名称，所有功能能用键盘完成，焦点顺序和焦点样式清晰。图片按用途写 `alt`：信息图描述含义，装饰图用空 `alt`，链接图片描述链接目的。ARIA 是补充语义的工具，不会自动实现键盘交互，所以能用原生元素时不要用 `div role` 模拟。

## Demo

这个案例直接渲染两组视觉相近的 HTML 元素：左侧是不推荐写法，右侧是推荐写法。重点不是“多加几个属性”，而是在原生语义的基础上补齐可访问名称、错误提示关联、控件状态和键盘焦点。

<DemoFrame
  src="/demos/html-accessibility-basics/index.html"
  title="HTML 可访问性元素对比"
  height="980"
/>

## 常见问题

### label 的作用是什么？如何使用？

`label` 用来定义表单控件的关联关系：当用户点击 `label` 时，浏览器会自动把焦点转移到它关联的表单控件上。这扩大了控件的可点击区域，也为辅助技术提供控件的可访问名称。

两种使用方式：

**方式一：通过 `for` 属性显式关联（推荐）**

```html
<label for="mobile">手机号：</label>
<input type="text" id="mobile" name="mobile">
```

`for` 属性值与控件的 `id` 对应，两个元素可以不相邻。

**方式二：包裹控件隐式关联**

```html
<label>
  日期：
  <input type="text" name="date">
</label>
```

隐式关联不需要 `id`，但布局灵活性稍差。

不带 `for` 的 `label` 不会产生关联效果，也无法被辅助技术正确识别。复选框和单选按钮尤其依赖 `label` 来扩大点击范围。

## 参考来源

- [MDN: HTML accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
- [MDN: Keyboard accessible](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Keyboard)
- [MDN: tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [web.dev: Accessibility](https://web.dev/learn/design/accessibility)
- [web.dev: Keyboard focus](https://web.dev/focus/)
- [W3C WAI: What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
