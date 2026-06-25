/**
 * 编译原理复习站 - 核心交互脚本
 * 功能：章节内容渲染、导航、进度追踪、搜索、主题切换、快捷键
 */

// ============================================================
// 1. 章节元数据 + 内容数据合并
// ============================================================
const chaptersMeta = [
  { id: 'ch1', num: '一', title: '编译程序和解释程序的区别' },
  { id: 'ch2', num: '二', title: '编译过程六个阶段' },
  { id: 'ch3', num: '三', title: '词法分析：正则表达式' },
  { id: 'ch4', num: '四', title: '词法分析：DFA 有穷自动机' },
  { id: 'ch5', num: '五', title: '文法基础' },
  { id: 'ch6', num: '六', title: '推导与语法树' },
  { id: 'ch7', num: '七', title: 'FIRST 集' },
  { id: 'ch8', num: '八', title: 'FOLLOW 集' },
  { id: 'ch9', num: '九', title: 'LL(1) 文法判断' },
  { id: 'ch10', num: '十', title: '自下而上分析：移进-归约' },
  { id: 'ch11', num: '十一', title: '短语、直接短语、句柄' },
  { id: 'ch12', num: '十二', title: '语义分析：符号表管理' },
  { id: 'ch13', num: '十三', title: '中间代码：逆波兰式' },
  { id: 'ch14', num: '十四', title: '中间代码：三地址码、四元式、AST' },
  { id: 'ch15', num: '十五', title: '代码优化：基本块与流图' },
  { id: 'ch16', num: '十六', title: '考前高频题型清单' },
  { id: 'ch17', num: '十七', title: '最后速记版' },
];

// 合并两部分内容数据（由 content-ch1-9.js 和 content-ch10-17.js 定义）
const allContent = [
  ...(typeof CHAPTERS_PART1 !== 'undefined' ? CHAPTERS_PART1 : []),
  ...(typeof CHAPTERS_PART2 !== 'undefined' ? CHAPTERS_PART2 : []),
];

// ============================================================
// 2. 状态管理
// ============================================================
const STORAGE_KEYS = {
  PROGRESS: 'compiler-review-progress',
  THEME: 'compiler-review-theme',
  FONT_SIZE: 'compiler-review-font-size',
};

let currentFontSize = parseInt(localStorage.getItem(STORAGE_KEYS.FONT_SIZE)) || 16;

// ============================================================
// 3. 初始化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderChapters();
  renderSidebar();
  initProgress();
  initSearch();
  initTheme();
  initKeyboardShortcuts();
  initChapterCollapse();
  initMobileSidebar();
  initToolbar();
  initIntersectionObserver();
  initBreadcrumb();
  initExport();

  // 侧边栏默认打开时，给body加类让内容右移
  const sidebar = document.getElementById('sidebar');
  if (sidebar?.classList.contains('open')) {
    document.body.classList.add('sidebar-visible');
  }
});

// ============================================================
// 4. 章节内容渲染
// ============================================================
function renderChapters() {
  const container = document.getElementById('chaptersContainer');
  if (!container) return;

  const fragment = document.createDocumentFragment();

  allContent.forEach((ch) => {
    const section = document.createElement('section');
    section.className = 'chapter-section';
    section.id = ch.id;

    // 章节标题
    const header = document.createElement('h2');
    header.className = 'chapter-header';
    header.innerHTML = `
      <span class="collapse-icon">▼</span>
      <span class="chapter-num">${ch.num}</span>
      <span class="chapter-title">${ch.title}</span>
    `;
    section.appendChild(header);

    // 章节内容容器
    const body = document.createElement('div');
    body.className = 'chapter-body';

    ch.sections.forEach((sec) => {
      if (sec.heading) {
        const h3 = document.createElement('h3');
        h3.className = 'section-heading';
        h3.textContent = sec.heading;
        body.appendChild(h3);
      }
      const content = document.createElement('div');
      content.className = 'section-content';
      content.innerHTML = sec.html;
      body.appendChild(content);
    });

    section.appendChild(body);
    fragment.appendChild(section);
  });

  container.appendChild(fragment);
}

