/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：23
 * 题目：合并 K 个升序链表（Merge k Sorted Lists）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/merge-k-sorted-lists/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个链表数组，每个链表都已经按升序排列。
 * 请你将所有链表合并到一个升序链表中，返回合并后的链表。
 * 链表数组中可能包含空链表（对应空数组），它们不参与合并。
 *
 * 【示例】
 * 输入：lists = [[1,4,5],[3,4,6],[7,8]]
 * 输出：[1,3,4,4,5,6,7,8]
 * 解释：三条升序链被归并成一条，重复的 4 各保留一个。
 *
 * 输入：lists = []
 * 输出：[]
 * 解释：没有任何链表可合并，返回空链表。
 *
 * 【提示】
 * k == lists.length，且 0 <= k <= 10^4
 * 0 <= lists[i].length <= 500
 * -10^4 <= lists[i][j] <= 10^4
 * lists[i] 按升序排列
 * sum(lists[i].length) <= 10^4
 *
 * 【算法思路】
 * 1、小顶堆（优先队列）多路归并：先把 k 条链表的当前头结点全部放进堆。
 * 2、每次弹出全局最小的结点接到结果链尾部，并把它的 next（若非空）压回堆。
 * 3、正确性：堆里始终保存着每条链尚未输出的最小结点，弹出顺序即所有结点的全局升序，结果链必然有序。
 * 4、堆的比较只看 val；每个结点入堆、出堆各至多一次，堆大小不超过 k，总代价 O(N log k)，优于逐条两两合并的 O(N log N) 与暴力选最小的 O(N k)。
 * 5、文件内自带数组实现的二叉堆（上浮下沉），不依赖任何外部库。
 * 6、等价写法是分治两两合并（参考实现），同样 O(N log k)，只是多占 O(log k) 递归栈。
 *
 * 【复杂度】
 * 时间复杂度：O(N log k)，N 为结点总数，k 为链表条数
 * 空间复杂度：O(k)，堆中至多 k 个结点引用
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
 * 二叉小顶堆（数组实现），比较函数由外部注入。
 */
class MinHeap {
  /**
   * @param {(a: any, b: any) => number} cmp 负数表示 a 优先
   */
  constructor(cmp) {
    this.heap = [];
    this.cmp = cmp;
  }

  size() {
    return this.heap.length;
  }

  /** 入堆：末尾插入后上浮 */
  push(x) {
    const h = this.heap;
    h.push(x);
    let i = h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(h[i], h[p]) < 0) {
        [h[i], h[p]] = [h[p], h[i]];
        i = p;
      } else break;
    }
  }

  /** 出堆：堆顶换到末尾后下沉，返回原堆顶 */
  pop() {
    const h = this.heap;
    if (h.length === 0) return undefined;
    const top = h[0];
    const last = h.pop();
    if (h.length > 0) {
      h[0] = last;
      let i = 0;
      const n = h.length;
      while (true) {
        let small = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && this.cmp(h[l], h[small]) < 0) small = l;
        if (r < n && this.cmp(h[r], h[small]) < 0) small = r;
        if (small === i) break;
        [h[i], h[small]] = [h[small], h[i]];
        i = small;
      }
    }
    return top;
  }
}

/**
 * 合并 k 条升序链表（小顶堆多路归并）。
 * @param {Array<ListNode | null>} lists
 * @return {ListNode | null}
 */
function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  const heap = new MinHeap((a, b) => a.val - b.val);
  for (const node of lists) {
    if (node !== null && node !== undefined) heap.push(node);
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size() > 0) {
    const node = heap.pop();
    tail.next = node;
    tail = node;
    if (node.next !== null) heap.push(node.next);
  }
  tail.next = null;
  return dummy.next;
}

/**
 * 合并两条升序链表（分治写法的基础工具）。
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
 * 合并 k 条升序链表（分治两两合并，同样 O(N log k)，作为参考实现）。
 * @param {Array<ListNode | null>} lists
 * @param {number} lo
 * @param {number} hi
 * @return {ListNode | null}
 */
function mergeKListsDivide(lists, lo = 0, hi = lists.length - 1) {
  if (lo > hi) return null;
  if (lo === hi) return lists[lo];
  const mid = (lo + hi) >> 1;
  return mergeTwoLists(mergeKListsDivide(lists, lo, mid), mergeKListsDivide(lists, mid + 1, hi));
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

  const L = (arrs) => arrs.map(buildList);

  eq('示例1 lists=[[1,4,5],[3,4,6],[7,8]]', listToArray(mergeKLists(L([[1, 4, 5], [3, 4, 6], [7, 8]]))), [1, 3, 4, 4, 5, 6, 7, 8]);
  eq('示例2 lists=[]', listToArray(mergeKLists([])), []);
  eq('lists=[[]]（单条空链表）', listToArray(mergeKLists([null])), []);
  eq('含空链表 lists=[[],[1]]', listToArray(mergeKLists([null, buildList([1])])), [1]);
  eq('单链表原样返回', listToArray(mergeKLists(L([[2, 3, 5]]))), [2, 3, 5]);
  eq('全相同值', listToArray(mergeKLists(L([[1, 1], [1]]))), [1, 1, 1]);
  eq('含负数', listToArray(mergeKLists(L([[-5, 0], [-3, 4], [1]]))), [-5, -3, 0, 1, 4]);
  eq('分治写法与堆写法结果一致', listToArray(mergeKListsDivide(L([[1, 4, 5], [3, 4, 6], [7, 8]]))), [1, 3, 4, 4, 5, 6, 7, 8]);
  eq('堆正确性（随机 50 条链）', (() => {
    const arrs = [];
    const all = [];
    for (let i = 0; i < 50; i++) {
      const len = i % 7;
      const a = [];
      for (let j = 0; j < len; j++) a.push(((i * 13 + j * 7) % 100) - 50);
      a.sort((x, y) => x - y);
      arrs.push(a);
      all.push(...a);
    }
    const expected = all.slice().sort((x, y) => x - y);
    return JSON.stringify(listToArray(mergeKLists(L(arrs)))) === JSON.stringify(expected);
  })(), true);

  console.log(`[23-合并K个升序链表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ListNode, buildList, listToArray, MinHeap, mergeKLists, mergeTwoLists, mergeKListsDivide };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
