/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 06-矩阵
 * ------------------------------------------------------------
 * 题号：73
 * 题目：矩阵置零（Set Matrix Zeroes）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/set-matrix-zeroes/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个 m x n 的矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。
 * 请使用原地算法解决此问题。
 * 要求使用 O(1) 的额外空间。
 *
 * 【示例】
 * 示例 1：
 * 输入：matrix = [[1,1,1],[1,0,1],[1,1,1]]
 * 输出：[[1,0,1],[0,0,0],[1,0,1]]
 *
 * 示例 2：
 * 输入：matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
 * 输出：[[0,0,0,0],[0,4,5,0],[0,3,1,0]]
 *
 * 【提示】
 * m == matrix.length
 * n == matrix[0].length
 * 1 <= m, n <= 200
 * -2^31 <= matrix[i][j] <= 2^31 - 1
 *
 * 【算法思路】
 * 1、用第一行和第一列作为标记数组，记录该行/列是否需要置零。
 * 2、先用两个布尔变量记录第一行、第一列本身是否需要置零。
 * 3、然后遍历矩阵其余部分，若 matrix[i][j] == 0，则令 matrix[i][0] = 0 且 matrix[0][j] = 0。
 * 4、再次遍历 matrix[1..m-1][1..n-1]，根据标记置零。
 * 5、最后根据两个布尔变量处理第一行和第一列。
 * 6、正确性：标记信息在第二次遍历前不会被覆盖，因为第一行/列的原始值已提前保存。
 *
 * 【复杂度】
 * 时间复杂度：O(m * n)
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * 矩阵置零 —— 首行首列标记法，O(1) 额外空间
 * @param {number[][]} matrix
 * @return {void} 原地修改 matrix
 */
function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  // 检查第一列是否需要置零
  let firstColZero = false;
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
      break;
    }
  }

  // 检查第一行是否需要置零
  let firstRowZero = false;
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
      break;
    }
  }

  // 用第一行和第一列记录其余行列的置零标记
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  // 根据标记置零（从 (1,1) 开始，不碰第一行/列）
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // 处理第一行
  if (firstRowZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }

  // 处理第一列
  if (firstColZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
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

  // 用例 1：标准示例
  {
    const matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
    const expected = [[1, 0, 1], [0, 0, 0], [1, 0, 1]];
    setZeroes(matrix);
    eq('示例1', matrix, expected);
  }

  // 用例 2：标准示例2
  {
    const matrix = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]];
    const expected = [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]];
    setZeroes(matrix);
    eq('示例2', matrix, expected);
  }

  // 用例 3：1x1 矩阵，值为 0
  {
    const matrix = [[0]];
    const expected = [[0]];
    setZeroes(matrix);
    eq('1x1 零矩阵', matrix, expected);
  }

  // 用例 4：1x1 矩阵，值非 0
  {
    const matrix = [[5]];
    const expected = [[5]];
    setZeroes(matrix);
    eq('1x1 非零矩阵', matrix, expected);
  }

  // 用例 5：单行矩阵
  {
    const matrix = [[1, 0, 3]];
    const expected = [[0, 0, 0]];
    setZeroes(matrix);
    eq('单行矩阵', matrix, expected);
  }

  // 用例 6：单列矩阵
  {
    const matrix = [[1], [0], [3]];
    const expected = [[0], [0], [0]];
    setZeroes(matrix);
    eq('单列矩阵', matrix, expected);
  }

  // 用例 7：全零矩阵
  {
    const matrix = [[0, 0], [0, 0]];
    const expected = [[0, 0], [0, 0]];
    setZeroes(matrix);
    eq('全零矩阵', matrix, expected);
  }

  // 用例 8：无零矩阵
  {
    const matrix = [[1, 2], [3, 4]];
    const expected = [[1, 2], [3, 4]];
    setZeroes(matrix);
    eq('无零矩阵', matrix, expected);
  }

  console.log(`[73-矩阵置零] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setZeroes };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
