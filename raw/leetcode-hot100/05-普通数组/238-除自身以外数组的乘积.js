/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 05-普通数组
 * ------------------------------------------------------------
 * 题号：238
 * 题目：除自身以外数组的乘积（Product of Array Except Self）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/product-of-array-except-self/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。
 * 题目数据 保证 数组 nums 之中任意元素的全部前缀元素和后缀的乘积都在 32 位 整数范围内。
 * 请 不要使用除法，且在 O(n) 时间复杂度内完成此题。
 *
 * 【示例】
 * 输入：nums = [1,2,3,4]
 * 输出：[24,12,8,6]
 *
 * 【提示】
 * 2 <= nums.length <= 10^5
 * -30 <= nums[i] <= 30
 *
 * 【算法思路】
 * 1、前缀积：answer[i] 先存 nums[0..i-1] 的乘积。
 * 2、后缀积：从右往左遍历，用变量 suffix 维护 nums[i+1..n-1] 的乘积，与 answer[i] 相乘。
 * 3、空间 O(1)（输出数组不计入额外空间）。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，两次遍历
 * 空间复杂度：O(1)，除输出数组外仅常数变量
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);
  // 前缀积
  for (let i = 1; i < n; i++) {
    answer[i] = answer[i - 1] * nums[i - 1];
  }
  // 后缀积
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }
  return answer;
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

  eq('基本示例', productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]);
  eq('含零', productExceptSelf([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0]);
  eq('两元素', productExceptSelf([2, 3]), [3, 2]);
  eq('全一', productExceptSelf([1, 1, 1]), [1, 1, 1]);
  eq('含负数', productExceptSelf([-1, -2, -3]), [6, 3, 2]);
  eq('单零在头', productExceptSelf([0, 1, 2]), [2, 0, 0]);

  console.log(`[238-除自身以外数组的乘积] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { productExceptSelf };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}