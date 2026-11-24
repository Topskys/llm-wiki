/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 10-回溯
 * ------------------------------------------------------------
 * 题号：78
 * 题目：子集（Subsets）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/subsets/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums ，数组中的元素互不相同。
 * 返回该数组所有可能的子集（幂集）。
 * 解集不能包含重复的子集，你可以按任意顺序返回解集。
 * 与「组合」类题不同：子集不要求长度固定，每一层递归节点本身
 * 都是一个合法答案，而不是只在叶子处收集。
 *
 * 【示例】
 * 输入：nums = [1,2,3]
 * 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 * 解释：3 个元素共 2^3 = 8 个子集，包含空集与自身，顺序任意。
 *
 * 输入：nums = [0]
 * 输出：[[],[0]]
 *
 * 【提示】
 * 1 <= nums.length <= 10
 * -10 <= nums[i] <= 10
 * nums 中的所有元素互不相同
 *
 * 【算法思路】
 * 1、收集时机：进入 backtrack(start) 就先把 path 快照加入结果——
 *    每个递归节点都是一个子集，无需等到叶子。
 * 2、选择：从 i = start 起遍历选择列表，push nums[i]。
 * 3、递归：调用 backtrack(i + 1)，下一层只能选更靠后的元素。
 * 4、撤销：pop 掉刚选的 nums[i]，回到未选状态继续同层下一个 i。
 * 5、去重要点：start 只递增，天然排除 [1,2] 与 [2,1] 这类重复子集；
 *    空集由初始 path = [] 的那次调用自然收集。
 *
 * 【复杂度】
 * 时间复杂度：O(n * 2^n)，共 2^n 个子集，每个拷贝 O(n)
 * 空间复杂度：O(n)，递归栈与 path（不计输出）
 * ============================================================
 */

/**
 * 求互不相同元素数组的幂集（start 索引递进回溯）
 * @param {number[]} nums - 元素互不相同的数组
 * @return {number[][]} 所有子集（含空集）
 */
function subsets(nums) {
  const res = [];
  if (!Array.isArray(nums)) return res;
  const n = nums.length;
  const path = [];

  // 回溯主体：start 为本层可选的最小下标
  const backtrack = (start) => {
    res.push(path.slice()); // 每个递归节点都是一个子集，直接收集
    for (let i = start; i < n; i++) {
      path.push(nums[i]); // 选择
      backtrack(i + 1);   // 递归：下一层只能往后选，避免重复子集
      path.pop();         // 撤销
    }
  };

  backtrack(0);
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
  // 解集顺序不唯一：先把每个子集内部升序，再按序列化结果排序后比较
  const norm = (list) => list.map((s) => s.slice().sort((a, b) => a - b))
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  eq('nums=[1,2,3] 幂集 8 个', norm(subsets([1, 2, 3])), norm([
    [], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]
  ]));
  eq('nums=[0]', norm(subsets([0])), norm([[], [0]]));
  eq('nums=[] 只含空集', subsets([]), [[]]);
  eq('数量满足 2^n（n=4）', subsets([1, 2, 3, 4]).length, 16);
  eq('含负数 [-1,2]', norm(subsets([-1, 2])), norm([[], [-1], [2], [-1, 2]]));
  eq('无重复子集', (() => {
    const set = new Set(subsets([1, 2, 3, 4]).map((s) => s.join(',')));
    return set.size;
  })(), 16);
  eq('结果包含空集与全集', (() => {
    const r = subsets([1, 2, 3]);
    return [r.some((s) => s.length === 0), r.some((s) => s.length === 3)];
  })(), [true, true]);
  eq('子集内元素保持原数组相对顺序', subsets([3, 1, 2]).some((s) => s.join(',') === '3,1,2'), true);
  eq('入参未被修改', (() => {
    const a = [1, 2];
    subsets(a);
    return JSON.stringify(a);
  })(), JSON.stringify([1, 2]));

  console.log(`[78-子集] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { subsets };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
