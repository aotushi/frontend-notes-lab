# DOM 事件、事件委托与页面通信

## 问题

DOM 事件流、捕获、冒泡、事件委托、`target/currentTarget`、自定义事件、默认行为、事件清理和多标签页通信怎么回答？

## 结论

DOM 事件流分为捕获、目标、冒泡三个阶段。`addEventListener(type, listener, { capture: true })` 让监听器在捕获阶段执行；默认是在冒泡阶段执行。

事件触发顺序可以简化为：

1. 从 `window` / `document` / 根节点向目标元素传播：捕获阶段。
2. 到达目标元素：目标阶段。
3. 从目标元素向祖先节点回传：冒泡阶段。

同一个 DOM 上同时绑定捕获和冒泡监听，同一次事件通常都会执行。对于目标元素上的监听器，它们处于目标阶段；实际先后与注册顺序和 capture 配置有关，不应简单说“一定捕获先于冒泡”。对祖先节点来说，捕获监听早于目标，冒泡监听晚于目标。

| API / 属性 | 作用 |
| --- | --- |
| `event.target` | 实际触发事件的目标 |
| `event.currentTarget` | 当前正在执行监听器的元素 |
| `event.preventDefault()` | 阻止默认行为 |
| `event.stopPropagation()` | 阻止事件继续传播 |
| `event.stopImmediatePropagation()` | 阻止继续传播，并阻止同一目标上的后续监听器 |
| `dispatchEvent(event)` | 同步派发事件 |
| `CustomEvent` | 带 `detail` 数据的自定义事件 |

事件委托利用冒泡，把多个子元素的事件处理交给共同祖先。它适合大量列表、动态插入节点和减少监听器数量。

## Demo

事件委托：

```html
<ul id="list">
  <li data-id="1">A</li>
  <li data-id="2">B</li>
</ul>

<script>
  list.addEventListener('click', (event) => {
    const item = event.target.closest('li[data-id]');
    if (!item || !list.contains(item)) return;

    console.log(item.dataset.id);
  });
</script>
```

通用事件绑定函数：

```js
function on(target, type, selector, handler, options) {
  if (typeof selector === 'function') {
    options = handler;
    handler = selector;
    selector = null;
  }

  const listener = (event) => {
    if (!selector) {
      handler.call(target, event);
      return;
    }

    const matched = event.target.closest(selector);
    if (matched && target.contains(matched)) {
      handler.call(matched, event);
    }
  };

  target.addEventListener(type, listener, options);

  return () => target.removeEventListener(type, listener, options);
}
```

自定义事件和广播：

```js
const event = new CustomEvent('cart:add', {
  bubbles: true,
  detail: { sku: 'A-001', count: 1 }
});

button.dispatchEvent(event);
```

默认行为和跳转：

```js
link.addEventListener('click', (event) => {
  event.preventDefault();

  if (canLeavePage()) {
    location.href = link.href;
  }
});
```

页面可见性：

```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pausePolling();
  } else {
    resumePolling();
  }
});
```

多标签通信：

```js
const channel = new BroadcastChannel('app');

channel.postMessage({ type: 'logout' });
channel.addEventListener('message', (event) => {
  if (event.data.type === 'logout') {
    location.reload();
  }
});
```

表单输入事件：

```js
input.addEventListener('input', () => {
  output.textContent = input.value;
});

input.addEventListener('change', () => {
  console.log('提交型变化，通常在失焦或选择完成后触发');
});
```

## 面试回答

> DOM 事件有捕获、目标、冒泡三个阶段。`target` 是真正触发事件的元素，`currentTarget` 是当前监听器绑定的元素。事件委托是把监听器绑在父元素上，通过冒泡和 `closest()` 找到目标子元素，适合大量或动态列表。阻止默认行为用 `preventDefault()`，阻止传播用 `stopPropagation()`。自定义事件用 `CustomEvent` 和 `dispatchEvent`，多标签页通信可用 `BroadcastChannel`、`storage` 事件或 SharedWorker。

## 参考来源

- [MDN: DOM events](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Events)
- [MDN: Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
- [MDN: `addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
