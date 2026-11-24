/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 12-栈
 * ------------------------------------------------------------
 * 题号：155
 * 题目：最小栈（Min Stack）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/min-stack/
 * ------------------------------------------------------------
 * 【题目描述】
 * 设计一个支持 push 、pop 、top 操作，并能在常数时间内检索到最小元素的栈。
 * 实现 MinStack 类：
 * MinStack() 初始化堆栈对象；
 * void push(int val) 将元素 val 推入堆栈；
 * void pop() 删除堆栈顶部的元素；
 * int top() 获取堆栈顶部的元素；
 * int getMin() 获取堆栈中的最小元素。
 *
 * 【示例】
 * 输入：["MinStack","push","push","push","getMin","pop","top","getMin"]
 *      [[],[-2],[0],[-3],[],[],[],[]]
 * 输出：[null,null,null,null,-3,null,0,-2]
 * 解释：压入 -2、0、-3 后 getMin 返回 -3；
 *      pop 掉 -3 后 top 为 0，getMin 回到 -2。
 *
 * 【提示】
 * -2^31 <= val <= 2^31 - 1
 * pop、top 和 getMin 操作总是在 非空栈 上调用
 * push、pop、top、getMin 最多被调用 3 * 10^4 次
 *
 * 【算法思路】
 * 1、主栈正常存元素；另设辅助栈 minStack，其栈顶始终是「主栈当前状态下的最小值」。
 * 2、push(x) 时向 minStack 压入 min(x, minStack 栈顶)（首元素直接压 x）；pop() 时两栈同步弹出。
 * 3、这样 minStack 栈顶天然与主栈每一层状态一一对应，getMin 直接读栈顶即 O(1)。
 * 4、关键点：必须为「每个历史状态」各自记账最小值，若只维护一个全局最小变量，pop 掉最小元素后无法回退。
 * 5、空间可优化为「只在 x <= 当前最小值时压栈」，但同步双栈写法更直观且不易错。
 *
 * 【复杂度】
 * 时间复杂度：O(1)，四个操作均为常数时间
 * 空间复杂度：O(n)，辅助栈与主栈等长
 * ============================================================
 */

class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  /**
   * @param {number} val
   * @return {void}
   */
  push(val) {
    this.stack.push(val);
    const curMin = this.minStack.length ? this.minStack[this.minStack.length - 1] : Infinity;
    this.minStack.push(Math.min(val, curMin));
  }

  /**
   * @return {void}
   */
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  /**
   * @return {number}
   */
  top() {
    return this.stack[this.stack.length - 1];
  }

  /**
   * @return {number}
   */
  getMin() {
    return this.minStack[this.minStack.length - 1];
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

  // 官方示例：按操作序列收集输出
  const ops = ['push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'];
  const args = [-2, 0, -3, null, null, null, null];
  const ms = new MinStack();
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === 'push') ms.push(args[i]);
    else if (ops[i] === 'pop') ms.pop();
    else if (ops[i] === 'top') out.push(ms.top());
    else out.push(ms.getMin());
  }
  eq('官方示例操作序列', out, [-3, 0, -2]);

  const a = new MinStack();
  a.push(1);
  eq('单元素 getMin', a.getMin(), 1);
  eq('单元素 top', a.top(), 1);
  a.push(1);
  eq('重复最小值 push 后 getMin', a.getMin(), 1);
  a.pop();
  eq('pop 后 getMin 仍可回退', a.getMin(), 1);
  a.push(5);
  eq('push 更大值不改变最小值', a.getMin(), 1);
  a.pop();
  eq('pop 更大值后最小值不变', a.getMin(), 1);

  const b = new MinStack();
  b.push(3);
  b.push(2);
  b.push(1);
  eq('递减序列 getMin', b.getMin(), 1);
  b.pop();
  eq('弹出最小值后回退到 2', b.getMin(), 2);
  b.pop();
  eq('再弹一次回退到 3', b.getMin(), 3);

  const c = new MinStack();
  c.push(-2147483648);
  eq('极小值 int32 下界', c.getMin(), -2147483648);
  c.push(2147483647);
  eq('极大值不影响最小值', c.getMin(), -2147483648);
  eq('top 返回最后压入的极大值', c.top(), 2147483647);

  console.log(`[155-最小栈] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MinStack };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
