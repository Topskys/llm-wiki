/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：104
 * 题目：二叉树的最大深度（Maximum Depth of Binary Tree）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/maximum-depth-of-binary-tree/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个二叉树 root，返回其最大深度。
 * 最大深度是指从根节点到最远叶子节点的最长路径上的节点数。
 * 叶子节点是指没有子节点的节点，只有根节点时深度为 1。
 * 根节点为空时深度定义为 0。
 *
 * 【示例】
 * 输入：root = [3,9,20,null,null,15,7]
 * 输出：3
 * 解释：根节点 3 的左子树 9 深度为 2（含根），
 * 右子树 20 下面还有 15 和 7，路径 3 -> 20 -> 15 共 3 个节点，
 * 因此最大深度为 3。
 *
 * 输入：root = [1,null,2]
 * 输出：2
 * 解释：最长路径 1 -> 2 上有 2 个节点。
 *
 * 【提示】
 * 树中节点的数量在 [0, 10^4] 区间内
 * -100 <= Node.val <= 100
 *
 * 【算法思路】
 * 1、后序递归：一棵树的最大深度等于左右子树最大深度中的较大者加 1，空树返回 0，这个递推式在叶子处自然收敛。
 * 2、正确性：任何一条到叶子的根路径都必然先经过左子树或右子树之一，所以取两侧深度的最大值再补上根本节点即为全局最长。
 * 3、关键细节：必须用 max 而不是把两侧深度相加，相加会把两条分支错误地串成一条不存在的路径。
 * 4、递归自底向上返回，无需额外状态。
 * 5、也可写成 BFS 层序计数：每处理完一整层深度加一，层数即深度。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个节点访问一次
 * 空间复杂度：O(n)，最坏（退化成链）递归栈深为 n，平衡时为 O(log n)
 * ============================================================
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * 按 LeetCode 层序数组（含 null 占位）构建二叉树。
 * @param {Array<number|null>} arr 层序数组，例如 [3,9,20,null,null,15,7]
 * @return {TreeNode|null} 根节点
 */
function buildTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length && queue.length > 0) {
    const node = queue.shift();
    const lv = arr[i++];
    if (lv !== null && lv !== undefined) {
      node.left = new TreeNode(lv);
      queue.push(node.left);
    }
    if (i >= arr.length) break;
    const rv = arr[i++];
    if (rv !== null && rv !== undefined) {
      node.right = new TreeNode(rv);
      queue.push(node.right);
    }
  }
  return root;
}

/**
 * 层序遍历二叉树并输出 LeetCode 风格数组（去掉尾部 null）。
 * @param {TreeNode|null} root 根节点
 * @return {Array<number|null>} 层序数组
 */
function treeToArray(root) {
  if (!root) return [];
  const out = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === null) {
      out.push(null);
      continue;
    }
    out.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
}

/**
 * 104 二叉树的最大深度：后序递归取两侧较大值加一。
 * @param {TreeNode|null} root 二叉树根节点
 * @return {number} 根到最远叶子的节点数
 */
function maxDepth(root) {
  if (root === null) return 0;
  const left = maxDepth(root.left);
  const right = maxDepth(root.right);
  return Math.max(left, right) + 1;
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

  eq('示例 [3,9,20,null,null,15,7]', maxDepth(buildTree([3, 9, 20, null, null, 15, 7])), 3);
  eq('空树 []', maxDepth(buildTree([])), 0);
  eq('单节点 [1]', maxDepth(buildTree([1])), 1);
  eq('只有左子链 [1,2,null,3,null,4]', maxDepth(buildTree([1, 2, null, 3, null, 4])), 4);
  eq('右斜链 [1,null,2,null,3]', maxDepth(buildTree([1, null, 2, null, 3])), 3);
  eq('满二叉树 [1,2,3,4,5,6,7]', maxDepth(buildTree([1, 2, 3, 4, 5, 6, 7])), 3);

  console.log(`[104-二叉树的最大深度] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, maxDepth };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
