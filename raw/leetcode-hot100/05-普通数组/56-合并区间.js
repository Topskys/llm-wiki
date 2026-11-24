/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 05-普通数组
 * ------------------------------------------------------------
 * 题号：56
 * 题目：合并区间（Merge Intervals）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/merge-intervals/
 * ------------------------------------------------------------
 * 【题目描述】
 * 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。
 * 请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。
 *
 * 【示例】
 * 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
 * 输出：[[1,6],[8,10],[15,18]]
 * 解释：区间 [1,3] 和 [2,6] 重叠，将它们合并为 [1,6]。
 *
 * 【提示】
 * 1 <= intervals.length <= 10^4
 * intervals[i].length == 2
 * 0 <= starti <= endi <= 10^4
 *
 * 【算法思路】
 * 1、按区间左端点排序。
 * 2、遍历排序后的区间，若当前区间左端点 <= 结果中最后一个区间的右端点，则合并（更新右端点为较大值）。
 * 3、否则将当前区间加入结果。
 *
 * 【复杂度】
 * 时间复杂度：O(n log n)，排序
 * 空间复杂度：O(log n)，排序栈空间（不计输出）
 * ============================================================
 */

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1];
    const [s, e] = intervals[i];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      res.push([s, e]);
    }
  }
  return res;
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

  eq('基本示例', merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
  eq('完全包含', merge([[1, 4], [4, 5]]), [[1, 5]]);
  eq('空数组', merge([]), []);
  eq('单区间', merge([[1, 2]]), [[1, 2]]);
  eq('不重叠', merge([[1, 2], [3, 4]]), [[1, 2], [3, 4]]);
  eq('嵌套', merge([[1, 10], [2, 3]]), [[1, 10]]);
  eq('全重叠', merge([[1, 4], [2, 5], [3, 6]]), [[1, 6]]);

  console.log(`[56-合并区间] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { merge };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}