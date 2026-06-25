// 数据表格 Table 的可编辑沙盒源码（喂给 ReplBox）。
// 自包含：去掉 VitePress 的 --vp-c-* 变量，改用具体色值。
// SFC 字符串里的反引号 / ${} 需转义，避免破坏外层模板字符串。

const App = `<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseTable from './BaseTable.vue'

interface User {
  id: number
  name: string
  role: string
  status: 'active' | 'inactive'
}

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'role', title: '角色' },
  { key: 'status', title: '状态' },
  { key: 'action', title: '操作' }
]

const all: User[] = [
  { id: 1, name: '张三', role: '管理员', status: 'active' },
  { id: 2, name: '李四', role: '编辑', status: 'active' },
  { id: 3, name: '王五', role: '访客', status: 'inactive' },
  { id: 4, name: '赵六', role: '编辑', status: 'active' },
  { id: 5, name: '钱七', role: '访客', status: 'inactive' },
  { id: 6, name: '孙八', role: '管理员', status: 'active' },
  { id: 7, name: '周九', role: '编辑', status: 'active' },
  { id: 8, name: '吴十', role: '访客', status: 'inactive' },
  { id: 9, name: '郑十一', role: '编辑', status: 'active' },
  { id: 10, name: '王十二', role: '访客', status: 'inactive' },
  { id: 11, name: '冯十三', role: '管理员', status: 'active' },
  { id: 12, name: '陈十四', role: '编辑', status: 'active' }
]

const page = ref(1)
const pageSize = 5
// 前端切片模拟分页：当前页数据随 page 派生
const list = computed(() => all.slice((page.value - 1) * pageSize, page.value * pageSize))

const lastAction = ref('')
function edit(row: User) {
  lastAction.value = \`编辑：\${row.name}\`
}
function remove(row: User) {
  lastAction.value = \`删除：\${row.name}\`
}
</script>

<template>
  <div class="demo">
    <BaseTable
      v-model:page="page"
      :columns="columns"
      :data="list"
      :page-size="pageSize"
      :total="all.length"
    >
      <!-- 状态列：作用域插槽拿到 row 渲染标签 -->
      <template #cell-status="{ row }">
        <span class="tag" :class="\`tag--\${row.status}\`">
          {{ row.status === 'active' ? '启用' : '停用' }}
        </span>
      </template>
      <!-- 操作列 -->
      <template #cell-action="{ row }">
        <button class="link" type="button" @click="edit(row)">编辑</button>
        <button class="link link--danger" type="button" @click="remove(row)">删除</button>
      </template>
    </BaseTable>

    <p v-if="lastAction" class="hint">最近操作：{{ lastAction }}</p>
  </div>
</template>

<style>
.demo { padding: 16px; font-family: system-ui, sans-serif; color: #1a1a1a; }
.tag { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 12px; }
.tag--active { color: #15803d; background: rgba(34, 197, 94, 0.14); }
.tag--inactive { color: #999; background: #f6f6f7; }
.link { margin-right: 8px; padding: 0; border: 0; background: none; color: #3451b2; font: inherit; cursor: pointer; }
.link--danger { color: #dc2626; }
.hint { margin: 10px 0 0; color: #555; font-size: 13px; }
</style>
`

const BaseTable = `<script setup lang="ts">
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
            <slot :name="\`cell-\${col.key}\`" :row="row">{{ row[col.key] }}</slot>
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
.base-table { font-size: 14px; color: #1a1a1a; }
.base-table__table { width: 100%; border-collapse: collapse; }
.base-table__table th,
.base-table__table td {
  padding: 8px 10px;
  border-bottom: 1px solid #e2e2e3;
  text-align: left;
  white-space: nowrap;
}
.base-table__table th {
  color: #555;
  font-weight: 600;
  background: #f6f6f7;
}
.base-table__status {
  padding: 16px;
  color: #999;
  text-align: center;
}
.base-table__pager {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 2px 2px;
  color: #555;
  font-size: 13px;
}
.base-table__pager button {
  padding: 4px 10px;
  border: 1px solid #e2e2e3;
  border-radius: 6px;
  color: #1a1a1a;
  background: #fff;
  cursor: pointer;
}
.base-table__pager button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
`

export const tableFiles: Record<string, string> = {
  'src/TableApp.vue': App,
  'src/BaseTable.vue': BaseTable
}
