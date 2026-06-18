# 高级前端开发工程师（SEO 方向）面试完全指南

> 覆盖方向：SSR/SSG · Core Web Vitals · SEO 技术深度 · 性能工程 · 浏览器原理 · React/Next.js · **Vue/Nuxt** · 工程化 · 工具链  
> 内容基于 2024–2025 年主流面试题库整理，附最佳回答思路与代码示例

---

## 目录

1. [SSR / SSG / ISR 深度](#一-ssr--ssg--isr-深度)
2. [Core Web Vitals 全面解析](#二-core-web-vitals-全面解析)
3. [SEO 技术深度](#三-seo-技术深度)
4. [前端性能工程](#四-前端性能工程)
5. [浏览器渲染原理（与 SEO/性能强相关）](#五-浏览器渲染原理与-seo性能强相关)
6. [React / Next.js 进阶](#六-react--nextjs-进阶)
7. [Vue 3 / Nuxt 3 深度](#七-vue-3--nuxt-3-深度)
8. [工程化与 CI/CD](#八-工程化与-cicd)
9. [网络层优化](#九-网络层优化)
10. [工具链实战](#十-工具链实战)
11. [加分项：Nginx / Cloudflare / 多语言](#十一-加分项nginx--cloudflare--多语言)
12. [高频面试题 & 最佳回答](#十二-高频面试题--最佳回答)
13. [Checklist：上线前 SEO 自查](#十三-checklist上线前-seo-自查)

---

## 一、SSR / SSG / ISR 深度

### 1.1 四种渲染模式全景对比

| 模式 | 渲染时机 | HTML 产出方 | 首字节时间 | 适合场景 | 典型框架 API |
|------|---------|------------|-----------|---------|------------|
| **CSR** | 浏览器执行 JS 后 | 客户端 | 最慢 | 后台管理、登录后页面 | create-react-app |
| **SSR** | 每次请求时 | 服务器实时生成 | 中（受服务器性能影响） | 实时数据、个性化页面 | `getServerSideProps` / Server Component |
| **SSG** | 构建阶段 | 构建机一次性输出 | 最快（CDN 直出） | 博客、文档、落地页 | `getStaticProps` |
| **ISR** | 构建 + 按需重新生成 | 服务器后台更新 | 快（旧页先响应） | 电商商品页、新闻 | `revalidate` / On-Demand ISR |
| **PPR**（Partial Prerendering，Next.js 14+） | 静态壳 + 动态流 | 混合 | 极快 | 静态布局 + 动态内容混合 | `<Suspense>` + Server Component |

> **PPR 是 2024 年的新考点**：页面静态壳在构建期生成，动态部分（购物车数量、用户头像）通过流式 SSR 补充，兼顾 SEO 和个性化。

---

### 1.2 Next.js App Router 数据获取完整体系

#### Server Component（默认，推荐）
```tsx
// app/posts/[slug]/page.tsx
// 直接 async/await，无需 getServerSideProps
export default async function PostPage({ params }: { params: { slug: string } }) {
  // 这个 fetch 在服务器执行，不会暴露给客户端
  const post = await fetch(`https://api.example.com/posts/${params.slug}`, {
    // 控制缓存行为
    next: { revalidate: 3600 }, // ISR：1小时重新验证
    // next: { tags: ['post'] }, // On-Demand ISR：按 tag 精准重验
    // cache: 'no-store',        // 等效 SSR：每次请求不缓存
  }).then(r => r.json());

  return <article>{post.content}</article>;
}
```

#### generateMetadata（动态 SEO 元数据）
```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await fetchPost(params.slug); // 与页面共享缓存，不会重复请求

  return {
    title: `${post.title} | MyBlog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://example.com/posts/${params.slug}`,
      languages: { 'zh-CN': `/zh/posts/${params.slug}` },
    },
  };
}
```

#### On-Demand ISR（按需精准重验）
```ts
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { tag, secret } = await request.json();
  if (secret !== process.env.REVALIDATE_SECRET) return new Response('Unauthorized', { status: 401 });
  
  revalidateTag(tag); // 仅清除打了该 tag 的缓存
  return Response.json({ revalidated: true });
}
// CMS 内容更新时 → 调用此 API → 下次请求即获得新页面
```

---

### 1.3 Hydration 机制深度

#### 完整生命周期
```
服务端执行 React 组件树
    → 生成 HTML 字符串（renderToString / renderToPipeableStream）
    → 将 HTML + 序列化的 props（__NEXT_DATA__）发送给浏览器
    → 浏览器展示 HTML（用户已能看到内容）
    → React 加载并执行 JS
    → React 对比服务端 HTML 与客户端虚拟 DOM
    → 绑定事件监听器（Hydration 完成）
    → 页面可以交互
```

#### Hydration Mismatch 排查手册

| 错误原因 | 典型表现 | 解决方案 |
|---------|---------|---------|
| 使用 `Math.random()` / `Date.now()` | 每次生成不同值 | 移到 `useEffect` 或传入固定 seed |
| 访问 `window` / `localStorage` | 服务端不存在该对象 | `typeof window !== 'undefined'` 判断 |
| 浏览器扩展修改 DOM | 第三方注入导致差异 | `suppressHydrationWarning` |
| 时区/语言依赖 | 服务器与客户端时区不同 | 统一使用 UTC，格式化在客户端进行 |
| CSS-in-JS（styled-components） | 样式注入顺序不同 | 配置 ServerStyleSheet |

#### Streaming SSR（React 18 新特性）
```tsx
// 流式渲染：HTML 分块传输，无需等待所有数据
// 慢速数据用 Suspense 包裹，不阻塞快速内容
export default function Page() {
  return (
    <>
      <Header />  {/* 立即发送 */}
      <Suspense fallback={<Skeleton />}>
        <SlowDataComponent />  {/* 数据就绪后追加发送 */}
      </Suspense>
    </>
  );
}
```

> **SEO 影响**：Google 支持流式传输（Chunked Transfer），搜索引擎可以抓取流式 SSR 页面的内容，不影响索引。

---

### 1.4 edge runtime vs nodejs runtime

```ts
// Next.js 支持在 Edge Network 运行 SSR
export const runtime = 'edge'; // 部署到 Cloudflare Workers / Vercel Edge

// 优势：冷启动近乎零、全球分布式
// 限制：不能使用 Node.js 原生 API（fs、crypto 的部分方法）
```

---

## 二、Core Web Vitals 全面解析

### 2.1 2024 年最新指标体系

> Google 已于 2024 年 3 月正式用 **INP（Interaction to Next Paint）** 替换 FID。

| 指标 | 全称 | 良好 | 需改进 | 差 | 测量维度 |
|------|------|------|--------|---|---------|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | 2.5~4s | > 4s | 加载性能 |
| **INP** | Interaction to Next Paint | ≤ 200ms | 200~500ms | > 500ms | 交互响应性 |
| **CLS** | Cumulative Layout Shift | ≤ 0.1 | 0.1~0.25 | > 0.25 | 视觉稳定性 |

---

### 2.2 LCP 深度优化

#### LCP 元素识别
```js
// 通过 PerformanceObserver 获取真实 LCP 元素
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lcp = entries[entries.length - 1]; // 取最后一个（最终 LCP）
  console.log('LCP element:', lcp.element);
  console.log('LCP time:', lcp.startTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

#### LCP 优化分解：每个子阶段的目标

```
LCP 总时间 = TTFB + 资源加载延迟 + 资源下载时间 + 渲染延迟

TTFB          目标 < 600ms  → 使用 CDN、Edge SSR、减少服务端处理
资源加载延迟   目标 < 200ms  → 消除渲染阻塞 CSS/JS，添加 preload
资源下载时间   目标 < 800ms  → 压缩图片至 WebP，减小文件体积
渲染延迟       目标 < 200ms  → 避免动画/opacity 在 LCP 元素绘制前触发
```

#### fetchpriority 属性（2023+ 新特性）
```html
<!-- Hero 图片：显式提高加载优先级（Chromium 102+） -->
<img src="/hero.webp" fetchpriority="high" alt="Hero" width="1200" height="630">

<!-- 屏幕外图片：主动降低优先级 -->
<img src="/below-fold.jpg" fetchpriority="low" loading="lazy" alt="...">
```

---

### 2.3 INP 深度优化（2024 新考点）

#### INP vs FID 的本质区别
- **FID**：只测量 **第一次** 交互的 **输入延迟**（JS 主线程忙碌时间）
- **INP**：测量 **全部** 交互（点击、键盘、触摸）从输入到下一帧绘制的完整时间

#### INP 三段拆解
```
INP = 输入延迟 + 处理时间 + 呈现延迟

输入延迟（Input Delay）：主线程被长任务（Long Task）阻塞
处理时间（Processing）：事件回调执行时间
呈现延迟（Presentation Delay）：浏览器排版 + 绘制时间
```

#### 优化长任务（Long Task > 50ms）
```js
// 方案1：任务分片（scheduler.yield，Chrome 115+）
async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    
    // 每处理 50 条让出主线程，避免阻塞用户交互
    if (i % 50 === 0) {
      await scheduler.yield(); // 让浏览器处理待定的用户输入
    }
  }
}

// 方案2：Web Worker 处理 CPU 密集型计算
const worker = new Worker('/heavy-compute.worker.js');
worker.postMessage({ data: largeDataset });
worker.onmessage = ({ data: result }) => updateUI(result);
```

---

### 2.4 CLS 深度优化

#### CLS 计算公式
```
CLS = 影响分数（impact fraction）× 距离分数（distance fraction）

影响分数：不稳定元素影响的视口比例
距离分数：不稳定元素移动距离 / 视口高度
```

#### 高级 CLS 场景

```css
/* 场景1：字体闪烁（FOUT）导致 CLS */
@font-face {
  font-family: 'MyFont';
  src: url('/font.woff2') format('woff2');
  font-display: optional; /* 首屏不等字体，用系统字体；推荐用于 CLS 敏感场景 */
  /* font-display: swap; */  /* 先用系统字体，字体加载完后切换（可能产生轻微 CLS） */
}

/* 场景2：aspect-ratio 防止图片占位崩塌 */
.image-container {
  aspect-ratio: 16 / 9; /* 在图片加载前保持宽高比，防止 CLS */
  overflow: hidden;
}
```

```html
<!-- 场景3：广告位预留高度（常见 CLS 来源）-->
<div class="ad-slot" style="min-height: 250px;">
  <ins class="adsbygoogle" data-ad-slot="..."></ins>
</div>
```

---

### 2.5 TTFB 优化（LCP 的先决条件）

```
TTFB = 重定向时间 + DNS 解析 + TCP 握手 + TLS 握手 + 服务器处理时间

目标：< 800ms（理想 < 200ms）
```

| 优化手段 | 效果 | 实施难度 |
|---------|------|---------|
| CDN 边缘节点就近响应 | 降低网络传输时间 50~80% | 低 |
| HTTP/2 或 HTTP/3 | 减少握手开销 | 低 |
| 服务端缓存（Redis） | 消除数据库查询时间 | 中 |
| Edge SSR（Cloudflare Workers） | 代码在离用户最近节点执行 | 中 |
| 数据库查询优化 / 连接池 | 减少服务器处理时间 | 高 |

---

## 三、SEO 技术深度

### 3.1 爬虫工作原理

```
Googlebot 工作流程：
1. 发现 URL（来自 Sitemap、外链、内链）
2. 调度抓取（考虑爬虫预算、URL 优先级、robots.txt）
3. 下载 HTML（HTTP 请求，遵循 robots.txt）
4. 解析 HTML（提取链接、文本内容）
5. 渲染 JavaScript（Chromium 内核，但有延迟，可能数秒到数天）
6. 建立索引（分析语义、权重、内链结构）
7. 排名计算（结合 PageRank、内容质量、用户体验信号）
```

> **关键认知**：JS 渲染存在延迟（可能数天），SSR 可让 Googlebot 在步骤 4 就拿到完整内容，跳过等待渲染的步骤。

---

### 3.2 爬虫预算（Crawl Budget）管理

```
爬虫预算 = Googlebot 单位时间内愿意抓取的页面数
影响因素：站点权重（域名年龄/外链）、服务器响应速度、页面质量
```

#### 常见"浪费"爬虫预算的场景及修复

```nginx
# robots.txt 示例：屏蔽无价值 URL

User-agent: *
# 动态参数（会产生大量重复内容）
Disallow: /*?utm_*
Disallow: /*?sid=
Disallow: /*?ref=
# 无内容价值的系统路径
Disallow: /api/
Disallow: /admin/
Disallow: /_next/         # Next.js 静态资源由 CDN 处理
Disallow: /search?*      # 搜索结果页通常不需要收录

Sitemap: https://example.com/sitemap.xml
```

```tsx
// Next.js 中动态生成 robots.txt
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Googlebot', allow: '/' }, // Google 单独规则
    ],
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

---

### 3.3 JSON-LD 结构化数据完整实现

#### 常用 Schema 类型速查

```tsx
// 1. 文章页 Article Schema
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "如何优化 Core Web Vitals",
  "datePublished": "2024-03-15T08:00:00+08:00",
  "dateModified": "2024-06-01T10:00:00+08:00",
  "author": { "@type": "Person", "name": "张三", "url": "https://example.com/authors/zhangsan" },
  "publisher": {
    "@type": "Organization",
    "name": "Example Blog",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  },
  "image": "https://example.com/article-cover.jpg",
  "description": "本文详细介绍 LCP、INP、CLS 的优化方法"
};

// 2. FAQ 页面 Schema（直接在搜索结果展开问答）
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "什么是 Core Web Vitals？",
      "acceptedAnswer": { "@type": "Answer", "text": "Core Web Vitals 是 Google 用于衡量..." }
    }
  ]
};

// 3. 面包屑 BreadcrumbList
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "首页", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "博客", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "SEO 优化指南" }
  ]
};

// 4. 商品页 Product Schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "高端机械键盘",
  "image": "https://example.com/keyboard.jpg",
  "offers": {
    "@type": "Offer",
    "price": "599",
    "priceCurrency": "CNY",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "256" }
};
```

#### Next.js App Router 中注入 Schema
```tsx
// 推荐封装成 JsonLd 组件
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// 在 Server Component 中使用，无客户端 JS 开销
export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);
  return (
    <>
      <JsonLd data={buildProductSchema(product)} />
      <ProductDetail product={product} />
    </>
  );
}
```

---

### 3.4 语义化 HTML 与 H 标签权重

#### H 标签使用规范

```html
<!-- 错误示例：跳级、多个 H1 -->
<h1>主标题</h1>
<h3>子章节</h3>   <!-- 跳过了 H2，错误 -->
<h1>另一个主标题</h1>  <!-- 每页应只有一个 H1，错误 -->

