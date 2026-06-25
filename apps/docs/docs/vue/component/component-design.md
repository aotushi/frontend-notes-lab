<script setup>
import { tableFiles } from '../components/tableSandbox'
import { modalFiles } from '../components/modalSandbox'
import { searchFormFiles } from '../components/searchFormSandbox'
import { dialogFiles } from '../components/dialogSandbox'
</script>

# Vue 组件封装

### 理解路径

封装一个组件，本质是**设计一套稳定的对外契约，并隐藏内部实现**。对外接口只有三类：**props**（数据输入）、**事件**（行为输出）、**插槽**（结构注入）；命令式入口、属性透传、逻辑复用是围绕它们的增强。

下面用中后台最高频的四个组件落地，每个突出一种封装范式：

- **数据表格 Table**：配置驱动 + 作用域插槽 + 受控分页
- **弹窗 Modal**：`v-model` 受控显隐 + 具名插槽
- **查询表单 SearchForm**：配置驱动渲染 + 整体 `v-model` 收集
- **确认框 Dialog**：命令式 / Promise 化调用

props / `$emit` / v-model / `$attrs` 的语法细节见 [Vue 组件通信](/vue/component/component-communication)，本页聚焦如何把它们组织成可复用组件。

### 设计原则

| 原则 | 含义 | 反面 |
| --- | --- | --- |
| 单一职责 | 一个组件只解决一类问题 | 既管数据请求又管复杂展示 |
| 契约最小 | 对外只暴露必要的 props / 事件 / 插槽 | props 爆炸，什么都能配 |
| 单向数据流 | props 只读，状态变更靠事件回传 | 子组件直接改 props |
| 可组合优先 | 用插槽 / composable 扩展，而非堆配置项 | 用十几个布尔 props 控制结构 |
| 状态可预测 | 明确受控 / 非受控，保持单一数据源 | 父子各存一份、来回同步 |

**受控**指状态由父组件通过 props 传入、变更经事件回传（如下面的 Table 分页、Modal 显隐）；**非受控**指组件自管内部状态。对外需要同步的状态用受控，纯内部交互用非受控。

---

## 数据表格 Table

中后台最高频的封装，考点集中在**配置驱动**、**作用域插槽**和**受控分页**。

```vue
<!-- BaseTable.vue -->
<script setup lang="ts">
interface Column {
  key: string
  title: string
  width?: number
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
  loading?: boolean
  page?: number   // 受控分页：当前页由父组件持有
  total?: number
}

withDefaults(defineProps<Props>(), {
  loading: false,
  page: 1,
  total: 0
})

const emit = defineEmits<{
  'update:page': [page: number]   // 配合 v-model:page
}>()
</script>

<template>
  <div class="base-table">
    <table>
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

    <Pagination :page="page" :total="total" @change="emit('update:page', $event)" />
  </div>
</template>
```

调用方按需自定义某一列，作用域插槽把整行数据交还父组件：

```vue
<BaseTable
  v-model:page="page"
  :columns="columns"
  :data="list"
  :loading="loading"
  :total="total"
>
  <!-- 自定义“操作”列：插槽拿到 row -->
  <template #cell-action="{ row }">
    <button @click="edit(row)">编辑</button>
    <button @click="remove(row)">删除</button>
  </template>
</BaseTable>
```

**封装要点**

- **配置驱动**：列由 `columns` 描述，组件不写死任何业务列，新增列只改配置。
- **作用域插槽自定义列**：默认按 `key` 取值（插槽 fallback），传 `#cell-xxx` 就把 `row` 交给父组件渲染状态标签、操作按钮、图片等。
- **分页受控**：组件不持有页码，`v-model:page` 让父组件做唯一数据源，翻页只 `emit('update:page')`，数据请求留在父层。
- **加载 / 空状态内置**，调用方不必每个页面重写。

可编辑的完整沙盒（Monaco 编辑器，浏览器内实时编译）——左侧切换 `TableApp.vue` / `BaseTable.vue`，右侧实时预览：

<ReplBox :files="tableFiles" main-file="src/TableApp.vue" height="600px" />

## 弹窗 Modal

弹窗的核心是**受控显隐**和**具名插槽分区**。

```vue
<!-- BaseModal.vue -->
<script setup lang="ts">
defineProps<{ title?: string }>()

// v-model:visible 双向绑定，父组件是显隐状态的唯一来源
const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{ close: [] }>()

function close() {
  visible.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal__mask" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true">
        <header class="modal__head">
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
          <button aria-label="关闭" @click="close">×</button>
        </header>

        <div class="modal__body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="modal__foot">
          <slot name="footer" :close="close" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>
```

```vue
<BaseModal v-model:visible="open" title="新建用户">
  <UserForm v-model="form" />
  <template #footer="{ close }">
    <button @click="close">取消</button>
    <button @click="submit">保存</button>
  </template>
</BaseModal>
```

**封装要点**

- **受控显隐**：用 `defineModel('visible')` 双向绑定，组件内部不再另存一份 open，避免父子两份状态不同步。
- **具名插槽分区**：`header` / 默认 / `footer` 三个槽位；footer 通过作用域把 `close` 暴露给调用方，按钮逻辑交还业务。
- **插槽判空**：没传 footer 就不渲染底栏（`v-if="$slots.footer"`），避免空白边距。
- **可访问性**：`role="dialog"` + `aria-modal`，遮罩 `@click.self` 与关闭按钮两种关闭方式。

