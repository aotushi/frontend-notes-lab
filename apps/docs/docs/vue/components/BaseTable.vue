<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  title: string
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
  loading?: boolean
  page?: number       // 受控分页：当前页由父组件持有
  pageSize?: number
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  page: 1,
  pageSize: 10,
  total: 0
})

const emit = defineEmits<{
  'update:page': [page: number]   // 配合 v-model:page
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

function go(target: number) {
  if (target < 1 || target > pageCount.value) return
  emit('update:page', target)
}
</script>

<template>
  <div class="base-table">
    <table class="base-table__table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td v-for="col in columns" :key="col.key">
            <!-- 传了同名作用域插槽就交给父组件渲染，否则按 key 取值 -->
            <slot :name="`cell-${col.key}`" :row="row">{{ row[col.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="loading" class="base-table__status">加载中…</p>
    <p v-else-if="!data.length" class="base-table__status">暂无数据</p>

    <div class="base-table__pager">
      <button type="button" :disabled="page <= 1" @click="go(page - 1)">上一页</button>
      <span>{{ page }} / {{ pageCount }}</span>
      <button type="button" :disabled="page >= pageCount" @click="go(page + 1)">下一页</button>
    </div>
  </div>
</template>

<style scoped>
.base-table {
  font-size: 14px;
}

.base-table__table {
  width: 100%;
  border-collapse: collapse;
}

.base-table__table th,
.base-table__table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  white-space: nowrap;
}

.base-table__table th {
  color: var(--vp-c-text-2);
  font-weight: 600;
  background: var(--vp-c-bg-soft);
}

.base-table__status {
  padding: 16px;
  color: var(--vp-c-text-3);
  text-align: center;
}

.base-table__pager {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 2px 2px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.base-table__pager button {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  cursor: pointer;
}

.base-table__pager button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
