<script setup lang="ts">
import { computed } from 'vue'

type TimelineTraceType = 'html' | 'css' | 'js' | 'event' | 'resource'

interface Lane {
  id: string
  label: string
  type: TimelineTraceType
  description?: string
}

interface Span {
  lane: string
  start: number
  end: number
  type?: TimelineTraceType
  label?: string
}

interface Marker {
  lane: string
  time: number
  type?: TimelineTraceType
  label: string
}

interface TimelinePoint {
  lane: string
  time: number
}

interface Dependency {
  from: TimelinePoint
  to: TimelinePoint
  label?: string
}

interface Props {
  title?: string
  description?: string
  lanes: Lane[]
  spans?: Span[]
  markers?: Marker[]
  dependencies?: Dependency[]
  maxTime?: number
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  spans: () => [],
  markers: () => [],
  dependencies: () => [],
  unit: 'ms'
})

const laneHeight = 52
const laneMap = computed(() => new Map(props.lanes.map((lane, index) => [lane.id, { lane, index }])))

const resolvedMaxTime = computed(() => {
  if (props.maxTime && props.maxTime > 0) {
    return props.maxTime
  }

  const spanMax = props.spans.reduce((max, span) => Math.max(max, span.end), 0)
  const markerMax = props.markers.reduce((max, marker) => Math.max(max, marker.time), 0)
  const dependencyMax = props.dependencies.reduce(
    (max, dependency) => Math.max(max, dependency.from.time, dependency.to.time),
    0
  )

  return Math.max(spanMax, markerMax, dependencyMax, 1)
})

const tickValues = computed(() => {
  const max = resolvedMaxTime.value
  return [0, max * 0.25, max * 0.5, max * 0.75, max]
})

const dependencyViewBox = computed(() => `0 0 100 ${Math.max(props.lanes.length * laneHeight, laneHeight)}`)

function toPercent(value: number) {
  return `${Math.min(Math.max((value / resolvedMaxTime.value) * 100, 0), 100)}%`
}

function formatTime(value: number) {
  return `${Math.round(value)}${props.unit}`
}

function laneType(laneId: string, fallback?: TimelineTraceType) {
  return fallback ?? laneMap.value.get(laneId)?.lane.type ?? 'resource'
}

function laneY(laneId: string) {
  const lane = laneMap.value.get(laneId)
  return lane ? lane.index * laneHeight + laneHeight / 2 : laneHeight / 2
}

function dependencyPath(dependency: Dependency) {
  const x1 = Number.parseFloat(toPercent(dependency.from.time))
  const x2 = Number.parseFloat(toPercent(dependency.to.time))
  const y1 = laneY(dependency.from.lane)
  const y2 = laneY(dependency.to.lane)
  const mid = x1 + (x2 - x1) * 0.55

  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
}
</script>

