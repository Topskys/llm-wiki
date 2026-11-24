/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：300
 * 题目：最长递增子序列（Longest Increasing Subsequence）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/longest-increasing-subsequence/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
 * 子序列是指从原数组中删除若干（或不删除）元素后，不改变剩余元素相对顺序得到的序列。
 *
 * 【示例】
 * 输入：nums = [10,9,2,5,3,7,101,18]
 * 输出：4
 * 解释：最长递增子序列是 [2,3,7,101]，长度为 4。
 *
 * 【提示】
 * 1 <= nums.length <= 2500
 * -10^4 <= nums[i] <= 10^4
 *
 * 【算法思路】
 * 1、主解法：贪心 + 二分维护 tails 数组，tails[i] 表示长度为 i+1 的所有递增子序列中最小的末尾值。
 * 2、遍历 nums，对每个 x 用 lowerBound 在 tails 中找第一个 >= x 的位置 pos：
 *    - 若 pos 等于当前长度 len，说明 x 比所有尾值都大，追加到末尾，len++；
 *    - 否则用 x 替换 tails[pos]，保持该长度下的最小末尾值。
 * 3、最终 len 即为 LIS 长度。时间 O(n log n)，空间 O(n)。
 * 4、对比：经典 DP O(n^2) 状态 dp[i] 表示以 i 结尾的 LIS 长度，转移需枚举 j < i。
 *
 * 【复杂度】
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let l = 0, r = tails.length;
    while (l < r) {
      const m = (l + r) >> 1;
      if (tails[m] < x) l = m + 1;
      else r = m;
    }
    if (l === tails.length) tails.push(x);
    else tails[l] = x;
  }
  return tails.length;
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

  eq('nums=[10,9,2,5,3,7,101,18]', lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4);
  eq('nums=[0,1,0,3,2,3]', lengthOfLIS([0, 1, 0, 3, 2, 3]), 4);
  eq('nums=[7,7,7,7,7]', lengthOfLIS([7, 7, 7, 7, 7]), 1);
  eq('nums=[1,3,6,7,9,4,10,5,6]', lengthOfLIS([1, 3, 6, 7, 9, 4, 10, 5, 6]), 6);
  eq('单元素 [5]', lengthOfLIS([5]), 1);
  eq('严格递减 [5,4,3,2,1]', lengthOfLIS([5, 4, 3, 2, 1]), 1);
  eq('含负数 [-2,-1]', lengthOfLIS([-2, -1]), 2);

  console.log(`[300-最长递增子序列] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { lengthOfLIS };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}