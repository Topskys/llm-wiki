/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：124
 * 题目：二叉树中的最大路径和（Binary Tree Maximum Path Sum）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/binary-tree-maximum-path-sum/
 * ------------------------------------------------------------
 * 【题目描述】
 * 二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。
 * 同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。
 * 路径和 是路径中各节点值的总和。
 * 给你一个二叉树的根节点 root ，返回其 最大路径和 。
 *
 * 【示例】
 * 输入：root = [1,2,3]
 * 输出：6
 * 解释：最优路径是 2 -> 1 -> 3，路径和为 2 + 1 + 3 = 6。
 *
 * 输入：root = [-10,9,20,null,null,15,7]
 * 输出：42
 * 解释：最优路径是 15 -> 20 -> 7，路径和为 15 + 20 + 7 = 42。
 *
 * 【提示】
 * 树中节点数目范围是 [1, 3 * 10^4]
 * -1000 <= Node.val <= 1000
 *
 * 【算法思路】
 * 1、递归计算以每个节点为「端点」的最大贡献值：节点值 + max(左贡献, 右贡献)，贡献为负则舍弃（取 0）。
 * 2、在递归过程中，对每个节点更新全局最大路径和：节点值 + 左贡献 + 右贡献（形成经过该节点的「拱形」路径）。
 * 3、注意区分「贡献值」（只能走一边，向上传递）与「路径和」（可以走两边，全局更新）。
 * 4、返回值 = node.val + max(leftGain, rightGain)，但更新答案时用 node.val + leftGain + rightGain。
 * 5、全局答案初始化为负无穷，处理全负值树的情况。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个节点访问一次
 * 空间复杂度：O(h)，递归栈深度（最坏 O(n)）
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
 * @return {number}
 */
function maxPathSum(root) {
  let ans = -Infinity;
  const dfs = (node) => {
    if (!node) return 0;
    // 左/右子树的最大贡献，负值则舍弃（取 0）
    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);
    // 经过当前节点的「拱形」路径和，更新全局答案
    ans = Math.max(ans, node.val + leftGain + rightGain);
    // 返回以当前节点为端点的最大贡献（只能走一边）
    return node.val + Math.max(leftGain, rightGain);
  };
  dfs(root);
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

  eq('root=[1,2,3]', maxPathSum(buildTree([1, 2, 3])), 6);
  eq('root=[-10,9,20,null,null,15,7]', maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7])), 42);
  eq('root=[-3] 单负节点', maxPathSum(buildTree([-3])), -3);
  eq('root=[2,-1] 含负子树', maxPathSum(buildTree([2, -1])), 2);
  eq('root=[1,2,null,3] 左链', maxPathSum(buildTree([1, 2, null, 3])), 6);
  eq('root=[-1,-2,-3] 全负', maxPathSum(buildTree([-1, -2, -3])), -1);
  eq('root=[5,4,8,11,null,13,4,7,2,null,null,null,1] 经典示例', maxPathSum(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1])), 48);

  console.log(`[124-二叉树中的最大路径和] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, maxPathSum };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}