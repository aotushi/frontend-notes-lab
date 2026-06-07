import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const rawPath = path.join(root, 'raw-notes', '01_HTML&CSS&JS&TS.md')
const raw = readFileSync(rawPath, 'utf8').replace(/\r\n/g, '\n')
const sections = parseSections(raw)

const docs = [
  {
    file: 'docs/html/document-structure/doctype-and-mode.md',
    title: 'DOCTYPE 与渲染模式',
    sections: [
      '文档声明的作用',
      '浏览器渲染页面的2种模式',
      '文档声明（Doctype）和`<!Doctype html>`有何作用? 严格模式与混杂模式如何区分？它们有何意义?',
      'doctype作用'
    ],
    demo: '待补充：对比有无 `<!doctype html>` 的页面，打印 `document.compatMode`，观察 `CSS1Compat` 和 `BackCompat`。'
  },
  {
    file: 'docs/html/semantics/semantic-html.md',
    title: 'HTML 语义化',
    sections: ['标签语义化'],
    demo: '待补充：提供一段全 `div` 结构和一段语义化结构，对比无样式状态、标题层级和可访问性树。'
  },
  {
    file: 'docs/html/document-structure/inline-block-elements.md',
    title: '行内元素、块级元素与行内块',
    sections: ['行内元素和块级元素'],
    demo: '待补充：展示 `inline`、`block`、`inline-block` 设置宽高、换行和间距时的差异。'
  },
  {
    file: 'docs/html/resource-loading/link-script-position.md',
    title: 'link 与 script 的位置',
    sections: ['link标签和script标签位置'],
    demo: '已有：[script async / defer 区别](/html/resource-loading/script-async-defer)'
  },
  {
    file: 'docs/html/resource-loading/head-content-order.md',
    title: 'head 标签中的内容顺序',
    sections: ['head标签中的内容顺序'],
    demo: '待补充：对比不同 head 资源顺序下浏览器发现资源和阻塞渲染的差异。'
  },
  {
    file: 'docs/html/embedded-content/responsive-images-srcset.md',
    title: 'img srcset 响应式图片',
    sections: ['img标签中使用srcset属性.'],
    demo: '待补充：在不同 viewport 和 DPR 下观察浏览器选择的 `srcset` 候选资源。'
  },
  {
    file: 'docs/html/embedded-content/href-vs-src.md',
    title: 'href 与 src 区别',
    sections: ['href 与 src 区别'],
    demo: '待补充：对比 `link href`、`a href`、`img src`、`script src` 的加载和阻塞行为。'
  },
  {
    file: 'docs/html/viewport/meta-viewport.md',
    title: 'meta viewport',
    sections: ['meta viewport'],
    demo: '待补充：在移动视口下对比有无 viewport meta 时的布局宽度和缩放表现。'
  },
  {
    file: 'docs/html/embedded-content/data-url.md',
    title: 'Data URL',
    sections: ['Data URL概述'],
    demo: '待补充：对比普通图片 URL、Data URL、Blob URL 的体积、缓存和预览场景。'
  },
  {
    file: 'docs/css/box-model/box-model-and-bfc.md',
    title: '盒模型与 BFC',
    sections: ['盒模型', '浮动', '说说BFC的理解'],
    demo: '待补充：对比 `content-box` 和 `border-box` 的尺寸计算；对比普通容器和 BFC 容器中的 margin 折叠、浮动包裹效果。'
  },
  {
    file: 'docs/css/basics/css-basic-and-loading.md',
    title: 'CSS 基础与引入方式',
    sections: [
      'CSS',
      '常规问题',
      '页面中引入CSS文有几种方式',
      'link 与 @import 的区别',
      'li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？'
    ],
    demo: '待补充：对比行内样式、内部样式、`link` 和 `@import` 的加载顺序与覆盖关系。'
  },
  {
    file: 'docs/css/layout/flex-grid-position.md',
    title: 'Flex、Grid 与定位布局',
    sections: [
      '元素竖向的百分比设定是相对于父容器的高度吗',
      'px、rem和em的区别',
      'flex弹性布局',
      'Grid布局',
      'position',
      'css问题总结',
      '使用css画一个三角形/圆形/半圆',
      'CSS 预处理器 //?'
    ],
    demo: '待补充：展示 Flex 居中、Grid 三列布局、`absolute` 定位参照元素、左侧固定右侧自适应布局。'
  },
  {
    file: 'docs/css/selectors/specificity-and-cascade.md',
    title: '选择器、优先级与层叠',
    sections: [
      '浏览器如何解析 CSS 选择器的，换句话说 CSS 的匹配规则是什么？',
      'css 如何匹配前 N 个子元素及最后 N 个子元素',
      '选择器优先级'
    ],
    demo: '待补充：提供多个冲突选择器，实时显示最终生效样式和优先级计算。'
  },
  {
    file: 'docs/css/visual-formatting/paint-reflow-visibility.md',
    title: '重排、重绘与隐藏方式',
    sections: [
      'line-height理解',
      'display:none, visiblity: hidden; opacity: 0之间的区别',
      '文字超长的省略号写法',
      '图片为什么有左右上下间隙,怎么去除?',
      'chrome字体如何小于12px?',
      '为什么会发生样式抖动?',
      '重排和重绘'
    ],
    demo: '待补充：对比三种隐藏方式的占位、点击和布局影响；展示布局读写交错导致的重排。'
  },
  {
    file: 'docs/javascript/language-basics/declaration-and-types.md',
    title: '变量声明与基础类型',
    sections: ['JavaScript', '常规问题', 'var/const/let的区别', '声明变量的6种方式', '对象', '数组', '函数'],
    demo: '待补充：展示 `var` 的函数作用域、`let/const` 的块级作用域、暂时性死区和 `const` 对象属性修改。'
  },
  {
    file: 'docs/javascript/execution-model/scope-closure-this.md',
    title: '执行上下文、作用域、闭包与 this',
    sections: ['**执行上下文**', '执行上下文栈', '变量对象', '作用域', '闭包', 'this', 'this在不同场景下的取值?'],
    demo: '待补充：展示作用域链查找、闭包保留变量、普通函数和箭头函数的 `this` 差异。'
  },
  {
    file: 'docs/javascript/object-model/prototype-and-inheritance.md',
    title: '原型链与继承',
    sections: ['原型链', '继承', '面向对象的3特征'],
    demo: '待补充：可视化对象、构造函数、`prototype`、实例原型之间的关系，并实现一个简化版 `new`。'
  },
  {
    file: 'docs/javascript/async/promise-async-await.md',
    title: 'Promise 与 async/await',
    sections: ['异步', 'Promise', 'async/await', 'js的垃圾回收机制'],
    demo: '待补充：可视化同步代码、Promise 微任务、`setTimeout` 宏任务的执行顺序。'
  },
  {
    file: 'docs/javascript/modules/module-systems.md',
    title: 'JavaScript 模块化',
    sections: ['模块化'],
    demo: '待补充：对比命名导出、默认导出、命名空间导入和重命名导入。'
  },
  {
    file: 'docs/javascript/dom-bom/events-and-storage.md',
    title: 'DOM 事件与前台存储',
    sections: [
      'DOM/BOM',
      '事件(了解)',
      '事件流',
      '事件绑定方式',
      '事件冒泡',
      '事件委托',
      'event.target/event.currentTarget',
      '事件冒泡与事件委托',
      '封装一个绑定事件监听的函数',
      'DOM查找/添加/删除节点',
      '前台数据存储'
    ],
    demo: '待补充：展示捕获和冒泡顺序、事件委托、`target/currentTarget` 差异，以及 Cookie/localStorage/sessionStorage 的生命周期差异。'
  },
  {
    file: 'docs/javascript/handwritten/common-implementations.md',
    title: '常见手写题',
    sections: ['手写代码', '来源', '防抖节流原理及应用', '深拷贝', '数组相关', '函数相关', '字符串处理', 'instanceof内部原理和实现', '函数柯里化', '高阶函数'],
    demo: '待补充：优先补深拷贝、防抖节流、`instanceof`、Promise 方法的可运行测试用例。'
  },
  {
    file: 'docs/typescript/type-system/basics-generics-utility.md',
    title: '类型基础、泛型与工具类型',
    sections: [
      'TypeScript面试题',
      '常规问题',
      '类型声明和类型推断的区别',
      '接口是什么, 作用,使用场景?和类型别名的区别',
      '泛型是什么, 如何创建泛型函数和泛型类, 实际用途',
      '枚举是什么? 作用及案例.',
      '如何处理可空类型（nullable types）和undefined类型，如何正确处理这些类型以避免潜在错误',
      '联合类型和交叉类型, 类型断言',
      '命名空间和模块',
      'TS内置数据类型又那些?',
      'any类型介绍'
    ],
    demo: '待补充：提供一组 TypeScript Playground 示例，对比 `any`、`unknown`、泛型、联合类型和交叉类型的类型检查结果。'
  },
  {
    file: 'docs/typescript/other/design-patterns-and-data-structures.md',
    title: '设计模式、数据结构和算法',
    sections: ['TS面试题', '设计模式', '数据结构和算法'],
    demo: '待补充：该页目前只承接原始标题，后续从其它原始文档补充具体题目。'
  },
  {
    file: 'docs/performance/metrics/white-screen-time.md',
    title: '白屏时间',
    sections: ['白屏时间'],
    demo: '待补充：在页面 head 末尾和首个可见内容处打印时间，比较旧版 `performance.timing` 与现代 PerformanceNavigationTiming。'
  }
]

