/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：139
 * 题目：单词拆分（Word Break）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/word-break/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。
 * 请你判断是否可以利用字典中出现的单词拼接出 s 。
 * 注意：不要求字典中出现的单词全部都使用，且字典中的单词可以重复使用。
 *
 * 【示例】
 * 输入：s = "leetcode", wordDict = ["leet","code"]
 * 输出：true
 *
 * 输入：s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
 * 输出：false
 *
 * 【提示】
 * 1 <= s.length <= 300
 * 1 <= wordDict.length <= 1000
 * 1 <= wordDict[i].length <= 20
 * s 和 wordDict[i] 仅有小写英文字母
 *
 * 【算法思路】
 * 1、状态定义：dp[i] 表示 s[0..i-1]（前 i 个字符）是否可以被拆分。
 * 2、转移方程：dp[i] = true 若存在 j < i 使得 dp[j] 为 true 且 s[j..i-1] 在 wordDict 中。
 * 3、初始化：dp[0] = true（空串可拆分）。
 * 4、遍历顺序：i 从 1 到 n，内层 j 从 0 到 i-1，wordDict 存入 Set 查 O(1)。
 * 5、优化：记录字典中最长单词长度 maxLen，内层 j 从 max(0, i - maxLen) 开始，减少无效枚举。
 *
 * 【复杂度】
 * 时间复杂度：O(n * maxLen) 或 O(n^2)
 * 空间复杂度：O(n)
 * ============================================================
 */

/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  let maxLen = 0;
  for (const w of wordDict) if (w.length > maxLen) maxLen = w.length;
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i++) {
    const start = Math.max(0, i - maxLen);
    for (let j = start; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
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

  eq('s="leetcode" dict=["leet","code"]', wordBreak('leetcode', ['leet', 'code']), true);
  eq('s="catsandog" dict=["cats","dog","sand","and","cat"]', wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']), false);
  eq('s="applepenapple" dict=["apple","pen"]', wordBreak('applepenapple', ['apple', 'pen']), true);
  eq('s="a" dict=["a"]', wordBreak('a', ['a']), true);
  eq('s="a" dict=["b"]', wordBreak('a', ['b']), false);
  eq('s="" dict=["a"]', wordBreak('', ['a']), true);
  eq('单词可重用 s="aaaa" dict=["a"]', wordBreak('aaaa', ['a']), true);

  console.log(`[139-单词拆分] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { wordBreak };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}