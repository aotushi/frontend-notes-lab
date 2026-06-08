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

## 参考来源

- [React: Rendering UI](https://react.dev/learn/rendering-lists)
- [React: Render and Commit](https://react.dev/learn/render-and-commit)
