/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 12-栈
 * ------------------------------------------------------------
 * 题号：739
 * 题目：每日温度（Daily Temperatures）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/daily-temperatures/
 * ------------------------------------------------------------
 * 【题目描述】
 * 给定一个整数数组 temperatures ，表示每天的温度，
 * 返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，
 * 下一个更高温度出现在几天后。如果气温在这之后都不会升高，
 * 请在该位置用 0 来代替。
 *
 * 【示例】
 * 输入：temperatures = [73,74,75,71,69,72,76,73]
 * 输出：[1,1,4,2,1,1,0,0]
 * 解释：第 3 天 71 之后第 2 天（下标 5）才出现 72 > 71，故 answer[3] = 2；
 *      第 6 天 76 之后再无更高温度，answer[6] = 0。
 *
 * 【提示】
 * 1 <= temperatures.length <= 10^5
 * 30 <= temperatures[i] <= 100
 *
 * 【算法思路】
 * 1、单调递减栈（栈内存下标，对应温度自底向上严格递减）。
 * 2、遍历第 i 天：只要栈顶那天的温度 < 当前温度，说明栈顶元素「等待的更高温」找到了，弹出 j 并结算 answer[j] = i - j，反复弹到栈顶不再更低为止，再把 i 入栈。
 * 3、每个下标至多入栈、出栈各一次，故为均摊 O(n)。
 * 4、单调性的意义：栈中留下的是「尚未等到升温」的历史天，且越靠栈底温度越高——若某天温度更高却仍在栈里，说明它后面所有天都没超过它，与当前天构成矛盾，故必已被弹出。
 * 5、遍历结束后仍在栈中的下标答案保持 0（之后无更高温度）。
 *
 * 【复杂度】
 * 时间复杂度：O(n)，每个元素进出栈各一次
 * 空间复杂度：O(n)，栈最坏存全部下标（温度严格递减时）
 * ============================================================
 */

/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
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

  eq('官方示例', dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]);
  eq('[30,40,50,60] 严格递增', dailyTemperatures([30, 40, 50, 60]), [1, 1, 1, 0]);
  eq('[60,50,40,30] 严格递减全 0', dailyTemperatures([60, 50, 40, 30]), [0, 0, 0, 0]);
  eq('[50] 单元素', dailyTemperatures([50]), [0]);
  eq('[30,30,30,50] 相等不算升高', dailyTemperatures([30, 30, 30, 50]), [3, 2, 1, 0]);
  eq('[100,30] 值域边界', dailyTemperatures([100, 30]), [0, 0]);
  eq('[30,60,30,40,50] 起伏', dailyTemperatures([30, 60, 30, 40, 50]), [1, 0, 1, 1, 0]);
  eq('[30,40,30,40] 交替', dailyTemperatures([30, 40, 30, 40]), [1, 0, 1, 0]);

  console.log(`[739-每日温度] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { dailyTemperatures };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