// ============================================================
// 5. 侧边栏渲染
// ============================================================
function renderSidebar() {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  const fragment = document.createDocumentFragment();

  chaptersMeta.forEach((ch) => {
    const item = document.createElement('a');
    item.className = 'sidebar-item';
    item.href = `#${ch.id}`;
    item.dataset.chapterId = ch.id;

    const check = document.createElement('span');
    check.className = 'sidebar-check';
    check.id = `check-${ch.id}`;
    if (isChapterRead(ch.id)) {
      check.classList.add('done');
      check.textContent = '✓';
    }

    const num = document.createElement('span');
    num.className = 'sidebar-num';
    num.textContent = ch.num;

    const label = document.createElement('span');
    label.className = 'sidebar-label';
    label.textContent = ch.title;

    item.appendChild(check);
    item.appendChild(num);
    item.appendChild(label);

    item.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToChapter(ch.id);
    });

    fragment.appendChild(item);
  });

  nav.appendChild(fragment);
}

// ============================================================
// 6. 进度追踪
// ============================================================
function getReadStatus() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS)) || {};
  } catch {
    return {};
  }
}

function saveReadStatus(status) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(status));
}

function isChapterRead(chapterId) {
  const status = getReadStatus();
  return status[chapterId] === true;
}

function markChapterRead(chapterId) {
  const status = getReadStatus();
  if (!status[chapterId]) {
    status[chapterId] = true;
    saveReadStatus(status);
    const check = document.getElementById(`check-${chapterId}`);
    if (check) {
      check.classList.add('done');
      check.textContent = '✓';
    }
    updateProgressDisplay();
  }
}

function updateProgressDisplay() {
  const status = getReadStatus();
  const done = Object.keys(status).filter((k) => status[k]).length;
  const total = chaptersMeta.length;
  const pct = Math.round((done / total) * 100);

  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  const pctEl = document.getElementById('progressPct');

  if (fill) fill.style.width = `${pct}%`;
  if (label) label.textContent = `${done} / ${total} 章`;
  if (pctEl) pctEl.textContent = `${pct}%`;
}

function initProgress() {
  updateProgressDisplay();

  const resetBtn = document.getElementById('resetProgress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('确定要重置所有学习进度吗？')) {
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        document.querySelectorAll('.sidebar-check').forEach((el) => {
          el.classList.remove('done');
          el.textContent = '';
        });
        updateProgressDisplay();
      }
    });
  }
}

// ============================================================
// 7. 搜索功能
// ============================================================
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(input.value), 200);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearSearch();
      input.blur();
    }
  });
}

function performSearch(query) {
  const q = query.trim().toLowerCase();
  clearHighlights();

  const countEl = document.getElementById('searchCount');
  if (!q) {
    if (countEl) countEl.textContent = '';
    return;
  }

  let matchCount = 0;
  const container = document.getElementById('chaptersContainer');
  if (!container) return;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const text = node.textContent;
    const lower = text.toLowerCase();
    if (lower.includes(q)) {
      const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'));
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (part.toLowerCase() === q) {
          const mark = document.createElement('mark');
          mark.className = 'search-highlight';
          mark.textContent = part;
          frag.appendChild(mark);
          matchCount++;
        } else {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(frag, node);
    }
  });

  if (countEl) countEl.textContent = matchCount > 0 ? `${matchCount} 处匹配` : '无匹配';

  const first = document.querySelector('.search-highlight');
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearHighlights() {
  document.querySelectorAll('.search-highlight').forEach((mark) => {
    const text = document.createTextNode(mark.textContent);
    mark.parentNode.replaceChild(text, mark);
  });
  document.body.normalize();
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  clearHighlights();
  const countEl = document.getElementById('searchCount');
  if (countEl) countEl.textContent = '';
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================
// 8. 面包屑导航
// ============================================================
function initBreadcrumb() {
  updateBreadcrumb();
  window.addEventListener('scroll', throttle(updateBreadcrumb, 150));
}

function updateBreadcrumb() {
  const el = document.getElementById('breadcrumbCurrent');
  if (!el) return;

  const currentId = getCurrentVisibleChapter();
  if (currentId) {
    const ch = chaptersMeta.find((c) => c.id === currentId);
    if (ch) el.textContent = `第${ch.num}章 ${ch.title}`;
  }
}

function getCurrentVisibleChapter() {
  const scrollY = window.scrollY + 120;
  for (let i = chaptersMeta.length - 1; i >= 0; i--) {
    const sec = document.getElementById(chaptersMeta[i].id);
    if (sec && sec.offsetTop <= scrollY) return chaptersMeta[i].id;
  }
  return chaptersMeta[0]?.id;
}

// ============================================================
// 9. 主题切换（多主题 + 下拉菜单）
// ============================================================
const THEMES = ['light', 'dark', 'warm', 'cool'];
const THEME_LABELS = { light: 'Light', dark: 'Dark', warm: 'Warm', cool: 'Cool' };

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  applyTheme(saved);

  const btn = document.getElementById('themeToggle');
  const dropdown = document.getElementById('themeDropdown');

  if (btn && dropdown) {
    // 点击按钮切换下拉
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // 点击选项切换主题
    dropdown.querySelectorAll('.theme-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        const theme = opt.dataset.theme;
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        dropdown.classList.remove('open');
      });
    });

    // 点击外部关闭下拉
    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
  localStorage.setItem(STORAGE_KEYS.THEME, next);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // 更新下拉菜单高亮
  document.querySelectorAll('.theme-option').forEach((opt) => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
}

