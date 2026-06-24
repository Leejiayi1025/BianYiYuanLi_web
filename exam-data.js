/**
 * 编译原理题库数据
 * 全局变量 EXAM_QUESTIONS，供 exam.html 使用
 */

const EXAM_QUESTIONS = [
  {
    id: 1,
    title: '文法四元组定义与识别',
    tags: ['文法', '四元组'],
    question: `<p>已知文法 G(E)：</p>
<pre>E → T + E | T
T → id | ( E )</pre>
<p>（1）写出该文法的四元组表示 G = (V<sub>N</sub>, V<sub>T</sub>, P, S)。</p>
<p>（2）指出各终结符和非终结符。</p>
<p>（3）该文法描述的语言有什么特征？</p>`,
    knowledge: `<p><strong>文法四元组 G = (V<sub>N</sub>, V<sub>T</sub>, P, S)</strong></p>
<ul>
  <li><strong>V<sub>N</sub></strong>：非终结符集合（可以被进一步替换的符号）</li>
  <li><strong>V<sub>T</sub></strong>：终结符集合（不能再被替换的基本符号）</li>
  <li><strong>P</strong>：产生式规则集合</li>
  <li><strong>S</strong>：开始符号（S ∈ V<sub>N</sub>）</li>
</ul>
<p>判断技巧：出现在产生式左侧的符号是非终结符，只出现在右侧的是终结符。</p>`,
    analysis: `<p>本题考察文法四元组的基本理解。需要从给定的产生式中提取四个组成部分，并区分终结符和非终结符。`,
    steps: `<p><strong>（1）四元组表示：</strong></p>
<ul>
  <li>V<sub>N</sub> = { E, T }</li>
  <li>V<sub>T</sub> = { id, +, (, ) }</li>
  <li>P = { E → T + E, E → T, T → id, T → ( E ) }</li>
  <li>S = E</li>
</ul>
<p><strong>（2）符号分类：</strong></p>
<p>非终结符：E（表达式）、T（项）——可以出现在产生式左侧。</p>
<p>终结符：id（标识符）、+（加号）、( )（括号）——只出现在产生式右侧。</p>
<p><strong>（3）语言特征：</strong></p>
<p>该文法描述的是带括号的加法表达式语言。id 是基本项，可以用括号改变优先级。表达式由一个或多个项通过 + 连接而成。</p>`
  },
  {
    id: 2,
    title: '正规式与语言描述',
    tags: ['词法分析', '正规式'],
    question: `<p>写出能描述以下语言的正规式：</p>
<p>（1）以字母开头，由字母和数字组成的标识符（长度 ≥ 1）。</p>
<p>（2）十进制非负整数（不允许前导零，但 0 本身合法）。</p>
<p>（3）包含偶数个 a 的 {a, b} 上的字符串。</p>`,
    knowledge: `<p><strong>正规式基本运算：</strong></p>
<ul>
  <li><strong>连接</strong>：ab 表示 a 后接 b</li>
  <li><strong>选择（并）</strong>：a|b 表示 a 或 b</li>
  <li><strong>闭包（Kleene Star）</strong>：a* 表示零个或多个 a</li>
  <li><strong>正闭包</strong>：a+ 表示一个或多个 a</li>
</ul>
<p>正规式用于描述词法规则，是词法分析器的基础。</p>`,
    analysis: `<p>正规式是词法分析的核心工具。需要准确把握每种语言的结构特征，然后用正规式的基本运算符（连接、选择、闭包）来表达。</p>`,
    steps: `<p><strong>（1）标识符：</strong></p>
<p><code>letter (letter | digit)*</code></p>
<p>其中 letter = a|b|...|z|A|B|...|Z，digit = 0|1|...|9。</p>
<p><strong>（2）十进制非负整数：</strong></p>
<p><code>0 | [1-9][0-9]*</code></p>
<p>要么是单独的 0，要么是非零数字后跟任意数字（避免前导零）。</p>
<p><strong>（3）偶数个 a：</strong></p>
<p><code>b* (ab*ab*)* b*</code></p>
<p>核心思路：每出现一个 a 必须配对出现另一个 a，中间可以穿插任意数量的 b。等价于 DFA 的思路：两个状态（偶数个 a / 奇数个 a），读 a 在两个状态间切换，读 b 自环。</p>`
  },
  {
    id: 3,
    title: 'NFA 转 DFA（子集构造法）',
    tags: ['DFA', 'NFA'],
    question: `<p>已知 NFA M = ({q0, q1, q2}, {a, b}, δ, q0, {q2})，转移函数如下：</p>
<table class="exam-table">
  <thead><tr><th>状态</th><th>a</th><th>b</th></tr></thead>
  <tbody>
    <tr><td>→q0</td><td>{q0, q1}</td><td>{q0}</td></tr>
    <tr><td>q1</td><td>∅</td><td>{q2}</td></tr>
    <tr><td>*q2</td><td>∅</td><td>∅</td></tr>
  </tbody>
</table>
<p>（1）用子集构造法将其转换为等价的 DFA。</p>
<p>（2）画出 DFA 的状态转移图。</p>`,
    knowledge: `<p><strong>子集构造法（Subset Construction）：</strong></p>
<ul>
  <li>DFA 的每个状态是 NFA 状态的集合</li>
  <li>初始状态：ε-closure({q0})（本题无 ε 转移，故为 {q0}）</li>
  <li>对每个输入符号 a，计算 δ'(T, a) = ∪ δ(t, a) 对所有 t ∈ T</li>
  <li>包含 NFA 接受状态的 DFA 状态为接受状态</li>
</ul>`,
    analysis: `<p>子集构造法是将 NFA 确定化为 DFA 的标准方法。关键在于系统地计算每个状态集合在每个输入下的后继集合，直到没有新状态产生。</p>`,
    steps: `<p><strong>（1）子集构造过程：</strong></p>
<table class="exam-table">
  <thead><tr><th>DFA 状态</th><th>a</th><th>b</th></tr></thead>
  <tbody>
    <tr><td>→A = {q0}</td><td>B = {q0, q1}</td><td>A = {q0}</td></tr>
    <tr><td>B = {q0, q1}</td><td>B = {q0, q1}</td><td>C = {q0, q2}</td></tr>
    <tr><td>*C = {q0, q2}</td><td>B = {q0, q1}</td><td>A = {q0}</td></tr>
  </tbody>
</table>
<p>初始状态：A = {q0}。</p>
<p>计算 A 在 a 上的转移：δ(q0, a) = {q0, q1}，得到新状态 B。</p>
<p>计算 A 在 b 上的转移：δ(q0, b) = {q0}，回到 A。</p>
<p>计算 B 在 a 上的转移：δ(q0, a) ∪ δ(q1, a) = {q0, q1} ∪ ∅ = {q0, q1} = B。</p>
<p>计算 B 在 b 上的转移：δ(q0, b) ∪ δ(q1, b) = {q0} ∪ {q2} = {q0, q2}，得到新状态 C。</p>
<p>计算 C 在 a 上的转移：δ(q0, a) ∪ δ(q2, a) = {q0, q1} = B。</p>
<p>计算 C 在 b 上的转移：δ(q0, b) ∪ δ(q2, b) = {q0} = A。</p>
<p>C 包含 NFA 接受状态 q2，故 C 为接受状态。</p>
<p><strong>（2）DFA 状态转移图：</strong></p>
<p>三个状态 A、B、C，A 为初始状态，C 为接受状态（双圈）。</p>`,
    diagram: {
      type: 'dfa',
      states: [
        { id: 'A', x: 120, y: 150, isStart: true, isFinal: false },
        { id: 'B', x: 320, y: 80, isStart: false, isFinal: false },
        { id: 'C', x: 320, y: 220, isStart: false, isFinal: true }
      ],
      transitions: [
        { from: 'A', to: 'B', label: 'a' },
        { from: 'A', to: 'A', label: 'b' },
        { from: 'B', to: 'B', label: 'a' },
        { from: 'B', to: 'C', label: 'b' },
        { from: 'C', to: 'B', label: 'a' },
        { from: 'C', to: 'A', label: 'b' }
      ]
    }
  },
  {
    id: 4,
    title: 'DFA 状态转移与语言识别',
    tags: ['DFA', '有穷自动机'],
    question: `<p>已知 DFA M = ({A, B, C, D}, {0, 1}, δ, A, {C})，转移函数如下：</p>
<table class="exam-table">
  <thead><tr><th>状态</th><th>0</th><th>1</th></tr></thead>
  <tbody>
    <tr><td>→A</td><td>B</td><td>A</td></tr>
    <tr><td>B</td><td>B</td><td>C</td></tr>
    <tr><td>*C</td><td>B</td><td>A</td></tr>
    <tr><td>D</td><td>D</td><td>D</td></tr>
  </tbody>
</table>
<p>（1）判断字符串 1010、0110、001 是否被接受，写出状态转移路径。</p>
<p>（2）该 DFA 接受的语言是什么？</p>`,
    knowledge: `<p><strong>DFA 识别字符串的过程：</strong></p>
<ul>
  <li>从初始状态开始，逐个读入输入符号</li>
  <li>每读一个符号，根据转移函数转移到下一个状态</li>
  <li>全部读完后，如果当前状态是接受状态，则字符串被接受</li>
  <li>DFA 的特征：每个状态对每个输入符号恰好有一个后继状态</li>
</ul>`,
    analysis: `<p>DFA 识别字符串是一个纯机械的过程：从初始状态出发，按照转移表逐字符推进，最后检查是否落在接受状态上。关键是准确地按照转移表一步一步走。</p>`,
    steps: `<p><strong>（1）逐串判断：</strong></p>
<p><strong>1010</strong>：A →(1) A →(0) B →(1) C →(0) B</p>
<p>最终状态 B，不是接受状态。<strong>拒绝</strong>。</p>
<p><strong>0110</strong>：A →(0) B →(1) C →(1) A →(0) B</p>
<p>最终状态 B，不是接受状态。<strong>拒绝</strong>。</p>
<p><strong>001</strong>：A →(0) B →(0) B →(1) C</p>
<p>最终状态 C，是接受状态。<strong>接受</strong>。</p>
<p><strong>（2）语言描述：</strong></p>
<p>该 DFA 接受的语言是：所有以 01 结尾的 0、1 串。状态 C 是唯一的接受状态，要到达 C 必须从 B 经 1 到达，而要到达 B 必须经 0。因此字符串必须以 01 结尾。状态 D 是死状态（陷阱状态），不可达（从初始状态无法到达 D）。</p>`,
    diagram: {
      type: 'dfa',
      states: [
        { id: 'A', x: 100, y: 150, isStart: true, isFinal: false },
        { id: 'B', x: 260, y: 80, isStart: false, isFinal: false },
        { id: 'C', x: 420, y: 150, isStart: false, isFinal: true },
        { id: 'D', x: 260, y: 250, isStart: false, isFinal: false }
      ],
      transitions: [
        { from: 'A', to: 'B', label: '0' },
        { from: 'A', to: 'A', label: '1' },
        { from: 'B', to: 'B', label: '0' },
        { from: 'B', to: 'C', label: '1' },
        { from: 'C', to: 'B', label: '0' },
        { from: 'C', to: 'A', label: '1' },
        { from: 'D', to: 'D', label: '0,1' }
      ]
    }
  },
  {
    id: 5,
    title: '最左推导与语法树',
    tags: ['推导', '语法树'],
    question: `<p>已知文法 G[E]：</p>
<pre>E → E + T | T
T → T * F | F
F → ( E ) | id</pre>
<p>（1）对句子 id + id * id 给出最左推导。</p>
<p>（2）画出对应的语法树。</p>
<p>（3）该文法是左递归还是右递归？体现了什么运算特性？</p>`,
    knowledge: `<p><strong>最左推导</strong>：每一步都替换句型中最左边的非终结符。</p>
<p><strong>语法树</strong>：推导过程的图形表示，根节点是开始符号，叶节点组成句型。</p>
<p><strong>左递归</strong>：产生式形如 A → Aα（A 在产生式右部的最左端出现），体现左结合性。</p>
<p><strong>优先级</strong>：语法树中嵌套越深的运算符优先级越高。</p>`,
    analysis: `<p>这是编译原理中最基础的题型。最左推导要求每一步替换最左边的非终结符。语法树的结构直接反映了运算的优先级和结合性。</p>`,
    steps: `<p><strong>（1）最左推导：</strong></p>
<pre>E ⇒ E + T
  ⇒ T + T
  ⇒ F + T
  ⇒ id + T
  ⇒ id + T * F
  ⇒ id + F * F
  ⇒ id + id * F
  ⇒ id + id * id</pre>
<p><strong>（2）语法树结构：</strong></p>
<p>根节点为 E，分裂为 E + T。左边的 E 向下推导到 id（深度 3：E→T→F→id）。右边的 T 向下推导到 T * F，再分别到 id（深度 4）。* 的嵌套比 + 深，说明 * 优先级更高。</p>
<p><strong>（3）递归方向与运算特性：</strong></p>
<p>左递归（E → E + T 中 E 在左端）。左递归体现<strong>左结合性</strong>：a+b+c = (a+b)+c。同理 T → T * F 也是左递归，* 也是左结合的。* 比 + 嵌套更深，体现<strong>更高优先级</strong>。</p>`,
    diagram: {
      type: 'tree',
      root: {
        label: 'E',
        children: [
          {
            label: 'E',
            children: [
              { label: 'T', children: [
                { label: 'F', children: [{ label: 'id', isLeaf: true }] }
              ]}
            ]
          },
          { label: '+', isLeaf: true },
          {
            label: 'T',
            children: [
              { label: 'T', children: [
                { label: 'F', children: [{ label: 'id', isLeaf: true }] }
              ]},
              { label: '*', isLeaf: true },
              { label: 'F', children: [{ label: 'id', isLeaf: true }] }
            ]
          }
        ]
      }
    }
  },
  {
    id: 6,
    title: 'FIRST 集计算',
    tags: ['FIRST集', '语法分析'],
    question: `<p>已知文法 G[S]：</p>
<pre>S → aBDh
B → cC
C → bC | ε
D → EF
E → g | ε
F → f | ε</pre>
<p>计算所有非终结符的 FIRST 集。</p>`,
    knowledge: `<p><strong>FIRST(α) 的定义：</strong>可以从 α 推导出的串的首终结符的集合。如果 α 可以推导出 ε，则 ε ∈ FIRST(α)。</p>
<p><strong>计算规则：</strong></p>
<ul>
  <li>若 X → a...，则 a ∈ FIRST(X)（a 为终结符）</li>
  <li>若 X → ε，则 ε ∈ FIRST(X)</li>
  <li>若 X → Y1 Y2 ... Yk，则 FIRST(Y1) 中除 ε 外的所有符号 ∈ FIRST(X)；若 FIRST(Y1) 含 ε，则继续看 FIRST(Y2)，以此类推</li>
</ul>`,
    analysis: `<p>FIRST 集是自下而上分析的基础。计算时需要先处理能直接得到终结符的产生式，再处理依赖其他非终结符 FIRST 集的产生式，通常需要多轮迭代直到不再变化。</p>`,
    steps: `<p><strong>逐个计算：</strong></p>
<p><strong>FIRST(C)</strong>：C → bC 中 b ∈ FIRST(C)；C → ε 中 ε ∈ FIRST(C)。→ FIRST(C) = { b, ε }</p>
<p><strong>FIRST(B)</strong>：B → cC 中 c ∈ FIRST(B)（c 是终结符，直接加入）。→ FIRST(B) = { c }</p>
<p><strong>FIRST(E)</strong>：E → g 中 g ∈ FIRST(E)；E → ε 中 ε ∈ FIRST(E)。→ FIRST(E) = { g, ε }</p>
<p><strong>FIRST(F)</strong>：F → f 中 f ∈ FIRST(F)；F → ε 中 ε ∈ FIRST(F)。→ FIRST(F) = { f, ε }</p>
<p><strong>FIRST(D)</strong>：D → EF。FIRST(E) = { g, ε }，ε ∈ FIRST(E) 所以继续看 FIRST(F)。FIRST(D) = { g, f, ε }</p>
<p><strong>FIRST(S)</strong>：S → aBDh 中 a 是终结符。→ FIRST(S) = { a }</p>`
  },
  {
    id: 7,
    title: 'FOLLOW 集计算',
    tags: ['FOLLOW集', '语法分析'],
    question: `<p>已知文法 G[S]：</p>
<pre>S → aBDh
B → cC
C → bC | ε
D → EF
E → g | ε
F → f | ε</pre>
<p>计算所有非终结符的 FOLLOW 集。（已知 FIRST 集见第 6 题）</p>`,
    knowledge: `<p><strong>FOLLOW(A) 的定义：</strong>在某个句型中紧跟在 A 后面的终结符的集合。如果 A 是某个句型的最右符号，则 # ∈ FOLLOW(A)。</p>
<p><strong>计算规则：</strong></p>
<ul>
  <li>对 S（开始符号）：# ∈ FOLLOW(S)</li>
  <li>对产生式 A → αBβ：FIRST(β) 中除 ε 外的所有符号 ∈ FOLLOW(B)</li>
  <li>若 ε ∈ FIRST(β)，则 FOLLOW(A) 中的所有符号 ∈ FOLLOW(B)</li>
</ul>`,
    analysis: `<p>FOLLOW 集与 FIRST 集配合使用，是 LL(1) 分析和预测分析表构造的必要条件。FOLLOW 集的计算需要从产生式右部中非终结符的后继符号出发。</p>`,
    steps: `<p><strong>FOLLOW(S)</strong>：S 是开始符号。→ FOLLOW(S) = { # }</p>
<p><strong>FOLLOW(B)</strong>：S → aBDh，B 后面是 D。FIRST(D) \ {ε} = { g, f }。但 ε ∈ FIRST(D)，所以还要加上 FIRST(h) = { h }（h 是终结符，直接加入）。→ FOLLOW(B) = { g, f, h }</p>
<p><strong>FOLLOW(C)</strong>：B → cC，C 在产生式末尾。FOLLOW(C) = FOLLOW(B) = { g, f, h }</p>
<p><strong>FOLLOW(D)</strong>：S → aBDh，D 后面是 h。→ FOLLOW(D) = { h }</p>
<p><strong>FOLLOW(E)</strong>：D → EF，E 后面是 F。FIRST(F) \ {ε} = { f }。ε ∈ FIRST(F)，所以还要加上 FOLLOW(D) = { h }。→ FOLLOW(E) = { f, h }</p>
<p><strong>FOLLOW(F)</strong>：D → EF，F 在产生式末尾。FOLLOW(F) = FOLLOW(D) = { h }</p>`
  },
  {
    id: 8,
    title: 'LL(1) 文法判定',
    tags: ['LL(1)', '语法分析'],
    question: `<p>已知文法 G[A]：</p>
<pre>A → aABe | b
B → bB | ε</pre>
<p>（1）计算 First(A)、First(B)、Follow(A)、Follow(B)。</p>
<p>（2）判断该文法是否为 LL(1) 文法。</p>`,
    knowledge: `<p><strong>LL(1) 文法的三个条件：</strong></p>
<ol>
  <li>文法不含左递归</li>
  <li>对每个非终结符 A 的不同产生式 A → α | β，FIRST(α) ∩ FIRST(β) = ∅</li>
  <li>若 ε ∈ FIRST(β)，则 FIRST(α) ∩ FOLLOW(A) = ∅</li>
</ol>
<p>三个条件全部满足才是 LL(1) 文法。</p>`,
    analysis: `<p>LL(1) 判定是考试高频考点。需要依次检查三个条件。关键是正确计算 FIRST 集和 FOLLOW 集，然后检查交集是否为空。</p>`,
    steps: `<p><strong>（1）FIRST 集和 FOLLOW 集：</strong></p>
<p>FIRST(B)：B → bB 中 b ∈ FIRST(B)；B → ε 中 ε ∈ FIRST(B)。→ FIRST(B) = { b, ε }</p>
<p>FIRST(A)：A → aABe 中 a ∈ FIRST(A)；A → b 中 b ∈ FIRST(A)。→ FIRST(A) = { a, b }</p>
<p>FOLLOW(A)：A → aABe，A 后面是 B。FIRST(B) \ {ε} = { b }。ε ∈ FIRST(B)，所以加 FOLLOW(A)。另外 A 是开始符号，# ∈ FOLLOW(A)。→ FOLLOW(A) = { b, e, # }</p>
<p>FOLLOW(B)：A → aABe，B 后面是 e。→ FOLLOW(B) = { e }</p>
<p><strong>（2）LL(1) 判定：</strong></p>
<p>条件 1：无左递归 ✓</p>
<p>条件 2：A 的两个产生式 A → aABe 和 A → b。FIRST(aABe) ∩ FIRST(b) = { a } ∩ { b } = ∅ ✓</p>
<p>条件 3：B 的产生式 B → bB | ε。ε ∈ FIRST(ε)，需检查 FIRST(bB) ∩ FOLLOW(B) = { b } ∩ { e } = ∅ ✓</p>
<p><strong>结论：是 LL(1) 文法。</strong></p>`
  },
  {
    id: 9,
    title: '移进-归约分析',
    tags: ['移进归约', '自下而上'],
    question: `<p>已知文法：</p>
<pre>S → aAcBe
A → b
B → d</pre>
<p>对输入串 abcde 进行移进-归约分析，写出完整的分析过程。</p>`,
    knowledge: `<p><strong>移进-归约分析</strong>是一种自下而上的语法分析方法。</p>
<ul>
  <li><strong>移进（Shift）</strong>：将输入符号移入栈中</li>
  <li><strong>归约（Reduce）</strong>：当栈顶形成某个产生式的右部时，将其归约为左部非终结符</li>
  <li><strong>接受（Accept）</strong>：栈中只剩开始符号且输入为空</li>
  <li>分析的关键：何时移进、何时归约、用哪个产生式归约</li>
</ul>`,
    analysis: `<p>移进-归约分析的核心是维护一个栈和剩余输入。每一步都要判断是移进还是归约。对于简单文法，可以通过观察栈顶是否匹配某个产生式右部来决定。</p>`,
    steps: `<p><strong>完整分析过程：</strong></p>
<table class="exam-table">
  <thead><tr><th>步骤</th><th>符号栈</th><th>输入串</th><th>动作</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>#</td><td>abcde#</td><td>预备</td></tr>
    <tr><td>2</td><td>#a</td><td>bcde#</td><td>移进 a</td></tr>
    <tr><td>3</td><td>#ab</td><td>cde#</td><td>移进 b</td></tr>
    <tr><td>4</td><td>#aA</td><td>cde#</td><td>归约 A→b</td></tr>
    <tr><td>5</td><td>#aAc</td><td>de#</td><td>移进 c</td></tr>
    <tr><td>6</td><td>#aAcd</td><td>e#</td><td>移进 d</td></tr>
    <tr><td>7</td><td>#aAcB</td><td>e#</td><td>归约 B→d</td></tr>
    <tr><td>8</td><td>#aAcBe</td><td>#</td><td>移进 e</td></tr>
    <tr><td>9</td><td>#S</td><td>#</td><td>归约 S→aAcBe</td></tr>
    <tr><td>10</td><td>#S</td><td>#</td><td>接受</td></tr>
  </tbody>
</table>
<p>分析成功，输入串 abcde 被文法接受。</p>`
  },
  {
    id: 10,
    title: '短语、直接短语与句柄',
    tags: ['短语', '句柄'],
    question: `<p>已知文法 G[E]：</p>
<pre>E → E + T | T
T → T * F | F
F → ( E ) | id</pre>
<p>对句型 E + T * id + F，找出所有的短语、直接短语和句柄。</p>`,
    knowledge: `<p><strong>短语</strong>：若 S ⇒* αAβ 且 A ⇒+ γ，则 γ 是句型 αγβ 相对于 A 的短语。</p>
<p><strong>直接短语</strong>：若 A → γ 是产生式，则 γ 是句型 αγβ 相对于 A 的直接短语。</p>
<p><strong>句柄</strong>：最左直接短语。</p>
<p>直观理解：短语是可以被归约的子串；直接短语是一步就能归约的子串；句柄是当前最应该归约的那个子串。</p>`,
    analysis: `<p>找短语的关键是画出句型对应的语法树。语法树中的每个子树的叶子串都是一个短语，最小子树（产生式直接对应的）的叶子串是直接短语。</p>`,
    steps: `<p><strong>分析句型 E + T * id + F：</strong></p>
<p>先确定句型的语法树结构：</p>
<p>整个句型归约为 E。E → E + T，其中 E 对应 E + T * id，T 对应 F。</p>
<p>短语（从大到小）：</p>
<ul>
  <li>E + T * id + F（整个句型，相对于 E）</li>
  <li>E + T * id（相对于 E，由 E → E + T 归约得到）</li>
  <li>T * id（相对于 T，由 T → T * F 得到，其中 F → id）</li>
  <li>F（最后一个 F，相对于 T）</li>
  <li>id（相对于 F，由 F → id 得到）</li>
</ul>
<p>直接短语：id 和 F（它们分别是 F → id 和某个产生式右部的匹配）。</p>
<p>句柄：id（最左直接短语）。</p>`,
    diagram: {
      type: 'tree',
      root: {
        label: 'E',
        children: [
          {
            label: 'E',
            children: [
              { label: 'E', children: [
                { label: 'T', children: [
                  { label: 'F', children: [{ label: 'id', isLeaf: true }] }
                ]}
              ]},
              { label: '+', isLeaf: true },
              { label: 'T', children: [
                { label: 'T', children: [
                  { label: 'F', children: [{ label: 'id', isLeaf: true }] }
                ]},
                { label: '*', isLeaf: true },
                { label: 'F', children: [{ label: 'id', isLeaf: true }] }
              ]}
            ]
          },
          { label: '+', isLeaf: true },
          { label: 'T', children: [
            { label: 'F', children: [{ label: 'id', isLeaf: true }] }
          ]}
        ]
      }
    }
  },
  {
    id: 11,
    title: '语义分析与符号表管理',
    tags: ['符号表', '语义分析'],
    question: `<p>分析以下 C 代码的符号表变化：</p>
<pre>int x = 10;
void main() {
    int x = 20;
    int y = 30;
    {
        int z = 40;
        printf("%d", x);
    }
    printf("%d", x);
}</pre>
<p>（1）内层块中 printf 输出什么？</p>
<p>（2）退出内层块后 printf 输出什么？</p>
<p>（3）描述符号表的完整变化过程。</p>`,
    knowledge: `<p><strong>符号表管理规则：</strong></p>
<ul>
  <li>进入新作用域时，创建新的符号表层</li>
  <li>同一作用域内的同名变量会屏蔽（shadow）外层的同名变量</li>
  <li>退出作用域时，该层的符号被注销（变为 inactive）</li>
  <li>变量查找采用就近原则：从当前作用域向外逐层查找</li>
</ul>`,
    analysis: `<p>符号表管理是语义分析的重要组成部分。核心是理解作用域的嵌套关系和变量屏蔽机制。</p>`,
    steps: `<p><strong>（1）内层块中 printf 输出 20。</strong></p>
<p>内层块中没有声明新的 x，所以查找 x 时从内向外找：内层块没有 → main 函数中有 x=20 → 找到。全局的 x=10 被 main 中的 x=20 屏蔽。</p>
<p><strong>（2）退出后 printf 输出 20。</strong></p>
<p>退出内层块后，z=40 被注销。但 x 和 y 仍在 main 的作用域中，x=20 仍然有效。</p>
<p><strong>（3）符号表变化过程：</strong></p>
<ol>
  <li>全局作用域：插入 x(10)</li>
  <li>进入 main：插入 x(20), y(30)。x(20) 屏蔽全局 x(10)</li>
  <li>进入内层块：插入 z(40)</li>
  <li>内层块中访问 x：从内向外查找，找到 main 的 x(20)</li>
  <li>退出内层块：z(40) 注销（变为 inactive）</li>
  <li>main 中访问 x：找到 main 的 x(20)</li>
  <li>退出 main：x(20), y(30) 注销，全局 x(10) 恢复可见</li>
</ol>`
  },
  {
    id: 12,
    title: '逆波兰式与抽象语法树',
    tags: ['逆波兰式', 'AST'],
    question: `<p>（1）将表达式 (a + b) * (c - d) + e 转换为逆波兰式（后缀表达式）。</p>
<p>（2）画出对应的抽象语法树（AST）。</p>
<p>（3）对 AST 进行后序遍历，验证结果。</p>`,
    knowledge: `<p><strong>逆波兰式（后缀表达式）</strong>：运算符写在操作数之后。不需要括号，运算顺序由运算符的位置决定。</p>
<p><strong>转换方法</strong>：按运算优先级和结合性画出语法树，然后后序遍历。</p>
<p><strong>AST（抽象语法树）</strong>：去掉了语法分析中的辅助符号（如括号），只保留运算符和操作数的树形结构。</p>`,
    analysis: `<p>逆波兰式转换是编译器中间代码生成的经典题型。方法是先构造 AST，然后后序遍历。AST 的结构直接反映了运算的优先级。</p>`,
    steps: `<p><strong>（1）逆波兰式：</strong></p>
<p><code>a b + c d - * e +</code></p>
<p><strong>（2）AST 结构：</strong></p>
<p>根节点是 +，左子树是 *，右子树是 e。</p>
<p>* 的左子树是 + (a, b)，右子树是 - (c, d)。</p>
<p>树形：根(+) → 左(*, e) → 左(+ a b, - c d)</p>
<p><strong>（3）后序遍历验证：</strong></p>
<ol>
  <li>遍历 + 的左子树 (a+b)：输出 a, b, +</li>
  <li>遍历 - 的子树 (c-d)：输出 c, d, -</li>
  <li>访问 *：输出 *</li>
  <li>遍历 e：输出 e</li>
  <li>访问根 +：输出 +</li>
</ol>
<p>结果：a b + c d - * e + ✓ 与逆波兰式一致。</p>`,
    diagram: {
      type: 'tree',
      root: {
        label: '+',
        children: [
          {
            label: '*',
            children: [
              { label: '+', children: [
                { label: 'a', isLeaf: true },
                { label: 'b', isLeaf: true }
              ]},
              { label: '-', children: [
                { label: 'c', isLeaf: true },
                { label: 'd', isLeaf: true }
              ]}
            ]
          },
          { label: 'e', isLeaf: true }
        ]
      }
    }
  },
  {
    id: 13,
    title: '三地址码与四元式',
    tags: ['三地址码', '四元式'],
    question: `<p>将表达式 a = b * c + d * e 转换为：</p>
<p>（1）三地址码。</p>
<p>（2）四元式序列。</p>
<p>（3）说明三地址码和四元式的区别。</p>`,
    knowledge: `<p><strong>三地址码</strong>：每条指令最多包含一个运算符和三个地址（两个操作数、一个结果）。</p>
<p><strong>四元式</strong>：(op, arg1, arg2, result)，是三地址码的一种具体表示形式。</p>
<p>引入临时变量来存储中间结果，是中间代码的基本策略。</p>`,
    analysis: `<p>三地址码和四元式是编译器中间表示的两种形式。转换时需要引入临时变量来保存中间计算结果，确保每条指令最多只有一个运算符。</p>`,
    steps: `<p><strong>（1）三地址码：</strong></p>
<pre>t1 = b * c
t2 = d * e
a  = t1 + t2</pre>
<p><strong>（2）四元式序列：</strong></p>
<table class="exam-table">
  <thead><tr><th>序号</th><th>op</th><th>arg1</th><th>arg2</th><th>result</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>*</td><td>b</td><td>c</td><td>t1</td></tr>
    <tr><td>2</td><td>*</td><td>d</td><td>e</td><td>t2</td></tr>
    <tr><td>3</td><td>+</td><td>t1</td><td>t2</td><td>a</td></tr>
  </tbody>
</table>
<p><strong>（3）区别：</strong></p>
<p>三地址码是文本形式的中间代码，可读性强。四元式是结构化的表格表示，便于编译器内部处理。两者表达的信息相同，只是组织形式不同。四元式中的编号可以用于跳转指令的引用。</p>`
  },
  {
    id: 14,
    title: '基本块划分与流图',
    tags: ['基本块', '控制流图'],
    question: `<p>给定三地址码程序：</p>
<pre>(1) i = 1
(2) if i > 10 goto (8)
(3) t1 = i * 4
(4) t2 = a[t1]
(5) x = x + t2
(6) i = i + 1
(7) goto (2)
(8) y = x * 2
(9) if y > 100 goto (11)
(10) z = y + 1
(11) write z</pre>
<p>（1）划分基本块。</p>
<p>（2）画出控制流图（CFG）。</p>
<p>（3）指出所有回边。</p>`,
    knowledge: `<p><strong>基本块</strong>：一段顺序执行的指令序列，只有一个入口（第一条指令）和一个出口（最后一条指令）。</p>
<p><strong>基本块入口指令的确定：</strong></p>
<ul>
  <li>程序的第一条指令</li>
  <li>跳转指令的目标指令</li>
  <li>跳转指令的下一条指令</li>
</ul>
<p><strong>回边</strong>：在深度优先生成树中，从后代指向祖先的边。回边是识别循环的关键标志。</p>`,
    analysis: `<p>基本块划分是代码优化的第一步。划分后可以构建控制流图，进而分析循环、数据流等信息。回边的存在意味着程序中存在循环。</p>`,
    steps: `<p><strong>（1）基本块划分：</strong></p>
<p>入口指令：(1)程序第一条、(2)goto目标、(3)条件跳转下一条、(8)goto目标、(9)条件跳转下一条、(10)条件跳转下一条、(11)条件跳转目标。</p>
<ul>
  <li>B1: (1) i = 1</li>
  <li>B2: (2) if i > 10 goto (8)</li>
  <li>B3: (3)-(7) 循环体</li>
  <li>B4: (8)-(9) 循环后判断</li>
  <li>B5: (10) z = y + 1</li>
  <li>B6: (11) write z</li>
</ul>
<p><strong>（2）控制流图：</strong></p>
<p>B1 → B2（顺序）。B2 有两个分支：T → B3（循环体），F → B4（跳出循环）。B3 → B2（goto 回到循环条件）。B4 有两个分支：T → B5，F → B6。B5 → B6（顺序）。</p>
<p><strong>（3）回边：</strong></p>
<p><strong>B3 → B2</strong> 是回边。语句 (7) goto (2) 跳回循环条件，形成 while 循环。回边 B3→B2 构成了一个自然循环 {B2, B3}。</p>`,
    diagram: {
      type: 'cfg',
      blocks: [
        { id: 'B1', label: 'B1', lines: ['i = 1'], x: 200, y: 30 },
        { id: 'B2', label: 'B2', lines: ['if i > 10', 'goto (8)'], x: 200, y: 120 },
        { id: 'B3', label: 'B3', lines: ['t1 = i * 4', 't2 = a[t1]', 'x = x + t2', 'i = i + 1', 'goto (2)'], x: 200, y: 230 },
        { id: 'B4', label: 'B4', lines: ['y = x * 2', 'if y > 100', 'goto (11)'], x: 200, y: 360 },
        { id: 'B5', label: 'B5', lines: ['z = y + 1'], x: 200, y: 460 },
        { id: 'B6', label: 'B6', lines: ['write z'], x: 400, y: 460 }
      ],
      edges: [
        { from: 'B1', to: 'B2', label: '' },
        { from: 'B2', to: 'B3', label: 'T' },
        { from: 'B2', to: 'B4', label: 'F' },
        { from: 'B3', to: 'B2', label: '' },
        { from: 'B4', to: 'B5', label: 'F' },
        { from: 'B4', to: 'B6', label: 'T' },
        { from: 'B5', to: 'B6', label: '' }
      ]
    }
  },
  {
    id: 15,
    title: '代码优化：数据流分析',
    tags: ['代码优化', '数据流'],
    question: `<p>对以下基本块进行优化：</p>
<pre>B1:
  a = b + c
  d = a - e
  f = b + c
  g = d + a</pre>
<p>（1）识别公共子表达式。</p>
<p>（2）进行公共子表达式消除（CSE）优化。</p>
<p>（3）进行死代码消除：假设只有 g 在后续被使用。</p>`,
    knowledge: `<p><strong>公共子表达式消除（CSE）</strong>：如果一个表达式之前已经计算过，且其操作数的值没有改变，则可以复用之前的结果。</p>
<p><strong>死代码消除</strong>：如果一个变量的值在后续程序中从未被使用，则其赋值语句可以删除。</p>
<p><strong>数据流分析</strong>：分析变量在程序中的定义和使用关系，是优化的基础。</p>`,
    analysis: `<p>代码优化是编译器后端的重要工作。公共子表达式消除和死代码消除是两种最基本也最有效的局部优化手段。</p>`,
    steps: `<p><strong>（1）识别公共子表达式：</strong></p>
<p>第 1 行 <code>a = b + c</code> 和第 3 行 <code>f = b + c</code> 计算的是同一个表达式 b + c。</p>
<p>在计算 f = b + c 时，b 和 c 的值都没有改变（中间只用了 a 和 e），所以 b + c 是公共子表达式。</p>
<p><strong>（2）公共子表达式消除：</strong></p>
<pre>B1:
  a = b + c
  d = a - e
  f = a        // 复用 a 的值，消除 b + c
  g = d + a</pre>
<p><strong>（3）死代码消除：</strong></p>
<p>假设只有 g 在后续被使用，则 a、d、f 的值不会被使用（a 虽然被 g 引用，但 a 本身不在后续被直接使用）。但 a 被 d 和 g 间接引用，d 被 g 间接引用，所以它们不是死代码。f 没有被任何后续语句引用，所以 f = a 是死代码。</p>
<pre>B1:
  a = b + c
  d = a - e
  // f = a    // 删除：f 是死代码
  g = d + a</pre>
<p>优化后减少了一条指令。</p>`
  }
];
