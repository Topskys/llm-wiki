/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 16-多维动态规划
 * ------------------------------------------------------------
 * 题号：5
 * 题目：最长回文子串（Longest Palindromic Substring）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/longest-palindromic-substring/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个字符串 s ，找到其中最长的回文子串。
 * 子串是字符串中连续的字符序列。
 *
 * 【示例】
 * 输入：s = "babad"
 * 输出："bab" 或 "aba"
 *
 * 输入：s = "cbbd"
 * 输出："bb"
 *
 * 【提示】
 * 1 <= s.length <= 1000
 * s 仅由数字和英文字母组成
 *
 * 【算法思路】
 * 1、主解法：中心扩展法。回文中心可能是一个字符（奇数长度）或两字符之间（偶数长度），共 2n-1 个中心。
 * 2、对每个中心左右同时扩展，直到字符不等或越界，记录最长。
 * 3、时间 O(n^2)，空间 O(1)，比 Manacher O(n) 易实现且常数小。
 * 4、对比区间 DP：dp[i][j] 表示 s[i..j] 是否回文，转移需 s[i]==s[j] && dp[i+1][j-1]，亦 O(n^2) 但空间 O(n^2)。
 *
 * 【复杂度】
 * 时间复杂度：O(n^2)
 * 空间复杂度：O(1)
 * ============================================================
 */

/**
 * @param {string} s
 * @return {string}
 */
function longestPalindrome(s) {
  if (!s || s.length < 2) return s;
  let start = 0;
  let maxLen = 1;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--; r++;
    }
    // 此时 [l+1, r-1] 是回文
    if (r - l - 1 > maxLen) {
      maxLen = r - l - 1;
      start = l + 1;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // 奇数长度中心
    expand(i, i + 1); // 偶数长度中心
  }
  return s.slice(start, start + maxLen);
}

// ============================== 测试 ==============================
function runTests() {
  let pass = 0;
  let fail = 0;
  const eq = (label, actual, expected) => {
    // 回文可能有多解，检查实际是否为回文且长度等于期望最长长度
    const isPal = (t) => t === t.split('').reverse().join('');
    const ok = isPal(actual) && actual.length === expected.length;
    if (ok) {
      pass++;
    } else {
      fail++;
      console.error(`  ✗ ${label}\n    期望长度 ${expected.length} (示例 ${expected})\n    实际 ${actual} (长度 ${actual.length}) 是回文 ${isPal(actual)}`);
    }
  };

  eq('s="babad"', longestPalindrome('babad'), 'bab');
  eq('s="cbbd"', longestPalindrome('cbbd'), 'bb');
  eq('s="a"', longestPalindrome('a'), 'a');
  eq('s="ac"', longestPalindrome('ac'), 'a');
  eq('s="aaaa"', longestPalindrome('aaaa'), 'aaaa');
  eq('s="abcba"', longestPalindrome('abcba'), 'abcba');

  console.log(`[5-最长回文子串] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { longestPalindrome };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}