import { CONFIG, BASE_PRICE } from './configurator.js';

let configurator;
let actions;

export function initUI(cfg, act) {
  configurator = cfg;
  actions = act;

  buildConfigPanel();
  buildCompareModal();
  updatePrice();
  setupViewButtons();
  setupDayNightToggle();
  setupPriceBreakdown();
  setupOrderButton();
}

function buildConfigPanel() {
  const panel = document.getElementById('config-panel');
  if (!panel) return;

  panel.innerHTML = '';

  // ── Panel Logo Header ──
  const logoHeader = el('div', 'panel-logo-header');
  const logoImg = document.createElement('img');
  logoImg.src = '/images/cyberquad-logo.svg';
  logoImg.alt = 'Cyberquad';
  logoImg.className = 'panel-logo-img';
  logoHeader.appendChild(logoImg);
  panel.appendChild(logoHeader);

  // ── Quick Builds Section ──
  const autoSection = el('div', 'config-section auto-configure-section');

  // Header with chevron (collapsible) + reset button
  const autoHeader = el('button', 'section-header auto-configure-toggle');
  const autoTitleWrap = el('div', 'section-header-left');
  const autoTitle = el('span', 'section-title');
  autoTitle.textContent = 'Quick Builds';
  autoTitleWrap.appendChild(autoTitle);
  autoHeader.appendChild(autoTitleWrap);

  const autoHeaderRight = el('div', 'section-header-right');

  // Reset button
  const resetBtn = el('button', 'preset-reset-btn');
  resetBtn.textContent = 'Reset';
  resetBtn.style.display = 'none';
  resetBtn.onclick = (e) => {
    e.stopPropagation();
    // Deselect all tabs
    document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
    // Hide rationale
    const rc = document.getElementById('rationale-container');
    if (rc) { rc.classList.remove('visible'); setTimeout(() => { rc.innerHTML = ''; }, 200); }
    // Reset all options to first/default
    resetBtn.style.display = 'none';
    configurator.applyColor(configurator.CONFIG.colors[0]);
    configurator.applyWheels(configurator.CONFIG.wheels[0]);
    configurator.applySuspension(configurator.CONFIG.suspension[0]);
    configurator.applyCargo(configurator.CONFIG.cargo[0]);
    configurator.applyRack(configurator.CONFIG.rack[0]);
    configurator.applyProtection(configurator.CONFIG.protection[0]);
    // Reset UI selections
    document.querySelectorAll('.color-swatch').forEach((s, i) => s.classList.toggle('active', i === 0));
    updateColorName(configurator.CONFIG.colors[0].name);
    ['wheels','suspension','cargo','rack','protection'].forEach(cat => {
      document.querySelectorAll(`[data-category="${cat}"]`).forEach((o, i) => o.classList.toggle('active', i === 0));
    });
    updatePrice();
  };
  autoHeaderRight.appendChild(resetBtn);

  // Chevron
  const autoChevron = el('span', 'section-chevron');
  autoChevron.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  autoHeaderRight.appendChild(autoChevron);

  autoHeader.appendChild(autoHeaderRight);
  autoSection.appendChild(autoHeader);

  // Collapsible content wrapper
  const autoContent = el('div', 'section-content open');
  autoContent.id = 'quick-builds-content';

  autoHeader.onclick = () => {
    autoContent.classList.toggle('open');
    autoSection.classList.toggle('collapsed');
  };

  // Tesla-style tab row (Cash / Lease / Finance pattern)
  const tabRow = el('div', 'preset-tab-row');
  const presets = configurator.PRESETS;

  Object.entries(presets).forEach(([id, preset]) => {
    const tab = el('button', 'preset-tab');
    tab.setAttribute('data-preset', id);
    tab.textContent = preset.name;

    tab.onclick = () => {
      const wasActive = tab.classList.contains('active');

      document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));

      if (wasActive) {
        // Unselect — hide rationale, hide reset
        const rc = document.getElementById('rationale-container');
        if (rc) { rc.classList.remove('visible'); setTimeout(() => { rc.innerHTML = ''; }, 200); }
        resetBtn.style.display = 'none';
        return;
      }

      tab.classList.add('active');
      resetBtn.style.display = '';

      // Show rationale
      showRationale(autoSection, preset);

      configurator.applyPreset(id, (category, option) => {
        if (category === 'color') {
          document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          const activeSwatch = document.querySelector(`[data-color-id="${option.id}"]`);
          if (activeSwatch) activeSwatch.classList.add('active');
          updateColorName(option.name);
        } else {
          document.querySelectorAll(`[data-category="${category}"]`).forEach(o => o.classList.remove('active'));
          const activeOpt = document.querySelector(`[data-category="${category}"][data-option-id="${option.id}"]`);
          if (activeOpt) activeOpt.classList.add('active');
        }
        updatePrice();
      });
    };

    tabRow.appendChild(tab);
  });

  autoContent.appendChild(tabRow);

  // Rationale placeholder (filled on tab click)
  const rationaleContainer = el('div', 'rationale-container');
  rationaleContainer.id = 'rationale-container';
  autoContent.appendChild(rationaleContainer);

  autoSection.appendChild(autoContent);

  // "View & Compare Features" link
  const compareLink = el('button', 'compare-link');
  compareLink.innerHTML = `<span>View &amp; Compare Features</span><svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  compareLink.onclick = () => openCompareModal();
  autoSection.appendChild(compareLink);

  panel.appendChild(autoSection);

  // ── Color Section ──
  const colorSection = createSection('Exterior Color');
  const colorGrid = el('div', 'color-grid');

  CONFIG.colors.forEach((c, i) => {
    const swatch = el('button', `color-swatch ${i === 0 ? 'active' : ''}`);
    swatch.style.setProperty('--swatch-color', c.color);
    swatch.setAttribute('data-color-id', c.id);
    swatch.setAttribute('aria-label', c.name);
    swatch.title = c.name;

    const inner = el('span', 'swatch-inner');
    inner.style.background = c.color;
    swatch.appendChild(inner);

    if (c.price > 0) {
      const priceTag = el('span', 'swatch-price');
      priceTag.textContent = `+$${c.price.toLocaleString()}`;
      swatch.appendChild(priceTag);
    }

    swatch.onclick = () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      configurator.applyColor(c);
      updateColorName(c.name);
      updatePrice();
    };

    colorGrid.appendChild(swatch);
  });

  const colorName = el('div', 'color-name');
  colorName.id = 'color-name';
  colorName.textContent = CONFIG.colors[0].name;

  colorSection.appendChild(colorGrid);
  colorSection.appendChild(colorName);
  panel.appendChild(colorSection);

  // ── Wheels Section ──
  panel.appendChild(createOptionSection('Wheels', CONFIG.wheels, 'wheels', configurator.applyWheels));

  // ── Suspension Section ──
  panel.appendChild(createOptionSection('Suspension', CONFIG.suspension, 'suspension', configurator.applySuspension));

  // ── Cargo Section ──
  panel.appendChild(createOptionSection('Cargo', CONFIG.cargo, 'cargo', configurator.applyCargo));

  // ── Rack Section ──
  panel.appendChild(createOptionSection('Rack', CONFIG.rack, 'rack', configurator.applyRack));

  // ── Protection Section ──
  panel.appendChild(createOptionSection('Protection', CONFIG.protection, 'protection', configurator.applyProtection));
}

function createSection(title) {
  const section = el('div', 'config-section');
  const header = el('button', 'section-header');

  const titleEl = el('span', 'section-title');
  titleEl.textContent = title;
  header.appendChild(titleEl);

  const chevron = el('span', 'section-chevron');
  chevron.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  header.appendChild(chevron);

  const content = el('div', 'section-content');
  content.classList.add('open');

  header.onclick = () => {
    content.classList.toggle('open');
    section.classList.toggle('collapsed');
  };

  section.appendChild(header);
  section.appendChild(content);
  return section;
}

function createOptionSection(title, options, category, applyFn) {
  const section = createSection(title);
  const content = section.querySelector('.section-content');
  const optionsList = el('div', 'options-list');

  options.forEach((opt, i) => {
    const hasImg = !!opt.img;
    const optEl = el('button', `option-card ${i === 0 ? 'active' : ''} ${hasImg ? 'option-card-img' : ''}`);
    optEl.setAttribute('data-category', category);
    optEl.setAttribute('data-option-id', opt.id);

    if (hasImg) {
      const thumb = document.createElement('img');
      thumb.src = opt.img;
      thumb.alt = opt.name;
      thumb.className = 'option-thumb';
      thumb.loading = 'lazy';
      optEl.appendChild(thumb);
    }

    const info = el('div', 'option-info');
    const name = el('span', 'option-name');
    name.textContent = opt.name;
    info.appendChild(name);

    if (opt.desc) {
      const desc = el('span', 'option-desc');
      desc.textContent = opt.desc;
      info.appendChild(desc);
    }

    optEl.appendChild(info);

    const priceEl = el('span', 'option-price');
    priceEl.textContent = opt.price === 0 ? 'Included' : `+$${opt.price.toLocaleString()}`;
    optEl.appendChild(priceEl);

    optEl.onclick = () => {
      document.querySelectorAll(`[data-category="${category}"]`).forEach(o => o.classList.remove('active'));
      optEl.classList.add('active');
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      applyFn(opt);
      updatePrice();
    };

    optionsList.appendChild(optEl);
  });

  content.appendChild(optionsList);
  return section;
}

function showRationale(section, preset) {
  const container = document.getElementById('rationale-container');
  if (!container) return;

  // Animate out → rebuild → animate in
  container.classList.remove('visible');

  setTimeout(() => {
    container.innerHTML = '';

    const header = el('div', 'rationale-header');

    const label = el('span', 'rationale-label');
    label.textContent = 'Why this build?';
    header.appendChild(label);

    const subtitle = el('span', 'rationale-subtitle');
    subtitle.textContent = preset.desc;
    header.appendChild(subtitle);

    container.appendChild(header);

    const list = el('div', 'rationale-list');
    preset.rationale.forEach(item => {
      const row = el('div', 'rationale-row');

      const dot = el('span', 'rationale-dot');
      row.appendChild(dot);

      const text = el('div', 'rationale-text');
      const feature = el('span', 'rationale-feature');
      feature.textContent = item.feature;
      text.appendChild(feature);

      const reason = el('span', 'rationale-reason');
      reason.textContent = ' — ' + item.reason;
      text.appendChild(reason);

      row.appendChild(text);
      list.appendChild(row);
    });

    container.appendChild(list);
    // Trigger reflow then fade in
    requestAnimationFrame(() => container.classList.add('visible'));
  }, 150);
}

function updateColorName(name) {
  const nameEl = document.getElementById('color-name');
  if (nameEl) {
    nameEl.style.opacity = '0';
    setTimeout(() => {
      nameEl.textContent = name;
      nameEl.style.opacity = '1';
    }, 150);
  }
}

function updatePrice() {
  const priceEl = document.getElementById('total-price');
  if (priceEl) {
    const total = configurator.getTotalPrice();
    animatePrice(priceEl, total);
    updatePriceBreakdown();
  }
}

function animatePrice(element, targetValue) {
  const current = parseInt(element.dataset.value || BASE_PRICE);
  const diff = targetValue - current;
  const duration = 500;
  const start = performance.now();

  function tick() {
    const elapsed = performance.now() - start;
    const t = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const value = Math.round(current + diff * ease);
    element.textContent = `$${value.toLocaleString()}`;
    element.dataset.value = value;
    if (t < 1) requestAnimationFrame(tick);
  }
  tick();
}

function setupPriceBreakdown() {
  const priceDisplay = document.querySelector('.price-display');
  if (!priceDisplay) return;

  const tooltip = el('div', 'price-breakdown');
  tooltip.id = 'price-breakdown';
  priceDisplay.appendChild(tooltip);
  priceDisplay.style.position = 'relative';

  priceDisplay.addEventListener('mouseenter', () => {
    tooltip.classList.add('visible');
  });
  priceDisplay.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });

  updatePriceBreakdown();
}

function updatePriceBreakdown() {
  const tooltip = document.getElementById('price-breakdown');
  if (!tooltip || !configurator) return;

  const state = configurator.getState();
  const lines = [
    { label: 'Base Price', value: BASE_PRICE },
    { label: `Color: ${state.color.name}`, value: state.color.price },
    { label: `Wheels: ${state.wheels.name}`, value: state.wheels.price },
    { label: `Suspension: ${state.suspension.name}`, value: state.suspension.price },
    { label: `Cargo: ${state.cargo.name}`, value: state.cargo.price },
    { label: `Rack: ${state.rack.name}`, value: state.rack.price },
    { label: `Protection: ${state.protection.name}`, value: state.protection.price },
  ].filter(l => l.value > 0);

  tooltip.innerHTML = lines.map(l =>
    `<div class="breakdown-row"><span>${l.label}</span><span>$${l.value.toLocaleString()}</span></div>`
  ).join('');
}

function setupOrderButton() {
  const btn = document.querySelector('.cta-button');
  if (!btn) return;

  btn.onclick = () => {
    btn.classList.add('ordered');
    btn.textContent = 'Reserved \u2713';
    btn.style.pointerEvents = 'none';

    // Flash effect
    const flash = el('div', 'order-flash');
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    setTimeout(() => {
      btn.classList.remove('ordered');
      btn.textContent = 'Order Now';
      btn.style.pointerEvents = '';
    }, 3000);
  };
}

function setupViewButtons() {
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      actions.setCameraView(btn.dataset.view);
    };
  });
}

function setupDayNightToggle() {
  const toggle = document.getElementById('day-night-toggle');
  if (toggle) {
    toggle.onclick = () => {
      const isNight = actions.toggleDayNight();
      toggle.classList.toggle('night', isNight);
      document.body.classList.toggle('night-mode', isNight);
      toggle.title = isNight ? 'Switch to Day' : 'Switch to Night';
    };
  }
}

function buildCompareModal() {
  const modal = document.getElementById('compare-modal');
  const body = document.getElementById('compare-body');
  const closeBtn = document.getElementById('compare-close');
  if (!modal || !body || !closeBtn) return;

  const presets = configurator.PRESETS;
  const presetEntries = Object.entries(presets);

  // Build tab row
  const tabRow = el('div', 'compare-tab-row');
  presetEntries.forEach(([id, p], i) => {
    const tab = el('button', `compare-tab ${i === 0 ? 'active' : ''}`);
    tab.setAttribute('data-preset', id);
    tab.textContent = p.name;
    tab.onclick = () => {
      document.querySelectorAll('.compare-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    };
    tabRow.appendChild(tab);
  });
  body.appendChild(tabRow);

  // Column headers (preset name + total price)
  const headerRow = el('div', 'compare-row compare-row-header');
  headerRow.appendChild(el('div', 'compare-label')); // empty label cell
  presetEntries.forEach(([id, p]) => {
    const cell = el('div', 'compare-cell compare-cell-header');
    const name = el('div', 'compare-preset-name');
    name.textContent = p.name;
    cell.appendChild(name);
    const price = el('div', 'compare-preset-price');
    const total = configurator.BASE_PRICE + p.color.price + p.wheels.price
      + p.suspension.price + p.cargo.price + p.rack.price + p.protection.price;
    price.textContent = `$${total.toLocaleString()}`;
    cell.appendChild(price);
    const desc = el('div', 'compare-preset-desc');
    desc.textContent = p.desc;
    cell.appendChild(desc);
    headerRow.appendChild(cell);
  });
  body.appendChild(headerRow);

  // Spec rows
  const specRows = [
    { label: 'Range', key: 'range' },
    { label: 'Top Speed', key: 'topSpeed' },
    { label: '0\u201340 mph', key: 'accel' },
    { label: 'Payload Capacity', key: 'payload' },
    { label: 'Ground Clearance', key: 'groundClearance' },
  ];

  specRows.forEach(spec => {
    const row = el('div', 'compare-row');
    const label = el('div', 'compare-label');
    label.textContent = spec.label;
    row.appendChild(label);
    presetEntries.forEach(([id, p]) => {
      const cell = el('div', 'compare-cell');
      cell.textContent = p.specs[spec.key];
      row.appendChild(cell);
    });
    body.appendChild(row);
  });

  // Equipment rows
  const equipRows = [
    { label: 'Suspension', get: (p) => p.suspension.name },
    { label: 'Wheels', get: (p) => p.wheels.name },
    { label: 'Cargo', get: (p) => p.cargo.name },
    { label: 'Rack', get: (p) => p.rack.name },
    { label: 'Protection', get: (p) => p.protection.name },
    { label: 'Color', get: (p) => p.color.name },
  ];

  const equipHeader = el('div', 'compare-row compare-row-divider');
  const equipLabel = el('div', 'compare-label compare-section-label');
  equipLabel.textContent = 'Equipment';
  equipHeader.appendChild(equipLabel);
  presetEntries.forEach(() => equipHeader.appendChild(el('div', 'compare-cell')));
  body.appendChild(equipHeader);

  equipRows.forEach(spec => {
    const row = el('div', 'compare-row');
    const label = el('div', 'compare-label');
    label.textContent = spec.label;
    row.appendChild(label);
    presetEntries.forEach(([id, p]) => {
      const cell = el('div', 'compare-cell');
      cell.textContent = spec.get(p);
      row.appendChild(cell);
    });
    body.appendChild(row);
  });

  // Select buttons row
  const selectRow = el('div', 'compare-row compare-row-select');
  selectRow.appendChild(el('div', 'compare-label'));
  presetEntries.forEach(([id, p]) => {
    const cell = el('div', 'compare-cell');
    const btn = el('button', 'compare-select-btn');
    btn.textContent = `Select ${p.name}`;
    btn.onclick = () => {
      // Apply preset
      document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
      const matchTab = document.querySelector(`.preset-tab[data-preset="${id}"]`);
      if (matchTab) matchTab.click();
      closeCompareModal();
    };
    cell.appendChild(btn);
    selectRow.appendChild(cell);
  });
  body.appendChild(selectRow);

  // Close handlers
  closeBtn.onclick = closeCompareModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeCompareModal();
  };
}

function openCompareModal() {
  const modal = document.getElementById('compare-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCompareModal() {
  const modal = document.getElementById('compare-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function setupAIChatButton() {
  const appUI = document.getElementById('app-ui');
  if (!appUI) return;

  const chatBtn = el('button', 'ai-chat-btn');
  chatBtn.title = 'Ask AI about your build';
  chatBtn.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3c-4.97 0-9 3.13-9 7 0 2.38 1.56 4.5 4 5.74V20l3.27-2.18c.56.1 1.14.18 1.73.18 4.97 0 9-3.13 9-7s-4.03-7-9-7z"/>
      <circle cx="8.5" cy="10.5" r="0.75" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="10.5" r="0.75" fill="currentColor" stroke="none"/>
      <circle cx="15.5" cy="10.5" r="0.75" fill="currentColor" stroke="none"/>
    </svg>
    <span class="ai-chat-label">AI</span>
  `;

  chatBtn.onclick = () => {
    chatBtn.classList.toggle('open');
    // Placeholder — future: open chat panel
  };

  appUI.appendChild(chatBtn);
}

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}
