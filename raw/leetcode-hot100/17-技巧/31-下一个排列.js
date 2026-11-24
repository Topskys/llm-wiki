/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 17-技巧
 * ------------------------------------------------------------
 * 题号：31
 * 题目：下一个排列（Next Permutation）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/next-permutation/
 * ------------------------------------------------------------
 * 【题目描述】
 * 整数数组的 下一个排列 是指将其元素重排后得到的、
 * 在字典顺序中比当前排列大的下一个排列。
 * 给定一个整数数组 nums ，找出这个数组的 下一个排列 ，
 * 并按 原地 修改：如果没有下一个排列（已是最大排列），
 * 则将整个数组重排为字典序最小的排列（升序）。
 *
 * 【示例】
 * 输入：nums = [1,2,3]
 * 输出：[1,3,2]
 * 解释：[1,2,3] 的字典序下一个排列是 [1,3,2]。
 *
 * 输入：nums = [3,2,1]
 * 输出：[1,2,3]
 * 解释：已是最大排列，回绕为最小排列。
 *
 * 【提示】
 * 1 <= nums.length <= 100
 * -100 <= nums[i] <= 100
 *
 * 【算法思路】
 * 1、要让下一个排列「比当前大且尽量小」，改动应尽可能靠右。
 * 2、从右往左找第一对相邻升序 nums[i-1] < nums[i]，i 右侧必为非升序（已是该后缀最大）。
 * 3、在 i 右侧从右往左找第一个大于 nums[i-1] 的数 nums[j]，与 i-1 交换——因右侧非升序，这个 j 是右侧「刚好大一点」的最小可选值。
 * 4、把 i 右侧反转（非升序变非降序），得到该后缀的最小排列。
 * 5、若找不到 i-1（整体非升序），说明已是最大排列，整段反转即回绕到最小。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，两次线性扫描 + 一次反转
 * 空间复杂度：O(1)，原地操作
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let l = i + 1;
  let r = n - 1;
  while (l < r) {
    [nums[l], nums[r]] = [nums[r], nums[l]];
    l++;
    r--;
  }
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
  const run = (input, label, expected) => {
    const arr = input.slice();
    nextPermutation(arr);
    eq(label, arr, expected);
  };

  run([1, 2, 3], 'nums=[1,2,3]', [1, 3, 2]);
  run([3, 2, 1], 'nums=[3,2,1] 最大排列回绕', [1, 2, 3]);
  run([1, 1, 5], 'nums=[1,1,5]', [1, 5, 1]);
  run([1], 'nums=[1] 单元素', [1]);
  run([2, 3, 1, 3, 3], 'nums=[2,3,1,3,3]', [2, 3, 3, 1, 3]);
  run([1, 5, 1], 'nums=[1,5,1] 含重复回绕', [5, 1, 1]);
  run([5, 4, 7, 5, 3, 2], 'nums 尾部非升序', [5, 5, 2, 3, 4, 7]);
  run([1, 3, 2], 'nums=[1,3,2]', [2, 1, 3]);

  console.log(`[31-下一个排列] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { nextPermutation };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
