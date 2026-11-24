/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 14-贪心
 * ------------------------------------------------------------
 * 题号：121
 * 题目：买卖股票的最佳时机（Best Time to Buy and Sell Stock）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
 * 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。
 * 设计一个算法来计算你所能获取的最大利润。
 * 返回你可以从这笔交易中获取的最大利润；如果你不能获取任何利润，返回 0 。
 *
 * 【示例】
 * 输入：prices = [7,1,5,3,6,4]
 * 输出：5
 * 解释：第 2 天买入（价格 1），第 5 天卖出（价格 6），利润 6-1 = 5。
 *      注意不能第 6 天买、第 2 天卖，卖出必须晚于买入。
 *
 * 【提示】
 * 1 <= prices.length <= 10^5
 * 0 <= prices[i] <= 10^4
 *
 * 【算法思路】
 * 1、一次遍历，维护两个量：到当前为止的历史最低价 minPrice，以及「今天卖出」能得到的最大利润 bestProfit。
 * 2、对每个价格先算 prices[i] - minPrice 更新答案，再用它压低 minPrice，保证卖出日始终在买入日之后。
 * 3、贪心正确性：任意最优卖点的对应最优买点必在其之前，而该买点一定是当时的历史最低，故逐点考察历史最低即覆盖所有可行交易。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  let minPrice = Infinity;
  let bestProfit = 0;
  for (const p of prices) {
    if (p - minPrice > bestProfit) bestProfit = p - minPrice;
    if (p < minPrice) minPrice = p;
  }
  return bestProfit;
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
      console.error(`  ✗ ${label}\n    期望 ${JSON.stringify(expected)}\n    实际 ${JSON.stringify(actual)}`);
    }
  };

  eq('prices=[7,1,5,3,6,4]', maxProfit([7, 1, 5, 3, 6, 4]), 5);
  eq('prices=[7,6,4,3,1] 单调递减无利润', maxProfit([7, 6, 4, 3, 1]), 0);
  eq('prices=[2,4,1] 低点在末尾', maxProfit([2, 4, 1]), 2);
  eq('prices=[1] 单元素', maxProfit([1]), 0);
  eq('prices=[2,2,2] 全相同', maxProfit([2, 2, 2]), 0);
  eq('prices=[1,2] 最小涨幅', maxProfit([1, 2]), 1);
  eq('prices=[0,0,0,5] 含 0 价', maxProfit([0, 0, 0, 5]), 5);

  console.log(`[121-买卖股票的最佳时机] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { maxProfit };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
