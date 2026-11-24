/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 12-栈
 * ------------------------------------------------------------
 * 题号：394
 * 题目：字符串解码（Decode String）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/decode-string/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个经过编码的字符串，返回它解码后的字符串。
 * 编码规则为: k[encoded_string] ，表示其中方括号内部的 encoded_string 正好重复 k 次。
 * 注意 k 保证为正整数。
 * 你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，
 * 且输入的方括号总是符合格式要求的。
 * 此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，
 * 例如不会出现像 3a 或 2[4] 的输入。
 *
 * 【示例】
 * 输入：s = "3[a]2[bc]"
 * 输出："aaabcbc"
 * 解释：3[a] 展开为 aaa，2[bc] 展开为 bcbc，拼接得 aaabcbc。
 *
 * 输入：s = "3[a2[c]]"
 * 输出："accaccacc"
 * 解释：内层 2[c] 先展开为 cc，再被外层重复 3 次。
 *
 * 【提示】
 * 1 <= s.length <= 30
 * s 由小写英文字母、数字和括号 [] 组成
 * s 确保有合理的格式化方式（括号成对、数字均为正整数）
 *
 * 【算法思路】
 * 1、括号嵌套是典型的栈结构，用两个栈分别保存「外层已成型的结果」与「重复次数」。
 * 2、从左到右扫描：连续数字聚合成 num（多位数需 num = num*10 + 位值）；
 * 3、遇 '[' 把当前累积字符串 cur 与次数 num 各入栈，然后清空二者进入内层；
 * 4、遇 ']' 弹栈：num 次内层 cur 拼接到外层 prev 之后，得到新的 cur；
 * 5、遇字母直接追加到 cur。这样外层状态被完整保存在栈里，内层解完后自然回接，正确处理任意层嵌套。
 *
 * 【复杂度】
 * 时间复杂度：O(n · M)，n 为串长，M 为展开后总长度上界
 * 空间复杂度：O(n + 输出长度)，栈深与结果串
 * ============================================================
 */

/**
 * @param {string} s
 * @return {string}
 */
function decodeString(s) {
  const strStack = [];
  const numStack = [];
  let cur = '';
  let num = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === '[') {
      strStack.push(cur);
      numStack.push(num);
      cur = '';
      num = 0;
    } else if (ch === ']') {
      const repeat = numStack.pop();
      const prev = strStack.pop();
      cur = prev + cur.repeat(repeat);
    } else {
      cur += ch;
    }
  }
  return cur;
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

  eq('s="3[a]2[bc]"', decodeString('3[a]2[bc]'), 'aaabcbc');
  eq('s="3[a2[c]]" 两层嵌套', decodeString('3[a2[c]]'), 'accaccacc');
  eq('s="2[abc]3[cd]ef"', decodeString('2[abc]3[cd]ef'), 'abcabccdcdcdef');
  eq('s="abc3[cd]xyz"', decodeString('abc3[cd]xyz'), 'abccdcdcdxyz');
  eq('s="1[a]" 重复一次', decodeString('1[a]'), 'a');
  eq('s="10[a]" 多位数次数', decodeString('10[a]'), 'aaaaaaaaaa');
  eq('s="2[3[a]b]" 嵌套含前缀', decodeString('2[3[a]b]'), 'aaabaaab');
  eq('s="100[leetcode]" 长重复', decodeString('100[leetcode]').length, 800);
  eq('s="1[1[1[a]]]" 三层', decodeString('1[1[1[a]]]'), 'a');

  console.log(`[394-字符串解码] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { decodeString };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