<!-- 正确示例 -->
<h1>2024 年 SEO 完全指南</h1>         <!-- 包含核心关键词，全页唯一 -->
  <h2>一、关键词研究</h2>
    <h3>1.1 长尾关键词策略</h3>
    <h3>1.2 竞品关键词分析</h3>
  <h2>二、技术 SEO</h2>
    <h3>2.1 页面速度优化</h3>
```

#### 语义化标签对爬虫的信号意义

```html
<body>
  <header>                    <!-- 标识页头，爬虫降低权重 -->
    <nav aria-label="主导航">  <!-- nav 内的链接是导航链接，非内容链接 -->
      <a href="/">首页</a>
    </nav>
  </header>

  <main>                      <!-- 爬虫重点抓取区域 -->
    <article>                 <!-- 独立完整内容单元，权重高 -->
      <header>
        <h1>文章标题</h1>
        <time datetime="2024-03-15">2024年3月15日</time>  <!-- 帮助理解内容时效 -->
      </header>
      <section>               <!-- 内容分节，配合 h2 使用 -->
        <p>正文...</p>
      </section>
    </article>

    <aside>                   <!-- 侧边栏，爬虫降低权重 -->
      <section aria-label="相关文章">...</section>
    </aside>
  </main>

  <footer>...</footer>        <!-- 标识页脚，爬虫降低权重 -->
</body>
```

---

### 3.5 内链结构优化

内链是 PageRank 在站内流动的渠道，设计合理的内链结构能显著提升核心页面排名。

```
理想内链结构（金字塔型）：
首页（最高权重）
  ├── 分类页 A（中等权重）
  │   ├── 文章页 A1（接收权重）
  │   └── 文章页 A2
  └── 分类页 B
      └── 文章页 B1

坏的内链结构（孤岛页面）：
首页
  └── 文章页 X  ← 无任何其他页面链接到此，爬虫难以发现
```

```tsx
// 锚文本最佳实践：包含目标页关键词，不使用"点击这里"
// 好的锚文本
<a href="/blog/core-web-vitals">Core Web Vitals 优化指南</a>

