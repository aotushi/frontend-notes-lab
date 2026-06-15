<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { CSSProperties } from 'vue'

type DemoKey = 'axis' | 'shorthand' | 'wrapping'
type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type Justify = 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
type AlignItems = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'
type AlignContent = 'stretch' | 'flex-start' | 'center' | 'space-between' | 'space-around'

const demos: Array<{ key: DemoKey; label: string }> = [
  { key: 'axis', label: '轴与对齐' },
  { key: 'shorthand', label: 'flex 简写' },
  { key: 'wrapping', label: '多行布局' }
]

const activeDemo = shallowRef<DemoKey>('axis')
const direction = shallowRef<Direction>('row')
const justifyContent = shallowRef<Justify>('space-between')
const alignItems = shallowRef<AlignItems>('center')
const isWrapped = shallowRef(true)
const alignContent = shallowRef<AlignContent>('stretch')

const axisStyle = computed<CSSProperties>(() => ({
  flexDirection: direction.value,
  justifyContent: justifyContent.value,
  alignItems: alignItems.value,
  flexWrap: isWrapped.value ? 'wrap' : 'nowrap',
  alignContent: alignContent.value
}))

const axisCode = computed(
  () => `.container {
  display: flex;
  flex-direction: ${direction.value};
  flex-wrap: ${isWrapped.value ? 'wrap' : 'nowrap'};
  justify-content: ${justifyContent.value};
  align-items: ${alignItems.value};
  align-content: ${alignContent.value};
}`
)

const directionOptions: Direction[] = ['row', 'row-reverse', 'column', 'column-reverse']
const justifyOptions: Justify[] = ['flex-start', 'center', 'space-between', 'space-around', 'space-evenly']
const alignItemOptions: AlignItems[] = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline']
const alignContentOptions: AlignContent[] = ['stretch', 'flex-start', 'center', 'space-between', 'space-around']
</script>

<template>
  <section class="flex-playground" aria-label="Flex 布局案例">
    <div class="flex-playground__tabs" role="tablist" aria-label="选择 Flex 案例">
      <button
        v-for="demo in demos"
        :key="demo.key"
        class="flex-playground__tab"
        :class="{ 'flex-playground__tab--active': activeDemo === demo.key }"
        type="button"
        role="tab"
        :aria-selected="activeDemo === demo.key"
        @click="activeDemo = demo.key"
      >
        {{ demo.label }}
      </button>
    </div>

    <div v-if="activeDemo === 'axis'" class="flex-playground__panel">
      <div class="flex-playground__controls" aria-label="Flex 轴与对齐控制">
        <label class="flex-playground__field">
          <span>flex-direction</span>
          <select v-model="direction">
            <option v-for="option in directionOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>

        <label class="flex-playground__field">
          <span>justify-content</span>
          <select v-model="justifyContent">
            <option v-for="option in justifyOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>

        <label class="flex-playground__field">
          <span>align-items</span>
          <select v-model="alignItems">
            <option v-for="option in alignItemOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>

        <label class="flex-playground__field">
          <span>align-content</span>
          <select v-model="alignContent">
            <option v-for="option in alignContentOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>

        <label class="flex-playground__check">
          <input v-model="isWrapped" type="checkbox" />
          <span>flex-wrap: wrap</span>
        </label>
      </div>

      <div class="flex-playground__stage" :style="axisStyle">
        <div class="flex-playground__item flex-playground__item--short">A</div>
        <div class="flex-playground__item flex-playground__item--tall">B</div>
        <div class="flex-playground__item">C</div>
        <div class="flex-playground__item flex-playground__item--wide">D</div>
        <div class="flex-playground__item">E</div>
      </div>

      <pre class="flex-playground__code"><code>{{ axisCode }}</code></pre>
    </div>

    <div v-else-if="activeDemo === 'shorthand'" class="flex-playground__panel">
      <p class="flex-playground__note">
        下方容器可横向拖拽。观察不同简写在剩余空间和空间不足时的行为。
      </p>

      <div class="flex-playground__resize">
        <div class="flex-playground__row">
          <div class="flex-playground__cell flex-playground__cell--initial">
            <strong>initial</strong>
            <span>0 1 auto</span>
          </div>
          <div class="flex-playground__cell flex-playground__cell--auto">
            <strong>auto</strong>
            <span>1 1 auto</span>
          </div>
          <div class="flex-playground__cell flex-playground__cell--none">
            <strong>none</strong>
            <span>0 0 auto</span>
          </div>
          <div class="flex-playground__cell flex-playground__cell--one">
            <strong>1</strong>
            <span>1 1 0%</span>
          </div>
        </div>
      </div>

      <ul class="flex-playground__facts">
        <li><code>flex: auto</code> 先按自身主轴尺寸参与计算，再参与放大和缩小。</li>
        <li><code>flex: none</code> 不放大也不缩小，容易撑破容器。</li>
        <li><code>flex: 1</code> 把基准尺寸视为 0，再按增长因子分配剩余空间。</li>
      </ul>
    </div>

    <div v-else class="flex-playground__panel">
      <p class="flex-playground__note">
        固定每行列数时，优先用 <code>gap</code> 与 <code>flex-basis</code> 控制间距和宽度，最后一行自然从左开始。
      </p>

      <div class="flex-playground__wrap-grid">
        <div v-for="index in 8" :key="index" class="flex-playground__tile">
          {{ index }}
        </div>
      </div>

      <pre class="flex-playground__code"><code>.list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.item {
  flex: 0 0 calc((100% - 36px) / 4);
}</code></pre>
    </div>
  </section>
