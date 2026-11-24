/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 16-多维动态规划
 * ------------------------------------------------------------
 * 题号：64
 * 题目：最小路径和（Minimum Path Sum）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/minimum-path-sum/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个包含非负整数的 m x n 网格 grid，
 * 请找出一条从左上角到右下角的路径，使得路径上的数字总和最小。
 * 说明：每次只能向下或者向右移动一步。
 *
 * 【示例】
 * 输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
 * 输出：7
 * 解释：路径 1→3→1→1→1 的总和最小，为 7。
 *
 * 输入：grid = [[1,2,3],[4,5,6]]
 * 输出：12
 * 解释：唯一最优路径 1→2→3→6，总和 12。
 *
 * 【提示】
 * m == grid.length, n == grid[i].length
 * 1 <= m, n <= 200
 * 0 <= grid[i][j] <= 200
 *
 * 【算法思路】
 * 1、状态定义：dp[i][j] 表示从左上角走到格子 (i,j) 的最小路径和。
 * 2、转移方程：dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])，到达 (i,j) 的前一格只能是上方或左方，取两者较小者。
 * 3、初始化：dp[0][0] = grid[0][0]；第一行 dp[0][j] = dp[0][j-1] + grid[0][j]（只能从左来）；第一列 dp[i][0] = dp[i-1][0] + grid[i][0]（只能从上来）。
 * 4、遍历顺序：按行从上到下、每行按列从左到右，保证计算 dp[i][j] 时上方与左方均已就绪。
 * 5、实现方式：直接用滚动一维数组 dp[j]，其中 dp[j]（旧值）＝上方，dp[j-1]（新值）＝左方。
 *
 * 【复杂度】
 * 时间复杂度：O(m * n)，每格常数次操作
 * 空间复杂度：O(n)，滚动一维数组
 * ============================================================
 */

/**
 * 从左上到右下的最小路径和（滚动一维 DP）
 * @param {number[][]} grid - m x n 非负整数网格
 * @return {number} 最小路径和
 */
function minPathSum(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = new Array(n);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) {
        dp[j] = grid[0][0];
      } else if (i === 0) {
        dp[j] = dp[j - 1] + grid[i][j]; // 第一行只能从左来
      } else if (j === 0) {
        dp[j] = dp[j] + grid[i][j]; // 第一列只能从上来（dp[0] 旧值即上方）
      } else {
        dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
      }
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

  eq('示例1', minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]), 7);
  eq('示例2', minPathSum([[1, 2, 3], [4, 5, 6]]), 12);
  eq('1x1 网格', minPathSum([[5]]), 5);
  eq('单行', minPathSum([[1, 2, 3, 4]]), 10);
  eq('单列', minPathSum([[1], [2], [3]]), 6);
  eq('全零', minPathSum([[0, 0], [0, 0]]), 0);
  eq('含零值', minPathSum([[9, 0], [0, 9]]), 18);
  eq('2x2 常规', minPathSum([[1, 3], [2, 1]]), 4);

  console.log(`[64-最小路径和] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { minPathSum };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
