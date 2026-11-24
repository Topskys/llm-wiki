/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：437
 * 题目：路径总和 III（Path Sum III）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/path-sum-iii/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个二叉树的根节点 root 和一个整数 targetSum ，
 * 返回该树中节点值之和等于 targetSum 的 路径 的数目。
 * 路径不需要从根节点开始，也不需要在叶子节点结束，
 * 但路径方向必须是向下的（只能从父节点到子节点）。
 *
 * 【示例】
 * 输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
 * 输出：3
 *
 * 【提示】
 * 树中节点数目在范围 [0, 1000] 内
 * -10^9 <= Node.val <= 10^9
 * -1000 <= targetSum <= 1000
 *
 * 【算法思路】
 * 1、前缀和 + 哈希回溯。从根到当前节点的路径上维护前缀和计数 map。
 * 2、到达节点时，当前路径前缀和为 curSum，若 map 中存在 curSum - targetSum，
 *    说明从某个祖先到当前节点的路径和为 targetSum，计数加上该前缀和出现的次数。
 * 3、当前 curSum 入 map，递归左右子树，回溯时 curSum 计数 -1（删除 0 计数键）。
 * 4、初始 map[0] = 1 处理「从根到当前」刚好等于 targetSum 的情形。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个节点处理一次哈希操作
 * 空间复杂度：O(h)，哈希表大小 ≤ 树高（回溯保持路径前缀和）
 * ============================================================
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const v = arr[i++];
      if (v !== null) {
        node.left = new TreeNode(v);
        queue.push(node.left);
      }
    }
    if (i < arr.length) {
      const v = arr[i++];
      if (v !== null) {
        node.right = new TreeNode(v);
        queue.push(node.right);
      }
    }
  }
  return root;
}

function treeToArray(root) {
  if (!root) return [];
  const out = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) {
      out.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      out.push(null);
    }
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

/**
 * @param {TreeNode|null} root
 * @param {number} targetSum
 * @return {number}
 */
function pathSum(root, targetSum) {
  let ans = 0;
  const prefix = new Map();
  prefix.set(0, 1);
  const dfs = (node, curSum) => {
    if (!node) return;
    curSum += node.val;
    ans += prefix.get(curSum - targetSum) || 0;
    prefix.set(curSum, (prefix.get(curSum) || 0) + 1);
    dfs(node.left, curSum);
    dfs(node.right, curSum);
    prefix.set(curSum, prefix.get(curSum) - 1);
  };
  dfs(root, 0);
  return ans;
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

  eq('示例 target=8', pathSum(buildTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8), 3);
  eq('空树', pathSum(buildTree([]), 0), 0);
  eq('单节点 [1] target=1', pathSum(buildTree([1]), 1), 1);
  eq('单节点 [1] target=2', pathSum(buildTree([1]), 2), 0);
  eq('链状树 [1,2,null,3] target=3', pathSum(buildTree([1, 2, null, 3]), 3), 2);
  eq('负值树 [-1,-2,-3] target=-2 仅节点 -2 自身', pathSum(buildTree([-1, -2, -3]), -2), 1);
  eq('负值左链 [-1,-2,null,-3] target=-6 全路径', pathSum(buildTree([-1, -2, null, -3]), -6), 1);

  console.log(`[437-路径总和III] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, pathSum };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}