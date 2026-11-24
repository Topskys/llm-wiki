/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 03-滑动窗口
 * ------------------------------------------------------------
 * 题号：438
 * 题目：找到字符串中所有字母异位词（Find All Anagrams in a String）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/find-all-anagrams-in-a-string/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定两个字符串 s 和 p，找到 s 中所有 p 的 字母异位词 的子串，返回这些子串的起始索引。
 * 不考虑答案输出的顺序。
 *
 * 【示例】
 * 输入：s = "cbaebabacd", p = "abc"
 * 输出：[0,6]
 * 解释：起始索引 0 的子串 "cba" 是 "abc" 的异位词；索引 6 的 "bac" 也是。
 *
 * 【提示】
 * 1 <= s.length, p.length <= 3 * 10^4
 * s 和 p 仅包含小写字母
 *
 * 【算法思路】
 * 1、定长滑动窗口，窗口大小等于 p 的长度。
 * 2、用 26 桶词频差分：维护窗口与 p 的词频差异，diff 记录非零项个数。
 * 3、窗口右移时，进窗字符与出窗字符各改一个桶，O(1) 判定是否为异位词。
 * 4、diff 为 0 时窗口即为 p 的异位词，记录起始索引。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个字符进出窗口各一次
 * 空间复杂度：O(1)，固定 26 桶
 * ============================================================
 */

/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
function findAnagrams(s, p) {
  const res = [];
  if (s.length < p.length) return res;
  const cnt = new Array(26).fill(0);
  const aCode = 97;
  for (const ch of p) cnt[ch.charCodeAt(0) - aCode]++;
  let diff = 0;
  for (const c of cnt) if (c !== 0) diff++;

  for (let i = 0; i < s.length; i++) {
    // 进窗
    const inIdx = s.charCodeAt(i) - aCode;
    if (cnt[inIdx] === 0) diff++;
    cnt[inIdx]--;
    if (cnt[inIdx] === 0) diff--;

    // 出窗
    if (i >= p.length) {
      const outIdx = s.charCodeAt(i - p.length) - aCode;
      if (cnt[outIdx] === 0) diff++;
      cnt[outIdx]++;
      if (cnt[outIdx] === 0) diff--;
    }

    if (i >= p.length - 1 && diff === 0) {
      res.push(i - p.length + 1);
    }
  }
  return res;
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

  eq('基本示例', findAnagrams('cbaebabacd', 'abc'), [0, 6]);
  eq('abab', findAnagrams('abab', 'ab'), [0, 1, 2]);
  eq('p 比 s 长', findAnagrams('ab', 'abc'), []);
  eq('单字符命中', findAnagrams('aaa', 'a'), [0, 1, 2]);
  eq('无命中', findAnagrams('abc', 'xyz'), []);
  eq('cabacb 边界', findAnagrams('cabacb', 'abc'), [0, 2, 3]);
  eq('p 与 s 相同', findAnagrams('abc', 'abc'), [0]);
  eq('含重复字母', findAnagrams('baa', 'aa'), [1]);

  console.log(`[438-找到字符串中所有字母异位词] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { findAnagrams };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}