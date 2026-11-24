/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：142
 * 题目：环形链表 II（Linked List Cycle II）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/linked-list-cycle-ii/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个链表的头节点 head，返回链表开始入环的第一个节点。
 * 如果链表无环，则返回 null。为了表示给定链表中的环，评测系统内部使用
 * 整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始），
 * 但 pos 不作为参数传递，仅仅是为了标识链表的实际情况。
 * 不允许修改链表，必须返回节点引用本身而不是它的值。
 *
 * 【示例】
 * 输入：head = [3,2,0,-4], pos = 1
 * 输出：返回索引为 1 的链表节点
 * 解释：链表中有一个环，其尾部连接到第二个节点，入环节点值为 2。
 *
 * 输入：head = [1,2], pos = 0
 * 输出：返回索引为 0 的链表节点
 * 解释：尾部连接到第一个节点，入环节点就是头节点，值为 1。
 *
 * 输入：head = [1], pos = -1
 * 输出：返回 null
 * 解释：链表中没有环。
 *
 * 【提示】
 * 链表中节点的数目范围在范围 [0, 10^4] 内
 * -10^5 <= Node.val <= 10^5
 * pos 的值为 -1 或者链表中的一个有效索引
 * 进阶：使用 O(1) 空间解决此题
 *
 * 【算法思路】
 * 1、Floyd 判圈两阶段。设 head 到入环点距离 a，入环点沿环走 b 步到相遇点，相遇点再走 c 步回到入环点，环长 L = b + c。
 * 2、相遇时 slow 走了 a + b，fast 走了 a + b + nL（n 为 fast 多绕的圈数），又因 fast 速度是 slow 的两倍，得 2(a + b) = a + b + nL，化简为 a = nL - b = (n-1)L + c。
 * 3、含义是：从相遇点再走 c 步即到入环点，而从 head 走 a 步也到入环点，两者相差整数圈。
 * 4、所以第一阶段快慢指针相遇后，令一个指针回到 head，两个指针各自每次走 1 步，必在入环点再次相遇。
 * 5、关键细节：n 取 1 时推导最直观（fast 恰好多绕一圈），n 更大时结论不变；若第一阶段 fast 触到 null 则无环，直接返回 null。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，两阶段合计不超过常数次遍历
 * 空间复杂度：O(1)，仅常数个指针
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
 * 返回链表开始入环的第一个节点，无环返回 null。
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
function detectCycle(head) {
  let slow = head;
  let fast = head;
  // 第一阶段：快慢指针找环内相遇点
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      // 第二阶段：一个指针回到 head，同速前进，相遇处即入环点
      let p = head;
      while (p !== slow) {
        p = p.next;
        slow = slow.next;
      }
      return p;
    }
  }
  return null;
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

  // 1) 官方示例：入环节点值为 2（索引 1）
  let h = buildCycle([3, 2, 0, -4], 1);
  let node = detectCycle(h);
  eq('[3,2,0,-4] pos=1 入环值', node && node.val, 2);
  eq('返回的是同一个节点对象', node === h.next, true);

  // 2) 入环点就是头节点
  h = buildCycle([1, 2], 0);
  node = detectCycle(h);
  eq('入环点为头节点', node === h, true);

  // 3) 无环返回 null
  eq('单节点无环', detectCycle(buildCycle([1], -1)), null);
  eq('空链表', detectCycle(null), null);
  eq('长链无环', detectCycle(buildCycle([1, 2, 3, 4, 5], -1)), null);

  // 4) 单节点自环
  h = buildCycle([7], 0);
  eq('自环入环节点', detectCycle(h) === h, true);

  // 5) 环入口在尾部（环长 2）
  h = buildCycle([1, 2, 3, 4], 3);
  node = detectCycle(h);
  eq('入口在最后一个节点', node && node.val, 4);

  // 6) 长链，入口在中间，验证节点引用而非仅值
  h = buildCycle([1, 2, 3, 4, 5, 6, 7, 8], 2);
  let target = h.next.next;
  eq('入口节点引用相同', detectCycle(h) === target, true);

  // 7) 值重复时仍能靠引用区分
  h = buildCycle([1, 1, 1, 1], 1);
  node = detectCycle(h);
  eq('重复值靠引用判定', node === h.next, true);

  console.log(`[142-环形链表II] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, detectCycle };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
