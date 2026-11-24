/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 12-栈
 * ------------------------------------------------------------
 * 题号：84
 * 题目：柱状图中最大的矩形（Largest Rectangle in Histogram）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/largest-rectangle-in-histogram/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。
 * 每个柱子彼此相邻，且宽度为 1 。
 * 求在该柱状图中，能够勾勒出来的矩形的最大面积。
 *
 * 【示例】
 * 输入：heights = [2,1,5,6,2,3]
 * 输出：10
 * 解释：最大的矩形以高度 5 从下标 2 延伸到下标 3，
 *      宽 2 × 高 5 = 10（即图中 5 与 6 两根柱子受 5 限制形成的矩形）。
 *
 * 输入：heights = [2,4]
 * 输出：4
 *
 * 【提示】
 * 1 <= heights.length <= 10^5
 * 0 <= heights[i] <= 10^4
 *
 * 【算法思路】
 * 1、枚举「以第 i 根柱子为高」时能向左右扩展的最大宽度：边界是左右两侧第一根比它矮的柱子，面积 = heights[i] × (right - left - 1)。
 * 2、用单调递增栈（存下标）一次求出所有「左侧第一根更矮」与「右侧第一根更矮」：
 * 3、遍历到 i 时，若 heights[栈顶] >= heights[i]，说明 i 就是栈顶元素右侧第一根更矮的柱子，弹出栈顶 j。
 * 4、此时新的栈顶就是 j 左侧第一根更矮的柱子（栈内递增保证），于是宽 = i - 栈顶 - 1，直接结算面积。
 * 5、末尾补一个高度 0 的虚拟哨兵，把栈内剩余元素全部结算；栈空时左边界视为 -1。
 * 6、出栈条件用 >= 而非 >：等高柱会先结算左边那根，宽度算少但不会漏掉最大面积（等高情形下最右那根会拿到完整宽度）。
 * 7、每根柱子进出栈各一次，故 O(n)。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个下标进出栈各一次
 * 空间复杂度：O(n)，栈最坏存全部下标（高度严格递增时）
 * ============================================================
 */

/**
 * @param {number[]} heights
 * @return {number}
 */
function largestRectangleArea(heights) {
  const n = heights.length;
  const stack = [];
  let best = 0;
  for (let i = 0; i <= n; i++) {
    const cur = i === n ? 0 : heights[i]; // 末尾哨兵，清空栈
    while (stack.length && heights[stack[stack.length - 1]] >= cur) {
      const h = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] : -1;
      const area = h * (i - left - 1);
      if (area > best) best = area;
    }
    if (i < n) stack.push(i);
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

  eq('heights=[2,1,5,6,2,3]', largestRectangleArea([2, 1, 5, 6, 2, 3]), 10);
  eq('heights=[2,4]', largestRectangleArea([2, 4]), 4);
  eq('heights=[1000] 单柱', largestRectangleArea([1000]), 1000);
  eq('heights=[0] 高度为 0', largestRectangleArea([0]), 0);
  eq('heights=[1,1,1] 全等高', largestRectangleArea([1, 1, 1]), 3);
  eq('heights=[2,1,2] 中间最矮撑满宽', largestRectangleArea([2, 1, 2]), 3);
  eq('heights=[5,4,3,2,1] 递减', largestRectangleArea([5, 4, 3, 2, 1]), 9);
  eq('heights=[1,2,3,4,5] 递增', largestRectangleArea([1, 2, 3, 4, 5]), 9);
  eq('heights=[0,0] 全 0', largestRectangleArea([0, 0]), 0);
  eq('heights=[2,1,5,6,2,3,1] 尾部矮柱', largestRectangleArea([2, 1, 5, 6, 2, 3, 1]), 10);
  eq('heights=[3,6,2,1,5,4] 中段高台', largestRectangleArea([3, 6, 2, 1, 5, 4]), 8);
  eq('heights=[] 空数组兜底', largestRectangleArea([]), 0);

  console.log(`[84-柱状图中最大的矩形] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { largestRectangleArea };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
