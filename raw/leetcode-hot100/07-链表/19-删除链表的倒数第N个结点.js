/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：19
 * 题目：删除链表的倒数第 N 个结点（Remove Nth Node From End of List）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/remove-nth-node-from-end-of-list/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个链表的头节点 head ，请你删除链表中倒数第 n 个结点，
 * 并返回删除后的链表的头节点。
 * 进阶：你能尝试使用一趟扫描实现吗？
 *
 * 【示例】
 * 输入：head = [1,2,3,4,5], n = 2
 * 输出：[1,2,3,5]
 * 解释：链表倒数第 2 个结点是值为 4 的结点，删除后得到 [1,2,3,5] 。
 *
 * 输入：head = [1], n = 1
 * 输出：[]
 * 解释：链表只有一个结点，删除倒数第 1 个即删除头结点，返回空链表。
 *
 * 【提示】
 * 链表中结点的数目为 sz，且 1 <= sz <= 30
 * 0 <= Node.val <= 100
 * 1 <= n <= sz
 *
 * 【算法思路】
 * 1、快慢双指针配合哑节点（dummy），一趟扫描定位待删结点的前驱。
 * 2、先让 fast 从 dummy 出发走 n+1 步，此后 fast 与 slow 恒相差 n+1 个结点。
 * 3、两者同速前进，当 fast 走到 null（越过了尾结点）时，slow 恰好停在倒数第 n 个结点的前驱上。
 * 4、执行 slow.next = slow.next.next 跳过待删结点，即完成删除。
 * 5、待删结点可能是头结点本身，用 dummy 统一「删头」与「删中间」两种情况，无需特判。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，对链表一趟扫描
 * 空间复杂度：O(1)，只用了常数个指针变量
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
 * 删除链表的倒数第 n 个结点。
 * @param {ListNode | null} head
 * @param {number} n
 * @return {ListNode | null}
 */
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;
  // fast 先走 n + 1 步，制造 n + 1 的间距
  for (let i = 0; i <= n; i++) {
    if (fast === null) return head; // n 超出链表长度（题设保证不会出现）
    fast = fast.next;
  }
  // 同速前进，fast 到 null 时 slow 落在待删结点的前驱
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  if (slow.next === null) return head;
  slow.next = slow.next.next;
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

  eq('示例1 head=[1,2,3,4,5] n=2', listToArray(removeNthFromEnd(buildList([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]);
  eq('示例2 head=[1] n=1（删成空链表）', listToArray(removeNthFromEnd(buildList([1]), 1)), []);
  eq('删头 head=[1,2] n=2', listToArray(removeNthFromEnd(buildList([1, 2]), 2)), [2]);
  eq('删尾 head=[1,2] n=1', listToArray(removeNthFromEnd(buildList([1, 2]), 1)), [1]);
  eq('n 等于长度 head=[1,2,3,4,5] n=5', listToArray(removeNthFromEnd(buildList([1, 2, 3, 4, 5]), 5)), [2, 3, 4, 5]);
  eq('空链表入参 head=[] n=1', listToArray(removeNthFromEnd(null, 1)), []);

  console.log(`[19-删除链表的倒数第N个结点] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, removeNthFromEnd };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
