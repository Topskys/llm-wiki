/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 13-堆
 * ------------------------------------------------------------
 * 题号：347
 * 题目：前 K 个高频元素（Top K Frequent Elements）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/top-k-frequent-elements/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums 和一个整数 k，请你返回其中出现频率前 k 高的元素。
 * 你可以按任意顺序返回答案。
 * 你必须设计并实现时间复杂度优于 O(n log n) 的算法。
 *
 * 【示例】
 * 输入: nums = [1,1,1,2,2,3], k = 2
 * 输出: [1,2]
 * 解释: 1 出现 3 次、2 出现 2 次、3 出现 1 次，前 2 高频为 1 和 2。
 *
 * 输入: nums = [1], k = 1
 * 输出: [1]
 *
 * 【提示】
 * 1 <= nums.length <= 10^5
 * k 的取值范围是 [1, 数组中不相同的元素的个数]
 * 题目数据保证答案唯一（前 k 个高频元素的集合是唯一的）
 *
 * 【算法思路】
 * 1、哈希表计数：统计每个元素的出现频次 count（Map）。
 * 2、问题归约：第一步完成后，只需从「频次」里取前 k 大，本文件给出 A、B 两种方案。
 * 3、方案 A 小顶堆（本文件主解法）：按频次维护容量为 k 的小顶堆，堆顶是「当前前 k 高频」里频次最低的那个，新元素频次更高就替换堆顶。
 * 4、方案 A 正确性论证：任何被弹出堆的元素，其频次都不高于堆内保留的 k 个元素，必然排在频次序的前 k 名之外，故最终堆内即答案；复杂度 O(n + m log k)，m 为不同元素个数，优于 O(n log n)。
 * 5、方案 B 桶排序（本文件附带 bucketTopK）：频次取值范围是 [1, n]，开 n+1 个桶，把频次为 f 的元素放进第 f 号桶，从高频桶向低频桶倒序收集，取满 k 个即停；复杂度 O(n)，是本题最优解。
 *
 * 【复杂度】
 * 时间复杂度：堆解法 O(n + m log k)；桶排序 O(n)
 * 空间复杂度：O(n)（计数表 + 堆或桶）
 * ============================================================
 */

/**
 * 小顶堆（按比较器排序，堆顶为「最小」）
 * JS 无内置堆，此处手写数组完全二叉树实现。
 */
class MinHeap {
  /**
   * @param {(a: any, b: any) => number} cmp - 比较器，返回负数表示 a 优先级更高
   */
  constructor(cmp) {
    this.cmp = cmp;
    /** @type {any[]} */
    this.data = [];
  }

  /** @return {number} 元素个数 */
  size() {
    return this.data.length;
  }

  /** @return {any} 堆顶 */
  peek() {
    return this.data[0];
  }

  /**
   * 插入元素并上浮
   * @param {any} v
   */
  push(v) {
    const a = this.data;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(a[p], a[i]) <= 0) break;
      const t = a[p];
      a[p] = a[i];
      a[i] = t;
      i = p;
    }
  }

  /**
   * 弹出堆顶并下沉
   * @return {any} 被弹出的堆顶
   */
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    const n = a.length;
    if (n > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let s = i;
        if (l < n && this.cmp(a[l], a[s]) < 0) s = l;
        if (r < n && this.cmp(a[r], a[s]) < 0) s = r;
        if (s === i) break;
        const t = a[s];
        a[s] = a[i];
        a[i] = t;
        i = s;
      }
    }
    return top;
  }
}

/**
 * 主解法：哈希计数 + 容量为 k 的小顶堆（按频次比较）
 * @param {number[]} nums - 整数数组
 * @param {number} k - 取前 k 个高频
 * @return {number[]} 出现频率前 k 高的元素（顺序任意）
 */
function topKFrequent(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);

  const heap = new MinHeap((a, b) => a[1] - b[1]); // a[0]=元素, a[1]=频次
  for (const [val, freq] of count) {
    if (heap.size() < k) {
      heap.push([val, freq]);
    } else if (freq > heap.peek()[1]) {
      heap.pop();
      heap.push([val, freq]);
    }
  }

  const res = [];
  while (heap.size() > 0) res.push(heap.pop()[0]);
  return res;
}

/**
 * 备选解法：桶排序（频次即桶下标，倒序收集）
 * @param {number[]} nums - 整数数组
 * @param {number} k - 取前 k 个高频
 * @return {number[]} 出现频率前 k 高的元素（顺序任意）
 */
function bucketTopK(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);

  const n = nums.length;
  const buckets = new Array(n + 1); // buckets[f] = 频次为 f 的元素列表
  for (const [val, freq] of count) {
    if (!buckets[freq]) buckets[freq] = [];
    buckets[freq].push(val);
  }

  const res = [];
  for (let f = n; f >= 1 && res.length < k; f--) {
    if (buckets[f]) res.push(...buckets[f]);
  }
  return res.slice(0, k);
}

// ============================== 测试 ==============================
function runTests() {
  const eq = (label, actual, expected) => {
    // 本题答案顺序不唯一，比较前先各自升序排序
    const a = JSON.stringify([...actual].sort((x, y) => x - y));
    const e = JSON.stringify([...expected].sort((x, y) => x - y));
    if (a === e) {
      pass++;
    } else {
      fail++;
      console.error(`✗ ${label}`);
      console.error(`  期望: ${e}`);
      console.error(`  实际: ${a}`);
    }
  };
  let pass = 0;
  let fail = 0;

  eq('示例1', topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]);
  eq('示例2 单元素', topKFrequent([1], 1), [1]);
  eq('k=1 取最高频', topKFrequent([4, 4, 4, 2, 2, 1], 1), [4]);
  eq('k=m 全取', topKFrequent([1, 2, 2, 3, 3, 3], 3), [1, 2, 3]);
  eq('频次相同', topKFrequent([1, 2], 2), [1, 2]);
  eq('含负数', topKFrequent([-1, -1, -2, -2, -2, 3], 2), [-2, -1]);
  eq('桶排序示例1', bucketTopK([1, 1, 1, 2, 2, 3], 2), [1, 2]);
  eq('桶排序含负数', bucketTopK([-1, -1, -2, -2, -2, 3], 2), [-2, -1]);
  eq('桶与堆一致', bucketTopK([5, 5, 5, 4, 4, 3, 3, 3, 3, 1], 3), topKFrequent([5, 5, 5, 4, 4, 3, 3, 3, 3, 1], 3));

  console.log(`[347-前K个高频元素] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { topKFrequent, bucketTopK, MinHeap };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
