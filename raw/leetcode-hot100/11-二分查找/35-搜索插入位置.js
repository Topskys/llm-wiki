/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 11-二分查找
 * ------------------------------------------------------------
 * 题号：35
 * 题目：搜索插入位置（Search Insert Position）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/search-insert-position/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。
 * 如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
 * 请必须使用时间复杂度为 O(log n) 的算法。
 *
 * 【示例】
 * 输入：nums = [1,3,5,6], target = 5
 * 输出：2
 *
 * 输入：nums = [1,3,5,6], target = 2
 * 输出：1
 * 解释：2 不存在，应插入到下标 1 处，插入后为 [1,2,3,5,6]。
 *
 * 【提示】
 * 1 <= nums.length <= 10^4
 * -10^4 <= nums[i] <= 10^4
 * nums 为 无重复元素 的 升序 排列数组
 * -10^4 <= target <= 10^4
 *
 * 【算法思路】
 * 1、答案即 lowerBound：数组中第一个 >= target 的下标，命中时就是目标本身的位置，未命中时就是插入位置。
 * 2、采用左闭右开区间 [left, right)，每轮取 mid = left + ((right - left) >> 1) 防止加法溢出。
 * 3、nums[mid] < target 说明答案在右侧，left = mid + 1；否则 mid 自身可能就是答案，right = mid 保留它。
 * 4、不变量为「答案始终落在 [left, right]」，每轮区间严格缩小，故不会死循环。
 * 5、退出时 left == right 即 lowerBound，取值可能为 n，对应插入到数组末尾。
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
function searchInsert(nums, target) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
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

  eq('nums=[1,3,5,6] target=5 命中', searchInsert([1, 3, 5, 6], 5), 2);
  eq('nums=[1,3,5,6] target=2 插中间', searchInsert([1, 3, 5, 6], 2), 1);
  eq('nums=[1,3,5,6] target=7 插末尾', searchInsert([1, 3, 5, 6], 7), 4);
  eq('nums=[1,3,5,6] target=0 插头部', searchInsert([1, 3, 5, 6], 0), 0);
  eq('nums=[1] target=1', searchInsert([1], 1), 0);
  eq('nums=[1] target=2', searchInsert([1], 2), 1);
  eq('nums=[1,3] target=3 末位命中', searchInsert([1, 3], 3), 1);
  eq('nums=[-8,-3,0,5] target=-8', searchInsert([-8, -3, 0, 5], -8), 0);

  console.log(`[35-搜索插入位置] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { searchInsert };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