// 差的锚文本
<a href="/blog/core-web-vitals">点击这里</a>
<a href="/blog/core-web-vitals">了解更多</a>
```

---

### 3.6 URL 规范化与 Canonical

```tsx
// 常见需要 canonical 的场景：

// 1. 分页内容
// /blog/page/1  →  canonical: /blog/     （主页是规范页）
// /blog/page/2  →  canonical: /blog/page/2  （自指）

// 2. UTM 参数追踪链接
// /product?utm_source=email&utm_campaign=spring  →  canonical: /product

// 3. 移动版 URL（m.example.com 已过时，但旧站还有）
// m.example.com/page  →  canonical: www.example.com/page

// Next.js App Router 一次性配置 canonical
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),  // 所有相对路径 canonical 的基础
  alternates: {
    canonical: '/',  // 相对路径，自动拼接 metadataBase
  },
};

// 动态页面
export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `/posts/${params.slug}`,  // 自动拼接为 https://example.com/posts/xxx
    },
  };
}
```

---

### 3.7 Sitemap 高级配置

```tsx
// app/sitemap.ts（Next.js 动态生成 Sitemap）
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts(); // 从 CMS/DB 获取

  const postUrls = posts.map(post => ({
    url: `https://example.com/posts/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...postUrls,
  ];
}

// 大型站点：Sitemap 索引文件（每个 sitemap 上限 50,000 条）
// 拆分为 /sitemap/posts.xml、/sitemap/products.xml 等
```

---

## 四、前端性能工程

### 4.1 资源加载优先级完整体系

```html
<!-- 1. preconnect：提前建立连接（DNS + TCP + TLS）-->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.example.com" crossorigin>

<!-- 2. dns-prefetch：仅 DNS 解析（兼容旧浏览器）-->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- 3. preload：高优先级，当前页必须用到的资源 -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical.css" as="style">

<!-- 4. prefetch：低优先级，下一页可能用到 -->
<link rel="prefetch" href="/next-page.js" as="script">

<!-- 5. modulepreload：预加载 ES Module（比 preload 更智能）-->
<link rel="modulepreload" href="/app.js">
```

---

### 4.2 图片优化完整方案

#### 现代图片格式选择策略
```html
<!-- 使用 <picture> 实现格式降级 -->
<picture>
  <source type="image/avif" srcset="/hero.avif 1x, /hero@2x.avif 2x">
  <source type="image/webp" srcset="/hero.webp 1x, /hero@2x.webp 2x">
  <img src="/hero.jpg" alt="Hero" width="1200" height="630" fetchpriority="high">
</picture>
```

| 格式 | 文件大小（相对 JPEG） | 浏览器支持 | 适用场景 |
|------|-------------------|-----------|---------|
| JPEG | 基准 | 全部 | 摄影、复杂渐变 |
| PNG | +20~50% | 全部 | 透明背景、截图 |
| WebP | -25~35% | Chrome 80+, Safari 14+ | 绝大多数场景首选 |
| AVIF | -50~60% | Chrome 85+, Safari 16+ | 质量最优，有兼容性限制 |
| SVG | 极小（矢量） | 全部 | 图标、Logo、简单插图 |

#### next/image 内部原理
```tsx
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="产品图"
  width={800}
  height={600}
  priority          // 相当于 fetchpriority="high" + preload
  placeholder="blur" // 模糊占位，防止 CLS
  blurDataURL="..."  // 可用 plaiceholder 生成
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // ↑ 告知浏览器不同断点下图片占屏幕宽度比例，生成精确 srcset
/>

// next/image 自动做了：
// ✅ 格式转换（WebP/AVIF）
// ✅ 生成 srcset 响应式尺寸
// ✅ 懒加载（非 priority 图片）
// ✅ 防止 CLS（布局占位）
// ✅ 图片质量优化
```

---

### 4.3 JavaScript 优化

#### Bundle 分析与瘦身

```bash
# 分析 Next.js bundle 大小
npm install @next/bundle-analyzer
# next.config.js 中开启后：
ANALYZE=true npm run build
# 会打开 treemap 可视化，找出体积异常的依赖
```

#### Tree Shaking 常见陷阱
```js
// 错误：默认导入整个库（无法 tree shake）
import _ from 'lodash';
const result = _.chunk([1, 2, 3], 2);

// 正确：按需导入
import chunk from 'lodash/chunk';
// 或使用 lodash-es
import { chunk } from 'lodash-es';

// 错误：副作用导入导致无法 tree shake
import 'some-lib/dist/styles.css'; // 如果没在 package.json 的 sideEffects 中声明

// 正确（package.json）：
{ "sideEffects": ["*.css", "src/polyfills.js"] }
```

#### 代码分割策略
```tsx
// 1. 路由级：Next.js 自动按 page 分割
// 2. 组件级：dynamic import 延迟加载重型组件
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,       // 编辑器仅在客户端运行
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

// 3. 条件分割：用户触发才加载
const loadChart = () => import('./HeavyChart').then(m => m.default);
<button onClick={async () => {
  const Chart = await loadChart();
  setChartComponent(() => Chart);
}}>
  显示图表
</button>
```

---

### 4.4 CSS 性能优化

#### 关键 CSS 提取（Critical CSS）

```
Critical CSS = 首屏渲染必需的 CSS
策略：将 Critical CSS 内联到 <head>，其余 CSS 异步加载
```

```html
<!-- 异步加载非关键 CSS -->
<link rel="preload" href="/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/non-critical.css"></noscript>
```

#### 避免 Render-Blocking CSS
```html
<!-- 媒体查询条件 CSS 不阻塞渲染 -->
<link rel="stylesheet" href="/print.css" media="print">
<link rel="stylesheet" href="/mobile.css" media="(max-width: 768px)">

<!-- 注意：上述 CSS 仍会被下载，只是不阻塞渲染 -->
```

#### contain 属性提升渲染性能
```css
/* 告知浏览器该元素是独立渲染上下文，优化 layout/paint 范围 */
.card {
  contain: layout paint;  /* 内部变化不影响外部布局 */
}

.sidebar {
  contain: strict;  /* 最强隔离，等同 size layout paint style */
}
```

#### content-visibility（延迟渲染屏幕外内容）
```css
/* 跳过屏幕外内容的渲染工作，极大提升初始渲染速度 */
.article-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* 预估高度，防止滚动条跳动 */
}
```

---

### 4.5 缓存策略设计

```
缓存层次（从近到远）：
Memory Cache → Service Worker Cache → HTTP Cache（disk）→ CDN Cache → 源站
```

```nginx
# Nginx 缓存策略配置示例

# 静态资源（带 hash 的 JS/CSS）：永久缓存
location ~* \.(js|css)$ {
  expires max;
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# HTML：不缓存或短时间缓存（内容频繁变化）
location ~* \.html$ {
  add_header Cache-Control "no-cache, must-revalidate";
}

# 图片：长缓存
location ~* \.(webp|jpg|png|avif|svg)$ {
  expires 30d;
  add_header Cache-Control "public, max-age=2592000";
}

# API：不缓存
location /api/ {
  add_header Cache-Control "no-store";
}
```

---

## 五、浏览器渲染原理（与 SEO/性能强相关）

### 5.1 关键渲染路径（Critical Rendering Path）

```
URL 输入
  → DNS 解析
  → TCP 连接（HTTP/2 多路复用）
  → TLS 握手
  → 发送 HTTP 请求
  → 接收 HTML
  → 解析 HTML → 构建 DOM 树
                ↓
  → 下载 CSS  → 构建 CSSOM 树   ← 阻塞渲染！CSS 必须下载完才能构建
  → DOM + CSSOM → Render Tree（可见节点 + 样式）
  → Layout（计算元素位置/尺寸）
  → Paint（像素绘制）
  → Composite（图层合并）
  → 显示在屏幕
```

### 5.2 回流（Reflow）与重绘（Repaint）

| 操作 | 触发阶段 | 性能代价 | 常见触发 |
|------|---------|---------|---------|
| 回流（Reflow） | Layout → Paint → Composite | 最高 | 改变宽高、字体、display |
| 重绘（Repaint） | Paint → Composite | 中 | 改变颜色、背景、visibility |
| 合成（Composite Only） | Composite 只 | 最低 | transform、opacity |

```css
/* 动画性能最优：只触发合成，不触发 Layout/Paint */
.smooth-animation {
  transform: translateX(100px); /* ✅ 合成层 */
  opacity: 0.5;                 /* ✅ 合成层 */
  
  /* ❌ 避免在动画中使用 */
  /* width, height, top, left → 触发 Reflow */
  /* background-color → 触发 Repaint */
}

/* will-change：提前创建合成层（慎用，内存开销大） */
.sidebar {
  will-change: transform;  /* 告知浏览器该元素将发生 transform 变化 */
}
```

### 5.3 JS 阻塞与执行时机

```html
<!-- JS 默认阻塞 HTML 解析！-->

<!-- 1. defer：HTML 解析完后执行，保持脚本顺序 -->
<script src="/app.js" defer></script>

<!-- 2. async：下载完立即执行，不保证顺序 -->
<script src="/analytics.js" async></script>

<!-- 3. type="module"：默认 defer 行为 -->
<script type="module" src="/app.mjs"></script>

<!-- 推荐规则：
  - 第三方统计/广告脚本 → async
  - 有依赖顺序的业务脚本 → defer
  - 关键初始化脚本 → <body> 底部或 defer
-->
```

---

## 六、React / Next.js 进阶

### 6.1 React 18 并发特性

```tsx
// useTransition：将状态更新标记为"非紧急"，不阻塞用户输入
import { useTransition, useState } from 'react';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value); // 紧急：立即更新输入框

    startTransition(() => {
      // 非紧急：搜索结果更新可以被打断
      setResults(search(e.target.value));
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <ResultList items={results} />}
    </>
  );
}
```

```tsx
// useDeferredValue：推迟非紧急值的更新（类似 debounce，但更智能）
import { useDeferredValue } from 'react';

function HeavyList({ items }) {
  const deferredItems = useDeferredValue(items); // 用户交互时先展示旧值
  return <ExpensiveComponent items={deferredItems} />;
}
```

### 6.2 Server Components 与 Client Components 边界

```tsx
// 规则：数据获取、大型依赖 → Server Component
//       交互、状态、浏览器 API → Client Component

// 正确的组合方式：Server 包裹 Client
// app/page.tsx (Server Component)
import { LikeButton } from './LikeButton'; // Client Component

export default async function PostPage() {
  const post = await db.query('SELECT * FROM posts WHERE id = 1');

  return (
    <article>
      <h1>{post.title}</h1>         {/* 服务端渲染 */}
      <p>{post.content}</p>         {/* 服务端渲染 */}
      <LikeButton postId={post.id} />  {/* 客户端交互 */}
    </article>
  );
}

// LikeButton.tsx
'use client';
import { useState } from 'react';

export function LikeButton({ postId }: { postId: number }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? '❤️' : '🤍'}</button>;
}
```

### 6.3 React Server Actions（Next.js 14+）

```tsx
// 表单提交无需 API 路由，直接在 Server Action 中处理
// app/contact/page.tsx
export default function ContactPage() {
  async function submitForm(formData: FormData) {
    'use server'; // 声明这是服务端函数
    const email = formData.get('email');
    await sendEmail(email as string);
    revalidatePath('/contact');
  }

  return (
    <form action={submitForm}>  {/* 无 JS 也能提交！Progressive Enhancement */}
      <input name="email" type="email" required />
      <button type="submit">提交</button>
    </form>
  );
}
```

---

### 6.4 性能优化：memo / useMemo / useCallback

```tsx
// React.memo：跳过 props 未变化的子组件重渲染
const ExpensiveItem = React.memo(({ title, onClick }) => {
  return <li onClick={onClick}>{title}</li>;
});

// useMemo：缓存计算结果
const sortedList = useMemo(
  () => [...items].sort((a, b) => a.price - b.price),
  [items] // 只在 items 变化时重新排序
);

// useCallback：缓存函数引用（避免导致子组件无效重渲染）
const handleClick = useCallback((id: number) => {
  setSelected(id);
}, []); // 空依赖：函数引用永不变化

// ⚠️ 常见误用：对简单值或简单组件过度使用 memo，反而增加开销
// 规则：测量 → 确认有性能问题 → 再使用 memo 优化
```

---

## 七、Vue 3 / Nuxt 3 深度

> 本章对应 JD 中的「精通 Vue (Nuxt.js)」要求，覆盖 Nuxt 3 SSR/SSG、SEO API、
> Vue 3 响应式原理与性能优化，以及与 React/Next.js 的横向对比。

---

### 7.1 Nuxt 3 架构概览

#### Nuxt 3 核心层次

```
用户请求
  │
  ▼
Nitro（服务端引擎）── 统一处理 SSR / API Routes / 静态生成
  │   支持部署目标：Node.js · Cloudflare Workers · Vercel Edge · AWS Lambda
  │
  ▼
Vue 3 渲染层（Universal Rendering）
  │   服务端：@vue/server-renderer → HTML 字符串
  │   客户端：Hydration → 接管 DOM
  │
  ▼
Vite（开发 & 构建）── HMR、Tree Shaking、代码分割
```

#### Nuxt 3 vs Next.js 核心对比

| 维度 | Nuxt 3 | Next.js 14+ |
|------|--------|-------------|
| 框架基础 | Vue 3 | React 18 |
| 服务端引擎 | Nitro（跨平台） | Next.js 内置（Node/Edge） |
| 路由方式 | 文件系统路由（自动） | App Router（文件系统） |
| 数据获取 | `useFetch` / `useAsyncData` | Server Component `fetch` / `use` |
| SEO API | `useHead` / `useSeoMeta` | `generateMetadata` |
| 状态管理 | Pinia（官方推荐） | Zustand / Jotai / Redux |
| 全局状态 | `useState` composable | 无内置（依赖第三方） |
| 自动导入 | 组件、composable、工具函数 | 无（需手动导入） |
| 配置复杂度 | 约定大于配置，零配置 SSR | 需要理解 App Router 心智模型 |

---

### 7.2 Nuxt 3 渲染模式

Nuxt 3 通过 **Hybrid Rendering**（混合渲染）支持对不同路由指定不同渲染策略：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },           // 构建时静态生成（SSG）
    '/blog/**': { isr: 3600 },          // ISR：最多 1 小时重新生成
    '/blog/breaking-news': { isr: 60 }, // 特定页面更短的 ISR 周期
    '/products/**': { swr: true },      // SWR：Stale-While-Revalidate
    '/user/**': { ssr: false },         // CSR：用户私人页面，不需要 SEO
    '/api/**': { cors: true, headers: { 'cache-control': 'no-store' } },
    '/admin/**': { redirect: '/login' },
  },
})
```

| routeRules 选项 | 等效模式 | 说明 |
|----------------|---------|------|
| `prerender: true` | SSG | 构建时生成 HTML，CDN 直出 |
| `isr: N`（秒） | ISR | 首次请求生成，N 秒后后台重新生成 |
| `swr: true` | SWR | 先返回缓存，同时后台更新 |
| `ssr: false` | CSR | 纯客户端渲染，适合登录后页面 |
| `ssr: true`（默认） | SSR | 每次请求服务端渲染 |

---

### 7.3 Nuxt 3 数据获取完整体系

#### useFetch（最常用）

```vue
<script setup lang="ts">
// useFetch = useAsyncData + $fetch 的语法糖
// 自动：SSR 时在服务端执行，客户端不重复请求（数据通过 payload 传递）
const { data: post, pending, error, refresh } = await useFetch(
  `/api/posts/${route.params.slug}`,
  {
    key: `post-${route.params.slug}`, // 缓存 key，防止重复请求
    pick: ['title', 'content', 'author'], // 只取需要的字段（减少 payload 体积）
    transform: (data) => ({              // 转换数据结构
      ...data,
      publishedAt: new Date(data.publishedAt),
    }),
    getCachedData: (key, nuxtApp) =>     // 自定义缓存逻辑
      nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  }
)
</script>
```

#### useAsyncData（更灵活，适合非 HTTP 数据源）

```vue
<script setup lang="ts">
// 适合：数据库直查、多个 API 合并、复杂逻辑
const { data: pageData } = await useAsyncData('home-page', async () => {
  const [posts, categories] = await Promise.all([
    $fetch('/api/posts?limit=10'),
    $fetch('/api/categories'),
  ])
  return { posts, categories } // 服务端合并后传给客户端
})

