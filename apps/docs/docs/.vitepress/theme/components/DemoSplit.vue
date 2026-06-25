<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<template>
  <section class="demo-split" :aria-label="title ?? '代码与效果对照'">
    <div v-if="title" class="demo-split__bar">{{ title }}</div>
    <div class="demo-split__body">
      <div class="demo-split__pane demo-split__pane--code">
        <slot name="code" />
      </div>
      <div class="demo-split__pane demo-split__pane--effect">
        <slot name="effect" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-split {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.demo-split__bar {
  padding: 8px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
}

.demo-split__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.demo-split__pane {
  min-width: 0;
  max-height: 460px;
  overflow: auto;
}

.demo-split__pane--code {
  border-right: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.demo-split__pane--effect {
  padding: 16px;
}

/* 让左栏 markdown 代码块铺满、去掉默认外边距与圆角 */
.demo-split__pane--code :deep(div[class*='language-']) {
  margin: 0;
  border-radius: 0;
}

.demo-split__pane--code :deep(pre) {
  border-radius: 0;
}

@media (max-width: 720px) {
  .demo-split__body {
    grid-template-columns: 1fr;
  }

  .demo-split__pane--code {
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .demo-split__pane {
    max-height: none;
  }
}
</style>