// ============================================================
// 10. 快捷键
// ============================================================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    // Ctrl+K: 聚焦搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
      return;
    }

    // Escape
    if (e.key === 'Escape') {
      clearSearch();
      document.getElementById('searchInput')?.blur();
      closeSidebar();
      return;
    }

    if (isInput) return;

    // /: 聚焦搜索
    if (e.key === '/') {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
      return;
    }

    // T: 回到顶部
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // D: 切换主题
    if (e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      toggleTheme();
      return;
    }

    // ← →: 翻章
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateChapter(-1);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateChapter(1);
      return;
    }
  });
}

function navigateChapter(direction) {
  const currentId = getCurrentVisibleChapter();
  const idx = chaptersMeta.findIndex((c) => c.id === currentId);
  const next = idx + direction;
  if (next >= 0 && next < chaptersMeta.length) {
    scrollToChapter(chaptersMeta[next].id);
  }
}

// ============================================================
// 11. 章节折叠
// ============================================================
function initChapterCollapse() {
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.chapter-header');
    if (!header) return;

    const section = header.closest('.chapter-section');
    if (!section) return;

    section.classList.toggle('collapsed');
    const icon = header.querySelector('.collapse-icon');
    if (icon) icon.textContent = section.classList.contains('collapsed') ? '▶' : '▼';
  });
}

// ============================================================
// 12. 抽屉式侧边栏
// ============================================================
function initMobileSidebar() {
  const toggle = document.getElementById('tocToggle');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggle) toggle.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const isOpen = sidebar?.classList.contains('open');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
  document.body.classList.toggle('sidebar-visible', !isOpen);
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('sidebar-visible');
}

