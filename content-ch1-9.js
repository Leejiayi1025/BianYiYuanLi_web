const CHAPTERS_PART1 = [
  // ============================================================
  // 第一章：编译程序和解释程序的区别
  // ============================================================
  {
    id: 'ch1',
    num: '一',
    title: '编译程序和解释程序的区别',
    sections: [
      {
        heading: null,
        html: `<p><strong>编译程序（Compiler）</strong>：先把源程序<strong>整体翻译</strong>成目标程序，再运行目标程序。常见目标：机器语言、汇编语言、可执行文件。运行时通常不再强制需要编译器参与。<strong>优点</strong>：运行速度快。<strong>缺点</strong>：错误在编译阶段集中报出。</p>
<p><strong>解释程序（Interpreter）</strong>：<strong>边解释边执行</strong>，不先生成独立的目标程序。每次执行都需要解释器参与。<strong>优点</strong>：交互性强、调试方便、跨平台性好。<strong>缺点</strong>：速度慢。</p>`
      },
      {
        heading: '1. 编译程序（Compiler）',
        html: `<ul>
  <li><strong>工作方式</strong>：先把源程序整体翻译成目标程序（如可执行文件），再运行目标程序</li>
  <li><strong>常见目标程序</strong>：机器语言、汇编语言、目标代码、可执行文件</li>
  <li><strong>运行时特点</strong>：运行目标程序时，通常不再强制需要编译器参与</li>
  <li><strong>优点</strong>：运行速度快（代码已经翻译好了，直接执行）</li>
  <li><strong>缺点</strong>：错误在编译阶段集中报出；修改后需重新编译</li>
</ul>`
      },
      {
        heading: '2. 解释程序（Interpreter）',
        html: `<ul>
  <li><strong>工作方式</strong>：不先生成独立目标程序，而是逐句/逐行解释源程序并立即执行</li>
  <li><strong>运行时特点</strong>：每次执行都需要解释器参与，离开解释器无法运行</li>
  <li><strong>优点</strong>：交互性强、调试方便、跨平台性好（只要目标平台有解释器即可）</li>
  <li><strong>缺点</strong>：运行速度慢（每次都要边解释边执行）</li>
</ul>`
      },
      {
        heading: '强制性问题',
        html: `<div class="callout">
  <div class="callout-title">角度一：运行时是否强制需要</div>
  <p>解释程序<strong>强制参与运行</strong>（每次执行都离不开解释器）；编译程序<strong>不是运行时强制</strong>（编译完就不需要编译器了，运行的是目标程序）。</p>
</div>
<div class="callout">
  <div class="callout-title">角度二：编译过程的必要阶段</div>
  <p><strong>词法分析、语法分析、语义分析</strong>是编译过程中必不可少的三个阶段，无论编译器还是解释器都需要经历。</p>
</div>`
      }
    ]
  },

  // ============================================================
  // 第二章：编译过程六个阶段
  // ============================================================
  {
    id: 'ch2',
    num: '二',
    title: '编译过程六个阶段',
    sections: [
      {
        heading: null,
        html: `<p>编译过程分为<strong>六个阶段</strong>，依次为：</p>
<ol>
  <li><strong>词法分析</strong>（Lexical Analysis）</li>
  <li><strong>语法分析</strong>（Syntax Analysis）</li>
  <li><strong>语义分析</strong>（Semantic Analysis）</li>
  <li><strong>中间代码生成</strong>（Intermediate Code Generation）</li>
  <li><strong>代码优化</strong>（Code Optimization）</li>
  <li><strong>目标代码生成</strong>（Target Code Generation）</li>
</ol>
<p>其中<strong>前三个阶段（词法、语法、语义）</strong>是每个编译器都必须具备的核心阶段。</p>`
      },
      {
        heading: '六阶段对照表',
        html: `<table class="exam-table">
  <thead>
    <tr>
      <th>阶段</th>
      <th>核心输出</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>词法分析</td>
      <td>记号流（Token 序列）</td>
      <td>从左到右扫描源程序，识别出具有独立意义的单词（标识符、关键字、运算符等）</td>
    </tr>
    <tr>
      <td>语法分析</td>
      <td>语法树（Parse Tree）</td>
      <td>根据语法规则，将记号流组织成语法结构（如表达式、语句等）</td>
    </tr>
    <tr>
      <td>语义分析</td>
      <td>标注语法树 / 语义检查结果</td>
      <td>类型检查、作用域检查等；确保语法正确的程序在语义上也有意义</td>
    </tr>
    <tr>
      <td>中间代码生成</td>
      <td>中间表示（如三地址码）</td>
      <td>生成与目标机器无关的中间代码，便于后续优化</td>
    </tr>
    <tr>
      <td>代码优化</td>
      <td>优化后的中间代码</td>
      <td>对中间代码进行等价变换，提高运行效率、减少存储空间</td>
    </tr>
    <tr>
      <td>目标代码生成</td>
      <td>目标机器代码 / 汇编</td>
      <td>将优化后的中间代码翻译为目标机器上的可执行代码</td>
    </tr>
  </tbody>
</table>`
      },
      {
        heading: '考试重点',
        html: `<div class="callout callout warn">
  <div class="callout-title">必记考点</div>
  <p><strong>词法分析、语法分析、语义分析</strong>是编译过程中必不可少的<strong>核心必要环节</strong>。中间代码生成和代码优化并不是所有编译器都必须有的。目标代码生成是最终阶段。</p>
  <p>六个阶段的<strong>顺序不能乱</strong>：词法 → 语法 → 语义 → 中间代码 → 优化 → 目标代码。</p>
</div>`
      }
    ]
  },

  // ============================================================
  // 第三章：词法分析：正则表达式
  // ============================================================
  {
    id: 'ch3',
    num: '三',
    title: '词法分析：正则表达式',
    sections: [
      {
        heading: null,
        html: `<p><strong>正则表达式（Regular Expression，简称 RE）</strong>是词法分析中描述单词模式的核心工具。它用一种简洁的字符串形式来精确描述一类字符序列的集合（即<strong>正则语言</strong>）。</p>
<p>在编译原理中，正则表达式用于描述<strong>单词的构成规则</strong>（如标识符、整数、运算符等），是构造词法分析器的基础。</p>`
      },
      {
        heading: '常用元字符速查表',
        html: `<table class="exam-table">
  <thead>
    <tr>
      <th>元字符</th>
      <th>含义</th>
      <th>示例</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>.</code></td><td>匹配任意单个字符（除换行符）</td><td><code>a.c</code> 匹配 abc, a1c, a@c 等</td></tr>
    <tr><td><code>^</code></td><td>匹配行的开头</td><td><code>^abc</code> 匹配以 abc 开头的行</td></tr>
    <tr><td><code>$</code></td><td>匹配行的结尾</td><td><code>abc$</code> 匹配以 abc 结尾的行</td></tr>
    <tr><td><code>*</code></td><td>前一元素出现 0 次或多次</td><td><code>ab*c</code> 匹配 ac, abc, abbc 等</td></tr>
    <tr><td><code>+</code></td><td>前一元素出现 1 次或多次</td><td><code>ab+c</code> 匹配 abc, abbc（不匹配 ac）</td></tr>
    <tr><td><code>?</code></td><td>前一元素出现 0 次或 1 次</td><td><code>ab?c</code> 匹配 ac, abc</td></tr>
    <tr><td><code>[abc]</code></td><td>匹配括号内的任一字符</td><td><code>[abc]</code> 匹配 a 或 b 或 c</td></tr>
    <tr><td><code>[^abc]</code></td><td>匹配不在括号内的任一字符</td><td><code>[^abc]</code> 匹配除 a、b、c 以外的字符</td></tr>
    <tr><td><code>[0-9]</code></td><td>匹配 0 到 9 的任一数字</td><td><code>[0-9]</code> 等价于一个数字位</td></tr>
    <tr><td><code>a|b</code></td><td>匹配 a 或 b（选择）</td><td><code>cat|dog</code> 匹配 cat 或 dog</td></tr>
    <tr><td><code>(ab)</code></td><td>分组，将 ab 作为一个整体</td><td><code>(ab)+</code> 匹配 ab, abab, ababab 等</td></tr>
    <tr><td><code>{n}</code></td><td>恰好出现 n 次</td><td><code>a{3}</code> 匹配 aaa</td></tr>
    <tr><td><code>{n,}</code></td><td>至少出现 n 次</td><td><code>a{2,}</code> 匹配 aa, aaa, aaaa 等</td></tr>
    <tr><td><code>{n,m}</code></td><td>出现 n 到 m 次</td><td><code>a{2,4}</code> 匹配 aa, aaa, aaaa</td></tr>
    <tr><td><code>\\d</code></td><td>等价于 <code>[0-9]</code>，匹配一个数字</td><td><code>\\d{3}</code> 匹配三位数字</td></tr>
    <tr><td><code>\\w</code></td><td>等价于 <code>[A-Za-z0-9_]</code>，字母数字下划线</td><td><code>\\w+</code> 匹配一个或多个"单词字符"</td></tr>
    <tr><td><code>\\s</code></td><td>匹配空白字符（空格、制表符等）</td><td><code>\\s+</code> 匹配一个或多个空白</td></tr>
    <tr><td><code>\\D</code></td><td>匹配非数字字符，等价于 <code>[^0-9]</code></td><td><code>\\D</code> 匹配 a, B, @ 等</td></tr>
    <tr><td><code>\\W</code></td><td>匹配非单词字符</td><td><code>\\W</code> 匹配空格, @, # 等</td></tr>
    <tr><td><code>\\S</code></td><td>匹配非空白字符</td><td><code>\\S+</code> 匹配连续非空白字符</td></tr>
  </tbody>
</table>`
      },
      {
        heading: '实用示例：手机号匹配',
        html: `<p>用正则表达式匹配中国大陆手机号（11位，以 1 开头，第2位为 3/5/6/7/8/9）：</p>
<pre class="code-block"><code>1[356789]\\d{9}</code></pre>
<p>解读：<code>1</code> 匹配开头数字1，<code>[356789]</code> 匹配第二位为 3、5、6、7、8、9 中的任意一个，<code>\\d{9}</code> 匹配后面任意 9 位数字。总长度恰好 11 位。</p>`
      },
      {
        heading: '学习提示',
        html: `<div class="callout callout tip">
  <div class="callout-title">关于 [] 和 ? 的用法</div>
  <p><strong>[abc]</strong> 表示"或"的关系，从括号中任选一个字符。例如 <code>[abc]</code> 匹配 a 或 b 或 c。</p>
  <p><strong>?</strong> 表示前一元素可有可无（出现 0 次或 1 次）。例如 <code>ab?c</code> 匹配 ac 和 abc。</p>
  <p>注意区分 <code>[abc]</code>（选一个）和 <code>(abc)</code>（把 abc 当整体），以及 <code>?</code>（0或1次）和 <code>*</code>（0次或多次）。</p>
</div>`
      }
    ]
  },

  // ============================================================
  // 第四章：词法分析：DFA有穷自动机
  // ============================================================
  {
    id: 'ch4',
    num: '四',
    title: '词法分析：DFA有穷自动机',
    sections: [
      {
        heading: null,
        html: `<p><strong>确定的有穷自动机（Deterministic Finite Automaton，DFA）</strong>是词法分析中用于识别正则语言的数学模型。它可以精确地描述"什么样的输入序列可以被接受"。</p>
<p>一个 DFA 可以用一个<strong>五元组</strong>来形式化定义：</p>
<div class="formula-block">M = (S, &Sigma;, &delta;, s&#8320;, F)</div>`
      },
      {
        heading: '五元组含义',
        html: `<table class="exam-table">
  <thead>
    <tr>
      <th>符号</th>
      <th>含义</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>S</strong></td>
      <td>有穷状态集</td>
      <td>所有可能的状态组成的集合，如 {s&#8320;, s&#8321;, s&#8322;}</td>
    </tr>
    <tr>
      <td><strong>&Sigma;</strong></td>
      <td>输入字母表</td>
      <td>所有允许的输入符号组成的集合，如 {a, b}</td>
    </tr>
    <tr>
      <td><strong>&delta;</strong></td>
      <td>状态转移函数</td>
      <td>&delta;: S &times; &Sigma; &rarr; S，给定当前状态和输入符号，确定下一个状态</td>
    </tr>
    <tr>
      <td><strong>s&#8320;</strong></td>
      <td>初始状态（开始状态）</td>
      <td>s&#8320; &isin; S，唯一的起始状态</td>
    </tr>
    <tr>
      <td><strong>F</strong></td>
      <td>接受状态集（终态集）</td>
      <td>F &sube; S，当输入结束后处于 F 中的状态，则字符串被接受</td>
    </tr>
  </tbody>
</table>`
      },
      {
        heading: 'DFA 的三个关键特点',
        html: `<ol>
  <li><strong>确定性</strong>：对任何状态 s 和输入符号 a，<span class="formula">&delta;(s, a)</span> 有且仅有<strong>一个</strong>后继状态</li>
  <li><strong>不接受 &epsilon; 转移</strong>：DFA 中不允许出现空串（&epsilon;）转移，每一步都必须读入一个输入符号</li>
  <li><strong>唯一初态</strong>：有且仅有<strong>一个</strong>起始状态 s&#8320;</li>
</ol>`
      },
      {
        heading: 'DFA 的三种表示方法',
        html: `<ol>
  <li><strong>状态转移图（Transition Diagram）</strong>：用圆圈表示状态、箭头表示转移、双圈表示接受状态</li>
  <li><strong>状态转移表（Transition Table）</strong>：行表示状态、列表示输入符号、单元格内容为后继状态</li>
  <li><strong>五元组形式化表示</strong>：用数学符号 (S, &Sigma;, &delta;, s&#8320;, F) 精确描述</li>
</ol>`
      },
      {
        heading: '画 DFA 的步骤',
        html: `<div class="callout callout tip">
  <div class="callout-title">考试必会：画 DFA 的通用步骤</div>
  <p><strong>第一步</strong>：仔细审题，确定题目要求识别的语言模式（如"以 ab 结尾"、"含有 aa 子串"等）</p>
  <p><strong>第二步</strong>：列出所有可能的状态，特别注意"当前已读入的后缀"情况</p>
  <p><strong>第三步</strong>：确定初始状态（通常代表"还未读入任何有效信息"）</p>
  <p><strong>第四步</strong>：确定接受状态（代表"已满足目标条件"）</p>
  <p><strong>第五步</strong>：逐状态、逐输入符号画出转移，确保每个状态对每个输入符号都有且仅有一条转移</p>
</div>`
      }
    ]
  },

  // ============================================================
  // 第五章：文法基础
  // ============================================================
  {
    id: 'ch5',
    num: '五',
    title: '文法基础',
    sections: [
      {
        heading: null,
        html: `<p>在编译原理中，<strong>文法（Grammar）</strong>是描述语言语法结构的数学工具。一个上下文无关文法（CFG）用<strong>四元组</strong>来定义：</p>
<div class="formula-block">G = (V<sub>N</sub>, V<sub>T</sub>, P, S)</div>`
      },
      {
        heading: '四元组含义',
        html: `<table class="exam-table">
  <thead>
    <tr>
      <th>符号</th>
      <th>含义</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>V<sub>N</sub></strong></td>
      <td>非终结符号集</td>
      <td>可以被进一步替换/展开的符号，通常用大写字母表示（如 S, A, B, E, T, F）</td>
    </tr>
    <tr>
      <td><strong>V<sub>T</sub></strong></td>
      <td>终结符号集</td>
      <td>不可以再被替换的符号，是语言中实际出现的"单词"（如 a, b, +, *, num, id）</td>
    </tr>
    <tr>
      <td><strong>P</strong></td>
      <td>产生式（规则）集合</td>
      <td>形如 A &rarr; &alpha; 的规则，A &isin; V<sub>N</sub>，&alpha; &isin; (V<sub>N</sub> &cup; V<sub>T</sub>)*</td>
    </tr>
    <tr>
      <td><strong>S</strong></td>
      <td>开始符号</td>
      <td>S &isin; V<sub>N</sub>，代表文法所定义的最终目标语法范畴</td>
    </tr>
  </tbody>
</table>
<p><strong>重要约束</strong>：V<sub>N</sub> &cap; V<sub>T</sub> = &emptyset;，即非终结符和终结符集合不能有交集。</p>`
      },
      {
        heading: '考试要求',
        html: `<div class="callout callout tip">
  <div class="callout-title">必须掌握的要点</div>
  <p>1. 看到一个文法，能准确指出 V<sub>N</sub>、V<sub>T</sub>、P、S 各是什么。</p>
  <p>2. 理解"终结符"和"非终结符"的本质区别：终结符是语言的基本符号（叶子节点），非终结符是需要进一步推导的语法范畴（中间节点）。</p>
  <p>3. 开始符号 S 只有<strong>一个</strong>，必须属于 V<sub>N</sub>。</p>
</div>`
      }
    ]
  },

  // ============================================================
  // 第六章：推导与语法树
  // ============================================================
  {
    id: 'ch6',
    num: '六',
    title: '推导与语法树',
    sections: [
      {
        heading: null,
        html: `<p><strong>推导（Derivation）</strong>是从开始符号出发，反复用产生式的右部替换左部，最终得到终结符号串的过程。</p>
<p>推导分为两种基本方式：</p>
<ul>
  <li><strong>最左推导</strong>：每一步都替换当前句型中最<strong>左边</strong>的非终结符</li>
  <li><strong>最右推导</strong>（又称<strong>规范推导</strong>）：每一步都替换当前句型中最<strong>右边</strong>的非终结符</li>
</ul>
<p>注意：最右推导又叫<strong>规范推导（Canonical Derivation）</strong>，这是一个重要的名词。</p>`
      },
      {
        heading: '做题注意',
        html: `<div class="callout callout warn">
  <div class="callout-title">做题时的常见坑</div>
  <p>1. 最左推导和最右推导的区别只在于<strong>替换顺序</strong>，最终推导出来的句子可能相同，但中间过程不同。</p>
  <p>2. <strong>规范推导 = 最右推导</strong>，考试中这两个词可以互换。</p>
  <p>3. 同一个句子可能有<strong>多种</strong>最左推导（即文法有二义性时）。</p>
  <p>4. 写推导过程时，每一步只替换<strong>一个</strong>非终结符，不要一步替换多个。</p>
</div>`
      },
      {
        heading: '语法树（Parse Tree）',
        html: `<p><strong>语法树</strong>是推导过程的图形化表示，具有以下特点：</p>
<ol>
  <li><strong>根节点</strong>是开始符号 S</li>
  <li><strong>内部节点</strong>是非终结符（属于 V<sub>N</sub>）</li>
  <li><strong>叶子节点</strong>是终结符或 &epsilon;</li>
  <li>从左到右读取所有叶子节点，就得到一个<strong>句型</strong>（如果全是终结符则为句子）</li>
</ol>`
      },
      {
        heading: '语法树判断技巧',
        html: `<div class="callout callout tip">
  <div class="callout-title">判断语法树是否正确</div>
  <p>1. 检查根节点是否为开始符号 S</p>
  <p>2. 检查每个内部节点与其子节点的关系是否对应某个产生式（A &rarr; &alpha;，A 是父节点，&alpha; 是子节点从左到右的序列）</p>
  <p>3. 检查从左到右读叶子节点，是否能得到目标句型/句子</p>
  <p>4. 如果一棵语法树能对应<strong>两种不同的推导</strong>（如既是最左推导又是最右推导），说明该文法是<strong>二义文法</strong></p>
</div>`
      },
      {
        heading: '经典示例：算术表达式文法',
        html: `<p>下面是最常用的算术表达式文法（考试高频出现）：</p>
<pre class="code-block"><code>E → E + T | T
T → T * F | F
F → ( E ) | num</code></pre>
<p>解读：</p>
<ul>
  <li><strong>E</strong>（表达式）：可以是 E+T（加法）或 T（项）</li>
  <li><strong>T</strong>（项）：可以是 T*F（乘法）或 F（因子）</li>
  <li><strong>F</strong>（因子）：可以是 (E)（带括号的表达式）或 num（数字/标识符）</li>
</ul>
<p>注意：这个文法体现了<strong>运算符优先级</strong>——乘法（T 层）优先于加法（E 层），括号（F 层）优先级最高。</p>`
      },
      {
        heading: '实例分析：(num + num) * num',
        html: `<p>对句子 <code>(num + num) * num</code> 进行最左推导：</p>
<pre class="code-block"><code>E ⟹ T
  ⟹ T * F
  ⟹ F * F
  ⟹ (E) * F
  ⟹ (E + T) * F
  ⟹ (T + T) * F
  ⟹ (F + T) * F
  ⟹ (num + T) * F
  ⟹ (num + F) * F
  ⟹ (num + num) * F
  ⟹ (num + num) * num</code></pre>
<p>对应的语法树结构：根为 E，E 分为 T * F；T 递归展开为 (E)，其中 E 展开为 E + T；右子树 F 直接展开为 num。整棵树体现了乘法在外层、加法在括号内的优先级结构。</p>`
      }
    ]
  },

  // ============================================================
  // 第七章：FIRST集
  // ============================================================
  {
    id: 'ch7',
    num: '七',
    title: 'FIRST集',
    sections: [
      {
        heading: null,
        html: `<p><strong>FIRST 集</strong>是 LL(1) 分析中的核心概念。对于文法符号 X：</p>
<div class="formula-block">FIRST(X) = { a | X ⟹* a&alpha;, a &isin; V<sub>T</sub> }</div>
<p>即：从 X 出发，经过零步或多步推导，能<strong>以之开头</strong>的所有终结符的集合。如果 X 能推导出 &epsilon;，则 &epsilon; &isin; FIRST(X)。</p>`
      },
      {
        heading: 'FIRST集的6条基本规则',
        html: `<ol>
  <li>若 X 是<strong>终结符</strong>，则 FIRST(X) = {X}</li>
  <li>若 X 是<strong>非终结符</strong>且有产生式 X &rarr; a&alpha;（a 为终结符），则将 a 加入 FIRST(X)</li>
  <li>若 X &rarr; &epsilon;，则将 &epsilon; 加入 FIRST(X)</li>
  <li>若 X &rarr; Y1 Y2 ... Yk，将 FIRST(Y1) 中<strong>除 &epsilon; 以外</strong>的所有元素加入 FIRST(X)</li>
  <li>若 Y1 能推导出 &epsilon;（即 &epsilon; &isin; FIRST(Y1)），则继续看 Y2，把 FIRST(Y2) 中除 &epsilon; 外的元素加入 FIRST(X)；若 Y2 也能推出 &epsilon;，继续看 Y3，以此类推</li>
  <li>若 Y1, Y2, ..., Yk 全都能推出 &epsilon;，则将 &epsilon; 也加入 FIRST(X)</li>
</ol>`
      },
      {
        heading: '练习：计算 FIRST 集',
        html: `<p>文法如下：</p>
<pre class="code-block"><code>S → A B c
A → a A | ε
B → b B | ε</code></pre>
<p>逐个计算每个候选式的 FIRST 集。</p>`
      },
      {
        heading: '各候选式的 FIRST 集',
        html: `<pre class="code-block"><code>FIRST(aA) = { a }          // a 是终结符，直接放入
FIRST(ε)  = { ε }          // 产生式右部直接是 ε
FIRST(bB) = { b }          // b 是终结符，直接放入
FIRST(ε)  = { ε }          // 同上</code></pre>`
      },
      {
        heading: '各非终结符的 FIRST 集',
        html: `<pre class="code-block"><code>FIRST(A) = FIRST(aA) ∪ FIRST(ε) = { a, ε }

FIRST(B) = FIRST(bB) ∪ FIRST(ε) = { b, ε }

FIRST(S) = FIRST(ABc)
  → 看 A：ε ∈ FIRST(A)，继续看 B
    → 看 B：ε ∈ FIRST(B)，继续看 c
      → 看 c：c 是终结符，加入 {c}
  → FIRST(A) \ {ε} = {a}  加入
  → FIRST(B) \ {ε} = {b}  加入
  → 不能把 ε 加入 FIRST(S)（因为后面还有 c，S 不能推出 ε）
  ∴ FIRST(S) = { a, b, c }</code></pre>`
      },
      {
        heading: '为什么 FIRST(S) 里有 c？',
        html: `<div class="callout">
  <div class="callout-title">关键理解</div>
  <p>S → ABc 中，A 可以推出 &epsilon;，B 也可以推出 &epsilon;。因此存在推导路径 S ⟹* c（A 和 B 都消掉了，只剩 c）。所以 c &isin; FIRST(S)。</p>
  <p>计算规则：对 S → ABc，依次看 A、B、c。A 和 B 都含 &epsilon;，就"穿透"它们看下一个；c 是终结符，加入 FIRST(S)。但因为 c 后面没有东西了，而且 c 本身不是 &epsilon;，所以 S 不能推出 &epsilon;。</p>
</div>`
      }
    ]
  },

  // ============================================================
  // 第八章：FOLLOW集
  // ============================================================
  {
    id: 'ch8',
    num: '八',
    title: 'FOLLOW集',
    sections: [
      {
        heading: null,
        html: `<p><strong>FOLLOW 集</strong>是与 FIRST 集配合使用的另一个核心概念：</p>
<div class="formula-block">FOLLOW(A) = { a | S ⟹* &alpha;Aa&beta;, a &isin; V<sub>T</sub> }</div>
<p>即：在所有句型中，紧跟在非终结符 A <strong>后面</strong>的第一个终结符的集合。如果 A 是某个句型的最右符号，则 <span class="formula">#</span>（输入结束标记）也属于 FOLLOW(A)。</p>`
      },
      {
        heading: 'FOLLOW集的4条常用规则',
        html: `<ol>
  <li>对<strong>开始符号 S</strong>，将 <span class="formula">#</span> 加入 FOLLOW(S)（# 代表输入串的结束标志）</li>
  <li>对产生式 <span class="formula">A &rarr; &alpha;B&beta;</span>，将 FIRST(&beta;) 中<strong>除 &epsilon; 外</strong>的所有元素加入 FOLLOW(B)</li>
  <li>对产生式 <span class="formula">A &rarr; &alpha;B</span>（B 在右部最末尾），或 <span class="formula">A &rarr; &alpha;B&beta;</span> 且 &epsilon; &isin; FIRST(&beta;)，则将 FOLLOW(A) 中的所有元素加入 FOLLOW(B)</li>
  <li>FOLLOW 集中<strong>不包含 &epsilon;</strong>（与 FIRST 集不同！）</li>
</ol>`
      },
      {
        heading: '核心理解',
        html: `<div class="callout callout tip">
  <div class="callout-title">FOLLOW 集的三条核心理解</div>
  <p><strong>1. FOLLOW 集的本质</strong>：回答的是"A 后面可能跟什么终结符"。如果 A 后面紧跟着终结符 a，那 a 就在 FOLLOW(A) 中。</p>
  <p><strong>2. 传递性</strong>：如果 A &rarr; ...B（B 在末尾），说明"A 的 FOLLOW 会传递给 B"——因为 B 在 A 的位置后面可以继续"消失"，B 后面出现什么就等价于 A 后面出现什么。</p>
  <p><strong>3. FOLLOW 集永远不含 &epsilon;</strong>：这是与 FIRST 集的一个关键区别。FOLLOW 集中只放终结符和 #。</p>
</div>`
      },
      {
        heading: '特别注意：# 的归属',
        html: `<div class="callout callout warn">
  <div class="callout-title"># 只属于开始符号</div>
  <p><strong>只有开始符号 S</strong> 的 FOLLOW 集中初始包含 <span class="formula">#</span>。其他非终结符的 FOLLOW 集中包含 #，只能通过规则 3 从产生式右部末尾的位置"传递"得到，而不能凭空添加。</p>
</div>`
      },
      {
        heading: '例题：表达式文法的 FOLLOW 集',
        html: `<p>文法（编号标注便于引用）：</p>
<pre class="code-block"><code>(1) E  → E + T
(2) E  → T
(3) T  → T * F
(4) T  → F
(5) F  → ( E )
(6) F  → num</code></pre>
<p>开始符号为 E。</p>`
      },
      {
        heading: '计算结果',
        html: `<pre class="code-block"><code>【FOLLOW(E)】
  规则1：E 是开始符号 → # ∈ FOLLOW(E)
  产生式(5)：F → ( E )，) 紧跟 E 后 → ) ∈ FOLLOW(E)
  ∴ FOLLOW(E) = { #, ) }

【FOLLOW(T)】
  产生式(1)：E → E + T，T 在末尾 → FOLLOW(E) 传递给 T → { #, ) } ⊆ FOLLOW(T)
  产生式(2)：E → T，T 在末尾 → 同上
  产生式(3)：T → T * F，T 不在末尾（后面是 *F），但这里 T 前面还有 T
    → 实际看的是 T 出现在哪里，此处 T 后面是 *，所以 * ∈ FOLLOW(T)
  ∴ FOLLOW(T) = { #, ), * }

【FOLLOW(F)】
  产生式(3)：T → T * F，F 在末尾 → FOLLOW(T) 传递给 F
  产生式(4)：T → F，F 在末尾 → FOLLOW(T) 传递给 F
  ∴ FOLLOW(F) = { #, ), * }</code></pre>`
      },
      {
        heading: '补充说明',
        html: `<p><strong>FOLLOW(T) 中为什么有 *？</strong></p>
<p>看产生式 <code>T → T * F</code>，第一个 T 后面紧跟着 <code>*</code>，所以 <span class="formula">*</span> &isin; FOLLOW(T)。这里并不是 T 在产生式末尾的情况，而是 T 后面直接跟了一个终结符 <code>*</code>，按照规则 2 直接加入。</p>`
      }
    ]
  },

  // ============================================================
  // 第九章：LL(1)文法判断
  // ============================================================
  {
    id: 'ch9',
    num: '九',
    title: 'LL(1)文法判断',
    sections: [
      {
        heading: null,
        html: `<p><strong>LL(1) 文法</strong>是自上而下语法分析中最重要的文法类别。一个文法是 LL(1) 的，当且仅当满足以下<strong>三个条件</strong>：</p>
<ol>
  <li><strong>无左递归</strong>：文法中不能存在形如 <span class="formula">A ⟹+ A&alpha;</span> 的推导（即 A 经过一步或多步推导后，最左边仍然是 A）</li>
  <li><strong>同一非终结符的各候选式的 FIRST 集两两不相交</strong>：对每个非终结符 A，若 A &rarr; &alpha;1 | &alpha;2 | ... | &alpha;n，则 FIRST(&alpha;i) &cap; FIRST(&alpha;j) = &emptyset;（i &ne; j）</li>
  <li><strong>若某个候选式能推出 &epsilon;</strong>，则 <span class="formula">FIRST(&alpha;i) &cap; FOLLOW(A) = &emptyset;</span>（即能推出 &epsilon; 的候选式的 FIRST 集不能与 A 的 FOLLOW 集有交集）</li>
</ol>`
      },
      {
        heading: 'LL(1) 判断的做题顺序',
        html: `<div class="callout callout tip">
  <div class="callout-title">考试做题五步法</div>
  <p><strong>第一步</strong>：检查文法是否有<strong>左递归</strong>。若有，直接判定"不是 LL(1) 文法"，无需继续。</p>
  <p><strong>第二步</strong>：对每个非终结符，列出其所有<strong>候选式</strong>（产生式右部）。</p>
  <p><strong>第三步</strong>：计算每个候选式的 <strong>FIRST 集</strong>。</p>
  <p><strong>第四步</strong>：检查同一非终结符的候选式的 FIRST 集是否<strong>两两不相交</strong>。若有交集，直接判定"不是 LL(1) 文法"。</p>
  <p><strong>第五步</strong>：若有候选式能推出 &epsilon;，计算该非终结符的 <strong>FOLLOW 集</strong>，检查 FIRST(&alpha;i) &cap; FOLLOW(A) 是否为空。若不为空，判定"不是 LL(1) 文法"。</p>
</div>`
      },
      {
        heading: '例题1：S → aAS | b, A → bA | ε',
        html: `<p>判断该文法是否为 LL(1) 文法。</p>
<p><strong>第一步：检查左递归</strong></p>
<p>S → aAS | b，A → bA | ε。没有非终结符能在推导中使自身出现在最左边，<strong>无左递归</strong>。</p>
<p><strong>第二步 & 第三步：列出候选式并计算 FIRST 集</strong></p>
<pre class="code-block"><code>S 的候选式：aAS, b
  FIRST(aAS) = { a }
  FIRST(b)   = { b }
  → {a} ∩ {b} = ∅ ✓

A 的候选式：bA, ε
  FIRST(bA) = { b }
  FIRST(ε)  = { ε }
  → {b} ∩ {ε} = ∅ ✓
  → 但 A → ε 能推出 ε，需检查 FOLLOW(A)</code></pre>
<p><strong>第四步 & 第五步：计算 FOLLOW 集</strong></p>
<pre class="code-block"><code>FOLLOW(S) = { # }                  // S 是开始符号
FOLLOW(A)：
  产生式 S → aAS，A 在末尾 → FOLLOW(S) 传递给 A
  ∴ FOLLOW(A) = { # }

检查：FIRST(ε) ∩ FOLLOW(A) = {ε} ∩ {#} = ∅ ✓
（注意：ε 不算真正的终结符，FOLLOW 集中不包含 ε，所以交集为空）</code></pre>
<p><strong>结论：该文法是 LL(1) 文法。</strong></p>`
      },
      {
        heading: '例题2：S → ABc, A → a | ε, B → b | ε',
        html: `<p>判断该文法是否为 LL(1) 文法。</p>
<p><strong>第一步：检查左递归</strong></p>
<p>无左递归，通过。</p>
<p><strong>第二步 & 第三步：列出候选式并计算 FIRST 集</strong></p>
<pre class="code-block"><code>S 的候选式：ABc
  (只有一个候选式，无需检查交集)

A 的候选式：a, ε
  FIRST(a) = { a }
  FIRST(ε) = { ε }
  → {a} ∩ {ε} = ∅ ✓
  → A → ε 能推出 ε，需检查 FOLLOW(A)

B 的候选式：b, ε
  FIRST(b) = { b }
  FIRST(ε) = { ε }
  → {b} ∩ {ε} = ∅ ✓
  → B → ε 能推出 ε，需检查 FOLLOW(B)</code></pre>
<p><strong>第四步 & 第五步：计算 FOLLOW 集并检查</strong></p>
<pre class="code-block"><code>FOLLOW(S) = { # }                  // S 是开始符号

FOLLOW(A)：
  产生式 S → ABc，A 后面是 Bc
    → FIRST(Bc) \ {ε} 加入 FOLLOW(A)
    → FIRST(B) = {b, ε}，把 b 加入，ε 穿透继续看 c
    → c 是终结符，加入
    → 若 B 和其后面的都能推出 ε（但 c 不行），所以不再传递
  ∴ FOLLOW(A) = { b, c }

FOLLOW(B)：
  产生式 S → ABc，B 后面是 c
    → FIRST(c) = {c} 加入 FOLLOW(B)
  ∴ FOLLOW(B) = { c }

检查 A → ε：
  FIRST(a) ∩ FOLLOW(A) = {a} ∩ {b, c} = ∅ ✓

检查 B → ε：
  FIRST(b) ∩ FOLLOW(B) = {b} ∩ {c} = ∅ ✓</code></pre>
<p><strong>结论：该文法是 LL(1) 文法。三个条件全部满足。</strong></p>`
      }
    ]
  }
];
