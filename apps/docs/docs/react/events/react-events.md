# React 事件机制

## 问题

React 的事件和普通 HTML/DOM 事件有什么不同？组件卸载前事件监听和定时器要不要清除？

## 结论

React 事件是框架封装后的事件系统，称为**合成事件（SyntheticEvent）**。现代 React 中事件对象不再像旧版本那样需要 `persist()` 才能异步访问，但事件仍然遵循 React 的调度、批处理和组件树语义。

### 合成事件系统

React **不是**把事件直接绑定到 DOM 节点上，而是在 React 根节点（React 17+ 是 `root`，React 16 是 `document`）统一监听所有事件，等事件冒泡到顶层后再分发给对应组件的处理函数。

**这样设计的好处**：

- 节省内存：不需要为每个 DOM 节点分别绑定监听器
- 统一管理：组件挂载/卸载时自动订阅/移除事件
- 跨浏览器一致性：SyntheticEvent 抹平各浏览器差异

和原生 DOM 事件相比：

- React 使用驼峰命名，例如 `onClick`。
- 事件处理器传函数，不是字符串。
- React 事件通常在 React 根节点委托，再分发给组件。
- `event.nativeEvent` 可以访问底层原生事件。
- React 的 `onChange` 对输入控件更接近”值变化即触发”的语义，不完全等同原生 `change`。

### 执行顺序与注意事项

事件执行顺序：**原生事件先执行，合成事件后执行**（合成事件等原生事件冒泡到根节点后才分发）。

**陷阱**：如果在原生事件中调用了 `stopPropagation()`，事件就无法冒泡到 React 根节点，合成事件也不会执行。所以尽量避免混用原生事件和 React 合成事件。

**阻止默认行为**：React 合成事件中调用 `event.stopPropagation()` 有效（阻止合成事件冒泡）；但如果想阻止浏览器默认行为，必须调用 `event.preventDefault()`，不能用 `return false`。

组件卸载前，手动添加到 `window`、`document`、第三方实例或定时器上的副作用必须清理。否则可能产生内存泄漏、重复监听或卸载后更新状态。

## Demo

```jsx
import { useEffect, useState } from 'react';

export function SearchBox() {
  const [value, setValue] = useState('');

  useEffect(() => {
    const onResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener('resize', onResize);
    const timer = window.setInterval(() => console.log('tick'), 1000);

    return () => {
      window.removeEventListener('resize', onResize);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <input
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}
```

面试回答：

> React 事件不是直接写 HTML 字符串事件，而是通过组件 props 传函数。它有自己的事件系统和批处理语义，底层原生事件可以从 `nativeEvent` 访问。组件卸载前，凡是自己绑定到 window/document、第三方库或定时器上的副作用都要在 cleanup 里清除。

## 参考来源

- [React: Responding to events](https://react.dev/learn/responding-to-events)
- [React: Synchronizing with effects](https://react.dev/learn/synchronizing-with-effects)
