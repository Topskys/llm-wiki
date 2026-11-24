/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 12-栈
 * ------------------------------------------------------------
 * 题号：20
 * 题目：有效的括号（Valid Parentheses）
 * 难度：简单
 * 链接：https://leetcode.cn/problems/valid-parentheses/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，
 * 判断字符串是否有效。
 * 有效字符串需满足：
 * 1. 左括号必须用相同类型的右括号闭合；
 * 2. 左括号必须以正确的顺序闭合；
 * 3. 每个右括号都有一个对应的相同类型的左括号。
 *
 * 【示例】
 * 输入：s = "()"
 * 输出：true
 *
 * 输入：s = "(]"
 * 输出：false
 * 解释：右括号 ] 与栈顶的 ( 类型不匹配，故无效。
 *
 * 【提示】
 * 1 <= s.length <= 10^4
 * s 仅由括号 '()[]{}' 组成
 *
 * 【算法思路】
 * 1、括号匹配具有「后进先出」的嵌套结构，天然对应栈；遇左括号入栈，遇右括号弹栈顶并检查类型。
 * 2、用 Map 存「右 -> 左」映射，避免一长串 if 分支；右括号时栈空或类型不符直接返回 false。
 * 3、扫描结束后栈必须为空，否则说明有未闭合的左括号，返回 false。
 * 4、额外剪枝：字符串长度为奇数必然无法两两配对，可直接返回 false。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，单次遍历
 * 空间复杂度：O(n)，最坏全为左括号（实际受字符集限制上界为 n）
 * ============================================================
 */

/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  if ((s.length & 1) === 1) return false;
  const pairs = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ]);
  const stack = [];
  for (const ch of s) {
    if (pairs.has(ch)) {
      // 右括号：栈顶必须是对应的左括号
      if (stack.pop() !== pairs.get(ch)) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
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

  eq('s="()"', isValid('()'), true);
  eq('s="()[]{}"', isValid('()[]{}'), true);
  eq('s="(]" 类型不匹配', isValid('(]'), false);
  eq('s="([)]" 交叉不合法', isValid('([)]'), false);
  eq('s="{[]}" 嵌套合法', isValid('{[]}'), true);
  eq('s="" 空串', isValid(''), true);
  eq('s="(" 只有左括号', isValid('('), false);
  eq('s=")" 只有右括号', isValid(')'), false);
  eq('s="((" 未闭合', isValid('(('), false);
  eq('s="()(" 尾部未闭合', isValid('()('), false);
  eq('奇数长度剪枝 "(()"', isValid('(()'), false);

  console.log(`[20-有效的括号] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValid };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
