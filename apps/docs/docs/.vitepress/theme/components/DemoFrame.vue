<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src: string
  title?: string
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  title: '可验证案例',
  height: 560
})

const frameHeight = computed(() => {
  if (typeof props.height === 'number') {
    return `${props.height}px`
  }

  return /^\d+$/.test(props.height) ? `${props.height}px` : props.height
})
</script>

<template>
  <section class="demo-frame">
    <div class="demo-frame__toolbar">
      <strong class="demo-frame__title">{{ props.title }}</strong>
      <a class="demo-frame__link" :href="props.src" target="_blank" rel="noreferrer">
        新窗口打开
      </a>
    </div>
    <iframe
      class="demo-frame__iframe"
      :src="props.src"
      :title="props.title"
      :style="{ height: frameHeight }"
      loading="lazy"
      sandbox="allow-scripts allow-same-origin"
    />
  </section>
</template>

<style scoped>
.demo-frame {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.demo-frame__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.demo-frame__title {
  min-width: 0;
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.4;
}

.demo-frame__link {
  flex: 0 0 auto;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  text-decoration: none;
}

.demo-frame__link:hover {
  text-decoration: underline;
}

.demo-frame__iframe {
  display: block;
  width: 100%;
  border: 0;
  background: #ffffff;
}
</style>
