<script setup lang="ts">
import { computed, shallowRef } from 'vue'

type DemoId = 'masonry' | 'dialog' | 'columns' | 'sticky-shell' | 'legacy'
type LayoutVariant = 'holy' | 'double-wing' | 'flex' | 'grid'

const expandedDemoId = shallowRef<DemoId | null>(null)
const selectedLayoutVariant = shallowRef<LayoutVariant>('holy')

function toggleDemo(demoId: DemoId) {
  expandedDemoId.value = expandedDemoId.value === demoId ? null : demoId
}

const layoutVariants: Array<{
  id: LayoutVariant
  label: string
  selector: string
  modern: boolean
  description: string
}> = [
  {
    id: 'holy',
    label: '圣杯布局',
    selector: '.layout-case__layout-preview--holy',
    modern: false,
    description: '外层 padding 预留侧栏，左右栏用负 margin 和 relative 位移归位。'
  },
  {
    id: 'double-wing',
    label: '双飞翼布局',
    selector: '.layout-case__layout-preview--double-wing',
    modern: false,
    description: '主内容多一层 wrapper，用 wrapper margin 预留左右栏空间。'
  },
  {
    id: 'flex',
    label: '现代 Flex',
    selector: '.layout-case__layout-preview--flex',
    modern: true,
    description: '一维三栏布局直接用 flex-basis 固定侧栏，主内容 flex 自适应。'
  },
  {
    id: 'grid',
    label: '现代 Grid',
    selector: '.layout-case__layout-preview--grid',
    modern: true,
    description: '页面骨架最推荐 Grid，列定义直接表达“两侧固定，中间自适应”。'
  }
]

const masonryCode = `.masonry {
  column-count: 3;
  column-gap: 12px;
}

.card {
  break-inside: avoid;
  margin-block-end: 12px;
}`

const centerCode = `<!-- Dialog 通常由框架挂到 body 或指定容器 -->
<main class="app">...</main>

<div class="dialog-layer" aria-label="全局弹框层">
  <div class="dialog-mask" aria-hidden="true"></div>

  <section
    class="dialog"
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
  >
    <header class="dialog-header">
      <h2 id="dialog-title">确认提交</h2>
      <button aria-label="关闭">×</button>
    </header>

    <div class="dialog-body">...</div>

    <footer class="dialog-footer">
      <button>取消</button>
      <button class="primary">确认</button>
    </footer>
  </section>
</div>

.dialog-layer {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 24px;
}

.dialog-mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
}

.dialog {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  inline-size: min(520px, 100%);
  max-block-size: min(640px, calc(100vh - 48px));
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
}

.dialog-header,
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.dialog-body {
  min-height: 0;
  padding: 20px;
  overflow: auto;
}`

const columnsCode = `.layout {
  display: grid;
  grid-template-columns:
    160px minmax(0, 1fr) 160px;
  gap: 12px;
}

.main {
  min-width: 0;
}`

const shellCode = `.shell {
  block-size: 320px;
  overflow: auto;
}

.shell-header {
  position: sticky;
  top: 0;
  z-index: 1;
}

.shell-footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
}

.shell-content {
  padding: 12px;
}`

