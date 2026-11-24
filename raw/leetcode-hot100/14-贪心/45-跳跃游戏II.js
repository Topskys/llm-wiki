/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 14-贪心
 * ------------------------------------------------------------
 * 题号：45
 * 题目：跳跃游戏 II（Jump Game II）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/jump-game-ii/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个非负整数数组 nums ，你最初位于数组的第一个位置。
 * 数组中的每个元素代表你在该位置可以跳跃的最大长度。
 * 你的目标是使用最少的跳跃次数到达数组的最后一个位置。
 * 假设你总是可以到达数组的最后一个位置。
 *
 * 【示例】
 * 输入：nums = [2,3,1,1,4]
 * 输出：2
 * 解释：跳到下标 1（跳 1 步），再跳 3 步到达数组末尾，共跳 2 步，这是最少次数。
 *
 * 输入：nums = [2,3,0,1,4]
 * 输出：2
 *
 * 【提示】
 * 1 <= nums.length <= 10^4
 * 0 <= nums[i] <= 1000
 * 题目保证可以到达 nums[n-1]
 *
 * 【算法思路】
 * 1、把跳跃看成 BFS 分层：一步能到的所有下标构成一层。
 * 2、维护当前层右边界 end 与本层内能伸出的最远位置 farthest。
 * 3、遍历 i（只到 n-2，避免多算一步）：用 i + nums[i] 推远 farthest。
 * 4、当 i == end 时说明本层已扫完，必须起跳一次（jumps++），并把 end 更新为 farthest。
 * 5、贪心依据：每一层内的点跳数相同，取该层可达的最远边界必然不劣于任何其它选择，因此「到边界才跳、跳到最远」得到的是最小跳数。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function jump(nums) {
  const n = nums.length;
  let jumps = 0;
  let end = 0;
  let farthest = 0;
  for (let i = 0; i < n - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === end) {
      jumps++;
      end = farthest;
    }
  }
  return jumps;
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

  eq('nums=[2,3,1,1,4]', jump([2, 3, 1, 1, 4]), 2);
  eq('nums=[2,3,0,1,4]', jump([2, 3, 0, 1, 4]), 2);
  eq('nums=[1,1,1,1] 每次只能跳 1', jump([1, 1, 1, 1]), 3);
  eq('nums=[0] 起点即终点', jump([0]), 0);
  eq('nums=[1] 单元素', jump([1]), 0);
  eq('nums=[3,1,1,1] 一步到位', jump([3, 1, 1, 1]), 1);
  eq('nums=[1,2] 最小跳跃', jump([1, 2]), 1);
  eq('nums=[2,1,1,1,4] 需 3 跳', jump([2, 1, 1, 1, 4]), 3);

  console.log(`[45-跳跃游戏II] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { jump };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
