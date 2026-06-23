# Vue 2 与 Vue 3 的区别

## 问题

Vue 2 和 Vue 3 有哪些区别？Vue 3 的性能为什么更好？

## 结论

### 理解路径

Vue 3 的变化集中在三块：响应式从 `Object.defineProperty` 换成 `Proxy`、新增组合式（Composition）API、编译期做了大量优化。性能提升主要来自更高效的响应式、编译优化和更好的 tree-shaking。

### Vue 2 / Vue 3 主要区别

速查表：

| 维度 | Vue 2 | Vue 3 |
| --- | --- | --- |
| 响应式 | `Object.defineProperty` | `Proxy` |
| 新增 / 删除属性 | 需 `Vue.set` / `Vue.delete` | 直接赋值即可被监听 |
| 逻辑组织 | Options API | Options API 加组合式 API（`setup`） |
| 根节点 | 单根 | 支持多根（Fragment） |
| TS 支持 | 较弱 | 源码用 TS 重写，类型更友好 |
| 体积 | 较大 | Tree-shaking 友好，按需引入更小 |
| 新能力 | — | Teleport、Suspense、`createApp` 等 |

展开说，主要有以下几点显著区别：

1. **性能优化**：Vue 3 重写了响应式系统，用 `Proxy` 替代 `Object.defineProperty`，性能比 Vue 2 更好。
2. **Composition API**：Vue 3 引入组合式 API，是组织组件逻辑的新方式，相比 Vue 2 的选项式 API 更灵活，更容易组织和重用代码。
3. **Teleport**：Vue 3 引入 Teleport，允许把组件内容渲染到 DOM 中的任意位置，便于移动组件位置或在不同层次结构中渲染组件。
4. **新特性和改进**：Vue 3 引入 Fragments（片段）、Custom Directives（自定义指令）等新特性，并改进了部分现有特性，构建复杂应用更方便。
5. **Tree-shaking 支持**：Vue 3 更好地支持 tree-shaking，构建时能更有效地剔除未使用的代码，减小应用体积。
6. **TypeScript 集成**：Vue 3 对 TypeScript 的支持更紧密友好，包括完整的类型定义。

### Vue 3 性能为什么更好？

相对 Vue 2，主要体现在以下几方面：

1. **Proxy 替代 `Object.defineProperty`**：Vue 2 的 `defineProperty` 要递归遍历对象每个属性做劫持，无法监听属性新增 / 删除和数组下标；Vue 3 用 `Proxy` 代理整个对象，拦截更细粒度，能更高效地追踪属性变化。
2. **编译器优化**：Vue 3 的编译器经过优化，生成的代码更精简高效，有助于减小体积、提升运行时性能。
3. **静态树提升（Static Tree Hoisting）**：把一些静态节点在渲染时提升为常量、只创建一次，减少不必要的重复渲染。
4. **优化的事件处理**：对事件处理做了优化（如内联事件缓存），频繁触发的事件性能相对更好。
5. **Teleport**：Teleport 让组件内容能渲染到 DOM 中任意位置，在渲染和移动组件时提供更多灵活性、更高效。
6. **Tree-shaking 支持**：API 改为按需导入，未用到的功能不打进包里，减小体积、加快加载和运行。

配合 patch flag 等手段，运行时只 diff 真正会变的动态节点，详见 [Vue diff 算法与 key](/vue/rendering/diff-and-key)。所以 Vue 3 的「更快」主要是把工作尽量提前到编译期，运行时只处理真正会变的部分，处理大型复杂应用时优势更明显。

### Composition API vs React Hook

两者都是在函数中组织逻辑的方式，API 形态相似，但底层机制不同：

| | Vue Composition API | React Hook |
| --- | --- | --- |
| 触发时机 | `setup()` 只在组件初始化时调用一次 | 每次重渲染都调用 Hook 函数 |
| 依赖声明 | 响应式系统自动收集，无需手动指定 | `useEffect`/`useMemo` 等需手动传依赖数组 |
| 调用顺序 | 无限制，可在条件/循环中调用 | 必须在顶层调用，不能在条件/循环中 |
| GC 压力 | 低（`setup` 只跑一次） | 高（每次渲染创建闭包） |
| 心智负担 | 较低（响应式自动管） | 较高（手动维护依赖、stale closure） |

Vue Composition API 的设计思想借鉴自 React Hook，但借助 Vue 的响应式系统规避了 Hook 的主要痛点。

### 面试回答

> Vue 3 响应式从 `defineProperty` 换成 `Proxy`，能监听属性新增删除和数组、初始化更快；新增组合式 API 让逻辑复用更好；源码用 TS 重写，支持 Fragment、Teleport、Suspense。性能更好主要靠响应式升级加编译优化：静态提升、patch flag、事件缓存让运行时只 diff 动态节点，再加 tree-shaking 减小体积。

## 参考来源

- [Vue: 深入响应式系统](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)
- [Vue: 渲染机制](https://cn.vuejs.org/guide/extras/rendering-mechanism.html)
- [Vue 3 迁移指南](https://v3-migration.vuejs.org/)