// 手动触发刷新（如搜索、翻页）
const { data, refresh } = await useAsyncData(
  () => `posts-page-${page.value}`,  // 响应式 key：page 变化时自动重新请求
  () => $fetch(`/api/posts?page=${page.value}`)
)
</script>
```

#### $fetch（直接调用，适合客户端交互）

```vue
<script setup lang="ts">
// $fetch 在服务端会直接调用内部 API（跳过 HTTP，零开销）
// $fetch 在客户端则发送正常 HTTP 请求
// 适合：按钮点击、表单提交等用户交互

async function submitComment(content: string) {
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: { content, postId: post.value.id },
    })
    await refresh() // 刷新数据
  } catch (e) {
    console.error(e)
  }
}
</script>
```

#### 数据获取选型指南

```
页面级初始数据（需要 SSR）    → useFetch / useAsyncData（在 <script setup> 顶层 await）
依赖响应式参数（搜索/分页）    → useAsyncData + 响应式 key 或 watch + refresh()
用户交互触发（点击/表单）      → $fetch（直接调用）
客户端专属数据（不需要 SEO）   → onMounted 中调用 $fetch 或 useFetch({ server: false })
```

---

### 7.4 Nuxt 3 SEO 完整实现

#### useHead（底层 API，灵活）

```vue
<script setup lang="ts">
const route = useRoute()
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)

