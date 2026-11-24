/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：148
 * 题目：排序链表（Sort Linked List）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/sort-list/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你链表的头结点 head ，请将其按升序排列并返回排序后的链表。
 * 进阶：你可以在 O(n log n) 时间复杂度和常数级空间复杂度下，
 * 对链表进行排序吗？
 *
 * 【示例】
 * 输入：head = [4,2,1,3]
 * 输出：[1,2,3,4]
 * 解释：归并排序把链表不断对半拆分，再两两合并有序子链。
 *
 * 输入：head = [-1,5,3,4,0]
 * 输出：[-1,0,3,4,5]
 * 解释：含负数同样适用，比较只看 val 大小。
 *
 * 【提示】
 * 链表中结点的数目在 [0, 5 * 10^4] 范围内
 * -10^5 <= Node.val <= 10^5
 *
 * 【算法思路】
 * 1、自顶向下链表归并排序：快慢指针找中点，fast 每次走两步、slow 走一步，fast 到尾时 slow 即中点，令 slow.next = null 切成两半。
 * 2、初始让 fast 从 head.next 出发，保证偶数长度时前半段不多于后半段，避免只剩两个结点时拆不出非空左半而无限递归。
 * 3、对左右两半分别递归排序，规模减半，递归深度 O(log n)。
 * 4、合并与归并排序的 merge 相同：哑节点 + 双指针，每次取较小者接到结果尾部。
 * 5、正确性：合并两个有序链表仍有序，且规模按 2 的幂折半，总比较次数 O(n log n)，达到比较排序下界。
 * 6、O(1) 空间的自底向上写法（本文件另附参考实现）：段宽 size 从 1 起逐轮翻倍，每轮从哑节点重扫，依次取出相邻两段合并接回，全程只用指针、没有递归栈。
 *
 * 【复杂度】
 * 时间复杂度：O(n log n)，log n 层，每层合并总计 O(n)
 * 空间复杂度：自顶向下 O(log n) 递归栈；自底向上 O(1)
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
 * 合并两个升序链表。
 * @param {ListNode | null} a
 * @param {ListNode | null} b
 * @return {ListNode | null}
 */
function mergeTwoLists(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummy.next;
}

/**
 * 快慢指针找中点，并切断成左右两半（返回左半头，右半头单独返回）。
 * @param {ListNode} head
 * @return {[ListNode | null, ListNode | null]}
 */
function splitInHalf(head) {
  let slow = head;
  let fast = head.next; // 从 head.next 出发，保证左半至少含 head
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const rightHead = slow.next;
  slow.next = null;
  return [head, rightHead];
}

/**
 * 排序链表（自顶向下归并）。
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
function sortList(head) {
  if (head === null || head.next === null) return head;
  const [left, right] = splitInHalf(head);
  return mergeTwoLists(sortList(left), sortList(right));
}

/**
 * 排序链表（自底向上归并，额外空间 O(1)，无递归栈）。
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
function sortListBottomUp(head) {
  if (head === null || head.next === null) return head;
  let n = 0;
  for (let cur = head; cur !== null; cur = cur.next) n++;

  const dummy = new ListNode(0, head);
  // size 为本轮合并的段宽，逐轮翻倍；每轮都从 dummy 重新扫起，
  // 因为合并后头结点可能变化，不能沿用上一次的 head 指针
  for (let size = 1; size < n; size *= 2) {
    let tail = dummy;
    while (tail.next !== null) {
      // 取第一段，长至多 size
      const leftHead = tail.next;
      let leftEnd = leftHead;
      for (let i = 1; i < size && leftEnd.next !== null; i++) leftEnd = leftEnd.next;
      // 取第二段，长至多 size；不足两段则本轮结束
      const rightHead = leftEnd.next;
      if (rightHead === null) break; // leftEnd.next 本就是 null，链表未断
      leftEnd.next = null;
      let rightEnd = rightHead;
      for (let i = 1; i < size && rightEnd.next !== null; i++) rightEnd = rightEnd.next;
      const nextStart = rightEnd.next; // 记下剩余部分，合并后接回
      rightEnd.next = null;
      // 合并两段并接到 tail 之后
      tail.next = mergeTwoLists(leftHead, rightHead);
      while (tail.next !== null) tail = tail.next;
      tail.next = nextStart;
    }
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

  eq('示例1 head=[4,2,1,3]', listToArray(sortList(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  eq('示例2 head=[-1,5,3,4,0]', listToArray(sortList(buildList([-1, 5, 3, 4, 0]))), [-1, 0, 3, 4, 5]);
  eq('空链表', listToArray(sortList(null)), []);
  eq('单节点', listToArray(sortList(buildList([1]))), [1]);
  eq('两节点逆序', listToArray(sortList(buildList([2, 1]))), [1, 2]);
  eq('已有序', listToArray(sortList(buildList([1, 2, 3, 4]))), [1, 2, 3, 4]);
  eq('全部相同', listToArray(sortList(buildList([7, 7, 7, 7]))), [7, 7, 7, 7]);
  eq('自底向上与自顶向下结果一致', listToArray(sortListBottomUp(buildList([-1, 5, 3, 4, 0, -9, 12]))), [-9, -1, 0, 3, 4, 5, 12]);
  eq('自底向上空链表', listToArray(sortListBottomUp(null)), []);
  eq('自底向上逆序 6 元素', listToArray(sortListBottomUp(buildList([6, 5, 4, 3, 2, 1]))), [1, 2, 3, 4, 5, 6]);
  eq('随机大规模正确性', (() => {
    const arr = [];
    for (let i = 0; i < 200; i++) arr.push(((i * 37) % 101) - 50);
    const expected = arr.slice().sort((x, y) => x - y);
    return JSON.stringify(listToArray(sortList(buildList(arr)))) === JSON.stringify(expected) &&
      JSON.stringify(listToArray(sortListBottomUp(buildList(arr)))) === JSON.stringify(expected);
  })(), true);

  console.log(`[148-排序链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, mergeTwoLists, sortList, sortListBottomUp };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
