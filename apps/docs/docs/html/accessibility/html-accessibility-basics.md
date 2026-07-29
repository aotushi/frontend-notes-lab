# HTML 可访问性基础

## 问题

什么是 HTML 可访问性？为什么需要处理可访问名称、文本替代、键盘操作和焦点？实际开发中应该按什么顺序完成这些工作？

## 结论

### 是什么

HTML 可访问性是让不同用户能够感知、理解并操作页面。它服务的不只是屏幕阅读器用户，还包括键盘用户、低视力用户、语音控制用户、暂时无法使用鼠标的用户，以及使用不同输入设备的人。

它建立在 [HTML 语义化](/html/semantics/semantic-html) 之上，但两者并不完全相同：

- **语义化**负责表达内容是什么，例如标题、导航、按钮和表单控件。
- **可访问性**还要保证这些内容具有可识别的名称、关系和状态，能够通过键盘操作，并在变化时提供可感知的反馈。

浏览器会根据 HTML、ARIA 和当前状态生成可访问性树，再通过可访问性 API 把信息提供给屏幕阅读器等辅助技术。理解这条路径后，可以把控件需要表达的信息归纳为四类：

| 信息             | 回答的问题           | 常见来源                                              |
| ---------------- | -------------------- | ----------------------------------------------------- |
| **名称（name）** | 这是什么             | 可见文字、`label`、`alt`、`aria-label`、`aria-labelledby` |
| **角色（role）** | 它是什么类型的对象   | `button`、`a[href]`、`input` 等原生元素，必要时使用 ARIA |
| **状态（state）** | 它当前处于什么状态   | `checked`、`disabled`、`aria-expanded`、`aria-invalid` |
| **关系（relation）** | 它与哪些内容相关联 | `for`、`aria-describedby`、`fieldset` 与 `legend`     |

可访问名称和辅助说明要区分：`label`、`aria-label`、`aria-labelledby` 等用于回答“这是什么”，`aria-describedby` 用于补充格式要求、帮助文字或错误原因，不能代替控件名称。

下面的最小示例使用原生复选框说明名称、角色、状态和关系。它的初始状态是“未选中”，用户操作后浏览器会自动更新选中状态，不需要提前伪造错误或手动维护角色：

```html
<form>
  <!--
    名称：来自可见的 label。
    角色：type="checkbox" 提供原生复选框角色。
    状态：初始未选中，用户操作后浏览器自动更新选中状态。
    关系：for 与 id 关联名称，aria-describedby 关联补充说明。
  -->
  <input
    id="updates"
    name="updates"
    type="checkbox"
    aria-describedby="updates-hint"
  >
  <label for="updates">接收后续活动通知</label>

  <p id="updates-hint">默认不订阅；勾选后，可以随时在通知设置中取消。</p>

  <button type="submit">保存设置</button>
</form>
```

其中，`label` 提供复选框的可访问名称，原生 `input` 提供复选框角色并让浏览器维护选中状态，`for` 与 `id` 建立名称关系，`aria-describedby` 关联不会随输入消失的补充说明。这个示例优先依赖原生 HTML，只用 ARIA 补充原生结构没有直接表达的说明关系。

### 为什么

视觉样式只能告诉看得见当前画面的用户“它看起来是什么”，鼠标点击也只能证明指针用户可以操作。辅助技术和键盘用户还需要浏览器能够识别相同的含义与行为。

| 只依赖视觉或鼠标时的问题       | 可能造成的障碍                                           |
| ------------------------------ | -------------------------------------------------------- |
| 输入框旁边只有一段普通文字     | 辅助技术无法确定文字是不是输入框的名称                   |
| 错误信息只变成红色             | 看不到颜色的用户不知道发生了什么，控件也没有关联错误原因 |
| `div` 绑定点击事件模拟按钮     | 元素没有按钮角色，也没有原生的聚焦、Enter 和 Space 行为  |
| 展开内容只改变画面             | 用户不知道控件当前是展开还是收起                         |
| 图片没有合适的文本替代         | 图片承载的信息或操作目的无法通过非视觉方式获得           |
| 弹窗打开后焦点仍留在背景页面   | 键盘用户难以找到新内容，也可能继续操作被遮挡的区域       |
| 提交结果只更新页面中的一段文字 | 屏幕阅读器用户可能不知道页面已经发生变化                 |

