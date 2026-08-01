# progress 与 meter 的区别

## 问题

`progress` 和 `meter` 分别表示什么？`value`、`max`、`min`、`low`、`high`、`optimum` 应该怎么使用？

## 结论

- `progress` 表示**任务完成进度**，例如上传、安装或批处理进度。
- `meter` 表示**已知范围内的度量值**，例如磁盘占用、评分、温度或库存水平。
- `progress` 的最小值固定为 `0`，不能写 `min`；没有 `value` 时表示进度未知。
- `meter` 可以使用 `min`、`max`、`low`、`high`、`optimum` 和 `value` 描述范围及理想区间。
- 两者都应该有可访问名称，并在文本中说明数值含义，不能只依赖颜色传递状态。

| 对比项 | `progress` | `meter` |
| --- | --- | --- |
| 表达内容 | 一项任务完成了多少 | 一个值在已知范围中的位置 |
| 常见场景 | 文件上传、加载、安装进度 | 磁盘占用、评分、电量、库存 |
| 主要属性 | `value`、`max` | `value`、`min`、`max`、`low`、`high`、`optimum` |
| 未知状态 | 删除 `value`，表示不确定进度 | 不适用，必须有当前度量值 |
| 是否适合倒计时 | 只有表达任务完成程度时适合 | 通常不适合 |

### `progress` 的两种状态

```html
<!-- 已知完成比例：45 / 100。 -->
<progress value="45" max="100">45%</progress>

<!-- 未知还要等待多久：不要写 value。 -->
<progress>正在处理</progress>
```

`progress` 中的文本主要作为不支持该元素时的回退内容，不能代替可访问名称。可以使用 `label`、`aria-label` 或 `aria-labelledby` 提供名称。

### `meter` 的范围

```html
<meter min="0" max="100" low="60" high="85" optimum="0" value="72">
  已使用 72%
</meter>
```

这里表示磁盘占用范围是 `0–100`，`60` 以下较理想，超过 `85` 进入较高区间。`optimum="0"` 表示这个场景中数值越低越理想。`low` 和 `high` 是区间边界，不等于最小值和最大值。

### 完整实例

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>progress 与 meter</title>
  </head>

  <body>
    <main>
      <h1>任务与容量状态</h1>

      <section aria-labelledby="upload-title">
        <h2 id="upload-title">文件上传</h2>

        <!-- progress 表示一项任务的完成程度。 -->
        <label for="upload-progress">上传进度</label>
        <progress id="upload-progress" value="0" max="100">0%</progress>
        <output id="upload-status" for="upload-progress" aria-live="polite">尚未开始</output>

        <button id="start-upload" type="button">模拟上传</button>
      </section>

      <section aria-labelledby="storage-title">
        <h2 id="storage-title">存储空间</h2>

        <!-- meter 表示已知范围内的当前度量值，不是任务进度。 -->
        <label for="storage-usage">已使用 72 GB，共 100 GB</label>
        <meter
          id="storage-usage"
          min="0"
          max="100"
          low="60"
          high="85"
          optimum="0"
          value="72"
        >
          72 GB / 100 GB
        </meter>
      </section>
    </main>

    <script>
      const button = document.querySelector('#start-upload');
      const progress = document.querySelector('#upload-progress');
      const status = document.querySelector('#upload-status');

      button.addEventListener('click', () => {
        button.disabled = true;
        progress.value = 0;
        status.value = '上传中：0%';

        const timer = setInterval(() => {
          progress.value = Math.min(progress.value + 10, 100);
          status.value = `上传中：${progress.value}%`;

          if (progress.value === 100) {
            clearInterval(timer);
            status.value = '上传完成';
            button.disabled = false;
          }
        }, 300);
      });
    </script>
  </body>
</html>
```

旧资料中“IE、Safari 不支持”的概括已经过时。现代浏览器已广泛支持这两个元素，实际项目更应该关注语义、可访问名称和自定义样式差异。

## 参考来源

- [MDN: `<progress>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress)
- [MDN: `<meter>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter)
- [WHATWG HTML: The progress element](https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element)
- [WHATWG HTML: The meter element](https://html.spec.whatwg.org/multipage/form-elements.html#the-meter-element)
