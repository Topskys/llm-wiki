/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：236
 * 题目：二叉树的最近公共祖先（Lowest Common Ancestor of a Binary Tree）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
 * 最近公共祖先的定义为：「对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，
 * 满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。」
 *
 * 【示例】
 * 输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 * 输出：3
 *
 * 【提示】
 * 树中节点数目在范围 [2, 10^5] 内
 * -10^9 <= Node.val <= 10^9
 * 所有 Node.val 互不相同
 * p != q
 * p 和 q 均存在于树中
 *
 * 【算法思路】
 * 1、后序递归：函数返回当前子树中找到的 p 或 q 节点，或它们的 LCA。
 * 2、若当前节点为 null 或等于 p 或 q，直接返回当前节点。
 * 3、递归左右子树，得到 leftRes 和 rightRes。
 * 4、若 leftRes 和 rightRes 都非空，说明 p、q 分居左右，当前节点即为 LCA，直接返回。
 * 5、若只有一侧非空，说明两节点都在该侧，返回非空的那侧结果向上传递。
 * 6、题目保证 p、q 存在，无需额外验证。
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
 * 在树中查找值为 val 的节点（仅供测试）
 * @param {TreeNode|null} root
 * @param {number} val
 * @return {TreeNode|null}
 */
function findNode(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) || findNode(root.right, val);
}

/**
 * @param {TreeNode|null} root
 * @param {TreeNode|null} p
 * @param {TreeNode|null} q
 * @return {TreeNode|null}
 */
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
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

  const t1 = buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
  const p1 = findNode(t1, 5);
  const q1 = findNode(t1, 1);
  eq('示例 p=5 q=1', lowestCommonAncestor(t1, p1, q1)?.val, 3);

  const p2 = findNode(t1, 5);
  const q2 = findNode(t1, 4);
  eq('p=5 q=4 (祖先关系)', lowestCommonAncestor(t1, p2, q2)?.val, 5);

  const t3 = buildTree([1, 2]);
  const p3 = findNode(t3, 1);
  const q3 = findNode(t3, 2);
  eq('两节点树 p=1 q=2', lowestCommonAncestor(t3, p3, q3)?.val, 1);

  const t4 = buildTree([1, 2, 3, 4, 5]);
  const p4 = findNode(t4, 4);
  const q4 = findNode(t4, 5);
  eq('p=4 q=5 兄弟节点', lowestCommonAncestor(t4, p4, q4)?.val, 2);

  const t5 = buildTree([1, 2, null, 3, null, 4]);
  const p5 = findNode(t5, 3);
  const q5 = findNode(t5, 4);
  eq('链状树', lowestCommonAncestor(t5, p5, q5)?.val, 3);

  console.log(`[236-二叉树的最近公共祖先] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, lowestCommonAncestor, findNode };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}