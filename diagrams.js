/**
 * diagrams.js - SVG图表渲染模块
 * 支持：DFA状态图、语法树、控制流图
 * 纯SVG生成，无外部依赖
 */

/* ===== 颜色常量（Monochrome风格，适配亮暗主题） ===== */
function getDiagramColors() {
  var theme = document.documentElement.getAttribute('data-theme') || 'light';
  if (theme === 'dark') {
    return {
      black: '#E0E0E0',
      white: '#2A2A2A',
      gray: '#888888',
      lightGray: '#555555',
      bg: 'transparent',
      stroke: '#E0E0E0',
      fill: '#2A2A2A',
      text: '#E0E0E0'
    };
  }
  return {
    black: '#1A1A1A',
    white: '#FAFAFA',
    gray: '#7A7A7A',
    lightGray: '#C8C8C8',
    bg: 'transparent',
    stroke: '#1A1A1A',
    fill: '#FAFAFA',
    text: '#1A1A1A'
  };
}

var DIAGRAM_COLORS = getDiagramColors();

/* ===== 通用SVG工具函数 ===== */

/**
 * 转义HTML特殊字符
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 创建SVG defs（箭头标记等）
 */
function createSvgDefs() {
  return `
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7"
            refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
      <polygon points="0 0, 10 3.5, 0 7" fill="${DIAGRAM_COLORS.stroke}" />
    </marker>
    <marker id="arrowhead-sm" markerWidth="8" markerHeight="6"
            refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <polygon points="0 0, 8 3, 0 6" fill="${DIAGRAM_COLORS.stroke}" />
    </marker>
  </defs>`;
}

/**
 * 包装SVG内容为完整SVG字符串
 */
