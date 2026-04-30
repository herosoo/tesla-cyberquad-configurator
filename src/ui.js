import { CONFIG, BASE_PRICE } from './configurator.js';

// ─── ATV Trail Database ───
const ATV_TRAILS = [
  // West
  { id: 'moab-slickrock', name: 'Slickrock Trail', city: 'Moab', state: 'UT', lat: 38.5733, lng: -109.5498, difficulty: 'Hard', distance: 10.5, terrain: 'Sandstone', description: 'Iconic petrified sand dune trail with steep climbs, technical ledges, and panoramic canyon views.', preset: 'sport' },
  { id: 'glamis-dunes', name: 'Imperial Sand Dunes', city: 'Glamis', state: 'CA', lat: 32.9582, lng: -115.1194, difficulty: 'Moderate', distance: 40, terrain: 'Sand Dunes', description: 'Vast open dune system perfect for high-speed desert riding and freestyle terrain.', preset: 'sport' },
  { id: 'paiute-trail', name: 'Paiute ATV Trail', city: 'Marysvale', state: 'UT', lat: 38.4530, lng: -112.2288, difficulty: 'Moderate', distance: 275, terrain: 'Mountain', description: 'Sprawling trail network through alpine forests, meadows, and historic mining towns.', preset: 'hunting' },
  { id: 'rubicon-trail', name: 'Rubicon Trail', city: 'Georgetown', state: 'CA', lat: 38.9755, lng: -120.2316, difficulty: 'Hard', distance: 22, terrain: 'Rocky', description: 'Legendary granite trail in the Sierra Nevada with extreme rock crawling sections.', preset: 'sport' },
  { id: 'oregon-dunes', name: 'Oregon Dunes', city: 'Florence', state: 'OR', lat: 43.8926, lng: -124.1429, difficulty: 'Easy', distance: 30, terrain: 'Coastal Sand', description: 'Largest expanse of coastal sand dunes in North America with ocean-view riding.', preset: 'farm' },
  { id: 'johnson-valley', name: 'Johnson Valley OHV', city: 'Lucerne Valley', state: 'CA', lat: 34.3614, lng: -116.4689, difficulty: 'Moderate', distance: 50, terrain: 'Desert', description: 'Open desert with dry lake beds, washes, and rocky hill climbs used for King of the Hammers.', preset: 'sport' },
  // Midwest
  { id: 'badlands-ohv', name: 'Badlands OHV Park', city: 'Attica', state: 'IN', lat: 40.2703, lng: -87.2481, difficulty: 'Moderate', distance: 800, terrain: 'Mixed', description: 'Sprawling off-road park with mud pits, hill climbs, trails, and open riding areas.', preset: 'farm' },
  { id: 'wayne-national', name: 'Wayne National Forest', city: 'Nelsonville', state: 'OH', lat: 39.4314, lng: -82.2251, difficulty: 'Easy', distance: 75, terrain: 'Forest', description: 'Rolling Appalachian foothills with well-maintained ATV trails through hardwood forest.', preset: 'hunting' },
  { id: 'hurley-trails', name: 'Iron County Trails', city: 'Hurley', state: 'WI', lat: 46.4497, lng: -90.1862, difficulty: 'Easy', distance: 100, terrain: 'Forest', description: 'Northern Wisconsin trail system through dense forest, connecting small towns and scenic lakes.', preset: 'hunting' },
  { id: 'st-joe-forest', name: 'St. Joe National Forest', city: 'St. Maries', state: 'ID', lat: 47.3144, lng: -116.5627, difficulty: 'Moderate', distance: 60, terrain: 'Mountain Forest', description: 'Remote mountain trails through old-growth cedar groves with river crossings.', preset: 'hunting' },
  // South
  { id: 'hatfield-mccoy', name: 'Hatfield-McCoy Trails', city: 'Man', state: 'WV', lat: 37.7429, lng: -81.8747, difficulty: 'Moderate', distance: 700, terrain: 'Appalachian', description: 'Massive trail system across southern WV mountains — one of the largest ATV networks in the US.', preset: 'hunting' },
  { id: 'brimstone', name: 'Brimstone Recreation', city: 'Huntsville', state: 'TN', lat: 36.4089, lng: -84.4914, difficulty: 'Hard', distance: 300, terrain: 'Mountain', description: 'Challenging Cumberland Plateau trails with creek crossings, mud holes, and cliff-side riding.', preset: 'sport' },
  { id: 'windrock', name: 'Windrock Park', city: 'Oliver Springs', state: 'TN', lat: 36.0803, lng: -84.3191, difficulty: 'Hard', distance: 300, terrain: 'Rocky Mountain', description: 'Privately owned mountain park with extreme rock crawling and technical single-track trails.', preset: 'sport' },
  { id: 'crosby-texas', name: 'Crosby MX Park', city: 'Crosby', state: 'TX', lat: 29.9238, lng: -95.0585, difficulty: 'Easy', distance: 15, terrain: 'Flat Prairie', description: 'Family-friendly open riding area near Houston with flat terrain and beginner-friendly loops.', preset: 'farm' },
  { id: 'ocala-national', name: 'Ocala National Forest', city: 'Silver Springs', state: 'FL', lat: 29.1873, lng: -81.6542, difficulty: 'Easy', distance: 45, terrain: 'Flatwoods', description: 'Sandy pine flatwoods trails through subtropical forest with mild year-round riding.', preset: 'farm' },
  { id: 'sam-houston', name: 'Sam Houston NF Trails', city: 'New Waverly', state: 'TX', lat: 30.5411, lng: -95.4838, difficulty: 'Easy', distance: 55, terrain: 'Pine Forest', description: 'East Texas piney woods with well-marked ATV routes and rolling gentle terrain.', preset: 'farm' },
  // Northeast
  { id: 'jericho-atv', name: 'Jericho ATV Festival', city: 'Berlin', state: 'NH', lat: 44.4678, lng: -71.2592, difficulty: 'Moderate', distance: 80, terrain: 'Mountain Forest', description: 'White Mountain trail network through birch and spruce forest with stunning fall foliage riding.', preset: 'hunting' },
  { id: 'ride-the-wilds', name: 'Ride the Wilds', city: 'Colebrook', state: 'NH', lat: 44.8943, lng: -71.4959, difficulty: 'Easy', distance: 1000, terrain: 'Multi-Use', description: 'Largest ATV trail network in the Northeast connecting towns across the Great North Woods.', preset: 'farm' },
  { id: 'pittsburg-trails', name: 'Pittsburg Ridge Runners', city: 'Pittsburg', state: 'NH', lat: 45.0834, lng: -71.4088, difficulty: 'Moderate', distance: 200, terrain: 'Ridge', description: 'Elevated ridge-line trails with panoramic views of the Connecticut Lakes region.', preset: 'hunting' },
  { id: 'anthracite-trail', name: 'Anthracite Outdoor', city: 'Shamokin', state: 'PA', lat: 40.7890, lng: -76.5583, difficulty: 'Moderate', distance: 115, terrain: 'Coal Country', description: 'Reclaimed coal-mining land turned into a rugged trail system with unique terrain features.', preset: 'sport' },
  // Northwest
  { id: 'tillamook-forest', name: 'Tillamook State Forest', city: 'Tillamook', state: 'OR', lat: 45.5912, lng: -123.5384, difficulty: 'Moderate', distance: 35, terrain: 'Coastal Forest', description: 'Temperate rainforest trails with muddy creek crossings and moss-covered old-growth scenery.', preset: 'hunting' },
  { id: 'cle-elum-trails', name: 'Cle Elum Ridge Trail', city: 'Cle Elum', state: 'WA', lat: 47.1953, lng: -120.9394, difficulty: 'Hard', distance: 28, terrain: 'Alpine', description: 'High-elevation Cascade Range trails with switchbacks, scree fields, and alpine meadows.', preset: 'sport' },
  // Southwest
  { id: 'sedona-trails', name: 'Sedona OHV Trails', city: 'Sedona', state: 'AZ', lat: 34.8697, lng: -111.7610, difficulty: 'Moderate', distance: 25, terrain: 'Red Rock', description: 'Stunning red rock desert trails winding through iconic Sedona canyon formations.', preset: 'sport' },
  { id: 'ruidoso-trails', name: 'Lincoln NF Trails', city: 'Ruidoso', state: 'NM', lat: 33.3317, lng: -105.6728, difficulty: 'Easy', distance: 40, terrain: 'High Desert', description: 'Cool mountain trails in southern New Mexico with ponderosa pine and meadow riding.', preset: 'farm' },
];

