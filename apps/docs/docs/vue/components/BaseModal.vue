<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{ title?: string }>()

// v-model:visible 双向绑定，父组件是显隐状态的唯一来源
const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{ close: [] }>()

function close() {
  visible.value = false
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Transition name="base-modal">
    <div v-if="visible" class="base-modal__mask" @click.self="close">
      <div class="base-modal" role="dialog" aria-modal="true" :aria-label="title">
        <header class="base-modal__head">
          <slot name="header">
            <h3 class="base-modal__title">{{ title }}</h3>
          </slot>
          <button class="base-modal__close" type="button" aria-label="关闭" @click="close">×</button>
        </header>

        <div class="base-modal__body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="base-modal__foot">
          <slot name="footer" :close="close" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 遮罩用 absolute，约束在最近的定位容器内（演示场景）；生产可改 Teleport + fixed */
.base-modal__mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
}

.base-modal {
  width: min(360px, 90%);
  border-radius: 10px;
  background: var(--vp-c-bg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.base-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.base-modal__title {
  margin: 0;
  font-size: 15px;
}

.base-modal__close {
  border: 0;
  background: none;
  color: var(--vp-c-text-2);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.base-modal__body {
  padding: 14px;
}

.base-modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--vp-c-divider);
}

.base-modal-enter-active,
.base-modal-leave-active {
  transition: opacity 0.2s ease;
}

.base-modal-enter-from,
.base-modal-leave-to {
  opacity: 0;
}
</style>
