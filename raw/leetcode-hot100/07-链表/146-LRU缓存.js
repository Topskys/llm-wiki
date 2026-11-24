/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 07-链表
 * ------------------------------------------------------------
 * 题号：146
 * 题目：LRU 缓存（LRU Cache）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/lru-cache/
 * ------------------------------------------------------------
 * 【题目描述】
 * 请你设计并实现一个满足 LRU（最近最少使用）缓存约束的数据结构。
 * 实现 LRUCache 类：
 * LRUCache(capacity) 以正整数作为容量初始化 LRU 缓存；
 * get(key) 如果关键字 key 存在于缓存中，则返回其值，否则返回 -1；
 * put(key, value) 如果关键字 key 已经存在，则变更其值；如果不存在，
 * 则向缓存中插入该组键值。如果插入操作导致关键字数量超过 capacity ，
 * 则应该逐出最久未使用的关键字。
 * 函数 get 与 put 必须以 O(1) 的平均时间复杂度运行。
 *
 * 【示例】
 * 输入：操作序列
 * ["LRUCache","put","put","get","put","get","put","get","get","get"]
 * [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
 * 输出：[null,null,null,1,null,-1,null,-1,3,4]
 * 解释：容量为 2。put(1,1) 与 put(2,2) 后缓存为 {1:1, 2:2}；
 * get(1) 命中返回 1，并把 1 标记为最近使用；
 * put(3,3) 超出容量，逐出最久未使用的 2，缓存为 {1:1, 3:3}；
 * get(2) 未命中返回 -1；
 * put(4,4) 逐出最久未使用的 1，缓存为 {3:3, 4:4}；
 * get(1) 返回 -1，get(3) 返回 3（并刷新为最近使用），get(4) 返回 4。
 *
 * 【提示】
 * 1 <= capacity <= 3000
 * 0 <= key <= 10^4
 * 0 <= value <= 10^4
 * 最多调用 2 * 10^5 次 get 和 put
 *
 * 【算法思路】
 * 1、双向链表 + 哈希表分工：哈希表按 key 均摊 O(1) 定位结点，链表维护最近使用顺序，表头侧最新、表尾侧最旧。
 * 2、每次 get 命中或 put 写入、更新，都把对应结点移动到链表头部（touch）。
 * 3、容量满时淘汰链表尾部那个结点，它恰是哈希表里最久未使用的一项，即 LRU 候选。
 * 4、正确性：结点移动严格跟随每一次访问，链表从头到尾即按最后使用时间从新到旧排序，淘汰尾部符合 LRU 定义。
 * 5、用哨兵 head/tail 两个哑结点，插入删除不必判空或特判首尾；哈希表存的就是结点本身，删除只需 O(1) 改前后指针。
 * 6、极简替代写法 LRUCacheMap（参考实现）：利用 JS Map 保持插入顺序，读写都先删后插把 key 顶到末尾，超限时删除第一个 key。
 *
 * 【复杂度】
 * 时间复杂度：O(1)，get 与 put 均为哈希查找 + 常数次指针操作
 * 空间复杂度：O(capacity)，哈希表与链表各存不超过 capacity 个结点
 * ============================================================
 */

/**
 * LRU 内部双向链表结点。
 */
class DLinkedNode {
  /**
   * @param {number} key
   * @param {number} value
   * @param {DLinkedNode | null} prev
   * @param {DLinkedNode | null} next
   */
  constructor(key = 0, value = 0, prev = null, next = null) {
    this.key = key;
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

/**
 * LRU 缓存：双向链表维护使用顺序，哈希表 O(1) 定位。
 */
class LRUCache {
  /**
   * @param {number} capacity 缓存容量，正整数
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> DLinkedNode
    this.head = new DLinkedNode(); // 哨兵：head.next 是最近使用
    this.tail = new DLinkedNode(); // 哨兵：tail.prev 是最久未使用
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /** 从链表摘出结点（不碰哈希表） */
  _unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.prev = node.next = null;
  }

  /** 把结点插到哨兵 head 之后，标记为最近使用 */
  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  /**
   * 读取缓存。命中则刷新为最近使用并返回值，否则返回 -1。
   * @param {number} key
   * @return {number}
   */
  get(key) {
    const node = this.map.get(key);
    if (node === undefined) return -1;
    this._unlink(node);
    this._addToFront(node);
    return node.value;
  }

  /**
   * 写入缓存。已存在则改值并刷新；不存在则插入，超限逐出尾部结点。
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.capacity <= 0) return; // 防御：容量为 0 时不缓存任何数据
    const existed = this.map.get(key);
    if (existed !== undefined) {
      existed.value = value;
      this._unlink(existed);
      this._addToFront(existed);
      return;
    }
    const node = new DLinkedNode(key, value);
    this.map.set(key, node);
    this._addToFront(node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev; // 链表尾部即最久未使用
      this._unlink(lru);
      this.map.delete(lru.key);
    }
  }

  /**
   * 当前缓存内容快照（按最近使用在前排序），仅用于测试观察。
   * @return {Array<[number, number]>}
   */
  snapshot() {
    const out = [];
    for (let cur = this.head.next; cur !== this.tail; cur = cur.next) out.push([cur.key, cur.value]);
    return out;
  }
}

/**
 * LRU 缓存参考实现：借助 JS Map 的插入顺序特性，代码更短。
 * 规则：任何读写都先删后插，把 key 顶到「最新」的末尾；
 * 超限时 Map.keys().next().value 就是最久未使用的 key。
 */
class LRUCacheMap {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  /**
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.map.has(key)) return -1;
    const v = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, v);
    return v;
  }

  /**
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.capacity <= 0) return;
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) this.map.delete(this.map.keys().next().value);
  }
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

  // 官方示例：按操作序列断言输出数组
  const ops = ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'];
  const args = [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]];
  const runOfficial = (Cls) => {
    const out = [];
    let cache = null;
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === 'LRUCache') {
        cache = new Cls(args[i][0]);
        out.push(null);
      } else if (ops[i] === 'put') {
        cache.put(args[i][0], args[i][1]);
        out.push(null);
      } else {
        out.push(cache.get(args[i][0]));
      }
    }
    return out;
  };
  const expectedOfficial = [null, null, null, 1, null, -1, null, -1, 3, 4];

  eq('官方示例操作序列（双向链表版）', runOfficial(LRUCache), expectedOfficial);
  eq('官方示例操作序列（Map 版）', runOfficial(LRUCacheMap), expectedOfficial);
  eq('get 未命中返回 -1', (() => { const c = new LRUCache(2); return c.get(99); })(), -1);
  eq('put 覆盖已有 key 不逐出', (() => {
    const c = new LRUCache(2);
    c.put(1, 1); c.put(2, 2); c.put(1, 10); c.put(3, 3);
    return [c.get(1), c.get(2), c.get(3)];
  })(), [10, -1, 3]);
  eq('get 刷新使用顺序（逐出对象随之改变）', (() => {
    const c = new LRUCache(2);
    c.put(1, 1); c.put(2, 2);
    c.get(1);        // 1 变为最近使用，2 成为最久未使用
    c.put(3, 3);     // 应逐出 2 而不是 1
    return [c.get(1), c.get(2), c.get(3)];
  })(), [1, -1, 3]);
  eq('容量 1 每次写入都逐出前一个', (() => {
    const c = new LRUCache(1);
    c.put(1, 1); c.put(2, 2);
    return [c.get(1), c.get(2)];
  })(), [-1, 2]);
  eq('snapshot 顺序为最近使用在前', (() => {
    const c = new LRUCache(3);
    c.put(1, 1); c.put(2, 2); c.put(3, 3); c.get(1); c.put(2, 20);
    return c.snapshot();
  })(), [[2, 20], [1, 1], [3, 3]]);
  eq('大规模随机操作与 Map 版行为一致', (() => {
    const a = new LRUCache(5);
    const b = new LRUCacheMap(5);
    let same = true;
    for (let i = 0; i < 400; i++) {
      const key = (i * 31) % 11;
      if (i % 3 === 0) {
        a.put(key, i); b.put(key, i);
      } else {
        if (a.get(key) !== b.get(key)) same = false;
      }
    }
    return same;
  })(), true);

  console.log(`[146-LRU缓存] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DLinkedNode, LRUCache, LRUCacheMap };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
