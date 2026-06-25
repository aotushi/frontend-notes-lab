<script setup lang="ts">
interface Field {
  key: string
  label: string
  type: 'input' | 'select'
  options?: { label: string; value: string }[]
}

defineProps<{ fields: Field[] }>()

// 整个查询对象用一个 v-model 收集
const model = defineModel<Record<string, any>>({ default: () => ({}) })
const emit = defineEmits<{ search: []; reset: [] }>()

function reset() {
  for (const key of Object.keys(model.value)) {
    model.value[key] = ''
  }
  emit('reset')
}
</script>

<template>
  <form class="search-form" @submit.prevent="emit('search')">
    <label v-for="field in fields" :key="field.key" class="search-form__item">
      <span>{{ field.label }}</span>
      <select v-if="field.type === 'select'" v-model="model[field.key]">
        <option value="">全部</option>
        <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <input v-else v-model="model[field.key]" />
    </label>

    <button class="search-form__btn" type="submit">查询</button>
    <button class="search-form__btn search-form__btn--ghost" type="button" @click="reset">重置</button>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
}

.search-form__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.search-form__item input,
.search-form__item select {
  padding: 5px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.search-form__btn {
  padding: 5px 12px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.search-form__btn--ghost {
  border-color: var(--vp-c-divider);
  background: none;
  color: var(--vp-c-text-1);
}
</style>
