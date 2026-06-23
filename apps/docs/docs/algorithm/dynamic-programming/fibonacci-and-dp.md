# 斐波那契与动态规划

## 问题

实现斐波那契数列第 N 个值（从 0 开始），要求时间复杂度为 O(n)。朴素递归有什么问题？常见的动态规划状态转移方程有哪些？

## 结论

### 理解路径

朴素递归 → 发现重叠子问题 → 用动态规划自底向上递推 → 滚动变量优化空间。

### 朴素递归为什么不行？

按定义直接递归，时间复杂度是 O(2^n)，且存在大量重复计算。

```js
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}
```

计算 `fib(5)` 时 `fib(3)`、`fib(2)` 被反复求值，这种**重叠子问题**正是动态规划的适用信号。

### 动态规划怎么优化到 O(n)？

自底向上递推，把每个子问题的结果存下来，状态转移方程为 `dp[i] = dp[i - 1] + dp[i - 2]`。

```js
function fibonacci(n) {
  if (n <= 1) return n
  const dp = [0, 1] // dp[i] 表示第 i 个斐波那契数
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}
```

时间复杂度 O(n)，空间 O(n)。由于只依赖前两项，可以用两个变量滚动，把空间降到 O(1)：

```js
function fibonacci(n) {
  if (n <= 1) return n
  let prev = 0
  let curr = 1
  for (let i = 2; i <= n; i++) {
    const next = prev + curr
    prev = curr
    curr = next
  }
  return curr
}
```

### 常见动态规划状态转移方程

面试前可以记一记典型问题的转移方程，分析到位时能快速套用：

| 问题 | 状态转移方程 | `dp` 含义 |
| --- | --- | --- |
| 斐波那契数列 | `dp[i] = dp[i-1] + dp[i-2]` | 第 `i` 个斐波那契数 |
| 爬楼梯 | `dp[i] = dp[i-1] + dp[i-2]` | 爬到第 `i` 级的方法数 |
| 0-1 背包 | `dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i]] + v[i])` | 前 `i` 件、容量 `j` 的最大价值 |
| 最长递增子序列 | `dp[i] = max(dp[j] + 1, dp[i])`（`nums[i] > nums[j]`） | 以 `i` 结尾的最长递增子序列长度 |
| 最大子数组和 | `dp[i] = max(nums[i], nums[i] + dp[i-1])` | 以 `i` 结尾的最大子数组和 |
| 最长公共子序列 | 相等时 `dp[i][j] = dp[i-1][j-1] + 1`，否则 `max(dp[i-1][j], dp[i][j-1])` | 前 `i`、前 `j` 个字符的 LCS 长度 |
| 编辑距离 | 相等时 `dp[i][j] = dp[i-1][j-1]`，否则 `min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1` | `word1` 前 `i` 转成 `word2` 前 `j` 的最少操作数 |
| 打家劫舍 | `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` | 前 `i` 间房的最大金额 |
| 最大正方形 | 为 1 时 `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`，否则 `0` | 以 `(i,j)` 为右下角的最大正方形边长 |
| 零钱兑换 | `dp[i] = min(dp[i], dp[i - coin] + 1)`（对每种面额） | 凑成金额 `i` 的最少硬币数 |

### 零钱兑换实现（LeetCode 322）

```js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0 // 凑成 0 需要 0 枚

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1)
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]
}

coinChange([1, 2, 5], 11) // 3（5+5+1）
coinChange([2], 3)        // -1（无法凑成）
```

状态转移：对每种面额 `coin`，如果用该硬币，子问题是凑成 `i - coin` 的最少硬币数 + 1，取所有面额的最小值。

## 参考来源

- [MDN: Recursion](https://developer.mozilla.org/zh-CN/docs/Glossary/Recursion)
- [Wikipedia: 动态规划](https://zh.wikipedia.org/wiki/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92)
