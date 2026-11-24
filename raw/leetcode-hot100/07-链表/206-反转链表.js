/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：206
 * 题目：反转链表（Reverse Linked List）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/reverse-linked-list/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你单链表的头节点 head，请你反转链表，并返回反转后的链表头节点。
 * 反转指就地改变节点 next 指针的方向，不新建节点、不复制节点的值。
 * 链表可以选用迭代或递归方式完成，函数返回的是原链表的尾节点。
 *
 * 【示例】
 * 输入：head = [1,2,3,4,5]
 * 输出：[5,4,3,2,1]
 * 解释：原链表中 1->2->3->4->5，反转后指针全部反向，
 * 新的头节点是原来的尾节点 5，原来的头节点 1 变成尾节点且 next 为 null。
 *
 * 输入：head = [1,2]
 * 输出：[2,1]
 *
 * 输入：head = []
 * 输出：[]
 *
 * 【提示】
 * 链表中节点的数目范围是 [0, 5000]
 * -5000 <= Node.val <= 5000
 * 本题存在多种解法，迭代写法不会造成调用栈开销
 *
 * 【算法思路】
 * 1、三指针迭代：prev 指向已反转好的部分（初始为 null），cur 指向待处理的当前节点，next 先暂存 cur.next 以免断链。
 * 2、每步执行 prev <- cur <- next 的整体右移：把 cur.next 指回 prev，再让 prev 与 cur 各前进一格。
 * 3、循环不变量是 prev 之后的链已反转、cur 之后的链保持原序，因此 cur 为 null 时 prev 恰是原尾节点，即反转后的头节点。
 * 4、递归写法（注释中给出）：先递归反转 head.next 之后的部分，再让 head.next.next = head 把当前节点接到尾部，最后 head.next = null。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，遍历一次链表
 * 空间复杂度：O(1)，迭代仅三个指针；递归为 O(n) 栈空间
 * ============================================================
 */

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * 数组转链表，返回头节点。
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
 * 链表转数组（仅用于无环链表）。
 * @param {ListNode | null} head
 * @return {number[]}
 */
function listToArray(head) {
  const out = [];
  for (let cur = head; cur; cur = cur.next) out.push(cur.val);
  return out;
}

/**
 * 反转链表（迭代）。
 * @param {ListNode | null} head
 * @return {ListNode | null} 反转后的新头节点
 */
function reverseList(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next; // 暂存后继，防止断链
    cur.next = prev;       // 当前节点指针反向
    prev = cur;            // 已反转部分前移
    cur = next;            // 待处理部分前移
  }
  return prev;
}

/**
 * 反转链表（递归，供对照理解；LeetCode 提交同样通过，但栈空间 O(n)）。
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
function reverseListRecursive(head) {
  if (!head || !head.next) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head; // 让后继节点指回自己
  head.next = null;      // 断开正向链接，避免成环
  return newHead;        // 头始终是原链表尾节点
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

  eq('普通链表 [1,2,3,4,5]', listToArray(reverseList(buildList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);
  eq('两节点 [1,2]', listToArray(reverseList(buildList([1, 2]))), [2, 1]);
  eq('单节点 [1]', listToArray(reverseList(buildList([1]))), [1]);
  eq('空链表 []', listToArray(reverseList(null)), []);
  eq('含负数与 0', listToArray(reverseList(buildList([-3, 0, -7, 2]))), [2, -7, 0, -3]);
  eq('递归与迭代一致', listToArray(reverseListRecursive(buildList([1, 2, 3]))), [3, 2, 1]);
  eq('反转两次还原', listToArray(reverseList(reverseList(buildList([1, 2, 3, 4])))), [1, 2, 3, 4]);
  // 原头节点反转后必须成为尾节点且 next 为 null
  const h = buildList([1, 2, 3]);
  const oldHead = h;
  const newHead = reverseList(h);
  eq('新头是原尾', newHead.val, 3);
  eq('原头 next 已置空', oldHead.next, null);

  console.log(`[206-反转链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, reverseList };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
