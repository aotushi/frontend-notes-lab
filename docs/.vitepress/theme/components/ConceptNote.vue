<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'

interface Props {
  title?: string
  label?: string
  tone?: 'default' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'default'
})

const isOpen = shallowRef(false)
const triggerLabel = computed(() => props.label ?? props.title ?? '查看释义')
const panelTitle = computed(() => props.title ?? props.label ?? '概念释义')
const panelTitleId = computed(() => `concept-note-title-${slugText(panelTitle.value)}`)
const panelId = computed(() => `concept-note-panel-${slugText(panelTitle.value)}`)

function slugText(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

function openPanel() {
  isOpen.value = true
}

function closePanel() {
  isOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closePanel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <span class="concept-note">
    <button
      class="concept-note__trigger"
      :class="`concept-note__trigger--${props.tone}`"
      type="button"
      :aria-controls="panelId"
      :aria-expanded="isOpen"
      @click="openPanel"
    >
      {{ triggerLabel }}
    </button>

    <Teleport to="body">
      <Transition name="concept-note-panel">
        <div v-if="isOpen" class="concept-note__layer" role="presentation">
          <button class="concept-note__scrim" type="button" aria-label="关闭释义" @click="closePanel" />
          <aside
            :id="panelId"
            class="concept-note__panel"
            :class="`concept-note__panel--${props.tone}`"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="panelTitleId"
          >
            <header class="concept-note__header">
              <div class="concept-note__heading">
                <span class="concept-note__marker" aria-hidden="true" />
                <strong :id="panelTitleId" class="concept-note__title">{{ panelTitle }}</strong>
              </div>
              <button class="concept-note__close" type="button" aria-label="关闭释义" @click="closePanel">
                ×
              </button>
            </header>

            <div class="concept-note__body">
              <slot />
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style scoped>
.concept-note {
  display: inline;
}

.concept-note__trigger {
  display: inline;
  margin: 0;
  padding: 2px 7px;
  border: 0;
  border-radius: 6px;
  background: #111827;
  color: #f9fafb;
  font: inherit;
  line-height: inherit;
  cursor: pointer;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.concept-note__trigger:hover {
  background: #0f766e;
}

.concept-note__trigger:focus-visible {
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: 2px;
}

.concept-note__trigger--warning {
  background: #7c2d12;
}

.concept-note__layer {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
}

.concept-note__scrim {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(15, 23, 42, 0.28);
  cursor: default;
  pointer-events: auto;
}

.concept-note__panel {
  position: absolute;
  top: 72px;
  right: 24px;
  bottom: 24px;
  width: min(560px, calc(100vw - 48px));
  overflow: auto;
  padding: 20px;
  border: 1px solid rgba(31, 118, 111, 0.26);
  border-radius: 8px;
  background:
    linear-gradient(rgba(31, 118, 111, 0.08) 1px, transparent 1px),
    var(--vp-c-bg);
  background-size: 100% 28px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
  pointer-events: auto;
}

.concept-note__panel--warning {
  border-color: rgba(181, 103, 13, 0.32);
  background:
    linear-gradient(rgba(181, 103, 13, 0.1) 1px, transparent 1px),
    var(--vp-c-bg);
  background-size: 100% 28px;
}

.concept-note__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.concept-note__heading {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.concept-note__marker {
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.concept-note__title {
  min-width: 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
  line-height: 1.45;
}

.concept-note__close {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.concept-note__close:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-2);
}

.concept-note__body {
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.8;
}

.concept-note__body :deep(p) {
  margin: 10px 0;
}

.concept-note__body :deep(p:first-child) {
  margin-top: 0;
}

.concept-note__body :deep(p:last-child) {
  margin-bottom: 0;
}

.concept-note__body :deep(strong) {
  color: var(--vp-c-brand-1);
}

.concept-note-panel-enter-active,
.concept-note-panel-leave-active {
  transition: opacity 160ms ease;
}

.concept-note-panel-enter-from,
.concept-note-panel-leave-to {
  opacity: 0;
}

@media (max-width: 760px) {
  .concept-note__panel {
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    max-height: min(82vh, 720px);
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 12px 12px 0 0;
  }
}
</style>
