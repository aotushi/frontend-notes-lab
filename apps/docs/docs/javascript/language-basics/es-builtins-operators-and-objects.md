# ES 基础、内置对象与常见表达式题

## 问题

Iterator、Generator、Symbol、Set、WeakMap、`typeof`、`instanceof`、隐式转换、`parseInt`、数组和对象方法这些 JavaScript 基础题怎么归类回答？

## 结论

这类题不是性能题，属于 JavaScript 语言基础。回答时要把“语法特性”“内置对象”“类型转换”“表达式求值”分开。

高频点：

- Iterator / Iterable：定义对象如何被 `for...of`、展开运算符、解构消费。
- Generator：可暂停执行的函数，返回迭代器。
- Symbol：创建唯一值，可用于元编程协议，例如 `Symbol.iterator`。
- Set / Map：集合和键值映射，适合去重、索引。
- WeakMap / WeakSet：弱引用集合，键必须是对象，适合关联元数据且不阻止垃圾回收。
- `typeof`：返回字符串，适合判断原始类型，但 `typeof null === 'object'` 是历史遗留。
- `instanceof`：沿原型链判断构造函数的 `prototype` 是否出现。
- `Object.prototype.toString.call(value)`：更通用的内置品牌判断方式。

## Demo

```js
['1', '2', '3'].map(parseInt);
// [1, NaN, NaN]
// parseInt(value, index)，index 被当成 radix。
```

```js
const iterable = {
  values: [1, 2, 3],
  *[Symbol.iterator]() {
    yield* this.values;
  }
};

console.log([...iterable]);
```

```js
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
```

面试回答：

> ES 基础题要先判断它考的是协议、类型、原型还是表达式求值。`for...of` 依赖 Iterator 协议，`Symbol.iterator` 定义可迭代行为；`typeof` 适合粗判断原始类型，复杂对象用 `Object.prototype.toString`；`map(parseInt)` 这类题要看回调参数，不要只看函数名。

## 参考来源

- [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [MDN: `typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
