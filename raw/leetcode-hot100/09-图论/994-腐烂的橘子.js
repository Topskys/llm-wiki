/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 09-图论
 * ------------------------------------------------------------
 * 题号：994
 * 题目：腐烂的橘子（Rotting Oranges）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/rotting-oranges/
 * ------------------------------------------------------------
 * 【题目描述】
 * 在给定的 m x n 网格 grid 中，每个单元格可以有以下三个值之一：
 * 值 0 代表空单元格；值 1 代表新鲜橘子；值 2 代表腐烂的橘子。
 * 每分钟，腐烂的橘子周围 4 个方向上相邻的新鲜橘子都会腐烂。
 * 返回直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。
 * 如果不可能所有橘子都腐烂，返回 -1 。
 *
 * 【示例】
 * 输入：grid = [[2,1,1],[1,1,0],[0,1,1]]
 * 输出：4
 * 解释：腐烂按层向外扩散，最后一格新鲜橘子在第 4 分钟才变烂。
 *
 * 输入：grid = [[2,1,1],[0,1,1],[1,0,1]]
 * 输出：-1
 * 解释：左下角的橘子（第 2 行第 0 列）永远不会腐烂，因为腐烂
 *      只会通过 4 个方向上相邻传播，对角线无法传染。
 *
 * 输入：grid = [[0,2]]
 * 输出：0
 * 解释：初始就没有新鲜橘子，0 分钟即已满足条件。
 *
 * 【提示】
 * m == grid.length，n == grid[i].length
 * 1 <= m, n <= 10
 * grid[i][j] 仅为 0、1 或 2
 *
 * 【算法思路】
 * 1、多源 BFS：所有初始腐烂橘子同处第 0 层，一起入队，并统计新鲜橘子数 fresh。
 * 2、按层计时：每轮只处理当前队列长度个节点，一层即一分钟，层数累计为答案。
 * 3、四方向扩散：相邻新鲜橘子改成 2（原地标记 visited）并入队，fresh 减 1。
 * 4、不可达判定：扩散结束后若 fresh > 0，说明有橘子被 0 隔断，返回 -1。
 * 5、边界特判：初始就没有新鲜橘子时直接返回 0，而不是层数。
 *
 * 【复杂度】
 * 时间复杂度：O(m*n)，每个格子最多入队一次
 * 空间复杂度：O(m*n)，队列最坏存下全部格子
 * ============================================================
 */

/**
 * 多源 BFS 求全部橘子腐烂所需的最少分钟数
 * @param {number[][]} grid - 0 空、1 新鲜、2 腐烂
 * @return {number} 最少分钟数，无法全部腐烂返回 -1
 */
function orangesRotting(grid) {
  if (!Array.isArray(grid) || grid.length === 0) return -1;
  const m = grid.length;
  const n = grid[0].length;
  const queue = [];
  let fresh = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) queue.push([i, j]); // 所有源点同层入队
      else if (grid[i][j] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0; // 无需等待

  const dirs = [1, 0, -1, 0, 1];
  let minutes = 0;
  while (queue.length > 0 && fresh > 0) {
    minutes++; // 处理一层 = 过了一分钟
    const size = queue.length;
    for (let s = 0; s < size; s++) {
      const [x, y] = queue.shift();
      for (let d = 0; d < 4; d++) {
        const nx = x + dirs[d];
        const ny = y + dirs[d + 1];
        if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
        if (grid[nx][ny] !== 1) continue;
        grid[nx][ny] = 2; // 腐烂即标记，天然去重
        fresh--;
        queue.push([nx, ny]);
      }
    }
  }
  return fresh === 0 ? minutes : -1;
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
  // 函数会原地把 1 改成 2，测试统一传深拷贝
  const run = (g) => orangesRotting(g.map((row) => row.slice()));

  eq('示例1', run([[2, 1, 1], [1, 1, 0], [0, 1, 1]]), 4);
  eq('示例2 有孤立橘子返回 -1', run([[2, 1, 1], [0, 1, 1], [1, 0, 1]]), -1);
  eq('示例3 无新鲜橘子返回 0', run([[0, 2]]), 0);
  eq('单格新鲜且无源点', run([[1]]), -1);
  eq('单格腐烂', run([[2]]), 0);
  eq('单格空格', run([[0]]), 0);
  eq('空网格', run([]), -1);
  eq('一行线性扩散', run([[2, 1, 1, 1]]), 3);
  eq('多个源点同时扩散更快', run([[2, 1, 1, 2]]), 1);
  eq('被 0 隔开的另一侧', run([[2, 1, 0, 1]]), -1);
  eq('3x3 中心腐烂', run([[1, 1, 1], [1, 2, 1], [1, 1, 1]]), 2);

  console.log(`[994-腐烂的橘子] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { orangesRotting };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
