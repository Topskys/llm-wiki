/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 13-堆
 * ------------------------------------------------------------
 * 题号：215
 * 题目：数组中的第K个最大元素（Kth Largest Element in an Array）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/kth-largest-element-in-an-array/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
 * 注意：要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
 * 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。
 *
 * 【示例】
 * 输入: [3,2,1,5,6,4], k = 2
 * 输出: 5
 *
 * 输入: [3,2,3,1,2,4,5,5,6], k = 4
 * 输出: 4
 *
 * 【提示】
 * 1 <= k <= nums.length <= 10^5
 * -10^4 <= nums[i] <= 10^4
 *
 * 【算法思路】
 * 1、堆语义：维护一个容量为 k 的小顶堆，堆顶是「当前最大的 k 个数」里最小的那个，
 *    也就是全局第 k 大元素的候选。
 * 2、扫描：逐个元素入堆，一旦容量超过 k 就弹出堆顶，淘汰这 k 个里最小的。
 * 3、正确性（局部最优推全局最优）：被弹出的元素比堆内所有元素都小，
 *    永远不可能成为第 k 大，故任意时刻堆内恰保有已扫描元素中最大的 k 个，
 *    全部扫描结束后堆顶即为答案。
 * 4、JS 无内置堆，文件内用数组完全二叉树 + 上浮/下沉手写 MinHeap。
 * 5、对比快速选择（附 quickSelect）：基于 partition 只递归目标一侧，平均 O(n)
 *    满足题目 O(n) 要求，但最坏 O(n^2)（随机化 pivot 可高概率避免）；
 *    堆解法 O(n log k) 稳定、不改原数组，天然适用于数据流与 k << n 场景。
 *
 * 【复杂度】
 * 时间复杂度：O(n log k)（堆解法）；快速选择平均 O(n)、最坏 O(n^2)
 * 空间复杂度：O(k)（堆数组）；快速选择为 O(log n) 递归栈
 * ============================================================
 */

/**
 * 小顶堆：堆顶最小，提供 push / pop / peek / size。
 * JS 无内置堆，此处用数组完全二叉树 + 上浮下沉手写实现。
 */
class MinHeap {
  constructor() {
    /** @type {number[]} */
    this.data = [];
  }

  /** @return {number} 元素个数 */
  size() {
    return this.data.length;
  }

  /** @return {number|undefined} 堆顶（最小值） */
  peek() {
    return this.data[0];
  }

  /**
   * 插入元素并上浮维护堆序
   * @param {number} v
   * @return {MinHeap} this，便于链式调用
   */
  push(v) {
    const a = this.data;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p] <= a[i]) break;
      const t = a[p];
      a[p] = a[i];
      a[i] = t;
      i = p;
    }
    return this;
  }

  /**
   * 弹出堆顶并下沉维护堆序
   * @return {number|undefined} 被弹出的堆顶
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
        if (l < n && a[l] < a[s]) s = l;
        if (r < n && a[r] < a[s]) s = r;
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
 * 主解法：容量为 k 的小顶堆
 * @param {number[]} nums - 整数数组
 * @param {number} k - 第 k 个最大
 * @return {number} 数组中第 k 个最大的元素
 */
function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (let i = 0; i < nums.length; i++) {
    heap.push(nums[i]);
    if (heap.size() > k) heap.pop();
  }
  return heap.peek();
}

/**
 * 分区：把 a[lo..hi] 按 pivot  rearrange，返回 pivot 最终下标
 * @param {number[]} a
 * @param {number} lo
 * @param {number} hi
 * @return {number} pivot 下标
 */
function partition(a, lo, hi) {
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  const tmp = a[r];
  a[r] = a[hi];
  a[hi] = tmp;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
      i++;
    }
  }
  const t2 = a[i];
  a[i] = a[hi];
  a[hi] = t2;
  return i;
}

/**
 * 备选解法：快速选择（迭代版，随机化 pivot）
 * 只递归第 k 大所在的那一半，平均 O(n)
 * @param {number[]} nums - 整数数组（不修改原数组）
 * @param {number} k - 第 k 个最大
 * @return {number} 数组中第 k 个最大的元素
 */
function quickSelect(nums, k) {
  const a = nums.slice();
  const target = a.length - k; // 升序排列后第 k 大落在下标 target
  let lo = 0;
  let hi = a.length - 1;
  while (lo <= hi) {
    const p = partition(a, lo, hi);
    if (p === target) return a[p];
    if (p < target) lo = p + 1;
    else hi = p - 1;
  }
  return NaN;
}

// ============================== 测试 ==============================
function runTests() {
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      pass++;
    } else {
      fail++;
      console.error(`✗ ${label}`);
      console.error(`  期望: ${JSON.stringify(expected)}`);
      console.error(`  实际: ${JSON.stringify(actual)}`);
    }
  };
  let pass = 0;
  let fail = 0;

  eq('示例1', findKthLargest([3, 2, 1, 5, 6, 4], 2), 5);
  eq('示例2', findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4);
  eq('k=1 即最大值', findKthLargest([9, -2, 7, 0, 3], 1), 9);
  eq('k=n 即最小值', findKthLargest([9, -2, 7, 0, 3], 5), -2);
  eq('单元素', findKthLargest([42], 1), 42);
  eq('全相同', findKthLargest([5, 5, 5, 5], 3), 5);
  eq('含负数', findKthLargest([-1, -2, -3, -4], 2), -2);
  eq('两元素', findKthLargest([1, 2], 2), 1);

  const big = [7, 3, 9, 1, 5, 8, 2, 6, 4, 0, 9, 3];
  eq('堆与快速选择一致', quickSelect(big, 5), findKthLargest(big, 5));
  eq('快速选择示例1', quickSelect([3, 2, 1, 5, 6, 4], 2), 5);

  console.log(`[215-数组中的第K个最大元素] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { findKthLargest, quickSelect, MinHeap };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
