# 浏览器事件机制与事件循环

## 问题

事件模型是什么？事件委托的原理？同步和异步的区别？事件循环是什么？宏任务微任务有哪些？Node 的 Event Loop 和浏览器有什么区别？

## 结论

### 事件是什么？事件模型？

事件是用户操作网页时发生的交互动作（click、mousemove 等）以及文档加载、窗口滚动等。事件被封装为 `event` 对象，包含相关信息和操作方法。

现代浏览器有三种事件模型：

| 模型 | 说明 |
| --- | --- |
| **DOM0 级** | 直接在 DOM 对象上设置 `onclick` 等属性，没有传播阶段（部分浏览器支持冒泡） |
| **IE 事件模型** | 两个阶段：事件处理 → 事件冒泡。通过 `attachEvent` 绑定，可绑多个 |
| **DOM2 级** | 三个阶段：**捕获 → 目标 → 冒泡**。通过 `addEventListener` 绑定，第三参数控制捕获/冒泡 |

### 如何阻止事件冒泡

- 标准浏览器：`event.stopPropagation()`
- IE 浏览器：`event.cancelBubble = true`

### 对事件委托的理解

**原理：** 利用事件冒泡机制，将子元素的监听函数绑定在父节点上，由父节点统一处理。

**优点：**
- **减少内存消耗**：不必为每个子元素单独绑定事件
- **动态绑定**：新增子元素无需重新绑定，父节点的监听自动覆盖

```javascript
// 给 #list 绑定事件，处理所有 li 的点击
document.getElementById('list').addEventListener('click', function(e) {
  var event = e || window.event;
  var target = event.target || event.srcElement;
  if (target.nodeName.toLowerCase() === 'li') {
    console.log('点击的内容：', target.innerHTML);
  }
});
```

**局限性：**
- `focus`、`blur` 没有冒泡，无法委托
- `mousemove`、`mouseout` 需频繁计算位置，性能差，不适合委托
- 过多嵌套层级会影响性能（事件需穿越的 DOM 层数越多越慢）

### 事件委托的使用场景

给页面所有 `<a>` 标签添加点击事件（包括内部含 `<span>`/`<img>` 的情况）：

```javascript
document.addEventListener('click', function(e) {
  var node = e.target;
  // 向上查找直到找到 a 标签
  while (node.parentNode.nodeName !== 'BODY') {
    if (node.nodeName === 'A') {
      console.log('点击了 a 标签');
      break;
    }
    node = node.parentNode;
  }
}, false);
```

直接判断 `e.target` 只能匹配 `<a>` 本身，如果点击了 `<a>` 内部的 `<span>`，`e.target` 是 `<span>` 而非 `<a>`，需要向上遍历查找。

### 同步和异步的区别

- **同步**：进程执行某请求时，若需要等待则一直等，返回后再继续
- **异步**：进程执行某请求时，不等待结果，继续往下执行；结果返回后系统通知进程处理

### 对事件循环的理解

JS 是单线程的，通过**事件循环（Event Loop）** 实现异步。

执行顺序：
1. 执行同步代码（主线程上的宏任务）
2. 同步代码执行完毕，检查**微任务队列**，全部清空
3. 如有必要，渲染页面
4. 从**宏任务队列**取出一个任务执行，回到步骤 2

**关键点：** 每个宏任务执行完后，都会清空所有微任务，再取下一个宏任务。

### 宏任务和微任务分别有哪些

| 类型 | 包含 |
| --- | --- |
| **微任务（Microtask）** | `Promise.then`/`.catch`/`.finally`、`MutationObserver`、Node 的 `process.nextTick` |
| **宏任务（Macrotask）** | `script` 脚本整体、`setTimeout`、`setInterval`、`setImmediate`、I/O 操作、UI 渲染 |

### 什么是执行栈

执行栈（Call Stack）是存储函数调用的**栈结构**，遵循**先进后出（LIFO）**原则。

```javascript
function foo() {
  throw new Error('error') // 报错时可在堆栈中看到 foo → bar 的调用链
}
function bar() {
  foo()
}
bar()
```

递归调用过多会导致**爆栈**（Stack Overflow）：

```javascript
function bar() {
  bar() // 无限递归，超出栈容量
}
bar()
```

### Node 中的 Event Loop 和浏览器的区别？process.nextTick 执行顺序？

Node 的 Event Loop 分为 **6 个阶段**，按顺序循环：

1. **Timers**：执行 `setTimeout` / `setInterval` 过期回调
2. **Pending callbacks**：执行推迟的 I/O 回调（系统调用相关）
3. **Idle/Prepare**：内部使用
4. **Poll**：等待并执行 I/O 回调（队列非空则执行；为空且有计时器则进入 Check）
5. **Check**：执行 `setImmediate` 回调
6. **Close callbacks**：执行关闭事件回调（如 `socket.on('close', ...)`）

**`setTimeout` vs `setImmediate` 的顺序：**
- 非 I/O 回调中：顺序不确定（取决于进入事件循环时消耗的时间）
- I/O 回调中（Poll 阶段）：`setImmediate` **永远先执行**（Poll 完毕直接进 Check 阶段）

**`process.nextTick`：**
- 独立于 Event Loop 6 个阶段之外
- 在**每个阶段结束时**优先执行（优先于其他微任务）
- 嵌套的 `nextTick` 会全部执行完才进入下一阶段

```javascript
// process.nextTick 永远先于 Promise.then 执行
process.nextTick(() => console.log('nextTick'))
Promise.resolve().then(() => console.log('promise'))
// 输出：nextTick → promise
```

### 事件触发的过程是怎样的

事件触发三个阶段：

1. **捕获阶段**：从 `window` 向下传播到事件目标，依次检查是否有捕获事件监听
2. **目标阶段**：触发目标元素上注册的事件
3. **冒泡阶段**：从目标元素向上传播到 `window`，依次检查是否有冒泡事件监听

**特例：** 在目标元素上同时注册捕获和冒泡事件时，按**注册顺序**执行（不区分捕获/冒泡）。

`addEventListener` 第三参数：
- `false`（默认）：冒泡阶段触发
- `true`：捕获阶段触发
- 对象形式：`{ capture, once, passive }`

阻止传播：
- `event.stopPropagation()`：阻止事件继续传播（捕获或冒泡）
- `event.stopImmediatePropagation()`：阻止传播，且阻止同一元素上其他相同事件的监听函数执行

## 参考来源

- [MDN: EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN: Event delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)
- [Node.js: Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)
