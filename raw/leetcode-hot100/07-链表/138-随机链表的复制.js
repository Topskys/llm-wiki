/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：138
 * 题目：随机链表的复制（Copy List with Random Pointer）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/copy-list-with-random-pointer/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个结点链表的头节点 head ，每个结点额外包含一个 random 指针，
 * 该指针指向链表中的任何一个结点，也可以指向 null 。
 * 请构造一个深拷贝：返回一份全新的链表，新链表的每个结点都是新创建的对象，
 * 其 val 与 next、random 的指向关系都与原链表一一对应，
 * 不允许把新结点的指针指向原链表中的任何结点。
 *
 * 【示例】
 * 输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
 * 输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
 * 解释：每个结点写成 [val, random_index]，random_index 是 random 指向
 * 结点的下标；拷贝后结构与原链表完全一致，但所有结点都是新建对象。
 *
 * 输入：head = [[3,0],[3,null]]
 * 输出：[[3,0],[3,null]]
 * 解释：两个结点 val 相同，第一个结点的 random 指向自己。
 *
 * 【提示】
 * 0 <= 链表长度 <= 1000
 * 0 <= Node.val <= 1000
 * random 指向链表中的某个结点或 null
 *
 * 【算法思路】
 * 1、哈希映射法（本文件主实现）：第一趟遍历为每个原结点创建克隆，并以「原结点 -> 新结点」存入 Map。
 * 2、第二趟遍历按原链表的 next 与 random 关系，从 Map 查出对应新结点依次连接。
 * 3、正确性：映射是双射，新链表拓扑必与原链表同构，且所有结点都是新建对象，即为深拷贝。
 * 4、O(1) 空间的交织法（参考实现）：先在每个原结点 A 后插入克隆 A'，令 A'.random = A.random.next，即 A 的 random 的克隆体。
 * 5、random 连接完成后把全部 A' 摘出组成新链表，同时还原原链表结构。
 * 6、交织法省掉哈希表但会临时改动原链表，工程上更常用哈希法。
 *
 * 【复杂度】
 * 哈希法：时间复杂度 O(n)，两趟遍历 + 均摊 O(1) 查表；空间复杂度 O(n)，Map 存 n 个映射
 * 交织法：时间复杂度 O(n)，三趟遍历；空间复杂度 O(1)，不计返回的链表
 * ============================================================
 */

/**
 * 带 random 指针的链表结点定义（与 LeetCode 官方一致）。
 */
class Node {
  /**
   * @param {number} val
   * @param {Node | null} next
   * @param {Node | null} random
   */
  constructor(val = 0, next = null, random = null) {
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

/**
 * 由 [val, randomIndex] 数组构造带 random 的链表，返回头节点。
 * @param {Array<[number, number | null]>} spec
 * @return {Node | null}
 */
function buildRandomList(spec) {
  if (!spec || spec.length === 0) return null;
  const nodes = spec.map(([v]) => new Node(v));
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].next = i + 1 < nodes.length ? nodes[i + 1] : null;
    const ri = spec[i][1];
    nodes[i].random = ri === null || ri === undefined ? null : nodes[ri];
  }
  return nodes[0];
}

/**
 * 链表转 [val, randomIndex] 数组，便于断言比较。
 * @param {Node | null} head
 * @return {Array<[number, number | null]>}
 */
function randomListToArray(head) {
  const order = new Map();
  const out = [];
  let idx = 0;
  for (let cur = head; cur !== null; cur = cur.next) {
    order.set(cur, idx++);
    out.push([cur.val, null]);
  }
  idx = 0;
  for (let cur = head; cur !== null; cur = cur.next, idx++) {
    out[idx][1] = cur.random === null ? null : order.get(cur.random);
  }
  return out;
}

/**
 * 深拷贝带 random 指针的链表（哈希映射法）。
 * @param {Node | null} head
 * @return {Node | null}
 */
function copyRandomList(head) {
  if (head === null) return null;
  // 第一趟：原结点 -> 新结点
  const map = new Map();
  for (let cur = head; cur !== null; cur = cur.next) map.set(cur, new Node(cur.val));
  // 第二趟：按原结构连接 next 与 random
  for (const [oldNode, newNode] of map) {
    newNode.next = oldNode.next ? map.get(oldNode.next) : null;
    newNode.random = oldNode.random ? map.get(oldNode.random) : null;
  }
  return map.get(head);
}

/**
 * 深拷贝带 random 指针的链表（O(1) 额外空间的交织法，仅作参考实现）。
 * @param {Node | null} head
 * @return {Node | null}
 */
function copyRandomListInterleave(head) {
  if (head === null) return null;
  // 1) 交织：A -> A' -> B -> B' ...
  for (let cur = head; cur !== null; cur = cur.next.next) {
    const clone = new Node(cur.val, cur.next);
    cur.next = clone;
  }
  // 2) 连接 random：克隆体的 random 是原 random 的下一个（即其克隆体）
  for (let cur = head; cur !== null; cur = cur.next.next) {
    if (cur.random !== null) cur.next.random = cur.random.next;
  }
  // 3) 拆分两条链表，同时还原原链表结构
  const newHead = head.next;
  for (let cur = head; cur !== null; cur = cur.next) {
    const clone = cur.next;
    cur.next = clone.next;
    clone.next = clone.next ? clone.next.next : null;
  }
  return newHead;
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

  const s1 = [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]];
  eq('示例1 哈希法', randomListToArray(copyRandomList(buildRandomList(s1))), s1);
  eq('示例1 交织法', randomListToArray(copyRandomListInterleave(buildRandomList(s1))), s1);
  eq('自指向 head=[[3,0],[3,null]]', randomListToArray(copyRandomList(buildRandomList([[3, 0], [3, null]]))), [[3, 0], [3, null]]);
  eq('全 null random head=[[1,null],[2,null]]', randomListToArray(copyRandomList(buildRandomList([[1, null], [2, null]]))), [[1, null], [2, null]]);
  eq('空链表', randomListToArray(copyRandomList(null)), []);
  eq('单节点 random 指向自己', randomListToArray(copyRandomList(buildRandomList([[5, 0]]))), [[5, 0]]);
  eq('深拷贝验证（新结点不是原对象）', (() => {
    const head = buildRandomList(s1);
    const copy = copyRandomList(head);
    let sharesNode = false;
    for (let a = head, b = copy; a !== null && b !== null; a = a.next, b = b.next) {
      if (a === b) sharesNode = true;
      if (a.random !== null && a.random === b.random) sharesNode = true;
    }
    return sharesNode;
  })(), false);
  eq('交织法不破坏原链表', (() => {
    const head = buildRandomList(s1);
    copyRandomListInterleave(head);
    return randomListToArray(head);
  })(), s1);

  console.log(`[138-随机链表的复制] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Node, buildRandomList, randomListToArray, copyRandomList, copyRandomListInterleave };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