可编辑的完整沙盒（Monaco 编辑器，浏览器内实时编译）——左侧切换 `ModalApp.vue` / `BaseModal.vue`，右侧实时预览：

<ReplBox :files="modalFiles" main-file="src/ModalApp.vue" height="560px" />

## 查询表单 SearchForm

列表页标配，考点是**配置驱动渲染**和**整体 `v-model` 收集**。

```vue
<!-- SearchForm.vue -->
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
        <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <input v-else v-model="model[field.key]" />
    </label>

    <button type="submit">查询</button>
    <button type="button" @click="reset">重置</button>
  </form>
</template>
```

```vue
<SearchForm
  v-model="query"
  :fields="[
    { key: 'name', label: '姓名', type: 'input' },
    { key: 'status', label: '状态', type: 'select', options: statusOptions }
  ]"
  @search="fetchList"
  @reset="fetchList"
/>
```

**封装要点**

- **配置驱动渲染**：表单项由 `fields` 描述，组件按 `type` 选控件，新增查询条件只改配置不动组件。
- **整体 v-model 收集**：用一个 `defineModel` 把所有字段聚成查询对象，父组件直接拿 `query` 发请求。
- **行为事件化**：组件只收集数据并发出 `search` / `reset`，请求逻辑留在父层，跨页面复用。

可编辑的完整沙盒（Monaco 编辑器，浏览器内实时编译）——左侧切换 `SearchFormApp.vue` / `SearchForm.vue`，右侧实时预览：

<ReplBox :files="searchFormFiles" main-file="src/SearchFormApp.vue" height="520px" />

## 确认框 Dialog

确认 / 提示类对话框与 Modal 的关键区别在调用方式：Modal 挂在模板里用 `v-model` 控制；确认框更适合**命令式 / Promise 化**——`await` 一句话拿到用户选择。

```ts
// useConfirm.ts —— 命令式确认框
import { createApp } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

export function confirm(message: string, title = '提示'): Promise<boolean> {
  return new Promise((resolve) => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const app = createApp(ConfirmDialog, {
      message,
      title,
      onResolve(result: boolean) {
        resolve(result)
        app.unmount()   // 关闭即销毁，自动清理挂载节点
        host.remove()
      }
    })
    app.mount(host)
  })
}
```

```ts
async function remove(row: Row) {
  const ok = await confirm(`确定删除「${row.name}」？`)
  if (!ok) return
  await api.delete(row.id)
}
```

**封装要点**

- **命令式 vs 受控**：Modal 是用 `v-model` 控显隐的受控组件；确认框做成函数式后，`await confirm(...)` 一行拿到结果，不必在每个页面声明 `visible` 和回调。
- **Promise 化**：把“点确定 / 取消”包成 `Promise<boolean>`，业务用 `async/await` 顺序书写，避免回调嵌套。
- **动态挂载 + 自动清理**：用时 `createApp` 挂到 body，关闭后 `unmount` 并移除宿主节点，无副作用残留。
- 也可做成组件 + `defineExpose({ open })`，但需在模板里放实例；全局随处可调的确认 / 提示更适合命令式服务。

可编辑的完整沙盒（Monaco 编辑器，浏览器内实时编译）——左侧切换 `DialogApp.vue` / `ConfirmDialog.vue` / `useConfirm.ts` 三个文件，右侧实时预览：

<ReplBox :files="dialogFiles" main-file="src/DialogApp.vue" height="640px" />

---

## 封装检查清单

| 维度 | 检查点 |
| --- | --- |
| 职责 | 单一？过大就拆子组件 + composable |
| Props | 类型化契约 + 默认值；对象默认值用工厂函数；props 只读 |
| 配置驱动 | 列 / 字段等可变结构用配置（`columns` / `fields`），不写死业务 |
| 事件 | 显式 `defineEmits` + 类型化 payload；行为事件化，请求留父层 |
| v-model | 受控状态用 `defineModel`，保持单一数据源 |
| 插槽 | 作用域插槽把数据交还父组件自定义；可选插槽 `$slots` 判空 |
| 命令式 | 确认 / 提示用 Promise 化函数式调用；组件命令式入口 `defineExpose` 最小暴露 |
| 透传 | 二次封装 `inheritAttrs: false` + `v-bind="$attrs"`（见[组件通信](/vue/component/component-communication)） |
| 健壮性 | 加载 / 空状态内置；副作用卸载清理；a11y（语义标签 + aria + 键盘） |

## 参考来源

- [Vue: Props](https://cn.vuejs.org/guide/components/props.html)
- [Vue: 组件事件](https://cn.vuejs.org/guide/components/events.html)
- [Vue: 组件 v-model](https://cn.vuejs.org/guide/components/v-model.html)
- [Vue: 插槽 Slots](https://cn.vuejs.org/guide/components/slots.html)
- [Vue: 透传 Attributes](https://cn.vuejs.org/guide/components/attrs.html)
- [Vue: 模板引用（defineExpose / useTemplateRef）](https://cn.vuejs.org/guide/essentials/template-refs.html)
- [Vue: 组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)
