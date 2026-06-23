# CDN、懒加载与图片优化

## 问题

CDN 是什么、怎么工作的？图片懒加载如何实现？前端有哪些图片优化手段，各种格式适合什么场景？

## 结论

### CDN

CDN（Content Delivery Network，内容分发网络）通过把内容分发到离用户最近的边缘节点来降低延迟、提升加载速度。

**三个核心组成：**

- **分发服务系统**：由边缘 Cache 节点组成，直接响应用户请求并缓存内容，从源站同步更新
- **负载均衡系统**：全局负载均衡（GSLB）根据就近原则选择最优节点；本地负载均衡（SLB）处理节点内部调度
- **运营管理系统**：负责计费、统计、客户管理等业务层面的工作

**CDN 的作用：**

- 性能：用户从最近的节点拿数据，延迟更低；请求分摊到 CDN，减轻源服务器负载
- 安全：流量监控过滤 DDoS；全链路 HTTPS（源站 → CDN 节点 → ISP）防 MITM

**CDN 的原理（CNAME 重定向流程）：**

不使用 CDN 时，DNS 解析依次经过：浏览器缓存 → 操作系统缓存（hosts）→ 路由器缓存 → ISP LDNS → 根域名服务器（根 → TLD → SLD），最终返回源服务器 IP。

使用 CDN 后，域名的 DNS 解析会指向一个 CNAME（别名），将解析权交给 CDN 自己的 DNS 服务器：

1. 浏览器发起域名解析，发现 CNAME 指向 CDN 专用 DNS
2. CDN DNS 返回全局负载均衡设备的 IP
3. 用户向全局负载均衡发起请求
4. 全局负载均衡根据用户 IP 和请求内容，选定区域负载均衡
5. 区域负载均衡选出最合适的缓存节点，将 IP 层层返回
6. 用户向该缓存节点发起请求
7. 节点响应请求；若未缓存则逐级向上回源，直到源站

**常见使用场景：**

- 托管静态资源（JS/CSS/图片）或整站 CDN 部署
- 开源项目引用第三方 CDN（jsDelivr、unpkg 等）
- 直播流媒体（CDN 用主动推送代替回源，避免超大流量回源性能问题）

### 懒加载

懒加载（延迟加载）是在用户滚动到可视区域前不加载图片，减少首屏不必要的网络请求。适合图片多、页面长的列表页。

**特点：**

- 减少首屏请求数和带宽消耗，降低服务器压力
- 避免大量图片同时加载导致首屏等待时间增加
- 防止非视口图片的加载阻塞其他关键资源

**实现原理：**

图片的加载由 `src` 属性触发。将真实地址存在 `data-src`，初始 `src` 设为占位图，滚动时判断图片是否进入可视区，进入后把 `data-src` 赋给 `src`。

判断条件：`img.offsetTop < window.innerHeight + document.body.scrollTop`

**与预加载的区别：**

| | 懒加载 | 预加载 |
| --- | --- | --- |
| 时机 | 需要时才加载（延迟） | 提前加载到缓存（提前） |
| 服务器压力 | 减轻 | 增加 |
| 适用场景 | 长列表、图片多的页面 | 下一页/下一步资源预取 |

### 懒加载与预加载的区别

两者都是提升网页性能的方式，但策略相反：

| | 懒加载 | 预加载 |
| --- | --- | --- |
| 加载时机 | 用户需要时才加载（延迟） | 提前加载到缓存（提前） |
| 服务器压力 | 减轻（减少无用请求） | 增加（提前消耗带宽） |
| 体验提升点 | 首屏加载更快、节省带宽 | 后续页面/资源使用时无需等待 |
| 适用场景 | 长列表、图片多的页面 | 下一步操作所需资源的预取 |

- **懒加载**：将图片真实路径存在 `data-src`，滚动到可视区再赋值给 `src`，减少首屏不必要请求
- **预加载**：通过创建 `Image` 对象并设置 `src`，或使用 `<link rel="preload">`，提前将资源加载到缓存，后续使用时直接命中缓存

### 图片优化

**常用优化手段：**

- 用 CSS 代替修饰类图片（渐变、边框等）
- 移动端用 CDN 按屏幕宽度裁剪图片，不加载原图
- 小图用 base64 内联（减少 HTTP 请求）
- 多图标合成雪碧图（CSS Sprites）
- 优先使用 WebP；图标用 SVG；照片用 JPEG

**各格式对比：**

| 格式 | 压缩 | 色彩 | 透明 | 动画 | 适用场景 |
| --- | --- | --- | --- | --- | --- |
| BMP | 无压缩 | 索引色/直接色 | — | — | 几乎不用于 Web |
| GIF | 无损（LZW） | 索引色（8-bit） | ✓ | ✓ | 简单动画；已被 WebP/APNG 替代 |
| JPEG | 有损 | 直接色 | — | — | 照片、复杂色彩图 |
| PNG-8 | 无损 | 索引色 | ✓ | — | GIF 的更好替代（更小体积） |
| PNG-24 | 无损 | 直接色 | ✓ | — | 需要高质量无损图（体积大） |
| SVG | 矢量 | — | ✓ | ✓ | Logo、Icon（任意缩放不失真） |
| WebP | 有损/无损均支持 | 直接色 | ✓ | ✓ | Web 首选（兼容 Chrome/Edge/Safari 16+） |

WebP 压缩优势：
- 无损模式比同质量 PNG 小约 **26%**
- 有损模式比同精度 JPEG 小 **25%~34%**
- 支持透明度，无损透明图只比 PNG 多 22% 大小

## Demo

懒加载原生实现：

```html
<img src="loading.gif" data-src="real-image.jpg" />
```

```js
const imgs = document.querySelectorAll('img[data-src]');

function lazyLoad() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const winHeight = window.innerHeight;
  imgs.forEach(img => {
    if (img.offsetTop < scrollTop + winHeight) {
      img.src = img.dataset.src;
    }
  });
}

window.addEventListener('scroll', lazyLoad);
lazyLoad(); // 初始触发一次
```

现代浏览器推荐用 `IntersectionObserver`，比 scroll 事件更高效：

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
```

也可以直接用原生 `loading="lazy"` 属性（现代浏览器均支持）：

```html
<img src="real-image.jpg" loading="lazy" />
```

## 参考来源

- [MDN: Lazy loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading)
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [web.dev: Use WebP images](https://web.dev/articles/serve-images-webp)
