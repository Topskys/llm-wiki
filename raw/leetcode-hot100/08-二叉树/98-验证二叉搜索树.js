/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：98
 * 题目：验证二叉搜索树（Validate Binary Search Tree）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/validate-binary-search-tree/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。
 * 二叉搜索树定义：
 * 1. 节点的左子树只包含 小于 当前节点的数。
 * 2. 节点的右子树只包含 大于 当前节点的数。
 * 3. 所有左子树和右子树自身必须也是二叉搜索树。
 *
 * 【示例】
 * 输入：root = [2,1,3]
 * 输出：true
 *
 * 输入：root = [5,1,4,null,null,3,6]
 * 输出：false
 * 解释：根节点值为 5，但右子树节点 4 小于 5，违背 BST 定义。
 *
 * 【提示】
 * 树中节点数目在范围 [0, 10^4] 内
 * -2^31 <= Node.val <= 2^31 - 1
 *
 * 【算法思路】
 * 1、BST 要求每个节点值必须在一个「合法区间」内，左子树上界为当前值、右子树下界为当前值。
 * 2、用递归函数 validate(node, lower, upper) 传递当前合法区间，初始为 (-Infinity, +Infinity)。
 * 3、遇到 null 返回 true；若 node.val 不在 (lower, upper) 开区间内直接返回 false。
 * 4、递归检查左子树区间 (lower, node.val) 与右子树区间 (node.val, upper)，全部通过才合法。
 * 5、用开区间（而非闭区间）可自然处理值域边界（如 INT_MIN/INT_MAX），避免特判相等情况。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个节点访问一次
 * 空间复杂度：O(h)，h 为树高，递归栈深度（最坏 O(n)）
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
 * @return {boolean}
 */
function isValidBST(root) {
  const validate = (node, lower, upper) => {
    if (!node) return true;
    if (node.val <= lower || node.val >= upper) return false;
    return validate(node.left, lower, node.val) &&
           validate(node.right, node.val, upper);
  };
  return validate(root, -Infinity, Infinity);
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

  eq('root=[2,1,3]', isValidBST(buildTree([2, 1, 3])), true);
  eq('root=[5,1,4,null,null,3,6] 右子树违规', isValidBST(buildTree([5, 1, 4, null, null, 3, 6])), false);
  eq('root=[] 空树', isValidBST(buildTree([])), true);
  eq('root=[1] 单节点', isValidBST(buildTree([1])), true);
  eq('root=[1,1] 相等不合法', isValidBST(buildTree([1, 1])), false);
  eq('root=[2147483647] 边界值', isValidBST(buildTree([2147483647])), true);
  eq('root=[-2147483648] 负边界', isValidBST(buildTree([-2147483648])), true);
  eq('root=[5,4,6,null,null,3,7] 右孙子违规', isValidBST(buildTree([5, 4, 6, null, null, 3, 7])), false);
  eq('root=[3,1,5,0,2,4,6] 完美 BST', isValidBST(buildTree([3, 1, 5, 0, 2, 4, 6])), true);

  console.log(`[98-验证二叉搜索树] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, isValidBST };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}