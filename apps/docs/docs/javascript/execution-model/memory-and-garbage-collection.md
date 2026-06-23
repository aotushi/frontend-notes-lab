# 内存模型与垃圾回收

### 理解路径

JavaScript 开发者不能手动释放对象，只能控制引用关系。只要对象仍然可以从根对象访问到，它就不会被回收；当对象不可达，垃圾回收器才可以在合适时机释放它。

### 栈和堆分别保存什么？

调用栈保存函数调用帧、局部绑定记录和执行位置等短生命周期数据。对象、数组、函数、Map、Set、DOM 包装对象等引用类型通常分配在堆中，变量里保存的是对这些对象的引用。

基础类型值不可变。对象值可变，多个变量可以引用同一个对象。

```js
const a = { count: 1 }
const b = a
b.count = 2
a.count // 2
```

### 垃圾回收的核心判断是什么？

现代 JavaScript 引擎以可达性作为核心判断。根对象包括全局对象、当前调用栈中的局部变量、活动闭包、宿主环境持有的回调和 DOM 引用等。从根对象出发能访问到的对象是可达对象，不会被回收。

常见算法以标记-清除为基础：先从根对象标记所有可达对象，再清理不可达对象。具体引擎还会使用分代、增量、并发等优化，但面试中重点是"可达性"和"引用关系"。

### 什么情况容易造成内存泄漏？

内存泄漏不是"对象存在"，而是"对象已经不再有业务价值，却仍然可达"。

常见来源：

1. 全局变量或模块级缓存无限增长。
2. 事件监听、订阅、观察者没有取消。
3. `setInterval`、长生命周期 `setTimeout` 没有清理。
4. 闭包持有大对象或 DOM 节点。
5. 从页面移除了 DOM 节点，但 JavaScript 变量仍引用它。
6. Map 以对象作为 key 做缓存，生命周期长于对象本身。

### 为什么 `WeakMap` 和 `WeakSet` 能帮助管理缓存？

`WeakMap` 的 key 必须是对象或非注册 Symbol，并且 key 是弱引用。如果外部已经没有其它强引用指向这个 key，对应条目不会阻止垃圾回收。它适合保存对象关联元数据、私有状态和不想延长对象生命周期的缓存。

```js
const meta = new WeakMap()

function attachMeta(node, data) {
  meta.set(node, data)
}
```

当 `node` 被移除且外部不再引用时，`meta` 不会因为保存了 key 而强行保留它。

### 如何排查 JavaScript 内存问题？

1. 先确认现象：页面越用越慢、内存曲线持续上升、关闭视图后内存不下降。
2. 用浏览器 Performance 或 Memory 工具录制堆快照。
3. 找 retained size 大、数量不断增长的对象。
4. 沿 retainers 查看是谁仍然引用它。
5. 清理订阅、定时器、缓存或 DOM 引用。
6. 回归验证同一操作循环后对象数量是否稳定。

### 闭包一定会导致内存泄漏吗？

不会。闭包只是让函数可以继续访问外层变量。只有当闭包长期存活，并且持有了不再需要的大对象、DOM 节点或外部资源时，才会形成泄漏风险。

### `delete` 能释放内存吗？

`delete obj.key` 只会删除对象属性，让该属性引用的值少一个引用来源。它不会立即释放内存，也不能删除普通局部变量。是否回收取决于对象是否仍然可达，以及引擎何时执行垃圾回收。

### 事件监听泄漏

```js
function mount(button) {
  const largeState = new Array(100000).fill('data')

  function onClick() {
    console.log(largeState.length)
  }

  button.addEventListener('click', onClick)

  return () => {
    button.removeEventListener('click', onClick)
  }
}
```

返回的清理函数会断开宿主环境对回调的引用，回调不再持有 `largeState`。

### 用 `WeakMap` 保存对象元数据

```js
const privateState = new WeakMap()

class Counter {
  constructor() {
    privateState.set(this, { value: 0 })
  }

  inc() {
    const state = privateState.get(this)
    state.value += 1
    return state.value
  }
}
```

实例不再可达后，`WeakMap` 条目不会阻止实例被回收。

## 参考来源

- [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management)
- [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN: WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
- [Chrome DevTools: Memory problems](https://developer.chrome.com/docs/devtools/memory-problems)
