// 搜索表单 SearchForm 的可编辑沙盒源码（喂给 ReplBox）。
// 自包含：--vp-c-* 改具体色值。

const App = `<script setup lang="ts">
import { reactive, ref } from 'vue'
import SearchForm from './SearchForm.vue'

const query = reactive<Record<string, any>>({ name: '', status: '' })
const submitted = ref('')

const fields = [
  { key: 'name', label: '姓名', type: 'input' as const },
  {
    key: 'status',
    label: '状态',
    type: 'select' as const,
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'inactive' }
    ]
  }
]

// 真实场景这里会发请求，demo 里只回显参数
function fetchList() {
  submitted.value = JSON.stringify(query)
}
</script>

<template>
  <div class="demo">
    <SearchForm v-model="query" :fields="fields" @search="fetchList" @reset="fetchList" />
    <p class="hint">查询参数：<code>{{ submitted || '（点查询 / 重置）' }}</code></p>
  </div>
</template>

<style>
.demo {
  padding: 24px;
  font-family: system-ui, sans-serif;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hint { margin: 0; color: #555; font-size: 13px; }
.hint code { padding: 1px 6px; border-radius: 4px; background: #f6f6f7; font-size: 12px; }
</style>
`

const SearchForm = `<script setup lang="ts">
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
.search-form { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; }
.search-form__item { display: flex; flex-direction: column; gap: 4px; color: #555; font-size: 13px; }
.search-form__item input,
.search-form__item select {
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  color: #1a1a1a;
}
.search-form__btn {
  padding: 5px 12px;
  border: 1px solid #3451b2;
  border-radius: 6px;
  background: #3451b2;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}
.search-form__btn--ghost { border-color: #ccc; background: none; color: #333; }
</style>
`

export const searchFormFiles: Record<string, string> = {
  'src/SearchFormApp.vue': App,
  'src/SearchForm.vue': SearchForm
}
