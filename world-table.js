/* Layout and viewport navigation only. Grid data, scoring and saves stay in the game. */
(() => {
  'use strict';
  const colors = [
    ['yellow', 'Geel', '#f1d366'], ['purple', 'Paars', '#bb96e5'],
    ['red', 'Rood', '#ef8c99'], ['green', 'Groen', '#94d5a1'], ['blue', 'Blauw', '#80bced']
  ];
  const $ = id => document.getElementById(id);
  const homes = new Map();
  const frames = new Map();
  let app, focused = 'purple', queued = false, phone = false;
  let suppressedUntil = 0;
  const enabled = () => !document.body?.classList.contains('classic-mode');
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function move(node, parent) {
    if (!node || !parent || node.parentNode === parent) return;
    if (!homes.has(node)) {
      const marker = document.createComment(`table-home:${node.id}`);
      node.before(marker);
      homes.set(node, marker);
    }
    parent.append(node);
  }
  function button(label, text, className) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = className;
    b.setAttribute('aria-label', label); b.title = label; b.textContent = text;
    return b;
  }
  function suspend() {
    if (!app) return;
    for (const [node, marker] of homes) if (marker.parentNode) marker.after(node);
    for (const {zone} of frames.values()) {
      zone.style.removeProperty('--cell-size'); zone.style.removeProperty('--board-grid-gap');
    }
    document.body.classList.remove('table-ui', 'table-phone', 'table-landscape');
    app.hidden = true;
  }
  function create() {
    app = document.createElement('main');
    app.id = 'table-app';
    app.innerHTML = '<header id="table-header"><div id="table-brand"><span class="table-mark" aria-hidden="true">▦</span><span>LOCUS<small>Een wereld in elke zet</small></span></div><div id="table-objective"></div><div id="table-tools"></div></header><aside id="table-status" aria-label="Score en bonussen"></aside><section id="table-world" aria-label="Speelwereld"><nav id="table-tabs" aria-label="Kies een kleurgebied"></nav><div id="table-stage"></div></section><aside id="table-hand" aria-label="Jouw hand"></aside>';
    document.body.append(app);
    const help = button('Spelregels', '?', 'table-tool');
    help.onclick = () => showRulesModal();
    $('table-tools').append(help);
    const cancel = button('Annuleer selectie', '×', 'table-tool');
    cancel.id = 'table-cancel'; cancel.disabled = true;
    cancel.onclick = () => {
      if (activeBonusPlacement) cancelActiveBonusPlacement({updateInventory:true, hidePreview:true});
      else cleanupDragState({clearBonus:false, hidePreview:true});
      schedule();
    };
    $('table-tools').prepend(cancel);
    colors.forEach(([key, name, color]) => {
      const zone = $(`${key}-zone`);
      const frame = document.createElement('section');
      frame.className = 'table-zone-frame'; frame.dataset.zone = key;
      frame.style.setProperty('--zone-tint', color);
      frame.setAttribute('aria-label', `${name} speelgebied`);
      zone.before(frame); move(zone, frame);
      const label = document.createElement('span');
      label.className = 'table-zone-label'; label.textContent = name;
      label.setAttribute('aria-hidden', 'true'); frame.append(label);
      const cues = {};
      for (const [dir, symbol, word] of [['left','‹','links'],['right','›','rechts'],['top','⌃','boven'],['bottom','⌄','beneden']]) {
        const cue = button(`${name}: schuif naar ${word}`, symbol, `table-edge table-edge-${dir}`);
        cue.hidden = true;
        cue.onclick = e => {
          e.stopPropagation();
          zone.scrollBy({left: (dir === 'left' ? -1 : dir === 'right' ? 1 : 0) * zone.clientWidth * .36,
            top: (dir === 'top' ? -1 : dir === 'bottom' ? 1 : 0) * zone.clientHeight * .36,
            behavior: reducedMotion() ? 'instant' : 'smooth'});
        };
        frame.append(cue); cues[dir] = cue;
      }
      // Override legacy touch-action:none even if an older stylesheet is still cached.
      // Native pan gestures are essential for smooth momentum scrolling on phones/tablets.
      zone.style.setProperty('touch-action', 'pan-x pan-y', 'important');
      zone.style.setProperty('scroll-behavior', 'auto', 'important');
      zone.style.setProperty('-webkit-overflow-scrolling', 'touch');
      zone.tabIndex = 0;
      zone.setAttribute('aria-label', `${name} speelveld. Gebruik de pijltjestoetsen om te verschuiven.`);
      zone.addEventListener('scroll', () => updateEdges(key), {passive: true});
      zone.addEventListener('keydown', e => {
        if (e.target !== zone || !e.key.startsWith('Arrow')) return;
        const map = {ArrowLeft:'left', ArrowRight:'right', ArrowUp:'top', ArrowDown:'bottom'};
        if (map[e.key]) { e.preventDefault(); cues[map[e.key]].click(); }
      });
      bindPan(zone);
      const tab = button(`${name} speelgebied`, name, 'table-tab');
      tab.style.setProperty('--zone-tint', color);
      tab.setAttribute('aria-controls', zone.id);
      tab.onclick = () => focus(zone);
      // Some legacy touch handlers suppress the compatibility click after a pan.
      // Focus is idempotent, so pointerup keeps color navigation reliable on touch.
      tab.addEventListener('pointerup', e => {
        if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
        e.preventDefault(); e.stopPropagation(); focus(zone);
      });
      $('table-tabs').append(tab);
      frames.set(key, {frame, zone, cues, tab, generation: null});
      new ResizeObserver(schedule).observe(zone);
      new MutationObserver(schedule).observe(zone, {childList:true, subtree:true});
    });
    const details = button('Toon scores per kleur', 'Scores per kleur', 'table-score-details');
    details.setAttribute('aria-expanded', 'false');
    details.onclick = () => {
      const open = app.classList.toggle('table-scores-open');
      details.setAttribute('aria-expanded', String(open));
    };
    $('table-status').append(details);
    new MutationObserver(schedule).observe($('card-options'), {childList:true, subtree:true, attributes:true, attributeFilter:['class']});
  }
  function updateEdges(key) {
    const item = frames.get(key);
    if (!item) return;
    const {zone, frame, cues} = item;
    const edges = {left: zone.scrollLeft > 2, top: zone.scrollTop > 2,
      right: zone.scrollWidth - zone.clientWidth - zone.scrollLeft > 2,
      bottom: zone.scrollHeight - zone.clientHeight - zone.scrollTop > 2};
    for (const [dir, more] of Object.entries(edges)) {
      cues[dir].hidden = !more || !zone.clientWidth;
      frame.classList.toggle(`more-${dir}`, more);
    }
    zone.classList.toggle('table-scrollable', Object.values(edges).some(Boolean));
  }
  function bindPan(zone) {
    // Observe touch intent without moving the viewport or capturing the pointer.
    // Native overflow owns touch/pen momentum; only mouse drags scroll in JS.
    let gesture = null;
    const reset = () => {
      gesture = null;
      zone.classList.remove('table-panning');
      zone.dataset.dragScrolling = 'false';
    };
    zone.addEventListener('pointerdown', e => {
      if (!enabled() || e.button !== 0 || e.target.closest('button,.zone-info-popover')) return;
      if (typeof draggedBlock !== 'undefined' && draggedBlock) return;
      if (gesture) return;
      suppressedUntil = 0;
      gesture = {id:e.pointerId, x:e.clientX, y:e.clientY,
        left:zone.scrollLeft, top:zone.scrollTop, moved:false,
        native:e.pointerType === 'touch' || e.pointerType === 'pen'};
      // Legacy cells activate on pointerdown. Defer activation until a real tap,
      // without preventDefault: the browser must still be allowed to start a pan.
      e.stopImmediatePropagation();
    }, true);
    zone.addEventListener('pointermove', e => {
      if (!gesture || gesture.id !== e.pointerId) return;
      const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
      if (!gesture.moved && Math.hypot(dx, dy) < 7) return;
      gesture.moved = true;
      zone.dataset.dragScrolling = 'true';
      if (gesture.native) return;
      zone.classList.add('table-panning');
      if (!zone.hasPointerCapture(e.pointerId)) zone.setPointerCapture(e.pointerId);
      zone.scrollLeft = gesture.left - dx;
      zone.scrollTop = gesture.top - dy;
      if (e.cancelable) e.preventDefault();
      e.stopImmediatePropagation();
    }, true);
    const end = e => {
      if (!gesture || gesture.id !== e.pointerId) return;
      // pointercancel is the normal hand-off to the browser's native scroller.
      const moved = gesture.moved || e.type === 'pointercancel' ||
        Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) >= 7;
      if (moved) {
        suppressedUntil = performance.now() + 400;
        e.stopImmediatePropagation();
      } else if (typeof debugMode !== 'undefined' && debugMode) {
        const cell = e.target.closest('.cell');
        if (cell) toggleCell(cell, cell.dataset.zoneId);
        suppressedUntil = performance.now() + 400;
        e.stopImmediatePropagation();
      } else if (gesture.native) {
        // One tap, one placement: the compatibility click is suppressed below.
        suppressedUntil = performance.now() + 400;
        if (typeof handleTouchCellPlacement === 'function') handleTouchCellPlacement(e);
        e.stopImmediatePropagation();
      }
      if (!gesture.native && zone.hasPointerCapture(e.pointerId)) zone.releasePointerCapture(e.pointerId);
      reset();
    };
    zone.addEventListener('pointerup', end, true);
    zone.addEventListener('pointercancel', end, true);
    zone.addEventListener('lostpointercapture', reset);
  }
  // Registered before the game's document click handler, so a pan can never place a card.
  document.addEventListener('click', e => {
    if (enabled() && e.target.closest('.table-zone-frame') && performance.now() < suppressedUntil) {
      e.preventDefault(); e.stopImmediatePropagation();
    }
  }, true);
  function focus(zone) {
    if (!zone || !frames.has(zone.id.replace('-zone',''))) return;
    if (zone.style.display === 'none') return;
    focused = zone.id.replace('-zone','');
    layout();
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; if (enabled()) layout(); });
  }
  function fitCards() {
    document.querySelectorAll('#card-options .card-option').forEach(card => {
      const cols = Number(card.dataset.shapeCols) || 3, rows = Number(card.dataset.shapeRows) || 4;
      const size = Math.max(7, Math.min(22, (card.clientWidth - 24) / cols, (card.clientHeight - 30) / rows));
      card.style.setProperty('--preview-cell', `${size}px`);
      const pattern = card.querySelector('.card-pattern');
      if (pattern) {
        pattern.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
        pattern.style.gridTemplateRows = `repeat(${rows}, ${size}px)`;
      }
    });
  }
  function anchorGreenStart(zone) {
    if (!zone) return;
    const grid = zone.querySelector('#green-grid, .grid');
    if (!grid) return;
    const sx = Number(grid.dataset.startX), sy = Number(grid.dataset.startY);
    let start = null;
    if (Number.isFinite(sx) && Number.isFinite(sy)) {
      start = grid.querySelector(`.cell[data-x="${sx}"][data-y="${sy}"]`);
    }
    if (!start) start = grid.querySelector('.cell.bold-cell:not(.void-cell), .cell.root-cell:not(.void-cell)');
    if (!start || !zone.clientWidth || !zone.clientHeight) return;
    const centerX = (grid.offsetLeft || 0) + start.offsetLeft + start.offsetWidth / 2;
    const centerY = (grid.offsetTop || 0) + start.offsetTop + start.offsetHeight / 2;
    const maxLeft = Math.max(0, zone.scrollWidth - zone.clientWidth);
    const maxTop = Math.max(0, zone.scrollHeight - zone.clientHeight);
    zone.scrollLeft = Math.max(0, Math.min(maxLeft, centerX - zone.clientWidth / 2));
    zone.scrollTop = Math.max(0, Math.min(maxTop, centerY - zone.clientHeight / 2));
  }
  function anchorBlueStart(zone) {
    if (!zone) return;
    const grid = zone.querySelector('#blue-grid, .grid');
    if (!grid) return;
    const allCells = [...grid.querySelectorAll('.cell:not(.void-cell)')];
    if (!allCells.length) return;
    let bestY = -Infinity;
    for (const cell of allCells) {
      const y = Number(cell.dataset.y);
      if (Number.isFinite(y) && y > bestY) bestY = y;
    }
    const bottomRowCells = allCells.filter(c => Number(c.dataset.y) === bestY);
    const bottomBold = bottomRowCells.filter(c => c.classList.contains('bold-cell'));
    const anchorCells = bottomBold.length ? bottomBold : bottomRowCells;
    zone.scrollTop = zone.scrollHeight;
    const maxLeft = Math.max(0, zone.scrollWidth - zone.clientWidth);
    if (!anchorCells.length) {
      zone.scrollLeft = maxLeft > 0 ? Math.round(maxLeft / 2) : 0;
      return;
    }
    const centers = anchorCells.map(c => c.offsetLeft + c.offsetWidth / 2);
    const minC = Math.min(...centers);
    const maxC = Math.max(...centers);
    const desiredLeft = ((minC + maxC) / 2) - (zone.clientWidth / 2);
    zone.scrollLeft = Math.max(0, Math.min(maxLeft, desiredLeft));
  }
  function citadelLayout(keys, subLevel) {
    // Keep long routes tall, with the other districts alternating around them.
    // Every named CSS area stays rectangular so no cells or hitboxes are clipped.
    const spine = ['blue','green'].find(key => keys.includes(key)) || keys[keys.length - 1];
    const districts = keys.filter(key => key !== spine);
    if (!spine || !districts.length) return null;
    const turn = (Math.max(1, Number(subLevel) || 1) - 1) % districts.length;
    const rest = districts.slice(turn).concat(districts.slice(0, turn));
    let rows, columns;
    if (keys.length === 3) {
      rows = [[rest[0],rest[0],spine],[rest[1],rest[1],spine]];
      columns = '1fr 1fr 1.25fr';
    } else if (keys.length === 4) {
      rows = [[rest[0],rest[0],spine],[rest[1],rest[2],spine]];
      columns = '1fr 1fr 1.1fr';
    } else if (keys.length === 5) {
      rows = [[rest[0],rest[0],spine,rest[1],rest[1]],
              [rest[2],rest[2],spine,rest[3],rest[3]]];
      columns = '1fr 1fr 1.5fr 1fr 1fr';
    } else return null;
    if (subLevel % 2 === 0) {
      rows = rows.map(row => row.slice().reverse());
      columns = columns.split(' ').reverse().join(' ');
    }
    return {areas:rows.map(row => '"' + row.join(' ') + '"').join(' '), columns};
  }
  function layout() {
    if (!enabled()) { suspend(); return; }
    if (!app) create();
    app.hidden = false;
    phone = innerWidth <= 640 || Math.min(innerWidth, innerHeight) < 600;
    document.body.classList.add('table-ui');
    document.body.classList.toggle('table-phone', phone);
    document.body.classList.toggle('table-landscape', phone && innerWidth > innerHeight);
    document.body.classList.remove('desktop-portrait','desktop-landscape','touch-portrait','mobile-sidebar-layout','zoomed-in','board-loading','layout-reflow');
    const destinations = {board:'table-stage', 'objective-zone':'table-objective', scoreboard:'table-status',
      'gold-zone':'table-status', 'bonus-zone':'table-status', 'card-choice-zone':'table-hand', 'menu-toggle':'table-tools'};
    for (const [id, target] of Object.entries(destinations)) move($(id), $(target));
    let levelLabel = $('table-level');
    if (!levelLabel) {
      levelLabel = document.createElement('div'); levelLabel.id = 'table-level';
      $('table-objective').prepend(levelLabel);
    }
    if (typeof currentLevel !== 'undefined' && typeof getWorldAndSubLevel === 'function') {
      const info = getWorldAndSubLevel(currentLevel);
      const text = `Wereld ${info.world} · Level ${info.world}.${info.subLevel}`;
      if (levelLabel.textContent !== text) levelLabel.textContent = text;
    }
    move($('world4-phase-bar'), $('table-world'));
    move($('world4-citadel-core-badge'), $('table-stage'));
    move($('card-action-buttons'), $('card-controls'));
    move($('controls'), document.body);
    for (const {zone, frame} of frames.values()) if (zone.parentNode !== frame) move(zone, frame);
    const visible = [...frames.entries()].filter(([,x]) => x.zone.style.display !== 'none');
    if (!visible.some(([k]) => k === focused)) focused = visible[0]?.[0] || 'purple';
    $('board').dataset.visibleZones = String(visible.length);
    $('board').style.setProperty('--table-active-areas', `"${visible.map(([key]) => key).join(' ')}"`);
    const worldInfo = typeof currentLevel !== 'undefined' && typeof getWorldAndSubLevel === 'function'
      ? getWorldAndSubLevel(currentLevel) : null;
    const citadel = worldInfo?.world === 4 ? citadelLayout(visible.map(([key]) => key), worldInfo.subLevel) : null;
    $('board').toggleAttribute('data-table-citadel', !!citadel);
    if (citadel) {
      $('board').style.setProperty('--citadel-areas', citadel.areas);
      $('board').style.setProperty('--citadel-columns', citadel.columns);
    } else {
      $('board').style.removeProperty('--citadel-areas');
      $('board').style.removeProperty('--citadel-columns');
    }
    // Resolve visibility first: all zones share the size that fits purple, even
    // when another color is focused on a phone and purple itself has no box.
    for (const [key, {zone, frame, tab}] of frames) {
      const isHidden = zone.style.display === 'none' || (phone && key !== focused);
      frame.hidden = isHidden;
      frame.style.display = isHidden ? 'none' : (phone ? 'block' : '');
      if (phone && !isHidden) {
        frame.style.width = '100%';
        frame.style.minWidth = '0';
      } else {
        frame.style.removeProperty('width');
        frame.style.removeProperty('min-width');
      }
      tab.hidden = zone.style.display === 'none';
      tab.setAttribute('aria-pressed', String(key === focused));
    }
    const reference = frames.get('purple');
    const referenceGrid = reference.zone.querySelector('.grid');
    const viewport = reference.zone.clientWidth ? reference.zone : frames.get(focused).zone;
    const cols = Number(referenceGrid?.dataset.cols) || 10;
    const rows = Number(referenceGrid?.dataset.rows) || 10;
    // A phone should not get larger cells merely because the current world's purple
    // board happens to be smaller. Worlds 2/3 naturally use ~13–14 cells as their
    // reference; use the same minimum density everywhere. This removes the World 1
    // jump from ~28px to ~22px on a 390px-wide phone and makes orientation changes stable.
    const mobileReference = 14;
    const fitCols = phone ? Math.max(cols, mobileReference) : cols;
    const fitRows = phone ? Math.max(rows, mobileReference) : rows;
    const cell = Math.floor(Math.max(14, Math.min(phone ? 44 : 34,
      (viewport.clientWidth - 28) / fitCols - 2, (viewport.clientHeight - 50) / fitRows - 2)));
    document.body.style.setProperty('--table-cell-size', `${cell}px`);
    const menuButton = $('menu-toggle').getBoundingClientRect();
    $('controls').style.setProperty('--table-menu-top', `${menuButton.bottom + 8}px`);
    $('controls').style.setProperty('--table-menu-right', `${Math.max(8, innerWidth - menuButton.right)}px`);
    for (const [key, item] of frames) {
      const {zone} = item;
      zone.style.setProperty('--cell-size', `${Math.floor(cell)}px`);
      zone.style.setProperty('--board-grid-gap', '2px');
      // Force every rendered cell to the same pixel size to avoid per-zone drift.
      zone.querySelectorAll('.cell, .root-cell').forEach(c => {
        c.style.width = `${Math.floor(cell)}px`;
        c.style.height = `${Math.floor(cell)}px`;
        c.style.minWidth = `${Math.floor(cell)}px`;
        c.style.minHeight = `${Math.floor(cell)}px`;
        c.style.maxWidth = `${Math.floor(cell)}px`;
        c.style.maxHeight = `${Math.floor(cell)}px`;
      });
      // Root grids are absolutely positioned; preserve their original logical coordinates.
      zone.querySelectorAll('.grid, [data-subgrid]').forEach(g => {
        if (g.querySelector('.root-cell')) {
          const cells = [...g.querySelectorAll('.cell')];
          const maxX = Math.max(0, ...cells.map(c => Number(c.dataset.x) || 0));
          const maxY = Math.max(0, ...cells.map(c => Number(c.dataset.y) || 0));
          g.style.width = `${(maxX + 1) * Math.floor(cell)}px`;
          g.style.height = `${(maxY + 1) * Math.floor(cell)}px`;
        }
      });
      // Anchor a newly generated map once. Never recenter a user's already explored map.
      const generation = zone.querySelector('.cell');
      if (generation && zone.clientWidth && item.generation !== generation) {
        item.generation = generation;
        if (key === 'green') {
          anchorGreenStart(zone);
        } else if (key === 'blue') {
          anchorBlueStart(zone);
        }
      }
      updateEdges(key);
    }
    fitCards();
    $('table-cancel').disabled = !(document.querySelector('#card-options .selected') ||
      (typeof activeBonusPlacement !== 'undefined' && activeBonusPlacement) ||
      (typeof draggedBlock !== 'undefined' && draggedBlock));
    if (typeof invalidateLayoutCache === 'function') invalidateLayoutCache();
  }
  function zoneForColor(color) {
    const name = typeof color === 'object' ? color?.name : color;
    return [...frames.values()].find(x => x.zone.dataset.color === name)?.zone || frames.get(focused)?.zone;
  }
  function cellSize(root) {
    const node = typeof root === 'string' ? document.querySelector(root) : root;
    const zone = node?.closest?.('.table-zone-frame')?.querySelector(':scope > .zone') || node || frames.get(focused)?.zone;
    return parseFloat(zone && getComputedStyle(zone).getPropertyValue('--cell-size')) || 26;
  }
  window.LocusTable = {enabled, layout, schedule, focus, suspend, fitCards, zoneForColor, cellSize};
  addEventListener('resize', schedule);
  document.addEventListener('DOMContentLoaded', schedule);
})();