const layoutVariantCodes: Record<LayoutVariant, string> = {
  holy: `<div class="layout-case__layout-preview layout-case__layout-preview--holy">
  <main class="layout-case__layout-main">main first</main>
  <aside class="layout-case__layout-left">left</aside>
  <aside class="layout-case__layout-right">right</aside>
</div>

/* 圣杯布局：左侧预览的实际实现 */
.layout-case__layout-preview {
  --layout-side: 72px;
}

.layout-case__layout-preview--holy {
  display: flow-root;
  padding-inline: var(--layout-side);
}

.layout-case__layout-preview--holy .layout-case__layout-main,
.layout-case__layout-preview--holy .layout-case__layout-left,
.layout-case__layout-preview--holy .layout-case__layout-right {
  float: left;
}

.layout-case__layout-preview--holy .layout-case__layout-main {
  width: 100%;
}

.layout-case__layout-preview--holy .layout-case__layout-left {
  width: var(--layout-side);
  margin-left: -100%;
  position: relative;
  left: calc(-1 * var(--layout-side));
}

.layout-case__layout-preview--holy .layout-case__layout-right {
  width: var(--layout-side);
  margin-left: calc(-1 * var(--layout-side));
  position: relative;
  right: calc(-1 * var(--layout-side));
}`,

  'double-wing': `<div class="layout-case__layout-preview layout-case__layout-preview--double-wing">
  <main class="layout-case__layout-main">
    <div class="layout-case__layout-inner">main wrapper</div>
  </main>
  <aside class="layout-case__layout-left">left</aside>
  <aside class="layout-case__layout-right">right</aside>
</div>

/* 双飞翼布局：左侧预览的实际实现 */
.layout-case__layout-preview {
  --layout-side: 72px;
  --layout-gap: 10px;
}

.layout-case__layout-preview--double-wing {
  display: flow-root;
}

.layout-case__layout-preview--double-wing .layout-case__layout-main,
.layout-case__layout-preview--double-wing .layout-case__layout-left,
.layout-case__layout-preview--double-wing .layout-case__layout-right {
  float: left;
}

.layout-case__layout-preview--double-wing .layout-case__layout-main {
  width: 100%;
  min-height: 0;
  padding: 0;
  background: transparent;
}

.layout-case__layout-preview--double-wing .layout-case__layout-inner {
  margin-inline: calc(var(--layout-side) + var(--layout-gap));
}

.layout-case__layout-preview--double-wing .layout-case__layout-left {
  width: var(--layout-side);
  margin-left: -100%;
}

.layout-case__layout-preview--double-wing .layout-case__layout-right {
  width: var(--layout-side);
  margin-left: calc(-1 * var(--layout-side));
}`,

  flex: `<div class="layout-case__layout-preview layout-case__layout-preview--flex">
  <main class="layout-case__layout-main">flex: 1</main>
  <aside class="layout-case__layout-left">left</aside>
  <aside class="layout-case__layout-right">right</aside>
</div>

/* 现代 Flex：左侧预览的实际实现 */
.layout-case__layout-preview {
  --layout-side: 72px;
  --layout-gap: 10px;
}

.layout-case__layout-preview--flex {
  display: flex;
  gap: var(--layout-gap);
}

.layout-case__layout-preview--flex .layout-case__layout-main {
  order: 2;
  min-width: 0;
  flex: 1;
}

.layout-case__layout-preview--flex .layout-case__layout-left {
  order: 1;
  flex: 0 0 var(--layout-side);
}

.layout-case__layout-preview--flex .layout-case__layout-right {
  order: 3;
  flex: 0 0 var(--layout-side);
}`,

  grid: `<div class="layout-case__layout-preview layout-case__layout-preview--grid">
  <aside class="layout-case__layout-left">120px</aside>
  <main class="layout-case__layout-main">minmax(0, 1fr)</main>
  <aside class="layout-case__layout-right">120px</aside>
</div>

/* 现代 Grid：左侧预览的实际实现 */
.layout-case__layout-preview {
  --layout-side: 72px;
  --layout-gap: 10px;
}

.layout-case__layout-preview--grid {
  display: grid;
  grid-template-columns:
    var(--layout-side) minmax(0, 1fr) var(--layout-side);
  gap: var(--layout-gap);
}

.layout-case__layout-preview--grid .layout-case__layout-main {
  min-width: 0;
}`
}

const selectedLayout = computed(
  () => layoutVariants.find((variant) => variant.id === selectedLayoutVariant.value) ?? layoutVariants[0]
)

const selectedLayoutCode = computed(() => layoutVariantCodes[selectedLayoutVariant.value])

const masonryCards = [
  { title: 'A', height: '58px' },
  { title: 'B', height: '86px' },
  { title: 'C', height: '68px' },
  { title: 'D', height: '112px' },
  { title: 'E', height: '76px' },
  { title: 'F', height: '96px' },
  { title: 'G', height: '62px' }
]
</script>

