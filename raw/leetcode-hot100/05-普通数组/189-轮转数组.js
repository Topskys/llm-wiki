/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 05-普通数组
 * ------------------------------------------------------------
 * 题号：189
 * 题目：轮转数组（Rotate Array）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/rotate-array/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个整数数组 nums，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。
 *
 * 【示例】
 * 输入：nums = [1,2,3,4,5,6,7], k = 3
 * 输出：[5,6,7,1,2,3,4]
 *
 * 【提示】
 * 1 <= nums.length <= 10^5
 * -2^31 <= nums[i] <= 2^31 - 1
 * 0 <= k <= 10^5
 *
 * 【算法思路】
 * 1、三次反转法：先整体反转，再分别反转前 k 个和后 n-k 个。
 * 2、原数组 [1,2,3,4,5,6,7]，k=3：整体反转 [7,6,5,4,3,2,1]。
 * 3、前 k 个反转 [5,6,7,4,3,2,1]，后 n-k 个反转 [5,6,7,1,2,3,4]。
 * 4、k 需先对 n 取模，避免 k > n 时越界。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，三次反转各 O(n)
 * 空间复杂度：O(1)，原地操作
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void}
 */
function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  const reverse = (l, r) => {
    while (l < r) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
      l++;
      r--;
    }
  };
  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
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
  const run = (input, k, label, expected) => {
    const arr = input.slice();
    rotate(arr, k);
    eq(label, arr, expected);
  };

  run([1, 2, 3, 4, 5, 6, 7], 3, '基本示例', [5, 6, 7, 1, 2, 3, 4]);
  run([-1, -100, 3, 99], 2, '含负数', [3, 99, -1, -100]);
  run([1], 0, 'k=0', [1]);
  run([1, 2], 3, 'k>n', [2, 1]);
  run([1, 2, 3], 0, 'k=0 不变', [1, 2, 3]);
  run([1, 2, 3], 3, 'k=n 不变', [1, 2, 3]);

  console.log(`[189-轮转数组] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rotate };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}