const STATE_NAMES = {
  AL:'alabama',AK:'alaska',AZ:'arizona',AR:'arkansas',CA:'california',CO:'colorado',
  CT:'connecticut',DE:'delaware',FL:'florida',GA:'georgia',HI:'hawaii',ID:'idaho',
  IL:'illinois',IN:'indiana',IA:'iowa',KS:'kansas',KY:'kentucky',LA:'louisiana',
  ME:'maine',MD:'maryland',MA:'massachusetts',MI:'michigan',MN:'minnesota',MS:'mississippi',
  MO:'missouri',MT:'montana',NE:'nebraska',NV:'nevada',NH:'new hampshire',NJ:'new jersey',
  NM:'new mexico',NY:'new york',NC:'north carolina',ND:'north dakota',OH:'ohio',OK:'oklahoma',
  OR:'oregon',PA:'pennsylvania',RI:'rhode island',SC:'south carolina',SD:'south dakota',
  TN:'tennessee',TX:'texas',UT:'utah',VT:'vermont',VA:'virginia',WA:'washington',
  WV:'west virginia',WI:'wisconsin',WY:'wyoming',
};

let configurator;
let actions;

export function initUI(cfg, act) {
  configurator = cfg;
  actions = act;

  buildConfigPanel();
  buildCompareModal();
  buildTrailModal();
  updatePrice();
  setupViewButtons();
  setupPriceBreakdown();
  setupOrderButton();
  setupAIChatButton();
  setupProgressIndicator();
  setupCheckoutVisibility();
}

// Fade out the fixed bottom bar (Vehicle Price + Order Now) when the inline
// checkout summary scrolls into view. Avoids visual duplication and lets the
// summary feel like the "flat" landing card at the bottom of the menu.
function setupCheckoutVisibility() {
  const wrapper = document.querySelector('.config-panel-wrapper');
  const bottomBar = document.querySelector('.bottom-bar');
  const summary = document.getElementById('checkout-summary');
  if (!wrapper || !bottomBar || !summary) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.intersectionRatio > 0.2) {
        bottomBar.classList.add('hidden');
      } else {
        bottomBar.classList.remove('hidden');
      }
    });
  }, {
    root: wrapper,
    threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
  });

  observer.observe(summary);
}

// ─── Progress Indicator (vertical dots on right edge of side menu) ───
function setupProgressIndicator() {
  const wrapper = document.querySelector('.config-panel-wrapper');
  if (!wrapper) return;
  const sections = Array.from(document.querySelectorAll('#config-panel [data-progress-section]'));
  if (sections.length === 0) return;

  // Build indicator
  const indicator = document.createElement('div');
  indicator.className = 'progress-indicator';

  sections.forEach((section, i) => {
    const dot = document.createElement('button');
    dot.className = 'progress-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('data-section-index', i);
    dot.setAttribute('aria-label', section.getAttribute('data-progress-section'));
    dot.title = section.getAttribute('data-progress-section');
    dot.onclick = () => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    indicator.appendChild(dot);
  });

  document.body.appendChild(indicator);

  // Scroll-position-based tracking — more reliable than ratio-only when several
  // small sections are fully visible together (which made the last dot never win).
  function updateActiveDot() {
    const dots = indicator.querySelectorAll('.progress-dot');
    let activeIndex = 0;

    // Edge case: scrolled to bottom → force the last section to be active.
    // Tolerance of 4px handles subpixel rounding.
    const atBottom = wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - 4;
    if (atBottom) {
      activeIndex = sections.length - 1;
    } else {
      // Pick the last section whose top has passed a "reading line"
      // 25% down from the wrapper's top edge.
      const wrapperRect = wrapper.getBoundingClientRect();
      const readingLine = wrapperRect.top + wrapperRect.height * 0.25;
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top <= readingLine) activeIndex = i;
      });
    }

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === activeIndex);
    });
  }

  wrapper.addEventListener('scroll', updateActiveDot, { passive: true });
  window.addEventListener('resize', updateActiveDot);
  // Initial paint after layout settles
  requestAnimationFrame(updateActiveDot);
}

