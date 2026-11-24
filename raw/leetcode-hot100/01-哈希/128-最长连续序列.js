/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 01-哈希
 * ------------------------------------------------------------
 * 题号：128
 * 题目：最长连续序列（Longest Consecutive Sequence）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/longest-consecutive-sequence/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
 * 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。
 *
 * 【示例】
 * 输入：nums = [100,4,200,1,3,2]
 * 输出：4
 * 解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
 *
 * 【提示】
 * 0 <= nums.length <= 10^5
 * -10^9 <= nums[i] <= 10^9
 *
 * 【算法思路】
 * 1、全部数字入 Set 去重，实现 O(1) 查询。
 * 2、只从「序列起点」开始向后计数：若 num-1 不在 Set 中，说明 num 是某段连续序列的起点。
 * 3、从该起点向后探测 num+1, num+2... 直到断点，记录序列长度。
 * 4、每段序列有唯一起点，每个数至多被内层探测一次，整体严格 O(n)。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个数至多被访问常数次
 * 空间复杂度：O(n)，Set 存储
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const num of set) {
    // 只从序列起点开始计数
    if (!set.has(num - 1)) {
      let cur = num;
      let len = 1;
      while (set.has(cur + 1)) {
        cur++;
        len++;
      }
      best = Math.max(best, len);
    }
  }
  return best;
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

  eq('nums=[100,4,200,1,3,2]', longestConsecutive([100, 4, 200, 1, 3, 2]), 4);
  eq('nums=[0,3,7,2,5,8,4,6,0,1]', longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
  eq('空数组', longestConsecutive([]), 0);
  eq('单元素', longestConsecutive([5]), 1);
  eq('全重复', longestConsecutive([1, 1, 1, 1]), 1);
  eq('含负数', longestConsecutive([-1, 0, 1, 2]), 4);
  eq('±10^9 相邻', longestConsecutive([-1000000000, -999999999]), 2);
  eq('±10^9 不相邻', longestConsecutive([-1000000000, 1000000000]), 1);
  eq('逆序连续', longestConsecutive([4, 3, 2, 1]), 4);
  eq('多段序列', longestConsecutive([1, 2, 5, 6, 7, 10]), 3);

  console.log(`[128-最长连续序列] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { longestConsecutive };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}