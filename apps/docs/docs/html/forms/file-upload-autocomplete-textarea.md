# 文件上传、自动完成与 textarea

## 问题

文件上传如何实现？`input` 上传多文件和移动端拍照怎么配置？`autocomplete`、`textarea` 自适应和原格式输出要注意什么？

## 结论

文件上传的基础方案是 `<input type="file">` 配合 `multipart/form-data` 或 `FormData`。多文件用 `multiple`，限制类型用 `accept`，移动端希望调用相机可加 `capture`，但具体表现取决于系统和浏览器。

```html
<form method="post" enctype="multipart/form-data">
  <input type="file" name="photos" accept="image/*" capture="environment" multiple />
  <button type="submit">上传</button>
</form>
```

除了原生文件输入，还可以支持拖拽、剪贴板粘贴、文件系统访问 API 等，但最终仍要拿到 `File` 或 `Blob`，再通过 `FormData`、分片上传或直传到对象存储。

`autocomplete="off"` 可以表达“不希望自动完成”，但浏览器尤其是密码管理相关场景可能为了用户安全和便利忽略它。更可靠的是使用正确的 autocomplete token，例如 `username`、`current-password`、`new-password`、`one-time-code`。

`textarea` 的值是纯文本。页面展示时用 `textContent` 搭配 `white-space: pre-wrap`，不要把用户输入拼到 `innerHTML`。

## Demo

```html
<textarea id="bio" maxlength="120" rows="3"></textarea>
<pre id="preview"></pre>

<script>
  bio.value = '第一行\\n第二行';
  preview.textContent = bio.value;
  preview.style.whiteSpace = 'pre-wrap';

  bio.addEventListener('input', () => {
    bio.style.height = 'auto';
    bio.style.height = `${bio.scrollHeight}px`;
  });
</script>
```

用普通元素模拟 `textarea` 可设置 `contenteditable` 和 `resize`，但它不会自动拥有表单提交、约束校验和完整可访问性。真实业务优先使用原生 `textarea`。

```html
<div contenteditable="true" style="resize: both; overflow: auto;"></div>
```

面试回答：

> 文件上传通常用 `input[type=file]`、`multipart/form-data` 和 `FormData`。多文件用 `multiple`，移动端拍照可尝试 `accept="image/*"` 加 `capture`。`autocomplete` 不只是 on/off，现代浏览器更推荐使用明确 token。`textarea` 原格式输出应用 `textContent` 和 `white-space: pre-wrap`，避免 XSS。

## 参考来源

- [MDN: `<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
- [MDN: HTML autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
- [MDN: `<textarea>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
