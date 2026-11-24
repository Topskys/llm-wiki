/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 10-回溯
 * ------------------------------------------------------------
 * 题号：131
 * 题目：分割回文串（Palindrome Partitioning）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/palindrome-partitioning/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个字符串 s ，请你将 s 分割成一些子串，使每个子串都是回文串，
 * 返回 s 所有可能的分割方案。
 * 分割方案要求子串按原顺序拼接后恰好等于 s（不重不漏、不可乱序）。
 *
 * 【示例】
 * 输入：s = "aab"
 * 输出：[["a","a","b"],["aa","b"]]
 * 解释：两种切法都使每段为回文；"ab" 不是回文，故 ["a","ab"] 非法。
 *
 * 输入：s = "a"
 * 输出：[["a"]]
 *
 * 【提示】
 * 1 <= s.length <= 16
 * s 仅由小写英文字母组成
 *
 * 【算法思路】
 * 1、把「切割位置」当作选择：backtrack(start) 表示从下标 start 起再切一段。
 * 2、选择：枚举右端点 end（end 从 start 到 n-1），若 s[start..end] 是回文则 push 该子串；非回文的 [start..end] 直接 continue 剪枝，不进入递归。
 * 3、递归：backtrack(end + 1)（下一段从 end+1 开始，段与段不重叠）；撤销：pop 后尝试更长的 end。
 * 4、终止条件：start === s.length，说明整串已切完且每段合法，收集快照。
 * 5、优化：先用区间 DP 预处理 isPal[i][j] 表示 s[i..j] 是否回文，递推式 isPal[i][j] = (s[i] === s[j]) && (j - i < 3 || isPal[i+1][j-1])，按区间长度从小到大填表。
 * 6、此后回溯中的回文判断降为 O(1)，相比每次现算 O(L) 双指针，总时间从 O(n * 2^n * n) 降到 O(n * 2^n)。
 *
 * 【复杂度】
 * 时间复杂度：O(n * 2^n)（预处理 DP 为 O(n^2)，最坏有 2^(n-1) 种切法）
 * 空间复杂度：O(n^2)，回文判定表 + 递归栈与 path
 * ============================================================
 */

/**
 * 预处理回文判定表 isPal[i][j]：s[i..j] 是否为回文串
 * @param {string} s
 * @return {boolean[][]} 二维表，按区间长度递增填表保证子区间已就绪
 */
function buildPalindromeTable(s) {
  const n = s.length;
  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let len = 1; len <= n; len++) { // 枚举区间长度
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && (len <= 3 || isPal[i + 1][j - 1])) {
        isPal[i][j] = true; // 长度 1/2/3 时两端相等即回文，无需查子区间
      }
    }
  }
  return isPal;
}

/**
 * 返回字符串的所有回文分割方案（回溯 + DP 预处理回文判定）
 * @param {string} s - 仅含小写字母的字符串
 * @return {string[][]} 每种方案是回文子串的数组
 */
function partition(s) {
  const res = [];
  if (typeof s !== 'string' || s.length === 0) return res;
  const n = s.length;
  const isPal = buildPalindromeTable(s); // O(n^2) 预处理，回文判断 O(1)
  const path = [];

  /**
   * 回溯主体
   * @param {number} start - 当前待切段的起点下标
   */
  const backtrack = (start) => {
    if (start === n) {
      res.push(path.slice()); // 切到末尾，方案合法
      return;
    }
    for (let end = start; end < n; end++) {
      if (!isPal[start][end]) continue; // 剪枝：非回文段不扩展
      path.push(s.slice(start, end + 1)); // 选择
      backtrack(end + 1);                 // 递归：下一段从 end+1 起
      path.pop();                         // 撤销
    }
  };

  backtrack(0);
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
      console.error(`✗ ${label}`);
      console.error(`  期望: ${JSON.stringify(expected)}`);
      console.error(`  实际: ${JSON.stringify(actual)}`);
    }
  };
  // 分割方案顺序不唯一：先把每个方案的子串数组 join，再整体排序后比较
  const norm = (list) => list.map((p) => p.join('\u0001'))
    .sort((a, b) => a.localeCompare(b));

  eq('示例1 s="aab"', norm(partition('aab')), norm([['a','a','b'], ['aa','b']]));
  eq('示例2 s="a" 单字符', partition('a'), [['a']]);
  eq('空串返回 []', partition(''), []);
  eq('非字符串入参', partition(null), []);
  eq('s="aa" 两种切法', norm(partition('aa')), norm([['a','a'], ['aa']]));
  eq('s="aba" 两种切法', norm(partition('aba')), norm([['a','b','a'], ['aba']]));
  eq('s="abc" 整串非回文只能逐字切', partition('abc'), [['a', 'b', 'c']]);
  eq('s="aaaa" 方案数为 2^3=8', partition('aaaa').length, 8);
  eq('每段拼接还原为原串', partition('aabbaa')
    .every((p) => p.join('') === 'aabbaa'), true);
  eq('每段确为回文', (() => {
    const isPal = (t) => t === t.split('').reverse().join('');
    return partition('abbab').every((p) => p.every(isPal));
  })(), true);
  eq('方案互不重复', (() => {
    const r = partition('abbab');
    return new Set(norm(r)).size;
  })(), r131Len());

  console.log(`[131-分割回文串] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

// 辅助：s="abbab" 的方案总数，供上一条用例比对（避免重复计算写法不一致）
function r131Len() {
  return partition('abbab').length;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { partition };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
