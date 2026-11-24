/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 16-多维动态规划
 * ------------------------------------------------------------
 * 题号：1143
 * 题目：最长公共子序列（Longest Common Subsequence）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/longest-common-subsequence/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定两个字符串 text1 和 text2 ，返回这两个字符串的最长 公共子序列 的长度。
 * 子序列是指从原字符串中删除若干（或不删除）字符后，不改变剩余字符相对顺序得到的新字符串。
 *
 * 【示例】
 * 输入：text1 = "abcde", text2 = "ace"
 * 输出：3
 * 解释：最长公共子序列是 "ace"，长度为 3。
 *
 * 【提示】
 * 1 <= text1.length, text2.length <= 1000
 * text1 和 text2 仅由小写英文字符组成
 *
 * 【算法思路】
 * 1、状态定义：dp[i][j] 表示 text1[0..i-1] 与 text2[0..j-1] 的 LCS 长度。
 * 2、转移方程：
 *    - 若 text1[i-1] === text2[j-1]：dp[i][j] = dp[i-1][j-1] + 1（当前字符匹配，长度 +1）
 *    - 否则：dp[i][j] = max(dp[i-1][j], dp[i][j-1])（跳过其中一个字符取最大）
 * 3、初始化：dp[0][*] = dp[*][0] = 0（空串 LCS 为 0）。
 * 4、遍历顺序：i 从 1 到 m，j 从 1 到 n（两层嵌套）。
 * 5、空间优化：只需上一行与当前行，用两个一维数组滚动，或反向遍历一维数组。
 *
 * 【复杂度】
 * 时间复杂度：O(m * n)
 * 空间复杂度：O(min(m, n))（滚动数组优化）
 * ============================================================
 */

/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  // 保证用较短字符串作列，节省空间
  if (m < n) {
    const t = text1; text1 = text2; text2 = t;
  }
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    let prev = 0; // dp[i-1][j-1]
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]; // 旧 dp[j] 即 dp[i-1][j]，下一轮作 prev
      if (text1[i - 1] === text2[j - 1]) {
        dp[j] = prev + 1;
      } else {
        dp[j] = Math.max(dp[j], dp[j - 1]);
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

  eq('text1="abcde" text2="ace"', longestCommonSubsequence('abcde', 'ace'), 3);
  eq('text1="abc" text2="abc"', longestCommonSubsequence('abc', 'abc'), 3);
  eq('text1="abc" text2="def" 无公共', longestCommonSubsequence('abc', 'def'), 0);
  eq('text1="" 空串', longestCommonSubsequence('', 'abc'), 0);
  eq('text1="bsbininm" text2="jmjkbkjkv"', longestCommonSubsequence('bsbininm', 'jmjkbkjkv'), 1);
  eq('长相同串 1000 a', longestCommonSubsequence('a'.repeat(1000), 'a'.repeat(1000)), 1000);

  console.log(`[1143-最长公共子序列] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { longestCommonSubsequence };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}