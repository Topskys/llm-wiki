/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 10-回溯
 * ------------------------------------------------------------
 * 题号：39
 * 题目：组合总和（Combination Sum）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/combination-sum/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个不含重复数字的整数数组 candidates 和一个目标整数 target ，
 * 找出 candidates 中可以使数字和为目标数 target 的所有不同组合，
 * 并以列表形式返回。你可以按任意顺序返回这些组合。
 * candidates 中的同一个数字可以无限制重复被选取（若一个数字可以
 * 通过多次选取凑成 target，则返回该数字组成的组合）。
 * 只要组合内每个数字被选取的次数不同，则视为不同的组合。
 *
 * 【示例】
 * 输入：candidates = [2,3,6,7], target = 7
 * 输出：[[2,2,3],[7]]
 * 解释：2+2+3 = 7，7 = 7；2 可重复使用，故 [2,2,3] 合法。
 *
 * 输入：candidates = [2,3,5], target = 8
 * 输出：[[2,2,2,2],[2,3,3],[3,5]]
 *
 * 输入：candidates = [2], target = 1
 * 输出：[]
 * 解释：最小组合元素已大于目标，无解。
 *
 * 【提示】
 * 1 <= candidates.length <= 30
 * 2 <= candidates[i] <= 40
 * candidates 的所有元素互不相同
 * 1 <= target <= 40
 *
 * 【算法思路】
 * 1、组合去重：用 start 索引只向后选，避免同一集合以不同顺序重复出现。
 * 2、可重复选取的关键：递归时传 i 而不是 i + 1，表示当前数字之后仍可继续被选。
 * 3、选择-递归-撤销：push arr[i] 并累加 sum，递归 backtrack(i, sum)，返回后 pop。
 * 4、收集条件：sum === target 时把 path 快照入结果集。
 * 5、剪枝要点：先升序排序，一旦 sum + arr[i] > target 直接 break 整层
 *    （后面的候选更大，同层再试也无意义）。
 *
 * 【复杂度】
 * 时间复杂度：O(N^T)，N 为候选数个数，T = target/min 为递归深度上限
 * 空间复杂度：O(T)，递归栈与 path（不计输出）
 * ============================================================
 */

/**
 * 求和为 target 的全部组合（元素可重复选取）
 * @param {number[]} candidates - 互不相同的正整数数组
 * @param {number} target - 目标和
 * @return {number[][]} 所有不同组合
 */
function combinationSum(candidates, target) {
  const res = [];
  if (!Array.isArray(candidates) || candidates.length === 0) return res;
  if (!(target > 0)) return res; // target <= 0 时（元素均为正数）不存在合法组合
  const arr = candidates.slice().sort((a, b) => a - b); // 排序以支持 break 剪枝
  const n = arr.length;
  const path = [];

  /**
   * 回溯主体
   * @param {number} start - 本层可选的最小下标（传 i 即允许重复选自身）
   * @param {number} sum - 当前 path 的元素和
   */
  const backtrack = (start, sum) => {
    if (sum === target) {
      res.push(path.slice()); // 命中目标，收集快照
      return;
    }
    for (let i = start; i < n; i++) {
      if (sum + arr[i] > target) break; // 已排序，后续更大，直接剪掉整层
      path.push(arr[i]);          // 选择
      backtrack(i, sum + arr[i]); // 递归：start 传 i，允许重复选取
      path.pop();                 // 撤销
    }
  };

  backtrack(0, 0);
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
      console.error(`✗ ${label}`);
      console.error(`  期望: ${JSON.stringify(expected)}`);
      console.error(`  实际: ${JSON.stringify(actual)}`);
    }
  };
  // 组合顺序不唯一：内层（组合内元素）与外层（组合之间）都排序后再比较
  const norm = (list) => list.map((c) => c.slice().sort((a, b) => a - b))
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  eq('示例1 [2,3,6,7] target=7', norm(combinationSum([2, 3, 6, 7], 7)),
    norm([[2, 2, 3], [7]]));
  eq('示例2 [2,3,5] target=8', norm(combinationSum([2, 3, 5], 8)),
    norm([[2, 2, 2, 2], [2, 3, 3], [3, 5]]));
  eq('示例3 无解返回 []', combinationSum([2], 1), []);
  eq('乱序输入结果一致', norm(combinationSum([7, 3, 2, 6], 7)),
    norm([[2, 2, 3], [7]]));
  eq('单元素整除 target', norm(combinationSum([3], 9)), norm([[3, 3, 3]]));
  eq('单元素不整除无解', combinationSum([4], 9), []);
  eq('空候选数组', combinationSum([], 5), []);
  eq('target=0 无解（元素均 >=2）', combinationSum([2, 3], 0), []);
  eq('组合内和均等于 target', (() => {
    const r = combinationSum([2, 3, 5], 10);
    return r.every((c) => c.reduce((s, x) => s + x, 0) === 10);
  })(), true);
  eq('组合无重复', (() => {
    const r = combinationSum([2, 3, 5], 10);
    return new Set(r.map((c) => c.join(','))).size;
  })(), combinationSum([2, 3, 5], 10).length);
  eq('入参未被修改', (() => {
    const a = [3, 1, 2];
    combinationSum(a, 4);
    return JSON.stringify(a);
  })(), JSON.stringify([3, 1, 2]));

  console.log(`[39-组合总和] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { combinationSum };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