// Switch to Custom tab if a Sport/Farm/Hunting preset is currently active,
// then refresh the Custom summary so the user always sees their current changes.
// Preserves all option selections — only updates the tab + summary panel.
function markAsCustom() {
  const activePresetTab = document.querySelector('.preset-tab.active');
  const presetId = activePresetTab?.getAttribute('data-preset');

  if (presetId !== 'custom') {
    document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
    const customTab = document.querySelector('.preset-tab[data-preset="custom"]');
    if (customTab) customTab.classList.add('active');
  }

  // Always refresh the summary when we mark as custom (tab switch or option change)
  showCustomSummary();
}

// Monoline 16px SVG icons for each configurable category — used in the
// Custom build summary to identify what changed at a glance.
function getCategoryIcon(category) {
  const stroke = `stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const ICONS = {
    color: `<svg viewBox="0 0 16 16" ${stroke}><circle cx="8" cy="8" r="5"/><path d="M8 3v10M3 8h10"/></svg>`,
    wheels: `<svg viewBox="0 0 16 16" ${stroke}><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2"/><path d="M8 2v3M8 11v3M2 8h3M11 8h3"/></svg>`,
    suspension: `<svg viewBox="0 0 16 16" ${stroke}><path d="M4 2v12M12 2v12"/><path d="M4 4l8 2-8 2 8 2-8 2"/></svg>`,
    cargo: `<svg viewBox="0 0 16 16" ${stroke}><rect x="2.5" y="4.5" width="11" height="8" rx="1"/><path d="M2.5 7.5h11"/></svg>`,
    protection: `<svg viewBox="0 0 16 16" ${stroke}><path d="M8 2l5 2v4c0 3-2 5-5 6-3-1-5-3-5-6V4l5-2z"/></svg>`,
    charging: `<svg viewBox="0 0 16 16" ${stroke}><path d="M9 2L4 9h3l-1 5 5-7H8l1-5z"/></svg>`,
    connectivity: `<svg viewBox="0 0 16 16" ${stroke}><path d="M3 9c1-1 3-2 5-2s4 1 5 2"/><path d="M5 11c0.5-0.5 1.5-1 3-1s2.5 0.5 3 1"/><circle cx="8" cy="13" r="0.6" fill="currentColor"/></svg>`,
  };
  return ICONS[category] || ICONS.color;
}

// Render the user's custom-build summary into the rationale container.
// Shows only options that differ from the factory default, with friendly
// explanations of what each change does.
function showCustomSummary() {
  const container = document.getElementById('rationale-container');
  if (!container || !configurator) return;

  const state = configurator.getState();
  const CONFIG = configurator.CONFIG;
  const changes = [];

  if (state.color && state.color.id !== CONFIG.colors[0].id) {
    changes.push({ category: 'color', feature: state.color.name, reason: 'Custom exterior color finish' });
  }
  if (state.wheels && state.wheels.id !== CONFIG.wheels[0].id) {
    changes.push({ category: 'wheels', feature: state.wheels.name, reason: state.wheels.desc });
  }
  if (state.suspension && state.suspension.id !== CONFIG.suspension[0].id) {
    changes.push({ category: 'suspension', feature: state.suspension.name, reason: state.suspension.desc });
  }
  if (state.cargo) {
    changes.push({ category: 'cargo', feature: state.cargo.name, reason: state.cargo.desc });
  }
  if (state.protection) {
    changes.push({ category: 'protection', feature: state.protection.name, reason: state.protection.desc });
  }
  if (state.charging && state.charging.length > 0) {
    state.charging.forEach(c => {
      changes.push({ category: 'charging', feature: c.name, reason: c.desc });
    });
  }
  if (state.connectivity) {
    changes.push({ category: 'connectivity', feature: state.connectivity.name, reason: state.connectivity.desc });
  }

  // Animate out → rebuild → animate in
  container.classList.remove('visible');

  setTimeout(() => {
    container.innerHTML = '';

    if (changes.length === 0) {
      // No changes — leave panel empty/hidden so it doesn't add visual clutter
      return;
    }

    const header = el('div', 'rationale-header');
    const label = el('span', 'rationale-label');
    label.textContent = 'Your custom build';
    header.appendChild(label);

    container.appendChild(header);

    const list = el('div', 'rationale-list');
    changes.forEach(item => {
      const row = el('div', 'rationale-row');

      const text = el('div', 'rationale-text');
      const feature = el('span', 'rationale-feature');
      feature.textContent = item.feature;
      text.appendChild(feature);

      if (item.reason) {
        const reason = el('span', 'rationale-reason');
        reason.textContent = ' — ' + item.reason;
        text.appendChild(reason);
      }

      row.appendChild(text);
      list.appendChild(row);
    });
    container.appendChild(list);

    requestAnimationFrame(() => container.classList.add('visible'));
  }, 150);
}

