/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：114
 * 题目：二叉树展开为链表（Flatten Binary Tree to Linked List）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你二叉树的根结点 root ，请你将它展开为一个单链表：
 * 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表下一个结点，而左子指针始终为 null 。
 * 展开后的单链表应该与二叉树 先序遍历 顺序相同。
 *
 * 【示例】
 * 输入：root = [1,2,5,3,4,null,6]
 * 输出：[1,null,2,null,3,null,4,null,5,null,6]
 *
 * 【提示】
 * 树中结点数在范围 [0, 2000] 内
 * -100 <= Node.val <= 100
 * 进阶：你可以使用原地算法（O(1) 额外空间）展开树吗？
 *
 * 【算法思路】
 * 1、原地展开：对每个节点，若左子树非空，找到左子树的最右节点，将该节点的 right 指向当前节点的右子树。
 * 2、然后把当前节点的右子树指向左子树，左子树置空。
 * 3、继续处理下一个右节点（即原左子树根），直到遍历完所有节点。
 * 4、此过程相当于将先序遍历中的「左子树整体插到根与右子树之间」，不需要额外空间。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个节点访问常数次
 * 空间复杂度：O(1)，原地操作
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
 * @return {void} Do not return anything, modify root in-place instead.
 */
function flatten(root) {
  let cur = root;
  while (cur) {
    if (cur.left) {
      // 找左子树最右节点
      let rightmost = cur.left;
      while (rightmost.right) rightmost = rightmost.right;
      // 左子树最右节点接上当前右子树
      rightmost.right = cur.right;
      // 左子树整体移到右边
      cur.right = cur.left;
      cur.left = null;
    }
    cur = cur.right;
  }
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

  const t1 = buildTree([1, 2, 5, 3, 4, null, 6]);
  flatten(t1);
  eq('示例 [1,2,5,3,4,null,6]', treeToArray(t1), [1, null, 2, null, 3, null, 4, null, 5, null, 6]);

  const t2 = buildTree([]);
  flatten(t2);
  eq('空树', treeToArray(t2), []);

  const t3 = buildTree([1]);
  flatten(t3);
  eq('单节点', treeToArray(t3), [1]);

  const t4 = buildTree([1, 2, null, 3]);
  flatten(t4);
  eq('只有左子链', treeToArray(t4), [1, null, 2, null, 3]);

  const t5 = buildTree([1, null, 2, null, 3]);
  flatten(t5);
  eq('只有右子链', treeToArray(t5), [1, null, 2, null, 3]);

  console.log(`[114-二叉树展开为链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, flatten };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}