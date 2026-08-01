# HTML5 原生表单类型与约束校验

## 问题

HTML5 新增了哪些常用输入类型和校验能力？`required`、`pattern`、`min`、`max`、`step`、`input`、`change`、`invalid` 分别怎么使用？原生校验能代替服务端校验吗？

## 结论

- 优先选择符合数据含义的 `type`，让浏览器提供合适的控件、移动端键盘和基础校验。
- 简单约束优先使用 `required`、`pattern`、`min`、`max`、`step`、`minlength`、`maxlength` 等 HTML 属性。
- 跨字段或业务规则再使用 `setCustomValidity()` 等 JavaScript 能力补充。
- `input` 适合实时响应输入，`change` 通常在值确认后触发，`invalid` 在控件未通过约束校验时触发。
- 浏览器校验只改善用户体验，不能防止伪造请求；服务端必须再次校验同一份业务规则。

### 常用输入类型

| `type` | 适合的数据 | 主要特点 |
| --- | --- | --- |
| `email` | 邮箱地址 | 提供基本邮箱格式校验；加 `multiple` 后可输入多个邮箱 |
| `url` | 完整 URL | 提供 URL 格式校验 |
| `tel` | 电话号码 | 提示移动端使用电话键盘，但不会自动验证各国号码格式 |
| `search` | 搜索关键词 | 语义和部分浏览器外观针对搜索场景优化 |
| `number` | 数值 | 可配合 `min`、`max`、`step`，适合真正需要数值计算的数据 |
| `range` | 范围内的近似值 | 显示滑块，通常配合 `output` 展示当前值 |
| `date` / `time` | 日期或时间 | 浏览器提供相应输入界面，具体外观取决于平台 |
| `datetime-local` | 不含时区的本地日期时间 | 正确名称是 `datetime-local`，不要使用旧资料中的 `datetime` 或拼错的 `datatime` |
| `month` / `week` | 月份或周 | 适合按月、按周选择的业务数据 |
| `color` | 颜色 | 通常提供颜色选择器，提交值一般是颜色字符串 |

不支持某种新输入类型的浏览器通常会把它按普通文本框处理。因此仍要提供清楚的 `label`、格式说明和服务端校验，不能只依赖控件外观。

### 常用约束属性

| 属性 | 作用 | 注意点 |
| --- | --- | --- |
| `required` | 要求必须填写或选择 | 布尔属性，写出属性即表示启用 |
| `pattern` | 要求文本匹配指定模式 | 适用于文本类控件；同时提供可理解的格式说明 |
| `min` / `max` | 限制数字、日期或时间范围 | 属性值格式要与输入类型匹配 |
| `step` | 限制合法步长 | 常用于数字、日期和时间控件 |
| `minlength` / `maxlength` | 限制文本长度 | 不要用它代替业务层的数据长度校验 |
| `multiple` | 允许多个值或多个文件 | 常见于 `email` 和 `file` |
| `autocomplete` | 告诉浏览器字段用途 | 优先使用 `email`、`name`、`current-password` 等明确 token |
| `inputmode` | 提示移动端键盘类型 | 只影响输入体验，不产生校验规则 |
| `placeholder` | 提供简短输入提示 | 不能代替始终可见的 `label` |
| `form` | 用表单 `id` 关联控件 | 允许控件不写在 `form` 内部，适合特殊布局 |

### 校验和事件顺序

1. 用户输入时触发 `input`，适合更新预览、计数或清除已经解决的错误状态。
2. 用户确认或离开控件后通常触发 `change`。
3. 提交时浏览器先执行约束校验；不合法的控件触发 `invalid`。
4. 所有控件合法后才会继续触发 `submit`。

`invalid` 直接发生在不合法的控件上，并且不会冒泡。要在表单上统一监听，可以使用捕获阶段。不要在用户输入前预设 `aria-invalid="true"`；只有实际校验失败后才标记，输入恢复合法时再移除。

### 完整实例

下面的页面同时展示语义化输入类型、原生约束、实时值更新和错误状态。它没有关闭浏览器原生校验。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>原生表单类型与校验</title>

    <style>
      form {
        display: grid;
        gap: 1rem;
        max-width: 32rem;
      }

      label {
        display: grid;
        gap: 0.35rem;
      }

      [aria-invalid="true"] {
        outline: 2px solid #c62828;
      }
    </style>
  </head>

  <body>
    <main>
      <h1>创建活动</h1>

      <form id="event-form" action="/events" method="post">
        <label for="contact-email">
          联系邮箱
          <input
            id="contact-email"
            name="email"
            type="email"
            autocomplete="email"
            required
          >
        </label>

        <label for="event-date">
          活动日期
          <input
            id="event-date"
            name="date"
            type="date"
            min="2026-01-01"
            required
          >
        </label>

        <label for="attendee-count">
          参加人数（1–50）
          <input
            id="attendee-count"
            name="attendees"
            type="number"
            min="1"
            max="50"
            step="1"
            value="1"
            required
          >
        </label>

        <label for="satisfaction">
          预期满意度：<output id="satisfaction-value" for="satisfaction">80</output>
          <input
            id="satisfaction"
            name="satisfaction"
            type="range"
            min="0"
            max="100"
            step="5"
            value="80"
          >
        </label>

        <label for="invite-code">
          邀请码
          <input
            id="invite-code"
            name="inviteCode"
            type="text"
            pattern="[A-Z]{2}-[0-9]{4}"
            aria-describedby="invite-code-help"
            required
          >
        </label>
        <small id="invite-code-help">格式示例：CN-2026</small>

        <label for="theme-color">
          主题颜色
          <input id="theme-color" name="themeColor" type="color" value="#2563eb">
        </label>

        <button type="submit">创建活动</button>
      </form>

      <p id="form-status" role="status"></p>
    </main>

    <script>
      const form = document.querySelector('#event-form');
      const satisfaction = document.querySelector('#satisfaction');
      const satisfactionValue = document.querySelector('#satisfaction-value');
      const formStatus = document.querySelector('#form-status');

      // input 在滑块数值变化时持续触发，用它实时更新可见值。
      satisfaction.addEventListener('input', () => {
        satisfactionValue.value = satisfaction.value;
      });

      // invalid 不冒泡，因此在表单上使用捕获阶段统一处理。
      form.addEventListener(
        'invalid',
        (event) => {
          event.target.setAttribute('aria-invalid', 'true');
        },
        true
      );

      // 用户修正内容并重新通过校验后，移除错误状态。
      form.addEventListener('input', (event) => {
        const control = event.target;
        if (!(control instanceof HTMLInputElement)) return;
        if (control.checkValidity()) control.removeAttribute('aria-invalid');
      });

      form.addEventListener('submit', (event) => {
        // 实际项目可以在这里改用 fetch；服务端仍需重新校验。
        event.preventDefault();
        const data = new FormData(form);
        formStatus.textContent = `表单校验通过，准备提交 ${data.get('email')} 的活动。`;
      });
    </script>
  </body>
</html>
```

## 参考来源

- [MDN: `<input>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
- [MDN: Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation)
- [MDN: `invalid` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event)
- [MDN: `autocomplete` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
