/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 10-回溯
 * ------------------------------------------------------------
 * 题号：17
 * 题目：电话号码的字母组合（Letter Combinations of a Phone Number）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/letter-combinations-of-a-phone-number/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个仅包含数字 2-9 的字符串 digits ，返回所有它能表示的
 * 字母组合。答案可以按任意顺序返回。
 * 给出数字到字母的映射，与电话按键相同：2 对应 abc，3 对应 def，
 * 依此类推；注意 1 不对应任何字母，7 与 9 各对应 4 个字母。
 *
 * 【示例】
 * 输入：digits = "23"
 * 输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
 * 解释：2 -> abc，3 -> def，两键各取一字母做笛卡尔组合，共 3*3 = 9 个。
 *
 * 输入：digits = ""
 * 输出：[]
 * 解释：没有数字，按要求返回空列表（注意不是 [""]）。
 *
 * 输入：digits = "2"
 * 输出：["a","b","c"]
 *
 * 【提示】
 * 0 <= digits.length <= 4
 * digits[i] 是范围 ['2', '9'] 的一个数字
 * '7' -> "pqrs"、'9' -> "wxyz" 各 4 个字母，其余按键 3 个字母
 *
 * 【算法思路】
 * 1、建映射：用表把数字字符映射到按键字母串，'7' 与 '9' 各 4 个字母。
 * 2、分层：把 digits 的每一位看作一层选择列表，做笛卡尔积式回溯。
 * 3、选择-递归-撤销：取 letters = map[digits[index]]，逐个字符 push，
 *    递归 backtrack(index + 1)，返回后 pop 换下一个字母。
 * 4、终止条件：index === digits.length 时把 path 拼成字符串收集。
 * 5、边界要点：空串直接返回 []（不是 [""]）；各位数字互不干扰，无需去重。
 *
 * 【复杂度】
 * 时间复杂度：O(n * 4^n)，最多 4 位，每位至多 4 个字母
 * 空间复杂度：O(n)，递归深度与 path（不计输出）
 * ============================================================
 */

// 数字 -> 字母映射（与电话九宫格一致，'7' 与 '9' 各 4 个字母）
const PHONE_MAP = {
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz'
};

/**
 * 求电话号码字符串的全部字母组合（逐位回溯）
 * @param {string} digits - 仅含 '2'-'9' 的字符串
 * @return {string[]} 所有字母组合，digits 为空时返回 []
 */
function letterCombinations(digits) {
  const res = [];
  if (typeof digits !== 'string' || digits.length === 0) return res; // 空串特判
  const n = digits.length;
  const path = [];

  // 回溯主体：index 为当前要选字母的数字位
  const backtrack = (index) => {
    if (index === n) {
      res.push(path.join('')); // 每一位都已选定，收集组合
      return;
    }
    const letters = PHONE_MAP[digits[index]];
    if (!letters) { // 非法数字（如 '0'、'1'）无法继续
      return;
    }
    for (let i = 0; i < letters.length; i++) {
      path.push(letters[i]);       // 选择
      backtrack(index + 1);        // 递归下一位
      path.pop();                  // 撤销
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
  // 返回顺序不唯一：组合本身是一维字符串，只需把外层列表排序后比较
  const norm = (list) => list.slice().sort((a, b) => a.localeCompare(b));

  eq('digits="23" 九个组合', norm(letterCombinations('23')), norm([
    'ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'
  ]));
  eq('digits="" 空串返回 []', letterCombinations(''), []);
  eq('digits="2" 单键', norm(letterCombinations('2')), ['a', 'b', 'c']);
  eq('digits="7" 四字母键', norm(letterCombinations('7')), ['p', 'q', 'r', 's']);
  eq('digits="9" 四字母键', norm(letterCombinations('9')), ['w', 'x', 'y', 'z']);
  eq('digits="234" 数量 27', letterCombinations('234').length, 27);
  eq('digits="77" 数量 16', letterCombinations('77').length, 16);
  eq('digits="2345" 数量 81（4 位上限）', letterCombinations('2345').length, 81);
  eq('无重复组合', (() => {
    const set = new Set(letterCombinations('234'));
    return set.size;
  })(), 27);
  eq('非字符串入参', letterCombinations(null), []);

  console.log(`[17-电话号码的字母组合] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { letterCombinations };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
