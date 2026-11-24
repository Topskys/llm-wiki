/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 09-图论
 * ------------------------------------------------------------
 * 题号：200
 * 题目：岛屿数量（Number of Islands）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/number-of-islands/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个由字符 '1'（陆地）和 '0'（水）组成的二维网格 grid ，
 * 请你计算网格中岛屿的数量。
 * 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上
 * 相邻的陆地连接形成（四连通，对角线不算相连）。
 * 此外，你可以假设该网格的四条边均被水包围。
 *
 * 【示例】
 * 输入：grid = [
 *   ["1","1","0","0","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","1","0","0"],
 *   ["0","0","0","1","1"]
 * ]
 * 输出：3
 * 解释：左上 2x2 一块、中间单个 1 一块、右下 1x2 一块，共 3 座岛。
 *
 * 输入：grid = [["0","1"],["1","0"]]
 * 输出：2
 * 解释：两块陆地只在对角线上相邻，不属于同一座岛屿。
 *
 * 【提示】
 * m == grid.length，n == grid[i].length
 * 1 <= m, n <= 300
 * grid[i][j] 的值只能是字符 '1' 或 '0'
 *
 * 【算法思路】
 * 1、建图视角：每块陆地视为节点、四邻方向视为边，岛屿数量即无向图连通块个数。
 * 2、扫描网格，遇到尚未处理的 '1' 即发现一座新岛，答案计数 +1。
 * 3、从该点做一次 DFS「淹没」：沿四连通方向把所有相连的 '1' 原地改成 '0'，
 *    等价于标记 visited，同一座岛便不会被重复统计。
 * 4、入栈时立刻标记而非出栈时标记，避免同一节点被多个邻居重复压入。
 * 5、300x300 全陆地时递归 DFS 会爆调用栈，故用显式栈的迭代实现兜底。
 *
 * 【复杂度】
 * 时间复杂度：O(m*n)，每个格子最多被压入栈一次
 * 空间复杂度：O(m*n)，最坏整片陆地都在栈中
 * ============================================================
 */

/**
 * 计算二维网格中岛屿的数量（DFS 淹没，四连通）
 * 注意：会原地修改入参 grid（把访问过的 '1' 改成 '0'）
 * @param {string[][]} grid - 由字符 '1'（陆地）与 '0'（水）组成的网格
 * @return {number} 岛屿数量
 */
function numIslands(grid) {
  if (!Array.isArray(grid) || grid.length === 0) return 0;
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [1, 0, -1, 0, 1]; // 右、下、左、上四方向增量
  let count = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== '1') continue;
      count++; // 发现新的连通块
      grid[i][j] = '0'; // 入栈即标记，防止重复入栈
      const stack = [[i, j]];
      while (stack.length > 0) {
        const [x, y] = stack.pop();
        for (let d = 0; d < 4; d++) {
          const nx = x + dirs[d];
          const ny = y + dirs[d + 1];
          if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
          if (grid[nx][ny] !== '1') continue;
          grid[nx][ny] = '0'; // 淹没：visited 的等价写法
          stack.push([nx, ny]);
        }
      }
    }
  }
  return count;
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
      console.error(`✗ ${label}`);
      console.error(`  期望: ${JSON.stringify(expected)}`);
      console.error(`  实际: ${JSON.stringify(actual)}`);
    }
  };
  // numIslands 会原地把 '1' 改成 '0'，所以每个用例都传深拷贝
  const run = (g) => numIslands(g.map((row) => row.slice()));

  eq('示例1 三座岛', run([
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1']
  ]), 3);
  eq('示例2 对角线不相连', run([['0', '1'], ['1', '0']]), 2);
  eq('全水无解', run([['0', '0'], ['0', '0']]), 0);
  eq('全陆地一座岛', run([['1', '1', '1'], ['1', '1', '1'], ['1', '1', '1']]), 1);
  eq('单格陆地 n=1', run([['1']]), 1);
  eq('单格水域', run([['0']]), 0);
  eq('空网格', run([]), 0);
  eq('一行多岛', run([['1', '1', '0', '1', '0', '1']]), 3);
  eq('环形岛屿中间有水', run([
    ['1', '1', '1'],
    ['1', '0', '1'],
    ['1', '1', '1']
  ]), 1);
  eq('入参未被外部影响', (() => {
    const g = [['1', '0'], ['0', '1']];
    numIslands(g.map((r) => r.slice()));
    return JSON.stringify(g);
  })(), JSON.stringify([['1', '0'], ['0', '1']]));

  console.log(`[200-岛屿数量] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { numIslands };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
