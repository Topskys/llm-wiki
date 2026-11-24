/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 17-技巧
 * ------------------------------------------------------------
 * 题号：75
 * 题目：颜色分类（Sort Colors）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/sort-colors/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，
 * 原地 对它们进行排序，使得相同颜色的元素相邻，
 * 并按照红色、白色、蓝色顺序排列。
 * 我们使用整数 0、1 和 2 分别表示红色、白色和蓝色。
 * 必须在不使用库内置的 sort 函数的情况下解决这个问题。
 *
 * 【示例】
 * 输入：nums = [2,0,2,1,1,0]
 * 输出：[0,0,1,1,2,2]
 * 解释：0 全部前移、2 全部后移，1 自然留在中间。
 *
 * 【提示】
 * n == nums.length
 * 1 <= n <= 300
 * nums[i] 为 0、1 或 2
 * 进阶：你能想出一个仅使用常数空间的一趟扫描算法吗？
 *
 * 【算法思路】
 * 1、荷兰国旗三指针：zero 指向 0 区右边界、two 指向 2 区左边界、i 为扫描指针。
 * 2、不变量：[0, zero) 全为 0，[zero, i) 全为 1，(two, n-1] 全为 2，[i, two] 待处理。
 * 3、遇 1 直接 i++；遇 0 与 zero 交换后双双前进（换回来的必是已处理的 1）。
 * 4、遇 2 与 two 交换后只退 two、i 原地不动，因为从尾部换回来的值尚未检查。
 * 5、i 越过 two 时全部区域确定，一趟扫描完成。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(1)，原地交换
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
function sortColors(nums) {
  let zero = 0;
  let two = nums.length - 1;
  let i = 0;
  while (i <= two) {
    if (nums[i] === 0) {
      [nums[i], nums[zero]] = [nums[zero], nums[i]];
      zero++;
      i++;
    } else if (nums[i] === 2) {
      [nums[i], nums[two]] = [nums[two], nums[i]];
      two--;
    } else {
      i++;
    }
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
    sortColors(arr);
    eq(label, arr, expected);
  };

  run([2, 0, 2, 1, 1, 0], 'nums=[2,0,2,1,1,0]', [0, 0, 1, 1, 2, 2]);
  run([2, 0, 1], 'nums=[2,0,1]', [0, 1, 2]);
  run([0], 'nums=[0] 单元素', [0]);
  run([1, 1, 1], 'nums=[1,1,1] 全相同', [1, 1, 1]);
  run([2, 2, 1, 1, 0, 0], 'nums 已逆序', [0, 0, 1, 1, 2, 2]);
  run([1, 2, 0], 'nums=[1,2,0] 首元素为 1', [0, 1, 2]);
  run([0, 2, 0, 2, 0, 2], 'nums 交替 0/2 无 1', [0, 0, 0, 2, 2, 2]);

  console.log(`[75-颜色分类] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sortColors };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
