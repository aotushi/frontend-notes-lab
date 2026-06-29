<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'

interface ConceptSection {
  title: string
  body?: string
  items?: string[]
  code?: string
  links?: ConceptLink[]
}

interface ConceptLink {
  label: string
  href: string
}

interface Props {
  title?: string
  label?: string
  details?: string
  sections?: ConceptSection[]
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
              <template v-if="props.sections?.length">
                <section v-for="section in props.sections" :key="section.title" class="concept-note__section">
                  <p class="concept-note__section-title">
                    <strong>{{ section.title }}</strong>
                  </p>
                  <p v-if="section.body">{{ section.body }}</p>
                  <ul v-if="section.items?.length">
                    <li v-for="item in section.items" :key="item">{{ item }}</li>
                  </ul>
                  <pre v-if="section.code"><code>{{ section.code }}</code></pre>
                  <ul v-if="section.links?.length" class="concept-note__links">
                    <li v-for="link in section.links" :key="link.href">
                      <a :href="link.href" target="_blank" rel="noreferrer">{{ link.label }}</a>
                    </li>
                  </ul>
                </section>
              </template>
              <p v-else-if="props.details">{{ props.details }}</p>
              <slot v-else />
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
  padding: 1px 3px;
  border: 0;
  border-radius: 3px;
  background: rgba(20, 184, 166, 0.1);
  color: var(--vp-c-text-1);
  font: inherit;
  line-height: inherit;
  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--vp-c-brand-1);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  cursor: pointer;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.concept-note__trigger:hover {
  background: rgba(20, 184, 166, 0.18);
  color: var(--vp-c-brand-1);
}

.concept-note__trigger:focus-visible {
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: 2px;
}

.concept-note__trigger--warning {
  background: rgba(234, 88, 12, 0.12);
  text-decoration-color: #c2410c;
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

.concept-note__body :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.concept-note__body :deep(a:hover) {
  color: var(--vp-c-brand-2);
}

.concept-note__section {
  margin: 14px 0;
}

.concept-note__section:first-child {
  margin-top: 0;
}

.concept-note__section:last-child {
  margin-bottom: 0;
}

.concept-note__section-title {
  margin-bottom: 4px;
}

.concept-note__body :deep(ul) {
  margin: 8px 0 0;
  padding-left: 20px;
}

.concept-note__body :deep(li + li) {
  margin-top: 4px;
}

.concept-note__body :deep(pre) {
  overflow: auto;
  margin: 8px 0 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--vp-code-block-bg);
  line-height: 1.65;
}

.concept-note__body :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: 0.92em;
}

.concept-note__body :deep(:not(pre) > code) {
  padding: 1px 4px;
  border-radius: 4px;
  background: var(--vp-code-bg);
  font-size: 0.92em;
}

.concept-note__body :deep(div[class*='language-']) {
  margin: 8px 0 0;
  border-radius: 6px;
  background: var(--vp-code-block-bg);
}

.concept-note__body :deep(div[class*='language-'] pre) {
  margin: 0;
}

.concept-note__body :deep(div[class*='language-'] > span.lang) {
  top: 6px;
  right: 8px;
}

.concept-note__links {
  list-style: disc;
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