<template>
  <section class="timeline-trace">
    <header v-if="props.title || props.description" class="timeline-trace__header">
      <strong v-if="props.title" class="timeline-trace__title">{{ props.title }}</strong>
      <p v-if="props.description" class="timeline-trace__description">{{ props.description }}</p>
    </header>

    <div class="timeline-trace__grid" :style="{ '--lane-count': props.lanes.length }">
      <div class="timeline-trace__axis-spacer" aria-hidden="true" />
      <div class="timeline-trace__axis" aria-hidden="true">
        <span
          v-for="tick in tickValues"
          :key="tick"
          class="timeline-trace__tick"
          :style="{ left: toPercent(tick) }"
        >
          {{ formatTime(tick) }}
        </span>
      </div>

      <template v-for="lane in props.lanes" :key="lane.id">
        <div class="timeline-trace__lane-label">
          <span class="timeline-trace__lane-name">{{ lane.label }}</span>
          <small v-if="lane.description" class="timeline-trace__lane-description">{{ lane.description }}</small>
        </div>
        <div class="timeline-trace__track">
          <span
            v-for="span in props.spans.filter((item) => item.lane === lane.id)"
            :key="`${span.lane}-${span.start}-${span.end}-${span.label ?? ''}`"
            class="timeline-trace__span"
            :class="`timeline-trace__span--${laneType(span.lane, span.type)}`"
            :style="{
              left: toPercent(span.start),
              width: toPercent(span.end - span.start)
            }"
            :title="span.label ? `${span.label}: ${formatTime(span.start)} - ${formatTime(span.end)}` : undefined"
          />
          <span
            v-for="marker in props.markers.filter((item) => item.lane === lane.id)"
            :key="`${marker.lane}-${marker.time}-${marker.label}`"
            class="timeline-trace__marker"
            :class="`timeline-trace__marker--${laneType(marker.lane, marker.type)}`"
            :style="{ left: toPercent(marker.time) }"
            :title="`${marker.label}: ${formatTime(marker.time)}`"
            :aria-label="`${marker.label}: ${formatTime(marker.time)}`"
          />
        </div>
      </template>

      <svg
        v-if="props.dependencies.length > 0"
        class="timeline-trace__dependencies"
        :viewBox="dependencyViewBox"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          v-for="dependency in props.dependencies"
          :key="`${dependency.from.lane}-${dependency.from.time}-${dependency.to.lane}-${dependency.to.time}`"
          class="timeline-trace__dependency"
          :class="`timeline-trace__dependency--${laneType(dependency.to.lane)}`"
          :d="dependencyPath(dependency)"
        />
      </svg>
    </div>

    <ul v-if="props.markers.length > 0" class="timeline-trace__events" aria-label="时序事件清单">
      <li v-for="marker in props.markers" :key="`${marker.lane}-${marker.time}-${marker.label}`">
        <span
          class="timeline-trace__event-swatch"
          :class="`timeline-trace__event-swatch--${laneType(marker.lane, marker.type)}`"
          aria-hidden="true"
        />
        <span class="timeline-trace__event-label">{{ marker.label }}</span>
        <time class="timeline-trace__event-time">{{ formatTime(marker.time) }}</time>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.timeline-trace {
  --trace-html: #2563eb;
  --trace-css: #0f766e;
  --trace-js: #4f46e5;
  --trace-event: #be123c;
  --trace-resource: #b45309;
  --trace-line: color-mix(in srgb, var(--vp-c-text-2) 24%, transparent);
  margin: 20px 0;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.timeline-trace__header {
  margin-bottom: 14px;
}

.timeline-trace__title {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.5;
}

.timeline-trace__description {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.timeline-trace__grid {
  position: relative;
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  grid-template-rows: 28px repeat(var(--lane-count), 52px);
  column-gap: 14px;
  overflow-x: auto;
}

.timeline-trace__axis,
.timeline-trace__track {
  min-width: 420px;
}

.timeline-trace__axis {
  position: relative;
  color: var(--vp-c-text-2);
  font-size: 11px;
}

.timeline-trace__tick {
  position: absolute;
  top: 2px;
  transform: translateX(-50%);
  white-space: nowrap;
}

.timeline-trace__lane-label {
  display: grid;
  align-content: center;
  min-width: 0;
  border-top: 1px solid var(--vp-c-divider);
}

.timeline-trace__lane-name {
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-trace__lane-description {
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 11px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-trace__track {
  position: relative;
  border-top: 1px solid var(--vp-c-divider);
  background: linear-gradient(to right, var(--trace-line) 1px, transparent 1px) 0 0 / 25% 100% repeat-x;
}

.timeline-trace__track::before {
  content: "";
  position: absolute;
  right: 0;
  left: 0;
  top: 50%;
  border-top: 1px dashed var(--trace-line);
}

.timeline-trace__span,
.timeline-trace__marker {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-trace__span {
  min-width: 3px;
  height: 12px;
  border-radius: 999px;
  background: var(--trace-resource);
}

.timeline-trace__marker {
  width: 8px;
  height: 28px;
  border-radius: 999px;
  background: var(--trace-resource);
  box-shadow: 0 0 0 3px var(--vp-c-bg);
}

.timeline-trace__span--html,
.timeline-trace__marker--html,
.timeline-trace__event-swatch--html {
  background: var(--trace-html);
}

.timeline-trace__span--css,
.timeline-trace__marker--css,
.timeline-trace__event-swatch--css {
  background: var(--trace-css);
}

.timeline-trace__span--js,
.timeline-trace__marker--js,
.timeline-trace__event-swatch--js {
  background: var(--trace-js);
}

.timeline-trace__span--event,
.timeline-trace__marker--event,
.timeline-trace__event-swatch--event {
  background: var(--trace-event);
}

.timeline-trace__span--resource,
.timeline-trace__marker--resource,
.timeline-trace__event-swatch--resource {
  background: var(--trace-resource);
}

.timeline-trace__dependencies {
  position: relative;
  z-index: 2;
  grid-column: 2;
  grid-row: 2 / span var(--lane-count);
  width: 100%;
  min-width: 420px;
  height: calc(var(--lane-count) * 52px);
  pointer-events: none;
}

.timeline-trace__dependency {
  fill: none;
  stroke: var(--trace-resource);
  stroke-width: 0.8;
  stroke-linecap: round;
  stroke-dasharray: 2 2.5;
  vector-effect: non-scaling-stroke;
}

.timeline-trace__dependency--html {
  stroke: var(--trace-html);
}

.timeline-trace__dependency--css {
  stroke: var(--trace-css);
}

.timeline-trace__dependency--js {
  stroke: var(--trace-js);
}

.timeline-trace__dependency--event {
  stroke: var(--trace-event);
}

.timeline-trace__events {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.timeline-trace__events li {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 7px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.timeline-trace__event-swatch {
  width: 5px;
  height: 22px;
  border-radius: 999px;
  background: var(--trace-resource);
}

.timeline-trace__event-label {
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-trace__event-time {
  color: var(--vp-c-text-2);
  font-family: Consolas, "Courier New", monospace;
  font-size: 11px;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .timeline-trace {
    padding: 12px;
  }

  .timeline-trace__grid {
    grid-template-columns: 112px minmax(0, 1fr);
    column-gap: 10px;
  }
}
</style>
