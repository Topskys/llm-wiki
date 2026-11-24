/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：25
 * 题目：K 个一组翻转链表（Reverse Nodes in k-Group）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/reverse-nodes-in-k-group/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你链表的头节点 head ，每 k 个结点一组进行翻转，请你返回修改后的链表。
 * k 是一个正整数，它的值小于或等于链表的长度。
 * 如果结点总数不是 k 的整数倍，那么请将最后剩余的结点保持原有顺序；
 * 不允许修改结点的值，只能进行结点本身的交换；进阶要求算法是 O(n) 时间
 * 并且只使用常数级空间。
 *
 * 【示例】
 * 输入：head = [1,2,3,4,5], k = 2
 * 输出：[2,1,4,3,5]
 * 解释：每 2 个一组翻转，末尾落单的 5 保持原位。
 *
 * 输入：head = [1,2,3,4,5], k = 3
 * 输出：[3,2,1,4,5]
 * 解释：第一组 [1,2,3] 翻转为 [3,2,1]，剩余 [4,5] 不足 3 个不翻转。
 *
 * 【提示】
 * 链表中结点的数目为 n，且 1 <= k <= n <= 5000
 * 0 <= Node.val <= 1000
 *
 * 【算法思路】
 * 1、哑节点 + 分组头插法，逐组完成翻转，全程迭代不用递归栈。
 * 2、每组先从 groupPrev 走 k 步探测剩余长度，不足 k 个则直接结束，尾部保持原序。
 * 3、足够时把组头之后的 k-1 个结点依次摘下并头插到 groupPrev 之后，整段原地反序。
 * 4、原组头 groupTail 在翻转中位置不变，它既是本组的尾，也是下一组的 groupPrev，组间衔接天然正确。
 * 5、探测与头插各扫一遍本组，每个结点被访问常数次，满足 O(n) 时间与 O(1) 空间的进阶要求。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个结点被访问常数次（探测 + 头插）
 * 空间复杂度：O(1)，只用指针变量，无递归栈
 * ============================================================
 */

/**
 * 单链表结点定义（与 LeetCode 官方一致）。
 */
class ListNode {
  /**
   * @param {number} val
   * @param {ListNode | null} next
   */
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * 由数组构造链表，返回头节点（空数组返回 null）。
 * @param {number[]} arr
 * @return {ListNode | null}
 */
function buildList(arr) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

/**
 * 链表转数组，便于断言比较。
 * @param {ListNode | null} head
 * @return {number[]}
 */
function listToArray(head) {
  const out = [];
  for (let cur = head; cur !== null; cur = cur.next) out.push(cur.val);
  return out;
}

/**
 * 每 k 个结点一组翻转链表，不足 k 的尾部保持原序。
 * @param {ListNode | null} head
 * @param {number} k
 * @return {ListNode | null}
 */
function reverseKGroup(head, k) {
  if (head === null || k <= 1) return head;
  const dummy = new ListNode(0, head);
  let groupPrev = dummy; // 本组前驱
  while (true) {
    // 探测：从 groupPrev 起是否有足够的 k 个结点
    let probe = groupPrev;
    for (let i = 0; i < k && probe !== null; i++) probe = probe.next;
    if (probe === null) break; // 剩余不足 k 个，保持原序

    const groupTail = groupPrev.next; // 翻转后成为本组的尾
    // 头插法：把 groupTail 之后的 k-1 个结点逐个插到 groupPrev 之后
    for (let i = 0; i < k - 1; i++) {
      const cur = groupTail.next;
      groupTail.next = cur.next;
      cur.next = groupPrev.next;
      groupPrev.next = cur;
    }
    groupPrev = groupTail; // 本组尾即下一组的前驱
  }
  return dummy.next;
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

  eq('示例1 head=[1,2,3,4,5] k=2', listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 2)), [2, 1, 4, 3, 5]);
  eq('示例2 head=[1,2,3,4,5] k=3', listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 3)), [3, 2, 1, 4, 5]);
  eq('k 等于长度（整表翻转）', listToArray(reverseKGroup(buildList([1, 2, 3, 4]), 4)), [4, 3, 2, 1]);
  eq('k=1 不变', listToArray(reverseKGroup(buildList([1, 2, 3]), 1)), [1, 2, 3]);
  eq('长度不足 k', listToArray(reverseKGroup(buildList([1, 2]), 3)), [1, 2]);
  eq('空链表', listToArray(reverseKGroup(null, 2)), []);
  eq('单节点 k=1', listToArray(reverseKGroup(buildList([1]), 1)), [1]);
  eq('k=2 恰好整除', listToArray(reverseKGroup(buildList([1, 2, 3, 4]), 2)), [2, 1, 4, 3]);

  console.log(`[25-K个一组翻转链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, reverseKGroup };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
