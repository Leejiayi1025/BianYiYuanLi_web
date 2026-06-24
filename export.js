/**
 * Exam export module - 高质量Word导出
 * Dependencies: docx.js (CDN), FileSaver.js
 */

function loadScript(src) {
  return new Promise(function(resolve, reject) {
    if (src.indexOf("docx") >= 0 && window.docx) { resolve(window.docx); return; }
    if (src.indexOf("FileSaver") >= 0 && window.saveAs) { resolve(); return; }
    var s = document.createElement("script");
    s.src = src;
    s.onload = function() { resolve(src.indexOf("docx") >= 0 ? window.docx : undefined); };
    s.onerror = function() { reject(new Error("Load failed: " + src)); };
    document.head.appendChild(s);
  });
}

async function loadExportLibs() {
  var r = await Promise.all([
    loadScript("https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.min.js"),
    loadScript("https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js")
  ]);
  return r[0];
}

function downloadBlob(blob, filename) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ===== 解析内联元素 =====
function parseInline(el, docx, size) {
  size = size || 21;
  var TR = docx.TextRun;
  var runs = [];
  el.childNodes.forEach(function(node) {
    if (node.nodeType === 3) {
      var t = node.textContent;
      if (t.trim()) runs.push(new TR({ text: t, font: "Microsoft YaHei", size: size }));
    } else if (node.nodeType === 1) {
      var t = node.textContent;
      if (!t.trim()) return;
      var tag = node.tagName;
      if (tag === "STRONG" || tag === "B")
        runs.push(new TR({ text: t, bold: true, font: "Microsoft YaHei", size: size }));
      else if (tag === "CODE")
        runs.push(new TR({ text: t, font: "Consolas", size: size - 1, shading: { fill: "F0F0F0" } }));
      else if (tag === "SUB")
        runs.push(new TR({ text: t, subScript: true, font: "Microsoft YaHei", size: size - 2 }));
      else if (tag === "SUP")
        runs.push(new TR({ text: t, superScript: true, font: "Microsoft YaHei", size: size - 2 }));
      else if (tag === "BR") { /* skip */ }
      else
        runs.push(new TR({ text: t, font: "Microsoft YaHei", size: size }));
    }
  });
  return runs;
}

// ===== HTML表格 → Word表格 =====
function buildTable(tableEl, docx) {
  var Table = docx.Table, TableRow = docx.TableRow, TableCell = docx.TableCell;
  var P = docx.Paragraph, TR = docx.TextRun, BW = docx.BorderStyle;
  var rows = [];

  // 支持 thead/tbody 结构
  var trEls = tableEl.querySelectorAll("tr");
  trEls.forEach(function(tr) {
    var cells = [];
    var cellEls = tr.querySelectorAll("th, td");
    cellEls.forEach(function(cell) {
      var isH = cell.tagName === "TH";
      var runs = parseInline(cell, docx, 20);
      if (runs.length === 0) runs.push(new TR({ text: " ", font: "Microsoft YaHei", size: 20 }));
      cells.push(new TableCell({
        children: [new P({ spacing: { before: 30, after: 30 }, children: runs })],
        shading: isH ? { fill: "EAEAEA" } : undefined,
        borders: {
          top: { style: BW.SINGLE, size: 1, color: "BBBBBB" },
          bottom: { style: BW.SINGLE, size: 1, color: "BBBBBB" },
          left: { style: BW.SINGLE, size: 1, color: "BBBBBB" },
          right: { style: BW.SINGLE, size: 1, color: "BBBBBB" }
        }
      }));
    });
    rows.push(new TableRow({ children: cells }));
  });

  if (rows.length === 0) return null;
  return new Table({
    rows: rows,
    width: { size: 100, type: "pct" },
    borders: {
      top: { style: BW.SINGLE, size: 1, color: "BBBBBB" },
      bottom: { style: BW.SINGLE, size: 1, color: "BBBBBB" },
      left: { style: BW.SINGLE, size: 1, color: "BBBBBB" },
      right: { style: BW.SINGLE, size: 1, color: "BBBBBB" }
    }
  });
}

