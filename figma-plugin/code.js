// Tesla Cyberquad Configurator — Figma Plugin v4
// Fixed: spread operators, DROP_SHADOW format, gradient color objects

async function main() {
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Light" }),
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);

  const page = figma.currentPage;
  page.name = "Cyberquad Configurator";

  // ─── THEMES ───
  const DAY = {
    id: "day", label: "Day Mode",
    sceneBgR: 0.82, sceneBgG: 0.82, sceneBgB: 0.83,
    groundTopR: 0.72, groundTopG: 0.72, groundTopB: 0.73,
    groundBotR: 0.86, groundBotG: 0.86, groundBotB: 0.87,
    surface: { r: 1, g: 1, b: 1 }, surfaceOp: 0.88,
    border: { r: 0, g: 0, b: 0 }, borderOp: 0.08,
    cardBorder: { r: 0, g: 0, b: 0 }, cardBorderOp: 0.15,
    activeBorder: { r: 0.09, g: 0.10, b: 0.13 },
    text: { r: 0.09, g: 0.10, b: 0.13 },
    textMuted: { r: 0.36, g: 0.37, b: 0.38 },
    panelBg: { r: 0.95, g: 0.95, b: 0.96 },
    accent: { r: 0.24, g: 0.42, b: 0.88 },
    modalBg: { r: 1, g: 1, b: 1 },
    tabActiveBg: { r: 1, g: 1, b: 1 },
    tabRowBg: { r: 0, g: 0, b: 0 }, tabRowBgOp: 0.04,
    selectBtn: { r: 0.09, g: 0.10, b: 0.13 }, selectBtnText: { r: 1, g: 1, b: 1 },
    compareLink: { r: 0.09, g: 0.10, b: 0.13 },
    compareLinkBg: { r: 0, g: 0, b: 0 }, compareLinkBgOp: 0.02,
    viewActiveBgOp: 0.06,
    white: { r: 1, g: 1, b: 1 },
    closeBtnBg: { r: 0, g: 0, b: 0 }, closeBtnBgOp: 0.04,
  };

  const NIGHT = {
    id: "night", label: "Night Mode",
    sceneBgR: 0.04, sceneBgG: 0.04, sceneBgB: 0.10,
    groundTopR: 0.06, groundTopG: 0.06, groundTopB: 0.12,
    groundBotR: 0.10, groundBotG: 0.10, groundBotB: 0.18,
    surface: { r: 0.08, g: 0.06, b: 0.16 }, surfaceOp: 0.88,
    border: { r: 1, g: 1, b: 1 }, borderOp: 0.08,
    cardBorder: { r: 1, g: 1, b: 1 }, cardBorderOp: 0.12,
    activeBorder: { r: 0.94, g: 0.94, b: 0.94 },
    text: { r: 0.94, g: 0.94, b: 0.94 },
    textMuted: { r: 0.53, g: 0.53, b: 0.55 },
    panelBg: { r: 0.06, g: 0.05, b: 0.12 },
    accent: { r: 0.24, g: 0.42, b: 0.88 },
    modalBg: { r: 0.06, g: 0.05, b: 0.10 },
    tabActiveBg: { r: 0.14, g: 0.12, b: 0.24 },
    tabRowBg: { r: 1, g: 1, b: 1 }, tabRowBgOp: 0.06,
    selectBtn: { r: 0.94, g: 0.94, b: 0.94 }, selectBtnText: { r: 0.09, g: 0.10, b: 0.13 },
    compareLink: { r: 0.94, g: 0.94, b: 0.94 },
    compareLinkBg: { r: 1, g: 1, b: 1 }, compareLinkBgOp: 0.02,
    viewActiveBgOp: 0.08,
    white: { r: 1, g: 1, b: 1 },
    closeBtnBg: { r: 1, g: 1, b: 1 }, closeBtnBgOp: 0.06,
  };

  // ─── DATA ───
  const SWATCHES = [
    { name: "Raw Stainless",  r: 0.69, g: 0.69, b: 0.69 },
    { name: "Brushed Steel",  r: 0.63, g: 0.63, b: 0.63 },
    { name: "Dark Stainless", r: 0.35, g: 0.35, b: 0.37 },
    { name: "Mars Red",       r: 0.55, g: 0.10, b: 0.10 },
    { name: "Cyber Orange",   r: 0.83, g: 0.40, b: 0.16 },
    { name: "Ultra Blue",     r: 0.12, g: 0.23, b: 0.37 },
  ];

  const PRESETS = [
    { id: "sport",   name: "Sport",   desc: "Performance riding & trail racing",  price: 12090,
      specs: { range: "45 mi", topSpeed: "65 mph", accel: "3.2 sec", payload: "—", ground: "8\"" },
      equip: { suspension: "Performance", wheels: "Performance 19\"", cargo: "None", rack: "Sport Rack", protection: "Skid Plates", color: "Mars Red" } },
    { id: "farm",    name: "Farm",    desc: "Built for rugged agricultural work",  price: 11990,
      specs: { range: "38 mi", topSpeed: "45 mph", accel: "4.8 sec", payload: "110 lbs", ground: "14\"" },
      equip: { suspension: "Off-Road", wheels: "Off-Road 22\"", cargo: "Extended Cargo", rack: "Utility Rack", protection: "Full Guard", color: "Raw Stainless" } },
    { id: "hunting", name: "Hunting", desc: "Silent & stealthy for the outdoors", price: 12790,
      specs: { range: "40 mi", topSpeed: "50 mph", accel: "4.2 sec", payload: "85 lbs", ground: "14\"" },
      equip: { suspension: "Off-Road", wheels: "Off-Road 22\"", cargo: "Rear Storage", rack: "Utility Rack", protection: "Full Guard", color: "Dark Stainless" } },
  ];

  const SECTIONS = [
    { name: "Wheels", options: [
      { name: "Standard 20\"",    desc: "All-terrain balanced",   price: 0,    active: true },
      { name: "Off-Road 22\"",    desc: "Maximum traction",       price: 1500 },
      { name: "Performance 19\"", desc: "Track-focused grip",     price: 2000 },
    ]},
    { name: "Suspension", options: [
      { name: "Standard",    desc: "Comfort-tuned adaptive", price: 0,    active: true },
      { name: "Performance", desc: "Lowered, sport-tuned",   price: 2500 },
      { name: "Off-Road",    desc: "Raised, long-travel",    price: 3000 },
    ]},
    { name: "Cargo", options: [
      { name: "None",           desc: "",                         price: 0,    active: true },
      { name: "Rear Storage",   desc: "15L sealed compartment",   price: 800 },
      { name: "Extended Cargo", desc: "40L modular cargo system", price: 1500 },
    ]},
    { name: "Rack", options: [
      { name: "None",         desc: "",                        price: 0,    active: true },
      { name: "Utility Rack", desc: "Heavy-duty load bearing", price: 600 },
      { name: "Sport Rack",   desc: "Aerodynamic low-profile", price: 900 },
    ]},
    { name: "Protection", options: [
      { name: "None",        desc: "",                             price: 0,    active: true },
      { name: "Skid Plates", desc: "Underbody armor",             price: 700 },
      { name: "Full Guard",  desc: "Complete protection package",  price: 1400 },
    ]},
  ];

  const RATIONALE = [
    { feature: "Performance Suspension", reason: "Lowered ride height sharpens cornering." },
    { feature: "Performance 19\" Wheels", reason: "Track-focused grip transfers power to ground." },
    { feature: "Skid Plates", reason: "Lightweight armor protects without excess weight." },
    { feature: "Sport Rack", reason: "Aerodynamic profile keeps drag minimal at speed." },
  ];

  const W = 1440, H = 900, PW = 340, COL_GAP = 80;

  // ─── PRIMITIVES ───
  function solid(color, opacity) {
    var op = (opacity === undefined) ? 1 : opacity;
    return [{ type: "SOLID", color: color, opacity: op }];
  }

  function mkR(name, x, y, w, h, fills, rad) {
    var node = figma.createRectangle();
    node.name = name;
    node.x = x; node.y = y;
    node.resize(Math.max(Math.round(w), 1), Math.max(Math.round(h), 1));
    node.fills = fills;
    if (rad) node.cornerRadius = rad;
    return node;
  }

  function mkT(txt, x, y, size, style, color, opacity, opts) {
    var op = (opacity === undefined) ? 1 : opacity;
    var o = opts || {};
    var t = figma.createText();
    t.fontName = { family: "Inter", style: style };
    t.characters = String(txt);
    t.fontSize = size;
    t.x = x; t.y = y;
    t.fills = solid(color, op);
    if (o.ls !== undefined) t.letterSpacing = { value: o.ls, unit: "PIXELS" };
    if (o.tc) t.textCase = o.tc;
    if (o.w) { t.textAutoResize = "HEIGHT"; t.resize(Math.max(Math.round(o.w), 1), t.height); }
    if (o.align) t.textAlignHorizontal = o.align;
    return t;
  }

  function mkF(name, x, y, w, h, fills, rad, clips) {
    var f = figma.createFrame();
    f.name = name;
    f.x = x; f.y = y;
    f.resize(Math.max(Math.round(w), 1), Math.max(Math.round(h), 1));
    f.fills = fills || [];
    if (rad) f.cornerRadius = rad;
    f.clipsContent = clips ? true : false;
    return f;
  }

  function applyGlass(node, th) {
    node.fills = solid(th.surface, th.surfaceOp);
    node.strokes = solid(th.border, th.borderOp);
    node.strokeWeight = 1;
    node.strokeAlign = "INSIDE";
  }

  function applyBorder(node, color, opacity, weight) {
    node.strokes = solid(color, opacity || 1);
    node.strokeWeight = weight || 1;
    node.strokeAlign = "INSIDE";
  }

  // ─── TOP BAR ───
  function buildTopBar(parent, th) {
    var bar = mkF("Top Bar", 0, 0, W, 60, []);
    parent.appendChild(bar);

    var lf = mkF("Logo", 32, 16, 200, 28, []);
    bar.appendChild(lf);
    var lm = mkT("TESLA", 0, 0, 18, "Semi Bold", th.white, 1, { ls: 4, tc: "UPPER" });
    lf.appendChild(lm);
    lf.appendChild(mkT("Cyberquad", lm.width + 8, 6, 11, "Light", th.white, 0.5, { ls: 2 }));

    var pill = mkF("View Buttons", W - 360, 10, 268, 40, [], 12);
    applyGlass(pill, th);
    bar.appendChild(pill);

    var views = ["FRONT", "SIDE", "REAR", "TOP"];
    for (var vi = 0; vi < views.length; vi++) {
      var isAct = vi === 0;
      var vbg = isAct ? solid(th.text, th.viewActiveBgOp) : [];
      var btn = mkF("View:" + views[vi], 3 + vi * 65, 3, 62, 34, vbg, 8);
      pill.appendChild(btn);
      var bt = mkT(views[vi], 0, 11, 11, "Medium", isAct ? th.text : th.textMuted, 1, { ls: 0.5, tc: "UPPER" });
      bt.x = Math.round((62 - bt.width) / 2);
      btn.appendChild(bt);
    }

    var tog = mkF("Day/Night Toggle", W - 84, 10, 40, 40, [], 20);
    applyGlass(tog, th);
    bar.appendChild(tog);
    tog.appendChild(mkR("Icon", 11, 11, 18, 18, solid(th.text, 0.6), 9));
  }

  // ─── BOTTOM BAR ───
  function buildBottomBar(parent, th) {
    var bar = mkF("Bottom Bar", 0, H - 80, W, 80, []);
    parent.appendChild(bar);

    bar.appendChild(mkR("Fade", 0, 0, W, 80, [{
      type: "GRADIENT_LINEAR",
      gradientTransform: [[0, 1, 0], [-1, 0, 1]],
      gradientStops: [
        { position: 0, color: { r: 0, g: 0, b: 0, a: 0.45 } },
        { position: 1, color: { r: 0, g: 0, b: 0, a: 0 } }
      ]
    }]));

    bar.appendChild(mkT("Cyberquad", 32, 12, 22, "Semi Bold", th.white, 1, { ls: 1 }));
    bar.appendChild(mkT("All-Electric All-Terrain Vehicle", 32, 44, 12, "Regular", th.white, 0.6, { ls: 0.5 }));

    var pg = mkF("Price", W - 380, 10, 160, 60, []);
    bar.appendChild(pg);
    pg.appendChild(mkT("STARTING AT", 0, 4, 10, "Regular", th.white, 0.5, { ls: 1.5, tc: "UPPER" }));
    pg.appendChild(mkT("$3,990", 0, 20, 28, "Semi Bold", th.white, 1, { ls: -0.5 }));

    var cta = mkF("Order Now", W - 212, 18, 180, 44, solid(th.white), 4);
    bar.appendChild(cta);
    var ct = mkT("ORDER NOW", 0, 14, 12, "Semi Bold", th.text, 1, { ls: 2, tc: "UPPER" });
    ct.x = Math.round((180 - ct.width) / 2);
    cta.appendChild(ct);
  }

  // ─── SCENE BACKGROUND ───
  function buildScene(parent, th) {
    parent.appendChild(mkR("Sky", 0, 0, W, H, [{ type: "SOLID", color: { r: th.sceneBgR, g: th.sceneBgG, b: th.sceneBgB }, opacity: 1 }]));

    parent.appendChild(mkR("Ground", 0, Math.round(H * 0.45), W, Math.round(H * 0.55), [{
      type: "GRADIENT_LINEAR",
      gradientTransform: [[0, 1, 0], [-1, 0, 1]],
      gradientStops: [
        { position: 0, color: { r: th.groundTopR, g: th.groundTopG, b: th.groundTopB, a: 1 } },
        { position: 1, color: { r: th.groundBotR, g: th.groundBotG, b: th.groundBotB, a: 1 } }
      ]
    }]));

    parent.appendChild(mkR("Vignette", 0, 0, W, H, [{
      type: "GRADIENT_RADIAL",
      gradientTransform: [[0.5, 0, 0.5], [0, 0.5, 0.5]],
      gradientStops: [
        { position: 0, color: { r: 0, g: 0, b: 0, a: 0 } },
        { position: 1, color: { r: 0, g: 0, b: 0, a: 0.22 } }
      ]
    }]));

    var vp = mkF("3D Viewport", PW + 48, 90, W - PW - 72, H - 185, []);
    parent.appendChild(vp);
    var vpR = mkR("Border", 0, 0, vp.width, vp.height, solid(th.white, 0), 8);
    applyBorder(vpR, th.white, 0.05, 1);
    vp.appendChild(vpR);
    var vt = mkT("ATV Model (3D Canvas)", 0, Math.round(vp.height / 2 - 8), 13, "Regular", th.white, 0.15);
    vt.x = Math.round((vp.width - vt.width) / 2);
    vp.appendChild(vt);
  }

  // ─── OPTION CARD (Tesla bordered style) ───
  function buildOptionCard(parent, opt, x, y, cardW, th) {
    var CARD_H = 66;
    var card = mkF("Option: " + opt.name, x, y, cardW, CARD_H, solid({ r: 0, g: 0, b: 0 }, 0), 8);
    applyBorder(card, opt.active ? th.activeBorder : th.cardBorder, opt.active ? 1 : th.cardBorderOp, opt.active ? 2 : 1);
    parent.appendChild(card);

    var nameStyle = opt.active ? "Semi Bold" : "Regular";
    var nameY = opt.desc ? 10 : 23;
    card.appendChild(mkT(opt.name, 20, nameY, 14, nameStyle, th.text));

    if (opt.desc) {
      card.appendChild(mkT(opt.desc, 20, 32, 12, "Regular", th.textMuted));
    }

    var priceStr = (opt.price === 0) ? "Included" : ("+" + "$" + opt.price.toLocaleString());
    var pt = mkT(priceStr, 0, 23, 14, nameStyle, opt.active ? th.text : th.textMuted);
    pt.x = cardW - 20 - pt.width;
    card.appendChild(pt);

    return CARD_H;
  }

  // ─── OPTION SECTION ───
  function buildOptionSection(parent, secName, options, x, y, th) {
    var CARD_H = 66, GAP = 10, PAD_X = 16;
    var cardW = PW - PAD_X * 2;
    var contentH = options.length * (CARD_H + GAP) - GAP + 20;
    var totalH = 52 + contentH;

    var sec = mkF(secName, x, y, PW, totalH, [], 12);
    applyGlass(sec, th);
    parent.appendChild(sec);

    var hdr = mkF("Header", 0, 0, PW, 52, []);
    sec.appendChild(hdr);
    hdr.appendChild(mkT(secName, 20, 16, 14, "Semi Bold", th.text, 1, { ls: 0.3 }));
    hdr.appendChild(mkR("Chevron", PW - 32, 23, 10, 6, solid(th.text, 0.35), 2));
    sec.appendChild(mkR("Divider", 0, 51, PW, 1, solid(th.border, th.borderOp)));

    var cy = 52 + 8;
    for (var oi = 0; oi < options.length; oi++) {
      buildOptionCard(sec, options[oi], PAD_X, cy, cardW, th);
      cy += CARD_H + GAP;
    }
    return totalH;
  }

  // ─── QUICK BUILDS ───
  function buildQuickBuilds(parent, x, y, th, showRationale) {
    var tabH = 44;
    var initialH = 52 + tabH + 8;
    var qb = mkF("Quick Builds", x, y, PW, initialH + 200, [], 12);
    applyGlass(qb, th);
    parent.appendChild(qb);

    // Header
    var hdr = mkF("Header", 0, 0, PW, 52, []);
    qb.appendChild(hdr);
    hdr.appendChild(mkT("Quick Builds", 20, 16, 14, "Semi Bold", th.text, 1, { ls: 0.3 }));
    hdr.appendChild(mkR("Chevron", PW - 32, 23, 10, 6, solid(th.text, 0.35), 2));
    qb.appendChild(mkR("Divider", 0, 51, PW, 1, solid(th.border, th.borderOp)));

    // Tab row: Sport | Farm | Hunting
    var tabRow = mkF("Tabs", 0, 52, PW, tabH + 2, []);
    qb.appendChild(tabRow);
    tabRow.appendChild(mkR("TabBorder", 0, tabH, PW, 1, solid(th.border, th.borderOp)));

    var tabW = Math.round(PW / 3);
    var tabNames = ["Sport", "Farm", "Hunting"];
    for (var ti = 0; ti < tabNames.length; ti++) {
      var isAct = ti === 0;
      var tab = mkF("Tab:" + tabNames[ti], ti * tabW, 0, tabW, tabH, []);
      tabRow.appendChild(tab);
      var tTxt = mkT(tabNames[ti], 0, 12, 13, isAct ? "Semi Bold" : "Regular", isAct ? th.text : th.textMuted);
      tTxt.x = Math.round((tabW - tTxt.width) / 2);
      tab.appendChild(tTxt);
      if (isAct) {
        tab.appendChild(mkR("Underline", 0, tabH - 2, tabW, 2, solid(th.text, 1)));
      }
    }

    var qy = 52 + tabH + 8;

    if (showRationale) {
      // "Why this build?" header
      var rHdr = mkF("Rationale Header", 0, qy, PW, 56, []);
      qb.appendChild(rHdr);
      rHdr.appendChild(mkT("WHY THIS BUILD?", 20, 10, 11, "Semi Bold", th.textMuted, 1, { ls: 1, tc: "UPPER" }));
      rHdr.appendChild(mkT("Performance riding & trail racing", 20, 30, 12, "Regular", th.text));
      rHdr.appendChild(mkR("Divider", 0, 55, PW, 1, solid(th.border, th.borderOp)));
      qy += 56;

      for (var ri = 0; ri < RATIONALE.length; ri++) {
        var item = RATIONALE[ri];
        var row = mkF("Rationale:" + ri, 0, qy, PW, 50, []);
        qb.appendChild(row);
        row.appendChild(mkR("Dot", 20, 20, 6, 6, solid(th.accent), 3));
        row.appendChild(mkT(item.feature, 34, 6, 13, "Semi Bold", th.text));
        var rsnTxt = mkT(item.reason, 34, 26, 11, "Regular", th.textMuted, 1, { w: PW - 54 });
        row.appendChild(rsnTxt);
        qy += 50;
      }
    }

    // View & Compare Features link
    var cmpLink = mkF("View & Compare Features", 0, qy, PW, 48, solid(th.compareLinkBg, th.compareLinkBgOp));
    applyBorder(cmpLink, th.border, th.borderOp, 1);
    qb.appendChild(cmpLink);
    cmpLink.appendChild(mkT("View & Compare Features", 20, 15, 14, "Regular", th.compareLink));
    cmpLink.appendChild(mkR("Arrow", PW - 28, 20, 8, 8, solid(th.compareLink, 0.4), 2));
    qy += 48;

    qb.resize(PW, qy);
    return qy;
  }

  // ─── COLOR SECTION ───
  function buildColorSection(parent, x, y, th) {
    var SWATCH = 36, CS_H = 148;
    var cs = mkF("Exterior Color", x, y, PW, CS_H, [], 12);
    applyGlass(cs, th);
    parent.appendChild(cs);

    cs.appendChild(mkT("Exterior Color", 20, 16, 14, "Semi Bold", th.text, 1, { ls: 0.3 }));
    cs.appendChild(mkR("Chevron", PW - 32, 23, 10, 6, solid(th.text, 0.35), 2));
    cs.appendChild(mkR("Divider", 0, 51, PW, 1, solid(th.border, th.borderOp)));

    for (var si = 0; si < SWATCHES.length; si++) {
      var c = SWATCHES[si];
      var swX = 20 + si * (SWATCH + 10);
      var isFirst = si === 0;
      var so = mkF("Swatch:" + c.name, swX, 60, SWATCH, SWATCH, isFirst ? solid(th.accent, 0.15) : [], Math.round(SWATCH / 2));
      if (isFirst) { applyBorder(so, th.accent, 1, 2); }
      cs.appendChild(so);
      so.appendChild(mkR("Fill", 3, 3, SWATCH - 6, SWATCH - 6, solid({ r: c.r, g: c.g, b: c.b }), Math.round((SWATCH - 6) / 2)));
    }

    var cn = mkT("Raw Stainless", 0, 106, 13, "Regular", th.textMuted, 1, { w: PW, align: "CENTER" });
    cn.x = 0;
    cs.appendChild(cn);
    return CS_H;
  }

  // ─── COMPARE MODAL ───
  function buildCompareModal(offsetX, offsetY, th) {
    var MODAL_W = 900;
    var LABEL_W = 180;
    var CELL_W = Math.round((MODAL_W - 40 - LABEL_W) / 3);

    var wrap = mkF("Compare Modal: " + th.label, offsetX, offsetY, MODAL_W, 200, solid(th.modalBg));
    wrap.cornerRadius = 16;
    page.appendChild(wrap);

    // Sticky header
    var hdr = mkF("Modal Header", 0, 0, MODAL_W, 80, solid(th.modalBg));
    applyBorder(hdr, th.border, th.borderOp, 1);
    wrap.appendChild(hdr);
    hdr.appendChild(mkT("Compare Builds", 40, 24, 28, "Semi Bold", th.text));

    var closeBtn = mkF("Close", MODAL_W - 60, 20, 40, 40, solid(th.closeBtnBg, th.closeBtnBgOp), 20);
    hdr.appendChild(closeBtn);
    var xTxt = mkT("x", 0, 8, 20, "Regular", th.text, 0.7);
    xTxt.x = Math.round((40 - xTxt.width) / 2);
    closeBtn.appendChild(xTxt);

    var my = 80;

    // Tab pill row
    var tabRowW = MODAL_W - 80;
    var tabRow = mkF("Tab Row", 40, my + 12, tabRowW, 44, solid(th.tabRowBg, th.tabRowBgOp), 10);
    wrap.appendChild(tabRow);
    var tW = Math.round(tabRowW / 3);
    var tabNames = ["Sport", "Farm", "Hunting"];
    for (var cti = 0; cti < tabNames.length; cti++) {
      var isAct = cti === 0;
      var ctab = mkF("CTab:" + tabNames[cti], cti * tW + 3, 3, tW - 6, 38,
        isAct ? solid(th.tabActiveBg) : [], 8);
      tabRow.appendChild(ctab);
      var ctTxt = mkT(tabNames[cti], 0, 10, 14, isAct ? "Semi Bold" : "Regular",
        isAct ? th.text : th.textMuted);
      ctTxt.x = Math.round((tW - 6 - ctTxt.width) / 2);
      ctab.appendChild(ctTxt);
    }
    my += 70;

    // Column headers
    var colHdr = mkF("Column Headers", 0, my, MODAL_W, 88, []);
    wrap.appendChild(colHdr);
    colHdr.appendChild(mkR("Divider", 40, 87, MODAL_W - 80, 2, solid(th.border, 0.15)));

    for (var pi = 0; pi < PRESETS.length; pi++) {
      var p = PRESETS[pi];
      var cx = 40 + LABEL_W + pi * (CELL_W + 4);
      var nm = mkT(p.name, cx, 4, 16, "Semi Bold", th.text, 1, { w: CELL_W, align: "CENTER" });
      colHdr.appendChild(nm);
      var pr = mkT("$" + p.price.toLocaleString(), cx, 28, 22, "Semi Bold", th.text, 1, { w: CELL_W, align: "CENTER" });
      colHdr.appendChild(pr);
      var pd = mkT(p.desc, cx, 60, 11, "Regular", th.textMuted, 1, { w: CELL_W, align: "CENTER" });
      colHdr.appendChild(pd);
    }
    my += 96;

    // Spec rows
    var specRows = [
      { label: "Range",            key: "range" },
      { label: "Top Speed",        key: "topSpeed" },
      { label: "0-40 mph",         key: "accel" },
      { label: "Payload Capacity", key: "payload" },
      { label: "Ground Clearance", key: "ground" },
    ];

    for (var sri = 0; sri < specRows.length; sri++) {
      var spec = specRows[sri];
      var row = mkF("Row:" + spec.label, 0, my, MODAL_W, 52, []);
      wrap.appendChild(row);
      row.appendChild(mkR("Divider", 40, 51, MODAL_W - 80, 1, solid(th.border, th.borderOp)));
      row.appendChild(mkT(spec.label, 40, 16, 14, "Regular", th.textMuted));
      for (var spi = 0; spi < PRESETS.length; spi++) {
        var cxs = 40 + LABEL_W + spi * (CELL_W + 4);
        row.appendChild(mkT(PRESETS[spi].specs[spec.key], cxs, 16, 14, "Regular", th.text, 1, { w: CELL_W, align: "CENTER" }));
      }
      my += 52;
    }

    // Equipment header
    var eqHdr = mkF("Equipment Header", 0, my, MODAL_W, 52, []);
    wrap.appendChild(eqHdr);
    eqHdr.appendChild(mkT("Equipment", 40, 18, 16, "Semi Bold", th.text));
    my += 52;

    // Equipment rows
    var equipRows = [
      { label: "Suspension", key: "suspension" },
      { label: "Wheels",     key: "wheels" },
      { label: "Cargo",      key: "cargo" },
      { label: "Rack",       key: "rack" },
      { label: "Protection", key: "protection" },
      { label: "Color",      key: "color" },
    ];

    for (var eri = 0; eri < equipRows.length; eri++) {
      var eRow = mkF("Row:" + equipRows[eri].label, 0, my, MODAL_W, 52, []);
      wrap.appendChild(eRow);
      eRow.appendChild(mkR("Divider", 40, 51, MODAL_W - 80, 1, solid(th.border, th.borderOp)));
      eRow.appendChild(mkT(equipRows[eri].label, 40, 16, 14, "Regular", th.textMuted));
      for (var epi = 0; epi < PRESETS.length; epi++) {
        var cxe = 40 + LABEL_W + epi * (CELL_W + 4);
        eRow.appendChild(mkT(PRESETS[epi].equip[equipRows[eri].key], cxe, 16, 14, "Regular", th.text, 1, { w: CELL_W, align: "CENTER" }));
      }
      my += 52;
    }

    // Select buttons
    var selRow = mkF("Select Buttons", 0, my, MODAL_W, 76, []);
    wrap.appendChild(selRow);
    for (var seli = 0; seli < PRESETS.length; seli++) {
      var cxb = 40 + LABEL_W + seli * (CELL_W + 4);
      var selBtn = mkF("Select:" + PRESETS[seli].name, cxb, 14, CELL_W, 44, solid(th.selectBtn), 4);
      selRow.appendChild(selBtn);
      var selTxt = mkT("Select " + PRESETS[seli].name, 0, 13, 13, "Medium", th.selectBtnText, 1, { ls: 0.3 });
      selTxt.x = Math.round((CELL_W - selTxt.width) / 2);
      selBtn.appendChild(selTxt);
    }
    my += 76;

    wrap.resize(MODAL_W, my + 24);
    return wrap;
  }

  // ─── FULL CONFIG PANEL (all sections expanded) ───
  function buildFullPanel(offsetX, offsetY, th) {
    var GAP = 4, PAD = 24;
    var wrapper = mkF("Config Panel: " + th.label, offsetX, offsetY, PW + PAD * 2, 200, solid(th.panelBg));
    page.appendChild(wrapper);
    wrapper.appendChild(mkT(th.label + " — All Sections", PAD, 10, 11, "Regular", th.text, 0.4));

    var sy = 36;
    sy += buildQuickBuilds(wrapper, PAD, sy, th, true) + GAP;
    sy += buildColorSection(wrapper, PAD, sy, th) + GAP;

    for (var si = 0; si < SECTIONS.length; si++) {
      sy += buildOptionSection(wrapper, SECTIONS[si].name, SECTIONS[si].options, PAD, sy, th) + GAP;
    }

    wrapper.resize(PW + PAD * 2, sy + PAD);
    return wrapper;
  }

  // ─── DESKTOP FRAME ───
  function buildDesktop(offsetX, offsetY, th) {
    var frame = mkF("Tesla Cyberquad: " + th.label, offsetX, offsetY, W, H, [], 0, true);
    page.appendChild(frame);

    buildScene(frame, th);
    buildTopBar(frame, th);

    // Config panel (shows Quick Builds + Color + Wheels)
    var clipH = H - 80 - 92;
    var clip = mkF("Config Panel", 24, 80, PW, clipH, [], 0, true);
    frame.appendChild(clip);

    var sy = 0;
    sy += buildQuickBuilds(clip, 0, sy, th, false) + 4;
    sy += buildColorSection(clip, 0, sy, th) + 4;
    buildOptionSection(clip, "Wheels", SECTIONS[0].options, 0, sy, th);

    buildBottomBar(frame, th);

    // AI Chat button
    var aiBtn = mkF("AI Chat", W - 60, H - 128, 52, 52, solid(th.surface, 0.88), 26);
    applyBorder(aiBtn, th.border, th.borderOp, 1);
    frame.appendChild(aiBtn);
    var aiTxt = mkT("AI", 0, 17, 11, "Bold", th.accent);
    aiTxt.x = Math.round((52 - aiTxt.width) / 2);
    aiBtn.appendChild(aiTxt);

    return frame;
  }

  // ═══════════════════════════════════════════
  // RENDER — 6 frames in 3 rows
  // ═══════════════════════════════════════════

  // Row 0: Desktops
  var dayDesk   = buildDesktop(0,           0, DAY);
  var nightDesk = buildDesktop(W + COL_GAP, 0, NIGHT);

  // Row 1: Full panels
  var ROW1_Y = H + 80;
  var dayPanel   = buildFullPanel(0,           ROW1_Y, DAY);
  var nightPanel = buildFullPanel(W + COL_GAP, ROW1_Y, NIGHT);
  var maxPanelH  = Math.max(dayPanel.height, nightPanel.height);

  // Row 2: Compare modals
  var ROW2_Y = ROW1_Y + maxPanelH + 80;
  buildCompareModal(0,           ROW2_Y, DAY);
  buildCompareModal(W + COL_GAP, ROW2_Y, NIGHT);

  figma.viewport.scrollAndZoomIntoView([dayDesk, nightDesk]);
  figma.closePlugin("Done! 6 frames exported: 2 Desktops + 2 Full Panels + 2 Compare Modals");
}

main().catch(function(err) {
  figma.closePlugin("Error: " + err.message);
});
