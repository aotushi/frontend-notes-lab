# V8 垃圾回收机制

## 问题

V8 的垃圾回收机制是怎样的？哪些操作会造成内存泄漏？

## 结论

### V8 的垃圾回收机制是怎样的

V8 采用**分代式垃圾回收（Generational GC）**，将堆内存分为新生代和老生代：

#### 新生代算法（Scavenge）

新生代存放**存活时间短**的对象（如局部变量），空间较小（约 32MB）。

内存分为两块：**From 空间**（使用中）和 **To 空间**（空闲）：
1. 新对象分配到 From 空间
2. From 空间满时，GC 扫描存活对象，复制到 To 空间
3. 失活对象销毁，From/To 互换
4. 经历过一次 Scavenge 的对象，或 To 空间占比超 25%，晋升到老生代

#### 老生代算法（Mark-Sweep + Mark-Compact）

老生代存放**存活时间长、数量多**的对象（如全局变量、闭包）。

**两步算法：**
1. **标记清除（Mark-Sweep）**：遍历堆中所有对象，标记存活对象，销毁未被标记的对象
   - 问题：清除后产生内存碎片
2. **标记压缩（Mark-Compact）**：碎片超过阈值时，将存活对象向一端移动，清理另一端

**性能优化：**
- **增量标记（Incremental Marking，2011年）**：将标记工作分解为小模块，穿插在 JS 执行间隙，避免长时间停顿（stop-the-world）
- **并发标记（Concurrent Marking，2018年）**：GC 扫描标记与 JS 执行同时进行

老生代内部细分空间（`AllocationSpace` 枚举）：
```javascript
RO_SPACE,     // 不变的对象（只读）
NEW_SPACE,    // 新生代复制算法空间
OLD_SPACE,    // 老生代常驻对象
CODE_SPACE,   // 代码对象
MAP_SPACE,    // Map 对象
LO_SPACE,     // 大对象（超过一定阈值）
NEW_LO_SPACE, // 新生代大对象
```

### 哪些操作会造成内存泄漏？

1. **意外全局变量**：未使用 `var`/`let`/`const` 声明变量，变量挂在 `window` 上无法被回收
   ```javascript
   function foo() {
     bar = 'global variable'; // 意外挂到 window 上
   }
   ```

2. **未清除的定时器**：`setInterval` 中引用外部变量，且未调用 `clearInterval`，外部变量一直被持有
   ```javascript
   const data = loadData();
   setInterval(() => {
     render(data); // data 无法被回收
   }, 1000);
   // 忘记 clearInterval
   ```

3. **已删除 DOM 元素的引用**：JS 变量持有已从 DOM 树中移除的节点引用，节点无法被 GC 回收
   ```javascript
   const btn = document.getElementById('btn');
   document.body.removeChild(btn); // 从 DOM 移除
   // btn 变量仍引用该节点，内存无法释放
   ```

4. **不合理的闭包**：闭包持有外部函数的变量引用，若闭包一直存活，变量永远不会被回收
   ```javascript
   function outer() {
     const bigData = new Array(1000000);
     return function inner() {
       return bigData[0]; // bigData 一直被 inner 持有
     };
   }
   const fn = outer(); // fn 一直存活，bigData 不会回收
   ```

## 参考来源

- [V8 Blog: Trash talk: the Orinoco garbage collector](https://v8.dev/blog/trash-talk)
- [MDN: Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
