/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：230
 * 题目：二叉搜索树中第K小的元素（Kth Smallest Element in a BST）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/kth-smallest-element-in-a-bst/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 个最小元素（从 1 开始计数）。
 *
 * 【示例】
 * 输入：root = [3,1,4,null,2], k = 1
 * 输出：1
 *
 * 输入：root = [5,3,6,2,4,null,null,1], k = 3
 * 输出：3
 *
 * 【提示】
 * 树中节点数目在范围 [1, 10^4] 内
 * 1 <= k <= 树中节点总数
 * -10^4 <= Node.val <= 10^4
 *
 * 【算法思路】
 * 1、BST 的中序遍历即为升序序列，第 k 个访问到的节点即为答案。
 * 2、用显式栈迭代中序遍历，访问到节点时 count++，当 count == k 立即返回节点值，提前终止。
 * 3、不必遍历完整棵树，最多访问 k 个节点，平均 O(h + k)，h 为树高。
 *
 * 【复杂度】
 * 时间复杂度：O(h + k)，h 为树高，最坏 O(n)
 * 空间复杂度：O(h)，栈深
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
 * @param {number} k
 * @return {number}
 */
function kthSmallest(root, k) {
  const stack = [];
  let cur = root;
  let count = 0;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    count++;
    if (count === k) return cur.val;
    cur = cur.right;
  }
  return -1;
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

  eq('root=[3,1,4,null,2] k=1', kthSmallest(buildTree([3, 1, 4, null, 2]), 1), 1);
  eq('root=[5,3,6,2,4,null,null,1] k=3', kthSmallest(buildTree([5, 3, 6, 2, 4, null, null, 1]), 3), 3);
  eq('root=[1] k=1', kthSmallest(buildTree([1]), 1), 1);
  eq('root=[2,1,3] k=2', kthSmallest(buildTree([2, 1, 3]), 2), 2);
  eq('root=[10,5,15,1,7] k=4', kthSmallest(buildTree([10, 5, 15, 1, 7]), 4), 10);

  console.log(`[230-二叉搜索树中第K小的元素] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, kthSmallest };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}