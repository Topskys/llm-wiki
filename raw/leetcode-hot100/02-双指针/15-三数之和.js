/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 02-双指针
 * ------------------------------------------------------------
 * 题号：15
 * 题目：三数之和（3Sum）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/3sum/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]]
 * 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。
 * 请你返回所有和为 0 且不重复的三元组。
 *
 * 【示例】
 * 输入：nums = [-1,0,1,2,-1,-4]
 * 输出：[[-1,-1,2],[-1,0,1]]
 *
 * 【提示】
 * 3 <= nums.length <= 3000
 * -10^5 <= nums[i] <= 10^5
 *
 * 【算法思路】
 * 1、先排序，固定最小数 nums[i]，问题转化为在 i 右侧找两数之和为 -nums[i]。
 * 2、双指针 left/right 从 i+1 和 n-1 夹逼，和偏小 left++、偏大 right--。
 * 3、去重三处：跳过重复的 i；命中后 left/right 同时跳过重复值。
 * 4、剪枝：nums[i] > 0 时后面不可能凑出 0，直接 break。
 *
 * 【复杂度】
 * 时间复杂度：O(n^2)，排序 O(n log n) + 双指针 O(n^2)
 * 空间复杂度：O(log n)，排序栈空间（不计输出）
 * ============================================================
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1;
    let r = n - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) {
        l++;
      } else if (sum > 0) {
        r--;
      } else {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++;
        r--;
      }
    }
  }
  return res;
}

// ============================== 测试 ==============================
function runTests() {
  let pass = 0;
  let fail = 0;
  const eq = (label, actual, expected) => {
    const norm = (list) => list.map(t => t.slice().sort((a, b) => a - b)).sort((a, b) => a.join(',').localeCompare(b.join(',')));
    const ok = JSON.stringify(norm(actual)) === JSON.stringify(norm(expected));
    if (ok) {
      pass++;
    } else {
      fail++;
      console.error(`  ✗ ${label}\n    期望 ${JSON.stringify(norm(expected))}\n    实际 ${JSON.stringify(norm(actual))}`);
    }
  };

  eq('基本示例', threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]);
  eq('全零', threeSum([0, 0, 0]), [[0, 0, 0]]);
  eq('无解', threeSum([1, 2, 3]), []);
  eq('三元素命中', threeSum([-1, 0, 1]), [[-1, 0, 1]]);
  eq('含重复多解', threeSum([-2, 0, 1, 1, 2]), [[-2, 0, 2], [-2, 1, 1]]);
  eq('全正', threeSum([1, 2, 3, 4]), []);
  eq('全负', threeSum([-1, -2, -3]), []);
  eq('四个零', threeSum([0, 0, 0, 0]), [[0, 0, 0]]);
  eq('大数范围', threeSum([-100000, 50000, 50000]), [[-100000, 50000, 50000]]);

  console.log(`[15-三数之和] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { threeSum };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}