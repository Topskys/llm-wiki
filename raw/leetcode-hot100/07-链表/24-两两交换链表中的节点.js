/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：24
 * 题目：两两交换链表中的节点（Swap Nodes in Pairs）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/swap-nodes-in-pairs/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个链表，两两交换其中相邻的结点，并返回交换后链表的头结点。
 * 你必须在不修改结点内部的值的情况下完成本题（即只能进行结点交换，
 * 不允许简单地只把 val 互换）。
 *
 * 【示例】
 * 输入：head = [1,2,3,4]
 * 输出：[2,1,4,3]
 * 解释：(1,2) 与 (3,4) 各自成对交换指针，得到 2->1->4->3。
 *
 * 输入：head = [1,2,3]
 * 输出：[2,1,3]
 * 解释：奇数长度时最后落单的结点 3 保持原位不动。
 *
 * 【提示】
 * 链表中结点的数目在 [0, 100] 范围内
 * 0 <= Node.val <= 100
 *
 * 【算法思路】
 * 1、哑节点 + 三指针迭代，做真正的指针级交换，全程不修改任何结点的 val。
 * 2、每轮以 prev（已处理部分的尾）为基准考察 prev 之后的 a、b 两结点。
 * 3、交换只需三步改指针：prev.next = b、a.next = b.next、b.next = a。
 * 4、交换后 a 变成这一对的尾巴，下一轮直接令 prev = a 前进。
 * 5、循环条件为 prev.next 与 prev.next.next 均非空，落单的尾结点自然保留原位。
 * 6、哑节点让「新的头结点是原第二个结点」这一变化被统一处理，无需特判头指针。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个结点被访问常数次
 * 空间复杂度：O(1)，迭代写法只用了几个指针变量
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
 * 两两交换链表中的相邻结点（指针级交换，不改 val）。
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
function swapPairs(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  // 只要还剩至少两个结点就继续交换
  while (prev.next !== null && prev.next.next !== null) {
    const a = prev.next;
    const b = a.next;
    a.next = b.next; // a 变成这一对的尾
    b.next = a;      // b 指向 a，完成交换
    prev.next = b;   // 前驱接回新的头
    prev = a;        // 前进到下一对之前
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

  eq('示例1 head=[1,2,3,4]', listToArray(swapPairs(buildList([1, 2, 3, 4]))), [2, 1, 4, 3]);
  eq('示例2 head=[1,2,3]（奇数长度）', listToArray(swapPairs(buildList([1, 2, 3]))), [2, 1, 3]);
  eq('单节点 head=[1]', listToArray(swapPairs(buildList([1]))), [1]);
  eq('空链表 head=[]', listToArray(swapPairs(null)), []);
  eq('两节点 head=[1,2]', listToArray(swapPairs(buildList([1, 2]))), [2, 1]);
  eq('指针级交换验证（对象身份互换）', (() => {
    const n1 = new ListNode(1);
    const n2 = new ListNode(2);
    n1.next = n2;
    const newHead = swapPairs(n1);
    return [newHead === n2, newHead.next === n1];
  })(), [true, true]);

  console.log(`[24-两两交换链表中的节点] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, swapPairs };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