<template>
  <section class="layout-patterns-playground" aria-label="经典 CSS 布局案例">
    <article class="layout-case" :class="{ 'layout-case--expanded': expandedDemoId === 'masonry' }">
      <header class="layout-case__header">
        <h3 class="layout-case__title">1. CSS 多列瀑布流</h3>
        <button class="layout-case__toggle" type="button" @click="toggleDemo('masonry')">
          {{ expandedDemoId === 'masonry' ? '收起' : '展开' }}
        </button>
      </header>

      <div class="layout-case__preview" aria-label="瀑布流布局示例">
        <div class="layout-case__masonry">
          <div
            v-for="card in masonryCards"
            :key="card.title"
            class="layout-case__masonry-card"
            :style="{ minHeight: card.height }"
          >
            {{ card.title }}
          </div>
        </div>
        <p class="layout-case__caption">
          多列布局实现视觉瀑布流；内容按列填充，不保证按行从左到右。
        </p>
      </div>

      <pre class="layout-case__code"><code>{{ masonryCode }}</code></pre>
    </article>

    <article class="layout-case" :class="{ 'layout-case--expanded': expandedDemoId === 'dialog' }">
      <header class="layout-case__header">
        <h3 class="layout-case__title">2. 全局浮层 Dialog 居中</h3>
        <button class="layout-case__toggle" type="button" @click="toggleDemo('dialog')">
          {{ expandedDemoId === 'dialog' ? '收起' : '展开' }}
        </button>
      </header>

      <div class="layout-case__preview" aria-label="居中弹窗示例">
        <div class="layout-case__dialog-stage">
          <div class="layout-case__page-card">
            <strong>页面内容</strong>
            <span>业务页面不负责弹框居中</span>
          </div>

          <div class="layout-case__dialog-layer" aria-label="全局弹框层示例">
            <div class="layout-case__dialog-mask" aria-hidden="true"></div>

            <section class="layout-case__dialog" role="dialog" aria-modal="true" aria-labelledby="demo-dialog-title">
              <header class="layout-case__dialog-header">
                <h3 id="demo-dialog-title">确认提交</h3>
                <button type="button" aria-label="关闭">×</button>
              </header>

              <div class="layout-case__dialog-body">
                <p>全屏浮层负责定位和遮罩，弹框本体负责内容布局。</p>
              </div>

              <footer class="layout-case__dialog-footer">
                <button type="button">取消</button>
                <button class="layout-case__dialog-primary" type="button">确认</button>
              </footer>
            </section>
          </div>
        </div>
        <p class="layout-case__caption">
          Dialog 通常挂到 body 或指定容器下；预览中用局部舞台模拟 fixed 全局浮层。
        </p>
      </div>

      <pre class="layout-case__code"><code>{{ centerCode }}</code></pre>
    </article>

    <article class="layout-case" :class="{ 'layout-case--expanded': expandedDemoId === 'columns' }">
      <header class="layout-case__header">
        <h3 class="layout-case__title">3. 两侧固定，中间自适应</h3>
        <button class="layout-case__toggle" type="button" @click="toggleDemo('columns')">
          {{ expandedDemoId === 'columns' ? '收起' : '展开' }}
        </button>
      </header>

      <div class="layout-case__preview" aria-label="三栏布局示例">
        <div class="layout-case__columns">
          <aside>left</aside>
          <main>main: minmax(0, 1fr)</main>
          <aside>right</aside>
        </div>
        <p class="layout-case__caption">
          页面骨架优先 Grid；中间列用 `minmax(0, 1fr)` 处理长内容收缩。
        </p>
      </div>

      <pre class="layout-case__code"><code>{{ columnsCode }}</code></pre>
    </article>

    <article class="layout-case" :class="{ 'layout-case--expanded': expandedDemoId === 'sticky-shell' }">
      <header class="layout-case__header">
        <h3 class="layout-case__title">4. 滚动容器内 Sticky 头尾</h3>
        <button class="layout-case__toggle" type="button" @click="toggleDemo('sticky-shell')">
          {{ expandedDemoId === 'sticky-shell' ? '收起' : '展开' }}
        </button>
      </header>

      <div class="layout-case__preview" aria-label="上下固定中间滚动示例">
        <div class="layout-case__shell">
          <header class="layout-case__shell-header">Header sticky top</header>
          <section class="layout-case__shell-content">
            <p v-for="index in 8" :key="index">滚动内容 {{ index }}</p>
          </section>
          <footer class="layout-case__shell-footer">Footer sticky bottom</footer>
        </div>
        <p class="layout-case__caption">
          header/footer 在同一个滚动容器里用 sticky 吸顶和吸底。
        </p>
      </div>

      <pre class="layout-case__code"><code>{{ shellCode }}</code></pre>
    </article>

    <article class="layout-case layout-case--legacy-demo" :class="{ 'layout-case--expanded': expandedDemoId === 'legacy' }">
      <header class="layout-case__header">
        <h3 class="layout-case__title">5. 圣杯布局和双飞翼布局</h3>
        <button class="layout-case__toggle" type="button" @click="toggleDemo('legacy')">
          {{ expandedDemoId === 'legacy' ? '收起' : '展开' }}
        </button>
      </header>

      <div class="layout-case__preview" aria-label="圣杯和双飞翼布局示例">
        <div class="layout-case__variant-tabs" aria-label="选择布局方案">
          <button
            v-for="variant in layoutVariants"
            :key="variant.id"
            class="layout-case__variant-button"
            :class="{ 'layout-case__variant-button--active': selectedLayoutVariant === variant.id }"
            type="button"
            :aria-pressed="selectedLayoutVariant === variant.id"
            @click="selectedLayoutVariant = variant.id"
          >
            {{ variant.label }}
          </button>
        </div>

        <div class="layout-case__legacy">
          <section class="layout-case__layout-panel">
            <h4>{{ selectedLayout.label }}</h4>
            <code class="layout-case__selector">{{ selectedLayout.selector }}</code>

            <div
              v-if="selectedLayoutVariant === 'holy'"
              class="layout-case__layout-preview layout-case__layout-preview--holy"
              data-css=".layout-case__layout-preview--holy"
            >
              <main class="layout-case__layout-main" data-css=".layout-case__layout-main">
                <strong>main first</strong>
              </main>
              <aside class="layout-case__layout-left" data-css=".layout-case__layout-left">left</aside>
              <aside class="layout-case__layout-right" data-css=".layout-case__layout-right">right</aside>
            </div>

            <div
              v-else-if="selectedLayoutVariant === 'double-wing'"
              class="layout-case__layout-preview layout-case__layout-preview--double-wing"
              data-css=".layout-case__layout-preview--double-wing"
            >
              <main class="layout-case__layout-main" data-css=".layout-case__layout-main">
                <div class="layout-case__layout-inner" data-css=".layout-case__layout-inner">
                  <strong>main wrapper</strong>
                </div>
              </main>
              <aside class="layout-case__layout-left" data-css=".layout-case__layout-left">left</aside>
              <aside class="layout-case__layout-right" data-css=".layout-case__layout-right">right</aside>
            </div>

            <div
              v-else-if="selectedLayoutVariant === 'flex'"
              class="layout-case__layout-preview layout-case__layout-preview--flex"
              data-css=".layout-case__layout-preview--flex"
            >
              <main class="layout-case__layout-main" data-css=".layout-case__layout-main">
                <strong>flex: 1</strong>
              </main>
              <aside class="layout-case__layout-left" data-css=".layout-case__layout-left">left</aside>
              <aside class="layout-case__layout-right" data-css=".layout-case__layout-right">right</aside>
            </div>

            <div
              v-else
              class="layout-case__layout-preview layout-case__layout-preview--grid"
              data-css=".layout-case__layout-preview--grid"
            >
              <aside class="layout-case__layout-left" data-css=".layout-case__layout-left">120px</aside>
              <main class="layout-case__layout-main" data-css=".layout-case__layout-main">
                <strong>minmax(0, 1fr)</strong>
              </main>
              <aside class="layout-case__layout-right" data-css=".layout-case__layout-right">120px</aside>
            </div>

            <p>{{ selectedLayout.description }}</p>
          </section>
        </div>
        <p class="layout-case__caption">
          圣杯和双飞翼用于理解旧浮动题；新项目优先 Flex 或 Grid。
        </p>
      </div>

      <pre class="layout-case__code"><code>{{ selectedLayoutCode }}</code></pre>
    </article>
  </section>
