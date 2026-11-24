/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：279
 * 题目：完全平方数（Perfect Squares）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/perfect-squares/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数 n，返回 和为 n 的完全平方数的最少数量。
 * 完全平方数 是一个整数，其值等于另一个整数的平方；
 * 换句话说，其值等于一个整数自乘的积。例如 1、4、9 和 16 都是完全平方数，
 * 而 3 和 11 不是。
 * 例如 12 = 4 + 4 + 4，最少需要 3 个完全平方数；13 = 4 + 9，最少需要 2 个。
 *
 * 【示例】
 * 输入：n = 12
 * 输出：3
 * 解释：12 = 4 + 4 + 4，共 3 个完全平方数；不存在只用 2 个平方数凑出 12 的方案。
 *
 * 输入：n = 13
 * 输出：2
 * 解释：13 = 4 + 9，是两个完全平方数之和。
 *
 * 【提示】
 * 1 <= n <= 10^4
 * 数字 1 是完全平方数，故任何 n 一定有解，dp 值不会为无穷
 * 可选平方数集合为 1, 4, 9, ... , floor(sqrt(n))^2
 * 本题等价于「硬币面值为完全平方数」的完全背包最少硬币数
 *
 * 【算法思路】
 * 1、状态定义：dp[i] 表示和为 i 所需要的完全平方数的最少个数。
 * 2、转移方程：dp[i] = min(dp[i - j*j] + 1)，j 取 1..floor(sqrt(i))，即枚举最后一个加入的平方数。
 * 3、初始化：dp[0] = 0（和为 0 不需要任何数），其余 dp[i] = Infinity 表示尚未更新。
 * 4、遍历顺序：外层 i 从 1 递增到 n，内层枚举 j*j <= i，小金额先算保证子问题已就绪。
 * 5、剪枝：i 本身为完全平方数时 dp[i] 直接为 1，由 j*j === i 的转移自然得到。
 *
 * 【复杂度】
 * 时间复杂度：O(n * sqrt(n))，每个 i 枚举约 sqrt(i) 个平方数
 * 空间复杂度：O(n)，一维 dp 数组
 * ============================================================
 */

/**
 * 返回和为 n 的完全平方数的最少数量
 * @param {number} n - 目标整数，1 <= n <= 10^4
 * @return {number} 最少完全平方数个数
 */
function numSquares(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j * j <= i; j++) {
      const cand = dp[i - j * j] + 1;
      if (cand < dp[i]) dp[i] = cand;
    }
  }
  return dp[n];
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

  eq('n=1 本身就是平方数', numSquares(1), 1);
  eq('n=2 = 1+1', numSquares(2), 2);
  eq('n=4 完全平方数', numSquares(4), 1);
  eq('n=12 官方示例', numSquares(12), 3);
  eq('n=13 官方示例', numSquares(13), 2);
  eq('n=7 = 4+1+1+1', numSquares(7), 4);
  eq('n=28 = 25+1+1+1', numSquares(28), 4);
  eq('n=4344 上界附近', numSquares(4344), 3);
  eq('n=9999 最大范围内', numSquares(9999), 4);

  console.log(`[279-完全平方数] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { numSquares };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
