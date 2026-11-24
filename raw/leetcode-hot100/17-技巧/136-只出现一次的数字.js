/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 17-技巧
 * ------------------------------------------------------------
 * 题号：136
 * 题目：只出现一次的数字（Single Number）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/single-number/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，
 * 其余每个元素均出现两次。找出那个只出现了一次的元素。
 * 你必须设计并实现线性时间复杂度的算法来解决此问题，且只使用常量额外空间。
 *
 * 【示例】
 * 输入：nums = [2,2,1]
 * 输出：1
 *
 * 输入：nums = [4,1,2,1,2]
 * 输出：4
 *
 * 【提示】
 * 1 <= nums.length <= 3 * 10^4
 * -3 * 10^4 <= nums[i] <= 3 * 10^4
 * 除了某个元素只出现一次以外，其余每个元素均出现两次
 *
 * 【算法思路】
 * 1、异或运算三性质：a ^ a = 0、a ^ 0 = a、满足交换律与结合律。
 * 2、把全部元素连异或，出现两次的数因交换律必然相邻配对而抵消为 0。
 * 3、最终只剩那个落单的数。无需哈希表，天然满足 O(1) 空间要求。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，一次遍历
 * 空间复杂度：O(1)，仅一个累加变量
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
  let acc = 0;
  for (const x of nums) acc ^= x;
  return acc;
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

  eq('nums=[2,2,1]', singleNumber([2, 2, 1]), 1);
  eq('nums=[4,1,2,1,2]', singleNumber([4, 1, 2, 1, 2]), 4);
  eq('nums=[7] 单元素', singleNumber([7]), 7);
  eq('含负数 [-3,-3,0]', singleNumber([-3, -3, 0]), 0);
  eq('落单值在末尾 [-1,-1,9]', singleNumber([-1, -1, 9]), 9);

  console.log(`[136-只出现一次的数字] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { singleNumber };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