const missing = []

for (const doc of docs) {
  const parts = []
  parts.push(`# ${doc.title}`)
  parts.push('')
  parts.push('迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。')
  parts.push('')
  parts.push('## 问题')
  parts.push('')
  for (const title of doc.sections) {
    parts.push(`- ${formatQuestionTitle(title)}`)
  }
  parts.push('')
  parts.push('## 结论')
  parts.push('')
  parts.push('以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。')
  parts.push('')

  for (const title of doc.sections) {
    const section = sections.find((item) => item.title === title)
    if (!section) {
      missing.push({ file: doc.file, title })
      continue
    }

    parts.push(`### ${formatSectionTitle(title)}`)
    parts.push('')
    const body = normalizeBody(section.body)
    if (body) {
      parts.push(body)
      parts.push('')
    }
  }

  parts.push('## Demo')
  parts.push('')
  parts.push(doc.demo)
  parts.push('')

  const target = path.join(root, doc.file)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, `${parts.join('\n').replace(/\n{4,}/g, '\n\n\n')}`, 'utf8')
}

if (missing.length > 0) {
  console.error('Missing raw sections:')
  console.error(JSON.stringify(missing, null, 2))
  process.exitCode = 1
} else {
  console.log(`synced ${docs.length} docs from raw-notes/01_HTML&CSS&JS&TS.md`)
}

