# 二分查找与洗牌算法

## 问题

有序数组里查找一个值，最快的方式是什么？如何实现一个正确、均匀的数组洗牌？

## 结论

### 理解路径

数组有序 → 二分查找把 O(n) 降到 O(log n)；洗牌要保证每种排列等概率出现，朴素的随机交换会有偏，Fisher-Yates 是标准解。

### 有序数组查找：二分查找

前提是数组**有序**。每次取中点和目标比较，命中就返回，否则排除一半区间，时间复杂度 O(log n)。

```js
function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1
  while (left <= right) {
    const mid = left + ((right - left) >> 1) // 取中点，避免 left + right 溢出
    if (arr[mid] === target) {
      return mid
    }
    if (arr[mid] < target) {
      left = mid + 1 // 目标在右半区
    } else {
      right = mid - 1 // 目标在左半区
    }
  }
  return -1
}

binarySearch([1, 3, 5, 7, 9], 7) // 3
```

要点：循环条件 `left <= right`；每次收缩区间用 `mid + 1` / `mid - 1` 避免死循环；中点用 `left + ((right - left) >> 1)` 防止大数相加溢出。

### 数组洗牌：Fisher-Yates

洗牌要保证每个元素出现在每个位置的概率相等。常见错误写法是 `arr.sort(() => Math.random() - 0.5)`，它分布不均匀，且结果依赖排序算法实现，不可靠。

正确做法是 Fisher-Yates：从后往前遍历，每次在 `[0, i]` 区间随机取一个下标和当前位交换。

```js
function shuffle(arr) {
  const result = [...arr] // 复制一份，不改原数组
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)) // 在 [0, i] 闭区间随机取下标
    const temp = result[i] // 交换 result[i] 和 result[j]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

shuffle([1, 2, 3, 4, 5]) // 每种排列等概率，例如 [3, 1, 5, 2, 4]
```

时间复杂度 O(n)，交换本身是原地的、额外空间 O(1)（这里为不改原数组额外复制了一份）。

## 参考来源

- [MDN: Math.random](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
- [Wikipedia: 二分查找算法](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%88%86%E6%90%9C%E5%B0%8B%E6%BC%94%E7%AE%97%E6%B3%95)
- [Wikipedia: Fisher–Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