function resetAllToDefaults() {
  // Deselect all preset tabs
  document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
  // Hide rationale
  const rc = document.getElementById('rationale-container');
  if (rc) { rc.classList.remove('visible'); setTimeout(() => { rc.innerHTML = ''; }, 200); }
  // Reset environment to default studio
  actions.setEnvironment(null);
  // Reset all options to first/default
  configurator.applyColor(configurator.CONFIG.colors[0]);
  configurator.applyWheels(configurator.CONFIG.wheels[0]);
  configurator.applySuspension(configurator.CONFIG.suspension[0]);
  configurator.applyCargo(null);
  configurator.applyRack(configurator.CONFIG.rack[0]);
  configurator.applyProtection(null);
  configurator.applyCharging([]);
  configurator.applyConnectivity(null);
  // Reset UI selections
  document.querySelectorAll('.color-swatch').forEach((s, i) => s.classList.toggle('active', i === 0));
  updateColorName(configurator.CONFIG.colors[0].name);
  ['wheels','suspension','rack'].forEach(cat => {
    document.querySelectorAll(`[data-category="${cat}"]`).forEach((o, i) => o.classList.toggle('active', i === 0));
  });
  // Cargo/protection/charging/connectivity are deselectable — clear all active
  ['cargo','protection','charging','connectivity'].forEach(cat => {
    document.querySelectorAll(`[data-category="${cat}"]`).forEach(o => o.classList.remove('active'));
  });
  updatePrice();
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

  // ── Specs Card (matches other section cards) ──
  const specsSection = el('div', 'config-section specs-section');
  const specsBar = el('div', 'specs-bar');
  const specsData = [
    { value: '60 mi', label: 'Range' },
    { value: '60 mph', label: 'Top Speed' },
    { value: '8.1 sec', label: '0-60 mph' },
  ];
  specsData.forEach(spec => {
    const col = el('div', 'specs-col');
    const lbl = el('div', 'specs-label');
    lbl.textContent = spec.label;
    const val = el('div', 'specs-value');
    val.textContent = spec.value;
    col.appendChild(lbl);
    col.appendChild(val);
    specsBar.appendChild(col);
  });
  specsSection.appendChild(specsBar);
  panel.appendChild(specsSection);

  // ── Quick Builds Section (ONLY section with chevron) ──
  const autoSection = el('div', 'config-section auto-configure-section');

  const autoHeader = el('button', 'section-header auto-configure-toggle');
  const autoTitleWrap = el('div', 'section-header-left');
  const autoTitle = el('span', 'section-title');
  autoTitle.textContent = 'Quick Builds';
  autoTitleWrap.appendChild(autoTitle);
  autoHeader.appendChild(autoTitleWrap);

  const autoHeaderRight = el('div', 'section-header-right');
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

  // Tab row: Custom | Sport | Farm | Hunting
  const tabRow = el('div', 'preset-tab-row');
  const presets = configurator.PRESETS;

  // Custom tab — active by default; represents the user's current customized build
  const customTab = el('button', 'preset-tab active');
  customTab.setAttribute('data-preset', 'custom');
  customTab.textContent = 'Custom';
  customTab.onclick = () => {
    // Deactivate all preset tabs and re-activate Custom
    document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
    customTab.classList.add('active');
    // Reset environment preset; preserve all current option selections
    actions.setEnvironment(null);
    // Show the user's custom-build summary with friendly explanations of changes
    showCustomSummary();
  };
  tabRow.appendChild(customTab);

  // Preset tabs (Sport, Farm, Hunting)
  Object.entries(presets).forEach(([id, preset]) => {
    const tab = el('button', 'preset-tab');
    tab.setAttribute('data-preset', id);
    tab.textContent = preset.name;

    tab.onclick = () => {
      const wasActive = tab.classList.contains('active');
      document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));

      if (wasActive) {
        const rc = document.getElementById('rationale-container');
        if (rc) { rc.classList.remove('visible'); setTimeout(() => { rc.innerHTML = ''; }, 200); }
        actions.setEnvironment(null);
        return;
      }

      tab.classList.add('active');
      actions.setEnvironment(id);
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

  // Rationale placeholder
  const rationaleContainer = el('div', 'rationale-container');
  rationaleContainer.id = 'rationale-container';
  autoContent.appendChild(rationaleContainer);

  autoSection.appendChild(autoContent);

  // "Compare Features" link inside Quick Builds
  const compareLink = el('button', 'compare-link');
  compareLink.innerHTML = `<span>Compare Features</span><svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  compareLink.onclick = () => openCompareModal();
  autoSection.appendChild(compareLink);

  panel.appendChild(autoSection);

  // ── Exterior Color Section (no chevron) ──
  const colorSection = createSection('Exterior Color', false);
  const colorContent = colorSection.querySelector('.section-content');
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
      priceTag.textContent = `$${c.price.toLocaleString()}`;
      swatch.appendChild(priceTag);
    }

    swatch.onclick = () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      configurator.applyColor(c);
      updateColorName(c.name);
      updatePrice();
      markAsCustom();
    };

    colorGrid.appendChild(swatch);
  });

  const colorName = el('div', 'color-name');
  colorName.id = 'color-name';
  colorName.textContent = CONFIG.colors[0].name;

  colorContent.appendChild(colorGrid);
  colorContent.appendChild(colorName);
  colorSection.setAttribute('data-progress-section', 'Color');
  panel.appendChild(colorSection);

  // ── Wheels Section (no chevron) ──
  const wheelsSection = createOptionSection('Wheels', CONFIG.wheels, 'wheels', configurator.applyWheels);
  wheelsSection.setAttribute('data-progress-section', 'Wheels');
  panel.appendChild(wheelsSection);

  // ── Suspension Section (no chevron) ──
  const suspSection = createOptionSection('Suspension', CONFIG.suspension, 'suspension', configurator.applySuspension);
  suspSection.setAttribute('data-progress-section', 'Suspension');
  panel.appendChild(suspSection);

  // ── Cargo Section (no chevron, deselectable) ──
  const cargoSection = createOptionSection('Cargo', CONFIG.cargo, 'cargo', configurator.applyCargo, false, true);
  cargoSection.setAttribute('data-progress-section', 'Cargo');
  panel.appendChild(cargoSection);

  // ── Protection Section (no chevron, deselectable) ──
  const protSection = createOptionSection('Protection', CONFIG.protection, 'protection', configurator.applyProtection, false, true);
  protSection.setAttribute('data-progress-section', 'Protection');
  panel.appendChild(protSection);

  // ── Charging Section (NEW, no chevron, multi-select) ──
  const chargingSection = createOptionSection('Charging', CONFIG.charging, 'charging', configurator.applyCharging, true);
  chargingSection.setAttribute('data-progress-section', 'Charging');
  panel.appendChild(chargingSection);

  // ── Stay Connected Anywhere Section (NEW, no chevron, deselectable) ──
  const connSection = createOptionSection('Stay Connected Anywhere', CONFIG.connectivity, 'connectivity', configurator.applyConnectivity, false, true);
  connSection.setAttribute('data-progress-section', 'Connect');

  // "Find ATV Trails" link at bottom of this section
  const trailLink = el('button', 'trail-link');
  trailLink.innerHTML = `<span>Find ATV Trails</span><svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  trailLink.onclick = () => openTrailModal();
  connSection.appendChild(trailLink);
  panel.appendChild(connSection);

  // ── Checkout Summary (inline, appears at end of scroll) ──
  const checkoutCard = el('div', 'checkout-summary');
  checkoutCard.id = 'checkout-summary';
  checkoutCard.innerHTML = `
    <div class="checkout-header">
      <div class="checkout-header-text">
        <div class="checkout-title">Est. Purchase Price</div>
        <div class="checkout-sub">Includes selected accessories</div>
      </div>
      <div class="checkout-total" id="checkout-total">$3,990</div>
    </div>
    <div class="checkout-list" id="checkout-list"></div>
    <div class="checkout-divider"></div>
    <div class="checkout-due">
      <span class="checkout-due-label">Due Today</span>
      <span class="checkout-due-value" id="checkout-due-value">$250</span>
    </div>
    <button class="cta-button checkout-cta" id="checkout-place-order">Place Order</button>
    <p class="checkout-terms">By placing this order, you agree to the <a href="#">Order Agreement</a>, <a href="#">Terms of Use</a>, and <a href="#">Privacy Notice</a>.</p>
  `;
  panel.appendChild(checkoutCard);

}

function createSection(title, collapsible = false) {
  const section = el('div', 'config-section');
  const header = el('div', `section-header ${collapsible ? '' : 'section-header-static'}`);

  const titleEl = el('span', 'section-title');
  titleEl.textContent = title;
  header.appendChild(titleEl);

  const content = el('div', 'section-content open');

  if (collapsible) {
    const chevron = el('span', 'section-chevron');
    chevron.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    header.appendChild(chevron);
    header.style.cursor = 'pointer';
    header.onclick = () => {
      content.classList.toggle('open');
      section.classList.toggle('collapsed');
    };
  }

  section.appendChild(header);
  section.appendChild(content);
  return section;
}

function createOptionSection(title, options, category, applyFn, multiSelect = false, deselectable = false) {
  const section = createSection(title, false);
  const content = section.querySelector('.section-content');
  const optionsList = el('div', 'options-list');

  options.forEach((opt, i) => {
    const hasImg = !!opt.img;
    const isFirstActive = !multiSelect && !deselectable && i === 0;
    const optEl = el('button', `option-card ${isFirstActive ? 'active' : ''} ${hasImg ? 'option-card-img' : ''}`);
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
    if (opt.price === 0) {
      priceEl.style.display = 'none';
    } else {
      priceEl.textContent = `$${opt.price.toLocaleString()}`;
    }
    optEl.appendChild(priceEl);

    if (multiSelect) {
      optEl.onclick = () => {
        optEl.classList.toggle('active');
        applyFn(opt, true);
        updatePrice();
        markAsCustom();
      };
    } else if (deselectable) {
      optEl.onclick = () => {
        const wasActive = optEl.classList.contains('active');
        document.querySelectorAll(`[data-category="${category}"]`).forEach(o => o.classList.remove('active'));
        if (wasActive) {
          // Deselect — remove this option
          applyFn(null);
        } else {
          optEl.classList.add('active');
          applyFn(opt);
          // Slight delay so accessory mesh is created before highlight reads it
          setTimeout(() => actions.highlightPart?.(category), 50);
        }
        updatePrice();
        markAsCustom();
      };
    } else {
      optEl.onclick = () => {
        document.querySelectorAll(`[data-category="${category}"]`).forEach(o => o.classList.remove('active'));
        optEl.classList.add('active');
        applyFn(opt);
        updatePrice();
        actions.highlightPart?.(category);
        markAsCustom();
      };
    }

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
  if (!configurator) return;

  const state = configurator.getState();

  // Build line items (skip $0 add-ons)
  const lines = [
    { label: 'Base Vehicle', value: BASE_PRICE },
    { label: state.color.name, value: state.color.price },
    { label: state.wheels.name, value: state.wheels.price },
    { label: state.suspension.name, value: state.suspension.price },
    ...(state.cargo ? [{ label: state.cargo.name, value: state.cargo.price }] : []),
    { label: state.rack.name, value: state.rack.price },
    ...(state.protection ? [{ label: state.protection.name, value: state.protection.price }] : []),
    ...state.charging.map(c => ({ label: c.name, value: c.price })),
    ...(state.connectivity ? [{ label: state.connectivity.name, value: state.connectivity.price }] : []),
  ].filter(l => l.value > 0);

  const total = lines.reduce((sum, l) => sum + l.value, 0);

  // Hover tooltip (above price)
  if (tooltip) {
    const headerHtml = `
      <div class="breakdown-header">
        <div class="breakdown-header-left">
          <div class="breakdown-header-title">Est. Purchase Price</div>
          <div class="breakdown-header-sub">Includes selected accessories</div>
        </div>
        <div class="breakdown-header-total">$${total.toLocaleString()}</div>
      </div>
    `;
    const itemsHtml = lines.map(l => `
      <div class="breakdown-row">
        <span class="breakdown-label">${l.label}</span>
        <span class="breakdown-value">$${l.value.toLocaleString()}</span>
      </div>
    `).join('');
    tooltip.innerHTML = headerHtml + `<div class="breakdown-list">${itemsHtml}</div>`;
  }

  // Inline checkout summary card at bottom of panel
  const summaryTotal = document.getElementById('checkout-total');
  const summaryList = document.getElementById('checkout-list');
  if (summaryTotal) summaryTotal.textContent = `$${total.toLocaleString()}`;
  if (summaryList) {
    summaryList.innerHTML = lines.map(l => `
      <div class="checkout-row">
        <span class="checkout-row-label">${l.label}</span>
        <span class="checkout-row-value">$${l.value.toLocaleString()}</span>
      </div>
    `).join('');
  }
}

function setupOrderButton() {
  // Top "Order Now" button in the fixed bottom bar \u2014 scrolls to checkout summary
  const topBtn = document.querySelector('.bottom-bar .cta-button');
  const summary = document.getElementById('checkout-summary');
  if (topBtn && summary) {
    topBtn.onclick = () => {
      summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  // Inline "Place Order" button inside the checkout summary \u2014 triggers the actual order
  const placeBtn = document.getElementById('checkout-place-order');
  if (placeBtn) {
    placeBtn.onclick = () => {
      placeBtn.classList.add('ordered');
      placeBtn.textContent = 'Reserved \u2713';
      placeBtn.style.pointerEvents = 'none';

      // Flash effect
      const flash = el('div', 'order-flash');
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 800);

      setTimeout(() => {
        placeBtn.classList.remove('ordered');
        placeBtn.textContent = 'Place Order';
        placeBtn.style.pointerEvents = '';
      }, 3000);
    };
  }
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

  // Clear previous contents (modal rebuilds each open to reflect current custom state)
  body.innerHTML = '';

  const presets = configurator.PRESETS;
  const presetEntries = Object.entries(presets);

  // Will set --compare-cols once we know whether Custom column is added (below)

  // Build a "Custom" pseudo-preset from the current configurator state, but only
  // include it if the user has actually customized something away from defaults.
  const state = configurator.getState();
  const CONFIG = configurator.CONFIG;
  const hasCustomChanges =
    (state.color && state.color.id !== CONFIG.colors[0].id) ||
    (state.wheels && state.wheels.id !== CONFIG.wheels[0].id) ||
    (state.suspension && state.suspension.id !== CONFIG.suspension[0].id) ||
    !!state.cargo ||
    !!state.protection ||
    (state.charging && state.charging.length > 0) ||
    !!state.connectivity;

  if (hasCustomChanges) {
    const chargingName = state.charging && state.charging.length
      ? state.charging.map(c => c.name).join(', ')
      : '—';
    presetEntries.push(['custom', {
      name: 'Custom',
      desc: 'Your current build',
      color: state.color,
      wheels: state.wheels || CONFIG.wheels[0],
      suspension: state.suspension || CONFIG.suspension[0],
      cargo: state.cargo || { name: '—', price: 0 },
      rack: state.rack || CONFIG.rack[0],
      protection: state.protection || { name: '—', price: 0 },
      charging: { name: chargingName, price: state.charging ? state.charging.reduce((s,c)=>s+(c.price||0),0) : 0 },
      connectivity: state.connectivity || { name: '—', price: 0 },
      specs: {
        range: '60 mi',
        topSpeed: '60 mph',
        accel: '8.1 sec',
        payload: '500 lbs',
        groundClearance: '12 in',
      },
      _isCustom: true,
    }]);
  }

  // Set grid column count to match number of preset columns
  body.style.setProperty('--compare-cols', presetEntries.length);

  // Column headers (preset name + total price)
  const headerRow = el('div', 'compare-row compare-row-header');
  headerRow.appendChild(el('div', 'compare-label')); // empty label cell
  presetEntries.forEach(([id, p]) => {
    const cell = el('div', 'compare-cell compare-cell-header');
    const name = el('div', 'compare-preset-name');
    name.textContent = p.name;
    cell.appendChild(name);
    const price = el('div', 'compare-preset-price');
    const total = configurator.BASE_PRICE + (p.color?.price || 0) + (p.wheels?.price || 0)
      + (p.suspension?.price || 0) + (p.cargo?.price || 0) + (p.rack?.price || 0) + (p.protection?.price || 0)
      + (p.charging?.price || 0) + (p.connectivity?.price || 0);
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
    { label: 'Color', get: (p) => p.color?.name || '—' },
    { label: 'Suspension', get: (p) => p.suspension?.name || '—' },
    { label: 'Wheels', get: (p) => p.wheels?.name || '—' },
    { label: 'Cargo', get: (p) => p.cargo?.name || '—' },
    { label: 'Rack', get: (p) => p.rack?.name || '—' },
    { label: 'Protection', get: (p) => p.protection?.name || '—' },
    { label: 'Charging', get: (p) => p.charging?.name || '—' },
    { label: 'Connectivity', get: (p) => p.connectivity?.name || '—' },
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
    btn.textContent = p._isCustom ? 'Current Build' : `Select ${p.name}`;
    if (p._isCustom) {
      btn.disabled = true;
      btn.classList.add('compare-select-btn-current');
    }
    btn.onclick = () => {
      if (p._isCustom) { closeCompareModal(); return; }
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
    // Rebuild every open so the Custom column reflects the current state
    buildCompareModal();
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

  // Chat button (left bottom) — dark rounded square with white chat-bubble icon
  const chatBtn = el('button', 'ai-chat-btn');
  chatBtn.title = 'Ask AI about your build';
  chatBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
      <circle cx="9" cy="10.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="10.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  `;

  // Chat panel
  const chatPanel = el('div', 'ai-chat-panel');
  chatPanel.innerHTML = `
    <div class="ai-chat-panel-header">
      <button class="ai-chat-panel-minimize" aria-label="Minimize">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <span class="ai-chat-panel-title">Tesla Assist</span>
      <button class="ai-chat-panel-close" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
      </button>
    </div>
    <div class="ai-chat-messages" id="ai-chat-messages">
      <div class="ai-chat-msg ai-msg">
        <div class="ai-msg-row">
          <div class="ai-avatar" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 342 35" fill="currentColor"><path d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zM308.5 7h26a9.6 9.6 0 0 0 7.1-7h-40.2a9.6 9.6 0 0 0 7 7z"/></svg>
          </div>
          <div class="ai-chat-bubble">Hello! How can I help you today?</div>
        </div>
        <div class="ai-msg-feedback">
          <button class="feedback-btn" aria-label="Helpful">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          </button>
          <button class="feedback-btn" aria-label="Not helpful">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
          </button>
        </div>
      </div>
    </div>
    <div class="ai-chat-disclaimer">
      Tesla Assist uses AI, mistakes may occur. <a href="#" class="ai-chat-tcs">T&amp;Cs Apply</a>
    </div>
    <div class="ai-chat-input-row">
      <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Type a new message" />
      <button class="ai-chat-send" id="ai-chat-send" aria-label="Send">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
      </button>
    </div>
  `;

  chatBtn.onclick = () => {
    chatPanel.classList.add('open');
    chatBtn.classList.add('hidden');
  };

  // Close button inside panel
  chatPanel.querySelector('.ai-chat-panel-close').onclick = () => {
    chatPanel.classList.remove('open');
    chatBtn.classList.remove('hidden');
  };
  // Minimize button — same behaviour as close (hides panel, shows FAB)
  chatPanel.querySelector('.ai-chat-panel-minimize').onclick = () => {
    chatPanel.classList.remove('open');
    chatBtn.classList.remove('hidden');
  };

  // ─── Smart AI Response Engine ───
  function getAIResponse(query) {
    const q = query.toLowerCase();
    const state = configurator.getState();

    // Detect intent
    if (q.match(/hunt|deer|elk|stealth|quiet|camo|wildlife|blind/)) {
      return {
        text: 'For hunting, I\'d recommend the **Hunting Build** — Dark Stainless color blends into the environment, Off-Road suspension handles rough terrain silently, and the Full Guard protects the undercarriage on creek beds.',
        preset: 'hunting',
        ctaText: 'Apply Hunting Build',
      };
    }
    if (q.match(/farm|ranch|work|haul|cargo|carry|utility|agriculture|livestock/)) {
      return {
        text: 'For farm work, the **Farm Build** is ideal — Off-Road 22" wheels grip muddy terrain, Extended Cargo carries tools and supplies, and the Utility Rack handles heavy loads.',
        preset: 'farm',
        ctaText: 'Apply Farm Build',
      };
    }
    if (q.match(/sport|fast|speed|race|track|performance|quick|trail racing/)) {
      return {
        text: 'For performance riding, try the **Sport Build** — Performance suspension lowers the ride height for sharp cornering, Performance 19" wheels maximize grip, and Skid Plates protect at speed.',
        preset: 'sport',
        ctaText: 'Apply Sport Build',
      };
    }
    if (q.match(/trail|ride|where|location|route|path/)) {
      return {
        text: 'Great question! We have 24 curated ATV trails across the US. You can search by location, difficulty, and terrain type. Want me to open the trail finder?',
        action: 'openTrails',
        ctaText: 'Open Trail Finder',
      };
    }
    if (q.match(/range|battery|charge|how far|distance|mile/)) {
      return {
        text: 'The Cyberquad has a **60-mile range** on a full charge. With the Universal Home Charger ($1,990), you get up to 44 mi range/hr. The Mobile Charger ($380) provides 30 mi range/hr — great for on-the-go.',
        config: { category: 'charging', optionId: 'home' },
        ctaText: 'Add Home Charger',
      };
    }
    if (q.match(/speed|fast|mph|acceleration|0.60|quick/)) {
      return {
        text: 'The Cyberquad reaches **60 mph top speed** and does 0-60 in **8.1 seconds**. For maximum performance, the Sport Build with Performance suspension and 19" wheels gives you the sharpest handling.',
        preset: 'sport',
        ctaText: 'Apply Sport Build',
      };
    }
    if (q.match(/color|paint|look|stainless|red|blue|orange/)) {
      const colors = configurator.CONFIG.colors;
      const colorList = colors.map(c => `${c.name}${c.price > 0 ? ' ($' + c.price.toLocaleString() + ')' : ''}`).join(', ');
      return {
        text: `You currently have **${state.color.name}** selected. Available colors: ${colorList}. Mars Red is popular for Sport builds, Dark Stainless for Hunting.`,
      };
    }
    if (q.match(/wheel|tire|rim|traction|grip/)) {
      return {
        text: 'We offer 3 wheel options: **Standard 20"** (included) for balanced riding, **Off-Road 22"** ($1,200) for maximum traction, and **Performance 19"** ($2,000) for track-focused grip.',
      };
    }
    if (q.match(/price|cost|how much|total|budget|cheap|expensive/)) {
      const total = configurator.getTotalPrice();
      return {
        text: `Your current build is **$${total.toLocaleString()}** (base $3,990). You can customize each category or try a Quick Build preset to see bundled pricing.`,
      };
    }
    if (q.match(/satellite|connect|spacex|gps|signal|remote/)) {
      return {
        text: 'The **Space X Satellite connection** ($600) keeps you connected even in the most remote locations — perfect for backcountry hunting or remote farm work.',
        config: { category: 'connectivity', optionId: 'satellite' },
        ctaText: 'Add Satellite Connection',
      };
    }
    if (q.match(/protect|guard|skid|armor|underb/)) {
      return {
        text: '**Skid Plates** ($700) provide underbody armor for light trail riding. **Full Guard** ($1,400) is the complete protection package — recommended for off-road and hunting builds.',
        config: { category: 'protection', optionId: 'full' },
        ctaText: 'Add Full Guard',
      };
    }
    if (q.match(/recommend|suggest|best|should|what do you/)) {
      return {
        text: 'It depends on how you\'ll use your Cyberquad! Tell me about your riding style:\n• **Trail racing or sport?** → Sport Build\n• **Farm or ranch work?** → Farm Build\n• **Hunting or outdoors?** → Hunting Build\nOr ask me about specific features!',
      };
    }
    if (q.match(/hi|hello|hey|sup|what can you/)) {
      return {
        text: 'Hey! I\'m your Cyberquad AI assistant. I can help you:\n• Choose the right build for your needs\n• Find ATV-friendly trails near you\n• Compare specs and pricing\n• Recommend specific accessories\n\nWhat are you looking for?',
      };
    }
    if (q.match(/reset|default|start over|clear/)) {
      return {
        text: 'I\'ll reset your configurator back to the default settings.',
        action: 'resetToDefault',
        ctaText: 'Reset to Default',
      };
    }
    // Fallback
    return {
      text: 'I can help with build recommendations, trail finding, specs, and pricing. Try asking things like:\n• "What\'s the best build for hunting?"\n• "How far can I ride on a charge?"\n• "Find trails near Tennessee"\n• "What colors are available?"',
    };
  }

  function addAIMessage(messages, response) {
    const aiMsg = el('div', 'ai-chat-msg ai-msg');
    const aiBubble = el('div', 'ai-chat-bubble');

    // Render markdown-style bold
    aiBubble.innerHTML = response.text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    aiMsg.appendChild(aiBubble);

    // Add CTA button if response has an action
    if (response.ctaText) {
      const ctaBtn = el('button', 'ai-chat-cta');
      ctaBtn.textContent = response.ctaText;
      ctaBtn.onclick = () => {
        ctaBtn.disabled = true;
        ctaBtn.textContent = 'Applied ✓';
        ctaBtn.classList.add('applied');

        if (response.preset) {
          // Apply preset via Quick Builds tab
          document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
          const matchTab = document.querySelector(`.preset-tab[data-preset="${response.preset}"]`);
          if (matchTab) matchTab.click();
        } else if (response.action === 'openTrails') {
          openTrailModal();
        } else if (response.action === 'resetToDefault') {
          resetAllToDefaults();
        } else if (response.config) {
          // Apply a specific option
          const { category, optionId } = response.config;
          const opt = configurator.CONFIG[category]?.find(o => o.id === optionId);
          if (opt) {
            if (category === 'charging') {
              configurator.applyCharging(opt, true);
              const card = document.querySelector(`[data-category="${category}"][data-option-id="${optionId}"]`);
              if (card) card.classList.add('active');
            } else {
              const applyFns = {
                connectivity: configurator.applyConnectivity,
                protection: configurator.applyProtection,
                cargo: configurator.applyCargo,
                wheels: configurator.applyWheels,
                suspension: configurator.applySuspension,
              };
              if (applyFns[category]) {
                applyFns[category](opt);
                document.querySelectorAll(`[data-category="${category}"]`).forEach(o => o.classList.remove('active'));
                const card = document.querySelector(`[data-category="${category}"][data-option-id="${optionId}"]`);
                if (card) card.classList.add('active');
              }
            }
            updatePrice();
          }
        }
      };
      aiMsg.appendChild(ctaBtn);
    }

    messages.appendChild(aiMsg);
    messages.scrollTop = messages.scrollHeight;
  }

  const sendMessage = () => {
    const input = document.getElementById('ai-chat-input');
    const messages = document.getElementById('ai-chat-messages');
    if (!input || !messages || !input.value.trim()) return;

    const query = input.value.trim();

    // Add user message
    const userMsg = el('div', 'ai-chat-msg user-msg');
    const userBubble = el('div', 'ai-chat-bubble');
    userBubble.textContent = query;
    userMsg.appendChild(userBubble);
    messages.appendChild(userMsg);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Typing indicator
    const typingMsg = el('div', 'ai-chat-msg ai-msg');
    const typingBubble = el('div', 'ai-chat-bubble ai-typing');
    typingBubble.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    typingMsg.appendChild(typingBubble);
    messages.appendChild(typingMsg);
    messages.scrollTop = messages.scrollHeight;

    // Simulate AI thinking delay
    setTimeout(() => {
      messages.removeChild(typingMsg);
      const response = getAIResponse(query);
      addAIMessage(messages, response);
    }, 800 + Math.random() * 600);
  };

  chatPanel.querySelector('#ai-chat-send').onclick = sendMessage;
  chatPanel.querySelector('#ai-chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  appUI.appendChild(chatPanel);
  appUI.appendChild(chatBtn);
}

// ─── Trail Finder Modal ───
function buildTrailModal() {
  const modal = document.getElementById('trail-modal');
  const body = document.getElementById('trail-body');
  const closeBtn = document.getElementById('trail-close');
  const searchInput = document.getElementById('trail-search');
  if (!modal || !body || !closeBtn || !searchInput) return;

  // Close handlers
  closeBtn.onclick = closeTrailModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeTrailModal();
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeTrailModal();
  });

  // Difficulty tab handlers
  document.querySelectorAll('.trail-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.trail-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTrails();
    };
  });

  // Search input (debounced)
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(renderTrails, 200);
  });

  renderTrails();
}

function renderTrails() {
  const body = document.getElementById('trail-body');
  if (!body) return;
  body.innerHTML = '';

  const query = (document.getElementById('trail-search')?.value || '').toLowerCase();
  const activeDifficulty = document.querySelector('.trail-tab.active')?.dataset.difficulty || 'all';

  const filtered = ATV_TRAILS.filter(trail => {
    const matchesDifficulty = activeDifficulty === 'all' || trail.difficulty === activeDifficulty;
    const stateFull = STATE_NAMES[trail.state] || '';
    const searchStr = `${trail.name} ${trail.city} ${trail.state} ${stateFull} ${trail.terrain} ${trail.description}`.toLowerCase();
    const matchesSearch = !query || searchStr.includes(query);
    return matchesDifficulty && matchesSearch;
  });

  if (filtered.length === 0) {
    const noResults = el('div', 'trail-no-results');
    noResults.textContent = 'No trails found. Try a different search or filter.';
    body.appendChild(noResults);
    return;
  }

  filtered.forEach(trail => body.appendChild(createTrailCard(trail)));
}

function createTrailCard(trail) {
  const card = el('div', 'trail-card');

  // Header: name + difficulty badge
  const header = el('div', 'trail-card-header');
  const name = el('div', 'trail-card-name');
  name.textContent = trail.name;
  header.appendChild(name);

  const badge = el('span', `trail-difficulty-badge difficulty-${trail.difficulty.toLowerCase()}`);
  badge.textContent = trail.difficulty;
  header.appendChild(badge);
  card.appendChild(header);

  // Location
  const location = el('div', 'trail-card-location');
  location.textContent = `${trail.city}, ${trail.state}`;
  card.appendChild(location);

  // Meta: distance + terrain
  const meta = el('div', 'trail-card-meta');
  const distSpan = el('span', '');
  distSpan.textContent = `${trail.distance} mi`;
  const dot = el('span', '');
  dot.textContent = '\u00B7';
  const terrainSpan = el('span', '');
  terrainSpan.textContent = trail.terrain;
  meta.appendChild(distSpan);
  meta.appendChild(dot);
  meta.appendChild(terrainSpan);
  card.appendChild(meta);

  // Description
  const desc = el('div', 'trail-card-desc');
  desc.textContent = trail.description;
  card.appendChild(desc);

  // Actions: directions + recommended build
  const actionsRow = el('div', 'trail-card-actions');

  const directionsLink = document.createElement('a');
  directionsLink.className = 'trail-directions-link';
  directionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${trail.lat},${trail.lng}`;
  directionsLink.target = '_blank';
  directionsLink.rel = 'noopener noreferrer';
  directionsLink.innerHTML = `<span>Get Directions</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  actionsRow.appendChild(directionsLink);

  const presetName = configurator.PRESETS[trail.preset]?.name || trail.preset;
  const buildBadge = el('button', 'trail-build-badge');
  buildBadge.textContent = `${presetName} Build`;
  buildBadge.onclick = () => {
    document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
    const matchTab = document.querySelector(`.preset-tab[data-preset="${trail.preset}"]`);
    if (matchTab) matchTab.click();
    closeTrailModal();
  };
  actionsRow.appendChild(buildBadge);

  card.appendChild(actionsRow);
  return card;
}

function openTrailModal() {
  const modal = document.getElementById('trail-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeTrailModal() {
  const modal = document.getElementById('trail-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}
