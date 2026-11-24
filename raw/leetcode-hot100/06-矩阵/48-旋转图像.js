/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 06-矩阵
 * ------------------------------------------------------------
 * 题号：48
 * 题目：旋转图像（Rotate Image）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/rotate-image/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个 n x n 的二维矩阵 matrix 表示一个图像。
 * 请你将图像顺时针旋转 90 度。
 * 你必须在原地旋转图像，不能使用额外的矩阵。
 *
 * 【示例】
 * 示例 1：
 * 输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * 输出：[[7,4,1],[8,5,2],[9,6,3]]
 *
 * 示例 2：
 * 输入：matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
 * 输出：[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
 *
 * 【提示】
 * n == matrix.length == matrix[i].length
 * 1 <= n <= 20
 * -1000 <= matrix[i][j] <= 1000
 *
 * 【算法思路】
 * 1、顺时针旋转 90 度分解为两步：先沿主对角线转置（行列互换），再对每行水平翻转（左右镜像）。
 * 2、例如 (0,1) 转置后到 (1,0)，再水平翻转到 (1,n-1)，等价于顺时针 90 度的目标位置。
 * 3、两步操作均可原地完成，无需额外矩阵。
 *
 * 【复杂度】
 * 时间复杂度：O(n^2)
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * 旋转图像 —— 先转置再水平翻转，原地完成
 * @param {number[][]} matrix
 * @return {void} 原地修改 matrix
 */
function rotate(matrix) {
  const n = matrix.length;

  // 第一步：沿主对角线转置（只遍历上三角）
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const tmp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = tmp;
    }
  }

  // 第二步：每行水平翻转
  for (let i = 0; i < n; i++) {
    let left = 0;
    let right = n - 1;
    while (left < right) {
      const tmp = matrix[i][left];
      matrix[i][left] = matrix[i][right];
      matrix[i][right] = tmp;
      left++;
      right--;
    }
  }
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

  // 用例 1：3x3 示例1
  {
    const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const expected = [[7, 4, 1], [8, 5, 2], [9, 6, 3]];
    rotate(matrix);
    eq('3x3 示例1', matrix, expected);
  }

  // 用例 2：4x4 示例2
  {
    const matrix = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]];
    const expected = [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]];
    rotate(matrix);
    eq('4x4 示例2', matrix, expected);
  }

  // 用例 3：1x1 矩阵
  {
    const matrix = [[42]];
    const expected = [[42]];
    rotate(matrix);
    eq('1x1 矩阵', matrix, expected);
  }

  // 用例 4：2x2 矩阵
  {
    const matrix = [[1, 2], [3, 4]];
    const expected = [[3, 1], [4, 2]];
    rotate(matrix);
    eq('2x2 矩阵', matrix, expected);
  }

  // 用例 5：2x3 不符合题意（n x n），改用 5x5
  {
    const matrix = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25]
    ];
    const expected = [
      [21, 16, 11, 6, 1],
      [22, 17, 12, 7, 2],
      [23, 18, 13, 8, 3],
      [24, 19, 14, 9, 4],
      [25, 20, 15, 10, 5]
    ];
    rotate(matrix);
    eq('5x5 矩阵', matrix, expected);
  }

  // 用例 6：含负数和零
  {
    const matrix = [[-1, 0], [1, 2]];
    const expected = [[1, -1], [2, 0]];
    rotate(matrix);
    eq('含负数和零', matrix, expected);
  }

  console.log(`[48-旋转图像] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rotate };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
