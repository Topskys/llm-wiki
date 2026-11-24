/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 06-矩阵
 * ------------------------------------------------------------
 * 题号：54
 * 题目：螺旋矩阵（Spiral Matrix）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/spiral-matrix/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个 m 行 n 列的矩阵 matrix，请按照顺时针螺旋顺序，返回矩阵中的所有元素。
 * 螺旋顺序为：从左到右 → 从上到下 → 从右到左 → 从下到上，循环向内收缩。
 *
 * 【示例】
 * 示例 1：
 * 输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * 输出：[1,2,3,6,9,8,7,4,5]
 *
 * 示例 2：
 * 输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
 * 输出：[1,2,3,4,8,12,11,10,9,5,6,7]
 *
 * 【提示】
 * m == matrix.length
 * n == matrix[i].length
 * 1 <= m, n <= 10
 * -100 <= matrix[i][j] <= 100
 *
 * 【算法思路】
 * 1、维护四个边界 top/bottom/left/right，每次按顺时针方向遍历一圈。
 * 2、每完成一条边就收缩对应边界，当边界交叉时停止。
 * 3、注意：在从右到左和从下到上两步之前要检查边界是否仍然合法，防止重复遍历。
 * 4、正确性：每次循环恰好走最外一圈，收缩后等价于一个更小的子问题。
 *
 * 【复杂度】
 * 时间复杂度：O(m * n)
 * 空间复杂度：O(1)（不计返回数组）
 * ============================================================
 */

/**
 * 螺旋矩阵 —— 四边界收缩
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
  const result = [];
  if (!matrix || matrix.length === 0) return result;

  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // 从左到右（顶行）
    for (let j = left; j <= right; j++) {
      result.push(matrix[top][j]);
    }
    top++;

    // 从上到下（右列）
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;

    // 从右到左（底行）
    if (top <= bottom) {
      for (let j = right; j >= left; j--) {
        result.push(matrix[bottom][j]);
      }
      bottom--;
    }

    // 从下到上（左列）
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }

  return result;
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

  // 用例 1：3x3 方阵
  eq('3x3 方阵', spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5]);

  // 用例 2：3x4 矩形
  eq('3x4 矩形', spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);

  // 用例 3：1x1 矩阵
  eq('1x1 矩阵', spiralOrder([[42]]), [42]);

  // 用例 4：单行矩阵
  eq('单行矩阵', spiralOrder([[1, 2, 3, 4]]), [1, 2, 3, 4]);

  // 用例 5：单列矩阵
  eq('单列矩阵', spiralOrder([[1], [2], [3]]), [1, 2, 3]);

  // 用例 6：2x2 矩阵
  eq('2x2 矩阵', spiralOrder([[1, 2], [3, 4]]), [1, 2, 4, 3]);

  // 用例 7：4x1 矩阵
  eq('4x1 矩阵', spiralOrder([[1], [2], [3], [4]]), [1, 2, 3, 4]);

  // 用例 8：2x4 矩阵
  eq('2x4 矩阵', spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8]]), [1, 2, 3, 4, 8, 7, 6, 5]);

  console.log(`[54-螺旋矩阵] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { spiralOrder };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
