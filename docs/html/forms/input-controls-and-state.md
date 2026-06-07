# input、button 与控件状态

## 问题

`input`、`button`、`checkbox`、`radio` 常见属性和状态怎么回答？`readonly` 和 `disabled` 有什么区别？怎样处理自动聚焦、自动完成和控件默认行为？

## 结论

表单控件面试题不要只背标签名，要能说明浏览器原生行为、可访问性和提交结果。

| 主题 | 结论 |
| --- | --- |
| 自动聚焦 | 可用 `autofocus`，复杂页面中更常在用户进入编辑状态后调用 `element.focus()` |
| `inputmode` | 提示移动端显示合适键盘，不改变字段真实约束 |
| `readonly` | 控件可聚焦、值会随表单提交 |
| `disabled` | 控件不可交互，通常也不会随表单提交 |
| `checkbox` | 有 checked、unchecked，JS 还可设置 `indeterminate` 作为视觉上的半选态 |
| `radio` 分组 | 同一 `name` 的 radio 互斥 |
| `button` 默认类型 | 在表单内默认是 `submit`，业务按钮应显式写 `type="button"` |
| `reset` | 将表单控件恢复到初始值 |
| `size` 与 `width` | `size` 是字符列数提示，`width` 是 CSS 视觉尺寸 |

`button` 比 `div` 更适合做按钮，因为它天然具备键盘可访问性、表单关联、禁用状态和语义。必须用非按钮元素时，至少补齐 `role="button"`、`tabindex="0"` 和键盘事件，但这通常不如直接使用原生按钮。

## Demo

```html
<form>
  <label>
    用户名
    <input name="username" autocomplete="username" inputmode="text" autofocus />
  </label>

  <label>
    <input type="checkbox" id="agree" />
    我已阅读协议
  </label>

  <fieldset>
    <legend>通知方式</legend>
    <label><input type="radio" name="notice" value="email" /> 邮件</label>
    <label><input type="radio" name="notice" value="sms" /> 短信</label>
  </fieldset>

  <button type="submit">提交</button>
  <button type="button" id="clearName">清空</button>
</form>

<script>
  const agree = document.querySelector('#agree');
  agree.indeterminate = true;

  clearName.addEventListener('click', () => {
    document.querySelector('[name="username"]').value = '';
  });
</script>
```

扩大 checkbox 点击区域的最佳做法是使用 `label` 包裹或用 `for` 关联，不要只依赖扩大视觉盒子。

登录表单密码被浏览器记住后，前端页面不应该提供“读取明文密码”的能力。浏览器可能允许用户在开发者工具或密码管理器里查看，但应用应通过找回密码、重置密码流程解决。

面试回答：

> `readonly` 可聚焦且会提交，`disabled` 不可交互且不会提交。`button` 在表单内默认是 `submit`，所以非提交按钮要写 `type="button"`。`inputmode` 只是键盘提示，不是校验规则。checkbox 还有 JS 可设置的 `indeterminate` 半选视觉态，radio 通过相同 `name` 分组互斥。

## 参考来源

- [MDN: `<input>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
- [MDN: `<button>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
- [MDN: HTML attribute `inputmode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)
