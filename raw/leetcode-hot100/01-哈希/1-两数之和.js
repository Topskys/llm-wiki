/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 01-哈希
 * ------------------------------------------------------------
 * 题号：1
 * 题目：两数之和（Two Sum）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/two-sum/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出
 * 和为目标值 target 的那两个整数，并返回它们的数组下标。
 * 你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。
 *
 * 【示例】
 * 输入：nums = [2,7,11,15], target = 9
 * 输出：[0,1]
 *
 * 【提示】
 * 2 <= nums.length <= 10^4
 * -10^9 <= nums[i] <= 10^9
 * 只会存在一个有效答案
 *
 * 【算法思路】
 * 1、暴力双层循环需 O(n^2) 比较，瓶颈在于「查找配对元素」；用哈希表把它降到均摊 O(1)。
 * 2、边遍历边把「值 -> 下标」写入 Map，对当前 num 直接查 target - num 是否已存在。
 * 3、命中即返回两个下标；未命中则把 num 入表继续。
 * 4、顺序必须是「先查后存」：查到的配对元素一定来自更早的下标，天然排除同一元素被用两次。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历，哈希查询均摊 O(1)
 * 空间复杂度：O(n)，最坏需存 n-1 个键值对
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
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

  eq('nums=[2,7,11,15] target=9', twoSum([2, 7, 11, 15], 9), [0, 1]);
  eq('nums=[3,2,4] target=6', twoSum([3, 2, 4], 6), [1, 2]);
  eq('nums=[3,3] target=6', twoSum([3, 3], 6), [0, 1]);
  eq('nums=[-1,-2,-3,-4,-5] target=-8', twoSum([-1, -2, -3, -4, -5], -8), [2, 4]);
  eq('nums=[0,4,3,0] target=0', twoSum([0, 4, 3, 0], 0), [0, 3]);

  console.log(`[1-两数之和] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { twoSum };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}