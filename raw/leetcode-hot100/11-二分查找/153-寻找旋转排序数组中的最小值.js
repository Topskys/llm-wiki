/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 11-二分查找
 * ------------------------------------------------------------
 * 题号：153
 * 题目：寻找旋转排序数组中的最小值（Find Minimum in Rotated Sorted Array）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/
 * ------------------------------------------------------------
 * 【题目描述】
 * 已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。
 * 例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
 * 若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]；若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]。
 * 给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，
 * 并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。
 * 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
 *
 * 【示例】
 * 输入：nums = [3,4,5,1,2]
 * 输出：1
 * 解释：原数组为 [1,2,3,4,5] ，旋转 3 次得到输入数组，最小值为 1。
 *
 * 输入：nums = [4,5,6,7,0,1,2]
 * 输出：0
 *
 * 【提示】
 * n == nums.length
 * 1 <= n <= 1000
 * -1000 <= nums[i] <= 1000
 * nums 中的所有整数 互不相同
 * nums 原来是一个升序排序的数组，并进行了 1 至 n 次旋转
 *
 * 【算法思路】
 * 1、不变量：最小值始终落在闭区间 [left, right] 内，任何收缩都不得把它排除。
 * 2、只与 nums[right] 比较，不能与 nums[left] 比——那样无法区分「未旋转」与「旋转点在右半」。
 * 3、nums[mid] > nums[right]：mid 落在第一段，旋转点在其右侧，故 left = mid + 1。
 * 4、nums[mid] <= nums[right]：mid 已在第二段（或数组未旋转），mid 自身可能就是最小值，用 right = mid 保留它。
 * 5、两种收缩都让区间严格变小，while (left < right) 必终止，退出时 left == right 即最小值下标。
 * 6、元素互不相同是能使用严格大小比较、不必处理「相等」歧义的前提。
 *
 * 【复杂度】
 * 时间复杂度：O(log n)
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return nums[left];
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

  eq('nums=[3,4,5,1,2]', findMin([3, 4, 5, 1, 2]), 1);
  eq('nums=[4,5,6,7,0,1,2]', findMin([4, 5, 6, 7, 0, 1, 2]), 0);
  eq('nums=[11,13,15,17]', findMin([11, 13, 15, 17]), 11);
  eq('nums=[1] 单元素', findMin([1]), 1);
  eq('nums=[2,1] 旋转点在末尾', findMin([2, 1]), 1);
  eq('nums=[1,2] 未旋转', findMin([1, 2]), 1);
  eq('nums=[5,1,2,3,4] 最小值在下标 1', findMin([5, 1, 2, 3, 4]), 1);
  eq('nums=[-3,-2,-1,0,1] 含负数', findMin([-3, -2, -1, 0, 1]), -3);
  eq('nums=[1,2,3,4,5] 完全未旋转', findMin([1, 2, 3, 4, 5]), 1);

  console.log(`[153-寻找旋转排序数组中的最小值] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { findMin };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
