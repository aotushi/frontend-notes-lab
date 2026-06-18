<script setup lang="ts">
</script>

<template>
  <figure class="grid-parts" aria-label="Grid 网格组成部分图例">
    <div class="grid-parts__items">
      <section class="grid-parts__part" aria-label="网格线图例">
        <div class="grid-parts__mini-grid">
          <span
            v-for="index in 6"
            :key="`line-cell-${index}`"
            class="grid-parts__cell"
            aria-hidden="true"
          ></span>
          <span class="grid-parts__line-highlight" aria-hidden="true"></span>
        </div>
        <figcaption class="grid-parts__label">网格线</figcaption>
      </section>

      <section class="grid-parts__part" aria-label="网格轨道图例">
        <div class="grid-parts__mini-grid">
          <span
            v-for="index in 6"
            :key="`track-cell-${index}`"
            class="grid-parts__cell"
            :class="{ 'grid-parts__cell--highlight': index <= 3 }"
            aria-hidden="true"
          ></span>
        </div>
        <figcaption class="grid-parts__label">网格轨道</figcaption>
      </section>

      <section class="grid-parts__part" aria-label="网格单元图例">
        <div class="grid-parts__mini-grid">
          <span
            v-for="index in 6"
            :key="`cell-cell-${index}`"
            class="grid-parts__cell"
            :class="{ 'grid-parts__cell--highlight': index === 5 }"
            aria-hidden="true"
          ></span>
        </div>
        <figcaption class="grid-parts__label">网格单元</figcaption>
      </section>

      <section class="grid-parts__part" aria-label="网格区域图例">
        <div class="grid-parts__mini-grid">
          <span
            v-for="index in 6"
            :key="`area-cell-${index}`"
            class="grid-parts__cell"
            :class="{ 'grid-parts__cell--highlight': [2, 3, 5, 6].includes(index) }"
            aria-hidden="true"
          ></span>
        </div>
        <figcaption class="grid-parts__label">网格区域</figcaption>
      </section>
    </div>

    <p class="grid-parts__caption">
      同一张 3 列 2 行网格分别高亮一个概念：线是分隔边界，轨道是一整行或一整列，单元格是一个行列交叉点，区域是多个相邻单元格组成的矩形。
    </p>
  </figure>
</template>

<style scoped>
.grid-parts {
  margin: 20px 0 24px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.grid-parts__items {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
}

.grid-parts__part {
  min-width: 0;
}

.grid-parts__mini-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, 66px);
  border: 2px solid #3f3f3f;
  background: var(--vp-c-bg);
}

.grid-parts__cell {
  min-width: 0;
  min-height: 0;
  border-right: 2px solid #3f3f3f;
  border-bottom: 2px solid #3f3f3f;
  background: #fff;
}

.grid-parts__cell:nth-child(3n) {
  border-right: 0;
}

.grid-parts__cell:nth-last-child(-n + 3) {
  border-bottom: 0;
}

.grid-parts__cell--highlight {
  background: #a7a7a7;
}

.grid-parts__line-highlight {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc((100% / 3) * 2);
  width: 8px;
  transform: translateX(-50%);
  background: #9c9c9c;
}

.grid-parts__label {
  margin-top: 10px;
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
}

.grid-parts__caption {
  margin: 16px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

@media (max-width: 820px) {
  .grid-parts__items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .grid-parts {
    padding: 14px;
  }

  .grid-parts__items {
    grid-template-columns: 1fr;
  }

  .grid-parts__mini-grid {
    grid-template-rows: repeat(2, 58px);
  }
}
</style>