function wrapSvg(content, width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:${DIAGRAM_COLORS.bg};font-family:'Inter','Helvetica Neue',sans-serif;">
${createSvgDefs()}
${content}
</svg>`;
}

/**
 * 创建SVG元素（用于DOM操作）
 */
function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  return el;
}


/* ============================================================
 * 1. DFA状态图渲染
 * ============================================================ */

/**
 * 渲染DFA状态图
 * @param {Object} data - DFA数据
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @returns {string} SVG字符串
 */
function renderDfaDiagram(data, width, height) {
  const { states, transitions } = data;
  const stateMap = new Map(states.map(s => [s.id, s]));
  const parts = [];

  // 自动计算画布大小
  var maxX = 0, maxY = 0;
  states.forEach(s => {
    maxX = Math.max(maxX, s.x + 80);
    maxY = Math.max(maxY, s.y + 80);
  });
  width = Math.max(width, maxX + 40);
  height = Math.max(height, maxY + 40);

  // 计算每个状态的入射/出射转移数量，用于标签偏移
  const transitionCounts = {};
  transitions.forEach(t => {
    const key = `${t.from}-${t.to}`;
    transitionCounts[key] = (transitionCounts[key] || 0) + 1;
  });

  // 绘制转移箭头（先画箭头，再画状态，保证状态在上层）
  transitions.forEach(t => {
    const from = stateMap.get(t.from);
    const to = stateMap.get(t.to);
    if (!from || !to) return;

    if (t.from === t.to) {
      // 自环
      parts.push(renderSelfLoop(from, t.label));
    } else {
      // 普通转移
      parts.push(renderTransition(from, to, t.label, stateMap));
    }
  });

  // 绘制状态节点
  states.forEach(s => {
    parts.push(renderDfaState(s));
  });

  return wrapSvg(parts.join('\n'), width, height);
}

/**
 * 渲染单个DFA状态节点
 */
function renderDfaState(state) {
  const { id, x, y, isStart, isFinal } = state;
  const r = 25;
  const parts = [];

  if (isFinal) {
    parts.push(`  <circle cx="${x}" cy="${y}" r="30" fill="none" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="1.5" />`);
  }

  parts.push(`  <circle cx="${x}" cy="${y}" r="${r}" fill="${DIAGRAM_COLORS.fill}" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="1.5" />`);
  parts.push(`  <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="${DIAGRAM_COLORS.text}">${escapeHtml(String(id))}</text>`);

  if (isStart) {
    const arrowLen = 35;
    parts.push(`  <line x1="${x - r - arrowLen}" y1="${y}" x2="${x - r - 3}" y2="${y}" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="2" marker-end="url(#arrowhead)" />`);
  }

  return parts.join('\n');
}

/**
 * 渲染普通转移箭头
 */
function renderTransition(from, to, label, stateMap) {
  const r = 25;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 计算起止点（圆边缘）
  const ux = dx / dist;
  const uy = dy / dist;
  const x1 = from.x + ux * (r + 2);
  const y1 = from.y + uy * (r + 2);
  const x2 = to.x - ux * (r + 5);
  const y2 = to.y - uy * (r + 5);

  // 检查是否有反向边，有则使用曲线
  const reverseKey = `${to.id}-${from.id}`;
  const hasReverse = stateMap.has(to.id) && stateMap.has(from.id);

  // 计算中点和法线方向（用于曲线偏移）
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const nx = -uy; // 法线x
  const ny = ux;  // 法线y

  // 曲线控制点偏移
  const curveOffset = 25;

  // 使用二次贝塞尔曲线
  const cx = midX + nx * curveOffset;
  const cy = midY + ny * curveOffset;

  // 标签位置（曲线中点上方）
  const labelX = (x1 + 2 * cx + x2) / 4;
  const labelY = (y1 + 2 * cy + y2) / 4 - 8;

  const parts = [];
  parts.push(`  <path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" fill="none" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="1.5" marker-end="url(#arrowhead)" />`);

  if (label) {
    parts.push(`  <text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="13" fill="${DIAGRAM_COLORS.text}" font-weight="500">${escapeHtml(label)}</text>`);
  }

  return parts.join('\n');
}

/**
 * 渲染自环
 */
function renderSelfLoop(state, label) {
  const { x, y } = state;
  const r = 25;
  const loopR = 18; // 自环半径
  const loopY = y - r - loopR; // 自环中心在状态上方

  const parts = [];
  // 使用弧线画自环
  const startX = x - loopR * 0.7;
  const startY = y - r + 2;
  const endX = x + loopR * 0.7;
  const endY = y - r + 2;

  // 两个控制点形成环形
  const cp1x = x - loopR * 1.5;
  const cp1y = loopY - loopR;
  const cp2x = x + loopR * 1.5;
  const cp2y = loopY - loopR;

  parts.push(`  <path d="M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}" fill="none" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="1.5" marker-end="url(#arrowhead)" />`);

  if (label) {
    parts.push(`  <text x="${x}" y="${loopY - loopR - 5}" text-anchor="middle" font-size="13" fill="${DIAGRAM_COLORS.text}" font-weight="500">${escapeHtml(label)}</text>`);
  }

  return parts.join('\n');
}


/* ============================================================
 * 2. 语法树渲染
 * ============================================================ */

/**
 * 渲染语法树
 * @param {Object} data - 树数据
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @returns {string} SVG字符串
 */
function renderTreeDiagram(data, width, height) {
  const { root } = data;

  // 第一遍：计算布局
  const layout = computeTreeLayout(root, width, height);

  // 使用自动计算的画布大小
  width = Math.max(width, layout.width + 20);
  height = Math.max(height, layout.height + 20);

  // 第二遍：渲染
  const parts = [];

  // 先画连线
  layout.edges.forEach(e => {
    parts.push(`  <line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="1" />`);
  });

  // 再画节点
  layout.nodes.forEach(n => {
    parts.push(renderTreeNode(n));
  });

  return wrapSvg(parts.join('\n'), width, height);
}

/**
 * 计算树布局
 * 使用简单的递归算法：每个节点占据一定宽度，子节点平分父节点宽度
 */
function computeTreeLayout(root, canvasWidth, canvasHeight) {
  const nodes = [];
  const edges = [];

  const levelHeight = 70; // 层间距
  const nodeMinWidth = 50; // 节点最小宽度
  const nodePadding = 20; // 节点间距

  // 第一步：计算每个子树的宽度
  function calcSubtreeWidth(node) {
    if (!node.children || node.children.length === 0) {
      node._width = nodeMinWidth + nodePadding;
      return node._width;
    }
    let total = 0;
    node.children.forEach(child => {
      total += calcSubtreeWidth(child);
    });
    node._width = Math.max(total, nodeMinWidth + nodePadding);
    return node._width;
  }

  calcSubtreeWidth(root);

  // 第二步：分配坐标
  function assignPositions(node, x, y, availableWidth) {
    const label = node.label || '';
    const textWidth = label.length * 10 + 24;
    const nodeWidth = Math.max(textWidth, 40);
    const nodeHeight = 30;

    // 节点居中于可用宽度
    const nodeX = x + availableWidth / 2;
    const nodeY = y;

    nodes.push({
      x: nodeX,
      y: nodeY,
      width: nodeWidth,
      height: nodeHeight,
      label: label,
      isLeaf: node.isLeaf || !node.children || node.children.length === 0
    });

    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      const childY = y + levelHeight;
      let childX = x;

      node.children.forEach(child => {
        const childWidth = child._width;
        assignPositions(child, childX, childY, childWidth);

        // 记录连线
        const childCenterX = childX + childWidth / 2;
        edges.push({
          x1: nodeX,
          y1: nodeY + nodeHeight / 2,
          x2: childCenterX,
          y2: childY - nodeHeight / 2
        });

        childX += childWidth;
      });
    }
  }

  // 从左侧开始布局，留出边距
  const marginLeft = 30;
  const marginTop = 40;
  assignPositions(root, marginLeft, marginTop, root._width);

  // 计算实际需要的画布大小
  let maxX = 0, maxY = 0;
  nodes.forEach(n => {
    maxX = Math.max(maxX, n.x + n.width / 2 + 30);
    maxY = Math.max(maxY, n.y + n.height / 2 + 30);
  });

  return { nodes, edges, width: maxX, height: maxY };
}

