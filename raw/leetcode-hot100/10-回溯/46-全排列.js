/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 10-回溯
 * ------------------------------------------------------------
 * 题号：46
 * 题目：全排列（Permutations）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/permutations/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个不含重复数字的数组 nums ，返回其所有可能的全排列。
 * 你可以按任意顺序返回答案。
 * 排列是「有序」的选择结果：[1,2] 与 [2,1] 是两个不同的排列，
 * 因此每一层都要从「还没被用过」的数字里挑一个。
 *
 * 【示例】
 * 输入：nums = [1,2,3]
 * 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 * 解释：3 个不同数字共 3! = 6 种排列，顺序任意均可。
 *
 * 输入：nums = [0,1]
 * 输出：[[0,1],[1,0]]
 *
 * 输入：nums = [1]
 * 输出：[[1]]
 *
 * 【提示】
 * 1 <= nums.length <= 6
 * -10 <= nums[i] <= 10
 * nums 中的所有整数互不相同
 *
 * 【算法思路】
 * 1、三要素：路径 path 记录已选序列，选择列表是「本轮尚未使用」的元素，
 *    终止条件为 path.length === n。
 * 2、选择：遍历下标 i，跳过 used[i] 已为 true 的，否则 push nums[i] 并 used[i] = true。
 * 3、递归：进入下一层继续挑选剩余元素。
 * 4、撤销：pop 弹出并把 used[i] 复位 false，恢复现场供兄弟分支使用。
 * 5、去重要点：元素互不相同故无需去重；若含重复值，需先排序并在同层跳过相同值剪枝。
 *
 * 【复杂度】
 * 时间复杂度：O(n * n!)，共 n! 个排列，每个拷贝耗时 O(n)
 * 空间复杂度：O(n)，递归深度与 used 数组（不计输出）
 * ============================================================
 */

/**
 * 生成不含重复数字数组的全部排列（used 数组回溯）
 * @param {number[]} nums - 元素互不相同的数组
 * @return {number[][]} 所有全排列
 */
function permute(nums) {
  const res = [];
  if (!Array.isArray(nums) || nums.length === 0) return res; // 空输入无排列
  const n = nums.length;
  const used = new Array(n).fill(false);
  const path = [];

  // 回溯主体：在 path.length 这一层挑选一个尚未使用的元素
  const backtrack = () => {
    if (path.length === n) {
      res.push(path.slice()); // 必须拷贝快照，否则会被后续撤销改写
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue; // 该元素已在路径中
      // 选择
      path.push(nums[i]);
      used[i] = true;
      // 递归
      backtrack();
      // 撤销
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
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
  // 全排列的返回顺序不唯一：先把每个排列内部排序，再把外层排序后比较
  const norm = (list) => list.map((p) => p.slice().sort((a, b) => a - b))
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  eq('nums=[1,2,3] 六个排列', norm(permute([1, 2, 3])), norm([
    [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]
  ]));
  eq('nums=[0,1]', norm(permute([0, 1])), norm([[0, 1], [1, 0]]));
  eq('nums=[1] 单元素', norm(permute([1])), norm([[1]]));
  eq('nums=[] 空输入', permute([]), []);
  eq('元素个数正确 n=4 共 24 个', permute([1, 2, 3, 4]).length, 24);
  eq('含负数 [-1,2]', norm(permute([-1, 2])), norm([[-1, 2], [2, -1]]));
  eq('每个排列长度均为 n', permute([5, 6, 7]).every((p) => p.length === 3), true);
  eq('无重复排列', (() => {
    const set = new Set(permute([1, 2, 3, 4]).map((p) => p.join(',')));
    return set.size;
  })(), 24);
  eq('入参未被修改', (() => {
    const a = [1, 2, 3];
    permute(a);
    return JSON.stringify(a);
  })(), JSON.stringify([1, 2, 3]));

  console.log(`[46-全排列] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { permute };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