// ===== 代码块 =====
function buildCodeBlock(text, docx) {
  var P = docx.Paragraph, TR = docx.TextRun, BS = docx.BorderStyle;
  var lines = text.split("\n");
  // 每行一个段落，统一灰色背景
  var paragraphs = [];
  lines.forEach(function(line) {
    paragraphs.push(new P({
      spacing: { before: 0, after: 0 },
      shading: { fill: "F5F5F0" },
      indent: { left: 240, right: 240 },
      border: { left: { style: BS.SINGLE, size: 4, color: "AAAAAA" } },
      children: [new TR({ text: line || " ", font: "Consolas", size: 19, color: "333333" })]
    }));
  });
  return paragraphs;
}

// ===== HTML → Word元素（核心） =====
function htmlToElements(html, docx) {
  var P = docx.Paragraph, TR = docx.TextRun, BS = docx.BorderStyle;
  var div = document.createElement("div");
  div.innerHTML = html;
  var els = [];

  function processNode(node) {
    if (node.nodeType === 3) {
      var t = node.textContent.trim();
      if (t) els.push(new P({ spacing: { after: 80 }, children: [new TR({ text: t, font: "Microsoft YaHei", size: 21 })] }));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.tagName;

    // 段落
    if (tag === "P") {
      var runs = parseInline(node, docx, 21);
      if (runs.length) els.push(new P({ spacing: { after: 100 }, children: runs }));
    }
    // 代码块
    else if (tag === "PRE") {
      var codeParas = buildCodeBlock(node.textContent.trim(), docx);
      els.push(new P({ spacing: { before: 80, after: 0 }, children: [] })); // 间距
      Array.prototype.push.apply(els, codeParas);
      els.push(new P({ spacing: { before: 0, after: 80 }, children: [] })); // 间距
    }
    // div代码块
    else if (tag === "DIV" && node.classList && node.classList.contains("code-block")) {
      var codeParas = buildCodeBlock(node.textContent.trim(), docx);
      els.push(new P({ spacing: { before: 80, after: 0 }, children: [] }));
      Array.prototype.push.apply(els, codeParas);
      els.push(new P({ spacing: { before: 0, after: 80 }, children: [] }));
    }
    // 无序列表
    else if (tag === "UL") {
      node.querySelectorAll(":scope > li").forEach(function(li) {
        var runs = parseInline(li, docx, 21);
        els.push(new P({
          spacing: { after: 50 },
          indent: { left: 400, hanging: 200 },
          children: [new TR({ text: "•  ", font: "Microsoft YaHei", size: 21 })].concat(runs)
        }));
      });
    }
    // 有序列表
    else if (tag === "OL") {
      node.querySelectorAll(":scope > li").forEach(function(li, i) {
        var runs = parseInline(li, docx, 21);
        els.push(new P({
          spacing: { after: 50 },
          indent: { left: 400, hanging: 240 },
          children: [new TR({ text: (i + 1) + ". ", font: "Microsoft YaHei", size: 21, bold: true })].concat(runs)
        }));
      });
    }
    // 表格
    else if (tag === "TABLE") {
      var tbl = buildTable(node, docx);
      if (tbl) {
        els.push(new P({ spacing: { before: 80, after: 0 }, children: [] }));
        els.push(tbl);
        els.push(new P({ spacing: { before: 0, after: 80 }, children: [] }));
      }
    }
    // h4
    else if (tag === "H4") {
      els.push(new P({
        spacing: { before: 160, after: 80 },
        children: [new TR({ text: node.textContent, bold: true, font: "Microsoft YaHei", size: 22, color: "333333" })]
      }));
    }
    // div (callout等)
    else if (tag === "DIV") {
      // 检查是否包含块级元素
      var hasBlock = node.querySelector("p,ul,ol,pre,table,h4");
      if (hasBlock) {
        // 递归处理子节点
        node.childNodes.forEach(processNode);
      } else {
        var runs = parseInline(node, docx, 21);
        if (runs.length) {
          els.push(new P({
            spacing: { before: 60, after: 60 },
            shading: { fill: "F5F5F0" },
            indent: { left: 200 },
            border: { left: { style: BS.SINGLE, size: 4, color: "999999" } },
            children: runs
          }));
        }
      }
    }
    // 其他块元素
    else {
      var runs = parseInline(node, docx, 21);
      if (runs.length) els.push(new P({ spacing: { after: 80 }, children: runs }));
    }
  }

  div.childNodes.forEach(processNode);
  return els;
}

// ===== SVG转PNG =====
function svgToPngBase64(svgElement, width, height) {
  return new Promise(function(resolve, reject) {
    var canvas = document.createElement("canvas");
    var scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    var ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    var svgData = new XMLSerializer().serializeToString(svgElement);
    var img = new Image();
    img.onload = function() {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = function() { reject(new Error("SVG转PNG失败")); };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  });
}

// ===== 辅助函数 =====
function makeDivider(docx, thickness) {
  return new docx.Paragraph({
    border: { bottom: { style: docx.BorderStyle.SINGLE, size: thickness || 4, color: "D0D0D0" } },
    spacing: { after: 200 },
    children: []
  });
}

function makeSectionTitle(text, docx) {
  return new docx.Paragraph({
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: docx.BorderStyle.SINGLE, size: 2, color: "E0E0E0" } },
    children: [new docx.TextRun({ text: text, bold: true, font: "Microsoft YaHei", size: 24, color: "222222" })]
  });
}