/**
 * 渲染单个树节点
 */
function renderTreeNode(node) {
  const { x, y, width, height, label, isLeaf } = node;
  const halfW = width / 2;
  const halfH = height / 2;

  const parts = [];

  if (isLeaf) {
    parts.push(`  <rect x="${x - halfW}" y="${y - halfH}" width="${width}" height="${height}" rx="12" ry="12" fill="${DIAGRAM_COLORS.lightGray}" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="1.5" />`);
  } else {
    parts.push(`  <rect x="${x - halfW}" y="${y - halfH}" width="${width}" height="${height}" rx="3" ry="3" fill="${DIAGRAM_COLORS.fill}" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="1.5" />`);
  }

  parts.push(`  <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="${DIAGRAM_COLORS.text}">${escapeHtml(label)}</text>`);

  return parts.join('\n');
}


/* ============================================================
 * 3. 控制流图（CFG）渲染
 * ============================================================ */

/**
 * 渲染控制流图
 * @param {Object} data - CFG数据
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @returns {string} SVG字符串
 */
function renderCfgDiagram(data, width, height) {
  const { blocks, edges } = data;
  const blockMap = new Map(blocks.map(b => [b.id, b]));
  const parts = [];

  // 计算每个块的尺寸
  const blockSizes = new Map();
  blocks.forEach(b => {
    const lineCount = (b.lines || []).length;
    const maxLineLen = Math.max(
      (b.label || '').length,
      ...(b.lines || []).map(l => l.length)
    );
    const w = Math.max(140, maxLineLen * 10 + 40);
    const h = 38 + lineCount * 22;
    blockSizes.set(b.id, { w, h });
  });

  // 扩展画布：考虑回边需要右侧额外空间
  var maxX = 0, maxY = 0;
  var hasBackEdge = false;
  blocks.forEach(b => {
    var sz = blockSizes.get(b.id);
    maxX = Math.max(maxX, b.x + sz.w + 80);
    maxY = Math.max(maxY, b.y + sz.h + 80);
  });
  edges.forEach(e => {
    var from = blockMap.get(e.from), to = blockMap.get(e.to);
    if (from && to && to.y < from.y) hasBackEdge = true;
  });
  if (hasBackEdge) maxX += 120; // 回边需要右侧空间

  // 考虑横跨边（如B4→B6）
  edges.forEach(e => {
    var from = blockMap.get(e.from), to = blockMap.get(e.to);
    if (from && to) {
      var fromSz = blockSizes.get(e.from);
      var toRight = to.x + blockSizes.get(e.to).w;
      if (toRight + 80 > maxX) maxX = toRight + 80;
    }
  });

  width = Math.max(width, maxX);
  height = Math.max(height, maxY);

  // 绘制边（先画边，再画块）
  edges.forEach(e => {
    const from = blockMap.get(e.from);
    const to = blockMap.get(e.to);
    if (!from || !to) return;
    const fromSize = blockSizes.get(e.from);
    const toSize = blockSizes.get(e.to);
    parts.push(renderCfgEdge(from, to, fromSize, toSize, e.label));
  });

  // 入口块上方箭头
  if (blocks.length > 0) {
    const entry = blocks[0];
    const entrySize = blockSizes.get(entry.id);
    const arrowY = entry.y - 15;
    parts.push(`  <line x1="${entry.x + entrySize.w / 2}" y1="${arrowY - 25}" x2="${entry.x + entrySize.w / 2}" y2="${arrowY}" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="2" marker-end="url(#arrowhead)" />`);
  }

  // 绘制基本块
  blocks.forEach(b => {
    const size = blockSizes.get(b.id);
    parts.push(renderCfgBlock(b, size));
  });

  return wrapSvg(parts.join('\n'), width, height);
}

