# Data URL

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- Data URL概述

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### Data URL概述

##### 是什么
> Data URL（以前称 Data URI）是一种将资源内容直接嵌入 URL 中的方案。

其本质是：
- 不再单独请求资源
- 而是把资源本身直接写进 HTML / CSS / JS 中

常用于：
- 小图片
- SVG
- icon
- 字体
- base64 图片预览
##### 基本格式

```txt
data:[mime-type][;base64],data
```

示例：

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...">
```

结构说明：

```txt
data:
    协议头

image/png
    MIME 类型

;base64
    表示后续数据使用 Base64 编码

iVBOR...
    实际资源内容
```

---

##### 浏览器处理流程

普通资源：

```txt
HTML
→ 发现 img/src
→ 发起 HTTP 请求
→ 下载资源
→ 解码渲染
```

Data URL：

```txt
HTML
→ 发现 data:
→ 直接解码
→ 渲染资源
```

因此：

- 不会产生额外 HTTP 请求
    
- 不需要 DNS/TCP/TLS/HTTP 建连
    

---

##### 常见使用场景

###### HTML 图片

```html
<img src="data:image/png;base64,xxx">
```

---

###### CSS 背景图

```css
background-image: url("data:image/png;base64,xxx");
```

---

###### SVG 内嵌

```html
<img src="data:image/svg+xml,<svg>...</svg>">
```

SVG 通常甚至不需要 base64。

---

###### 文件预览

```js
const reader = new FileReader()

reader.readAsDataURL(file)
```

结果：
```txt
data:image/png;base64,...
```

常用于：
- 上传前图片预览
- 本地文件展示
---

##### 优点

###### 减少 HTTP 请求
适用于：
- icon
- 小图
- loading 图
尤其在 HTTP/1.1 时代收益明显。
###### 减少请求延迟

省去：
```txt
DNS
→ TCP 传输控制协议
→ TLS 传输层安全协议
→ HTTP
```

---

###### 单文件化

适合：
- 离线 HTML
- 邮件模板
- demo 页面
- 导出页面
---

##### 缺点

###### Base64 会导致体积膨胀

通常：

```txt
原始文件 × 1.33
```

原因：
```txt
3 字节 → 4 字符
```

---

###### 无法独立缓存

普通图片：

```txt
logo.png
```

浏览器可以单独缓存。

Data URL：

```txt
跟 HTML/CSS 绑定
```

HTML 改动后：

- 整个文件重新下载
    
- 无法复用缓存
    

---

###### 增大 HTML/CSS 体积

如果嵌入大资源：

- HTML 变大
    
- 解析变慢
    
- 内存占用增加
    

---

###### 不利于资源复用

多个页面引用同一资源时：

- 每个页面都会重复保存一份
    

---

##### 现代 Web 中的定位

HTTP/2、HTTP/3 出现后：
- 多路复用
- 并发连接优化

已经显著降低了 HTTP 请求成本。

因此：
```txt
Data URL 已不再是主要性能优化方案
```

现代最佳实践：
- 小资源：适合
- 大资源：不推荐

通常建议：
```txt
< 5KB ~ 10KB 的资源可考虑 Data URL
```

##### Data URL vs Blob URL

###### Data URL

特点
- 内容直接写进 URL
- 本质是字符串

示例：

```txt
data:image/png;base64,...
```

适合：
- 小资源
- 简单预览
---
###### Blob URL

示例：

```js
URL.createObjectURL(blob)
```

生成：

```txt
blob:http://xxx/abcd
```

特点：

- 浏览器内部内存引用
- 不直接保存真实数据

适合：
- 大文件
- 视频
- 本地文件
- 上传预览

Blob URL 通常性能优于 Data URL。

---
###### 总结

```txt
Data URL 是一种将资源内容直接嵌入 URL 的方案。

优点：
- 减少 HTTP 请求
- 适合小资源内联

缺点：
- Base64 导致体积膨胀
- 无法独立缓存
- 不适合大资源

现代 Web 中通常仅用于小型图片、SVG、icon 等场景。
```

### 精灵图和 Base64 如何选择

精灵图和 Base64 都是为了减少零散小资源请求，但适用场景不同。

| 方案 | 适合场景 | 主要问题 |
| --- | --- | --- |
| CSS Sprite | 多个小图标、多处复用、需要独立缓存 | 维护坐标麻烦，响应式和多倍图管理复杂 |
| Base64 / Data URL | 很小、很少复用、和页面或 CSS 强绑定的小资源 | 体积膨胀约 33%，无法独立缓存 |

现代项目中，如果使用 HTTP/2/HTTP/3、构建工具和图标组件，精灵图的收益已经没有过去那么绝对。通常可以这样判断：

- 图标能用 SVG symbol、icon font 或组件库时，优先用更可维护的方案。
- 小于几 KB 且只在当前 CSS 中使用的小图，可考虑 Data URL。
- 会被多个页面复用的资源，不适合转成 Base64，应保留独立文件以便缓存。
- 大图不要转 Base64，会增大 HTML/CSS 体积并拖慢解析。

面试回答：

> 精灵图适合多个小图标合并请求并复用缓存；Base64 适合极小、低复用、和当前文件强绑定的资源。现代 HTTP/2/HTTP/3 降低了请求数量成本，所以不要机械追求合并。大资源和多页面复用资源应保留独立 URL。

## Demo

待补充：对比普通图片 URL、Data URL、Blob URL 的体积、缓存和预览场景。
