/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 10-回溯
 * ------------------------------------------------------------
 * 题号：51
 * 题目：N 皇后（N-Queens）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/n-queens/
 * ------------------------------------------------------------
 * 【题目描述】
 * 按照国际象棋的规则，皇后可以攻击与之处在同一行、同一列、同一对角线上的棋子。
 * n 皇后问题：在一个 n×n 的棋盘上放置 n 个皇后，使其不能相互攻击。
 * 返回所有不同的解决方案。每一种解法包含一个由 'Q' 和 '.' 组成的字符串数组，
 * 其中 'Q' 代表皇后，'.' 代表空位。
 *
 * 【示例】
 * 输入：n = 4
 * 输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
 * 解释：4 皇后有两个解，棋盘以字符串数组形式表示。
 *
 * 【提示】
 * 1 <= n <= 9
 *
 * 【算法思路】
 * 1、按行递归：每行恰好放一个皇后，枚举列位置，剪枝检查列、主对角线、副对角线是否已被占用。
 * 2、用三个 Set 分别记录已占用的列 col、主对角线 diag1 (row - col)、副对角线 diag2 (row + col)，判重 O(1)。
 * 3、回溯：选择列 -> 加入三个 Set -> 递归下一行 -> 撤销（从 Set 删除）。
 * 4、row == n 时所有行已放满，将当前棋盘转为字符串数组存入答案。
 * 5、输出格式：每行生成长度为 n 的字符串，皇后位置为 'Q' 其余为 '.'。
 *
 * 【复杂度】
 * 时间复杂度：O(n!) 级（回溯搜索树），n ≤ 9 时可接受
 * 空间复杂度：O(n)，三个 Set + 递归栈 + 当前棋盘
 * ============================================================
 */

/**
 * @param {number} n
 * @return {string[][]}
 */
function solveNQueens(n) {
  const res = [];
  const cols = new Set();
  const diag1 = new Set(); // row - col
  const diag2 = new Set(); // row + col
  const board = Array.from({ length: n }, () => '.'.repeat(n));

  const backtrack = (row) => {
    if (row === n) {
      res.push([...board]);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
      // 选择
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      board[row] = board[row].slice(0, col) + 'Q' + board[row].slice(col + 1);
      // 递归
      backtrack(row + 1);
      // 撤销
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
      board[row] = '.'.repeat(n);
    }
  };

  backtrack(0);
  return res;
}

// ============================== 测试 ==============================
function runTests() {
  let pass = 0;
  let fail = 0;
  const eq = (label, actual, expected) => {
    // 方案顺序不唯一：把每个方案的字符串数组 join 成单串，再整体排序比较
    const norm = (list) => list.map((p) => p.join('\u0001')).sort((a, b) => a.localeCompare(b));
    let ok;
    if (typeof expected === 'number') {
      ok = actual.length === expected;
    } else {
      ok = JSON.stringify(norm(actual)) === JSON.stringify(norm(expected));
    }
    if (ok) {
      pass++;
    } else {
      fail++;
      console.error(`  ✗ ${label}\n    期望 ${JSON.stringify(typeof expected === 'number' ? expected : norm(expected))}\n    实际 ${JSON.stringify(typeof expected === 'number' ? actual.length : norm(actual))}`);
    }
  };

  eq('n=4', solveNQueens(4), [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]);
  eq('n=1', solveNQueens(1), [["Q"]]);
  eq('n=2 无解', solveNQueens(2), []);
  eq('n=3 无解', solveNQueens(3), []);
  eq('n=5 方案数为 10', solveNQueens(5), 10);

  console.log(`[51-N皇后] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { solveNQueens };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}