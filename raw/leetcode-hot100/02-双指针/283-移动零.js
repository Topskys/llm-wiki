/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 02-双指针
 * ------------------------------------------------------------
 * 题号：283
 * 题目：移动零（Move Zeroes）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/move-zeroes/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，
 * 同时保持非零元素的相对顺序。必须在不复制数组的情况下原地对数组进行操作。
 *
 * 【示例】
 * 输入：nums = [0,1,0,3,12]
 * 输出：[1,3,12,0,0]
 *
 * 【提示】
 * 1 <= nums.length <= 10^4
 * -2^31 <= nums[i] <= 2^31 - 1
 *
 * 【算法思路】
 * 1、双指针 write/read：write 指向下一个非零元素应写入的位置，read 扫描全数组。
 * 2、read 遇到非零元素就写入 write 位置并 write++，保证非零元素相对顺序不变。
 * 3、扫描结束后，write 之后的所有位置补 0。
 * 4、也可单遍交换：read 遇非零就与 write 交换并 write++，更简洁但交换次数略多。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(1)，原地操作
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {void}
 */
function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write++] = nums[read];
    }
  }
  while (write < nums.length) nums[write++] = 0;
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
    moveZeroes(arr);
    eq(label, arr, expected);
  };

  run([0, 1, 0, 3, 12], '基本示例', [1, 3, 12, 0, 0]);
  run([0], '单零', [0]);
  run([1], '单非零', [1]);
  run([0, 0, 0], '全零', [0, 0, 0]);
  run([1, 2, 3], '无零', [1, 2, 3]);
  run([0, 0, 1, 0, 2], '前导零', [1, 2, 0, 0, 0]);
  run([1, 0, 2, 0, 3], '交替', [1, 2, 3, 0, 0]);
  run([-1, 0, -2], '含负数', [-1, -2, 0]);
  run([0, 0, 0, 1], '零在头', [1, 0, 0, 0]);
  run([1, 2, 0, 0], '零在尾', [1, 2, 0, 0]);

  console.log(`[283-移动零] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { moveZeroes };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}