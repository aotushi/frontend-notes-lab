# 元素分类与空元素

## 问题

行内元素、块级元素、空元素分别有哪些？应该怎么理解这些分类？

## 结论

旧面试题经常要求背“行内元素、块级元素、空元素列表”。现代回答应先区分：

- HTML 内容模型：元素能放在哪里、能包含什么内容。
- CSS 显示类型：元素最终是 `inline`、`block`、`inline-block`、`flex`、`grid` 等。
- 空元素：HTML 语法上不能有子节点的元素。

常见空元素包括：

```text
area, base, br, col, embed, hr, img, input, link, meta,
param, source, track, wbr
```

空元素不能写闭合内容：

```html
<!-- 正确 -->
<img src="/logo.png" alt="Logo">
<br>
<meta charset="utf-8">

<!-- 错误理解：img 不能包含子内容 -->
<img>图片说明</img>
```

行内、块级和行内块的视觉差异已经拆到 [行内元素、块级元素与行内块](/html/document-structure/inline-block-elements)。

## Demo

```js
console.log(getComputedStyle(document.createElement('div')).display); // block
console.log(getComputedStyle(document.createElement('span')).display); // inline
```

面试回答：

> 现代 HTML 不建议只按“行内/块级”背元素列表。能否嵌套取决于 HTML 内容模型，视觉表现取决于 CSS `display`。空元素是语法上不能有子内容的元素，例如 `br`、`img`、`input`、`link`、`meta`。面试可以举常见例子，但要强调判断方法。

## 参考来源

- [MDN: Void element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)
- [MDN: HTML content categories](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Guides/Content_categories)
- [MDN: display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
