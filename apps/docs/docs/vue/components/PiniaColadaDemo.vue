<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { codeToHtml } from 'shiki'

const code = `import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada, defineQuery, defineMutation, useQuery, useMutation } from '@pinia/colada'

// 测试用模拟请求
const test = (str) =>
  new Promise((res) => {
    setTimeout(() => {
      res({ name: '结果为' + str })
    }, 1000)
  })

// GET 请求封装（defineQuery 创建单例）
const useQueryUser = defineQuery(() => {
  // 必须连同查询参数一起放置
  const paramsRef = ref({ str: '' })
  const query = useQuery({
    key: () => ['user', paramsRef.value.str],
    query: () => test(paramsRef.value.str),
  })
  return { paramsRef, ...query }
})

// POST/PUT/DELETE/PATCH 请求封装
const useMutateUser = defineMutation(() => {
  const queryUser = useQueryUser()
  return useMutation({
    mutation: (id) =>
      test(id).then(() => {
        console.log('此处会有提示')
        return queryUser.refresh()
      }),
  })
})

// Child 组件（与 Parent 共享同一份数据）
const Child = {
  setup() {
    const queryUser = useQueryUser()
    const mutateUser = useMutateUser()
    async function handleMutate() {
      await mutateUser.mutateAsync('触发更新操作')
    }
    return { queryUser, handleMutate }
  },
  template: \`
    <div>
      <div>查询结果</div>
      <div>结果为: {{ queryUser.data.value?.name }}</div>
      <div>查询状态: {{ queryUser.status.value }}</div>
      <button @click="handleMutate">可以在任意位置触发更新操作</button>
    </div>
  \`
}

// Parent 组件
const Parent = {
  components: { Child },
  setup() {
    const queryUser = useQueryUser()
    return { queryUser }
  },
  template: \`
    <div>
      <div>输入查询条件</div>
      <input v-model="queryUser.paramsRef.value.str" />
      <div>查询结果</div>
      <div>结果为: {{ queryUser.data.value?.name }}</div>
      <div>查询状态: {{ queryUser.status.value }}</div>
      <div>————接下来是子组件————</div>
      <Child />
    </div>
  \`
}

const app = createApp(Parent)
app.use(createPinia())
app.use(PiniaColada)
app.mount('#app')`

const highlighted = ref('')

onMounted(async () => {
  highlighted.value = await codeToHtml(code, {
    lang: 'javascript',
    theme: 'github-dark',
  })
})
</script>

<template>
  <div class="colada-demo">
    <div class="colada-demo__code">
      <div class="colada-demo__label">代码</div>
      <div class="colada-demo__pre" v-html="highlighted" />
    </div>
    <div class="colada-demo__preview">
      <div class="colada-demo__label">运行效果</div>
      <iframe
        src="/demos/pinia-colada.html"
        class="colada-demo__iframe"
        title="pinia-colada 运行效果"
      />
    </div>
  </div>
</template>

<style scoped>
.colada-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 24px 0;
  min-height: 480px;
}

.colada-demo__code {
  border-right: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.colada-demo__preview {
  display: flex;
  flex-direction: column;
}

.colada-demo__label {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  flex: 0 0 auto;
}

.colada-demo__pre {
  flex: 1;
  overflow: auto;
  font-size: 11.5px;
  background: #24292e;
}

.colada-demo__pre :deep(pre) {
  margin: 0;
  padding: 14px 16px;
  width: max-content;
  min-width: 100%;
  min-height: 100%;
  background: #24292e !important;
  border-radius: 0;
  font-size: inherit;
  line-height: 1.65;
  overflow: visible;
}

.colada-demo__pre :deep(code) {
  font-family: var(--vp-font-family-mono);
}

.colada-demo__iframe {
  display: block;
  width: 100%;
  flex: 1;
  border: 0;
  background: #ffffff;
}
</style>
