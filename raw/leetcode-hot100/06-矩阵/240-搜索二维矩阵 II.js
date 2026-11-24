/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 06-矩阵
 * ------------------------------------------------------------
 * 题号：240
 * 题目：搜索二维矩阵 II（Search a 2D Matrix II）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/search-a-2d-matrix-ii/
 * ------------------------------------------------------------
 * 【题目描述】
 * 编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target。
 * 该矩阵具有以下特性：
 *   - 每行的元素从左到右升序排列。
 *   - 每列的元素从上到下升序排列。
 *
 * 【示例】
 * 示例 1：
 * 输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
 * 输出：true
 *
 * 示例 2：
 * 输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20
 * 输出：false
 *
 * 【提示】
 * m == matrix.length
 * n == matrix[i].length
 * 1 <= n, m <= 300
 * -10^9 <= matrix[i][j] <= 10^9
 * 矩阵每行、每列均按升序排列
 * -10^9 <= target <= 10^9
 *
 * 【算法思路】
 * 1、从矩阵右上角 (row=0, col=n-1) 出发做阶梯式排除。
 * 2、若当前元素等于 target，返回 true。
 * 3、若当前元素大于 target，说明该列所有元素都大于 target（因为列递增），排除该列，col--。
 * 4、若当前元素小于 target，说明该行所有元素都小于 target（因为行递增），排除该行，row++。
 * 5、每步排除一行或一列，最多走 m+n 步，时间复杂度 O(m+n)；也可以从左下角出发，对称同理。
 *
 * 【复杂度】
 * 时间复杂度：O(m + n)
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * 搜索二维矩阵 II —— 右上角阶梯排除法
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
function searchMatrix(matrix, target) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return false;

  const m = matrix.length;
  const n = matrix[0].length;

  // 从右上角出发
  let row = 0;
  let col = n - 1;

  while (row < m && col >= 0) {
    const val = matrix[row][col];
    if (val === target) {
      return true;
    } else if (val > target) {
      // 当前列都大于 target，排除该列
      col--;
    } else {
      // 当前行都小于 target，排除该行
      row++;
    }
  }

  return false;
}

// ============================== 测试 ==============================
function runTests() {
  let pass = 0;
  let fail = 0;

  const eq = (label, actual, expected) => {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a === e) {
      pass++;
    } else {
      fail++;
      console.error(`✗ ${label}`);
      console.error(`  期望: ${e}`);
      console.error(`  实际: ${a}`);
    }
  };

  const matrix5x5 = [
    [1, 4, 7, 11, 15],
    [2, 5, 8, 12, 19],
    [3, 6, 9, 16, 22],
    [10, 13, 14, 17, 24],
    [18, 21, 23, 26, 30]
  ];

  // 用例 1：示例1，target=5 存在
  eq('示例1 target=5', searchMatrix(matrix5x5, 5), true);

  // 用例 2：示例2，target=20 不存在
  eq('示例2 target=20', searchMatrix(matrix5x5, 20), false);

  // 用例 3：1x1 矩阵，target 存在
  eq('1x1 存在', searchMatrix([[7]], 7), true);

  // 用例 4：1x1 矩阵，target 不存在
  eq('1x1 不存在', searchMatrix([[7]], 5), false);

  // 用例 5：单行矩阵，target 存在
  eq('单行存在', searchMatrix([[1, 3, 5, 7, 9]], 5), true);

  // 用例 6：单行矩阵，target 不存在
  eq('单行不存在', searchMatrix([[1, 3, 5, 7, 9]], 4), false);

  // 用例 7：单列矩阵，target 存在
  eq('单列存在', searchMatrix([[2], [4], [6], [8]], 6), true);

  // 用例 8：单列矩阵，target 不存在
  eq('单列不存在', searchMatrix([[2], [4], [6], [8]], 5), false);

  // 用例 9：target 比所有元素都小
  eq('target 最小', searchMatrix(matrix5x5, 0), false);

  // 用例 10：target 比所有元素都大
  eq('target 最大', searchMatrix(matrix5x5, 31), false);

  console.log(`[240-搜索二维矩阵 II] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { searchMatrix };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
