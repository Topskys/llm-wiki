/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：226
 * 题目：翻转二叉树（Invert Binary Tree）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/invert-binary-tree/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一棵二叉树的根节点 root，翻转这棵二叉树，即把每个节点的
 * 左、右子节点互换，并返回其根节点。
 * 翻转是对所有节点统一执行的操作，因此递归地交换每个节点的
 * 两个孩子即可得到镜像树。
 * 原地修改即可，不需要构造新的树。
 *
 * 【示例】
 * 输入：root = [4,2,7,1,3,6,9]
 * 输出：[4,7,2,9,6,3,1]
 * 解释：根 4 的左右孩子 2 与 7 互换；2 的孩子 1、3 换成 3、1，
 * 7 的孩子 6、9 换成 9、6，整棵树左右镜像。
 *
 * 输入：root = [2,1,3]
 * 输出：[2,3,1]
 * 解释：只有根节点发生交换，两个孩子互换位置。
 *
 * 【提示】
 * 树中节点数目范围在 [0, 100] 内
 * -100 <= Node.val <= 100
 * 空树输入返回空树，单节点树保持原样
 *
 * 【算法思路】
 * 1、前序（或后序）递归：对当前节点先交换它的 left 与 right 指针，再分别对左右子树递归执行同样的操作，空节点直接返回。
 * 2、正确性：镜像的定义就是每个节点的两棵子树位置互换，逐节点交换指针后，任意一层左右关系都与原树相反。
 * 3、关键细节：交换与递归的先后顺序不影响结果，前序后序皆可。
 * 4、只需交换指针，不需要交换节点的值，也不要复制新节点。
 * 5、迭代写法用栈或队列逐节点弹出并交换其孩子，逻辑完全等价。
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
 * 226 翻转二叉树：递归交换每个节点的左右指针。
 * @param {TreeNode|null} root 二叉树根节点
 * @return {TreeNode|null} 翻转后的根节点（原地修改）
 */
function invertTree(root) {
  if (root === null) return null;
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;
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

  eq('示例 [4,2,7,1,3,6,9]', treeToArray(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9]))), [4, 7, 2, 9, 6, 3, 1]);
  eq('空树 []', treeToArray(invertTree(buildTree([]))), []);
  eq('单节点 [1]', treeToArray(invertTree(buildTree([1]))), [1]);
  eq('只有左子链 [1,2,null,3]', treeToArray(invertTree(buildTree([1, 2, null, 3]))), [1, null, 2, null, 3]);
  eq('一般树 [2,1,3]', treeToArray(invertTree(buildTree([2, 1, 3]))), [2, 3, 1]);
  eq('翻两次还原 [5,4,null,3]', treeToArray(invertTree(invertTree(buildTree([5, 4, null, 3])))), [5, 4, null, 3]);

  console.log(`[226-翻转二叉树] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, invertTree };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
