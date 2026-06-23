# 数组方法与迭代

## 问题

类数组和真数组有什么区别？如何转换？forEach 能中断吗？如何判断数组包含某值？数组如何扁平化？高阶函数 map/reduce/filter/sort 有哪些注意事项？

## 结论

### 类数组 vs 真数组

类数组（Array-like）有 `length` 属性且下标可访问，但不是 Array 实例，没有数组方法。常见类数组：`arguments`、`NodeList`、`HTMLCollection`、字符串。

**转换为真数组（4 种方式）**：

```js
// 1. Array.from（推荐，ES6，支持映射函数）
Array.from(arguments)
Array.from(document.querySelectorAll('li'), el => el.textContent)

// 2. 展开运算符（ES6，可迭代对象均适用）
[...arguments]
[...document.querySelectorAll('li')]

// 3. Array.prototype.slice.call（兼容旧代码）
Array.prototype.slice.call(arguments)

// 4. Array.prototype.concat.apply（适用于 NodeList 等）
Array.prototype.concat.apply([], nodeList)
```

> `arguments` 在箭头函数内不存在，推荐用剩余参数 `...args` 代替。

### forEach 如何中断

`forEach` 内部 `return` 只是跳过当前迭代，不能中断整个循环：

```js
// ❌ return 在 forEach 里无法中断
[1, 2, 3].forEach(n => {
  if (n === 2) return // 只跳过本次，3 仍然执行
  console.log(n)
})
```

**中断方案**：

```js
// 1. every —— return false 中断
[1, 2, 3].every(n => {
  if (n === 2) return false // 中断
  console.log(n)
  return true
})

// 2. some —— return true 中断
[1, 2, 3].some(n => {
  if (n === 2) return true // 中断
  console.log(n)
})

// 3. for...of + break（最直接）
for (const n of [1, 2, 3]) {
  if (n === 2) break
  console.log(n)
}

// 4. try/catch + throw（不推荐，语义不清）
try {
  [1, 2, 3].forEach(n => {
    if (n === 2) throw new Error('stop')
    console.log(n)
  })
} catch (e) {}
```

### 判断数组包含某值

| 方法 | 返回值 | 能找 NaN | 适用场景 |
| --- | --- | --- | --- |
| `indexOf(val)` | 下标 / `-1` | ❌ | 旧代码兼容 |
| `includes(val)` | `true` / `false` | ✅ | 简单值判断（推荐） |
| `find(fn)` | 元素 / `undefined` | ✅ | 复杂条件，需要元素本身 |
| `findIndex(fn)` | 下标 / `-1` | ✅ | 复杂条件，需要下标 |

```js
const arr = [1, NaN, { id: 1 }]

arr.indexOf(NaN)          // -1（找不到）
arr.includes(NaN)         // true

arr.find(x => x?.id === 1)       // { id: 1 }
arr.findIndex(x => x?.id === 1)  // 2
```

### 数组扁平化多种方法

```js
const arr = [1, [2, [3, [4]]]]

// 1. 原生 flat（ES2019，推荐）
arr.flat(Infinity) // [1, 2, 3, 4]

// 2. 递归
function flat(arr) {
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flat(val) : val),
    []
  )
}

// 3. while + some（无递归）
function flat2(arr) {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr)
  }
  return arr
}

// 4. 栈迭代（空间 O(n)，无递归栈溢出风险）
function flat3(arr) {
  const stack = [...arr]
  const result = []
  while (stack.length) {
    const val = stack.pop()
    if (Array.isArray(val)) stack.push(...val)
    else result.unshift(val)
  }
  return result
}

// 5. JSON 序列化（有局限：不处理 undefined / 函数 / Symbol）
JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']')
```

### 高阶函数注意事项

**map**：返回等长新数组，不改原数组。稀疏数组的空位会被跳过但保留：

```js
[1, 2, 3].map(x => x * 2)          // [2, 4, 6]，原数组不变
[1, , 3].map(x => x * 2)           // [2, empty, 6]
```

**reduce**：从左到右归并，没有 `initialValue` 时以第一个元素为初始累加器。空数组无 `initialValue` 会报错：

```js
[].reduce((acc, val) => acc + val)  // TypeError
[].reduce((acc, val) => acc + val, 0) // 0（安全）

// 可以模拟 map、filter、flat
const map = (arr, fn) => arr.reduce((acc, val) => [...acc, fn(val)], [])
```

**filter**：返回满足条件的子数组，不改原数组。

**sort**：默认按 Unicode 升序（`[10, 9, 2].sort()` 结果是 `[10, 2, 9]`，因为 "1" < "2"）；**原地修改**原数组并返回引用：

```js
// 升序数字排序
[10, 9, 2].sort((a, b) => a - b)  // [2, 9, 10]，修改了原数组
// compareFn(a, b) < 0 → a 排在 b 前
```

## 参考来源

- [MDN: Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
- [MDN: Array.prototype.flat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
- [MDN: Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
