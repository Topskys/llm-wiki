/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 16-多维动态规划
 * ------------------------------------------------------------
 * 题号：72
 * 题目：编辑距离（Edit Distance）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/edit-distance/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你两个单词 word1 和 word2 ，请你计算出将 word1 转换成 word2 所使用的最少操作数。
 * 你可以对一个单词进行如下三种操作：
 * 1. 插入一个字符
 * 2. 删除一个字符
 * 3. 替换一个字符
 *
 * 【示例】
 * 输入：word1 = "horse", word2 = "ros"
 * 输出：3
 * 解释：
 * horse -> rorse (将 'h' 替换为 'r')
 * rorse -> rose (删除 'r')
 * rose -> ros (删除 'e')
 *
 * 输入：word1 = "intention", word2 = "execution"
 * 输出：5
 *
 * 【提示】
 * 0 <= word1.length, word2.length <= 500
 * word1 和 word2 由小写英文字母组成
 *
 * 【算法思路】
 * 1、状态定义：dp[i][j] 表示将 word1[0..i-1] 转换为 word2[0..j-1] 的最小操作数。
 * 2、转移方程（三种操作对应三个子问题）：
 *    - 替换/不操作：若 word1[i-1] === word2[j-1] 则 dp[i][j] = dp[i-1][j-1]；否则 dp[i][j] = dp[i-1][j-1] + 1（替换）。
 *    - 删除：dp[i][j] = dp[i-1][j] + 1（删除 word1[i-1]）。
 *    - 插入：dp[i][j] = dp[i][j-1] + 1（在 word1 末尾插入 word2[j-1]）。
 *    dp[i][j] = 三者取最小值。
 * 3、初始化：dp[0][j] = j（空串转 word2[0..j-1] 需 j 次插入）；dp[i][0] = i（word1[0..i-1] 转空串需 i 次删除）。
 * 4、遍历顺序：i 从 1 到 m，j 从 1 到 n。
 * 5、空间优化：只需上一行与当前行，用两个一维数组滚动，或反向遍历一维数组。
 *
 * 【复杂度】
 * 时间复杂度：O(m * n)
 * 空间复杂度：O(min(m, n))（滚动数组优化）
 * ============================================================
 */

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  // 保证用较短字符串作列，节省空间
  if (m < n) {
    const t = word1; word1 = word2; word2 = t;
  }
  const dp = new Array(n + 1).fill(0);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]; // dp[i-1][0]
    dp[0] = i;        // dp[i][0]
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]; // 旧 dp[j] 即 dp[i-1][j]，下一轮作 prev
      if (word1[i - 1] === word2[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = Math.min(prev, dp[j], dp[j - 1]) + 1;
      }
      prev = tmp;
    }
  }
  return dp[n];
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

  eq('word1="horse" word2="ros"', minDistance('horse', 'ros'), 3);
  eq('word1="intention" word2="execution"', minDistance('intention', 'execution'), 5);
  eq('word1="" word2="abc"', minDistance('', 'abc'), 3);
  eq('word1="abc" word2=""', minDistance('abc', ''), 3);
  eq('word1="abc" word2="abc"', minDistance('abc', 'abc'), 0);
  eq('word1="a" word2="b"', minDistance('a', 'b'), 1);
  eq('word1="abc" word2="def"', minDistance('abc', 'def'), 3);
  eq('word1="kitten" word2="sitting"', minDistance('kitten', 'sitting'), 3);

  console.log(`[72-编辑距离] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { minDistance };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}