# React Virtual DOM

## 问题

为什么说 Virtual DOM 可能提高性能？它在 React 中真正解决了什么问题？

## 结论

React 的 Virtual DOM/element tree 让 UI 成为状态的函数，框架可以在状态变化时重新计算 UI 描述，再由协调过程决定如何更新真实 DOM。它的价值主要是可预测更新、组件抽象和调度能力，不是“虚拟 DOM 一定比真实 DOM 快”。

性能收益来自减少不必要真实 DOM 操作、批量更新、调度以及开发者更容易写出可维护的状态驱动 UI。真实项目还需要 `memo`、拆分状态、列表 key、虚拟列表等配合。

## Demo

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      count: {count}
    </button>
  );
}
```

面试回答：

> React 的 Virtual DOM 不是性能银弹。它把 UI 更新变成声明式计算和协调过程，让框架批量、调度和最小化真实 DOM 更新。它通常能提供不错的性能下限，但大型列表、频繁更新和复杂组件仍需要状态下沉、memo、key 和虚拟滚动等优化。

### React diff 算法

diff 算法对比新旧虚拟 DOM 树，以最小代价生成 DOM 更新补丁。React 采用三个策略降低从 O(n³) 到 O(n)：

**策略一：只比同层节点（树级别）**

不同层级的节点不做比较，发现某节点消失则连同子树一起删除。这样每层只需线性遍历。

**策略二：类型不同的组件直接替换（组件级别）**

如果新旧节点的 `type`（组件类型或 HTML 标签）不同，直接销毁旧树、创建新树，不再深入比对。相同 type 则递归比对子树。

**策略三：用 key 优化列表（元素级别）**

同层有多个子节点时，React 用 `key` 追踪哪些节点被移动、添加或删除，而不是简单按顺序对比：

```jsx
// 没有 key：修改 list 顺序时 React 可能误判
{list.map(item => <Item value={item.value} />)}

// 有 key：React 能识别节点身份，只移动需要移动的
{list.map(item => <Item key={item.id} value={item.value} />)}
```

key 的注意事项：
- 必须在同级唯一
- 不要用数组 index（顺序变化时 key 跟着变，失去优化意义）
- 不要用随机数（每次渲染重新生成，性能反而更差）

### React diff vs Vue diff

两者大策略相同（同层对比 + key），实现细节有差异：

| | React | Vue |
| --- | --- | --- |
| 更新触发 | state 变化 / Hooks 调用 | 响应式 proxy 自动追踪 |
| diff 范围 | 默认整棵组件树（memo 可优化） | 细粒度追踪，只 diff 受影响组件 |
| 中断能力 | React 16+ Fiber 可中断（并发模式） | Vue 3 移除了时间切片（收益低） |
| 列表复用 | 双端对比 + key | 双端对比 + key（算法相近） |

**Virtual DOM vs 直接操作 DOM**：Virtual DOM 不是一定更快，简单修改一个文本节点时直接操作 DOM 反而更快。Virtual DOM 的优势是**保证性能下限**——在不手动优化的情况下，框架自动批量、最小化 DOM 操作，并让开发者用声明式写法而不必关心 DOM 细节。

## 参考来源

- [React: Rendering UI](https://react.dev/learn/rendering-lists)
- [React: Render and Commit](https://react.dev/learn/render-and-commit)
- [React: Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html)
