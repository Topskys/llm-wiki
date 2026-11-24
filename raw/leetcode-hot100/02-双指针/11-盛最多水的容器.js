/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 02-双指针
 * ------------------------------------------------------------
 * 题号：11
 * 题目：盛最多水的容器（Container With Most Water）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/container-with-most-water/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。
 * 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
 * 返回容器可以储存的最大水量。
 *
 * 【示例】
 * 输入：height = [1,8,6,2,5,4,8,3,7]
 * 输出：49
 *
 * 【提示】
 * n == height.length
 * 2 <= n <= 10^5
 * 0 <= height[i] <= 10^4
 *
 * 【算法思路】
 * 1、双指针左右夹逼，初始左指针在 0、右指针在 n-1，此时宽度最大。
 * 2、容器面积 = min(height[l], height[r]) * (r - l)，由较矮的板决定。
 * 3、每步移动较矮一侧的指针：宽度必减，只有换短板才可能抬高高度，从而可能得到更大面积。
 * 4、移动较高一侧不可能得到更优解（宽度减小且高度上限不变），故可安全排除。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，左右指针共走 n 步
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  let l = 0;
  let r = height.length - 1;
  let best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) {
      l++;
    } else {
      r--;
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

  eq('基本示例', maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
  eq('两元素', maxArea([1, 1]), 1);
  eq('递增', maxArea([1, 2, 3, 4]), 4);
  eq('递减', maxArea([4, 3, 2, 1]), 4);
  eq('全零', maxArea([0, 0]), 0);
  eq('单高柱', maxArea([0, 100, 0]), 0);
  eq('两端高', maxArea([5, 1, 1, 5]), 15);
  eq('中间高', maxArea([1, 100, 1]), 2);
  eq('大数组', maxArea([10000, 1, 1, 10000]), 30000);

  console.log(`[11-盛最多水的容器] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { maxArea };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}