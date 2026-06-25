<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{ message: string; title?: string }>()
const emit = defineEmits<{ resolve: [boolean] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('resolve', false)
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="confirm__mask" @click.self="emit('resolve', false)">
    <div class="confirm" role="alertdialog" aria-modal="true">
      <h3 class="confirm__title">{{ title ?? '提示' }}</h3>
      <p class="confirm__msg">{{ message }}</p>
      <div class="confirm__actions">
        <button class="demo-btn demo-btn--ghost" type="button" @click="emit('resolve', false)">取消</button>
        <button class="demo-btn" type="button" @click="emit('resolve', true)">确定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 遮罩 absolute，约束在挂载容器内（演示场景） */
.confirm__mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
}

.confirm {
  width: min(320px, 90%);
  padding: 16px;
  border-radius: 10px;
  background: var(--vp-c-bg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.confirm__title {
  margin: 0 0 8px;
  font-size: 15px;
}

.confirm__msg {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.demo-btn {
  padding: 5px 12px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.demo-btn--ghost {
  border-color: var(--vp-c-divider);
  background: none;
  color: var(--vp-c-text-1);
}
</style>
