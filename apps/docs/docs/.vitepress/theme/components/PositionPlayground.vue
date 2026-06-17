<script setup lang="ts">
const staticCode = `.item {
  position: static;
  top: 24px;  /* 不生效 */
  left: 24px; /* 不生效 */
}`

const relativeCode = `.item {
  position: relative;
  top: 14px;
  left: 20px;
}`

const absoluteCode = `.card {
  position: relative;
}

.tag {
  position: absolute;
  top: 8px;
  right: 8px;
}`

const fixedCode = `.toolbar {
  position: fixed;
  right: 16px;
  bottom: 16px;
}`

const stickyCode = `.section-title {
  position: sticky;
  top: 0;
}`

const fixedSrcdoc = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 520px;
        background: #f8fafc;
        color: #334155;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      header {
        padding: 12px;
        background: #e0f2fe;
        color: #075985;
        font-weight: 700;
      }

      main {
        display: grid;
        gap: 10px;
        padding: 12px;
      }

      section {
        min-height: 92px;
        padding: 12px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #ffffff;
      }

      .toolbar {
        position: fixed;
        right: 16px;
        bottom: 16px;
        padding: 8px 12px;
        border-radius: 999px;
        background: #0f172a;
        color: #ffffff;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.22);
      }
    </style>
  </head>
  <body>
    <header>iframe 视口</header>
    <main>
      <section>内容块 A</section>
      <section>内容块 B</section>
      <section>内容块 C</section>
      <section>内容块 D</section>
    </main>
    <button class="toolbar" type="button">fixed 按钮</button>
  </body>
</html>`
</script>

<template>
  <section class="position-playground" aria-label="position 属性案例">
    <article class="position-case">
      <div class="position-case__preview" aria-label="static 定位效果">
        <div class="position-case__flow">
          <div class="position-case__block">A</div>
          <div class="position-case__block position-case__block--static">static</div>
          <div class="position-case__block">C</div>
        </div>
        <p class="position-case__caption">
          `static` 按正常流排列，`top` 和 `left` 不会移动它。
        </p>
      </div>

      <pre class="position-case__code"><code>{{ staticCode }}</code></pre>
    </article>

    <article class="position-case">
      <div class="position-case__preview" aria-label="relative 定位效果">
        <div class="position-case__relative-stage">
          <div class="position-case__ghost">原位置仍占位</div>
          <div class="position-case__relative-item">relative</div>
        </div>
        <p class="position-case__caption">
          `relative` 相对原位置偏移，但原位置仍保留在正常流里。
        </p>
      </div>

      <pre class="position-case__code"><code>{{ relativeCode }}</code></pre>
    </article>

    <article class="position-case">
      <div class="position-case__preview" aria-label="absolute 定位效果">
        <div class="position-case__card">
          <span class="position-case__tag">absolute</span>
          <strong>Card</strong>
          <span>`.card` 是定位祖先，角标贴到它的右上角。</span>
        </div>
        <p class="position-case__caption">
          `absolute` 脱离正常流，并相对找到的包含块定位。
        </p>
      </div>

      <pre class="position-case__code"><code>{{ absoluteCode }}</code></pre>
    </article>

    <article class="position-case">
      <div class="position-case__preview" aria-label="fixed 定位效果">
        <iframe
          class="position-case__iframe"
          :srcdoc="fixedSrcdoc"
          title="fixed 定位示例"
          sandbox=""
        />
        <p class="position-case__caption">
          `fixed` 通常相对视口固定。这里用 iframe 隔离出一个小视口，滚动后按钮仍贴在右下角。
        </p>
      </div>

      <pre class="position-case__code"><code>{{ fixedCode }}</code></pre>
    </article>

    <article class="position-case">
      <div class="position-case__preview" aria-label="sticky 定位效果">
        <div class="position-case__scroll">
          <h4 class="position-case__sticky-title">sticky 标题</h4>
          <p v-for="index in 6" :key="index" class="position-case__scroll-row">
            滚动内容 {{ index }}
          </p>
        </div>
        <p class="position-case__caption">
          `sticky` 先正常占位，滚到阈值后贴住滚动容器顶部。
        </p>
      </div>

      <pre class="position-case__code"><code>{{ stickyCode }}</code></pre>
    </article>
  </section>
</template>

<style scoped>
.position-playground {
  display: grid;
  gap: 18px;
  margin: 24px 0;
}

.position-case {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.92fr);
  gap: 16px;
  align-items: stretch;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.position-case__preview {
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
}

.position-case__flow {
  display: flex;
  gap: 10px;
  align-items: center;
  min-height: 132px;
  padding: 16px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.position-case__block {
  display: grid;
  place-items: center;
  width: 72px;
  height: 56px;
  border-radius: 6px;
  background: #dbeafe;
  color: #1e3a8a;
  font-size: 13px;
  font-weight: 700;
}

.position-case__block--static {
  position: static;
  top: 24px;
  left: 24px;
  background: #dcfce7;
  color: #166534;
}

.position-case__relative-stage {
  position: relative;
  min-height: 132px;
  padding: 18px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.position-case__ghost {
  display: grid;
  place-items: center;
  width: 144px;
  height: 60px;
  border: 2px dashed #94a3b8;
  border-radius: 6px;
  color: #64748b;
  font-size: 13px;
}

.position-case__relative-item {
  position: relative;
  top: 14px;
  left: 20px;
  display: grid;
  place-items: center;
  width: 144px;
  height: 60px;
  margin-top: -60px;
  border-radius: 6px;
  background: #fef3c7;
  color: #92400e;
  font-weight: 700;
  box-shadow: 0 10px 20px rgba(146, 64, 14, 0.12);
}

.position-case__card {
  position: relative;
  display: grid;
  gap: 8px;
  min-height: 132px;
  padding: 24px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background: linear-gradient(135deg, #eff6ff, #ffffff);
  color: #1e3a8a;
}

.position-case__card strong {
  font-size: 18px;
}

.position-case__card span:last-child {
  max-width: 260px;
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
}

.position-case__tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 5px 8px;
  border-radius: 6px;
  background: #1d4ed8;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.position-case__iframe {
  width: 100%;
  height: 180px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #ffffff;
}

.position-case__scroll {
  height: 180px;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.position-case__sticky-title {
  position: sticky;
  top: 0;
  z-index: 1;
  margin: 0;
  padding: 10px 12px;
  border-bottom: 1px solid #bae6fd;
  background: #e0f2fe;
  color: #075985;
  font-size: 14px;
}

.position-case__scroll-row {
  margin: 0;
  min-height: 56px;
  padding: 16px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.position-case__caption {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.position-case__code {
  min-width: 0;
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

.position-case__code code {
  white-space: pre;
}

@media (max-width: 760px) {
  .position-case {
    grid-template-columns: 1fr;
  }
}
</style>
