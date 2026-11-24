/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 11-二分查找
 * ------------------------------------------------------------
 * 题号：34
 * 题目：在排序数组中查找元素的第一个和最后一个位置
 *      （Find First and Last Position of Element in Sorted Array）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个按照非递减顺序排列的整数数组 nums 和一个目标值 target 。
 * 请你找出给定目标值在数组中的开始位置和结束位置。
 * 如果数组中不存在目标值 target ，返回 [-1, -1] 。
 * 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
 *
 * 【示例】
 * 输入：nums = [5,7,7,8,8,10], target = 8
 * 输出：[3,4]
 *
 * 输入：nums = [5,7,7,8,8,10], target = 6
 * 输出：[-1,-1]
 *
 * 【提示】
 * 0 <= nums.length <= 10^5
 * -10^9 <= nums[i] <= 10^9
 * nums 是一个非递减数组
 * -10^9 <= target <= 10^9
 *
 * 【算法思路】
 * 1、左边界 = lowerBound(target)，即第一个 >= target 的下标；右边界 = lowerBound(target + 1) - 1，即第一个 > target 的位置前移一位。
 * 2、lowerBound 用左闭右开 [left, right)：nums[mid] < v 时 left = mid + 1，否则 right = mid 保留候选。
 * 3、每轮区间严格收缩故不死循环，退出时 left 即为所求，可能等于 n（全部元素都小于 v）。
 * 4、存在性判定：lo 未越界且 nums[lo] === target 才有解，否则直接返回 [-1, -1]。
 * 5、用「找 target + 1」代替单独实现 upperBound，两个边界共用同一份代码，避免逻辑漂移。
 *
 * 【复杂度】
 * 时间复杂度：O(log n)，两次二分
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * 第一个 >= v 的下标
 * @param {number[]} nums
 * @param {number} v
 * @return {number}
 */
function lowerBound(nums, v) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < v) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function searchRange(nums, target) {
  const lo = lowerBound(nums, target);
  if (lo === nums.length || nums[lo] !== target) return [-1, -1];
  const hi = lowerBound(nums, target + 1) - 1;
  return [lo, hi];
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

  eq('nums=[5,7,7,8,8,10] target=8', searchRange([5, 7, 7, 8, 8, 10], 8), [3, 4]);
  eq('nums=[5,7,7,8,8,10] target=6 不存在', searchRange([5, 7, 7, 8, 8, 10], 6), [-1, -1]);
  eq('nums=[] 空数组', searchRange([], 0), [-1, -1]);
  eq('nums=[1] target=1 单元素命中', searchRange([1], 1), [0, 0]);
  eq('nums=[1] target=0 未命中', searchRange([1], 0), [-1, -1]);
  eq('nums=[2,2] target=2 全相同', searchRange([2, 2], 2), [0, 1]);
  eq('nums=[1,2,3] target=3 末位', searchRange([1, 2, 3], 3), [2, 2]);
  eq('nums=[1,2,3] target=1 首位', searchRange([1, 2, 3], 1), [0, 0]);
  eq('target 大于全部', searchRange([1, 2, 3], 9), [-1, -1]);

  console.log(`[34-在排序数组中查找元素的第一个和最后一个位置] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { lowerBound, searchRange };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
