/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：543
 * 题目：二叉树的直径（Diameter of Binary Tree）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/diameter-of-binary-tree/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一棵二叉树的根节点 root，返回该树直径的长度。
 * 二叉树的直径是指任意两个节点间最长路径的长度，该路径可能
 * 不经过根节点 root，路径长度用边的数目表示。
 * 树中只有一个节点时直径为 0，空树直径也为 0。
 *
 * 【示例】
 * 输入：root = [1,2,3,4,5]
 * 输出：3
 * 解释：最长路径是 4 -> 2 -> 1 -> 3（或 5 -> 3 -> 1 -> 2），
 * 该路径包含 3 条边，所以直径为 3。
 *
 * 输入：root = [1,2]
 * 输出：1
 * 解释：只有一条边 1 -> 2，直径为 1。
 *
 * 【提示】
 * 树中节点数目在范围 [1, 10^4] 内
 * -100 <= Node.val <= 100
 * 直径按边数计算，因此等于路径上的节点数减一
 *
 * 【算法思路】
 * 1、后序遍历：对每个节点，先递归拿到左、右子树向下最长链的长度 lh、rh（空节点记 0，叶子记 1，作为孩子的返回值恰等于父节点伸进该侧的边数）。
 * 2、用 lh + rh 更新全局直径，再返回 max(lh, rh) + 1。
 * 3、正确性：任意路径都有唯一的最高点（拐点），在该点处路径恰由左链与右链拼接而成，所以逐节点求 lh + rh 的最大值即全局直径。
 * 4、关键细节：返回值只能取单侧 max + 1，把两侧都返回给父亲会造出一条不存在的分叉路径。
 * 5、直径统计的是边数而不是节点数，lh + rh 正好等于穿过该节点的路径上的边数，无需再减一。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，后序遍历每个节点一次
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
 * 543 二叉树的直径：后序更新最长链，返回单侧最长边数。
 * @param {TreeNode|null} root 二叉树根节点
 * @return {number} 树中最长路径的边数
 */
function diameterOfBinaryTree(root) {
  let best = 0;

  /**
   * 返回 node 向下最长链的长度（空节点记 0，叶子记 1）。
   * 作为孩子的返回值时，恰好等于从父节点伸进这一侧的边数。
   * @param {TreeNode|null} node 当前节点
   * @return {number} 向下最长链长度
   */
  function depth(node) {
    if (node === null) return 0;
    const lh = depth(node.left);
    const rh = depth(node.right);
    if (lh + rh > best) best = lh + rh;
    return Math.max(lh, rh) + 1;
  }

  depth(root);
  return best;
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

  eq('示例 [1,2,3,4,5]', diameterOfBinaryTree(buildTree([1, 2, 3, 4, 5])), 3);
  eq('空树 []', diameterOfBinaryTree(buildTree([])), 0);
  eq('单节点 [1]', diameterOfBinaryTree(buildTree([1])), 0);
  eq('只有左子链 [1,2,null,3,null,4]', diameterOfBinaryTree(buildTree([1, 2, null, 3, null, 4])), 3);
  eq('一侧为空 [1,2]', diameterOfBinaryTree(buildTree([1, 2])), 1);
  eq('左斜长链 [2,3,null,1,null,4,5,null,null,7]', diameterOfBinaryTree(buildTree([2, 3, null, 1, null, 4, 5, null, null, 7])), 4);
  eq('根只有一侧孩子 [1,2,null,3,4]', diameterOfBinaryTree(buildTree([1, 2, null, 3, 4])), 2);

  console.log(`[543-二叉树的直径] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, diameterOfBinaryTree };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