// ============================================================
// 13. 工具栏
// ============================================================
function initToolbar() {
  applyFontSize(currentFontSize);

  const incBtn = document.getElementById('fontIncrease');
  const decBtn = document.getElementById('fontDecrease');
  const printBtn = document.getElementById('printBtn');
  const topBtn = document.getElementById('scrollTop');

  if (incBtn) incBtn.addEventListener('click', () => {
    if (currentFontSize < 24) { currentFontSize += 2; applyFontSize(currentFontSize); }
  });
  if (decBtn) decBtn.addEventListener('click', () => {
    if (currentFontSize > 12) { currentFontSize -= 2; applyFontSize(currentFontSize); }
  });
  if (printBtn) printBtn.addEventListener('click', () => window.print());
  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}px`;
  localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
}

// ============================================================
// 14. 平滑滚动 + 侧边栏激活
// ============================================================
function scrollToChapter(chapterId) {
  const section = document.getElementById(chapterId);
  if (!section) return;

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateActiveSidebarItem(chapterId);
  markChapterRead(chapterId);

  closeSidebar();
}

function updateActiveSidebarItem(chapterId) {
  document.querySelectorAll('.sidebar-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.chapterId === chapterId);
  });
}

// ============================================================
// 15. IntersectionObserver - 自动标记已读 + 激活侧边栏
// ============================================================
function initIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          markChapterRead(id);
          updateActiveSidebarItem(id);
          updateBreadcrumb();
        }
      });
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
  );

  chaptersMeta.forEach((ch) => {
    const sec = document.getElementById(ch.id);
    if (sec) observer.observe(sec);
  });
}

// ============================================================
// 16. 导出资料功能（高质量排版）
// ============================================================
function initExport() {
  const btn = document.getElementById('exportBtn');
  if (!btn) return;
  btn.addEventListener('click', exportStudyMaterial);
}

function studyHtmlToElements(html, docx) {
  const P = docx.Paragraph, TR = docx.TextRun, BS = docx.BorderStyle;
  const div = document.createElement('div');
  div.innerHTML = html;
  const els = [];

  // 解析内联元素
  function parseInline(el, size) {
    size = size || 21;
    const runs = [];
    el.childNodes.forEach(cn => {
      if (cn.nodeType === 3) {
        const t = cn.textContent;
        if (t.trim()) runs.push(new TR({ text: t, font: 'Microsoft YaHei', size: size }));
      } else if (cn.nodeType === 1) {
        const t = cn.textContent;
        if (!t.trim()) return;
        if (cn.tagName === 'STRONG' || cn.tagName === 'B')
          runs.push(new TR({ text: t, bold: true, font: 'Microsoft YaHei', size: size }));
        else if (cn.tagName === 'CODE')
          runs.push(new TR({ text: t, font: 'Consolas', size: size - 1, shading: { fill: 'F0F0F0' } }));
        else if (cn.tagName === 'SUB')
          runs.push(new TR({ text: t, subScript: true, font: 'Microsoft YaHei', size: size - 2 }));
        else if (cn.tagName === 'SUP')
          runs.push(new TR({ text: t, superScript: true, font: 'Microsoft YaHei', size: size - 2 }));
        else
          runs.push(new TR({ text: t, font: 'Microsoft YaHei', size: size }));
      }
    });
    return runs;
  }

  // 代码块：每行一个段落
  function buildCodeBlock(text) {
    const lines = text.split('\n');
    lines.forEach(line => {
      els.push(new P({
        spacing: { before: 0, after: 0 },
        shading: { fill: 'F5F5F0' },
        indent: { left: 240, right: 240 },
        border: { left: { style: BS.SINGLE, size: 4, color: 'AAAAAA' } },
        children: [new TR({ text: line || ' ', font: 'Consolas', size: 19, color: '333333' })]
      }));
    });
  }

  // 处理节点
  function processNode(node) {
    if (node.nodeType === 3) {
      const t = node.textContent.trim();
      if (t) els.push(new P({ spacing: { after: 80 }, children: [new TR({ text: t, font: 'Microsoft YaHei', size: 21 })] }));
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.tagName;

    // 段落
    if (tag === 'P') {
      const runs = parseInline(node, 21);
      if (runs.length) els.push(new P({ spacing: { after: 100 }, children: runs }));
    }
    // 代码块
    else if (tag === 'PRE') {
      els.push(new P({ spacing: { before: 80, after: 0 }, children: [] }));
      buildCodeBlock(node.textContent.trim());
      els.push(new P({ spacing: { before: 0, after: 80 }, children: [] }));
    }
    // div代码块
    else if (tag === 'DIV' && node.classList && node.classList.contains('code-block')) {
      els.push(new P({ spacing: { before: 80, after: 0 }, children: [] }));
      buildCodeBlock(node.textContent.trim());
      els.push(new P({ spacing: { before: 0, after: 80 }, children: [] }));
    }
    // 无序列表
    else if (tag === 'UL') {
      node.querySelectorAll(':scope > li').forEach(li => {
        const runs = parseInline(li, 21);
        els.push(new P({
          spacing: { after: 50 },
          indent: { left: 400, hanging: 200 },
          children: [new TR({ text: '•  ', font: 'Microsoft YaHei', size: 21 })].concat(runs)
        }));
      });
    }
    // 有序列表
    else if (tag === 'OL') {
      node.querySelectorAll(':scope > li').forEach((li, i) => {
        const runs = parseInline(li, 21);
        els.push(new P({
          spacing: { after: 50 },
          indent: { left: 400, hanging: 240 },
          children: [new TR({ text: (i + 1) + '. ', font: 'Microsoft YaHei', size: 21, bold: true })].concat(runs)
        }));
      });
    }
    // 表格
    else if (tag === 'TABLE') {
      const rows = [];
      node.querySelectorAll('tr').forEach(tr => {
        const cells = [];
        tr.querySelectorAll('th, td').forEach(cell => {
          const isH = cell.tagName === 'TH';
          const runs = parseInline(cell, 20);
          if (runs.length === 0) runs.push(new TR({ text: ' ', font: 'Microsoft YaHei', size: 20 }));
          cells.push(new docx.TableCell({
            children: [new P({ spacing: { before: 30, after: 30 }, children: runs })],
            shading: isH ? { fill: 'EAEAEA' } : undefined,
            borders: {
              top: { style: BS.SINGLE, size: 1, color: 'BBBBBB' },
              bottom: { style: BS.SINGLE, size: 1, color: 'BBBBBB' },
              left: { style: BS.SINGLE, size: 1, color: 'BBBBBB' },
              right: { style: BS.SINGLE, size: 1, color: 'BBBBBB' }
            }
          }));
        });
        rows.push(new docx.TableRow({ children: cells }));
      });
      if (rows.length) {
        els.push(new P({ spacing: { before: 80, after: 0 }, children: [] }));
        els.push(new docx.Table({ rows, width: { size: 100, type: 'pct' } }));
        els.push(new P({ spacing: { before: 0, after: 80 }, children: [] }));
      }
    }
    // h4标题
    else if (tag === 'H4') {
      els.push(new P({
        spacing: { before: 160, after: 80 },
        children: [new TR({ text: node.textContent, bold: true, font: 'Microsoft YaHei', size: 22, color: '333333' })]
      }));
    }
    // div（callout等，可能包含块级元素）
    else if (tag === 'DIV') {
      const hasBlock = node.querySelector('p,ul,ol,pre,table,h4,div.code-block');
      if (hasBlock) {
        node.childNodes.forEach(processNode);
      } else {
        const runs = parseInline(node, 21);
        if (runs.length) {
          els.push(new P({
            spacing: { before: 60, after: 60 },
            shading: { fill: 'F5F5F0' },
            indent: { left: 200 },
            border: { left: { style: BS.SINGLE, size: 4, color: '999999' } },
            children: runs
          }));
        }
      }
    }
    // 其他
    else {
      const runs = parseInline(node, 21);
      if (runs.length) els.push(new P({ spacing: { after: 80 }, children: runs }));
    }
  }

  div.childNodes.forEach(processNode);
  return els;
}

async function exportStudyMaterial() {
  const btn = document.getElementById('exportBtn');
  if (btn) { btn.disabled = true; btn.textContent = '生成中...'; }

  try {
    if (!window.docx) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.min.js';
        s.onload = resolve;
        s.onerror = () => reject(new Error('加载docx库失败'));
        document.head.appendChild(s);
      });
    }

    const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = docx;
    const children = [];

    // 封面
    children.push(new Paragraph({ spacing: { before: 2000 }, children: [] }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 200 },
      children: [new TextRun({ text: '编译原理', bold: true, size: 52, font: 'Microsoft YaHei', color: '1A1A1A' })]
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 100 },
      children: [new TextRun({ text: '知识库复习资料', size: 24, font: 'Microsoft YaHei', color: '888888' })]
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 600 },
      children: [new TextRun({ text: '共 17 章', size: 20, font: 'Consolas', color: 'AAAAAA' })]
    }));
    children.push(new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: 'D0D0D0' } },
      spacing: { after: 400 }, children: []
    }));

    // 逐章导出
    allContent.forEach((ch, i) => {
      // 章标题
      children.push(new Paragraph({
        spacing: { before: 400, after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E0E0E0' } },
        children: [new TextRun({ text: '第' + ch.num + '章：' + ch.title, bold: true, size: 28, font: 'Microsoft YaHei', color: '222222' })]
      }));

      // 各节内容
      ch.sections.forEach(sec => {
        if (sec.heading) {
          children.push(new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [new TextRun({ text: sec.heading, bold: true, size: 23, font: 'Microsoft YaHei', color: '333333' })]
          }));
        }
        const els = studyHtmlToElements(sec.html, docx);
        Array.prototype.push.apply(children, els);
      });

      // 章分隔线
      children.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D0D0D0' } },
        spacing: { after: 300 }, children: []
      }));
    });

    const doc = new Document({
      styles: { default: { document: { run: { font: 'Microsoft YaHei', size: 21 } } } },
      sections: [{ children }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '编译原理知识库.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('导出失败:', e);
    alert('导出失败: ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '导出资料'; }
  }
}

// ============================================================
// 17. 工具函数
// ============================================================
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
