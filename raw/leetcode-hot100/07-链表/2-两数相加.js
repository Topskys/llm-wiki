/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：2
 * 题目：两数相加（Add Two Numbers）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/add-two-numbers/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式
 * 存储的，并且每个节点只能存储一位数字。请你将两个数相加，并以相同形式
 * 返回一个表示和的链表。假设除了数字 0 之外，这两个数都不会以 0 开头。
 * 逆序存储意味着链表头就是个位，因此可以从最低位开始逐位相加，
 * 与竖式加法方向一致，进位自然向后传递。
 *
 * 【示例】
 * 输入：l1 = [2,4,3], l2 = [5,6,4]
 * 输出：[7,0,8]
 * 解释：342 + 465 = 807。个位 2+5=7，十位 4+6=10 写 0 进 1，
 * 百位 3+4+1=8，故结果为 [7,0,8]。
 *
 * 输入：l1 = [0], l2 = [0]
 * 输出：[0]
 * 解释：0 + 0 = 0。
 *
 * 输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
 * 输出：[8,9,9,9,0,0,0,1]
 * 解释：9999999 + 9999 = 10009998，逆序写出即 [8,9,9,9,0,0,0,1]，
 * 高位连续进位后结果链表的长度比最长输入还多一位。
 *
 * 【提示】
 * 每个链表中的节点数在范围 [1, 100] 内
 * 0 <= Node.val <= 9
 * 题目数据保证列表不包含前导零（数字 0 本身除外）
 * 链表长度可达 100 位，远超 JS 安全整数范围，必须逐位计算，不能先转成数字
 *
 * 【算法思路】
 * 1、哑节点 + 逐位模拟竖式加法。用 carry 保存进位（只可能是 0 或 1）。
 * 2、每一轮取 l1、l2 当前节点的值（链表走完则视为 0，等价于高位补 0），sum = a + b + carry，新节点存 sum % 10，carry 更新为 Math.floor(sum / 10)。
 * 3、循环条件为 l1 || l2 || carry：只要还有未处理的位或还有进位就继续，因此最高位进位（如 999+1）会自动多出一个新节点。
 * 4、关键细节：tail.next 要先建好新节点再前移 tail；l1、l2 为空时不能解引用，需写成 l1 ? l1.val : 0。
 * 5、结果链表除 0 外不含前导零，因为最高位为 0 时它根本不会被创建。
 *
 * 【复杂度】
 * 时间复杂度：O(max(m, n))，遍历较长链表一遍
 * 空间复杂度：O(max(m, n))，结果链表位数不超过较长者加一位
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
 * 两个逆序存储的数字链表相加，返回同样逆序存储的结果链表。
 * @param {ListNode | null} l1
 * @param {ListNode | null} l2
 * @return {ListNode} 表示和的链表头节点
 */
function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    const a = l1 ? l1.val : 0; // 较短链表高位补 0
    const b = l2 ? l2.val : 0;
    const sum = a + b + carry;
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = Math.floor(sum / 10);
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
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
  const add = (a, b) => listToArray(addTwoNumbers(buildList(a), buildList(b)));

  eq('342 + 465', add([2, 4, 3], [5, 6, 4]), [7, 0, 8]);
  eq('0 + 0', add([0], [0]), [0]);
  eq('进位贯穿', add([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]), [8, 9, 9, 9, 0, 0, 0, 1]);
  eq('单节点无进位', add([5], [4]), [9]);
  eq('单节点有进位', add([5], [5]), [0, 1]);
  eq('长度不等补零', add([1], [9, 9, 9]), [0, 0, 0, 1]);
  eq('0 + 多位数', add([0], [1, 2, 3]), [1, 2, 3]);
  eq('高位结果不为 0', add([0, 0, 1], [0, 0, 1]), [0, 0, 2]);
  eq('1 + 999', add([1], [9, 9, 9]), [0, 0, 0, 1]);

  // 100 位全 9 相加：结果应为 1 后跟 100 个 0（逆序存储即 [0 x100, 1]）
  const wide = add(new Array(100).fill(9), [1]);
  eq('100 位加 1 的位数', wide.length, 101);
  eq('100 位加 1 低位全 0', wide.slice(0, 100).every((v) => v === 0), true);
  eq('100 位加 1 最高位为 1', wide[100], 1);

  // 输入链表未被修改
  const l1 = buildList([2, 4, 3]);
  addTwoNumbers(l1, buildList([5, 6, 4]));
  eq('输入链表保持不变', listToArray(l1), [2, 4, 3]);

  console.log(`[2-两数相加] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, addTwoNumbers };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
