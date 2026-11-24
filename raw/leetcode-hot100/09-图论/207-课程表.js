/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 09-图论
 * ------------------------------------------------------------
 * 题号：207
 * 题目：课程表（Course Schedule）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/course-schedule/
 * ------------------------------------------------------------
 * 【题目描述】
 * 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
 * 在选修某些课程之前需要一些先修课程。先修课程按数组 prerequisites
 * 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai
 * 则必须先学习课程 bi （即存在有向边 bi -> ai）。
 * 请你判断是否可能完成所有课程，如果可以返回 true ，否则返回 false 。
 *
 * 【示例】
 * 输入：numCourses = 2, prerequisites = [[1,0]]
 * 输出：true
 * 解释：总共有 2 门课程，学习课程 1 之前需先完成课程 0，可以实现。
 *
 * 输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
 * 输出：false
 * 解释：课程 1 与 0 互为先修，形成环，永远无法完成。
 *
 * 【提示】
 * 1 <= numCourses <= 2000
 * 0 <= prerequisites.length <= 5000
 * prerequisites[i].length == 2
 * 所有课程对互不相同（无重复边，但可能有自环 [i,i]）
 *
 * 【算法思路】
 * 1、等价转化：能否修完全部课程 等价于 先修关系有向图是否无环。
 * 2、建图：邻接表 adj[b] 记录 b 的直接后继（边 b -> ai），同时统计每个节点入度 indeg。
 * 3、入队源点：所有入度为 0 的节点先入队——它们没有先修要求，可立即修读。
 * 4、出队消边：每出队一个节点就「修掉」它，其后继入度减 1，减到 0 才入队。
 * 5、环判定：统计出队总数 done，done === numCourses 则无环返回 true；
 *    否则队列提前清空，剩余节点全在环上（入度永远减不到 0），返回 false。
 *
 * 【复杂度】
 * 时间复杂度：O(V + E)，每个节点与每条边各处理一次
 * 空间复杂度：O(V + E)，邻接表与入度数组、队列
 * ============================================================
 */

/**
 * 拓扑排序（BFS 入度法）判断能否完成所有课程
 * @param {number} numCourses - 课程总数，编号 0 .. numCourses-1
 * @param {number[][]} prerequisites - 先修关系 [ai, bi] 表示 bi -> ai
 * @return {boolean} 无环返回 true，存在环返回 false
 */
function canFinish(numCourses, prerequisites) {
  if (numCourses <= 0) return true;
  const adj = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);

  for (const [a, b] of prerequisites) {
    if (a == null || b == null || a < 0 || b < 0 || a >= numCourses || b >= numCourses) {
      return false; // 非法课程编号，直接判不可行
    }
    adj[b].push(a); // 边 b -> a
    indeg[a]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indeg[i] === 0) queue.push(i); // 零入度起点
  }

  let done = 0;
  let head = 0; // 用下标当队首，避免 shift 的 O(n) 开销
  while (head < queue.length) {
    const u = queue[head++];
    done++;
    for (const v of adj[u]) {
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v); // 入度清零才可入队
    }
  }
  return done === numCourses;
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

  eq('示例1 一条边可行', canFinish(2, [[1, 0]]), true);
  eq('示例2 二元环不可行', canFinish(2, [[1, 0], [0, 1]]), false);
  eq('无先修要求 n=2', canFinish(2, []), true);
  eq('单门课 n=1 无依赖', canFinish(1, []), true);
  eq('单门课自环 n=1', canFinish(1, [[0, 0]]), false);
  eq('numCourses=0 边界', canFinish(0, []), true);
  eq('三元环 0->1->2->0', canFinish(3, [[0, 1], [1, 2], [2, 0]]), false);
  eq('链式依赖 4 门课', canFinish(4, [[1, 0], [2, 1], [3, 2]]), true);
  eq('菱形依赖可拓扑排序', canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]), true);
  eq('环外还有孤立节点', canFinish(4, [[0, 1], [1, 2], [2, 0]]), false);
  eq('重复边不影响判定', canFinish(3, [[1, 0], [1, 0], [2, 1]]), true);

  console.log(`[207-课程表] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { canFinish };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
