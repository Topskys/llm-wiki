/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 15-动态规划
 * ------------------------------------------------------------
 * 题号：32
 * 题目：最长有效括号（Longest Valid Parentheses）
 * 难度：困难
 * 链接：https://leetcode.cn/problems/longest-valid-parentheses/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。
 *
 * 【示例】
 * 输入：s = "(()"
 * 输出：2
 * 解释：最长有效括号子串是 "()"。
 *
 * 输入：s = ")()())"
 * 输出：4
 * 解释：最长有效括号子串是 "()()"。
 *
 * 输入：s = ""
 * 输出：0
 *
 * 【提示】
 * 0 <= s.length <= 3 * 10^4
 * s[i] 为 '(' 或 ')'
 *
 * 【算法思路】
 * 1、栈存下标法：栈底始终保持「最后一个未被匹配的右括号的下标」，初始为 -1。
 * 2、遇 '(' 时将其下标入栈；遇 ')' 时先弹栈顶（尝试匹配）。
 * 3、若弹栈后栈为空，说明当前右括号无法匹配，将其下标入栈作为新的「分割点」。
 * 4、若弹栈后栈非空，当前有效长度 = 当前下标 - 栈顶下标，更新最大值。
 * 5、关键不变量：栈顶元素总是「最近一个未匹配右括号的下标」，
 *    因此 i - 栈顶 就是以当前位置结尾的最长有效括号长度。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个字符入栈出栈至多一次
 * 空间复杂度：O(n)，栈最坏存全部下标
 * ============================================================
 */

/**
 * @param {string} s
 * @return {number}
 */
function longestValidParentheses(s) {
  const stack = [-1]; // 栈底哨兵：最后一个未匹配右括号的位置
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop(); // 尝试匹配
      if (stack.length === 0) {
        stack.push(i); // 当前右括号成为新的分割点
      } else {
        maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
      }
    }
  }
  return maxLen;
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

  eq('s="(()"', longestValidParentheses('(()'), 2);
  eq('s=")()())"', longestValidParentheses(')()())'), 4);
  eq('s="" 空串', longestValidParentheses(''), 0);
  eq('s="(" 单左括号', longestValidParentheses('('), 0);
  eq('s=")" 单右括号', longestValidParentheses(')'), 0);
  eq('s="()((()))" 嵌套', longestValidParentheses('()((()))'), 8);
  eq('s="()(()" 尾部未闭合', longestValidParentheses('()(()'), 2);
  eq('s=")(()())" 前缀多余右括号', longestValidParentheses(')(()())'), 6);
  eq('s="((()))" 全嵌套', longestValidParentheses('((()))'), 6);
  eq('s="()()" 连续', longestValidParentheses('()()'), 4);

  console.log(`[32-最长有效括号] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { longestValidParentheses };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}