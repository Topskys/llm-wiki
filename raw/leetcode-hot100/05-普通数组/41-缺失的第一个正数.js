/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 05-普通数组
 * ------------------------------------------------------------
 * 题号：41
 * 题目：缺失的第一个正数（First Missing Positive）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/first-missing-positive/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。
 * 请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
 *
 * 【示例】
 * 输入：nums = [3,4,-1,1]
 * 输出：2
 *
 * 【提示】
 * 1 <= nums.length <= 10^5
 * -2^31 <= nums[i] <= 2^31 - 1
 *
 * 【算法思路】
 * 1、原地哈希：把数值 x 放到下标 x-1 的位置（若 x ∈ [1, n]）。
 * 2、遍历数组，若 nums[i] ∈ [1, n] 且 nums[i] != nums[nums[i]-1]，则交换到正确位置。
 * 3、交换后当前位置可能仍需交换，故用 while 循环直到当前位置满足条件或超出范围。
 * 4、再次遍历，第一个 nums[i] != i+1 的位置即为缺失的最小正数；若都正确则返回 n+1。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个元素至多被交换一次
 * 空间复杂度：O(1)，原地操作
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[i] !== nums[nums[i] - 1]) {
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
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

  eq('基本示例', firstMissingPositive([3, 4, -1, 1]), 2);
  eq('缺 1', firstMissingPositive([1, 2, 0]), 3);
  eq('单元素 1', firstMissingPositive([1]), 2);
  eq('单元素 2', firstMissingPositive([2]), 1);
  eq('全负', firstMissingPositive([-1, -2]), 1);
  eq('含重复', firstMissingPositive([1, 1]), 2);
  eq('完整序列', firstMissingPositive([1, 2, 3]), 4);
  eq('大数范围', firstMissingPositive([100000, -1, 1]), 2);

  console.log(`[41-缺失的第一个正数] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firstMissingPositive };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}