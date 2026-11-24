/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：94
 * 题目：二叉树的中序遍历（Binary Tree Inorder Traversal）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/binary-tree-inorder-traversal/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个二叉树的根节点 root，返回它的中序遍历结果。
 * 中序遍历的访问顺序是「左子树 -> 根节点 -> 右子树」，
 * 对二叉搜索树而言，中序遍历恰好会得到一个升序序列。
 * 递归写法非常直接，本题要求用显式栈实现迭代版本。
 *
 * 【示例】
 * 输入：root = [1,null,2,3]
 * 输出：[1,3,2]
 * 解释：根节点 1 无左孩子，先访问 1；再进入右子树 2，
 * 2 的左孩子为 3，故先访问 3 再访问 2，得到 [1,3,2]。
 *
 * 输入：root = []
 * 输出：[]
 * 解释：空树没有任何节点可访问。
 *
 * 【提示】
 * 树中节点数目在范围 [0, 100] 内
 * -100 <= Node.val <= 100
 * 进阶：递归算法很简单，你可以通过迭代算法完成吗？
 *
 * 【算法思路】
 * 1、用显式栈模拟递归调用栈：cur 一路向左把途经节点全部压栈，走到空指针后弹栈访问该节点，再转向它的右子树，重复上述过程。
 * 2、正确性：栈中保存的正是「左子树尚未访问完、自身还未输出」的祖先，弹栈时机等价于递归回溯到该节点的时机，因此顺序与递归版完全一致。
 * 3、关键细节：循环条件是 cur 非空或栈非空，两者同时为空才结束。
 * 4、每个节点入栈、出栈各一次，不会重复访问。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个节点恰好入栈出栈一次
 * 空间复杂度：O(n)，最坏（退化成左链）栈深为 n
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
 * 94 二叉树的中序遍历：显式栈迭代。
 * @param {TreeNode|null} root 二叉树根节点
 * @return {number[]} 中序遍历得到的节点值序列
 */
function inorderTraversal(root) {
  const res = [];
  const stack = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    res.push(cur.val);
    cur = cur.right;
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

  eq('示例 [1,null,2,3]', inorderTraversal(buildTree([1, null, 2, 3])), [1, 3, 2]);
  eq('空树 []', inorderTraversal(buildTree([])), []);
  eq('单节点 [1]', inorderTraversal(buildTree([1])), [1]);
  eq('只有左子链 [3,2,null,1]', inorderTraversal(buildTree([3, 2, null, 1])), [1, 2, 3]);
  eq('二叉搜索树 [4,2,6,1,3,5,7]', inorderTraversal(buildTree([4, 2, 6, 1, 3, 5, 7])), [1, 2, 3, 4, 5, 6, 7]);
  eq('含重复值 [2,2,2]', inorderTraversal(buildTree([2, 2, 2])), [2, 2, 2]);

  console.log(`[94-二叉树的中序遍历] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, inorderTraversal };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