正确的 HTML 能让浏览器提供大量默认能力。例如，原生 `button` 自带按钮角色、键盘行为和禁用状态；正确关联的 `label` 同时提供控件名称并扩大可点击区域。ARIA 只能补充或修正暴露给辅助技术的语义，不会自动增加键盘行为、焦点管理或视觉样式。

### 怎么做

实际开发可以按照下面的顺序判断。顺序很重要：先利用浏览器已有的原生能力，再补充缺失的信息，最后才考虑 ARIA 和自定义交互。

1. **先建立可理解的内容与页面结构。** 使用正确的标题层级以及 `nav`、`main`、`article`、`form` 等元素；页面去掉 CSS 后，内容顺序仍然应该能够读懂。
2. **优先使用原生交互元素。** 跳转使用 `a[href]`，操作使用 `button`，输入使用对应的表单控件。原生元素已经提供角色、状态和大部分键盘行为。
3. **为控件提供可访问名称。** 表单控件通常使用 `label`；图标按钮优先保留可见文字，确实没有可见文字时再提供 `aria-label` 或 `aria-labelledby`。`placeholder` 会在输入后消失，不能代替名称。
4. **建立分组、帮助和错误关系。** 相关控件使用 `fieldset` 与 `legend` 分组，补充说明和错误信息使用 `aria-describedby` 关联。错误不能只依赖颜色，还要提供文字并暴露无效状态。
5. **按用途处理图片和其他非文本内容。** 信息图片的 `alt` 替代图片含义；装饰图片使用空 `alt=""`；作为链接或按钮唯一内容的图片描述操作目的；复杂图表提供简短 `alt`，并在正文或相邻区域给出完整解释。
6. **保证功能可通过键盘完成。** 原生可用控件通常已经进入 Tab 顺序；隐藏、禁用或 `type="hidden"` 的控件除外。不要给普通容器批量添加 `tabindex="0"`，自定义复合控件则应实现其设计模式要求的方向键、Enter、Space、Escape 等操作。
7. **让焦点顺序合理且焦点始终可见。** 顺序应保留内容含义和可操作性，不要求机械地复制所有视觉位置。避免正数 `tabindex`；弹窗、错误汇总或页面局部切换后，只在用户需要定位新上下文时移动焦点，并在关闭临时界面后把焦点还给触发元素。
8. **暴露状态并通知重要变化。** 优先使用 `checked`、`disabled`、`required` 等原生状态；自定义展开控件同步维护 `aria-expanded` 等属性。重要且不会自动获得焦点的结果，可以使用 `role="status"` 或合适的 live region 通知。
9. **最后再使用 ARIA。** 原生 HTML 已经能表达时不要重复添加角色；使用 ARIA 角色就意味着开发者必须同时兑现对应的键盘交互、状态同步和焦点规则。

`label` 有两种有效关联方式：通过 `for` 与控件的 `id` 显式关联，或者把控件放在 `label` 内形成隐式关联。显式关联通常更容易布局和检查；不论采用哪一种，关键都是让浏览器真正建立标签与可标记控件之间的关系。

图片的 `alt` 也没有脱离上下文的固定答案。同一张图片在文章中可能是信息内容，在已有相邻文字时可能只是重复信息，在链接中又可能承担操作目的；应根据图片在当前页面中的职责决定文本替代。

后面的完整实例按九步清单统一实现，而不是为每一步拆出一个孤立代码片段：

| 步骤 | 完整实例中的对应位置 |
| --- | --- |
| 1. 内容与页面结构 | `lang`、`title`、`header`、`nav`、`main`、`article`、标题层级 |
| 2. 原生交互元素 | `a[href]`、`input`、`button`、`form` |
| 3. 可访问名称 | `label`、有意义的链接与按钮文字、导航名称 |
| 4. 分组、帮助与错误关系 | `fieldset`、`legend`、`aria-describedby`、错误文本 |
| 5. 非文本内容 | 信息图片的 `alt`、`figcaption`、装饰图标的隐藏处理 |
| 6. 键盘操作 | 跳过链接、原生控件的 Tab 和键盘行为 |
| 7. 焦点管理 | `:focus-visible`、`tabindex="-1"`、提交失败后的 `focus()` |
| 8. 状态与动态反馈 | `required`、`aria-invalid`、`role="status"` |
| 9. ARIA 边界 | 只补充原生 HTML 没有表达完整的名称、关系、状态和反馈 |

