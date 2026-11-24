/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 11-二分查找
 * ------------------------------------------------------------
 * 题号：74
 * 题目：搜索二维矩阵（Search a 2D Matrix）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/search-a-2d-matrix/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个满足下述两条属性的 m x n 整数矩阵：
 * 每行中的整数从左到右按非严格递增顺序排列；
 * 每行的第一个整数大于前一行的最后一个整数。
 * 给你一个整数 target ，如果 target 在矩阵中，返回 true ；否则返回 false 。
 *
 * 【示例】
 * 输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
 * 输出：true
 *
 * 输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
 * 输出：false
 *
 * 【提示】
 * m == matrix.length
 * n == matrix[i].length
 * 1 <= m, n <= 100
 * -10^4 <= matrix[i][j], target <= 10^4
 *
 * 【算法思路】
 * 1、两条单调性叠加后，矩阵按行展开即为一支严格递增的一维数组，长度 m·n，可整体二分。
 * 2、对虚拟下标 mid ∈ [0, m·n) 用 matrix[Math.floor(mid / n)][mid % n] 还原真实行列，无需真的展开数组。
 * 3、区间取闭区间 [left, right]：命中即返回 true，偏小则 left = mid + 1，偏大则 right = mid - 1。
 * 4、每轮区间至少收缩 1，while (left <= right) 必然终止，退出即代表 target 不存在，返回 false。
 * 5、相比「先定位行再二分列」的两段式写法，一次二分更简洁，复杂度同为 O(log(m·n))。
 *
 * 【复杂度】
 * 时间复杂度：O(log(m·n))
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
function searchMatrix(matrix, target) {
  const m = matrix.length;
  const n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    if (val < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return false;
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
  const m1 = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];

  eq('target=3', searchMatrix(m1, 3), true);
  eq('target=13 不存在', searchMatrix(m1, 13), false);
  eq('target=1 首元素', searchMatrix(m1, 1), true);
  eq('target=60 末元素', searchMatrix(m1, 60), true);
  eq('target=0 小于全部', searchMatrix(m1, 0), false);
  eq('target=61 大于全部', searchMatrix(m1, 61), false);
  eq('target=23 换行边界', searchMatrix(m1, 23), true);
  eq('1x1 矩阵 [[5]] target=5', searchMatrix([[5]], 5), true);
  eq('单列 [[1],[3],[5]] target=3', searchMatrix([[1], [3], [5]], 3), true);
  eq('单行 [[1,2]] target=3', searchMatrix([[1, 2]], 3), false);

  console.log(`[74-搜索二维矩阵] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { searchMatrix };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