</template>

<style scoped>
.layout-patterns-playground {
  display: grid;
  gap: 18px;
  margin: 24px 0;
}

.layout-case {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.92fr);
  gap: 12px 16px;
  align-items: start;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.layout-case__header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.layout-case__title {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.layout-case__toggle {
  flex: 0 0 auto;
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
}

.layout-case__toggle:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.layout-case__preview {
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
  max-height: 360px;
  overflow: auto;
}

.layout-case__caption {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.layout-case__code {
  min-width: 0;
  max-height: 360px;
  margin: 0;
  padding: 14px;
  overflow: auto;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 13px;
  line-height: 1.6;
}

.layout-case--expanded .layout-case__preview,
.layout-case--expanded .layout-case__code {
  max-height: none;
  overflow-y: visible;
}

.layout-case--expanded .layout-case__code {
  overflow-x: auto;
}

.layout-case--legacy-demo .layout-case__preview {
  max-height: none;
  overflow: visible;
}

.layout-case__variant-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  padding: 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.layout-case__variant-button {
  min-width: 0;
  padding: 7px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 12px;
  line-height: 1.25;
  cursor: pointer;
}

.layout-case__variant-button:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.layout-case__variant-button--active {
  color: var(--vp-c-brand-1);
  background: rgba(59, 130, 246, 0.12);
  font-weight: 700;
}

.layout-case__code code {
  white-space: pre;
}

.layout-case__masonry {
  column-count: 3;
  column-gap: 12px;
  min-height: 220px;
  padding: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.layout-case__masonry-card {
  display: grid;
  place-items: center;
  break-inside: avoid;
  margin-block-end: 12px;
  border-radius: 6px;
  background: #dbeafe;
  color: #1e3a8a;
  font-weight: 700;
}

.layout-case__dialog-stage {
  position: relative;
  min-height: 260px;
  overflow: hidden;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: #f3f4f6;
}

.layout-case__page-card {
  display: grid;
  gap: 6px;
  width: min(300px, calc(100% - 28px));
  margin: 14px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.layout-case__page-card strong {
  color: #111827;
  font-size: 15px;
}

.layout-case__page-card span {
  color: #64748b;
  font-size: 12px;
}

.layout-case__dialog-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  padding: 18px;
}

.layout-case__dialog-mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
}

.layout-case__dialog {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(360px, 100%);
  max-height: calc(100% - 36px);
  overflow: hidden;
  border: 1px solid rgba(229, 231, 235, 0.9);
  border-radius: 8px;
  background: #ffffff;
  color: #1f2937;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.22),
    0 8px 24px rgba(15, 23, 42, 0.12);
}

.layout-case__dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #eef0f3;
}

.layout-case__dialog-header h3 {
  margin: 0;
  color: #111827;
  font-size: 16px;
  line-height: 1.4;
}

.layout-case__dialog-header button {
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  font: inherit;
  cursor: pointer;
}

.layout-case__dialog-header button:hover {
  background: #f3f4f6;
  color: #111827;
}

.layout-case__dialog-body {
  min-height: 0;
  padding: 16px;
  overflow: auto;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.6;
}

.layout-case__dialog-body p {
  margin: 0;
}

.layout-case__dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid #eef0f3;
}

