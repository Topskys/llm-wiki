/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：198
 * 题目：打家劫舍（House Robber）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/house-robber/
 * ------------------------------------------------------------
 * 【题目描述】
 * 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，
 * 影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，
 * 如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 * 给定一个代表每个房屋存放金额的非负整数数组 nums，
 * 计算你不触动报警装置的情况下，一夜之内能够偷窃到的最高金额。
 *
 * 【示例】
 * 输入：nums = [1,2,3,1]
 * 输出：4
 * 解释：偷 1 号房屋（金额 1），再偷 3 号房屋（金额 3），总计 1 + 3 = 4。
 *
 * 输入：nums = [2,7,9,3,1]
 * 输出：12
 * 解释：偷 1 号（2）、3 号（9）、5 号（1），总计 2 + 9 + 1 = 12。
 *
 * 【提示】
 * 1 <= nums.length <= 100
 * 0 <= nums[i] <= 200
 * 房屋沿街排成一排，只能选择互不相邻的下标集合
 * 金额为非负整数，因此「不偷」只会出现在跳过更优的情形
 *
 * 【算法思路】
 * 1、状态定义：dp[i] 表示考虑前 i+1 间房屋（下标 0..i）时能偷到的最高金额。
 * 2、转移方程：dp[i] = max(dp[i-1], dp[i-2] + nums[i])，即第 i 间要么不偷（继承 dp[i-1]），要么偷（在 dp[i-2] 基础上加 nums[i]）。
 * 3、初始化：dp[0] = nums[0]，dp[1] = max(nums[0], nums[1])。
 * 4、遍历顺序：i 从 2 递增到 n-1，保证 dp[i-1]、dp[i-2] 已就绪。
 * 5、空间优化：只依赖前两项，用 robPrev / robPrev2 两个滚动变量替代整个 dp 数组。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，一次线性扫描
 * 空间复杂度：O(1)，滚动变量（写成 dp 数组则为 O(n)）
 * ============================================================
 */

/**
 * 计算不触发警报的前提下能偷窃到的最高金额
 * @param {number[]} nums - 每间房屋的金额，非负整数数组
 * @return {number} 可偷到的最高金额
 */
function rob(nums) {
  if (!nums || nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  // prev2 = dp[i-2]，prev1 = dp[i-1]
  let prev2 = nums[0];
  let prev1 = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    const cur = Math.max(prev1, prev2 + nums[i]);
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

  eq('n=1 单间房屋', rob([5]), 5);
  eq('n=2 取较大者', rob([2, 3]), 3);
  eq('示例1 [1,2,3,1]', rob([1, 2, 3, 1]), 4);
  eq('示例2 [2,7,9,3,1]', rob([2, 7, 9, 3, 1]), 12);
  eq('全为 0', rob([0, 0, 0, 0]), 0);
  eq('空数组边界', rob([]), 0);
  eq('中间大两头小 [100,1,1,100]', rob([100, 1, 1, 100]), 200);
  eq('递增 [2,1,1,2]', rob([2, 1, 1, 2]), 4);
  eq('单点跳过 [5,1,1,5]', rob([5, 1, 1, 5]), 10);

  console.log(`[198-打家劫舍] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rob };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
