/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：152
 * 题目：乘积最大子数组（Maximum Product Subarray）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/maximum-product-subarray/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums ，请你找出数组中乘积最大的 连续子数组 的乘积，并返回该乘积。
 * 测试用例的答案是一个 32 位 整数。
 *
 * 【示例】
 * 输入：nums = [2,3,-2,4]
 * 输出：6
 * 解释：子数组 [2,3] 的乘积最大，为 6。
 *
 * 输入：nums = [-2,0,-1]
 * 输出：0
 * 解释：结果不能为 2，因为 [-2,-1] 不是连续子数组。
 *
 * 【提示】
 * 1 <= nums.length <= 2 * 10^4
 * -10 <= nums[i] <= 10
 * nums 的乘积不会溢出 32 位整数
 *
 * 【算法思路】
 * 1、状态定义：maxDP[i] 表示以 i 结尾的最大乘积，minDP[i] 表示以 i 结尾的最小乘积（负数翻转可能变最大）。
 * 2、转移方程：由于负负得正，当前数可能乘以之前的最小值变成最大，反之亦然。
 *    maxDP[i] = max(nums[i], maxDP[i-1]*nums[i], minDP[i-1]*nums[i])
 *    minDP[i] = min(nums[i], maxDP[i-1]*nums[i], minDP[i-1]*nums[i])
 * 3、初始化：maxDP[0] = minDP[0] = nums[0]。
 * 4、遍历顺序：从左到右，用两个变量滚动维护，并更新全局答案。
 * 5、0 的处理：遇到 0 时 max/min 都重置为 0，自然切断子数组，后续可重新开始。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(1)，两个滚动变量
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
function maxProduct(nums) {
  let maxProd = nums[0];
  let minProd = nums[0];
  let ans = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    if (x < 0) {
      const tmp = maxProd;
      maxProd = minProd;
      minProd = tmp;
    }
    maxProd = Math.max(x, maxProd * x);
    minProd = Math.min(x, minProd * x);
    ans = Math.max(ans, maxProd);
  }
  return ans;
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

  eq('nums=[2,3,-2,4]', maxProduct([2, 3, -2, 4]), 6);
  eq('nums=[-2,0,-1]', maxProduct([-2, 0, -1]), 0);
  eq('nums=[-2,3,-4]', maxProduct([-2, 3, -4]), 24);
  eq('nums=[0,2]', maxProduct([0, 2]), 2);
  eq('nums=[-1] 单负数', maxProduct([-1]), -1);
  eq('nums=[3,-1,4]', maxProduct([3, -1, 4]), 4);
  eq('全负奇数个 [-3,-2,-1]', maxProduct([-3, -2, -1]), 6);

  console.log(`[152-乘积最大子数组] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { maxProduct };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}