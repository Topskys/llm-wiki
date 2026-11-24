/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 01-哈希
 * ------------------------------------------------------------
 * 题号：49
 * 题目：字母异位词分组（Group Anagrams）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/group-anagrams/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
 * 字母异位词 是由重新排列源单词的所有字母得到的一个新单词。
 *
 * 【示例】
 * 输入：strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 * 输出：[["bat"],["nat","tan"],["ate","eat","tea"]]
 *
 * 【提示】
 * 1 <= strs.length <= 10^4
 * 0 <= strs[i].length <= 100
 * strs[i] 仅包含小写字母
 *
 * 【算法思路】
 * 1、字母异位词排序后必然相同，将排序后的字符串作为规范 key。
 * 2、用 Map 以该 key 聚合分组，一次遍历即可完成。
 * 3、也可用字符计数数组作 key（如 "a1b2c0..."），避免排序开销，但排序法更直观。
 *
 * 【复杂度】
 * 时间复杂度：O(n·k log k)，n 为字符串数，k 为最长字符串长度（排序开销）
 * 空间复杂度：O(n·k)，存储所有字符串
 * ============================================================
 */

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}

// ============================== 测试 ==============================
function runTests() {
  let pass = 0;
  let fail = 0;
  const eq = (label, actual, expected) => {
    const norm = (list) => list.map(g => g.slice().sort()).sort((a, b) => a.join('').localeCompare(b.join('')));
    const ok = JSON.stringify(norm(actual)) === JSON.stringify(norm(expected));
    if (ok) {
      pass++;
    } else {
      fail++;
      console.error(`  ✗ ${label}\n    期望 ${JSON.stringify(norm(expected))}\n    实际 ${JSON.stringify(norm(actual))}`);
    }
  };

  eq('基本示例', groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']), [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]);
  eq('空数组', groupAnagrams([]), []);
  eq('单空串', groupAnagrams(['']), [['']]);
  eq('单元素', groupAnagrams(['a']), [['a']]);
  eq('重复元素', groupAnagrams(['a', 'a']), [['a', 'a']]);
  eq('空串与普通串共存', groupAnagrams(['', 'b', '']), [['', ''], ['b']]);
  eq('全不同', groupAnagrams(['abc', 'def', 'ghi']), [['abc'], ['def'], ['ghi']]);
  eq('全相同异位词', groupAnagrams(['abc', 'bca', 'cab']), [['abc', 'bca', 'cab']]);

  console.log(`[49-字母异位词分组] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { groupAnagrams };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}