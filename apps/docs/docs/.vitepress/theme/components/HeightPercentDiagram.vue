<template>
  <figure class="height-diagram" aria-labelledby="height-percent-diagram-title">
    <figcaption id="height-percent-diagram-title" class="height-diagram__title">
      百分比高度要一层层找到“已确定高度”的基准
    </figcaption>

    <div class="height-diagram__grid">
      <section class="height-diagram__case height-diagram__case--bad">
        <div class="height-diagram__case-title">只写 body: 100%</div>
        <div class="height-diagram__viewport">
          <span class="height-diagram__label">视口</span>
          <div class="height-diagram__box height-diagram__box--auto">
            html: auto
            <div class="height-diagram__box height-diagram__box--uncertain">
              body: 100% ?
            </div>
          </div>
        </div>
        <p class="height-diagram__note">父级高度是 auto，子级的 100% 没有稳定参照。</p>
      </section>

      <section class="height-diagram__case height-diagram__case--good">
        <div class="height-diagram__case-title">html -> body -> #app</div>
        <div class="height-diagram__viewport">
          <span class="height-diagram__label">视口高度</span>
          <div class="height-diagram__box height-diagram__box--html">
            html: 100%
            <div class="height-diagram__box height-diagram__box--body">
              body: 100%
              <div class="height-diagram__box height-diagram__box--app">
                #app: 100%
              </div>
            </div>
          </div>
        </div>
        <p class="height-diagram__note">每一层都有明确高度，100% 才能继续往下计算。</p>
      </section>
    </div>
  </figure>
</template>

<style scoped>
.height-diagram {
  margin: 18px 0;
}

.height-diagram__title {
  margin-bottom: 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
}

.height-diagram__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.height-diagram__case {
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.height-diagram__case-title {
  margin-bottom: 10px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.height-diagram__viewport {
  position: relative;
  min-height: 214px;
  padding: 18px;
  border: 2px dashed rgba(31, 118, 111, 0.38);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(31, 118, 111, 0.08), rgba(31, 118, 111, 0.02));
}

.height-diagram__label {
  position: absolute;
  top: 8px;
  right: 10px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  line-height: 1.2;
}

.height-diagram__box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
}

.height-diagram__box--auto {
  height: 112px;
  border: 2px solid rgba(148, 163, 184, 0.75);
  background: rgba(148, 163, 184, 0.12);
}

.height-diagram__box--uncertain {
  height: 50px;
  border: 2px solid rgba(190, 18, 60, 0.56);
  background: rgba(244, 63, 94, 0.12);
  color: #9f1239;
}

.height-diagram__box--html {
  height: 176px;
  border: 2px solid rgba(31, 118, 111, 0.6);
  background: rgba(31, 118, 111, 0.09);
}

.height-diagram__box--body {
  flex: 1 1 auto;
  border: 2px solid rgba(14, 116, 144, 0.58);
  background: rgba(14, 116, 144, 0.09);
}

.height-diagram__box--app {
  flex: 1 1 auto;
  border: 2px solid rgba(79, 70, 229, 0.54);
  background: rgba(79, 70, 229, 0.09);
}

.height-diagram__note {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 760px) {
  .height-diagram__grid {
    grid-template-columns: 1fr;
  }

  .height-diagram__viewport {
    min-height: 196px;
  }
}
</style>
