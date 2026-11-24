/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 17-技巧
 * ------------------------------------------------------------
 * 题号：287
 * 题目：寻找重复数（Find the Duplicate Number）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/find-the-duplicate-number/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（含 1 和 n），
 * 可知至少存在一个重复的整数。
 * 假设 nums 只有 一个重复的整数 ，返回 这个重复的数。
 * 你设计的解决方案必须 不修改 数组 nums 且只用常量级 O(1) 的额外空间。
 *
 * 【示例】
 * 输入：nums = [1,3,4,2,2]
 * 输出：2
 *
 * 输入：nums = [3,1,3,4,2]
 * 输出：3
 *
 * 【提示】
 * 1 <= n <= 10^5
 * nums.length == n + 1
 * 1 <= nums[i] <= n
 * nums 中 只有一个整数 出现 两次或多次 ，其余整数均只出现 一次
 *
 * 【算法思路】
 * 1、把下标 i 向 nums[i] 连边，因值域为 [1,n] 恰有 n 个出口，重复的数被多个下标指向，于是形成环 —— 重复数即环的入口。
 * 2、Floyd 判圈：快指针每次走两步、慢指针走一步，二者在环内必相遇。
 * 3、设起点到入口 a 步、入口到相遇点 b 步、环长 c，由 2(a+b) = (a+b) + k·c 化简为 a+b = k·c，即 a = k·c - b。
 * 4、故让一个指针回到起点，与相遇点指针同速前进，必在入口处再相遇。
 * 5、全程只读数组、只用三个变量，满足不修改与 O(1) 空间的进阶要求。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，两阶段指针各走常数次
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[nums[0]];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[nums[fast]];
  }
  let finder = 0;
  while (finder !== slow) {
    finder = nums[finder];
    slow = nums[slow];
  }
  return finder;
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

  eq('nums=[1,3,4,2,2]', findDuplicate([1, 3, 4, 2, 2]), 2);
  eq('nums=[3,1,3,4,2]', findDuplicate([3, 1, 3, 4, 2]), 3);
  eq('nums=[1,1]', findDuplicate([1, 1]), 1);
  eq('nums=[1,1,2]', findDuplicate([1, 1, 2]), 1);
  eq('nums=[2,2,2,2,2] 全部相同', findDuplicate([2, 2, 2, 2, 2]), 2);
  eq('nums=[3,1,4,2,2] 重复数在末尾', findDuplicate([3, 1, 4, 2, 2]), 2);
  eq('nums=[6,3,1,4,2,5,3] 长链', findDuplicate([6, 3, 1, 4, 2, 5, 3]), 3);

  const frozen = [1, 3, 4, 2, 2];
  findDuplicate(frozen);
  eq('数组未被修改', frozen, [1, 3, 4, 2, 2]);

  console.log(`[287-寻找重复数] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { findDuplicate };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
