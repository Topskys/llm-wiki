/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 14-贪心
 * ------------------------------------------------------------
 * 题号：55
 * 题目：跳跃游戏（Jump Game）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/jump-game/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个非负整数数组 nums ，你最初位于数组的 第一个下标 。
 * 数组中的每个元素代表你在该位置可以跳跃的最大长度。
 * 判断你是否能够到达最后一个下标，如果可以，返回 true ；否则返回 false 。
 *
 * 【示例】
 * 输入：nums = [2,3,1,1,4]
 * 输出：true
 * 解释：可以先跳 1 步（下标 0 -> 1），再跳 3 步（下标 1 -> 4）到达最后下标。
 *
 * 输入：nums = [3,2,1,0,4]
 * 输出：false
 * 解释：无论怎么跳，总会到达下标 3，其跳跃长度为 0，无法继续前进。
 *
 * 【提示】
 * 1 <= nums.length <= 10^4
 * 0 <= nums[i] <= 10^5
 *
 * 【算法思路】
 * 1、只维护「当前能到达的最远下标 farthest」。
 * 2、从左往右扫描，若某个下标 i 已超过 farthest，说明存在不可跨越的断点，直接返回 false。
 * 3、否则用 i + nums[i] 尝试推远 farthest，一旦 farthest >= n-1 即可提前返回 true。
 * 4、贪心依据：可达下标集合必然是一个前缀 —— 若能到 j，则中间每个位置都能到（跳跃长度取「最多」，可少跳），因此无需记录具体路径，只比较最远边界即可。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，最坏一次遍历
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {boolean}
 */
function canJump(nums) {
  const n = nums.length;
  let farthest = 0;
  for (let i = 0; i < n; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= n - 1) return true;
  }
  return true;
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

  eq('nums=[2,3,1,1,4]', canJump([2, 3, 1, 1, 4]), true);
  eq('nums=[3,2,1,0,4]', canJump([3, 2, 1, 0, 4]), false);
  eq('nums=[0] 起点即终点', canJump([0]), true);
  eq('nums=[0,1] 起点无法动', canJump([0, 1]), false);
  eq('nums=[1,0,1,0] 交替', canJump([1, 0, 1, 0]), false);
  eq('nums=[2,0,0] 刚好跨过 0', canJump([2, 0, 0]), true);
  eq('nums=[100] 超长跳跃力', canJump([100]), true);
  eq('nums=[0,2,3] 首元素为 0', canJump([0, 2, 3]), false);

  console.log(`[55-跳跃游戏] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { canJump };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