function makeCover(title, subtitle, docx) {
  var P = docx.Paragraph, TR = docx.TextRun, AT = docx.AlignmentType;
  return [
    new P({ spacing: { before: 2000 }, children: [] }),
    new P({ alignment: AT.CENTER, spacing: { after: 200 }, children: [
      new TR({ text: title, bold: true, size: 52, font: "Microsoft YaHei", color: "1A1A1A" })
    ]}),
    new P({ alignment: AT.CENTER, spacing: { after: 100 }, children: [
      new TR({ text: subtitle, size: 24, font: "Microsoft YaHei", color: "888888" })
    ]}),
    new P({ alignment: AT.CENTER, spacing: { after: 600 }, children: [
      new TR({ text: "Compiler Principles", size: 20, font: "Consolas", color: "AAAAAA" })
    ]}),
    makeDivider(docx, 8)
  ];
}

// ============================================================
// 导出仅题目
// ============================================================
async function exportQuestionsOnly() {
  var btn = document.getElementById("exportQuestionsBtn");
  if (btn) { btn.disabled = true; btn.textContent = "生成中..."; }
  try {
    var docx = await loadExportLibs();
    var D = docx.Document, Pk = docx.Packer, P = docx.Paragraph, TR = docx.TextRun, AT = docx.AlignmentType;
    var ch = [];

    // 封面
    ch = ch.concat(makeCover("编译原理题库", "共 " + EXAM_QUESTIONS.length + " 道大题", docx));

    // 目录
    ch.push(new P({ spacing: { before: 200, after: 150 }, children: [
      new TR({ text: "目  录", bold: true, size: 28, font: "Microsoft YaHei", color: "333333" })
    ]}));
    EXAM_QUESTIONS.forEach(function(q, i) {
      ch.push(new P({ spacing: { after: 60 }, indent: { left: 100 }, children: [
        new TR({ text: "第" + (i + 1) + "题  ", font: "Microsoft YaHei", size: 21, color: "666666" }),
        new TR({ text: q.title, font: "Microsoft YaHei", size: 21 })
      ]}));
    });
    ch.push(makeDivider(docx, 6));

    // 各题
    for (var i = 0; i < EXAM_QUESTIONS.length; i++) {
      var q = EXAM_QUESTIONS[i];
      ch.push(new P({ spacing: { before: 360, after: 80 }, children: [
        new TR({ text: "第" + (i + 1) + "题：", bold: true, font: "Microsoft YaHei", size: 28, color: "1A1A1A" }),
        new TR({ text: q.title, bold: true, font: "Microsoft YaHei", size: 26, color: "333333" })
      ]}));
      if (q.tags && q.tags.length) {
        ch.push(new P({ spacing: { after: 120 }, children: [
          new TR({ text: q.tags.join("  /  "), size: 19, font: "Microsoft YaHei", color: "999999" })
        ]}));
      }
      ch.push(new P({ spacing: { after: 60 }, children: [
        new TR({ text: "【题目】", bold: true, size: 22, font: "Microsoft YaHei", color: "333333" })
      ]}));
      Array.prototype.push.apply(ch, htmlToElements(q.question, docx));
      ch.push(makeDivider(docx, 2));
    }

    var doc = new D({ styles: { default: { document: { run: { font: "Microsoft YaHei", size: 21 } } } }, sections: [{ children: ch }] });
    downloadBlob(await Pk.toBlob(doc), "编译原理题库（仅题目）.docx");
  } catch(e) { console.error(e); alert("导出失败: " + e.message); }
  finally { if (btn) { btn.disabled = false; btn.textContent = "导出题目"; } }
}

