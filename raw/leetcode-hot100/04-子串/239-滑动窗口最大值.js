/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 04-子串
 * ------------------------------------------------------------
 * 题号：239
 * 题目：滑动窗口最大值（Sliding Window Maximum）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/sliding-window-maximum/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。
 * 你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
 * 返回 滑动窗口中的最大值 。
 *
 * 【示例】
 * 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
 * 输出：[3,3,5,5,6,7]
 *
 * 【提示】
 * 1 <= nums.length <= 10^5
 * -10^4 <= nums[i] <= 10^4
 * 1 <= k <= nums.length
 *
 * 【算法思路】
 * 1、单调递减队列存下标，队首始终是当前窗口最大值的下标。
 * 2、入队前弹掉队尾所有比当前值小的下标（它们不可能再成为最大值）。
 * 3、队首下标若已滑出窗口（i - k >= 队首），则出队。
 * 4、每个下标进出队列各一次，均摊 O(1)。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个元素进出队各一次
 * 空间复杂度：O(k)，队列大小不超过 k
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  const deque = [];
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    // 弹掉队尾较小者
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    deque.push(i);
    // 队首过期
    if (deque[0] <= i - k) deque.shift();
    // 窗口形成后记录
    if (i >= k - 1) res.push(nums[deque[0]]);
  }
  return res;
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

  eq('基本示例', maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
  eq('k=1', maxSlidingWindow([1, 2, 3], 1), [1, 2, 3]);
  eq('k=n', maxSlidingWindow([1, 2, 3], 3), [3]);
  eq('递减', maxSlidingWindow([5, 4, 3, 2, 1], 2), [5, 4, 3, 2]);
  eq('递增', maxSlidingWindow([1, 2, 3, 4], 2), [2, 3, 4]);
  eq('全相同', maxSlidingWindow([2, 2, 2], 2), [2, 2]);
  eq('含负数', maxSlidingWindow([-1, -2, -3], 2), [-1, -2]);
  eq('单元素', maxSlidingWindow([7], 1), [7]);
  eq('大数范围', maxSlidingWindow([10000, -10000], 1), [10000, -10000]);

  console.log(`[239-滑动窗口最大值] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { maxSlidingWindow };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}