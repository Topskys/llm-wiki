/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 11-二分查找
 * ------------------------------------------------------------
 * 题号：4
 * 题目：寻找两个正序数组的中位数（Median of Two Sorted Arrays）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/median-of-two-sorted-arrays/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2 。
 * 请你找出并返回这两个正序数组的 中位数 。
 * 算法的时间复杂度应该为 O(log (m+n)) 。
 *
 * 【示例】
 * 输入：nums1 = [1,3], nums2 = [2]
 * 输出：2.0
 * 解释：合并数组 = [1,2,3] ，中位数是 2 。
 *
 * 输入：nums1 = [1,2], nums2 = [3,4]
 * 输出：2.5
 * 解释：合并数组 = [1,2,3,4] ，中位数是 (2 + 3) / 2 = 2.5 。
 *
 * 【提示】
 * nums1.length == m
 * nums2.length == n
 * 0 <= m <= 1000
 * 0 <= n <= 1000
 * 1 <= m + n <= 2000
 * -10^6 <= nums1[i], nums2[i] <= 10^6
 *
 * 【算法思路】
 * 1、不合并数组，而是二分「划分位置」。设总长度一半为 half = (m+n+1) >> 1。
 * 2、在较短数组上枚举切点 i ∈ [0, m]，另一数组切点 j = half - i，使左半部分恰好含 half 个元素。
 * 3、合法条件：nums1[i-1] <= nums2[j] 且 nums2[j-1] <= nums1[i]（交叉不逆序，边界用 ±Infinity）。
 * 4、若 nums1[i-1] > nums2[j] 说明 i 偏大，right = i - 1；否则 i 偏小，left = i + 1。
 * 5、中位数：总长为奇数取 max(leftMax)；偶数取 (max(leftMax) + min(rightMin)) / 2。
 * 6、二分较短数组使复杂度为 O(log(min(m,n)))，优于 O(log(m+n)) 要求。
 *
 * 【复杂度】
 * 时间复杂度：O(log(min(m, n)))
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
  // 保证在较短数组上二分
  if (nums1.length > nums2.length) {
    const t = nums1;
    nums1 = nums2;
    nums2 = t;
  }
  const m = nums1.length;
  const n = nums2.length;
  const half = (m + n + 1) >> 1;
  let left = 0;
  let right = m;
  while (left <= right) {
    const i = (left + right) >> 1;
    const j = half - i;
    const aLeft = i === 0 ? -Infinity : nums1[i - 1];
    const aRight = i === m ? Infinity : nums1[i];
    const bLeft = j === 0 ? -Infinity : nums2[j - 1];
    const bRight = j === n ? Infinity : nums2[j];

    if (aLeft > bRight) {
      // i 太大，左移
      right = i - 1;
    } else if (bLeft > aRight) {
      // i 太小，右移
      left = i + 1;
    } else {
      const maxLeft = Math.max(aLeft, bLeft);
      if (((m + n) & 1) === 1) return maxLeft;
      const minRight = Math.min(aRight, bRight);
      return (maxLeft + minRight) / 2;
    }
  }
  return 0;
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

  eq('nums1=[1,3] nums2=[2] 奇数总长', findMedianSortedArrays([1, 3], [2]), 2);
  eq('nums1=[1,2] nums2=[3,4] 偶数总长', findMedianSortedArrays([1, 2], [3, 4]), 2.5);
  eq('nums1=[] nums2=[1] 单边为空', findMedianSortedArrays([], [1]), 1);
  eq('nums1=[2] nums2=[] 单边为空', findMedianSortedArrays([2], []), 2);
  eq('nums1=[1,2] nums2=[3,4,5,6,7] 长度悬殊', findMedianSortedArrays([1, 2], [3, 4, 5, 6, 7]), 4);
  // 合并为 [-5,-4,-3,-2,-1,0]，中位数 = (-3 + -2) / 2
  eq('nums1=[-5,-3,-1] nums2=[-4,-2,0]', findMedianSortedArrays([-5, -3, -1], [-4, -2, 0]), -2.5);
  eq('nums1=[1,1] nums2=[1,1] 全相同', findMedianSortedArrays([1, 1], [1, 1]), 1);
  eq('nums1=[0,0] nums2=[0,0] 全为 0', findMedianSortedArrays([0, 0], [0, 0]), 0);
  // 合并为 [1,2,3,4,5,6,7]，长度 7 取第 4 个元素
  eq('nums1=[1] nums2=[2,3,4,5,6,7]', findMedianSortedArrays([1], [2, 3, 4, 5, 6, 7]), 4);
  eq('两数组完全交错', findMedianSortedArrays([1, 3, 5], [2, 4, 6]), 3.5);

  console.log(`[4-寻找两个正序数组的中位数] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { findMedianSortedArrays };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
