/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：118
 * 题目：杨辉三角（Pascal's Triangle）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/pascals-triangle/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行。
 * 在杨辉三角中，每个数是它正上方元素和左上方元素的和，
 * 每行的第一个和最后一个元素都是 1。
 * 返回由这些行组成的二维数组，第 i 行恰好包含 i 个元素。
 *
 * 【示例】
 * 输入：numRows = 5
 * 输出：[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
 * 解释：第 3 行的 2 = 上一行的 1 + 1；第 4 行的 3 = 上一行的 1 + 2。
 *
 * 输入：numRows = 1
 * 输出：[[1]]
 * 解释：只有一行，即顶点 1。
 *
 * 【提示】
 * 1 <= numRows <= 34
 * 每行的首尾元素固定为 1
 * 中间元素满足组合数性质 C(i, j) = C(i-1, j-1) + C(i-1, j)
 *
 * 【算法思路】
 * 1、状态定义：dp[i][j] 表示杨辉三角第 i 行（从 0 计）第 j 列的数值。
 * 2、转移方程：dp[i][j] = dp[i-1][j-1] + dp[i-1][j]；当 j = 0 或 j = i 时 dp[i][j] = 1。
 * 3、初始化：dp[0][0] = 1，各行首尾置 1。
 * 4、遍历顺序：外层 i 从 1 到 numRows-1 递增，内层 j 从 1 到 i-1 只填中间位置。
 * 5、边界处理：numRows <= 0 时返回空数组，避免生成无意义的行。
 *
 * 【复杂度】
 * 时间复杂度：O(numRows^2)，共填充 numRows(numRows+1)/2 个元素
 * 空间复杂度：O(numRows^2)，存储整个三角形（不计返回值则为 O(1) 额外空间）
 * ============================================================
 */

/**
 * 生成杨辉三角的前 numRows 行
 * @param {number} numRows - 需要生成的行数
 * @return {number[][]} 二维数组，第 i 行含 i + 1 个元素
 */
function generate(numRows) {
  const dp = [];
  if (numRows <= 0) return dp;

  for (let i = 0; i < numRows; i++) {
    const row = new Array(i + 1).fill(1); // 首尾固定为 1
    for (let j = 1; j < i; j++) {
      row[j] = dp[i - 1][j - 1] + dp[i - 1][j];
    }
    dp.push(row);
  }
  return dp;
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

  eq('numRows=1 单行', generate(1), [[1]]);
  eq('numRows=2 两行', generate(2), [[1], [1, 1]]);
  eq('numRows=3 三行', generate(3), [[1], [1, 1], [1, 2, 1]]);
  eq('numRows=5 官方示例', generate(5), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]);
  eq('numRows=0 空数组边界', generate(0), []);
  eq('numRows=6 第 6 行为 1 5 10 10 5 1', generate(6)[5], [1, 5, 10, 10, 5, 1]);
  eq('每行长度等于行号加一', generate(7).map((r) => r.length), [1, 2, 3, 4, 5, 6, 7]);
  eq('numRows=34 上界首尾为 1', [generate(34)[33][0], generate(34)[33][33]], [1, 1]);

  console.log(`[118-杨辉三角] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generate };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
