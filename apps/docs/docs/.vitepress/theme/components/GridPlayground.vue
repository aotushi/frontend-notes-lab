<script setup lang="ts">
import { computed, shallowRef } from 'vue'

type DemoKey = 'tracks' | 'areas' | 'gallery'
type TrackPreset = 'equal' | 'shell' | 'responsive'

const demos: Array<{ key: DemoKey; label: string }> = [
  { key: 'tracks', label: '轨道尺寸' },
  { key: 'areas', label: '命名区域' },
  { key: 'gallery', label: '九宫格' }
]

const trackPresets: Array<{ key: TrackPreset; label: string }> = [
  { key: 'equal', label: '三列等分' },
  { key: 'shell', label: '左右固定' },
  { key: 'responsive', label: '响应式卡片' }
]

const activeDemo = shallowRef<DemoKey>('tracks')
const trackPreset = shallowRef<TrackPreset>('equal')

const trackClass = computed(() => `grid-playground__track-grid--${trackPreset.value}`)

const trackCode = computed(() => {
  if (trackPreset.value === 'shell') {
    return `.layout {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) 120px;
  gap: 12px;
}`
  }

  if (trackPreset.value === 'responsive') {
    return `.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}`
  }

  return `.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}`
})

const trackItems = computed(() => {
  if (trackPreset.value === 'shell') {
    return ['left', 'main', 'right']
  }

  return ['A', 'B', 'C', 'D', 'E', 'F']
})
</script>

<template>
  <section class="grid-playground" aria-label="Grid 布局案例">
    <div class="grid-playground__tabs" role="tablist" aria-label="选择 Grid 案例">
      <button
        v-for="demo in demos"
        :key="demo.key"
        class="grid-playground__tab"
        :class="{ 'grid-playground__tab--active': activeDemo === demo.key }"
        type="button"
        role="tab"
        :aria-selected="activeDemo === demo.key"
        @click="activeDemo = demo.key"
      >
        {{ demo.label }}
      </button>
    </div>

    <div v-if="activeDemo === 'tracks'" class="grid-playground__panel">
      <div class="grid-playground__controls" aria-label="Grid 轨道尺寸控制">
        <button
          v-for="preset in trackPresets"
          :key="preset.key"
          class="grid-playground__control"
          :class="{ 'grid-playground__control--active': trackPreset === preset.key }"
          type="button"
          @click="trackPreset = preset.key"
        >
          {{ preset.label }}
        </button>
      </div>

      <div class="grid-playground__track-grid" :class="trackClass">
        <div
          v-for="item in trackItems"
          :key="item"
          class="grid-playground__tile"
          :class="{ 'grid-playground__tile--main': item === 'main' }"
        >
          {{ item }}
        </div>
      </div>

      <pre class="grid-playground__code"><code>{{ trackCode }}</code></pre>
    </div>

    <div v-else-if="activeDemo === 'areas'" class="grid-playground__panel">
      <div class="grid-playground__area-grid" aria-label="命名区域布局预览">
        <div class="grid-playground__area grid-playground__area--header">header</div>
        <div class="grid-playground__area grid-playground__area--sidebar">sidebar</div>
        <div class="grid-playground__area grid-playground__area--main">main</div>
        <div class="grid-playground__area grid-playground__area--footer">footer</div>
      </div>

      <pre class="grid-playground__code"><code>.page {
  display: grid;
  grid-template:
    "header header" auto
    "sidebar main" 1fr
    "footer footer" auto
    / 140px minmax(0, 1fr);
  gap: 12px;
}</code></pre>
    </div>

    <div v-else class="grid-playground__panel">
      <div class="grid-playground__gallery" aria-label="九宫格布局预览">
        <div v-for="index in 9" :key="index" class="grid-playground__gallery-item">
          {{ index }}
        </div>
      </div>

      <pre class="grid-playground__code"><code>.grid-9 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.grid-9 > div {
  aspect-ratio: 1;
}</code></pre>
    </div>
  </section>
</template>

<style scoped>
.grid-playground {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.grid-playground__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.grid-playground__tab,
.grid-playground__control {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 6px 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  cursor: pointer;
}

.grid-playground__tab--active,
.grid-playground__control--active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.grid-playground__panel {
  padding: 16px;
}

.grid-playground__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.grid-playground__track-grid,
.grid-playground__area-grid,
.grid-playground__gallery {
  display: grid;
  gap: 12px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
}

.grid-playground__track-grid--equal {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-playground__track-grid--shell {
  grid-template-columns: 120px minmax(0, 1fr) 120px;
}

.grid-playground__track-grid--responsive {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.grid-playground__tile,
.grid-playground__area,
.grid-playground__gallery-item {
  display: grid;
  place-items: center;
  min-height: 66px;
  border-radius: 6px;
  color: #172033;
  font-weight: 700;
  background: #a8d8ff;
}

.grid-playground__tile--main {
  background: #c8e6a0;
}

.grid-playground__area-grid {
  min-height: 260px;
  grid-template:
    "header header" minmax(52px, auto)
    "sidebar main" 1fr
    "footer footer" minmax(52px, auto)
    / minmax(96px, 140px) minmax(0, 1fr);
}

.grid-playground__area--header {
  grid-area: header;
  background: #b6cdfb;
}

.grid-playground__area--sidebar {
  grid-area: sidebar;
  background: #f3c982;
}

.grid-playground__area--main {
  grid-area: main;
  background: #9fd8c5;
}

.grid-playground__area--footer {
  grid-area: footer;
  background: #d8c0f0;
}

.grid-playground__gallery {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-playground__gallery-item {
  aspect-ratio: 1;
  min-height: 0;
  background: #ffd18a;
}

.grid-playground__code {
  margin: 16px 0 0;
  white-space: pre-wrap;
}

@media (max-width: 640px) {
  .grid-playground__track-grid--shell {
    grid-template-columns: 1fr;
  }

  .grid-playground__area-grid {
    grid-template:
      "header" minmax(52px, auto)
      "main" minmax(120px, 1fr)
      "sidebar" minmax(52px, auto)
      "footer" minmax(52px, auto)
      / minmax(0, 1fr);
  }
}
</style>
