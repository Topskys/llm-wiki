/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 05-普通数组
 * ------------------------------------------------------------
 * 题号：53
 * 题目：最大子数组和（Maximum Subarray）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/maximum-subarray/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
 *
 * 【示例】
 * 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
 * 输出：6
 * 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
 *
 * 【提示】
 * 1 <= nums.length <= 10^5
 * -10^4 <= nums[i] <= 10^4
 *
 * 【算法思路】
 * 1、Kadane 算法：维护「以当前位置结尾的最大子数组和」cur。
 * 2、若 cur < 0，说明之前的和对当前是负贡献，直接丢弃，从当前元素重新开始。
 * 3、cur = max(nums[i], cur + nums[i])，同时更新全局最大值。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
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

  eq('基本示例', maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
  eq('单元素', maxSubArray([5]), 5);
  eq('单负元素', maxSubArray([-5]), -5);
  eq('全负', maxSubArray([-3, -1, -2]), -1);
  eq('全正', maxSubArray([1, 2, 3]), 6);
  eq('先负后正', maxSubArray([-1, 2]), 2);
  eq('含零', maxSubArray([0, -1, 2]), 2);

  console.log(`[53-最大子数组和] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { maxSubArray };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}