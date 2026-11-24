/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 14-贪心
 * ------------------------------------------------------------
 * 题号：763
 * 题目：划分字母区间（Partition Labels）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/partition-labels/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，
 * 同一字母最多出现在一个片段中。
 * 注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 s 。
 * 返回一个表示每个字符串片段的长度的列表。
 *
 * 【示例】
 * 输入：s = "ababcbacadefegdehijhklij"
 * 输出：[9,7,8]
 * 解释：划分结果为 "ababcbaca"、"defegde"、"hijhklij" 。
 *      每个字母最多出现在一个片段中；像 "ababcbacadefegde" 这样的划分
 *      包含的片段更少，因此不被接受。
 *
 * 【提示】
 * 1 <= s.length <= 500
 * s 仅由小写英文字母组成
 *
 * 【算法思路】
 * 1、先一次遍历记录每个字母最后一次出现的下标 last[c]。
 * 2、再一次遍历，维护当前片段内所有字母的「最远必须覆盖位置」end = max(end, last[c])。
 * 3、当 i == end 时，说明片段内每个字母的后续出现都已被本片段包住，可以在此切一刀，记录长度 i - start + 1 并开启新片段。
 * 4、贪心依据：切割点必须不小于片段内任意字母的末次出现位置，取最早满足的位置即得到最短（从而最多）的合法片段。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，两次线性扫描
 * 空间复杂度：O(Σ)，Σ 为字符集大小（此处 26），视为 O(1)
 * ============================================================
 */

/**
 * @param {string} s
 * @return {number[]}
 */
function partitionLabels(s) {
  const last = new Map();
  for (let i = 0; i < s.length; i++) last.set(s[i], i);
  const res = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i]));
    if (i === end) {
      res.push(end - start + 1);
      start = end + 1;
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

  eq('s="ababcbacadefegdehijhklij"', partitionLabels('ababcbacadefegdehijhklij'), [9, 7, 8]);
  eq('s="a"', partitionLabels('a'), [1]);
  eq('s="aaaa" 全相同只一段', partitionLabels('aaaa'), [4]);
  eq('s="abcdef" 全不同每段一个', partitionLabels('abcdef'), [1, 1, 1, 1, 1, 1]);
  eq('s="abba" 交叉必须合并', partitionLabels('abba'), [4]);
  eq('s="abcabdef" 前缀交叉', partitionLabels('abcabdef'), [5, 1, 1, 1]);
  eq('s="eccbbbbdec"', partitionLabels('eccbbbbdec'), [10]);

  console.log(`[763-划分字母区间] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { partitionLabels };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
