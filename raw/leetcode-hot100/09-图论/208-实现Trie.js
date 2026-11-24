/**
 * ============================================================
 * LeetCode 热题 HOT 100 · 09-图论
 * ------------------------------------------------------------
 * 题号：208
 * 题目：实现 Trie (前缀树)（Implement Trie (Prefix Tree)）
 * 难度：中等
 * 链接：https://leetcode.cn/problems/implement-trie-prefix-tree/
 * ------------------------------------------------------------
 * 【题目描述】
 * Trie（发音类似 "try"），也称「前缀树」或「字典树」，是一种树形
 * 数据结构，用于快速检索多重键的元素。实现 Trie 类：
 * Trie() 无参构造，初始化前缀树对象；
 * insert(word) 向前缀树中插入字符串 word；
 * search(word) 若字符串 word 在前缀树中（曾被插入过）返回 true；
 * startsWith(prefix) 若之前已插入的字符串中有以 prefix 为前缀的
 * 返回 true，否则返回 false。
 *
 * 【示例】
 * 调用序列：
 *   const t = new Trie();
 *   t.insert("apple");
 *   t.search("apple");     // 返回 true（整词存在）
 *   t.search("app");       // 返回 false（"app" 只是路径，未标记为整词）
 *   t.startsWith("app");   // 返回 true（"apple" 以 "app" 为前缀）
 *   t.insert("app");
 *   t.search("app");       // 返回 true（插入后才算整词）
 *
 * 【提示】
 * 1 <= word.length, prefix.length <= 2000
 * word 和 prefix 仅由小写英文字母组成
 * 最多调用 3 * 10^4 次 insert / search / startsWith
 *
 * 【算法思路】
 * 1、节点设计：每个节点含 26 叉 children 与 isEnd 标记，isEnd 区分「完整单词」与「仅为前缀路径」。
 * 2、insert：从根沿字符逐层下行，缺失的分支新建节点，末字符节点置 isEnd = true。
 * 3、search：沿路径下行，中途走不通返回 false；走到底还要求末节点 isEnd 为 true。
 * 4、startsWith：与 search 共用下行过程，只要路径存在即返回 true，不要求 isEnd。
 * 5、复杂度关键：每次调用耗时只与串长 L 成正比，与已插入单词数量无关。
 *
 * 【复杂度】
 * 时间复杂度：O(L)，L 为 word/prefix 长度，每次调用与字母表大小无关
 * 空间复杂度：O(Σ * 26)，Σ 为所有插入字符串的总字符数（最坏无公共前缀）
 * ============================================================
 */

/**
 * 前缀树节点：children 记录 26 个小写字母的后继，isEnd 标记整词结尾
 */
class TrieNode {
  constructor() {
    /** @type {(TrieNode|null)[]} */
    this.children = new Array(26).fill(null);
    /** @type {boolean} 是否有单词在此节点结束 */
    this.isEnd = false;
  }
}

/**
 * 前缀树实现：insert / search / startsWith
 */
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * 沿字符串逐层下行，缺失的分支自动新建
   * @param {string} word
   * @return {TrieNode} 末字符对应的节点
   */
  _walkCreate(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const idx = word.charCodeAt(i) - 97; // 'a'.charCodeAt(0) === 97
      if (node.children[idx] === null) node.children[idx] = new TrieNode();
      node = node.children[idx];
    }
    return node;
  }

  /**
   * 只下行不建节点，走不通返回 null
   * @param {string} s
   * @return {TrieNode|null}
   */
  _walk(s) {
    let node = this.root;
    for (let i = 0; i < s.length; i++) {
      const idx = s.charCodeAt(i) - 97;
      if (idx < 0 || idx > 25 || node.children[idx] === null) return null;
      node = node.children[idx];
    }
    return node;
  }

  /**
   * 插入一个单词（重复插入幂等）
   * @param {string} word
   * @return {void}
   */
  insert(word) {
    this._walkCreate(word).isEnd = true;
  }

  /**
   * 精确查询：整词必须曾被插入
   * @param {string} word
   * @return {boolean}
   */
  search(word) {
    const node = this._walk(word);
    return node !== null && node.isEnd;
  }

  /**
   * 前缀查询：存在以 prefix 开头的已插入单词
   * @param {string} prefix
   * @return {boolean}
   */
  startsWith(prefix) {
    return this._walk(prefix) !== null;
  }
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

  // 官方示例调用序列
  const t = new Trie();
  t.insert('apple');
  eq('search("apple") 整词存在', t.search('apple'), true);
  eq('search("app") 仅为前缀', t.search('app'), false);
  eq('startsWith("app") 路径存在', t.startsWith('app'), true);
  t.insert('app');
  eq('插入 app 后 search("app")', t.search('app'), true);
  eq('插入 app 后 startsWith("apple")', t.startsWith('apple'), true);

  // 空树边界
  const e = new Trie();
  eq('空树 search 返回 false', e.search('a'), false);
  eq('空树 search("") 返回 false', e.search(''), false);
  eq('空树 startsWith("") 返回 true', e.startsWith(''), true);

  // 前缀关系：短词先插，长词后插
  const p = new Trie();
  p.insert('a');
  eq('只有 "a" 时 startsWith("ab")', p.startsWith('ab'), false);
  p.insert('ab');
  eq('插入 "ab" 后 search("a") 仍为 true', p.search('a'), true);
  eq('插入 "ab" 后 search("ab")', p.search('ab'), true);

  // 重复插入幂等 + 大小写/非字母字符
  const d = new Trie();
  d.insert('leet');
  d.insert('leet');
  eq('重复插入后 search("leet")', d.search('leet'), true);
  eq('search("leetcode") 未插入', d.search('leetcode'), false);
  eq('startsWith("leet") 自身是前缀', d.startsWith('leet'), true);
  eq('区分大小写 search("Leet")', d.search('Leet'), false);

  console.log(`[208-实现Trie] 通过 ${pass} / 失败 ${fail}`);
  return fail === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Trie };
  if (require.main === module) process.exit(runTests() ? 0 : 1);
}
