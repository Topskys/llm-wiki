/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：416
 * 题目：分割等和子集（Partition Equal Subset Sum）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/partition-equal-subset-sum/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，
 * 使得两个子集的元素和相等。
 *
 * 【示例】
 * 输入：nums = [1,5,11,5]
 * 输出：true
 * 解释：数组可以分割成 [1, 5, 5] 和 [11]。
 *
 * 输入：nums = [1,2,3,5]
 * 输出：false
 * 解释：数组不能分割成两个元素和相等的子集。
 *
 * 【提示】
 * 1 <= nums.length <= 200
 * 1 <= nums[i] <= 100
 *
 * 【算法思路】
 * 1、问题等价于：能否从数组中选出若干元素，使其和恰好为 sum/2（0-1 背包问题）。
 * 2、状态定义：dp[j] 表示能否用数组中的元素凑出和 j。
 * 3、转移方程：对每个数 num，倒序遍历 j 从 target 到 num，dp[j] = dp[j] || dp[j - num]。
 * 4、初始化：dp[0] = true（和为 0 总能凑出，即不选任何元素）。
 * 5、遍历顺序：外层遍历每个数（每个数只能用一次），内层倒序保证不会重复使用同一个数。
 * 6、预处理：若总和为奇数直接返回 false；若某元素大于 target 也直接返回 false。
 *
 * 【复杂度】
 * 时间复杂度：O(n * target)，target = sum/2
 * 空间复杂度：O(target)，一维滚动数组
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {boolean}
 */
function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2 !== 0) return false;
  const target = sum / 2;
  if (nums.some(x => x > target)) return false;

  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums) {
    // 倒序遍历，保证每个数只使用一次
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }
  return dp[target];
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

  eq('nums=[1,5,11,5]', canPartition([1, 5, 11, 5]), true);
  eq('nums=[1,2,3,5] 总和为奇数', canPartition([1, 2, 3, 5]), false);
  eq('nums=[1,2,5] 无法分割', canPartition([1, 2, 5]), false);
  eq('nums=[2,2] 两相同', canPartition([2, 2]), true);
  eq('nums=[1,1,1,1] 全相同', canPartition([1, 1, 1, 1]), true);
  eq('nums=[100,1,2,3,4,5] 大元素', canPartition([100, 1, 2, 3, 4, 5]), false);
  eq('nums=[14,9,8,4,3,2] 多元素', canPartition([14, 9, 8, 4, 3, 2]), true);

  console.log(`[416-分割等和子集] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { canPartition };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}