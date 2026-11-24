/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 11-二分查找
 * ------------------------------------------------------------
 * 题号：33
 * 题目：搜索旋转排序数组（Search in Rotated Sorted Array）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/search-in-rotated-sorted-array/
 * ------------------------------------------------------------
 * 【题目描述】
 * 整数数组 nums 按升序排列，数组中的值 互不相同 。
 * 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，
 * 使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], ..., nums[k-1]]。
 * 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值，
 * 返回它的下标，否则返回 -1 。你必须设计一个时间复杂度为 O(log n) 的算法。
 *
 * 【示例】
 * 输入：nums = [4,5,6,7,0,1,2], target = 0
 * 输出：4
 *
 * 输入：nums = [4,5,6,7,0,1,2], target = 3
 * 输出：-1
 *
 * 【提示】
 * 1 <= nums.length <= 5000
 * -10^4 <= nums[i] <= 10^4
 * nums 中的每个值都 独一无二
 * 题目数据保证 nums 在预先未知的某个下标上进行了旋转
 * -10^4 <= target <= 10^4
 *
 * 【算法思路】
 * 1、旋转数组由两段递增区间拼接而成，取 mid 后左右两半中必有一半是完整的有序段。
 * 2、nums[left] <= nums[mid] 说明左半 [left, mid] 有序；取 <= 可同时覆盖 left == mid 的两元素情形。
 * 3、走向判定只看「有序段的值域是否包住 target」：左半有序时 nums[left] <= target < nums[mid] 才进左，否则进右。
 * 4、右半 [mid, right] 有序时同理：nums[mid] < target <= nums[right] 才进右，否则进左。
 * 5、每轮都能确定丢弃一半，区间严格收缩，故 O(log n) 且不会死循环。
 *
 * 【复杂度】
 * 时间复杂度：O(log n)
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      // 左半 [left, mid] 有序
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // 右半 [mid, right] 有序
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
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

  eq('nums=[4,5,6,7,0,1,2] target=0', search([4, 5, 6, 7, 0, 1, 2], 0), 4);
  eq('nums=[4,5,6,7,0,1,2] target=3 不存在', search([4, 5, 6, 7, 0, 1, 2], 3), -1);
  eq('nums=[1] target=1', search([1], 1), 0);
  eq('nums=[1] target=0', search([1], 0), -1);
  eq('nums=[1,3] target=3 未旋转', search([1, 3], 3), 1);
  eq('nums=[3,1] target=1 旋转点在中', search([3, 1], 1), 1);
  eq('nums=[5,1,3] target=5 首元素', search([5, 1, 3], 5), 0);
  eq('nums=[6,7,0,1,2,4,5] target=4', search([6, 7, 0, 1, 2, 4, 5], 4), 5);
  eq('nums=[1,2,3,4,5] 完全未旋转 target=1', search([1, 2, 3, 4, 5], 1), 0);
  eq('旋转点在末尾 target=2', search([2, 1], 2), 0);

  console.log(`[33-搜索旋转排序数组] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { search };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
