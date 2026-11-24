/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 04-子串
 * ------------------------------------------------------------
 * 题号：560
 * 题目：和为K的子数组（Subarray Sum Equals K）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/subarray-sum-equals-k/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。
 * 子数组是数组中元素的连续非空序列。
 *
 * 【示例】
 * 输入：nums = [1,1,1], k = 2
 * 输出：2
 *
 * 【提示】
 * 1 <= nums.length <= 2 * 10^4
 * -1000 <= nums[i] <= 1000
 * -10^7 <= k <= 10^7
 *
 * 【算法思路】
 * 1、前缀和 + Map「前缀和 -> 出现次数」。
 * 2、遍历到 i 时，若前缀和 pre - k 曾在之前出现 cnt 次，则以 i 结尾、和为 k 的子数组有 cnt 个。
 * 3、先查 pre-k 再把当前 pre 写入 Map，避免把当前位置也算作起点。
 * 4、初始 preSum[0] = 1，处理「从数组开头到 i」恰好等于 k 的情形。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(n)，前缀和 Map
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function subarraySum(nums, k) {
  const map = new Map();
  map.set(0, 1);
  let pre = 0;
  let ans = 0;
  for (const x of nums) {
    pre += x;
    ans += map.get(pre - k) || 0;
    map.set(pre, (map.get(pre) || 0) + 1);
  }
  return ans;
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

  eq('nums=[1,1,1] k=2', subarraySum([1, 1, 1], 2), 2);
  eq('nums=[1,2,3] k=3', subarraySum([1, 2, 3], 3), 2);
  eq('含负数', subarraySum([1, -1, 0], 0), 3);
  eq('k=0 全零数组', subarraySum([0, 0], 0), 3);
  eq('无解', subarraySum([1, 2], 5), 0);
  eq('单元素命中', subarraySum([3], 3), 1);
  eq('单元素未命中', subarraySum([3], 4), 0);
  eq('前缀和相同', subarraySum([1, -1, 1, -1], 0), 4);
  eq('大数范围', subarraySum([1000, -1000, 1000], 1000), 3);
  eq('连续重复', subarraySum([2, 2, 2], 4), 2);

  console.log(`[560-和为K的子数组] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { subarraySum };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}