/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：141
 * 题目：环形链表（Linked List Cycle）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/linked-list-cycle/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个链表的头节点 head，请判断链表中是否有环。
 * 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。
 * 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到
 * 链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递，
 * 仅仅是为了标识链表的实际情况。如果链表中存在环则返回 true，否则返回 false。
 *
 * 【示例】
 * 输入：head = [3,2,0,-4], pos = 1
 * 输出：true
 * 解释：链表中有一个环，其尾部连接到第二个节点（值为 2 的节点）。
 *
 * 输入：head = [1,2], pos = 0
 * 输出：true
 * 解释：尾部连接到第一个节点，形成自环。
 *
 * 输入：head = [1], pos = -1
 * 输出：false
 * 解释：链表中没有环。
 *
 * 【提示】
 * 链表中节点的数目范围是 [0, 10^4]
 * -10^5 <= Node.val <= 10^5
 * pos 为 -1 或者链表中的一个有效索引
 * 进阶：使用 O(1)（即常量）空间表示此链表
 *
 * 【算法思路】
 * 1、Floyd 快慢指针判圈（龟兔赛跑）：slow 每次走 1 步，fast 每次走 2 步，都从 head 出发。
 * 2、若链表无环，fast 会先碰到 null，返回 false。
 * 3、若有环，两个指针都会进入环，且它们在环内的相对速度为 1，距离每轮缩小 1 步，因此 fast 必定在环内追上 slow，返回 true。
 * 4、关键细节：循环条件写 while (fast && fast.next)，先判 fast 再取 fast.next，避免空指针异常；比较必须在移动之后进行，初始同为 head 不能直接判真。
 * 5、相比哈希集合记录访问过的节点（O(n) 空间），快慢指针只需常量空间。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，无环最多遍历 n 步，有环在进入环后 O(n) 内相遇
 * 空间复杂度：O(1)，仅两个指针
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
 * 链表转数组。本文件链表可能带环，故加长度上限防止无限循环，
 * 仅用于无环场景的断言。
 * @param {ListNode | null} head
 * @param {number} limit
 * @return {number[]}
 */
function listToArray(head, limit = 10000) {
  const out = [];
  for (let cur = head; cur && out.length < limit; cur = cur.next) out.push(cur.val);
  return out;
}

/**
 * 构造带环链表用于测试：把尾节点接到索引 pos 的节点上。
 * @param {number[]} arr
 * @param {number} pos 环入口索引，-1 表示无环
 * @return {ListNode | null}
 */
function buildCycle(arr, pos) {
  const head = buildList(arr);
  if (!head || pos < 0) return head;
  let entry = head;
  for (let i = 0; i < pos; i++) entry = entry.next;
  let tail = head;
  while (tail.next) tail = tail.next;
  tail.next = entry;
  return head;
}

/**
 * 判断链表中是否存在环（Floyd 快慢指针）。
 * @param {ListNode | null} head
 * @return {boolean}
 */
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true; // 相遇即存在环
  }
  return false;
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

  eq('[3,2,0,-4] pos=1 有环', hasCycle(buildCycle([3, 2, 0, -4], 1)), true);
  eq('[1,2] pos=0 有环', hasCycle(buildCycle([1, 2], 0)), true);
  eq('[1] pos=-1 无环', hasCycle(buildCycle([1], -1)), false);
  eq('空链表无环', hasCycle(null), false);
  eq('单节点自环 pos=0', hasCycle(buildCycle([1], 0)), true);
  eq('[1,2] pos=1 尾指自己', hasCycle(buildCycle([1, 2], 1)), true);
  eq('长链无环', hasCycle(buildCycle([1, 2, 3, 4, 5, 6], -1)), false);
  eq('长链环入口在中间', hasCycle(buildCycle([1, 2, 3, 4, 5, 6], 3)), true);
  eq('两节点无环', hasCycle(buildCycle([1, 2], -1)), false);
  // 无环链表结构完好，转数组长度等于原长度
  eq('无环链表长度', listToArray(buildList([1, 2, 3, 4])).length, 4);

  console.log(`[141-环形链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, hasCycle };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
