/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 03-滑动窗口
 * ------------------------------------------------------------
 * 题号：3
 * 题目：无重复字符的最长子串（Longest Substring Without Repeating Characters）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/longest-substring-without-repeating-characters/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
 *
 * 【示例】
 * 输入：s = "abcabcbb"
 * 输出：3
 * 解释：因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 *
 * 【提示】
 * 0 <= s.length <= 5 * 10^4
 * s 由英文字母、数字、符号和空格组成
 *
 * 【算法思路】
 * 1、滑动窗口 + Map 记录每个字符最近一次出现的下标。
 * 2、right 右扩，若当前字符已在窗口内（last >= left），则 left 跳到 last+1。
 * 3、left 只前进不回退，用 Math.max(left, last+1) 防止左指针回退。
 * 4、每步更新最大长度 right - left + 1。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个字符至多被访问两次
 * 空间复杂度：O(min(n, |Σ|))，Σ 为字符集
 * ============================================================
 */

/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch)) {
      left = Math.max(left, last.get(ch) + 1);
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
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

  eq('abcabcbb', lengthOfLongestSubstring('abcabcbb'), 3);
  eq('bbbbb', lengthOfLongestSubstring('bbbbb'), 1);
  eq('pwwkew', lengthOfLongestSubstring('pwwkew'), 3);
  eq('空串', lengthOfLongestSubstring(''), 0);
  eq('单字符', lengthOfLongestSubstring('a'), 1);
  eq('全不同', lengthOfLongestSubstring('abcdef'), 6);
  eq('含空格', lengthOfLongestSubstring('a b a'), 3);
  eq('含数字符号', lengthOfLongestSubstring('a1!a'), 3);
  eq('abba 回退陷阱', lengthOfLongestSubstring('abba'), 2);

  console.log(`[3-无重复字符的最长子串] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { lengthOfLongestSubstring };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}