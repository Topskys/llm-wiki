/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：70
 * 题目：爬楼梯（Climbing Stairs）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/climbing-stairs/
 * ------------------------------------------------------------
 * 【题目描述】
 * 假设你正在爬楼梯，需要 n 阶你才能到达楼顶。
 * 每次你可以爬 1 或 2 个台阶。问有多少种不同的方法可以爬到楼顶？
 * 由于只能向上走，到达第 n 阶的最后一步要么跨 1 阶、要么跨 2 阶，
 * 两类方案互不重叠，因此方法数等于前两个台阶方法数之和。
 *
 * 【示例】
 * 输入：n = 2
 * 输出：2
 * 解释：两种方法：1) 1 阶 + 1 阶；2) 2 阶。
 *
 * 输入：n = 3
 * 输出：3
 * 解释：三种方法：1) 1+1+1；2) 1+2；3) 2+1。
 *
 * 【提示】
 * 1 <= n <= 45
 * 结果在 32 位整数范围内（n = 45 时为 1836311903）
 * 本题是斐波那契数列的变形，dp[n] = dp[n-1] + dp[n-2]
 *
 * 【算法思路】
 * 1、状态定义：dp[i] 表示爬到第 i 阶台阶所用的不同方法数。
 * 2、转移方程：dp[i] = dp[i-1] + dp[i-2]（最后一步跨 1 阶或跨 2 阶，两类方案不重不漏）。
 * 3、初始化：dp[0] = 1（站在地面视为一种空方案），dp[1] = 1。
 * 4、遍历顺序：i 从 2 递增到 n，小规模状态先于大规模状态计算。
 * 5、空间优化：dp[i] 只依赖前两项，用 prev2 / prev1 两个滚动变量即可压到 O(1)。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，一次线性递推
 * 空间复杂度：O(1)，仅用滚动变量
 * ============================================================
 */

/**
 * 计算爬到第 n 阶楼梯的不同方法数
 * @param {number} n - 楼梯阶数，1 <= n <= 45
 * @return {number} 不同的爬法总数
 */
function climbStairs(n) {
  if (n < 1) return 0;
  // dp[0] = 1, dp[1] = 1，滚动变量 prev2 = dp[i-2]，prev1 = dp[i-1]
  let prev2 = 1;
  let prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

// ============================== 测试 ==============================
function runTests() {
  let pass = 0;
  let fail = 0;
  const eq = (label, actual, expected) => {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (ok) {
      pass++;
    } else {
      fail++;
      console.error(`✗ ${label}`);
      console.error(`  期望: ${JSON.stringify(expected)}`);
      console.error(`  实际: ${JSON.stringify(actual)}`);
    }
  };

  eq('n=1 只有一种爬法', climbStairs(1), 1);
  eq('n=2 官方示例', climbStairs(2), 2);
  eq('n=3 官方示例', climbStairs(3), 3);
  eq('n=4 应为 5', climbStairs(4), 5);
  eq('n=5 应为 8', climbStairs(5), 8);
  eq('n=10 斐波那契第 11 项', climbStairs(10), 89);
  eq('n=45 上界不溢出', climbStairs(45), 1836311903);
  eq('n=0 非法输入兜底', climbStairs(0), 0);

  console.log(`[70-爬楼梯] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { climbStairs };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
