/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 02-双指针
 * ------------------------------------------------------------
 * 题号：42
 * 题目：接雨水（Trapping Rain Water）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/trapping-rain-water/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，
 * 计算按此排列的柱子，下雨之后能接多少雨水。
 *
 * 【示例】
 * 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
 * 输出：6
 *
 * 【提示】
 * n == height.length
 * 1 <= n <= 2 * 10^4
 * 0 <= height[i] <= 10^5
 *
 * 【算法思路】
 * 1、双指针左右逼近，维护 leftMax/rightMax 分别为左右已扫过的最大高度。
 * 2、当前格积水量 = min(leftMax, rightMax) - height[i]，取较小一端结算。
 * 3、rightMax 是右侧真实最大值的下界，故 min(leftMax, rightMax) 必等于较小者。
 * 4、每步移动较小一侧指针，保证结算时已知该侧的真实最大高度。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  let l = 0;
  let r = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= leftMax) {
        leftMax = height[l];
      } else {
        water += leftMax - height[l];
      }
      l++;
    } else {
      if (height[r] >= rightMax) {
        rightMax = height[r];
      } else {
        water += rightMax - height[r];
      }
      r--;
    }
  }
  return water;
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

  eq('基本示例', trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
  eq('单柱', trap([5]), 0);
  eq('两柱', trap([3, 2]), 0);
  eq('平底', trap([2, 0, 2]), 2);
  eq('凹槽', trap([3, 0, 0, 3]), 6);
  eq('递增', trap([1, 2, 3, 4]), 0);
  eq('递减', trap([4, 3, 2, 1]), 0);
  eq('全零', trap([0, 0, 0]), 0);
  eq('复杂凹槽', trap([4, 2, 0, 3, 2, 5]), 9);
  eq('左高右低', trap([5, 2, 1, 2]), 1);
  eq('右高左低', trap([2, 1, 2, 5]), 1);
  eq('多凹槽', trap([2, 0, 2, 0, 2]), 4);
  eq('单格凹槽', trap([1, 0, 1]), 1);
  eq('无柱可接', trap([1, 1, 1]), 0);
  eq('大数范围', trap([100000, 0, 100000]), 100000);

  console.log(`[42-接雨水] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { trap };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}