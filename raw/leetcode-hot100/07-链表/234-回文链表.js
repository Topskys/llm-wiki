/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：234
 * 题目：回文链表（Palindrome Linked List）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/palindrome-linked-list/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个单链表的头节点 head，请你判断该链表是否为回文链表。
 * 回文指从前往后读与从后往前读节点值序列完全相同。
 * 若是回文返回 true，否则返回 false。要求尽量把空间复杂度降到 O(1)。
 *
 * 【示例】
 * 输入：head = [1,2,2,1]
 * 输出：true
 * 解释：正读 1,2,2,1 与倒读 1,2,2,1 相同，是回文链表。
 *
 * 输入：head = [1,2]
 * 输出：false
 * 解释：正读 1,2，倒读 2,1，两者不同。
 *
 * 【提示】
 * 链表中节点数目在范围 [1, 10^5] 内
 * 0 <= Node.val <= 9
 * 题目进阶要求：时间复杂度 O(n)、空间复杂度 O(1)
 *
 * 【算法思路】
 * 1、快慢指针定位中点：slow 每次走一步，fast 每次走两步，fast 到达末尾时 slow 恰在（偶数长度的）后半段起点。
 * 2、用 prev 指针在推进 slow 的同时原地反转前半段，得到指向前半段尾部的逆序链。
 * 3、然后让两个指针分别从「前半逆序头」和「后半顺序头」同步比较，遇到值不同立即返回 false。
 * 4、奇数长度时跳过中间那个节点（它不参与对称比较）。
 * 5、关键细节：反转必须在 slow 移动之前完成，且比较的节点个数取后半段长度。此写法只改指针方向，不申请新数组。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，定位中点、反转、比较各遍历常数次
 * 空间复杂度：O(1)，仅若干指针变量
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
 * 判断链表是否为回文链表（快慢指针 + 前半反转，O(1) 空间）。
 * @param {ListNode | null} head
 * @return {boolean}
 */
function isPalindrome(head) {
  if (!head || !head.next) return true;

  let slow = head;
  let fast = head;
  let prev = null; // 反转后的前半段头节点

  // fast 还能走两步时继续推进；推进过程中把 slow 走过的部分反转
  while (fast && fast.next) {
    fast = fast.next.next;

    const next = slow.next;
    slow.next = prev;
    prev = slow;
    slow = next;
  }

  // fast 非空说明长度为奇数，slow 此时正是中间节点，跳过它
  if (fast) slow = slow.next;

  // prev 指向前半段逆序的头，slow 指向后半段顺序的头，逐个比对
  while (slow) {
    if (prev.val !== slow.val) return false;
    prev = prev.next;
    slow = slow.next;
  }
  return true;
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

  eq('偶数回文 [1,2,2,1]', isPalindrome(buildList([1, 2, 2, 1])), true);
  eq('奇数回文 [1,2,3,2,1]', isPalindrome(buildList([1, 2, 3, 2, 1])), true);
  eq('非回文 [1,2]', isPalindrome(buildList([1, 2])), false);
  eq('非回文 [1,2,3]', isPalindrome(buildList([1, 2, 3])), false);
  eq('单节点 [7]', isPalindrome(buildList([7])), true);
  eq('空链表', isPalindrome(null), true);
  eq('两节点相同 [2,2]', isPalindrome(buildList([2, 2])), true);
  eq('两节点不同 [0,1]', isPalindrome(buildList([0, 1])), false);
  eq('长回文 6 位', isPalindrome(buildList([1, 2, 3, 3, 2, 1])), true);
  eq('长非回文 6 位', isPalindrome(buildList([1, 2, 3, 4, 2, 1])), false);
  eq('全相同 [5,5,5,5,5]', isPalindrome(buildList([5, 5, 5, 5, 5])), true);

  console.log(`[234-回文链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, isPalindrome };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