第 6～8 步不能只靠静态标签完整实现，因此实例是一份同时包含 HTML、CSS 和 JavaScript 的完整页面。源码注释中的编号与这张表一一对应。

### 边界与验证

HTML 是可访问性的基础，但不是全部：

- 颜色对比、缩放与回流、焦点外观、触控目标和减少动画需要 CSS、设计与交互共同处理。
- 音视频还需要字幕、文字稿或音频描述，不能只依靠元素名称。
- 动态组件需要 JavaScript 正确维护状态和焦点；ARIA 不会替开发者完成这些行为。
- 自动化检查只能发现部分问题。还应使用键盘实际走完整流程，检查浏览器无障碍树，并根据产品用户范围进行屏幕阅读器测试。

## HTML 可访问性实例

下面是一份活动报名页的完整源码。注释编号与“怎么做”的九步清单对应；真实项目应根据内容选用，不需要机械复制所有属性。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- 1. 内容与页面结构：标题帮助用户识别当前页面 -->
    <title>无障碍工作坊报名 | 前端社区</title>

    <style>
      /* 6. 键盘操作：跳过链接平时移出画面，获得键盘焦点时显示 */
      .skip-link {
        position: fixed;
        top: -4rem;
        left: 1rem;
        z-index: 10;
        padding: 0.75rem 1rem;
        background: #ffffff;
        color: #111111;
      }

      .skip-link:focus {
        top: 1rem;
      }

      /* 7. 焦点管理：不删除焦点提示，并为键盘焦点提供清晰外观 */
      :focus-visible {
        outline: 3px solid #b45309;
        outline-offset: 3px;
      }

      /* 4. 错误关系：颜色只是辅助信号，页面还会显示并关联错误文字 */
      [aria-invalid="true"] {
        border-color: #b91c1c;
      }

      .error {
        color: #b91c1c;
        font-weight: 700;
      }
    </style>
  </head>

  <body>
    <!-- 6. 键盘操作：允许键盘用户跳过重复导航 -->
    <a class="skip-link" href="#main-content">跳到主要内容</a>

    <!-- 1. 内容与页面结构：使用页面级 header、nav 和 main -->
    <header>
      <a href="/">前端社区</a>

      <!-- 9. ARIA 边界：nav 已有角色，aria-label 只补充导航用途 -->
      <nav aria-label="主导航">
        <a href="/events">活动</a>
        <a href="/articles">文章</a>
        <a href="/about">关于我们</a>
      </nav>
    </header>

    <!-- 7. 焦点管理：tabindex="-1" 允许按需把焦点移到主内容 -->
    <main id="main-content" tabindex="-1">
      <article aria-labelledby="event-title">
        <header>
          <h1 id="event-title">Web 可访问性实践工作坊</h1>
          <p>
            时间：
            <time datetime="2026-08-16T14:00:00+08:00">2026 年 8 月 16 日 14:00</time>
          </p>
        </header>

        <figure>
          <!--
            5. 非文本内容：这是信息图片，alt 描述图片对当前内容的意义。
            如果图片只是装饰，应改用 alt=""；复杂图表还要在相邻正文中提供完整解释。
          -->
          <img
            src="/images/accessibility-workshop.jpg"
            alt="讲师正在演示如何使用键盘和屏幕阅读器检查网页"
            width="960"
            height="540"
          >
          <figcaption>工作坊包含键盘操作、无障碍树和表单测试。</figcaption>
        </figure>

        <section aria-labelledby="signup-title">
          <h2 id="signup-title">填写报名信息</h2>
          <p id="required-note">标有“必填”的项目必须填写。</p>

          <!--
            2. 原生交互元素：表单、输入框、复选框和按钮均使用原生元素。
            novalidate 关闭浏览器提示气泡，由脚本显示并关联可访问错误信息。
          -->
          <form id="signup-form" novalidate>
            <!-- 4. 分组与关系：fieldset、legend 和说明文字共同描述这一组控件 -->
            <fieldset aria-describedby="required-note">
              <legend>联系方式</legend>

              <p>
                <!-- 3. 可访问名称：显式 label 的 for 必须与控件 id 一致 -->
                <label for="name">姓名（必填）</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  required
                  aria-describedby="name-hint"
                >
                <span id="name-hint">请输入用于活动签到的姓名。</span>
                <span id="name-error" class="error" hidden>请输入姓名。</span>
              </p>

              <p>
                <label for="email">电子邮箱（必填）</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  aria-describedby="email-hint"
                >
                <span id="email-hint">报名结果将发送到这个邮箱。</span>
                <span id="email-error" class="error" hidden>请输入有效的电子邮箱。</span>
              </p>
            </fieldset>

            <p>
              <input id="updates" name="updates" type="checkbox">
              <label for="updates">接收后续活动通知</label>
            </p>

            <button type="submit">
              <!-- 3、5. 可见文字提供名称，装饰图标不重复朗读 -->
              <svg aria-hidden="true" focusable="false" width="16" height="16">
                <path d="M2 8h12M9 3l5 5-5 5"></path>
              </svg>
              提交报名
            </button>

            <!-- 8. 动态反馈：role="status" 播报更新，但不会突然抢走焦点 -->
            <p id="form-status" role="status"></p>
          </form>
        </section>
      </article>
    </main>

    <footer>
      <p><a href="/accessibility">查看本站无障碍说明</a></p>
    </footer>

    <script>
      const form = document.querySelector('#signup-form')
      const status = document.querySelector('#form-status')

      const fields = [
        {
          control: document.querySelector('#name'),
          hintId: 'name-hint',
          error: document.querySelector('#name-error'),
        },
        {
          control: document.querySelector('#email'),
          hintId: 'email-hint',
          error: document.querySelector('#email-error'),
        },
      ]

      function updateField(field) {
        const isValid = field.control.validity.valid

        if (isValid) {
          clearFieldError(field)
        } else {
          /* 4、8. 错误出现后，暴露无效状态并关联具体错误原因 */
          field.control.setAttribute('aria-invalid', 'true')
          field.control.setAttribute(
            'aria-describedby',
            `${field.hintId} ${field.error.id}`,
          )
          field.error.hidden = false
        }

        return isValid
      }

      function clearFieldError(field) {
        field.control.removeAttribute('aria-invalid')
        field.control.setAttribute('aria-describedby', field.hintId)
        field.error.hidden = true
      }

      form.addEventListener('submit', (event) => {
        event.preventDefault()
        status.textContent = ''

        let firstInvalidControl = null

        for (const field of fields) {
          const isValid = updateField(field)

          if (!isValid && firstInvalidControl === null) {
            firstInvalidControl = field.control
          }
        }

        if (firstInvalidControl) {
          /* 7. 提交失败后，把键盘焦点移到第一个需要修正的控件 */
          firstInvalidControl.focus()
          return
        }

        /* 8. 成功消息不获取焦点，由 role="status" 通知辅助技术 */
        status.textContent = '报名已提交，请检查邮箱中的确认信息。'
        form.reset()

        for (const field of fields) {
          clearFieldError(field)
        }
      })

      for (const field of fields) {
        field.control.addEventListener('input', () => {
          /* 只在用户已经触发过错误后进行即时校验，避免过早打断输入 */
          if (field.control.hasAttribute('aria-invalid')) {
            updateField(field)
          }
        })
      }
    </script>
  </body>
</html>
```

这个实例展示的是一条完整路径：先使用原生结构与控件，再补充名称和关系；提交失败时暴露错误状态并移动焦点，提交成功时保留当前焦点并播报结果。不同场景可以删减其中的部分规则，但不能只复制 ARIA 属性而忽略与之配套的行为。

## 参考来源

- [WHATWG HTML: The `label` element](https://html.spec.whatwg.org/multipage/forms.html#the-label-element)
- [MDN: HTML accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)
- [MDN: The `label` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label)
- [W3C WAI: Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C WAI: Images tutorial](https://www.w3.org/WAI/tutorials/images/)
- [W3C WAI: Developing a keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [W3C WAI: No ARIA is better than bad ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
