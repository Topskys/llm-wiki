/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 10-回溯
 * ------------------------------------------------------------
 * 题号：79
 * 题目：单词搜索（Word Search）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/word-search/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。
 * 如果 word 存在于网格中，返回 true ；否则返回 false 。
 * 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中
 * 「相邻」单元格是那些水平相邻或垂直相邻的单元格（四连通）。
 * 同一个单元格内的字母不允许被重复使用（一条路径上不回头）。
 *
 * 【示例】
 * 输入：board = [
 *   ["A","B","C","E"],
 *   ["S","F","C","S"],
 *   ["A","D","E","E"]
 * ], word = "ABCCED"
 * 输出：true
 * 解释：A(0,0)->B(0,1)->C(0,2)->C(1,2)->E(2,2)->D(2,1) 路径连通。
 *
 * 输入：同上 board，word = "SEE"
 * 输出：true
 *
 * 输入：同上 board，word = "ABCB"
 * 输出：false
 * 解释：虽然 B 与 C 都在网格中出现，但路径需要重复使用 (0,1) 的 B，
 *      同一格子不可复用，故不成立。
 *
 * 【提示】
 * m == board.length，n == board[i].length
 * 1 <= m, n <= 6，1 <= word.length <= 15
 * board 和 word 仅由大小写英文字母组成
 *
 * 【算法思路】
 * 1、网格上的 DFS + 回溯：枚举每个格子作为起点，尝试匹配 word 的前缀。
 * 2、dfs(i, j, k) 表示「以 (i,j) 匹配 word[k]」能否成功：越界或 board[i][j] !== word[k] 直接 false（先判字符再递归）。
 * 3、k === word.length - 1 且字符相等，说明整词匹配完成，返回 true。
 * 4、选择：把 board[i][j] 原地改成一个占位符（如 '#'）标记占用；递归：四方向任一 dfs 成功即 true。
 * 5、撤销：恢复 board[i][j] 原字符，供其他起点/路径复用。
 * 6、原地标记代替 visited 集合，既省空间又保证「同格不重复使用」。
 *
 * 【复杂度】
 * 时间复杂度：O(m*n*3^L)，L 为 word 长度，每步至多 3 个新方向
 * 空间复杂度：O(L)，递归栈深度（原地修改不额外占空间）
 * ============================================================
 */

/**
 * 判断单词是否存在于网格中（网格 DFS + 原地标记回溯）
 * 注意：搜索过程中会临时修改入参 board，返回前会完整还原
 * @param {string[][]} board - 字符网格
 * @param {string} word - 目标单词
 * @return {boolean} 存在返回 true
 */
function exist(board, word) {
  if (!Array.isArray(board) || board.length === 0) return false;
  if (typeof word !== 'string' || word.length === 0) return false;
  const m = board.length;
  const n = board[0].length;
  if (word.length > m * n) return false; // 格子不够用，必然无解

  /**
   * 从 (i,j) 出发匹配 word[k..]
   * @param {number} i 行下标
   * @param {number} j 列下标
   * @param {number} k word 中待匹配的字符下标
   * @return {boolean}
   */
  const dfs = (i, j, k) => {
    if (i < 0 || i >= m || j < 0 || j >= n) return false;
    if (board[i][j] !== word[k]) return false; // 含占位符不匹配的情况
    if (k === word.length - 1) return true;    // 最后一个字符也对上了

    const saved = board[i][j];
    board[i][j] = '#'; // 选择：原地标记占用，防止路径回头复用
    const found = dfs(i + 1, j, k + 1)
      || dfs(i - 1, j, k + 1)
      || dfs(i, j + 1, k + 1)
      || dfs(i, j - 1, k + 1);
    board[i][j] = saved; // 撤销：还原现场
    return found;
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true; // 枚举起点
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
      console.error(`✗ ${label}`);
      console.error(`  期望: ${JSON.stringify(expected)}`);
      console.error(`  实际: ${JSON.stringify(actual)}`);
    }
  };
  const B1 = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E']
  ];
  // exist 会临时改写 board，测试统一传深拷贝
  const run = (b, w) => exist(b.map((row) => row.slice()), w);

  eq('示例1 ABCCED 存在', run(B1, 'ABCCED'), true);
  eq('示例2 SEE 存在', run(B1, 'SEE'), true);
  eq('示例3 ABCB 需重复用格 不存在', run(B1, 'ABCB'), false);
  eq('单格命中 n=1', run([['A']], 'A'), true);
  eq('单格不命中', run([['A']], 'B'), false);
  eq('单词比格子总数更长 无解', run(B1, 'AAAAAAAA'), false);
  eq('空网格', run([], 'A'), false);
  eq('空单词', run(B1, ''), false);
  eq('一列纵向拼词', run([['A'], ['B'], ['C']], 'ABC'), true);
  eq('一列反向可达（相邻双向）', run([['A'], ['B'], ['C']], 'CBA'), true);
  eq('一列跨格不可达', run([['A'], ['B'], ['C']], 'AC'), false);
  eq('对角线不算相邻', run([['A', 'B'], ['C', 'D']], 'AD'), false);
  eq('大小写敏感', run(B1, 'abcced'), false);
  eq('搜索后网格被完整还原', (() => {
    const copy = B1.map((r) => r.slice());
    exist(copy, 'NOTEXIST');
    return JSON.stringify(copy) === JSON.stringify(B1);
  })(), true);

  console.log(`[79-单词搜索] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { exist };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