useHead({
  title: () => `${post.value?.title} | MySite`,  // 函数形式：响应式更新
  meta: [
    { name: 'description', content: () => post.value?.excerpt },
    { property: 'og:title', content: () => post.value?.title },
    { property: 'og:image', content: () => post.value?.coverImage },
    { property: 'og:type', content: 'article' },
  ],
  link: [
    { rel: 'canonical', href: () => `https://example.com${route.path}` },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.value?.title,
        datePublished: post.value?.publishedAt,
      }),
    },
  ],
})
</script>
```

#### useSeoMeta（推荐，类型安全 + 防误写）

```vue
<script setup lang="ts">
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)

// useSeoMeta 提供完整的 TypeScript 类型提示，避免拼错 og: 前缀
useSeoMeta({
  title: () => post.value?.title,
  ogTitle: () => post.value?.title,
  description: () => post.value?.excerpt,
  ogDescription: () => post.value?.excerpt,
  ogImage: () => post.value?.coverImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  // 文章专属
  articlePublishedTime: () => post.value?.publishedAt,
  articleAuthor: () => [post.value?.author.url],
})

// SEO 相关 link 仍用 useHead
useHead({
  link: [{ rel: 'canonical', href: `https://example.com/blog/${route.params.slug}` }],
})
</script>
```

#### nuxt.config.ts 全站 SEO 默认值

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      // 全站默认 meta（页面级会覆盖）
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      ],
    },
  },

  // 推荐：使用 @nuxtjs/seo 模块（集成 sitemap、robots、og 等）
  modules: [
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxtjs/sitemap',
  ],

  // @nuxtjs/seo 配置
  site: {
    url: 'https://example.com',
    name: 'My Site',
    description: '站点默认描述',
    defaultLocale: 'zh-CN',
  },
})
```

