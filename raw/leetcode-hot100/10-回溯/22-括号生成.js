/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 10-回溯
 * ------------------------------------------------------------
 * 题号：22
 * 题目：括号生成（Generate Parentheses）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/generate-parentheses/
 * ------------------------------------------------------------
 * 【题目描述】
 * 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有
 * 可能的并且有效的括号组合。
 * 有效组合需满足：左右括号各 n 个，且任意前缀中左括号数量
 * 不少于右括号数量（不会出现 ")" 先于配对 "(" 出现的情况）。
 *
 * 【示例】
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 * 解释：3 对括号的全部 5 种合法形态（第 3 个卡特兰数 C3 = 5）。
 *
 * 输入：n = 1
 * 输出：["()"]
 *
 * 【提示】
 * 1 <= n <= 8
 * 结果数量等于卡特兰数 C(n) = (2n)! / ((n+1)! * n!)，n = 8 时为 1430 个
 *
 * 【算法思路】
 * 1、按「位置」做选择：每个位置只能放 '(' 或 ')'，用 open / close 两个计数器记录已使用的左、右括号数量，天然完成剪枝。
 * 2、若 open < n，可以放左括号：追加 '(' -> 递归 -> 撤销。
 * 3、若 close < open，可以放右括号（保证任意前缀合法）：追加 ')' -> 递归 -> 撤销。
 * 4、终止条件：path 长度达到 2n，此时 open === close === n，收集快照。
 * 5、剪枝要点：close <= open 恒成立，故非法前缀根本不会被扩展，无需事后校验；两个计数条件即是全部约束。
 *
 * 【复杂度】
 * 时间复杂度：O(4^n / sqrt(n))，即卡特兰数级别的合法叶子乘以串长
 * 空间复杂度：O(n)，递归深度 2n（不计输出）
 * ============================================================
 */

/**
 * 生成 n 对括号的全部有效组合（open/close 计数剪枝回溯）
 * @param {number} n - 括号对数
 * @return {string[]} 所有合法括号组合
 */
function generateParenthesis(n) {
  const res = [];
  if (!Number.isInteger(n) || n <= 0) return res; // n = 0 无括号对，返回空
  const path = [];

  /**
   * 回溯主体
   * @param {number} open - 已使用的左括号数
   * @param {number} close - 已使用的右括号数
   */
  const backtrack = (open, close) => {
    if (path.length === 2 * n) {
      res.push(path.join('')); // 长度达标即合法完整组合
      return;
    }
    if (open < n) { // 左括号还有剩余才能放
      path.push('(');      // 选择
      backtrack(open + 1, close); // 递归
      path.pop();          // 撤销
    }
    if (close < open) { // 右括号不得超过已放左括号数（前缀合法性剪枝）
      path.push(')');
      backtrack(open, close + 1);
      path.pop();
    }
  };

  backtrack(0, 0);
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
  // 组合顺序不唯一：一维字符串列表，排序后比较（内层无嵌套结构）
  const norm = (list) => list.slice().sort((a, b) => a.localeCompare(b));

  eq('n=3 五种合法组合', norm(generateParenthesis(3)), norm([
    '((()))', '(()())', '(())()', '()(())', '()()()'
  ]));
  eq('n=1', generateParenthesis(1), ['()']);
  eq('n=2', norm(generateParenthesis(2)), norm(['(())', '()()']));
  eq('n=0 边界返回空', generateParenthesis(0), []);
  eq('负数入参返回空', generateParenthesis(-1), []);
  eq('n=4 数量为卡特兰数 14', generateParenthesis(4).length, 14);
  eq('n=5 数量为 42', generateParenthesis(5).length, 42);
  eq('n=8 数量为 1430', generateParenthesis(8).length, 1430);
  eq('全部串长度为 2n', generateParenthesis(4).every((s) => s.length === 8), true);
  eq('无重复结果', new Set(generateParenthesis(4)).size, 14);
  eq('每个组合左右括号数相等', generateParenthesis(3)
    .every((s) => s.split('(').length === s.split(')').length), true);

  console.log(`[22-括号生成] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateParenthesis };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
