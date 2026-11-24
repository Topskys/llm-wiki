/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：21
 * 题目：合并两个有序链表（Merge Two Sorted Lists）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/merge-two-sorted-lists/
 * ------------------------------------------------------------
 * 【题目描述】
 * 将两个升序链表合并为一个新的升序链表并返回。
 * 新链表是通过拼接给定的两个链表的所有节点组成的，
 * 也就是说只重新安排节点的 next 指针，不新建数据节点、不复制值。
 * 两个链表均按升序排列，合并结果也必须保持升序。
 *
 * 【示例】
 * 输入：l1 = [1,2,4], l2 = [1,3,4]
 * 输出：[1,1,2,3,4,4]
 * 解释：两个升序链表交叉取小，合并后仍为升序，节点总数为两者之和。
 *
 * 输入：l1 = [], l2 = []
 * 输出：[]
 * 解释：两个空链表合并结果仍为空链表。
 *
 * 输入：l1 = [], l2 = [0]
 * 输出：[0]
 * 解释：一个为空时结果就是另一个链表。
 *
 * 【提示】
 * 两个链表的节点数目范围是 [0, 50]
 * -100 <= Node.val <= 100
 * l1 和 l2 均按非递减顺序排列
 *
 * 【算法思路】
 * 1、哑节点（dummy head）+ 尾指针。dummy 是一个不存数据的哨兵节点，tail 始终指向已合并部分的最后一个节点，从而免去「第一个节点要特判」的麻烦，最终返回 dummy.next。
 * 2、循环中比较 l1 与 l2 的头值，把较小者接到 tail 后面并让该链表前进一格。
 * 3、由于两条链各自有序，取出的序列必然非递减，这就是归并排序 merge 步骤的链表版本。
 * 4、关键细节：条件用 l1 && l2（两者都非空才比较），退出循环后把剩余未空的那条链整段挂到 tail.next 即可，无需逐节点搬运。
 * 5、相等时取 l1 或 l2 都行，稳定性在本题不影响结果。
 *
 * 【复杂度】
 * 时间复杂度：O(m + n)，每个节点恰好被接一次
 * 空间复杂度：O(1)，只用了 dummy 与 tail 两个指针（未新建数据节点）
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
 * 合并两个升序链表为一个新的升序链表。
 * @param {ListNode | null} l1
 * @param {ListNode | null} l2
 * @return {ListNode | null} 合并后的头节点
 */
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0); // 哨兵节点，简化头节点的处理
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {   // 相等时优先取 l1，保证非递减
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 ? l1 : l2;   // 剩余部分本身有序，整段挂上
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

  eq('官方示例', listToArray(mergeTwoLists(buildList([1, 2, 4]), buildList([1, 3, 4]))), [1, 1, 2, 3, 4, 4]);
  eq('两个空链表', listToArray(mergeTwoLists(null, null)), []);
  eq('一侧为空', listToArray(mergeTwoLists(null, buildList([0]))), [0]);
  eq('另一侧为空', listToArray(mergeTwoLists(buildList([5, 6]), null)), [5, 6]);
  eq('单节点各一', listToArray(mergeTwoLists(buildList([2]), buildList([1]))), [1, 2]);
  eq('完全不相交区间', listToArray(mergeTwoLists(buildList([1, 3, 5]), buildList([2, 4, 6]))), [1, 2, 3, 4, 5, 6]);
  eq('含负数', listToArray(mergeTwoLists(buildList([-5, -1, 0]), buildList([-3, 2]))), [-5, -3, -1, 0, 2]);
  eq('值全相同', listToArray(mergeTwoLists(buildList([7, 7]), buildList([7]))), [7, 7, 7]);
  eq('长度差很大', listToArray(mergeTwoLists(buildList([1]), buildList([2, 3, 4, 5, 6]))), [1, 2, 3, 4, 5, 6]);

  // 结果非递减校验
  const res = listToArray(mergeTwoLists(buildList([1, 1, 3, 9]), buildList([0, 2, 2, 8])));
  eq('混合重复值', res, [0, 1, 1, 2, 2, 3, 8, 9]);
  eq('结果已排序', res.every((v, i) => i === 0 || res[i - 1] <= v), true);

  console.log(`[21-合并两个有序链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, mergeTwoLists };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
