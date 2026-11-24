/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：160
 * 题目：相交链表（Intersection of Two Linked Lists）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/intersection-of-two-linked-lists/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你两个单链表的头节点 headA 和 headB，请你找出并返回两个单链表
 * 相交的起始节点。如果两个链表不存在相交节点，返回 null。
 * 题目数据保证整个链式结构中不存在环；相交的定义是节点对象引用相同
 * （即从该节点往后两个链表共用同一段尾部），而不是值相等。
 * 函数返回结果后，链表必须保持其原始结构，不得修改节点。
 *
 * 【示例】
 * 输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 1
 * 输出：Intersected at '8'
 * 解释：相交节点的值为 8（注意，如果两个链表相交则不能为 0）。
 * 从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]，
 * 在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 1 个节点。
 *
 * 【提示】
 * listA 中节点数目为 m，listB 中节点数目为 n
 * 1 <= m, n <= 3 * 10^4
 * 1 <= Node.val <= 10^5
 * 若两个链表不相交，则 intersectVal 为 0
 *
 * 【算法思路】
 * 1、双指针分别从 headA、headB 出发，走到尾部后切换到对方的头部继续走。
 * 2、设 A 独有 a 步、B 独有 b 步、公共尾部 c 步，则两指针都走了 a+b+c 步时必定位于同一位置：要么正好是相交节点，要么同时为 null（不相交）。
 * 3、因此循环条件为 p !== q，退出即答案，无需先统计长度再对齐。
 * 4、关键细节：切换时必须指向 head（而不是 head.next），且要允许 p 为 null，否则不相交的两个链表会让循环无法终止。
 *
 * 【复杂度】
 * 时间复杂度：O(m + n)，每个指针最多走 m + n 步
 * 空间复杂度：O(1)，只用两个指针变量
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
 * 构造两条共用尾部的链表，用于相交测试。
 * @param {number[]} onlyA 链表 A 独有部分
 * @param {number[]} onlyB 链表 B 独有部分
 * @param {number[]} shared 公共尾部
 * @return {[ListNode, ListNode]} headA 与 headB
 */
function buildIntersect(onlyA, onlyB, shared) {
  const tail = buildList(shared);
  const headA = buildList(onlyA);
  const headB = buildList(onlyB);
  // 把各自独有段的尾部接到公共尾部上，形成真实共享的节点对象
  const link = (head, t) => {
    if (!head) return t;
    let cur = head;
    while (cur.next) cur = cur.next;
    cur.next = t;
    return head;
  };
  return [link(headA, tail), link(headB, tail)];
}

/**
 * 找出两个单链表相交的起始节点。
 * @param {ListNode | null} headA
 * @param {ListNode | null} headB
 * @return {ListNode | null}
 */
function getIntersectionNode(headA, headB) {
  let p = headA;
  let q = headB;
  // 走到末尾后切换到对方头节点，两轮之内必相遇于交点或同时为 null
  while (p !== q) {
    p = p ? p.next : headB;
    q = q ? q.next : headA;
  }
  return p;
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

  // 1) 官方示例：交点值 8
  let [a, b] = buildIntersect([4, 1], [5, 0, 1], [8, 4, 5]);
  let hit = getIntersectionNode(a, b);
  eq('相交于 8', hit && hit.val, 8);
  eq('交点后尾部一致', listToArray(hit), [8, 4, 5]);

  // 2) 不相交：返回 null
  a = buildList([2, 6, 4]);
  b = buildList([1, 5]);
  eq('不相交返回 null', getIntersectionNode(a, b), null);

  // 3) 头节点即交点（两链表完全相同）
  const same = buildList([1, 2, 3]);
  hit = getIntersectionNode(same, same);
  eq('头节点相交', hit && hit.val, 1);

  // 4) 单节点相交
  [a, b] = buildIntersect([], [], [7]);
  hit = getIntersectionNode(a, b);
  eq('单节点相交', hit && hit.val, 7);

  // 5) 尾部只有一个节点且长度差很大
  [a, b] = buildIntersect([1, 2, 3, 4, 5], [9], [6, 1]);
  hit = getIntersectionNode(a, b);
  eq('长链短链相交', hit && hit.val, 6);

  // 6) 一侧为空链表
  eq('空链表不相交', getIntersectionNode(null, buildList([1, 2])), null);

  console.log(`[160-相交链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, getIntersectionNode };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
