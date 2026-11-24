/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：105
 * 题目：从前序与中序遍历序列构造二叉树
 * 难度：中等
 * 链接：https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历，
 * inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
 *
 * 【示例】
 * 输入：preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * 输出：[3,9,20,null,null,15,7]
 *
 * 【提示】
 * 1 <= preorder.length <= 3000
 * inorder.length == preorder.length
 * -3000 <= preorder[i], inorder[i] <= 3000
 * preorder 和 inorder 均无重复元素
 * inorder 均出现在 preorder 中
 *
 * 【算法思路】
 * 1、先序遍历首元素即为根节点；在中序遍历中找到根节点位置，左侧为左子树中序，右侧为右子树中序。
 * 2、用哈希表记录中序遍历值到下标的映射，O(1) 定位根在中序中的位置。
 * 3、递归函数 build(preL, preR, inL, inR) 处理前序区间 [preL, preR) 与中序区间 [inL, inR)：
 *    - 根值为 preorder[preL]，在中序中位置为 idx，左子树大小 leftSize = idx - inL。
 *    - 左子树：前序 [preL+1, preL+1+leftSize)，中序 [inL, idx)；右子树对应剩余区间。
 * 4、区间为空返回 null。总时间 O(n)，空间 O(n) 哈希表 + O(h) 递归栈。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个节点构造一次
 * 空间复杂度：O(n)，哈希表 + 递归栈
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode|null}
 */
function buildTreeFromPreIn(preorder, inorder) {
  const idxMap = new Map();
  for (let i = 0; i < inorder.length; i++) idxMap.set(inorder[i], i);
  const build = (preL, preR, inL, inR) => {
    if (preL >= preR) return null;
    const rootVal = preorder[preL];
    const root = new TreeNode(rootVal);
    const idx = idxMap.get(rootVal);
    const leftSize = idx - inL;
    root.left = build(preL + 1, preL + 1 + leftSize, inL, idx);
    root.right = build(preL + 1 + leftSize, preR, idx + 1, inR);
    return root;
  };
  return build(0, preorder.length, 0, inorder.length);
}

/**
 * 验证构造树是否与给定的前序/中序一致（仅供测试）
 * @param {TreeNode|null} root
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {boolean}
 */
function verifyTree(root, preorder, inorder) {
  const getPre = (node, out = []) => { if (!node) return; out.push(node.val); getPre(node.left, out); getPre(node.right, out); };
  const getIn = (node, out = []) => { if (!node) return; getIn(node.left, out); out.push(node.val); getIn(node.right, out); };
  const pre = []; getPre(root, pre);
  const ino = []; getIn(root, ino);
  return JSON.stringify(pre) === JSON.stringify(preorder) &&
         JSON.stringify(ino) === JSON.stringify(inorder);
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

  const t1 = buildTreeFromPreIn([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
  eq('示例 [3,9,20,15,7] / [9,3,15,20,7]', verifyTree(t1, [3, 9, 20, 15, 7], [9, 3, 15, 20, 7]), true);

  const t2 = buildTreeFromPreIn([-1], [-1]);
  eq('单节点', verifyTree(t2, [-1], [-1]), true);

  const t3 = buildTreeFromPreIn([1, 2, 3], [2, 1, 3]);
  eq('左子树', verifyTree(t3, [1, 2, 3], [2, 1, 3]), true);

  const t4 = buildTreeFromPreIn([1, 2, 3], [1, 3, 2]);
  eq('右子树', verifyTree(t4, [1, 2, 3], [1, 3, 2]), true);

  const t5 = buildTreeFromPreIn([1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7]);
  eq('完整树', verifyTree(t5, [1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7]), true);

  console.log(`[105-从前序与中序遍历序列构造二叉树] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, buildTreeFromPreIn };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}