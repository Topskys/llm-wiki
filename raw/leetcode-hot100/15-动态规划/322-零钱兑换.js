/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：322
 * 题目：零钱兑换（Coin Change）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/coin-change/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
 * 计算并返回可以凑成总金额所需的 最少的硬币个数 。
 * 如果没有任何一种硬币组合能组成总金额，返回 -1 。
 * 你可以认为每种面额的硬币数量是无限的，即同一面额可重复选取。
 *
 * 【示例】
 * 输入：coins = [1, 2, 5], amount = 11
 * 输出：3
 * 解释：11 = 5 + 5 + 1，共 3 枚硬币，不存在 2 枚的方案。
 *
 * 输入：coins = [2], amount = 3
 * 输出：-1
 * 解释：只有面额 2，凑不出奇数金额 3，判定无解。
 *
 * 输入：coins = [1], amount = 0
 * 输出：0
 * 解释：金额为 0 不需要任何硬币。
 *
 * 【提示】
 * 1 <= coins.length <= 12
 * 1 <= coins[i] <= 2^31 - 1
 * 0 <= amount <= 10^4
 * 每种硬币可使用无限次，属于完全背包模型
 *
 * 【算法思路】
 * 1、状态定义：dp[i] 表示凑出金额 i 所需的最少硬币个数；不可达时保持 Infinity。
 * 2、转移方程：dp[i] = min(dp[i - c] + 1)，c 遍历所有满足 c <= i 的硬币面额。
 * 3、初始化：dp[0] = 0（金额 0 用 0 枚硬币），其余 dp[i] = Infinity 表示尚未凑出。
 * 4、遍历顺序：外层金额 i 从 1 递增到 amount，内层枚举硬币面额，保证子问题 dp[i-c] 已算好。
 * 5、无解处理：若 dp[amount] 仍为 Infinity，说明确无任何组合可达，返回 -1。
 *
 * 【复杂度】
 * 时间复杂度：O(amount * k)，k 为硬币种类数
 * 空间复杂度：O(amount)，一维 dp 数组
 * ============================================================
 */

/**
 * 计算凑成总金额所需的最少硬币个数
 * @param {number[]} coins - 硬币面额数组（每种可用无限次）
 * @param {number} amount - 目标总金额
 * @return {number} 最少硬币数；无法凑出时返回 -1
 */
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i && dp[i - c] + 1 < dp[i]) {
        dp[i] = dp[i - c] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
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

  eq('示例1 coins=[1,2,5] amount=11', coinChange([1, 2, 5], 11), 3);
  eq('示例2 coins=[2] amount=3 无解返回 -1', coinChange([2], 3), -1);
  eq('示例3 amount=0 返回 0', coinChange([1], 0), 0);
  eq('单枚命中 coins=[2] amount=4', coinChange([2, 5], 4), 2);
  eq('面额大于金额 coins=[5] amount=3', coinChange([5], 3), -1);
  eq('贪心失效 coins=[1,3,4] amount=6', coinChange([1, 3, 4], 6), 2);
  eq('大面额差 coins=[186,419,83,408] amount=6249', coinChange([186, 419, 83, 408], 6249), 20);
  eq('仅面额 1 coins=[1] amount=5', coinChange([1], 5), 5);
  eq('空硬币数组无解', coinChange([], 3), -1);

  console.log(`[322-零钱兑换] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { coinChange };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