// ============================================================
// 导出题目+解析
// ============================================================
async function exportQuestionsAndAnswers() {
  var btn = document.getElementById("exportAllBtn");
  if (btn) { btn.disabled = true; btn.textContent = "生成中..."; }
  try {
    var docx = await loadExportLibs();
    var D = docx.Document, Pk = docx.Packer, P = docx.Paragraph, TR = docx.TextRun, IR = docx.ImageRun, AT = docx.AlignmentType, BS = docx.BorderStyle;
    var ch = [];

    // 封面
    ch = ch.concat(makeCover("编译原理题库", "题目 + 知识点 + 解析 + 解答", docx));

    // 各题
    for (var i = 0; i < EXAM_QUESTIONS.length; i++) {
      var q = EXAM_QUESTIONS[i];

      // 题号标题
      ch.push(new P({ spacing: { before: 400, after: 80 }, children: [
        new TR({ text: "第" + (i + 1) + "题：", bold: true, font: "Microsoft YaHei", size: 30, color: "1A1A1A" }),
        new TR({ text: q.title, bold: true, font: "Microsoft YaHei", size: 28, color: "333333" })
      ]}));

      // 标签
      if (q.tags && q.tags.length) {
        ch.push(new P({ spacing: { after: 150 }, children: [
          new TR({ text: q.tags.join("  /  "), size: 19, font: "Microsoft YaHei", color: "999999" })
        ]}));
      }

      // 题目
      ch.push(makeSectionTitle("题目", docx));
      Array.prototype.push.apply(ch, htmlToElements(q.question, docx));

      // 知识点
      ch.push(makeSectionTitle("考察知识点", docx));
      Array.prototype.push.apply(ch, htmlToElements(q.knowledge, docx));

      // 解析
      ch.push(makeSectionTitle("解析", docx));
      Array.prototype.push.apply(ch, htmlToElements(q.analysis, docx));

      // 解答步骤
      ch.push(makeSectionTitle("解答步骤", docx));
      Array.prototype.push.apply(ch, htmlToElements(q.steps, docx));

      // 图表
      if (q.diagram && typeof createDiagramElement === "function") {
        try {
          var svgEl = createDiagramElement(q.diagram);
          if (svgEl) {
            var w = parseInt(svgEl.getAttribute("width")) || 500;
            var h = parseInt(svgEl.getAttribute("height")) || 300;
            var pngData = await svgToPngBase64(svgEl, w, h);
            var base64 = pngData.split(",")[1];
            ch.push(new P({ spacing: { before: 150 }, alignment: AT.CENTER, children: [] }));
            ch.push(new P({ alignment: AT.CENTER, children: [
              new IR({ data: base64, transformation: { width: Math.min(w, 480), height: Math.min(h, 320) }, type: "png" })
            ]}));
            ch.push(new P({ spacing: { after: 150 }, alignment: AT.CENTER, children: [
              new TR({ text: "图：" + q.title, size: 18, font: "Microsoft YaHei", color: "999999", italics: true })
            ]}));
          }
        } catch(e) { console.warn("图表导出跳过:", q.title, e); }
      }

      ch.push(makeDivider(docx, 6));
    }

    var doc = new D({ styles: { default: { document: { run: { font: "Microsoft YaHei", size: 21 } } } }, sections: [{ children: ch }] });
    downloadBlob(await Pk.toBlob(doc), "编译原理题库（含解析）.docx");
  } catch(e) { console.error(e); alert("导出失败: " + e.message); }
  finally { if (btn) { btn.disabled = false; btn.textContent = "导出全部"; } }
}