/**
 * 渲染单个基本块
 */
function renderCfgBlock(block, size) {
  const { x, y, label, lines } = block;
  const { w, h } = size;
  const parts = [];

  // 矩形框
  parts.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" ry="4" fill="${DIAGRAM_COLORS.fill}" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="1.5" />`);

  // 块名
  parts.push(`  <text x="${x + w / 2}" y="${y + 17}" text-anchor="middle" font-size="13" font-weight="700" fill="${DIAGRAM_COLORS.text}">${escapeHtml(label)}</text>`);
  parts.push(`  <line x1="${x + 6}" y1="${y + 25}" x2="${x + w - 6}" y2="${y + 25}" stroke="${DIAGRAM_COLORS.lightGray}" stroke-width="0.5" />`);

  // 代码行
  if (lines && lines.length > 0) {
    lines.forEach((line, i) => {
      parts.push(`  <text x="${x + 12}" y="${y + 42 + i * 22}" font-size="12" fill="${DIAGRAM_COLORS.text}" font-family="Consolas, monospace">${escapeHtml(line)}</text>`);
    });
  }

  return parts.join('\n');
}

/**
 * 渲染CFG边
 */
function renderCfgEdge(from, to, fromSize, toSize, label) {
  const parts = [];
  const sw = 1.5; // stroke width

  const fromCx = from.x + fromSize.w / 2;
  const fromBottom = { x: fromCx, y: from.y + fromSize.h };
  const toCx = to.x + toSize.w / 2;
  const toTop = { x: toCx, y: to.y };

  // 判断是否为回边（目标在源上方）
  const isBackEdge = to.y + toSize.h <= from.y;

  if (isBackEdge) {
    // 回边：曲线绕过右侧
    const offset = Math.max(fromSize.w, toSize.w) / 2 + 50;
    const cp1x = from.x + fromSize.w + offset;
    const cp1y = fromBottom.y + 30;
    const cp2x = to.x + toSize.w + offset;
    const cp2y = toTop.y - 30;

    parts.push(`  <path d="M${fromBottom.x},${fromBottom.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${toTop.x},${toTop.y}" fill="none" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="${sw}" marker-end="url(#arrowhead)" />`);

    if (label) {
      var lx = (cp1x + cp2x) / 2 + 8;
      var ly = (cp1y + cp2y) / 2 + 4;
      parts.push(`  <text x="${lx}" y="${ly}" font-size="12" font-weight="600" fill="${DIAGRAM_COLORS.text}">${escapeHtml(label)}</text>`);
    }
  } else {
    // 普通边
    var endY = toTop.y - 4;
    var dx = toTop.x - fromBottom.x;

    if (Math.abs(dx) > toSize.w * 0.6) {
      // 水平偏移大，用折线
      var midY = fromBottom.y + (endY - fromBottom.y) * 0.4;
      parts.push(`  <polyline points="${fromBottom.x},${fromBottom.y} ${fromBottom.x},${midY} ${toTop.x},${midY} ${toTop.x},${endY}" fill="none" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="${sw}" marker-end="url(#arrowhead)" />`);

      if (label) {
        var lx = (fromBottom.x + toTop.x) / 2 + 6;
        var ly = midY - 6;
        parts.push(`  <text x="${lx}" y="${ly}" font-size="12" font-weight="600" fill="${DIAGRAM_COLORS.text}">${escapeHtml(label)}</text>`);
      }
    } else {
      // 直线
      parts.push(`  <line x1="${fromBottom.x}" y1="${fromBottom.y}" x2="${toTop.x}" y2="${endY}" stroke="${DIAGRAM_COLORS.stroke}" stroke-width="${sw}" marker-end="url(#arrowhead)" />`);

      if (label) {
        var lx = (fromBottom.x + toTop.x) / 2 + 8;
        var ly = (fromBottom.y + endY) / 2;
        parts.push(`  <text x="${lx}" y="${ly}" font-size="12" font-weight="600" fill="${DIAGRAM_COLORS.text}">${escapeHtml(label)}</text>`);
      }
    }
  }

  return parts.join('\n');
}


