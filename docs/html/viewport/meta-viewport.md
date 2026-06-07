# meta viewport

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- meta viewport

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### meta viewport

##### 是什么
> meta viewport 是一个 HTML 元素，用于控制网页在移动设备上的显示和缩放行为。它通过设置 viewport 元素的属性，告诉浏览器如何调整页面的尺寸和缩放，以适应不同屏幕大小和分辨率的设备。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
```

- name 为 viewport 表示供移动设备使用
- content 定义了 viewport 的属性
    - width 表示显示宽度为设备宽度（兼容苹果）
    - initial-scale 表示设备与视口的缩放比率（兼容IE）

## Demo

待补充：在移动视口下对比有无 viewport meta 时的布局宽度和缩放表现。