#### 动态 Sitemap（@nuxtjs/sitemap）

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    urls: async () => {
      const posts = await $fetch('https://api.example.com/posts')
      return posts.map(post => ({
        loc: `/blog/${post.slug}`,
        lastmod: post.updatedAt,
        changefreq: 'weekly',
        priority: 0.8,
        images: [{ loc: post.coverImage, caption: post.title }],
      }))
    },
    // 排除不需要收录的路径
    exclude: ['/user/**', '/admin/**', '/api/**'],
  },
})
```

---

### 7.5 Nuxt 3 路由与布局系统

#### 文件系统路由规则

```
pages/
├── index.vue                  → /
├── about.vue                  → /about
├── blog/
│   ├── index.vue              → /blog
│   └── [slug].vue             → /blog/:slug（动态路由）
├── [...slug].vue              → /* （catch-all，用于 404 或动态路径）
└── (marketing)/               → 路由组（不影响 URL，共享 layout）
    └── landing.vue            → /landing
```

#### layouts 与 SEO 的关系

```vue
<!-- layouts/default.vue：全站公共布局 -->
<template>
  <div>
    <AppHeader />
    <!-- 面包屑：内链 + 结构化数据双重 SEO 价值 -->
    <Breadcrumb />
    <main>
      <slot />  <!-- 页面内容注入点 -->
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
// 在 layout 层注入全站 JSON-LD（WebSite schema）
useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'My Site',
      url: 'https://example.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://example.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }),
  }],
})
</script>
```

---

### 7.6 Nuxt 3 Island 架构（类 PPR）

Nuxt 3 的 **Component Islands** 允许在静态页面中嵌入服务端渲染的动态组件，与 Next.js 的 PPR 思路相似：

```vue
<!-- 文件名以 .server.vue 结尾，或包裹在 <NuxtIsland> 中 -->
<!-- components/StockPrice.server.vue -->
<template>
  <!-- 这部分在服务端实时渲染，不包含客户端 JS -->
  <div>{{ stockPrice }}</div>
</template>

<script setup lang="ts">
// 只在服务端执行，敏感逻辑不泄露到客户端
const { data: stockPrice } = await useFetch('/api/stock/AAPL')
</script>
```

```vue
<!-- pages/index.vue：静态页面中嵌入动态 Island -->
<template>
  <div>
    <h1>欢迎</h1>                     <!-- 静态，构建时生成 -->
    <NuxtIsland name="StockPrice" />   <!-- 服务端 Island，每次请求实时渲染 -->
    <p>这是静态内容</p>                <!-- 静态 -->
  </div>
</template>
```

---

### 7.7 Vue 3 响应式系统原理

#### Proxy vs Object.defineProperty

| 维度 | Vue 2（defineProperty） | Vue 3（Proxy） |
|------|------------------------|---------------|
| 监听方式 | 遍历对象属性，逐个劫持 getter/setter | 代理整个对象，拦截所有操作 |
| 新增属性 | 无法检测（需 Vue.set） | 自动检测 ✅ |
| 数组变更 | 需重写数组方法（push/pop 等） | 自动检测 ✅ |
| 性能 | 初始化时递归遍历（深层对象慢） | 惰性代理（按需追踪） |
| 嵌套对象 | 递归 defineProperty | 访问时才递归 Proxy（lazy） |
| Map/Set | 不支持 | 支持 ✅ |

```js
// Vue 3 响应式核心简化实现
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)              // 依赖收集
      const value = Reflect.get(target, key, receiver)
      // 惰性：访问到嵌套对象时才代理，不是初始化时递归
      return typeof value === 'object' ? reactive(value) : value
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)            // 触发更新
      return result
    },
  })
}
```

#### ref vs reactive 选型原则

```ts
// ref：适合基本类型 & 需要解构传递的值
const count = ref(0)
const user = ref<User | null>(null) // 可以整体替换（user.value = newUser）

// reactive：适合紧密相关的状态对象（不需要解构传递）
const form = reactive({
  username: '',
  password: '',
  loading: false,
})

// ⚠️ reactive 解构后失去响应性！
const { username } = form       // ❌ username 不是响应式的
const { username } = toRefs(form) // ✅ 解构后保持响应性

// shallowRef / shallowReactive：大型对象的性能优化
// 只有顶层属性是响应式的，深层不追踪（适合大型列表、只替换不修改深层）
const bigList = shallowRef<Item[]>([])
bigList.value = newItems         // ✅ 触发更新
bigList.value[0].name = 'new'   // ❌ 不触发更新（需要 triggerRef 手动触发）
```

---

### 7.8 Vue 3 性能优化技巧

#### v-memo（列表渲染优化，Vue 3.2+）

```vue
<!-- 只有 item.id 或 selected 变化时才重新渲染该项 -->
<!-- 适合大型列表（数百项），避免全量 diff -->
<div v-for="item in largeList" :key="item.id" v-memo="[item.id, item.selected]">
  <p>{{ item.name }}</p>
  <p>{{ item.description }}</p>
  <input type="checkbox" :checked="item.selected">
</div>
```

#### v-once（纯静态内容，只渲染一次）

```vue
<!-- 内容永不变化，跳过后续 diff -->
<footer v-once>
  <p>© 2025 公司名称. 版权所有</p>
</footer>
```

#### defineAsyncComponent（组件懒加载）

```ts
import { defineAsyncComponent } from 'vue'

// 对应 Next.js 的 dynamic()
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: LoadingSpinner,  // 加载中显示
  errorComponent: ErrorDisplay,      // 加载失败显示
  delay: 200,      // 延迟显示 loading（防止闪烁）
  timeout: 5000,   // 超时时间
})

// Nuxt 3 中使用 LazyXxx 前缀实现懒加载（自动）
// components/HeavyChart.vue → <LazyHeavyChart> 即为懒加载版本
```

#### computed 缓存与副作用避免

```ts
// ✅ computed 有缓存：依赖不变时不重新计算
const filteredList = computed(() =>
  props.items.filter(item => item.category === activeCategory.value)
)

// ❌ 不要在 computed 中产生副作用
const bad = computed(() => {
  console.log('side effect!') // 副作用，不应在 computed 中
  return items.value.length
})

// ✅ 副作用用 watchEffect / watch
watchEffect(() => {
  document.title = `共 ${filteredList.value.length} 条结果`
})
```

#### 组件通信性能陷阱

```vue
<script setup lang="ts">
// ❌ 每次父组件渲染都传入新对象字面量，子组件 props 永远变化
// <ChildComponent :config="{ theme: 'dark', size: 'lg' }" />

// ✅ 用 computed 保持对象引用稳定
const config = computed(() => ({ theme: darkMode.value ? 'dark' : 'light', size: 'lg' }))
// <ChildComponent :config="config" />

// ✅ 子组件使用 defineProps + 对象解构时用 toRefs 保持响应性
const props = defineProps<{ config: Config }>()
</script>
```

---

### 7.9 Vue 3 Composition API 工程化最佳实践

#### Composable 设计规范

```ts
// composables/usePagination.ts
// 规范：文件名以 use 开头，返回响应式状态 + 操作函数
export function usePagination(fetchFn: (page: number) => Promise<PageResult>) {
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const { data, refresh } = await useAsyncData(
    () => `page-${currentPage.value}`,
    async () => {
      loading.value = true
      try {
        const result = await fetchFn(currentPage.value)
        total.value = result.total
        return result.items
      } finally {
        loading.value = false
      }
    },
    { watch: [currentPage] } // currentPage 变化自动重新请求
  )

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasNext = computed(() => currentPage.value < totalPages.value)
  const hasPrev = computed(() => currentPage.value > 1)

  return {
    data: readonly(data),
    currentPage,
    total: readonly(total),
    totalPages,
    hasNext,
    hasPrev,
    loading: readonly(loading),
    goTo: (page: number) => { currentPage.value = page },
    next: () => hasNext.value && currentPage.value++,
    prev: () => hasPrev.value && currentPage.value--,
  }
}
```

#### provide / inject 的类型安全模式

```ts
// 不推荐：字符串 key，无类型提示
provide('user', currentUser)  // ❌

// 推荐：Symbol key + 泛型 InjectionKey
// composables/useCurrentUser.ts
import type { InjectionKey } from 'vue'
import type { User } from '~/types'

export const CurrentUserKey: InjectionKey<Ref<User | null>> = Symbol('currentUser')

// 父组件（布局层）
provide(CurrentUserKey, currentUser)

// 子组件（任意深度）
const currentUser = inject(CurrentUserKey)  // 自动推断类型 Ref<User | null>
```

---

### 7.10 Nuxt 3 服务端 API Routes

Nuxt 3 内置 API Routes（基于 Nitro），无需单独搭建后端：

```ts
// server/api/posts/[slug].get.ts
// 自动映射到 GET /api/posts/:slug

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  // 直接访问数据库（服务端代码，不暴露给客户端）
  const post = await db.query('SELECT * FROM posts WHERE slug = ?', [slug])

  if (!post) {
    throw createError({ statusCode: 404, message: 'Post not found' })
  }

  // 设置缓存头（CDN 缓存 1 小时）
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  return post
})
```

```ts
// server/api/revalidate.post.ts（ISR 按需重验）
export default defineEventHandler(async (event) => {
  const { secret, path } = await readBody(event)

  if (secret !== process.env.REVALIDATE_SECRET) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Nitro 清除路由缓存
  await useStorage().removeItem(`cache:nitro:routes:${path}`)

  return { revalidated: true }
})
```

---

### 7.11 Vue 3 / Nuxt 3 面试高频题

#### Q：Vue 3 的响应式系统相比 Vue 2 有哪些根本性改进？

**核心回答：**

Vue 3 将 `Object.defineProperty` 替换为 `Proxy`，带来三个根本性改进：

1. **完整拦截能力**：Proxy 可以拦截属性新增、删除和数组下标修改，Vue 2 需要 `Vue.set()` 和 `Vue.delete()` 的场景全部消失
2. **惰性深层代理**：Vue 2 在初始化时递归遍历整个对象，Vue 3 只在属性被访问时才代理嵌套对象，大型对象初始化性能显著提升
3. **原生支持 Map/Set**：Vue 2 无法响应 Map、Set、WeakMap 的变化，Vue 3 通过特殊的集合类型处理器完整支持

---

#### Q：useFetch 和 useAsyncData 有什么区别，分别在什么场景使用？

**核心回答：**

`useFetch` 是 `useAsyncData + $fetch` 的语法糖，适合直接请求 URL 的场景；`useAsyncData` 是更底层的 API，适合以下情况：
- 需要组合多个数据源（Promise.all）
- 数据来源不是 HTTP 请求（如直接查询数据库）
- 需要更精细地控制缓存 key 和刷新逻辑

两者的共同特点是：**在服务端执行后，数据通过 payload 传递给客户端，客户端不会重复请求**，这是 Nuxt 3 SSR 性能的核心机制。

---

#### Q：Nuxt 3 中如何实现类似 Next.js generateMetadata 的动态 SEO 元数据？

**对比回答：**

```vue
<!-- Nuxt 3 方式：在 <script setup> 中调用 useSeoMeta -->
<script setup lang="ts">
const route = useRoute()
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)

// 响应式更新：data 变化时 meta 自动更新
useSeoMeta({
  title: () => `${post.value?.title} | MySite`,
  description: () => post.value?.excerpt,
  ogImage: () => post.value?.coverImage,
})
</script>
```

与 Next.js `generateMetadata` 的区别：
- Next.js 是**函数导出**（静态分析友好，可在服务端独立执行）
- Nuxt 3 是**composable 调用**（响应式，数据变化自动更新，更符合 Vue 的设计哲学）
- 两者都在服务端执行，生成的 HTML 中都包含完整 meta 标签

---

#### Q：Nuxt 3 的 routeRules 如何实现按路由差异化渲染？举例说明。

**完整回答示例：**

以电商网站为例：

```ts
routeRules: {
  '/': { prerender: true },        // 首页：构建时静态生成，性能最佳
  '/category/**': { isr: 1800 },   // 分类页：30分钟 ISR，商品数量变化不频繁
  '/product/**': { isr: 300 },     // 商品详情：5分钟 ISR，价格/库存变化较快
  '/search': { ssr: true },        // 搜索结果：每次请求 SSR，实时性强
  '/cart': { ssr: false },         // 购物车：纯客户端，无需 SEO
  '/account/**': { ssr: false },   // 用户中心：客户端渲染
}
```

这样既保证了核心内容页面的 SEO 效果，又避免了对用户私人页面进行无意义的 SSR，合理分配服务器资源。

---

#### Q：Vue 3 中 ref 和 reactive 的区别，以及各自的使用场景？

**完整回答：**

`ref` 将值包裹在 `{ value: T }` 对象中（基于 getter/setter），`reactive` 直接代理对象（基于 Proxy）。

**选 ref 的场景：**
- 基本类型（string、number、boolean）—— reactive 不支持基本类型
- 需要整体替换的对象（`user.value = newUser`）
- 在 composable 中返回、需要被解构传递的状态
- 可能为 null 的值（`ref<User | null>(null)`）

**选 reactive 的场景：**
- 紧密相关的表单字段（reactive 模板中无需 .value）
- 类 class 实例的状态对象（属性多且互相关联）

**关键陷阱：**`reactive` 对象不能解构，解构后失去响应性；如需解构需使用 `toRefs()`。

---

#### Q：Nuxt 3 相比自行搭建 Vue 3 + SSR，优势在哪里？

| 功能 | 自行搭建 | Nuxt 3 |
|------|---------|--------|
| SSR 配置 | 需要手动配置 express + vue-server-renderer | 零配置开箱即用 |
| 路由 | 手动配置 vue-router | 文件系统自动生成路由 |
| 数据获取 | 手写 SSR + 客户端同步逻辑 | useFetch 自动处理 |
| SEO Meta | 手写 vue-meta 或 @vueuse/head | useSeoMeta 内置 |
| 代码分割 | 手动配置 Vite/Webpack | 自动按路由分割 |
| 部署目标 | 通常只支持 Node.js | Nitro 支持 20+ 部署平台 |
| 开发体验 | 复杂，需要深入了解 SSR 原理 | 约定优于配置，学习成本低 |

**结论**：对于中大型项目，Nuxt 3 显著降低工程复杂度，将精力集中在业务而非框架配置。自行搭建仅适合对 SSR 细节有极致控制需求的场景。


---

## 八、工程化与 CI/CD

### 7.1 Lighthouse CI 集成

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```js
// lighthouserc.js
module.exports = {
  ci: {
    collect: { url: ['http://localhost:3000', 'http://localhost:3000/blog'] },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
```

### 7.2 next.config.js 核心 SEO 优化配置

```js
// next.config.js
const nextConfig = {
  // 压缩输出
  compress: true,

  // 生产环境移除 console.log
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 图片优化域名白名单
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' },
    ],
    formats: ['image/avif', 'image/webp'], // 优先 AVIF
  },

  // 自定义响应头（SEO & 安全）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow' }, // 等效 meta robots
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // 批量 301 重定向（SEO 权重转移）
  async redirects() {
    return [
      { source: '/old-path', destination: '/new-path', permanent: true },
      // permanent: true = 308（Next.js 中）= SEO 权重完整传递
    ];
  },
};
```

---

## 九、网络层优化

### 8.1 HTTP/2 与 HTTP/3 对 SEO 的影响

| 协议 | 连接方式 | 队头阻塞 | TTFB 影响 |
|------|---------|---------|----------|
| HTTP/1.1 | 每请求一个 TCP 连接（或复用但串行） | 有 | 慢 |
| HTTP/2 | 单连接多路复用 | TCP 层有 | 中 |
| HTTP/3（QUIC） | UDP，连接迁移，0-RTT | 无 | 最快 |

> Cloudflare 默认支持 HTTP/3，对跨境访问（中国用户访问海外站）有明显 TTFB 改善。

### 8.2 Service Worker 与 SEO

```js
// Service Worker 不影响爬虫（Googlebot 不执行 SW）
// 但能显著提升回访用户的性能（缓存策略）

// sw.js - Stale-While-Revalidate 策略（适合文章页）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        caches.open('v1').then((cache) => cache.put(event.request, response.clone()));
        return response;
      });
      return cached || networkFetch; // 有缓存立即返回，同时后台更新
    })
  );
});
```

### 8.3 资源提示 Early Hints（103 状态码）

```
Early Hints（HTTP 103）= 服务端在生成完整响应之前，先发送 Link 头
让浏览器提前开始下载关键资源

时序对比：
传统模式：请求 → [等待服务端处理 200ms] → 收到 HTML → 解析到 <link> → 开始下载字体
Early Hints：请求 → [立即返回 103 + Link: preload 字体] → 浏览器提前下载 → 服务端处理完 → 返回 HTML
```

```
Cloudflare（支持 Early Hints）、Vercel（自动生成 Early Hints）均已支持。
Next.js 14+ 在 Vercel 部署时自动开启。
```

---

## 十、工具链实战

### 9.1 三大工具核心功能对比

| 功能 | Lighthouse | PageSpeed Insights | Google Search Console |
|------|-----------|-------------------|----------------------|
| 数据类型 | 实验室数据 | 实验室 + CrUX 真实数据 | 28天 CrUX 真实数据聚合 |
| 测试粒度 | 单 URL | 单 URL | 全站 URL 分组 |
| 使用场景 | 开发调试、CI 门禁 | 快速检测线上页面 | 监控整站趋势 |
| 历史数据 | 无 | 无 | 有（28天趋势图） |
| 设备分类 | 可选 | 可选 | 移动/PC 分开 |

### 9.2 Chrome DevTools 性能调试

```
Performance 面板关键指标：

Timeline 轨道：
  ├── Network：资源请求瀑布图，识别资源加载瓶颈
  ├── Main：主线程执行，找 Long Task（红角标 > 50ms）
  ├── Compositor：合成线程，动画卡顿来源
  └── Frames：帧率，<60fps 的帧会标红

关键指标（Performance 面板 Timings 区）：
  ├── FP（First Paint）
  ├── FCP（First Contentful Paint）
  ├── LCP（最大内容绘制）
  ├── DCL（DOMContentLoaded）
  └── L（Load）

调试步骤：
1. 开启 CPU 4x slowdown（模拟低端手机）
2. 开启 Slow 3G（模拟弱网）
3. 录制页面加载
4. 找 Main 线程中最长的橙色 Evaluate Script 块
5. 找 Long Task（50ms+），点进去看是哪段 JS
```

### 9.3 Search Console 核心使用流程

```
收录监控流程：
1. 「覆盖率」报告 → 查看「已排除」和「错误」分类
   常见错误：
   - "已提交的 URL 被 noindex 标记" → 检查页面 meta robots / X-Robots-Tag
   - "已提交的 URL 返回 404" → 检查 URL 是否真实存在
   - "重定向错误" → 检查重定向链是否超过 3 跳

2. 「网址检查工具」→ 输入 URL → 「请求编入索引」
   查看 Google 渲染快照，确认 JS 渲染后内容是否正确

3. 「Core Web Vitals」报告
   → 区分移动端/PC 端
   → 点击具体 URL 组，查看哪批页面不达标
   → 结合 PageSpeed Insights 验证具体原因

4. 「搜索结果」→「查询」
   → 找出点击率低但展示量高的关键词（CTR 低 → 优化 Title/Description）
   → 找出排名在 5~15 位的关键词（可重点优化，提升到首屏）
```

---

## 十一、加分项：Nginx / Cloudflare / 多语言

### 10.1 Nginx 完整 SEO 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain text/css text/xml
        application/javascript application/json
        application/xml+rss image/svg+xml;

    # 安全头（SEO 间接影响：HTTPS 评分）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # 静态资源长缓存
    location ~* \.(js|css|webp|avif|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 伪静态：去除 .html 后缀
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # 旧 URL 301 重定向批量处理
    include /etc/nginx/redirects.conf;
}

# www 强制跳转到非 www（权重合并）
server {
    server_name www.example.com;
    return 301 https://example.com$request_uri;
}

# HTTP 强制跳转 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}
```

### 10.2 Cloudflare Workers SEO 优化场景

```ts
// 场景1：在边缘节点注入 SEO 相关响应头
export default {
  async fetch(request: Request, env: Env) {
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);

    // 注入规范 canonical（若源站遗漏）
    newHeaders.set('Link', `<${new URL(request.url).pathname}>; rel="canonical"`);

    // 控制爬虫缓存
    newHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');

    return new Response(response.body, { headers: newHeaders });
  },
};

// 场景2：边缘 A/B 测试（不影响 SEO，Google 允许服务端 A/B）
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const variant = Math.random() < 0.5 ? 'A' : 'B';

    // 修改请求，不改变 URL（对爬虫透明）
    const modifiedRequest = new Request(
      `${url.origin}/variants/${variant}${url.pathname}`,
      request
    );
    return fetch(modifiedRequest);
  },
};
```

### 10.3 多语言 SEO 完整方案

```tsx
// 1. URL 结构选择（推荐子目录方案）
// ✅ 子目录：example.com/zh/、example.com/en/（权重集中在主域）
// ✅ 子域名：zh.example.com（适合内容差异大的语言版本）
// ⚠️ ccTLD：example.cn、example.com（最强地理信号，但维护成本高）

// 2. hreflang 完整实现
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://example.com/${params.lang}/posts/${params.slug}`,
      languages: {
        'zh-CN': `https://example.com/zh/posts/${params.slug}`,
        'zh-TW': `https://example.com/zh-tw/posts/${params.slug}`,
        'en-US': `https://example.com/en/posts/${params.slug}`,
        'x-default': `https://example.com/en/posts/${params.slug}`, // 默认版本
      },
    },
  };
}

// 3. Next.js i18n 路由配置（App Router）
// middleware.ts
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export function middleware(request: NextRequest) {
  const headers = { 'accept-language': request.headers.get('accept-language') ?? '' };
  const languages = new Negotiator({ headers }).languages();
  const locales = ['zh', 'en', 'ja'];
  const defaultLocale = 'en';

  const locale = match(languages, locales, defaultLocale);
  const pathname = request.nextUrl.pathname;

  // 如果 URL 无语言前缀，重定向到检测到的语言版本
  if (!locales.some(l => pathname.startsWith(`/${l}`))) {
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}
```

---

## 十二、高频面试题 & 最佳回答

### Q1：请详细解释 SSR 的完整工作流程，以及它如何提升 SEO？

**最佳回答思路：**

SSR 的工作流程可以分为以下步骤：

1. **用户请求**：浏览器向服务器发送 HTTP 请求
2. **服务端执行**：Node.js 服务器（或 Edge Runtime）执行 React 组件树，包括数据获取（数据库/API 调用）
3. **生成 HTML**：调用 `renderToPipeableStream` 将组件树序列化为 HTML 字符串
4. **发送响应**：将完整 HTML 发送给浏览器，同时携带 `__NEXT_DATA__` 序列化状态
5. **浏览器展示**：用户立即看到内容（无需等待 JS）
6. **水合（Hydration）**：React JS 加载后接管 DOM，绑定事件监听器

**SEO 提升原因**：Googlebot 爬取页面时无需等待 JS 渲染，直接从 HTML 中获取完整内容，收录速度更快、更可靠，同时 TTFB 和 FCP 的改善也是 Google 排名因子。

---

### Q2：LCP 分数很低，你会怎么排查和优化？

**系统化排查步骤：**

1. **定位 LCP 元素**：打开 Chrome DevTools → Performance 面板 → 录制加载 → 查看 Timings 区的 LCP 标记，确认是图片还是文字块

2. **分析子阶段**：使用 `web-vitals` 库的 `onLCP` 回调，或在 PageSpeed Insights 中查看 LCP 各子阶段耗时（TTFB、加载延迟、下载时间、渲染延迟）

3. **针对性优化**：
   - TTFB 高 → 启用 CDN、Edge SSR、服务端缓存
   - 加载延迟高 → 添加 `<link rel="preload">` 和 `fetchpriority="high"`
   - 下载时间长 → 转为 WebP/AVIF，启用 Gzip/Brotli
   - 渲染延迟高 → 检查是否有 CSS 动画/JS 在 LCP 前执行，检查字体加载

4. **验证效果**：在 Lighthouse CI 中设定 LCP < 2.5s 的门禁，防止回退

---

### Q3：单页应用（SPA）和多页应用（MPA/SSR）在 SEO 上的核心差异是什么？

**回答框架：**

| 维度 | SPA（CSR） | MPA/SSR |
|------|-----------|---------|
| 首次 HTML 内容 | 几乎为空，依赖 JS 填充 | 完整内容 |
| 爬虫解析 | 需要 JS 渲染（Googlebot 支持，但有延迟） | 直接从 HTML 获取 |
| 收录速度 | 慢（可能延迟数天到数周） | 快（通常当天） |
| TTFB | 慢（等待 API 数据） | 可快（服务端直出） |
| 动态路由 | 需要特殊配置（History API、404 fallback） | 天然支持 |
| 分享预览（OG） | 通常失败（爬虫不执行 JS） | 正常工作 |

**结论**：对 SEO 要求高的内容型网站应使用 SSR/SSG；需要复杂交互的后台工具可使用 SPA，因为这些页面通常不需要被搜索引擎收录。

---

### Q4：什么是 CLS，为什么广告会导致 CLS，如何修复？

**根本原因**：广告尺寸在加载完成前未知，浏览器无法预留空间，广告展示后推开其他内容。

**修复方案**：
```css
/* 方案1：预留固定高度占位符 */
.ad-container {
  min-height: 250px; /* 常见广告尺寸 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 方案2：使用 aspect-ratio 预留比例空间 */
.ad-banner {
  aspect-ratio: 728 / 90; /* 标准横幅广告比例 */
}
```

对于 Google AdSense，可以在广告代码中配置 `data-ad-format="auto"` 并预设容器尺寸，或使用 Google Publisher Tag 的 `defineSlot` 预定义广告位尺寸。

---

### Q5：如何设计一个大型内容站点的 SEO 架构？

**回答结构（STAR 法则）：**

1. **URL 架构**：采用扁平化结构（3 层以内），关键词融入 URL（`/blog/seo-optimization-guide` 优于 `/blog?id=123`）

2. **内容层级**：
   - 首页（权重最高，聚焦品牌词）
   - 分类/专题页（聚焦行业词）
   - 内容详情页（长尾词）

3. **内链策略**：
   - 相关文章推荐（内容相关性内链）
   - 面包屑导航（层级内链）
   - 核心页面主动从多处链接（权重汇聚）

4. **技术选型**：Next.js App Router + ISR（文章页 revalidate: 3600），静态首页 + 分类页（SSG），实时搜索结果页（SSR）

5. **监控体系**：GSC 监控收录和排名，Lighthouse CI 守住 Core Web Vitals 阈值，设置告警（如 LCP 回退超 500ms）

---

### Q6：如果发现网站被 Google 降权，你会如何排查？

**系统化排查清单：**

```
第一步：确认是否真的降权
  □ 区分「核心算法更新」（所有页面流量下降）vs「具体页面问题」
  □ 对比 Google Analytics 流量下降时间点 vs Google 更新时间线

第二步：技术 SEO 排查
  □ GSC 覆盖率报告 → 是否有大量 noindex / 404
  □ robots.txt 是否误屏蔽了重要路径
  □ canonical 标签是否指向了错误 URL
  □ HTTPS 证书是否过期
  □ Core Web Vitals 是否大规模不达标

第三步：内容质量排查
  □ 是否有大量低质量/重复内容页面（如参数 URL 未处理）
  □ 外链来源是否有低质量链接（Search Console → 链接 → 外部链接）
  □ 是否存在隐藏文字、关键词堆砌等 Black Hat 行为

第四步：修复与重新提交
  □ 修复技术问题后，使用「网址检查工具」请求重新爬取
  □ 在 GSC 提交修复验证申请（如已受手动处置）
```

---

### Q7：你在项目中如何平衡 SSR 带来的服务器压力与 SEO 需求？

**最佳实践组合：**

```
页面分级策略：
  首页、分类页  → SSG（构建时生成，CDN 缓存，零服务器压力）
  文章页        → ISR（revalidate: 3600，大部分流量走缓存）
  用户主页      → SSR + CDN Edge 缓存（vary: cookie）
  搜索结果页    → SSR（实时，不缓存）
  用户仪表板    → CSR（登录后，无需 SEO）

CDN 层优化：
  - 设置合理 s-maxage（CDN 缓存时间）
  - stale-while-revalidate：提供旧缓存同时后台更新
  - Cloudflare Workers 做边缘 SSR，降低源站压力
```

---

## 十三、Checklist：上线前 SEO 自查

### 技术基础

- [ ] 所有页面可通过 HTTPS 访问，HTTP 自动 301 跳转
- [ ] robots.txt 已配置，无误屏蔽核心页面
- [ ] XML Sitemap 已生成并提交至 Google Search Console
- [ ] 无 Canonical 冲突（自指 canonical 与实际 URL 一致）
- [ ] 分页页面已配置正确的 canonical 或 rel="next/prev"

### 内容 & 元数据

- [ ] 每页 `<title>` 唯一，包含核心关键词，控制在 60 字符内
- [ ] 每页 `<meta description>` 唯一，约 150 字符，含 Call-To-Action
- [ ] 每页有且仅有一个 `<h1>`，包含主关键词
- [ ] 所有 `<img>` 标签有 alt 属性（非装饰性图片）
- [ ] 关键页面已添加 JSON-LD 结构化数据，通过 Rich Results Test 验证

### 性能（Core Web Vitals）

- [ ] LCP ≤ 2.5s（移动端）
- [ ] INP ≤ 200ms
- [ ] CLS ≤ 0.1
- [ ] Lighthouse SEO 评分 ≥ 95
- [ ] Lighthouse Performance 评分 ≥ 90

### 多语言（如适用）

- [ ] 每个语言版本有正确的 hreflang 标签
- [ ] x-default 指向默认语言版本
- [ ] 各语言版本内容为完整翻译（非机器直译）

### 监控

- [ ] Google Search Console 已验证域名所有权
- [ ] Lighthouse CI 已集成到 PR 流程
- [ ] 设置流量下降告警（Google Analytics 自定义提醒）

---

> **文档版本**：2025 年 5 月 | 基于 Next.js 14/15、Nuxt 3、React 18/19、Vue 3.4+、Google Search Central 最新文档整理  
> **核心参考**：web.dev、Next.js 官方文档、Google Search Central Blog、Chrome Developers