syncScriptAsyncDeferRawSection()

function parseSections(content) {
  const lines = content.split('\n')
  const headings = []

  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(lines[index])
    if (match) {
      headings.push({
        line: index,
        level: match[1].length,
        title: match[2].trim()
      })
    }
  }

  return headings.map((heading, index) => {
    const next = headings.slice(index + 1).find((item) => item.level <= heading.level)
    const end = next ? next.line : lines.length
    return {
      ...heading,
      body: lines.slice(heading.line + 1, end).join('\n').trim()
    }
  })
}

function normalizeBody(body) {
  return body
    .split('\n')
    .map((line) => {
      const heading = /^(#{1,6})(\s+.+)$/.exec(line)
      if (!heading) return line
      return `${'#'.repeat(Math.min(6, heading[1].length + 1))}${heading[2]}`
    })
    .join('\n')
    .trim()
}

function formatQuestionTitle(title) {
  return formatSectionTitle(title)
}

function formatSectionTitle(title) {
  return title.replace(/^\*\*(.+)\*\*$/, '$1')
}

function syncScriptAsyncDeferRawSection() {
  const section = sections.find((item) => item.title === 'defer 与 async区别')
  if (!section) {
    missing.push({ file: 'docs/html/resource-loading/script-async-defer.md', title: 'defer 与 async区别' })
    return
  }

  const target = path.join(root, 'docs/html/resource-loading/script-async-defer.md')
  const current = readFileSync(target, 'utf8')
  const marker = '## 原文迁移'
  const rawSection = [
    marker,
    '',
    '以下内容来自 `raw-notes/01_HTML&CSS&JS&TS.md`，先完整保留，后续再去重和校准。',
    '',
    '### defer 与 async区别',
    '',
    normalizeBody(section.body),
    ''
  ].join('\n')

  const next = current.includes(marker)
    ? current.replace(new RegExp(`${marker}[\\s\\S]*$`), rawSection)
    : `${current.trim()}\n\n${rawSection}`

  writeFileSync(target, next, 'utf8')
}
