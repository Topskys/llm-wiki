/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 08-二叉树
 * ------------------------------------------------------------
 * 题号：108
 * 题目：将有序数组转换为二叉搜索树（Convert Sorted Array to Binary Search Tree）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums ，其中元素已经按 升序 排列，请你将其转换为一棵 高度平衡 二叉搜索树。
 * 高度平衡二叉树：每个节点的左右两个子树的高度差的绝对值不超过 1 。
 *
 * 【示例】
 * 输入：nums = [-10,-3,0,5,9]
 * 输出：[0,-3,9,-10,null,5]
 * 解释：[0,-10,5,null,-3,null,9] 等也是合法答案，只要满足 BST 与高度平衡即可。
 *
 * 【提示】
 * 1 <= nums.length <= 10^4
 * -10^4 <= nums[i] <= 10^4
 * nums 按 严格递增 顺序排列
 *
 * 【算法思路】
 * 1、中序遍历有序数组即 BST 的中序序列，取中间元素为根可保证左右节点数最接近，从而高度平衡。
 * 2、递归函数 build(l, r) 在左闭右闭区间 [l, r] 内取 mid = (l + r) >> 1 为根。
 * 3、左子树递归 build(l, mid - 1)，右子树递归 build(mid + 1, r)，区间为空返回 null。
 * 4、数组长度为偶数时 mid 偏左（整除），亦或偏右均满足高度差 ≤ 1，题目接受任意合法结果。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个数组元素恰好建一次节点
 * 空间复杂度：O(log n)，递归栈深度（高度平衡树高度）
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
 * @param {number[]} nums
 * @return {TreeNode|null}
 */
function sortedArrayToBST(nums) {
  const build = (l, r) => {
    if (l > r) return null;
    const mid = (l + r) >> 1;
    const root = new TreeNode(nums[mid]);
    root.left = build(l, mid - 1);
    root.right = build(mid + 1, r);
    return root;
  };
  return build(0, nums.length - 1);
}

/**
 * 验证生成树是否为合法 BST 且高度平衡（仅供测试使用）
 * @param {TreeNode|null} root
 * @return {boolean}
 */
function checkBSTAndBalanced(root) {
  const check = (node) => {
    if (!node) return { valid: true, height: 0, min: Infinity, max: -Infinity };
    const L = check(node.left);
    const R = check(node.right);
    const valid = L.valid && R.valid &&
                  node.val > L.max && node.val < R.min &&
                  Math.abs(L.height - R.height) <= 1;
    return {
      valid,
      height: Math.max(L.height, R.height) + 1,
      min: Math.min(node.val, L.min),
      max: Math.max(node.val, R.max)
    };
  };
  return check(root).valid;
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

  const t1 = sortedArrayToBST([-10, -3, 0, 5, 9]);
  eq('生成树为合法 BST 且平衡', checkBSTAndBalanced(t1), true);
  eq('nums=[-10,-3,0,5,9] 根值为 0', t1.val, 0);

  const t2 = sortedArrayToBST([1, 3]);
  eq('nums=[1,3] 生成合法', checkBSTAndBalanced(t2), true);

  const t3 = sortedArrayToBST([0]);
  eq('单元素', checkBSTAndBalanced(t3), true);

  const t4 = sortedArrayToBST([-5, -4, -3, -2, -1, 0, 1]);
  eq('奇数长度全负', checkBSTAndBalanced(t4), true);

  const t5 = sortedArrayToBST([1, 2, 3, 4]);
  eq('偶数长度', checkBSTAndBalanced(t5), true);

  console.log(`[108-将有序数组转换为二叉搜索树] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TreeNode, buildTree, treeToArray, sortedArrayToBST };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}