</template>

<style scoped>
.flex-playground {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.flex-playground__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.flex-playground__tab {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 6px 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  cursor: pointer;
}

.flex-playground__tab--active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.flex-playground__panel {
  padding: 16px;
}

.flex-playground__controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.flex-playground__field,
.flex-playground__check {
  display: grid;
  gap: 6px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.flex-playground__field select {
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 7px 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.flex-playground__check {
  align-content: end;
  grid-template-columns: auto 1fr;
  align-items: center;
}

.flex-playground__stage {
  display: flex;
  gap: 10px;
  min-height: 220px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
}

.flex-playground__item {
  display: grid;
  place-items: center;
  flex: 0 0 70px;
  min-width: 52px;
  min-height: 48px;
  border-radius: 6px;
  color: #0f172a;
  font-weight: 700;
  background: #9bd7d1;
}

.flex-playground__item--short {
  min-height: 36px;
}

.flex-playground__item--tall {
  min-height: 86px;
}

.flex-playground__item--wide {
  flex-basis: 110px;
}

.flex-playground__code {
  margin: 16px 0 0;
  white-space: pre-wrap;
}

.flex-playground__note {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
}

.flex-playground__resize {
  resize: horizontal;
  overflow: auto;
  max-width: 100%;
  min-width: 300px;
  width: 78%;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
}

.flex-playground__row {
  display: flex;
  gap: 10px;
}

.flex-playground__cell {
  display: grid;
  align-content: center;
  min-width: 88px;
  min-height: 72px;
  border-radius: 6px;
  padding: 10px;
  color: #0f172a;
  background: #b8d7ff;
}

.flex-playground__cell span {
  font-size: 12px;
}

.flex-playground__cell--initial {
  flex: initial;
}

.flex-playground__cell--auto {
  flex: auto;
}

.flex-playground__cell--none {
  flex: none;
}

.flex-playground__cell--one {
  flex: 1;
}

.flex-playground__facts {
  margin: 14px 0 0;
}

.flex-playground__wrap-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
}

.flex-playground__tile {
  display: grid;
  place-items: center;
  flex: 0 0 calc((100% - 36px) / 4);
  min-height: 58px;
  border-radius: 6px;
  color: #0f172a;
  font-weight: 700;
  background: #ffd18a;
}

@media (max-width: 640px) {
  .flex-playground__resize {
    min-width: 240px;
    width: 100%;
  }

  .flex-playground__tile {
    flex-basis: calc((100% - 12px) / 2);
  }
}
</style>
