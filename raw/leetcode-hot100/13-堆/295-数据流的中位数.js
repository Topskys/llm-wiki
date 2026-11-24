/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 13-堆
 * ------------------------------------------------------------
 * 题号：295
 * 题目：数据流的中位数（Find Median from Data Stream）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/find-median-from-data-stream/
 * ------------------------------------------------------------
 * 【题目描述】
 * 中位数是有序整数列表中的中间值。如果列表的大小是偶数，
 * 则没有中间值，中位数是两个中间值的平均值。
 * 例如 [2,3,4] 的中位数是 3；[2,3] 的中位数是 (2+3)/2 = 2.5。
 * 实现 MedianFinder 类:
 * MedianFinder() 初始化对象。
 * void addNum(int num) 将整数 num 添加到数据流中。
 * double findMedian() 返回目前所有元素的中位数。
 *
 * 【示例】
 * 输入：["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
 *       [[], [1], [2], [], [3], []]
 * 输出：[null, null, null, 1.5, null, 2.0]
 * 解释：添加 1、2 后数据为 [1,2]，中位数 (1+2)/2 = 1.5；
 *       再添加 3 后数据为 [1,2,3]，中位数为 2.0。
 *
 * 【提示】
 * -10^4 <= num <= 10^4
 * 调用 addNum 和 findMedian 总共不会超过 5 * 10^4 次
 * 保证任何时候 findMedian 时数据流均不为空
 *
 * 【算法思路】
 * 1、对顶堆：把有序序列从中间劈成两半，大顶堆 lo 存较小的一半，小顶堆 hi 存较大的一半。
 * 2、不变式：lo.size == hi.size 或 lo.size == hi.size + 1，且 lo 中所有元素 <= hi 中所有元素（堆顶即分界点）。
 * 3、为什么局部最优推出全局最优：中位数只依赖「中间那一个/两个」元素，而它们恰好就是两个堆的堆顶。
 * 4、堆序性质保证堆顶分别是下半区的最大值与上半区的最小值，无需整体排序即可 O(1) 取出。
 * 5、维护策略：先放进 lo（取负入小顶堆模拟大顶堆），把 lo 堆顶溢出到 hi 以保持「lo 全部 <= hi 全部」；再在 hi 过大时回填，以保持数量平衡。
 * 6、堆实现：JS 无内置堆，文件内自带 MinHeap，大顶堆由 key 取负实现。
 *
 * 【复杂度】
 * 时间复杂度：addNum O(log n)（两次堆调整）；findMedian O(1)
 * 空间复杂度：O(n)，两个堆共存放全部元素
 * ============================================================
 */

/**
 * 小顶堆：数组完全二叉树 + 上浮下沉，JS 无内置堆故手写。
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
 * 数据流中位数查找器（对顶堆）
 */
class MedianFinder {
  constructor() {
    this.lo = new MinHeap(); // 较小的一半，存 -x 模拟大顶堆，堆顶取负即最大值
    this.hi = new MinHeap(); // 较大的一半，标准小顶堆，堆顶即最小值
  }

  /**
   * 向数据流添加一个数
   * @param {number} num
   * @return {void}
   */
  addNum(num) {
    this.lo.push(-num);
    this.hi.push(-this.lo.pop());
    if (this.hi.size() > this.lo.size()) {
      this.lo.push(-this.hi.pop());
    }
  }

  /**
   * 返回当前所有元素的中位数
   * @return {number}
   */
  findMedian() {
    if (this.lo.size() > this.hi.size()) return -this.lo.peek();
    return (-this.lo.peek() + this.hi.peek()) / 2;
  }
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

  // 官方示例操作序列
  const mf = new MedianFinder();
  mf.addNum(1);
  eq('官方示例 addNum(1) 后', mf.findMedian(), 1);
  mf.addNum(2);
  eq('官方示例 addNum(2) 后', mf.findMedian(), 1.5);
  mf.addNum(3);
  eq('官方示例 addNum(3) 后', mf.findMedian(), 2);

  const m2 = new MedianFinder();
  m2.addNum(-1);
  eq('单元素负数', m2.findMedian(), -1);
  m2.addNum(-3);
  eq('两元素降序到达', m2.findMedian(), -2);
  m2.addNum(-2);
  eq('三元素居中', m2.findMedian(), -2);

  const m3 = new MedianFinder();
  [5, 5, 5, 5].forEach((x) => m3.addNum(x));
  eq('全相同', m3.findMedian(), 5);

  const m4 = new MedianFinder();
  [1, 2, 3, 4, 5, 6].forEach((x) => m4.addNum(x));
  eq('顺序流入偶数个', m4.findMedian(), 3.5);

  const m5 = new MedianFinder();
  [6, 5, 4, 3, 2, 1, 100].forEach((x) => m5.addNum(x));
  eq('逆序流入奇数个', m5.findMedian(), 4);

  const m6 = new MedianFinder();
  m6.addNum(2);
  m6.addNum(3);
  eq('两元素平均值', m6.findMedian(), 2.5);

  console.log(`[295-数据流的中位数] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MedianFinder, MinHeap };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