.layout-case__dialog-footer button {
  min-width: 64px;
  padding: 7px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  font: inherit;
  font-size: 13px;
  line-height: 1.2;
  cursor: pointer;
}

.layout-case__dialog-footer button:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.layout-case__dialog-footer .layout-case__dialog-primary {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.layout-case__dialog-footer .layout-case__dialog-primary:hover {
  border-color: #1d4ed8;
  background: #1d4ed8;
}

.layout-case__columns {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) 110px;
  gap: 10px;
  min-height: 180px;
  padding: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.layout-case__columns > * {
  display: grid;
  place-items: center;
  min-width: 0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
}

.layout-case__columns aside {
  background: #dcfce7;
  color: #166534;
}

.layout-case__columns main {
  background: #fef3c7;
  color: #92400e;
}

.layout-case__shell {
  height: 220px;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.layout-case__shell-header,
.layout-case__shell-footer {
  position: sticky;
  z-index: 1;
  padding: 10px 12px;
  background: #e0f2fe;
  color: #075985;
  font-weight: 700;
}

.layout-case__shell-header {
  top: 0;
}

.layout-case__shell-footer {
  bottom: 0;
}

.layout-case__shell-content {
  padding: 10px 12px;
}

.layout-case__shell-content p {
  margin: 0 0 10px;
  padding: 12px;
  border-radius: 6px;
  background: #f8fafc;
  color: #475569;
}

.layout-case__legacy {
  display: grid;
  gap: 12px;
  min-height: 190px;
  padding: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.layout-case__layout-panel {
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.layout-case__layout-panel h4 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.4;
}

.layout-case__selector {
  width: fit-content;
  max-width: 100%;
  padding: 3px 6px;
  overflow: hidden;
  border-radius: 5px;
  background: rgba(15, 23, 42, 0.08);
  color: var(--vp-c-text-2);
  font-size: 11px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layout-case__layout-panel p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.55;
}

.layout-case__layout-preview {
  --layout-side: 72px;
  --layout-gap: 10px;
  min-width: 0;
  overflow: hidden;
}

.layout-case__layout-left,
.layout-case__layout-right,
.layout-case__layout-main,
.layout-case__layout-inner {
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: 48px;
  padding: 0 6px;
  border-radius: 6px;
  text-align: center;
  font-size: 12px;
  line-height: 1.35;
}

.layout-case__layout-left[data-css],
.layout-case__layout-right[data-css],
.layout-case__layout-main[data-css],
.layout-case__layout-inner[data-css] {
  align-content: center;
  gap: 4px;
}

.layout-case__layout-left[data-css]::before,
.layout-case__layout-right[data-css]::before,
.layout-case__layout-main[data-css]::before,
.layout-case__layout-inner[data-css]::before {
  content: attr(data-css);
  display: block;
  max-width: 100%;
  overflow: hidden;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 9px;
  font-weight: 600;
  line-height: 1.2;
  opacity: 0.72;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layout-case__layout-left,
.layout-case__layout-right {
  background: #e0e7ff;
  color: #3730a3;
}

.layout-case__layout-main,
.layout-case__layout-inner {
  background: #fef3c7;
  color: #92400e;
}

.layout-case__layout-preview--flex .layout-case__layout-left,
.layout-case__layout-preview--flex .layout-case__layout-right,
.layout-case__layout-preview--grid .layout-case__layout-left,
.layout-case__layout-preview--grid .layout-case__layout-right {
  background: #dcfce7;
  color: #166534;
}

.layout-case__layout-preview--flex .layout-case__layout-main,
.layout-case__layout-preview--grid .layout-case__layout-main {
  background: #dbeafe;
  color: #1e3a8a;
}

.layout-case__layout-preview--holy {
  display: flow-root;
  padding-inline: var(--layout-side);
}

.layout-case__layout-preview--holy .layout-case__layout-main,
.layout-case__layout-preview--holy .layout-case__layout-left,
.layout-case__layout-preview--holy .layout-case__layout-right {
  float: left;
}

.layout-case__layout-preview--holy .layout-case__layout-main {
  width: 100%;
}

.layout-case__layout-preview--holy .layout-case__layout-left {
  width: var(--layout-side);
  margin-left: -100%;
  position: relative;
  left: calc(-1 * var(--layout-side));
}

.layout-case__layout-preview--holy .layout-case__layout-right {
  width: var(--layout-side);
  margin-left: calc(-1 * var(--layout-side));
  position: relative;
  right: calc(-1 * var(--layout-side));
}

.layout-case__layout-preview--double-wing {
  display: flow-root;
}

.layout-case__layout-preview--double-wing .layout-case__layout-main,
.layout-case__layout-preview--double-wing .layout-case__layout-left,
.layout-case__layout-preview--double-wing .layout-case__layout-right {
  float: left;
}

.layout-case__layout-preview--double-wing .layout-case__layout-main {
  width: 100%;
  min-height: 0;
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.layout-case__layout-preview--double-wing .layout-case__layout-inner {
  margin-inline: calc(var(--layout-side) + var(--layout-gap));
}

.layout-case__layout-preview--double-wing .layout-case__layout-left {
  width: var(--layout-side);
  margin-left: -100%;
}

.layout-case__layout-preview--double-wing .layout-case__layout-right {
  width: var(--layout-side);
  margin-left: calc(-1 * var(--layout-side));
}

.layout-case__layout-preview--flex {
  display: flex;
  gap: var(--layout-gap);
}

.layout-case__layout-preview--flex .layout-case__layout-main {
  order: 2;
  min-width: 0;
  flex: 1;
}

.layout-case__layout-preview--flex .layout-case__layout-left {
  order: 1;
  flex: 0 0 var(--layout-side);
}

.layout-case__layout-preview--flex .layout-case__layout-right {
  order: 3;
  flex: 0 0 var(--layout-side);
}

.layout-case__layout-preview--grid {
  display: grid;
  grid-template-columns: var(--layout-side) minmax(0, 1fr) var(--layout-side);
  gap: var(--layout-gap);
}

@media (max-width: 760px) {
  .layout-case {
    grid-template-columns: 1fr;
  }

  .layout-case__masonry {
    column-count: 2;
  }

  .layout-case__columns {
    grid-template-columns: 78px minmax(0, 1fr) 78px;
  }

  .layout-case__legacy {
    grid-template-columns: 1fr;
  }

  .layout-case__variant-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .layout-case__layout-preview {
    --layout-side: 62px;
    --layout-gap: 8px;
  }
}
</style>
