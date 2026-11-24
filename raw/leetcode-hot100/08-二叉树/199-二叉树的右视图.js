/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：199
 * 题目：二叉树的右视图（Binary Tree Right Side View）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/binary-tree-right-side-view/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个二叉树的根节点 root ，想象自己站在它的右侧，按照从顶部到底部的顺序，
 * 返回从右侧所能看到的节点值。
 *
 * 【示例】
 * 输入：root = [1,2,3,null,5,null,4]
 * 输出：[1,3,4]
 * 解释：第 0 层只看 1，第 1 层最右是 3，第 2 层最右是 4（节点 5 被 4 挡住）。
 *
 * 【提示】
 * 树中节点数目在范围 [0, 100] 内
 * -100 <= Node.val <= 100
 *
 * 【算法思路】
 * 1、BFS 层序遍历，每层取最后一个节点的值即为右视图可见节点。
 * 2、用队列标准 BFS：每轮记录 size，迭代 size 次出队，i == size-1 时把值存入答案。
 * 3、子节点先左后右入队，保证同层遍历顺序为从左到右，最后处理的自然是最右节点。
 * 4、时间 O(n)，空间 O(w) 其中 w 为最大层宽。
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
 * @return {number[]}
 */
function rightSideView(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      if (i === size - 1) res.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
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

  eq('root=[1,2,3,null,5,null,4]', rightSideView(buildTree([1, 2, 3, null, 5, null, 4])), [1, 3, 4]);
  eq('root=[] 空树', rightSideView(buildTree([])), []);
  eq('root=[1] 单节点', rightSideView(buildTree([1])), [1]);
  eq('只有左子链 [1,2,null,3]', rightSideView(buildTree([1, 2, null, 3])), [1, 2, 3]);
  eq('只有右子链 [1,null,2,null,3]', rightSideView(buildTree([1, null, 2, null, 3])), [1, 2, 3]);
  eq('满二叉树 [1,2,3,4,5,6,7]', rightSideView(buildTree([1, 2, 3, 4, 5, 6, 7])), [1, 3, 7]);
  eq('左倾但右边有更深节点 [1,2,3,null,4]', rightSideView(buildTree([1, 2, 3, null, 4])), [1, 3, 4]);

  console.log(`[199-二叉树的右视图] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, rightSideView };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}