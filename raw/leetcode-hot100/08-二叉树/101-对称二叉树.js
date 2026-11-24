/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：101
 * 题目：对称二叉树（Symmetric Tree）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/symmetric-tree/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个二叉树的根节点 root，如果这棵树是轴对称的则返回 true，
 * 否则返回 false。
 * 轴对称指以根节点所在竖直轴为镜面，左子树恰好是右子树的镜像：
 * 外侧的孩子与外侧的孩子对应，内侧的孩子与内侧的孩子对应。
 * 空树与只有根节点的树都被视为对称。
 *
 * 【示例】
 * 输入：root = [1,2,2,3,4,4,3]
 * 输出：true
 * 解释：左右孩子都是 2；再下一层左侧 3、4 与右侧 4、3 互为镜像，
 * 整棵树沿中轴对称。
 *
 * 输入：root = [1,2,2,null,3,null,3]
 * 输出：false
 * 解释：两个值为 2 的节点都只有右孩子 3，右子树没有对应的左孩子，
 * 结构不镜像，因此不对称。
 *
 * 【提示】
 * 树中节点数目在范围 [1, 1000] 内
 * -100 <= Node.val <= 100
 * 进阶：你可以运用递归或者迭代两种方法解决这个问题吗？
 *
 * 【算法思路】
 * 1、双指针递归 isMirror(a, b)：两人都空则对称；一空一非空或值不等则不对称。
 * 2、否则递归比较 a.left 与 b.right（外侧）、a.right 与 b.left（内侧），两者都为真才对称。
 * 3、正确性：对称的定义就是左右子树互为镜像，把「镜像」拆成值相等 + 外侧配外侧、内侧配内侧，逐层递归即覆盖全部节点对。
 * 4、关键细节：不能只判断根节点的左右孩子值相等，也不能判断「左子树自身对称」，必须让两棵子树交叉配对向下比较。
 * 5、迭代版把 (a, b) 成对压入队列或栈，每次弹出一对做同样判断。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，最多访问每个节点一次
 * 空间复杂度：O(n)，最坏递归栈深为 n，平衡时为 O(log n)
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
 * 判断以 a、b 为根的两棵子树是否互为镜像。
 * @param {TreeNode|null} a 左子树节点
 * @param {TreeNode|null} b 右子树节点
 * @return {boolean} 是否互为镜像
 */
function isMirror(a, b) {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  if (a.val !== b.val) return false;
  return isMirror(a.left, b.right) && isMirror(a.right, b.left);
}

/**
 * 101 对称二叉树：递归比较左右子树是否互为镜像。
 * @param {TreeNode|null} root 二叉树根节点
 * @return {boolean} 该树是否轴对称
 */
function isSymmetric(root) {
  if (root === null) return true;
  return isMirror(root.left, root.right);
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

  eq('示例对称 [1,2,2,3,4,4,3]', isSymmetric(buildTree([1, 2, 2, 3, 4, 4, 3])), true);
  eq('示例不对称 [1,2,2,null,3,null,3]', isSymmetric(buildTree([1, 2, 2, null, 3, null, 3])), false);
  eq('空树 []', isSymmetric(buildTree([])), true);
  eq('单节点 [1]', isSymmetric(buildTree([1])), true);
  eq('只有左子链 [1,2]', isSymmetric(buildTree([1, 2])), false);
  eq('值相同结构不对称 [1,2,2,2,null,2]', isSymmetric(buildTree([1, 2, 2, 2, null, 2])), false);
  eq('深层对称 [1,2,2,3,4,4,3,5,6,null,null,null,null,6,5]', isSymmetric(buildTree([1, 2, 2, 3, 4, 4, 3, 5, 6, null, null, null, null, 6, 5])), true);

  console.log(`[101-对称二叉树] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, isSymmetric };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
