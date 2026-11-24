/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：102
 * 题目：二叉树的层序遍历（Binary Tree Level Order Traversal）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/binary-tree-level-order-traversal/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你二叉树的根节点 root ，返回其节点值的 层序遍历结果 。
 * （即逐层从左到右访问所有节点，每层结果单独成一个数组）
 *
 * 【示例】
 * 输入：root = [3,9,20,null,null,15,7]
 * 输出：[[3],[9,20],[15,7]]
 *
 * 【提示】
 * 树中节点数目在范围 [0, 2000] 内
 * -1000 <= Node.val <= 1000
 *
 * 【算法思路】
 * 1、标准 BFS：用队列维护当前层的所有节点，每轮处理完队列内现有的 size 个节点即为一层。
 * 2、循环：while (queue.length) { 记录当前层大小 size，迭代 size 次出队并收集值，子节点入队 }。
 * 3、这种写法天然保证层内从左到右，层与层之间不混淆，无需额外存储深度。
 * 4、时间 O(n)，空间 O(w) 其中 w 为最大层宽（最坏 O(n)）。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个节点进出队一次
 * 空间复杂度：O(w)，队列最多存一层节点（最坏 O(n)）
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
 * @return {number[][]}
 */
function levelOrder(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
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

  eq('root=[3,9,20,null,null,15,7]', levelOrder(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]]);
  eq('root=[] 空树', levelOrder(buildTree([])), []);
  eq('root=[1] 单节点', levelOrder(buildTree([1])), [[1]]);
  eq('只有左子链 [1,2,null,3]', levelOrder(buildTree([1, 2, null, 3])), [[1], [2], [3]]);
  eq('只有右子链 [1,null,2,null,3]', levelOrder(buildTree([1, null, 2, null, 3])), [[1], [2], [3]]);
  eq('满二叉树 [1,2,3,4,5,6,7]', levelOrder(buildTree([1, 2, 3, 4, 5, 6, 7])), [[1], [2, 3], [4, 5, 6, 7]]);

  console.log(`[102-二叉树的层序遍历] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, levelOrder };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}