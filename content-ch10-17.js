const CHAPTERS_PART2 = [
  {
    id: 'ch10',
    num: '十',
    title: '自下而上分析：移进-归约',
    sections: [
      {
        heading: null,
        html: `<p>自下而上分析的核心思想：从输入串出发，逐步<strong>归约</strong>到开始符号。与自上而下分析相反，它是"由底向上"构造语法树的过程。</p>
<div class="callout">
  <div class="callout-title">移进-归约的四种动作</div>
  <p><strong>1. 预备</strong>：栈和输入串都放 <code>#</code>（栈底标记和输入串末尾标记）<br>
  <strong>2. 移进</strong>：把输入串当前符号压入栈<br>
  <strong>3. 归约</strong>：栈顶匹配某个产生式的右部，就用该产生式的左部替换<br>
  <strong>4. 接受</strong>：栈中为 <code>#S</code>，输入串为 <code>#</code>，分析成功</p>
</div>`
      },
      {
        heading: '移进-归约分析表',
        html: `<p>文法：</p>
<pre class="code-block"><code>S → aAbB
A → Ac | c
B → d</code></pre>
<p>输入串：<code>accbd</code></p>
<p>完整移进-归约过程：</p>
<table class="exam-table">
  <thead><tr><th>步骤</th><th>栈</th><th>输入串</th><th>动作</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>#</td><td>accbd#</td><td>预备</td></tr>
    <tr><td>2</td><td>#a</td><td>ccbd#</td><td>移进</td></tr>
    <tr><td>3</td><td>#ac</td><td>cbd#</td><td>移进</td></tr>
    <tr><td>4</td><td>#aA</td><td>cbd#</td><td>归约 A→c</td></tr>
    <tr><td>5</td><td>#aAc</td><td>bd#</td><td>移进</td></tr>
    <tr><td>6</td><td>#aA</td><td>bd#</td><td>归约 A→Ac</td></tr>
    <tr><td>7</td><td>#aAb</td><td>d#</td><td>移进</td></tr>
    <tr><td>8</td><td>#aAbd</td><td>#</td><td>移进</td></tr>
    <tr><td>9</td><td>#aAbB</td><td>#</td><td>归约 B→d</td></tr>
    <tr><td>10</td><td>#S</td><td>#</td><td>归约 S→aAbB</td></tr>
    <tr><td>11</td><td>#S</td><td>#</td><td>接受</td></tr>
  </tbody>
</table>
<div class="callout callout warn">
  <div class="callout-title">做题提醒</div>
  <p>人工做题时可以试探，但表格最终要写成合理的移进/归约序列。归约不是随便归，原则上应归约<strong>句柄</strong>。</p>
</div>`
      }
    ]
  },
  {
    id: 'ch11',
    num: '十一',
    title: '短语、直接短语、句柄',
    sections: [
      {
        heading: null,
        html: `<p>判断短语、直接短语、句柄这三个概念，一般要先<strong>画语法树</strong>。</p>`
      },
      {
        heading: '三个概念的定义',
        html: `<p><strong>1. 短语</strong>：语法树中任意一棵子树的所有叶子节点从左到右连接起来的符号串。</p>
<p><strong>2. 直接短语</strong>：高度（深度）为 1 的子树对应的短语，即某个非终结符一步推出的右部。</p>
<p><strong>3. 句柄</strong>：最左边的直接短语。在规范归约中，每次应归约句柄。</p>`
      },
      {
        heading: '做题步骤',
        html: `<p>做题五步法：</p>
<p><strong>步骤1</strong>：画语法树</p>
<p><strong>步骤2</strong>：找所有子树</p>
<p><strong>步骤3</strong>：每棵子树的叶子从左到右连起来，得到短语</p>
<p><strong>步骤4</strong>：在短语中找深度为 1 的，得到直接短语</p>
<p><strong>步骤5</strong>：最左边的直接短语就是句柄</p>
<div class="callout callout warn">
  <div class="callout-title">易错提醒</div>
  <p>不是随便截一段连续字符就是短语，必须对应同一棵子树。重复的短语可以合并写。直接短语通常更短，但本质依据是"深度为 1"。</p>
</div>`
      }
    ]
  },
  {
    id: 'ch12',
    num: '十二',
    title: '语义分析：符号表管理',
    sections: [
      {
        heading: null,
        html: `<p>语义分析阶段的重点是<strong>符号表</strong>。编译器在语义分析阶段维护一张符号表，记录所有标识符的属性信息。</p>`
      },
      {
        heading: '符号表常见字段',
        html: `<table class="exam-table">
  <thead><tr><th>字段</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>标识符名</td><td>变量名、函数名等</td></tr>
    <tr><td>类型</td><td>int、float、char 等</td></tr>
    <tr><td>作用域 / 当前层级</td><td>全局、函数级、块级</td></tr>
    <tr><td>值或初始化状态</td><td>是否有初始值</td></tr>
    <tr><td>入口地址</td><td>变量在内存中的位置</td></tr>
    <tr><td>状态</td><td>active / inactive</td></tr>
  </tbody>
</table>`
      },
      {
        heading: '三类核心动作',
        html: `<p><strong>1. 插入</strong>：遇到声明时，将标识符及其属性插入符号表</p>
<p><strong>2. 查找</strong>：遇到引用时，在符号表中查找该标识符</p>
<p><strong>3. 更新</strong>：遇到赋值或属性变化时，先查找再更新其属性</p>`
      },
      {
        heading: '作用域规则',
        html: `<p><strong>规则1</strong>：内层可以声明与外层同名标识符（内层遮蔽外层）</p>
<p><strong>规则2</strong>：引用标识符时，优先找当前作用域，找不到再向外层找</p>
<p><strong>规则3</strong>：退出作用域后，该作用域内的标识符应被销毁或标记为 inactive</p>`
      },
      {
        heading: '符号表处理示例',
        html: `<p>老师板书示例代码：</p>
<pre class="code-block"><code>int x;
void f() {
    int y;
    {
        int x;
        x = 10;
    }
    y = 5;
}</code></pre>
<p>符号表处理过程：</p>
<table class="exam-table">
  <thead><tr><th>#</th><th>动作</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>插入 x</td><td>作用域：全局</td></tr>
    <tr><td>2</td><td>插入 f</td><td>作用域：全局</td></tr>
    <tr><td>3</td><td>进入函数 f</td><td>—</td></tr>
    <tr><td>4</td><td>插入 y</td><td>作用域：函数 f</td></tr>
    <tr><td>5</td><td>进入块</td><td>—</td></tr>
    <tr><td>6</td><td>插入新 x</td><td>作用域：块内（不是全局 x）</td></tr>
    <tr><td>7</td><td>更新 x = 10</td><td>引用块内 x，先查找再更新</td></tr>
    <tr><td>8</td><td>退出块</td><td>块内 x → inactive</td></tr>
    <tr><td>9</td><td>更新 y = 5</td><td>引用函数局部 y</td></tr>
    <tr><td>10</td><td>退出函数</td><td>局部 y → inactive</td></tr>
  </tbody>
</table>
<div class="callout callout warn">
  <div class="callout-title">考试常见问法</div>
  <p><strong>1.</strong> 描述每一行代码符号表做了什么<br>
  <strong>2.</strong> 给出最终符号表<br>
  <strong>3.</strong> 判断某个标识符引用的是哪个作用域里的声明</p>
</div>`
      }
    ]
  },
  {
    id: 'ch13',
    num: '十三',
    title: '中间代码：逆波兰式',
    sections: [
      {
        heading: null,
        html: `<p>逆波兰式又称<strong>后缀表达式</strong>，是一种常用的中间代码表示形式。运算符写在操作数之后，不需要括号即可确定运算顺序。</p>`
      },
      {
        heading: '中缀转逆波兰式步骤',
        html: `<p><strong>步骤1</strong>：准备运算符栈和结果列表</p>
<p><strong>步骤2</strong>：从左到右扫描表达式</p>
<p><strong>步骤3</strong>：遇到操作数，直接加入结果</p>
<p><strong>步骤4</strong>：遇到左括号，压入栈</p>
<p><strong>步骤5</strong>：遇到右括号，弹出栈中运算符直到遇到左括号（左括号弹出但不加入结果）</p>
<p><strong>步骤6</strong>：遇到运算符，比较与栈顶运算符的优先级：若当前优先级 ≤ 栈顶，先弹出栈顶再压入；否则直接压入</p>
<p><strong>步骤7</strong>：扫描结束后，弹出栈中剩余运算符加入结果</p>`
      },
      {
        heading: '练习',
        html: `<p><strong>练习1</strong>：<code>a - b * c + d</code></p>
<p>逆波兰式：<span class="formula">a b c * - d +</span></p>
<p><strong>练习2</strong>：<code>(10 - 4) / 2 + 7 * 3</code></p>
<p>逆波兰式：<span class="formula">10 4 - 2 / 7 3 * +</span></p>`
      }
    ]
  },
  {
    id: 'ch14',
    num: '十四',
    title: '中间代码：三地址码、四元式、AST',
    sections: [
      {
        heading: '三地址码',
        html: `<p>三地址码的特点：每条语句<strong>最多包含一个运算</strong>。</p>
<p>例：表达式 <code>a - b * c + d</code></p>
<pre class="code-block"><code>t1 = b * c
t2 = a - t1
t3 = t2 + d</code></pre>`
      },
      {
        heading: '四元式',
        html: `<p>四元式的一般形式：<span class="formula">(op, arg1, arg2, result)</span></p>
<p>对应上例：</p>
<pre class="code-block"><code>(*, b, c, t1)
(-, a, t1, t2)
(+, t2, d, t3)</code></pre>`
      },
      {
        heading: '抽象语法树（AST）',
        html: `<p>AST 去掉普通语法树中不必要的语法细节，更突出运算结构。<strong>运算符常作为内部节点，操作数作为叶子</strong>。</p>
<p>例：表达式 <code>a - (b + c) * d</code></p>
<p>计算顺序：① b + c → ② (b + c) * d → ③ a - 结果</p>
<p>三地址码：</p>
<pre class="code-block"><code>t1 = b + c
t2 = t1 * d
t3 = a - t2</code></pre>
<p>AST 结构：</p>
<pre class="code-block"><code>        -
       / \\
      a    *
          / \\
         +   d
        / \\
       b   c</code></pre>
<div class="callout callout warn">
  <div class="callout-title">画图区分</div>
  <p>题目说"画语法树" → 默认画普通语法树（完整展开所有产生式）<br>
  题目说"抽象语法树 / AST" → 才画 AST（只保留运算结构）<br>
  三地址码中每条语句只写一个运算</p>
</div>`
      }
    ]
  },
  {
    id: 'ch15',
    num: '十五',
    title: '代码优化：基本块与流图',
    sections: [
      {
        heading: '基本块',
        html: `<p>基本块是一段<strong>顺序执行</strong>的三地址代码，中间没有跳入也没有跳出，只有入口和出口。</p>`
      },
      {
        heading: '划分基本块的入口语句规则',
        html: `<p><strong>规则1</strong>：第一条语句一定是入口</p>
<p><strong>规则2</strong>：跳转语句的<strong>目标语句</strong>是入口</p>
<p><strong>规则3</strong>：跳转语句的<strong>下一条语句</strong>是入口</p>`
      },
      {
        heading: '划分步骤',
        html: `<p><strong>步骤1</strong>：找所有入口语句（按上述三条规则）</p>
<p><strong>步骤2</strong>：每个入口到下一个入口之前构成一个基本块</p>
<p><strong>步骤3</strong>：最后一个入口到程序结束构成最后一个基本块</p>`
      },
      {
        heading: '流图画法',
        html: `<p><strong>步骤1</strong>：每个基本块画成一个节点</p>
<p><strong>步骤2</strong>：若基本块执行完自然进入下一个，画<strong>顺序边</strong></p>
<p><strong>步骤3</strong>：若有无条件跳转，画到目标基本块的边（<strong>跳转边</strong>）</p>
<p><strong>步骤4</strong>：若有条件跳转：条件满足指向跳转目标，条件不满足指向下一基本块</p>
<div class="callout callout warn">
  <div class="callout-title">做题提醒</div>
  <p>入口规则很固定，先把入口找准。流图不是乱连，依据只有<strong>顺序执行</strong>和<strong>跳转执行</strong>。</p>
</div>`
      }
    ]
  },
  {
    id: 'ch16',
    num: '十六',
    title: '考前高频题型清单',
    sections: [
      {
        heading: null,
        html: `<p>以下是编译原理考试中<strong>出现频率最高</strong>的 15 类题型，考前务必逐条确认是否掌握：</p>
<div class="topic-list">
  <div class="topic-item"><span class="topic-num">1</span>写编译过程六阶段及输出</div>
  <div class="topic-item"><span class="topic-num">2</span>区分编译程序和解释程序</div>
  <div class="topic-item"><span class="topic-num">3</span>写正则表达式（手机号、数字、标识符）</div>
  <div class="topic-item"><span class="topic-num">4</span>根据DFA五元组画状态图或状态转换表</div>
  <div class="topic-item"><span class="topic-num">5</span>根据文法写最左/最右推导</div>
  <div class="topic-item"><span class="topic-num">6</span>根据推导或句子画语法树</div>
  <div class="topic-item"><span class="topic-num">7</span>计算FIRST集</div>
  <div class="topic-item"><span class="topic-num">8</span>计算FOLLOW集</div>
  <div class="topic-item"><span class="topic-num">9</span>判断LL(1)文法</div>
  <div class="topic-item"><span class="topic-num">10</span>写移进-归约过程表</div>
  <div class="topic-item"><span class="topic-num">11</span>根据语法树找短语、直接短语、句柄</div>
  <div class="topic-item"><span class="topic-num">12</span>描述符号表插入、查找、更新过程</div>
  <div class="topic-item"><span class="topic-num">13</span>中缀表达式转逆波兰式</div>
  <div class="topic-item"><span class="topic-num">14</span>画AST或写三地址码/四元式</div>
  <div class="topic-item"><span class="topic-num">15</span>划分基本块、画流图</div>
</div>`
      }
    ]
  },
  {
    id: 'ch17',
    num: '十七',
    title: '最后速记版',
    sections: [
      {
        heading: null,
        html: `<p>考前最后过一遍，每条都是高频考点的浓缩：</p>
<div class="callout">
  <div class="callout-title">编译 vs 解释</div>
  <p><strong>编译</strong>：先翻译后执行，运行目标程序时不强制需要编译器<br>
  <strong>解释</strong>：边翻译边执行，每次运行强制需要解释器</p>
</div>
<div class="callout">
  <div class="callout-title">六阶段速记</div>
  <p>词法 → <strong>token</strong><br>
  语法 → <strong>语法树</strong><br>
  语义 → <strong>符号表</strong><br>
  中间代码 → <strong>逆波兰式 / 三地址码</strong><br>
  优化 → <strong>代码优化</strong><br>
  目标代码 → <strong>机器码</strong></p>
</div>
<div class="callout">
  <div class="callout-title">DFA 速记</div>
  <p>五元组：<span class="formula">(状态集, 输入字母表, 转移函数, 初态, 终态集)</span><br>
  特点：确定、无 ε 转移</p>
</div>
<div class="callout">
  <div class="callout-title">FIRST 与 FOLLOW</div>
  <p><strong>FIRST</strong>：看"能以什么开头"。前面可空就继续看后面<br>
  <strong>FOLLOW</strong>：看"后面能跟什么"。后面可空就继承左侧 FOLLOW。只有开始符号默认有 #</p>
</div>
<div class="callout">
  <div class="callout-title">LL(1) 文法判断</div>
  <p>无左递归 · 同一非终结符各候选式 FIRST 两两不交 · 有 ε 时 FIRST 与 FOLLOW 不冲突</p>
</div>
<div class="callout">
  <div class="callout-title">移进-归约速记</div>
  <p>从输入串归约到开始符号。动作：预备、移进、归约、接受。每次归约<strong>句柄</strong></p>
</div>
<div class="callout">
  <div class="callout-title">短语、直接短语、句柄</div>
  <p><strong>短语</strong>：子树叶子串<br>
  <strong>直接短语</strong>：深度为 1 的子树叶子串<br>
  <strong>句柄</strong>：最左直接短语</p>
</div>
<div class="callout">
  <div class="callout-title">符号表速记</div>
  <p>声明 → 插入 · 引用 → 查找 · 赋值 → 先查找再更新 · 内层同名变量优先于外层</p>
</div>
<div class="callout">
  <div class="callout-title">中间代码速记</div>
  <p><strong>逆波兰式</strong>：操作数直接输出，运算符按优先级栈处理<br>
  <strong>三地址码</strong>：一条语句一个运算<br>
  <strong>四元式</strong>：<span class="formula">(op, arg1, arg2, result)</span></p>
</div>
<div class="callout">
  <div class="callout-title">基本块与流图速记</div>
  <p><strong>基本块入口</strong>：第一句、跳转目标、跳转下一句<br>
  <strong>流图</strong>：顺序边 + 跳转边</p>
</div>`
      }
    ]
  }
];
