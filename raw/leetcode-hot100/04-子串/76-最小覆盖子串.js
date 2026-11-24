/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 04-子串
 * ------------------------------------------------------------
 * 题号：76
 * 题目：最小覆盖子串（Minimum Window Substring）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/minimum-window-substring/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。
 * 如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。
 *
 * 【示例】
 * 输入：s = "ADOBECODEBANC", t = "ABC"
 * 输出："BANC"
 *
 * 【提示】
 * 1 <= s.length, t.length <= 10^5
 * s 和 t 由英文字母组成
 *
 * 【算法思路】
 * 1、可变长滑动窗口 + need/window 计数。
 * 2、need 记录 t 中各字符需求数，window 记录当前窗口各字符数，matched 记录已满足需求的字符种类数。
 * 3、right 右扩，当某字符计数达到需求时 matched++。
 * 4、matched 等于需求种类数时，尝试左缩：移出字符若导致不足则 matched--。
 * 5、每次达标时更新最小窗口。
 *
 * 【复杂度】
 * 时间复杂度：O(m + n)，每个字符进出窗口各一次
 * 空间复杂度：O(|Σ|)，字符集大小
 * ============================================================
 */

/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
function minWindow(s, t) {
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  const window = new Map();
  let matched = 0;
  let left = 0;
  let start = 0;
  let minLen = Infinity;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (need.has(ch)) {
      window.set(ch, (window.get(ch) || 0) + 1);
      if (window.get(ch) === need.get(ch)) matched++;
    }
    while (matched === need.size) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const out = s[left++];
      if (need.has(out)) {
        if (window.get(out) === need.get(out)) matched--;
        window.set(out, window.get(out) - 1);
      }
    }
  }
  return minLen === Infinity ? '' : s.slice(start, start + minLen);
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

  eq('基本示例', minWindow('ADOBECODEBANC', 'ABC'), 'BANC');
  eq('单字符命中', minWindow('a', 'a'), 'a');
  eq('无解', minWindow('a', 'aa'), '');
  eq('重复字符需求', minWindow('aa', 'aa'), 'aa');
  eq('t 比 s 长', minWindow('ab', 'abc'), '');
  eq('整串命中', minWindow('abc', 'abc'), 'abc');
  eq('最小窗口在中间', minWindow('xabcy', 'abc'), 'abc');
  eq('含大小写', minWindow('AaBbCc', 'abc'), 'aBbCc');
  eq('多解取最短', minWindow('abacb', 'abc'), 'bac');
  eq('t 全相同', minWindow('baaa', 'aa'), 'aa');
  eq('s 全相同', minWindow('aaaa', 'aa'), 'aa');

  console.log(`[76-最小覆盖子串] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { minWindow };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}