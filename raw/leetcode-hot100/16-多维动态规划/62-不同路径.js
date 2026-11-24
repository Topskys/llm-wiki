/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 16-多维动态规划
 * ------------------------------------------------------------
 * 题号：62
 * 题目：不同路径（Unique Paths）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/unique-paths/
 * ------------------------------------------------------------
 * 【题目描述】
 * 一个 m x n 的网格，左上角有一个机器人，目标是右下角。
 * 机器人每次只能向下或者向右移动一步。
 * 问总共有多少条不同的路径能够到达右下角。
 *
 * 【示例】
 * 输入：m = 3, n = 7
 * 输出：28
 * 解释：3x7 网格需向右 6 步、向下 2 步，路径数为 C(8,2) = 28。
 *
 * 输入：m = 3, n = 2
 * 输出：3
 * 解释：3 行 2 列需向下 2 步、向右 1 步，
 *       走法为 下下右、下右下、右下下，共 3 条路径。
 *
 * 【提示】
 * 1 <= m, n <= 100
 * 题目数据保证答案小于等于 2 * 10^9
 *
 * 【算法思路】
 * 1、状态定义：dp[j] 表示从起点走到当前行第 j 列格子的路径数。
 * 2、转移方程：dp[j] = dp[j] + dp[j-1]（等号右边 dp[j] 是上一行同列的旧值＝从上而来，dp[j-1] 是本行左列刚算出的新值＝从左而来）。
 * 3、初始化：dp 数组全部置 1，对应第一行每格只有一条直路；每轮开始时 dp[0] 保持 1，对应第一列只有一条直路。
 * 4、遍历顺序：外层行 i 从 1 到 m-1，内层列 j 从 1 到 n-1，每格只依赖上方与左方，滚动一维数组即可覆盖旧值。
 * 5、滚动数组优化：二维 (m x n) 降为一维 (n)，因为求第 i 行只用得到第 i-1 行。
 *
 * 【复杂度】
 * 时间复杂度：O(m * n)
 * 空间复杂度：O(n)，滚动数组（未优化为 O(min(m,n))）
 * ============================================================
 */

/**
 * 不同路径数（滚动一维 DP）
 * @param {number} m - 网格行数
 * @param {number} n - 网格列数
 * @return {number} 从左上角到右下角的不同路径总数
 */
function uniquePaths(m, n) {
  const dp = new Array(n).fill(1); // 第一行：每格 1 条路径
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1]; // 上方旧值 + 左方新值
    }
  }
  return dp[n - 1];
}

// ============================== 测试 ==============================
function runTests() {
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      pass++;
    } else {
      fail++;
      console.error(`✗ ${label}`);
      console.error(`  期望: ${JSON.stringify(expected)}`);
      console.error(`  实际: ${JSON.stringify(actual)}`);
    }
  };
  let pass = 0;
  let fail = 0;

  eq('示例1 3x7', uniquePaths(3, 7), 28);
  eq('示例2 3x2', uniquePaths(3, 2), 3);
  eq('1x1 网格', uniquePaths(1, 1), 1);
  eq('1x100 单行', uniquePaths(1, 100), 1);
  eq('100x1 单列', uniquePaths(100, 1), 1);
  eq('2x2 网格', uniquePaths(2, 2), 2);
  eq('对称性 7x3', uniquePaths(7, 3), uniquePaths(3, 7));
  eq('7x7 网格', uniquePaths(7, 7), 924);

  console.log(`[62-不同路径] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { uniquePaths };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
