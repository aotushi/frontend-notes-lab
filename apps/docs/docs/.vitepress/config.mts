import { defineConfig } from 'vitepress'
import {
  clampLinkScriptPositionDelay,
  linkScriptPositionAssets
} from '../../../worker/src/demos/linkScriptPositionAssets'
import { clampDemoDelay, scriptAsyncDeferScripts } from '../../../worker/src/demos/scriptAsyncDeferScripts'

function getDemoFile(url: URL) {
  return decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) || '')
}

export default defineConfig({
  title: 'Frontend Notes Lab',
  description: '前端面试资料的实验驱动文档站',
  cleanUrls: true,
  lang: 'zh-CN',
  vite: {
    server: {
      middlewareMode: false
    },
    plugins: [
      {
        name: 'frontend-notes-lab-demo-api',
        configureServer(server) {
          server.middlewares.use('/api/demos/script-async-defer', async (req, res, next) => {
            if (!req.url) {
              next()
              return
            }

            const url = new URL(req.url, 'http://localhost')
            const file = getDemoFile(url)
            const script = scriptAsyncDeferScripts[file]

            if (!script) {
              res.statusCode = 404
              res.setHeader('content-type', 'text/plain; charset=utf-8')
              res.end('Not found')
              return
            }

            const delay = clampDemoDelay(Number(url.searchParams.get('delay') || 0))

            setTimeout(() => {
              res.statusCode = 200
              res.setHeader('content-type', 'text/javascript; charset=utf-8')
              res.end(script)
            }, delay)
          })

          server.middlewares.use('/api/demos/link-script-position', async (req, res, next) => {
            if (!req.url) {
              next()
              return
            }

            const url = new URL(req.url, 'http://localhost')
            const file = getDemoFile(url)
            const asset = linkScriptPositionAssets[file]

            if (!asset) {
              res.statusCode = 404
              res.setHeader('content-type', 'text/plain; charset=utf-8')
              res.end('Not found')
              return
            }

            const delay = clampLinkScriptPositionDelay(Number(url.searchParams.get('delay') || 0))

            setTimeout(() => {
              res.statusCode = 200
              res.setHeader('cache-control', 'no-store')
              res.setHeader('content-type', asset.contentType)
              res.end(asset.body)
            }, delay)
          })
        }
      }
    ]
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '资料源', link: '/resources/' },
      { text: 'HTML', link: '/html/' },
      { text: 'CSS', link: '/css/' },
      { text: 'JavaScript', link: '/javascript/' },
      { text: 'Vue', link: '/vue/' },
      {
        text: '更多',
        items: [
          { text: 'TypeScript', link: '/typescript/' },
          { text: '浏览器', link: '/browser/' },
          { text: '网络 / HTTP', link: '/network/' },
          { text: 'Git', link: '/git/' },
          { text: 'React', link: '/react/' },
          { text: '构建工具', link: '/build-tools/' },
          { text: '工程化', link: '/engineering/' },
          { text: '性能优化', link: '/performance/' },
          { text: 'Node.js', link: '/nodejs/' },
          { text: '移动端', link: '/mobile/' },
          { text: '小程序', link: '/mini-program/' },
          { text: '项目经验', link: '/project/' },
          { text: 'DevOps', link: '/devops/' },
          { text: '算法', link: '/algorithm/' }
        ]
      }
    ],
    sidebar: {
      '/html/': [
        {
          text: 'HTML',
          items: [
            { text: '分类首页', link: '/html/' },
            {
              text: '文档结构',
              items: [
                { text: 'DOCTYPE 与渲染模式', link: '/html/document-structure/doctype-and-mode' },
                { text: 'head 与 meta 常见问题', link: '/html/document-structure/meta-and-head' },
                { text: 'HTML5 与 HTML4', link: '/html/document-structure/html5-vs-html4' },
                { text: 'Web 标准与 W3C', link: '/html/document-structure/web-standards' },
                { text: 'title、h1、strong、em', link: '/html/document-structure/text-semantics-and-headings' },
                { text: '元素分类与空元素', link: '/html/document-structure/element-categories-and-void-elements' },
                { text: 'Document、DOM 树与渲染树', link: '/html/document-structure/document-dom-render-tree' },
                { text: 'html、body 与表格结构', link: '/html/document-structure/html-root-body-and-table' },
                { text: '行内元素、块级元素与行内块', link: '/html/document-structure/inline-block-elements' },
                { text: 'HTML 兼容、乱码、错误页与基础结构', link: '/html/document-structure/html-compatibility-and-error-pages' }
              ]
            },
            {
              text: '链接、导航与 iframe',
              items: [
                { text: 'a 标签、href、target 与 download', link: '/html/links-navigation/a-link-basics' },
                { text: 'iframe 使用场景、sandbox 与通信', link: '/html/links-navigation/iframe-basics-and-communication' },
                { text: 'SPA、面包屑与导航体验', link: '/html/links-navigation/spa-and-navigation-ux' }
              ]
            },
            {
              text: '语义化',
              items: [
                { text: 'HTML 语义化', link: '/html/semantics/semantic-html' }
              ]
            },
            {
              text: '可访问性',
              items: [
                { text: 'HTML 可访问性基础', link: '/html/accessibility/html-accessibility-basics' }
              ]
            },
            {
              text: '资源加载',
              items: [
                { text: 'link 与 script 的位置', link: '/html/resource-loading/link-script-position' },
                { text: 'head 标签中的内容顺序', link: '/html/resource-loading/head-content-order' },
                { text: 'script async / defer / module', link: '/html/resource-loading/script-async-defer' },
                { text: 'CSS 阻塞与 DOMContentLoaded', link: '/html/resource-loading/css-blocking-and-domcontentloaded' },
                { text: 'DOMContentLoaded 与 load', link: '/html/resource-loading/domcontentloaded-and-load' },
                { text: 'preload、prefetch、preconnect', link: '/html/resource-loading/preload-prefetch-preconnect' },
                { text: 'JS 延迟、异步和按需加载', link: '/html/resource-loading/script-loading-strategies' },
                { text: 'HTTPS 混合内容', link: '/html/resource-loading/mixed-content' }
              ]
            },
            {
              text: '嵌入资源',
              items: [
                { text: 'img srcset 响应式图片', link: '/html/embedded-content/responsive-images-srcset' },
                { text: 'href 与 src 区别', link: '/html/embedded-content/href-vs-src' },
                { text: 'Data URL', link: '/html/embedded-content/data-url' }
              ]
            },
            {
              text: '媒体、Canvas 与 SVG',
              items: [
                { text: '图片、picture、srcset 与热区', link: '/html/media-canvas-svg/images-picture-and-image-map' },
                { text: '图片布局、预览、压缩与 DOM 转图片', link: '/html/media-canvas-svg/image-layout-upload-and-dom-to-image' },
                { text: 'audio、video、字幕、截图与媒体捕获', link: '/html/media-canvas-svg/audio-video-and-media-capture' },
                { text: 'Canvas 基础、绘制与内存', link: '/html/media-canvas-svg/canvas-basics-and-drawing' },
                { text: 'Canvas 图片处理、导出与坑点', link: '/html/media-canvas-svg/canvas-export-and-pitfalls' },
                { text: 'SVG、WebGL 与 Canvas 取舍', link: '/html/media-canvas-svg/svg-webgl-and-canvas-choice' }
              ]
            },
            {
              text: '存储与离线能力',
              items: [
                { text: 'Cookie、Session 与 Web Storage', link: '/html/storage/cookies-session-web-storage' },
                { text: 'localStorage 时效性与多标签页通信', link: '/html/storage/local-storage-expiry-and-tabs' },
                { text: '离线存储与 Application Cache', link: '/html/storage/offline-cache-and-application-cache' },
                { text: 'IndexedDB 与 Web SQL', link: '/html/storage/indexeddb-and-websql' },
                { text: '页面缓存与强制更新', link: '/html/storage/page-cache-control' }
              ]
            },
            {
              text: '移动端',
              items: [
                { text: 'meta viewport', link: '/html/viewport/meta-viewport' }
              ]
            },
            {
              text: '表单与输入控件',
              items: [
                { text: 'form 提交、编码与跨域', link: '/html/forms/form-submission-and-encoding' },
                { text: 'input、button 与控件状态', link: '/html/forms/input-controls-and-state' },
                { text: '文件上传、自动完成与 textarea', link: '/html/forms/file-upload-autocomplete-textarea' },
                { text: 'textarea 原格式输出与表单 target 下载', link: '/html/forms/textarea-and-download-target' }
              ]
            }
          ]
        }
      ],
      '/resources/': categorySidebar('资料源', '/resources/'),
      '/css/': [
        {
          text: 'CSS',
          items: [
            { text: '分类首页', link: '/css/' },
            {
              text: '基础语法与层叠',
              items: [
                { text: '分类说明', link: '/css/foundations/' },
                { text: 'CSS 引入方式与 @import', link: '/css/foundations/css-basic-and-loading' },
                { text: 'CSS 初始化、Reset 与 Normalize', link: '/css/foundations/css-reset-and-normalize' },
                { text: 'CSS 预处理器', link: '/css/foundations/css-preprocessors' }
              ]
            },
            {
              text: '选择器与伪类',
              items: [
                { text: '分类说明', link: '/css/selectors/' },
                { text: '选择器、优先级与层叠', link: '/css/selectors/specificity-and-cascade' }
              ]
            },
            {
              text: '值、单位与函数',
              items: [
                { text: '分类说明', link: '/css/values-units-functions/' },
                { text: '尺寸约束、单位与百分比', link: '/css/values-units-functions/sizing-units-and-percentages' }
              ]
            },
            {
              text: '盒模型与格式化上下文',
              items: [
                { text: '分类说明', link: '/css/box-model/' },
                { text: '盒模型与 box-sizing', link: '/css/box-model/box-model-and-bfc' },
                { text: '浮动与清除浮动', link: '/css/box-model/float-and-clear' },
                { text: 'BFC 块级格式化上下文', link: '/css/box-model/block-formatting-context' }
              ]
            },
            {
              text: '布局',
              items: [
                { text: '分类说明', link: '/css/layout/' },
                { text: 'display 与布局总览', link: '/css/layout/flex-grid-position' },
                { text: 'flex 弹性布局', link: '/css/layout/flex-layout' },
                { text: 'Grid 布局', link: '/css/layout/grid-layout' },
                { text: 'position 定位', link: '/css/layout/position-layout' },
                { text: '瀑布流、居中和经典布局案例', link: '/css/layout/layout-patterns' }
              ]
            },
            {
              text: '响应式与条件规则',
              items: [
                { text: '分类说明', link: '/css/responsive/' }
              ]
            },
            {
              text: '文本、字体与排版',
              items: [
                { text: '分类说明', link: '/css/typography/' },
                { text: '行高、文本溢出与行内间隙', link: '/css/typography/line-height-overflow-and-inline-gaps' }
              ]
            },
            {
              text: '颜色、背景与视觉效果',
              items: [
                { text: '分类说明', link: '/css/visual-effects/' },
                { text: 'CSS 绘制基础形状', link: '/css/visual-effects/css-shapes' },
                { text: '颜色主题与深色模式', link: '/css/visual-effects/color-theme' }
              ]
            },
            {
              text: '动画、变换与交互',
              items: [
                { text: '分类说明', link: '/css/animation-interaction/' },
                { text: 'transform、transition 与 animation 的区别', link: '/css/animation-interaction/transform-transition-animation' }
              ]
            },
            {
              text: '分页、打印与特殊媒介',
              items: [
                { text: '分类说明', link: '/css/special-media/' },
                { text: '打印、字体与布局兼容', link: '/css/special-media/print-fonts-and-layout-compat' }
              ]
            },
            {
              text: 'CSSOM、渲染与性能',
              items: [
                { text: '分类说明', link: '/css/rendering/' },
                { text: '重排、重绘与隐藏方式', link: '/css/rendering/paint-reflow-visibility' }
              ]
            }
          ]
        }
      ],
      '/javascript/': [
        {
          text: 'JavaScript',
          items: [
            { text: '分类首页', link: '/javascript/' },
            {
              text: '语言基础',
              items: [
                { text: '变量声明与基础类型', link: '/javascript/language-basics/declaration-and-types' },
                { text: 'ES 基础、内置对象与常见表达式题', link: '/javascript/language-basics/es-builtins-operators-and-objects' },
                { text: '数组方法与迭代', link: '/javascript/language-basics/array-and-iteration' },
                { text: 'Proxy 是什么', link: '/javascript/language-basics/proxy' }
              ]
            },
            {
              text: '执行机制',
              items: [
                { text: '执行上下文、作用域、闭包与 this', link: '/javascript/execution-model/scope-closure-this' },
                { text: '内存模型与垃圾回收', link: '/javascript/execution-model/memory-and-garbage-collection' }
              ]
            },
            {
              text: '对象模型',
              items: [
                { text: '原型链与继承', link: '/javascript/object-model/prototype-and-inheritance' }
              ]
            },
            {
              text: '异步编程',
              items: [
                { text: '异步编程基础', link: '/javascript/async/async-programming-basics' },
                { text: 'Promise 与 async/await', link: '/javascript/async/promise-async-await' },
                { text: '事件循环、并发控制与 Web Worker', link: '/javascript/async/event-loop-workers-and-concurrency' }
              ]
            },
            {
              text: '模块化',
              items: [
                { text: 'JavaScript 模块化', link: '/javascript/modules/module-systems' }
              ]
            },
            {
              text: 'DOM / BOM',
              items: [
                { text: 'DOM 事件与节点操作', link: '/javascript/dom-bom/dom-events-and-nodes' },
                { text: 'BOM 与页面生命周期', link: '/javascript/dom-bom/bom-and-page-lifecycle' },
                { text: '浏览器存储', link: '/javascript/dom-bom/browser-storage' },
                { text: '页面通信', link: '/javascript/dom-bom/page-communication' }
              ]
            },
            {
              text: '性能',
              items: [
                { text: 'JavaScript 性能模式', link: '/javascript/performance/js-performance-patterns' }
              ]
            },
            {
              text: '手写题',
              items: [
                { text: '常见手写题', link: '/javascript/handwritten/common-implementations' }
              ]
            }
          ]
        }
      ],
      '/typescript/': [
        {
          text: 'TypeScript',
          items: [
            { text: '分类首页', link: '/typescript/' },
            {
              text: '类型系统',
              items: [
                { text: '类型基础、泛型与工具类型', link: '/typescript/type-system/basics-generics-utility' },
                { text: '高级类型与工程实践', link: '/typescript/type-system/advanced-types-and-practices' }
              ]
            },
            {
              text: '其它',
              items: [
                { text: '设计模式、数据结构和算法', link: '/typescript/other/design-patterns-and-data-structures' }
              ]
            }
          ]
        }
      ],
      '/browser/': [
        {
          text: '浏览器',
          items: [
            { text: '分类首页', link: '/browser/' },
            {
              text: '进程与线程',
              items: [
                { text: '浏览器进程与线程', link: '/browser/processes/browser-processes-and-threads' }
              ]
            },
            {
              text: '渲染机制',
              items: [
                { text: '浏览器内核与渲染引擎', link: '/browser/rendering/browser-kernel' }
              ]
            },
            {
              text: '缓存机制',
              items: [
                { text: '浏览器缓存策略', link: '/browser/cache/browser-cache' }
              ]
            },
            {
              text: '本地存储',
              items: [
                { text: 'Cookie / localStorage / IndexedDB', link: '/browser/storage/local-storage' }
              ]
            },
            {
              text: '事件与异步',
              items: [
                { text: '事件循环、事件委托与异步模型', link: '/browser/events/event-loop-and-delegation' }
              ]
            },
            {
              text: '安全',
              items: [
                { text: 'XSS、CSRF 与前端安全', link: '/browser/security/xss-csrf-and-security' }
              ]
            },
            {
              text: '跨域',
              items: [
                { text: '同源策略、跨域与 Nginx', link: '/browser/cors/same-origin-and-cross-origin' }
              ]
            },
            {
              text: '垃圾回收',
              items: [
                { text: 'V8 垃圾回收与内存泄漏', link: '/browser/gc/v8-garbage-collection' }
              ]
            },
            {
              text: '兼容性',
              items: [
                { text: '浏览器兼容、特性检测与 Polyfill', link: '/browser/compatibility/feature-detection-and-polyfills' }
              ]
            }
          ]
        }
      ],
      '/network/': [
        {
          text: '网络 / HTTP',
          items: [
            { text: '分类首页', link: '/network/' },
            {
              text: 'HTTP 基础',
              items: [
                { text: 'Ajax、CORS 与浏览器缓存', link: '/network/http/ajax-cors-cache' },
                { text: 'HTTP 基础：分层、长短连接与状态码', link: '/network/http/protocol-basics' },
                { text: 'HTTP 各版本特性与协议细节', link: '/network/http/http-versions-and-features' },
                { text: 'HTTPS 与 TLS/SSL', link: '/network/http/https-and-tls' }
              ]
            },
            {
              text: '传输协议与基础设施',
              items: [
                { text: 'TCP、UDP 与 DNS', link: '/network/protocol/tcp-udp-and-dns' }
              ]
            },
            {
              text: 'WebSocket',
              items: [
                { text: 'Cookie 与兼容问题', link: '/network/websocket/cookies-and-compat' }
              ]
            },
            {
              text: '安全与跨域',
              items: [
                { text: '前端攻击防范与跨域', link: '/network/security/web-security-and-cross-origin' }
              ]
            },
            {
              text: '实时通信',
              items: [
                { text: '服务端主动推送数据', link: '/network/realtime/server-push-options' }
              ]
            }
          ]
        }
      ],
      '/git/': categorySidebar('Git', '/git/'),
      '/vue/': [
        {
          text: 'Vue / Nuxt',
          items: [
            { text: '分类首页', link: '/vue/' },
            {
              text: '概念与对比',
              items: [
                { text: 'MVVM 模式与 Vue / React 对比', link: '/vue/concepts/mvvm-and-framework-comparison' },
                { text: 'Vue 2 与 Vue 3 的区别', link: '/vue/concepts/vue2-vs-vue3' },
                { text: 'SPA、SSR 与性能优化', link: '/vue/concepts/spa-ssr' }
              ]
            },
            {
              text: '核心机制',
              items: [
                { text: '响应式原理与核心机制', link: '/vue/core/reactivity' }
              ]
            },
            {
              text: '渲染机制',
              items: [
                { text: 'Vue Virtual DOM', link: '/vue/rendering/virtual-dom' },
                { text: 'Vue diff 算法与 key', link: '/vue/rendering/diff-and-key' }
              ]
            },
            {
              text: '组件',
              items: [
                { text: 'Vue 生命周期', link: '/vue/component/lifecycle' },
                { text: 'Vue 指令与组件特性', link: '/vue/component/directives-and-features' },
                { text: 'Vue 组件通信', link: '/vue/component/component-communication' }
              ]
            },
            {
              text: '路由',
              items: [
                { text: 'Vue Router', link: '/vue/router/vue-router' }
              ]
            },
            {
              text: '状态管理',
              items: [
                { text: 'Vuex 状态管理', link: '/vue/state/vuex' },
                { text: 'Pinia', link: '/vue/state/pinia' }
              ]
            }
          ]
        }
      ],
      '/react/': [
        {
          text: 'React',
          items: [
            { text: '分类首页', link: '/react/' },
            {
              text: '组件',
              items: [
                { text: '类组件与函数组件', link: '/react/components/class-and-function' },
                { text: '组件通信', link: '/react/components/communication' }
              ]
            },
            {
              text: '渲染机制',
              items: [
                { text: 'React Virtual DOM 与 diff', link: '/react/rendering/virtual-dom' },
                { text: 'React 生命周期', link: '/react/rendering/lifecycle' }
              ]
            },
            {
              text: '状态管理',
              items: [
                { text: 'state 与 props', link: '/react/state/state-and-props' },
                { text: 'Redux', link: '/react/state/redux' }
              ]
            },
            {
              text: 'Hooks',
              items: [
                { text: 'React Hooks', link: '/react/hooks/react-hooks' }
              ]
            },
            {
              text: '路由',
              items: [
                { text: 'React Router', link: '/react/router/react-router' }
              ]
            },
            {
              text: '事件',
              items: [
                { text: 'React 事件机制', link: '/react/events/react-events' }
              ]
            }
          ]
        }
      ],
      '/build-tools/': [
        {
          text: '构建工具',
          items: [
            { text: '分类首页', link: '/build-tools/' },
            {
              text: 'JavaScript 构建',
              items: [
                { text: 'JavaScript 构建、模块与代码组织', link: '/build-tools/javascript-build-and-modules' }
              ]
            },
            {
              text: 'Webpack',
              items: [
                { text: 'Webpack 核心概念与优化', link: '/build-tools/webpack' }
              ]
            }
          ]
        }
      ],
      '/engineering/': categorySidebar('工程化', '/engineering/'),
      '/performance/': [
        {
          text: '性能优化',
          items: [
            { text: '分类首页', link: '/performance/' },
            {
              text: '指标与监控',
              items: [
                { text: '白屏时间', link: '/performance/metrics/white-screen-time' }
              ]
            },
            {
              text: '渲染与运行时',
              items: [
                { text: 'DOM、渲染与页面性能优化', link: '/performance/rendering/dom-and-page-performance' }
              ]
            },
            {
              text: '加载性能',
              items: [
                { text: '页面加载、渲染、白屏与进度反馈', link: '/performance/loading/page-loading-rendering-and-progress' },
                { text: 'CDN、懒加载与图片优化', link: '/performance/loading/cdn-and-image-optimization' }
              ]
            }
          ]
        }
      ],
      '/nodejs/': [
        {
          text: 'Node.js',
          items: [
            { text: '分类首页', link: '/nodejs/' },
            {
              text: '运行时',
              items: [
                { text: '异步 IO 模型与进程', link: '/nodejs/runtime/async-io-and-process' }
              ]
            },
            {
              text: '服务端框架',
              items: [
                { text: '服务端框架与中间件', link: '/nodejs/server/middleware-and-framework' }
              ]
            },
            {
              text: '部署与运维',
              items: [
                { text: '部署与运维', link: '/nodejs/deployment/deploy-and-ops' }
              ]
            },
            {
              text: '调试与工具',
              items: [
                { text: '调试与抓包工具', link: '/nodejs/debugging/debugging-and-tools' }
              ]
            }
          ]
        }
      ],
      '/algorithm/': [
        {
          text: '算法',
          items: [
            { text: '分类首页', link: '/algorithm/' },
            {
              text: '动态规划',
              items: [
                { text: '斐波那契与动态规划', link: '/algorithm/dynamic-programming/fibonacci-and-dp' }
              ]
            },
            {
              text: '数组与查找',
              items: [
                { text: '二分查找与洗牌算法', link: '/algorithm/array-and-search/binary-search-and-shuffle' }
              ]
            }
          ]
        }
      ],
      '/mobile/': [
        {
          text: '移动端',
          items: [
            { text: '分类首页', link: '/mobile/' },
            {
              text: '适配',
              items: [
                { text: '移动端适配、viewport 与安全区域', link: '/mobile/adaptation/viewport-and-responsive' }
              ]
            },
            {
              text: '交互',
              items: [
                { text: '触摸、软键盘、滚动穿透与设备传感器', link: '/mobile/interaction/keyboard-touch-and-sensors' }
              ]
            },
            {
              text: '跨端',
              items: [
                { text: 'H5、Native App 与小程序交互', link: '/mobile/hybrid/h5-native-mini-program' }
              ]
            },
            {
              text: 'PWA',
              items: [
                { text: 'H5 平台能力、PWA 与安全上下文', link: '/mobile/pwa/h5-platform-and-secure-apis' }
              ]
            }
          ]
        }
      ],
      '/mini-program/': categorySidebar('小程序', '/mini-program/'),
      '/project/': categorySidebar('项目经验', '/project/'),
      '/devops/': categorySidebar('DevOps', '/devops/')
    },
    search: {
      provider: 'local'
    },
    outline: {
      label: 'On this page',
      level: [2, 3]
    }
  }
})

function categorySidebar(text: string, link: string) {
  return [
    {
      text,
      items: [
        { text: '分类首页', link }
      ]
    }
  ]
}
