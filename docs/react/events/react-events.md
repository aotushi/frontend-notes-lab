# React 事件机制

## 问题

React 的事件和普通 HTML/DOM 事件有什么不同？组件卸载前事件监听和定时器要不要清除？

## 结论

React 事件是框架封装后的事件系统。现代 React 中事件对象不再像旧版本那样需要 `persist()` 才能异步访问，但事件仍然遵循 React 的调度、批处理和组件树语义。

和原生 DOM 事件相比：

- React 使用驼峰命名，例如 `onClick`。
- 事件处理器传函数，不是字符串。
- React 事件通常在 React 根节点委托，再分发给组件。
- `event.nativeEvent` 可以访问底层原生事件。
- React 的 `onChange` 对输入控件更接近“值变化即触发”的语义，不完全等同原生 `change`。

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
