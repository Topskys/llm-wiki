/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 17-技巧
 * ------------------------------------------------------------
 * 题号：169
 * 题目：多数元素（Majority Element）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/majority-element/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个大小为 n 的数组 nums ，返回其中的多数元素。
 * 多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。
 * 你可以假设数组是非空的，并且给定的数组总是存在多数元素。
 *
 * 【示例】
 * 输入：nums = [2,2,1,1,1,2,2]
 * 输出：2
 * 解释：2 出现 4 次，大于 7/2 = 3.5，故为多数元素。
 *
 * 【提示】
 * n == nums.length
 * 1 <= n <= 5 * 10^4
 * -10^9 <= nums[i] <= 10^9
 *
 * 【算法思路】
 * 1、Boyer-Moore 投票法：维护候选 candidate 与计数 count。
 * 2、count 为 0 时把当前元素立为新候选，否则同候选 +1、异候选 -1。
 * 3、直觉上多数元素与其他所有元素「一对一抵消」后仍必有剩余，因此最终候选一定是答案。
 * 4、题目保证多数元素存在，无需二次验证；若不保证存在，需再遍历一次统计频次确认。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，一次遍历
 * 空间复杂度：O(1)，仅两个变量
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function majorityElement(nums) {
  let candidate = 0;
  let count = 0;
  for (const x of nums) {
    if (count === 0) {
      candidate = x;
      count = 1;
    } else if (x === candidate) {
      count++;
    } else {
      count--;
    }
  }
  return candidate;
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

  eq('nums=[2,2,1,1,1,2,2]', majorityElement([2, 2, 1, 1, 1, 2, 2]), 2);
  eq('nums=[3,2,3]', majorityElement([3, 2, 3]), 3);
  eq('nums=[1] 单元素', majorityElement([1]), 1);
  eq('nums=[6,6,6,7,7] 候选中途切换', majorityElement([6, 6, 6, 7, 7]), 6);
  eq('含负数 [-2,-2,-2,-1]', majorityElement([-2, -2, -2, -1]), -2);

  console.log(`[169-多数元素] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { majorityElement };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