/* ============================================================
 * 公共导出接口
 * ============================================================ */

/**
 * 渲染图表为SVG字符串
 * @param {Object} diagramData - 图表数据（需包含type字段）
 * @param {number} [width] - 画布宽度（可选，有默认值）
 * @param {number} [height] - 画布高度（可选，有默认值）
 * @returns {string} SVG字符串
 */
function renderDiagram(diagramData, width, height) {
  if (!diagramData || !diagramData.type) {
    return '<svg xmlns="http://www.w3.org/2000/svg"><text x="10" y="20" fill="red">错误：缺少图表类型</text></svg>';
  }

  const type = diagramData.type;

  // 默认尺寸
  const defaultSizes = {
    dfa: { w: 600, h: 300 },
    tree: { w: 700, h: 400 },
    cfg: { w: 600, h: 500 }
  };

  const defaults = defaultSizes[type] || { w: 500, h: 400 };
  const w = width || defaults.w;
  const h = height || defaults.h;

  switch (type) {
    case 'dfa':
      return renderDfaDiagram(diagramData, w, h);
    case 'tree':
      return renderTreeDiagram(diagramData, w, h);
    case 'cfg':
      return renderCfgDiagram(diagramData, w, h);
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><text x="10" y="20" fill="red">未知图表类型: ${escapeHtml(type)}</text></svg>`;
  }
}

/**
 * 渲染为可嵌入的SVG元素
 * @param {Object} diagramData - 图表数据
 * @returns {SVGElement} SVG DOM元素
 */
function createDiagramElement(diagramData) {
  // 刷新颜色以适配当前主题
  DIAGRAM_COLORS = getDiagramColors();
  const svgString = renderDiagram(diagramData);
  const container = document.createElement('div');
  container.innerHTML = svgString;
  return container.firstElementChild;
}

// ===== 自动初始化：查找页面中的 .diagram-container 并渲染 =====
function initDiagrams() {
  document.querySelectorAll('.diagram-container[data-diagram]').forEach(container => {
    try {
      const data = JSON.parse(container.getAttribute('data-diagram'));
      const width = parseInt(container.getAttribute('data-width')) || undefined;
      const height = parseInt(container.getAttribute('data-height')) || undefined;
      container.innerHTML = renderDiagram(data, width, height);
    } catch (e) {
      container.innerHTML = `<div style="color:red;padding:8px;">图表渲染错误: ${escapeHtml(e.message)}</div>`;
    }
  });
}

// 页面加载时自动初始化
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagrams);
  } else {
    initDiagrams();
  }
}
