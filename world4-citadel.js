/* LOCUS — World 4: The Citadel
   Scoped progression, stars, ruins and boss presentation for levels 31–40 only.
   Worlds 1–3 are intentionally untouched. */
(() => {
  'use strict';

  const COLOR_LABEL = { geel:'Geel', rood:'Rood', groen:'Groen', paars:'Paars', blauw:'Blauw' };
  const SCORE_KEY = { geel:'yellow', rood:'red', groen:'green', paars:'purple', blauw:'blue' };
  const ALL_COLORS = ['geel','groen','blauw','paars','rood'];
  const STAR_STORE_KEY = 'locusWorld4StarsV1';

  const LEVELS = {
    31: {
      id:'4.1', title:'De eerste sleutel', mood:'gate', startColors:['groen','blauw','paars'], scoreTarget:120,
      doors:[
        { id:'w4:31:gate:blue', zone:'blauw', keyColor:'blauw', keyZone:'groen', doorAnchor:[.66,.43], keyAnchor:[.22,.48], lockRegions:1 }
      ],
      primaryText:'Vind de sleutel, open de blauwe poort en scoor 120 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'Open de poort + 120 punten' },
        { type:'noBonus', label:'Geen bonussen', detail:'Gebruik geen bonusblokken' },
        { type:'maxActive', value:38, label:'Compact', detail:'Maximaal 38 actieve cells' }
      ],
      phases:[
        { type:'key', color:'blauw', label:'Blauwe sleutel' },
        { type:'door', doorId:'w4:31:gate:blue', label:'Eerste poort' },
        { type:'score', value:120, label:'120 punten' }
      ]
    },
    32: {
      id:'4.2', title:'Achter de poort', mood:'gate', startColors:['geel','groen','blauw'], scoreTarget:150,
      doors:[
        { id:'w4:32:gate:blue', zone:'blauw', keyColor:'blauw', keyZone:'geel', doorAnchor:[.62,.48], keyAnchor:[.28,.35], lockRegions:1 }
      ],
      primaryText:'Open het afgesloten gebied en scoor 150 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'Open de poort + 150 punten' },
        { type:'precision', min:150, max:190, label:'Precisiewerk', detail:'Eindig tussen 150–190 punten' },
        { type:'maxActive', value:40, label:'Zuinig bouwen', detail:'Maximaal 40 actieve cells' }
      ],
      phases:[
        { type:'key', color:'blauw', label:'Vind de sleutel' },
        { type:'door', doorId:'w4:32:gate:blue', label:'Open het gebied' },
        { type:'score', value:150, label:'150 punten' }
      ]
    },
    33: {
      id:'4.3', title:'Twee sloten', mood:'gate', startColors:['paars','groen','rood'], scoreTarget:165,
      doors:[
        { id:'w4:33:gate:green', zone:'groen', keyColor:'groen', keyZone:'paars', doorAnchor:[.62,.34], keyAnchor:[.20,.56], lockRegions:1 },
        { id:'w4:33:gate:red', zone:'rood', keyColor:'rood', keyZone:'groen', doorAnchor:[.66,.56], keyAnchor:[.30,.68], lockRegions:1 }
      ],
      primaryText:'Open beide poorten en scoor 165 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'Open 2 poorten + 165 punten' },
        { type:'noLarge', label:'Kleine middelen', detail:'Gebruik geen Large kaart' },
        { type:'maxActive', value:48, label:'Compact', detail:'Maximaal 48 actieve cells' }
      ],
      phases:[
        { type:'door', doorId:'w4:33:gate:green', label:'Groene poort' },
        { type:'door', doorId:'w4:33:gate:red', label:'Rode poort' },
        { type:'score', value:165, label:'165 punten' }
      ]
    },
    34: {
      id:'4.4', title:'De ketting', mood:'chain', startColors:['groen','blauw','rood'], scoreTarget:180,
      doors:[
        { id:'w4:34:gate:blue', zone:'blauw', keyColor:'blauw', keyZone:'groen', doorAnchor:[.60,.40], keyAnchor:[.18,.54], lockRegions:1 },
        { id:'w4:34:gate:red', zone:'rood', keyColor:'rood', keyBehind:'w4:34:gate:blue', doorAnchor:[.66,.58], lockRegions:1 }
      ],
      primaryText:'Vind 2 sleutels, open 2 deuren en scoor 180 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'2 poorten + 180 punten' },
        { type:'noBonus', label:'Geen bonussen', detail:'Gebruik geen bonusblokken' },
        { type:'doorsByTurn', value:10, label:'Snel gekraakt', detail:'Open beide poorten vóór beurt 10' }
      ],
      phases:[
        { type:'key', color:'blauw', label:'Sleutel 1' },
        { type:'door', doorId:'w4:34:gate:blue', label:'Poort 1' },
        { type:'key', color:'rood', label:'Sleutel 2' },
        { type:'door', doorId:'w4:34:gate:red', label:'Poort 2' }
      ]
    },
    35: {
      id:'4.5', title:'Nauwe doorgang', mood:'narrow', startColors:['geel','paars','rood'], scoreTarget:195,
      doors:[
        { id:'w4:35:gate:purple', zone:'paars', keyColor:'paars', keyZone:'geel', doorAnchor:[.64,.36], keyAnchor:[.24,.64], lockRegions:1 },
        { id:'w4:35:gate:red', zone:'rood', keyColor:'rood', keyBehind:'w4:35:gate:purple', doorAnchor:[.62,.62], lockRegions:1 }
      ],
      primaryText:'Open de nauwe route en scoor 195 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'Open 2 poorten + 195 punten' },
        { type:'maxActive', value:44, label:'Efficiënt', detail:'Maximaal 44 actieve cells' },
        { type:'precision', min:195, max:225, label:'Precisiewerk', detail:'Eindig tussen 195–225 punten' }
      ],
      phases:[
        { type:'door', doorId:'w4:35:gate:purple', label:'Buitenpoort' },
        { type:'door', doorId:'w4:35:gate:red', label:'Binnenpoort' },
        { type:'score', value:195, label:'195 punten' }
      ]
    },
    36: {
      id:'4.6', title:'Verzegelde gebieden', mood:'sealed', startColors:['groen','blauw','paars'], scoreTarget:210,
      doors:[
        { id:'w4:36:gate:green', zone:'groen', keyColor:'groen', keyZone:'paars', doorAnchor:[.66,.30], keyAnchor:[.18,.60], lockRegions:2 },
        { id:'w4:36:gate:blue', zone:'blauw', keyColor:'blauw', keyBehind:'w4:36:gate:green', doorAnchor:[.62,.48], lockRegions:2 },
        { id:'w4:36:gate:purple', zone:'paars', keyColor:'paars', keyBehind:'w4:36:gate:blue', doorAnchor:[.68,.64], lockRegions:2 }
      ],
      primaryText:'Open de drie verzegelde gebieden en scoor 210 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'3 poorten + 210 punten' },
        { type:'maxBonuses', value:2, label:'Spaarzaam', detail:'Gebruik maximaal 2 bonussen' },
        { type:'noGolden', label:'Zonder goud', detail:'Gebruik geen gouden kaart' }
      ],
      phases:[
        { type:'door', doorId:'w4:36:gate:green', label:'Zegel I' },
        { type:'door', doorId:'w4:36:gate:blue', label:'Zegel II' },
        { type:'door', doorId:'w4:36:gate:purple', label:'Zegel III' }
      ]
    },
    37: {
      id:'4.7', title:'De ruïne', mood:'ruin', startColors:['groen','geel','paars'], scoreTarget:220,
      doors:[
        { id:'w4:37:gate:yellow', zone:'geel', keyColor:'geel', keyZone:'groen', doorAnchor:[.72,.48], keyAnchor:[.20,.52], lockRegions:1 },
        { id:'w4:37:gate:purple', zone:'paars', keyColor:'paars', keyBehind:'w4:37:gate:yellow', doorAnchor:[.64,.60], lockRegions:1 }
      ],
      ruin:{ zone:'geel', pattern:[
        '..###..', '.##X##.', '##XXX##', '.##X##.', '..###..'
      ]},
      primaryText:'Herstel de ruïne, open de poort en scoor 220 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'Herstel de ruïne + 220 punten' },
        { type:'noBonus', label:'Geen bonussen', detail:'Gebruik geen bonusblokken' },
        { type:'maxActive', value:52, label:'Restaurateur', detail:'Maximaal 52 actieve cells' }
      ],
      phases:[
        { type:'door', doorId:'w4:37:gate:yellow', label:'Ruïnepoort' },
        { type:'ruin', label:'Herstel de ruïne' },
        { type:'door', doorId:'w4:37:gate:purple', label:'Binnenpoort' },
        { type:'score', value:220, label:'220 punten' }
      ]
    },
    38: {
      id:'4.8', title:'Verborgen wijk', mood:'reveal', startColors:['groen','blauw','paars'], scoreTarget:240,
      doors:[
        { id:'w4:38:gate:green', zone:'groen', keyColor:'groen', keyZone:'paars', doorAnchor:[.65,.34], keyAnchor:[.22,.62], lockRegions:2 },
        { id:'w4:38:gate:blue', zone:'blauw', keyColor:'blauw', keyBehind:'w4:38:gate:green', doorAnchor:[.66,.56], lockRegions:2, revealOnOpen:['rood'] }
      ],
      primaryText:'Ontgrendel de verborgen rode wijk en scoor 240 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'Ontdek rood + 240 punten' },
        { type:'precision', min:240, max:285, label:'Precisiewerk', detail:'Eindig tussen 240–285 punten' },
        { type:'noLarge', label:'Licht reizen', detail:'Gebruik geen Large kaart' }
      ],
      phases:[
        { type:'door', doorId:'w4:38:gate:green', label:'Eerste doorgang' },
        { type:'door', doorId:'w4:38:gate:blue', label:'Verborgen wijk' },
        { type:'colorVisible', color:'rood', label:'Rood ontdekt' },
        { type:'score', value:240, label:'240 punten' }
      ]
    },
    39: {
      id:'4.9', title:'Voorpoort van de Citadel', mood:'citadel', startColors:['geel','rood','paars'], scoreTarget:280,
      doors:[
        { id:'w4:39:gate:yellow', zone:'geel', keyColor:'geel', keyZone:'paars', doorAnchor:[.66,.34], keyAnchor:[.18,.64], lockRegions:2, revealOnOpen:['groen'] },
        { id:'w4:39:gate:red', zone:'rood', keyColor:'rood', keyBehind:'w4:39:gate:yellow', doorAnchor:[.68,.50], lockRegions:2, revealOnOpen:['blauw'] },
        { id:'w4:39:gate:blue', zone:'blauw', keyColor:'blauw', keyBehind:'w4:39:gate:red', doorAnchor:[.62,.64], lockRegions:2 }
      ],
      primaryText:'Open de drie voorpoorten en scoor 280 punten.',
      stars:[
        { type:'primary', label:'Hoofddoel', detail:'3 poorten + 280 punten' },
        { type:'maxBonuses', value:2, label:'Voorraad bewaren', detail:'Gebruik maximaal 2 bonussen' },
        { type:'finalCard', label:'Laatste zet telt', detail:'Haal het hoofddoel met je laatste kaart' }
      ],
      phases:[
        { type:'door', doorId:'w4:39:gate:yellow', label:'Poort I' },
        { type:'door', doorId:'w4:39:gate:red', label:'Poort II' },
        { type:'door', doorId:'w4:39:gate:blue', label:'Poort III' },
        { type:'score', value:280, label:'Voorpoort voltooid' }
      ]
    },
    40: {
      id:'4.10', title:'De Citadel', mood:'boss', boss:true, startColors:['groen','rood','paars'], scoreTarget:350,
      doors:[
        { id:'w4:40:gate:green', zone:'groen', keyColor:'groen', keyZone:'rood', doorAnchor:[.66,.38], keyAnchor:[.18,.58], lockRegions:2, revealOnOpen:['blauw'] },
        { id:'w4:40:gate:red', zone:'rood', keyColor:'rood', keyBehind:'w4:40:gate:green', doorAnchor:[.64,.55], lockRegions:2 },
        { id:'w4:40:gate:blue', zone:'blauw', keyColor:'blauw', keyBehind:'w4:40:gate:red', doorAnchor:[.66,.64], lockRegions:2, revealOnOpen:['geel'] }
      ],
      core:{ zone:'geel' },
      primaryText:'Open de 3 poorten, activeer de citadelkern en scoor 350 punten.',
      stars:[
        { type:'primary', label:'Bereik de citadelkern', detail:'3 poorten + kern + 350 punten' },
        { type:'maxBonuses', value:2, label:'Beheerst', detail:'Gebruik maximaal 2 bonussen' },
        { type:'maxActive', value:85, label:'Precisie', detail:'Maximaal 85 actieve cells' }
      ],
      phases:[
        { type:'door', doorId:'w4:40:gate:green', label:'Groene poort' },
        { type:'door', doorId:'w4:40:gate:red', label:'Rode poort' },
        { type:'door', doorId:'w4:40:gate:blue', label:'Blauwe poort' },
        { type:'core', label:'Citadelkern' }
      ]
    }
  };

  const freshStats = () => ({
    cardsPlayed:0,
    bonusesUsed:0,
    largeCardsUsed:0,
    goldenCardsUsed:0,
    doorsOpened:[],
    doorOpenTurns:{},
    keysUsed:[],
    maxActiveSeen:0,
    primaryCompletedOnCard:null,
    primaryWasComplete:false
  });

  let runtime = {
    level:null,
    phase:0,
    stats:freshStats(),
    lastScores:null,
    lockedCardReserve:[],
    restoring:false,
    built:false
  };

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
  }

  function currentLevelNumber() {
    try { return Number(currentLevel) || 0; } catch (_) { return 0; }
  }
  function isWorld4(level = currentLevelNumber()) { return level >= 31 && level <= 40; }
  function getLevelConfig(level = currentLevelNumber()) { return LEVELS[Number(level)] || null; }
  function getRuntime() { return runtime; }

  function resetRuntime(level = currentLevelNumber()) {
    runtime = { level:Number(level)||0, phase:0, stats:freshStats(), lastScores:null, lockedCardReserve:[], restoring:false, built:false };
    return runtime;
  }

  function getScoresFallback() {
    try {
      if (typeof latestScoreSnapshot !== 'undefined' && latestScoreSnapshot) return latestScoreSnapshot;
    } catch (_) {}
    const read = id => Number(document.getElementById(id)?.textContent || 0) || 0;
    const yellow = read('yellow-score'), red = read('red-score'), green = read('green-score'), purple = read('purple-score'), blue = read('blue-score');
    return { yellow, red, green, purple, blue, bonus:0, total:yellow+red+green+purple+blue };
  }

  function activeCellCount() {
    if (!isWorld4()) return 0;
    try {
      return document.querySelectorAll('#yellow-zone .cell.active:not(.void-cell),#green-zone .cell.active:not(.void-cell),#blue-zone .cell.active:not(.void-cell),#purple-zone .cell.active:not(.void-cell),#red-zone .cell.active:not(.void-cell)').length;
    } catch (_) { return 0; }
  }

  function scoreTotal(scores = runtime.lastScores || getScoresFallback()) {
    const cfg = getLevelConfig();
    if (!cfg) return Number(scores?.total || 0);
    const visible = allowedColors();
    let total = 0;
    for (const c of visible) total += Number(scores?.[SCORE_KEY[c]] || 0);
    return total;
  }

  function allowedColors() {
    try {
      if (Array.isArray(world4AllowedColors) && world4AllowedColors.length) return world4AllowedColors.slice();
    } catch (_) {}
    const cfg = getLevelConfig();
    return cfg ? cfg.startColors.slice() : [];
  }

  function isDoorOpen(id) {
    try { return typeof isWorld4DoorOpen === 'function' && isWorld4DoorOpen(id); } catch (_) { return false; }
  }
  function isKeyUsed(color) {
    try { return typeof isWorld4ColorUnlocked === 'function' && isWorld4ColorUnlocked(color); } catch (_) { return false; }
  }
  function isColorVisible(color) { return allowedColors().includes(String(color||'').toLowerCase()); }

  function ruinComplete() {
    const cfg = getLevelConfig();
    if (!cfg?.ruin) return true;
    const required = [...document.querySelectorAll('.cell.w4-ruin-required')];
    const forbidden = [...document.querySelectorAll('.cell.w4-ruin-forbidden')];
    return required.length > 0 && required.every(c => c.classList.contains('active')) && forbidden.every(c => !c.classList.contains('active'));
  }

  function coreComplete() {
    const cfg = getLevelConfig();
    if (!cfg?.core) return true;
    const core = document.querySelector('.cell.w4-citadel-core');
    return !!(core && core.classList.contains('active'));
  }

  function requiredDoorsOpen(cfg = getLevelConfig()) {
    if (!cfg) return false;
    return (cfg.doors || []).every(d => isDoorOpen(d.id));
  }

  function isPrimaryComplete(level = currentLevelNumber(), scores = runtime.lastScores || getScoresFallback()) {
    const cfg = getLevelConfig(level);
    if (!cfg) return false;
    const totalOk = scoreTotal(scores) >= Number(cfg.scoreTarget || 0);
    const doorsOk = requiredDoorsOpen(cfg);
    const ruinOk = cfg.ruin ? ruinComplete() : true;
    const coreOk = cfg.core ? coreComplete() : true;
    return totalOk && doorsOk && ruinOk && coreOk;
  }

  function primaryProgressText(level = currentLevelNumber(), scores = runtime.lastScores || getScoresFallback()) {
    const cfg = getLevelConfig(level);
    if (!cfg) return '';
    const open = (cfg.doors || []).filter(d => isDoorOpen(d.id)).length;
    const bits = [];
    if (cfg.doors?.length) bits.push(`${open}/${cfg.doors.length} poorten`);
    if (cfg.ruin) bits.push(ruinComplete() ? 'ruïne ✓' : 'ruïne');
    if (cfg.core) bits.push(coreComplete() ? 'kern ✓' : 'kern');
    bits.push(`${Math.min(scoreTotal(scores), cfg.scoreTarget)}/${cfg.scoreTarget} p`);
    return bits.join(' · ');
  }

  function phaseComplete(phase, scores = runtime.lastScores || getScoresFallback()) {
    if (!phase) return false;
    switch (phase.type) {
      case 'key': return isKeyUsed(phase.color);
      case 'door': return isDoorOpen(phase.doorId);
      case 'ruin': return ruinComplete();
      case 'core': return coreComplete();
      case 'colorVisible': return isColorVisible(phase.color);
      case 'score': return scoreTotal(scores) >= Number(phase.value || 0);
      default: return false;
    }
  }

  function recalcPhase() {
    const cfg = getLevelConfig();
    if (!cfg) return 0;
    let p = 0;
    const phases = cfg.phases || [];
    while (p < phases.length && phaseComplete(phases[p])) p += 1;
    runtime.phase = p;
    return p;
  }

  function evaluateStar(star, scores = runtime.lastScores || getScoresFallback(), atRoundEnd = false) {
    if (!star) return false;
    const stats = runtime.stats || freshStats();
    switch (star.type) {
      case 'primary': return isPrimaryComplete(currentLevelNumber(), scores);
      case 'noBonus': return stats.bonusesUsed === 0;
      case 'maxBonuses': return stats.bonusesUsed <= Number(star.value || 0);
      case 'maxActive': return activeCellCount() <= Number(star.value || 0);
      case 'precision': {
        const total = scoreTotal(scores);
        return total >= Number(star.min || 0) && total <= Number(star.max || Infinity);
      }
      case 'noLarge': return stats.largeCardsUsed === 0;
      case 'noGolden': return stats.goldenCardsUsed === 0;
      case 'doorsByTurn': {
        const cfg = getLevelConfig();
        return !!cfg && (cfg.doors || []).every(d => {
          const t = Number(stats.doorOpenTurns?.[d.id]);
          return Number.isFinite(t) && t <= Number(star.value || 0);
        });
      }
      case 'finalCard': {
        if (!atRoundEnd) return stats.primaryCompletedOnCard != null;
        return stats.primaryCompletedOnCard != null && Number(stats.primaryCompletedOnCard) === Number(stats.cardsPlayed);
      }
      default: return false;
    }
  }

  function getStarResults(scores = runtime.lastScores || getScoresFallback(), atRoundEnd = false) {
    const cfg = getLevelConfig();
    if (!cfg) return [];
    return (cfg.stars || []).map((star, i) => ({ ...star, index:i, earned:evaluateStar(star, scores, atRoundEnd) }));
  }

  function getSavedStars() {
    try { return JSON.parse(localStorage.getItem(STAR_STORE_KEY) || '{}') || {}; } catch (_) { return {}; }
  }
  function commitStars(scores = runtime.lastScores || getScoresFallback()) {
    const cfg = getLevelConfig();
    if (!cfg || !isPrimaryComplete(currentLevelNumber(), scores)) return 0;
    const count = getStarResults(scores, true).filter(x => x.earned).length;
    try {
      const saved = getSavedStars();
      const key = String(currentLevelNumber());
      saved[key] = Math.max(Number(saved[key] || 0), count);
      localStorage.setItem(STAR_STORE_KEY, JSON.stringify(saved));
    } catch (_) {}
    return count;
  }

  function ensureHud() {
    if (!isWorld4()) return null;
    const zone = document.getElementById('objective-zone');
    if (!zone) return null;
    let strip = document.getElementById('world4-star-strip');
    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'world4-star-strip';
      strip.setAttribute('aria-label','Sterdoelen voor Wereld 4');
      zone.appendChild(strip);
    }
    return strip;
  }

  function ensurePhaseBar() {
    if (!isWorld4()) return null;
    let host = document.getElementById('table-world') || document.getElementById('board')?.parentElement;
    if (!host) return null;
    let bar = document.getElementById('world4-phase-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'world4-phase-bar';
      host.appendChild(bar);
    }
    return bar;
  }

  function renderHud(scores = runtime.lastScores || getScoresFallback()) {
    if (!isWorld4()) {
      document.getElementById('world4-star-strip')?.remove();
      document.getElementById('world4-phase-bar')?.remove();
      return;
    }
    const cfg = getLevelConfig();
    if (!cfg) return;
    recalcPhase();
    const strip = ensureHud();
    if (strip) {
      const results = getStarResults(scores, false);
      strip.innerHTML = results.map((s, i) => {
        const isPrimary = i === 0;
        const primaryDone = isPrimary && s.earned;
        const optionalOnTrack = !isPrimary && s.earned;
        const cls = [isPrimary ? 'is-primary' : '', primaryDone ? 'is-complete' : '', optionalOnTrack ? 'is-on-track' : ''].filter(Boolean).join(' ');
        return `<div class="w4-star-card ${cls}" title="${escapeHtml(s.detail || s.label)}"><span class="w4-star-icon">${isPrimary ? '★' : '☆'}</span><span><strong>${escapeHtml(s.label)}</strong><small>${escapeHtml(s.detail || '')}</small></span></div>`;
      }).join('');
    }
    const bar = ensurePhaseBar();
    if (bar) {
      const phases = cfg.phases || [];
      bar.classList.toggle('is-boss', !!cfg.boss);
      bar.innerHTML = `<span class="w4-phase-kicker">${cfg.boss ? 'FASE VAN DE CITADEL' : escapeHtml(cfg.title)}</span><div class="w4-phase-track">${phases.map((p,i) => {
        const done = phaseComplete(p, scores);
        const current = i === runtime.phase && !done;
        return `<div class="w4-phase-step ${done?'is-done':''} ${current?'is-current':''}"><span>${done?'✓':(i+1)}</span><small>${escapeHtml(p.label || '')}</small></div>`;
      }).join('')}</div>`;
    }
    try {
      const current = document.getElementById('objective-current');
      if (current) current.innerHTML = `<strong>Doel:</strong> ${escapeHtml(cfg.primaryText)} <span class="w4-objective-progress">${escapeHtml(primaryProgressText(currentLevelNumber(), scores))}</span>`;
    } catch (_) {}
    updateFocusHighlights(scores);
  }

  function describeDoorCell(cell, cfg = getLevelConfig()) {
    const doorId = String(cell?.dataset?.doorId || '');
    const spec = cfg?.doors?.find(d => String(d.id) === doorId);
    const zoneColor = String(spec?.zone || cell?.dataset?.w4Ink || cell?.dataset?.doorColor || '').toLowerCase();
    const zoneLabel = COLOR_LABEL[zoneColor] || zoneColor;
    const label = zoneLabel ? `${zoneLabel} poort` : 'Poort';
    if (cell?.classList?.contains('door-open')) return `${label} — geopend`;
    if (cell?.classList?.contains('door-armed')) return `${label} — klaar om te openen`;
    return `${label} — gesloten`;
  }

  function updateSpecialTitles(cfg = getLevelConfig()) {
    if (!cfg || !isWorld4()) return;
    document.querySelectorAll('.cell.key-cell[data-key-color]').forEach(cell => {
      const color = String(cell.dataset.keyColor || '').toLowerCase();
      const label = COLOR_LABEL[color] || color || 'Onbekend';
      const used = cell.dataset.keyConsumed === 'true' || isKeyUsed(color);
      const text = used
        ? `${label} sleutel — al gebruikt`
        : `${label} sleutel — activeer om de ${label.toLowerCase()} poort te ontgrendelen`;
      cell.title = text;
      cell.setAttribute('aria-label', text);
    });
    document.querySelectorAll('.cell.door-cell[data-door-id]').forEach(cell => {
      const text = describeDoorCell(cell, cfg);
      cell.title = text;
      cell.setAttribute('aria-label', text);
    });
    document.querySelectorAll('.cell.w4-ruin-required').forEach(cell => {
      const done = cell.classList.contains('active');
      const text = done ? 'Ruïnesteen — hersteld' : 'Ruïnesteen — vul deze tegel';
      cell.title = text;
      cell.setAttribute('aria-label', text);
    });
    document.querySelectorAll('.cell.w4-ruin-forbidden').forEach(cell => {
      const text = 'Puin — deze cel telt niet mee';
      cell.title = text;
      cell.setAttribute('aria-label', text);
    });
    const core = document.querySelector('.cell.w4-citadel-core');
    if (core) {
      const unlocked = core.classList.contains('w4-core-unlocked');
      const text = unlocked ? 'Citadelkern — activeer deze cel' : 'Citadelkern — open eerst alle poorten';
      core.title = text;
      core.setAttribute('aria-label', text);
    }
  }

  function markFocusTargets(selector, extraClass = 'w4-focus-target') {
    try { document.querySelectorAll(selector).forEach(el => el.classList.add(extraClass)); } catch (_) {}
  }

  function clearFocusHighlights() {
    document.querySelectorAll('.w4-focus-target,.w4-focus-region').forEach(el => {
      el.classList.remove('w4-focus-target','w4-focus-region');
    });
  }

  function updateFocusHighlights(scores = runtime.lastScores || getScoresFallback()) {
    if (!isWorld4()) return;
    const cfg = getLevelConfig();
    clearFocusHighlights();
    updateSpecialTitles(cfg);
    if (!cfg) return;
    const phases = cfg.phases || [];
    const phase = phases[Math.min(runtime.phase, Math.max(0, phases.length - 1))];
    document.body.dataset.w4PhaseType = phase?.type || '';
    if (!phase || phaseComplete(phase, scores)) return;
    switch (phase.type) {
      case 'key': {
        const color = String(phase.color || '').toLowerCase();
        markFocusTargets(`.cell.key-cell[data-key-color="${cssEscape(color)}"][data-key-consumed="false"]`);
        break;
      }
      case 'door': {
        const doorId = String(phase.doorId || '');
        const doorSelector = `.cell.door-cell[data-door-id="${cssEscape(doorId)}"]`;
        markFocusTargets(doorSelector);
        markFocusTargets(`.cell[data-locked-door-id="${cssEscape(doorId)}"]`, 'w4-focus-region');
        const spec = cfg.doors?.find(d => String(d.id) === doorId);
        const keyColor = String(spec?.keyColor || spec?.zone || '').toLowerCase();
        if (keyColor && !isKeyUsed(keyColor)) {
          markFocusTargets(`.cell.key-cell[data-key-color="${cssEscape(keyColor)}"][data-key-consumed="false"]`);
        }
        break;
      }
      case 'ruin': {
        document.querySelectorAll('.cell.w4-ruin-required:not(.active)').forEach(el => el.classList.add('w4-focus-target'));
        document.querySelectorAll('.cell.w4-ruin-forbidden').forEach(el => el.classList.add('w4-focus-region'));
        break;
      }
      case 'core': {
        const core = document.querySelector('.cell.w4-citadel-core');
        if (core) core.classList.add('w4-focus-target');
        break;
      }
      case 'colorVisible': {
        const revealDoor = (cfg.doors || []).find(d => Array.isArray(d.revealOnOpen) && d.revealOnOpen.map(x => String(x).toLowerCase()).includes(String(phase.color || '').toLowerCase()));
        if (revealDoor) {
          markFocusTargets(`.cell.door-cell[data-door-id="${cssEscape(revealDoor.id)}"]`);
          markFocusTargets(`.cell[data-locked-door-id="${cssEscape(revealDoor.id)}"]`, 'w4-focus-region');
        }
        break;
      }
      default:
        break;
    }
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function applyBodyTheme(level = currentLevelNumber()) {
    const cfg = getLevelConfig(level);
    document.body.classList.remove('w4-gate','w4-chain','w4-narrow','w4-sealed','w4-ruin','w4-reveal','w4-citadel','w4-boss');
    if (!cfg) return;
    document.body.classList.add(`w4-${cfg.mood || 'gate'}`);
    if (cfg.boss) document.body.classList.add('w4-boss');
    document.body.dataset.w4Level = cfg.id;
  }

  function zoneForColor(color) {
    const c = String(color || '').toLowerCase();
    if (c === 'rood') return document.getElementById('red-zone');
    return document.querySelector(`.zone[data-color="${c}"]`) || document.getElementById(`${c}-zone`);
  }

  function applyZoneVisibility(colors) {
    if (!isWorld4()) return;
    const allowed = new Set((colors || []).map(c => String(c).toLowerCase()));
    ALL_COLORS.forEach(c => {
      const z = zoneForColor(c);
      if (z) z.style.display = allowed.has(c) ? '' : 'none';
    });
    try { window.LocusTable?.schedule?.(); } catch (_) {}
  }

  function setLockedCardReserve(cards) { runtime.lockedCardReserve = Array.isArray(cards) ? cards.slice() : []; }
  function partitionDeckForAllowedColors(deck, colors = allowedColors()) {
    if (!isWorld4()) return Array.isArray(deck) ? deck : [];
    const allow = new Set((colors || []).map(c => String(c).toLowerCase()));
    const playable = [], locked = [];
    (Array.isArray(deck) ? deck : []).forEach(card => {
      const name = String(card?.color?.name || '').toLowerCase();
      if (name === 'multikleur' || allow.has(name)) playable.push(card); else locked.push(card);
    });
    runtime.lockedCardReserve = locked;
    return playable;
  }

  function releaseCardsForColor(color) {
    if (!isWorld4()) return 0;
    const key = String(color || '').toLowerCase();
    const release = [], keep = [];
    (runtime.lockedCardReserve || []).forEach(card => {
      const name = String(card?.color?.name || '').toLowerCase();
      if (name === key) release.push(card); else keep.push(card);
    });
    runtime.lockedCardReserve = keep;
    if (release.length) {
      try {
        if (Array.isArray(drawPile)) {
          const merged = drawPile.concat(release);
          drawPile = (typeof shuffleArray === 'function') ? shuffleArray(merged) : merged;
        }
        if (typeof updateDeckPreview === 'function') updateDeckPreview();
      } catch (_) {}
    }
    return release.length;
  }

  function revealColor(color, opts = {}) {
    if (!isWorld4()) return;
    const key = String(color || '').toLowerCase();
    if (!ALL_COLORS.includes(key)) return;
    let list = allowedColors();
    if (!list.includes(key)) {
      list = list.concat(key);
      try { if (typeof setWorld4AllowedColors === 'function') setWorld4AllowedColors(list); } catch (_) {}
      releaseCardsForColor(key);
      if (!runtime.restoring && opts.toast !== false) {
        try { showObjectiveToast(`✦ ${COLOR_LABEL[key]} gebied ontdekt!`); } catch (_) {}
      }
    }
    applyZoneVisibility(list);
    updateCoreLockState();
    renderHud();
  }

  function cleanSpecialCells() {
    document.querySelectorAll('.w4-ruin-required,.w4-ruin-forbidden,.w4-citadel-core').forEach(cell => {
      cell.classList.remove('w4-ruin-required','w4-ruin-forbidden','w4-citadel-core','w4-core-unlocked');
      if (cell.dataset.w4Disabled === 'true') {
        delete cell.dataset.disabled;
        delete cell.dataset.w4Disabled;
      }
      delete cell.dataset.w4Ruin;
      delete cell.dataset.w4Core;
      cell.querySelectorAll('.w4-ruin-mark,.w4-core-mark').forEach(n => n.remove());
    });
    document.getElementById('world4-citadel-core-badge')?.remove();
  }

  function clearCellDecoration(cell) {
    if (!cell) return;
    try {
      cell.classList.remove('gold-cell','trap-cell','black-hole-cell');
      delete cell.dataset.trap; delete cell.dataset.trapType; delete cell.dataset.trapTriggered;
      cell.querySelectorAll('.symbol,.trap-symbol,.black-hole-symbol').forEach(s => s.remove());
    } catch (_) {}
  }

  function findCellNearCenter(zone, predicate = () => true) {
    if (!zone) return null;
    const cells = [...zone.querySelectorAll('.cell:not(.void-cell)')].filter(predicate);
    if (!cells.length) return null;
    const xs = cells.map(c => Number(c.dataset.x)).filter(Number.isFinite);
    const ys = cells.map(c => Number(c.dataset.y)).filter(Number.isFinite);
    const cx = xs.length ? (Math.min(...xs)+Math.max(...xs))/2 : 0;
    const cy = ys.length ? (Math.min(...ys)+Math.max(...ys))/2 : 0;
    cells.sort((a,b) => {
      const da = Math.hypot((Number(a.dataset.x)||0)-cx,(Number(a.dataset.y)||0)-cy);
      const db = Math.hypot((Number(b.dataset.x)||0)-cx,(Number(b.dataset.y)||0)-cy);
      return da-db;
    });
    return cells[0] || null;
  }

  function applyRuinMask() {
    const cfg = getLevelConfig();
    if (!cfg?.ruin) return;
    const zone = zoneForColor(cfg.ruin.zone);
    if (!zone) return;
    const pattern = cfg.ruin.pattern || [];
    const cells = [...zone.querySelectorAll('.cell:not(.void-cell)')];
    if (!cells.length || !pattern.length) return;
    const xs = cells.map(c => Number(c.dataset.x)).filter(Number.isFinite);
    const ys = cells.map(c => Number(c.dataset.y)).filter(Number.isFinite);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = Math.max(...pattern.map(r => r.length));
    const h = pattern.length;
    const startX = Math.round((minX + maxX - w + 1) / 2);
    const startY = Math.round((minY + maxY - h + 1) / 2);
    pattern.forEach((row, ry) => [...row].forEach((ch, rx) => {
      if (ch !== '#' && ch !== 'X') return;
      const cell = zone.querySelector(`.cell[data-x="${startX+rx}"][data-y="${startY+ry}"]`);
      if (!cell || cell.classList.contains('bold-cell') || cell.classList.contains('door-cell') || cell.classList.contains('key-cell')) return;
      clearCellDecoration(cell);
      const mark = document.createElement('span');
      mark.className = 'w4-ruin-mark';
      mark.setAttribute('aria-hidden','true');
      if (ch === '#') {
        cell.classList.add('w4-ruin-required');
        cell.dataset.w4Ruin = 'required';
        mark.textContent = '·';
      } else {
        cell.classList.add('w4-ruin-forbidden');
        cell.dataset.w4Ruin = 'forbidden';
        cell.dataset.disabled = 'true';
        cell.dataset.w4Disabled = 'true';
        mark.textContent = '×';
      }
      cell.appendChild(mark);
    }));
  }

  function applyCitadelCore() {
    const cfg = getLevelConfig();
    if (!cfg?.core) return;
    const zone = zoneForColor(cfg.core.zone);
    if (!zone) return;
    const core = findCellNearCenter(zone, c => !c.classList.contains('bold-cell') && !c.classList.contains('door-cell') && !c.classList.contains('key-cell'));
    if (!core) return;
    clearCellDecoration(core);
    core.classList.add('w4-citadel-core');
    core.dataset.w4Core = 'true';
    core.dataset.disabled = 'true';
    core.dataset.w4Disabled = 'true';
    const mark = document.createElement('span');
    mark.className = 'w4-core-mark'; mark.textContent = '◆'; mark.setAttribute('aria-hidden','true');
    core.appendChild(mark);
    updateCoreLockState();

    let badge = document.getElementById('world4-citadel-core-badge');
    if (!badge) {
      badge = document.createElement('div'); badge.id = 'world4-citadel-core-badge';
      const host = document.getElementById('table-stage') || document.getElementById('board')?.parentElement;
      host?.appendChild(badge);
    }
    badge.innerHTML = '<span>◇</span><strong>Citadelkern</strong><small>Open de drie poorten</small>';
  }

  function updateCoreLockState() {
    const cfg = getLevelConfig();
    const core = document.querySelector('.cell.w4-citadel-core');
    if (!cfg?.core || !core) return;
    const unlocked = requiredDoorsOpen(cfg) && isColorVisible(cfg.core.zone);
    core.classList.toggle('w4-core-unlocked', unlocked);
    if (unlocked) {
      if (core.dataset.w4Disabled === 'true') {
        delete core.dataset.disabled;
        delete core.dataset.w4Disabled;
      }
    } else {
      core.dataset.disabled = 'true'; core.dataset.w4Disabled = 'true';
    }
    const badge = document.getElementById('world4-citadel-core-badge');
    if (badge) {
      badge.classList.toggle('is-unlocked', unlocked);
      badge.innerHTML = unlocked
        ? '<span>✦</span><strong>Citadelkern</strong><small>Bereikbaar — activeer de kerncell</small>'
        : '<span>◇</span><strong>Citadelkern</strong><small>Open de drie poorten</small>';
    }
  }

  function afterBoardBuilt(level, context = {}) {
    if (!isWorld4(level)) return;
    if (runtime.level !== Number(level)) resetRuntime(level);
    runtime.built = true;
    applyBodyTheme(level);
    cleanSpecialCells();
    const cfg = getLevelConfig(level);
    try { applyZoneVisibility(allowedColors()); } catch (_) {}
    if (cfg?.ruin) applyRuinMask();
    if (cfg?.core) applyCitadelCore();
    renderHud();
  }

  function onKeyActivated(color) {
    if (!isWorld4() || runtime.restoring) return;
    const key = String(color || '').toLowerCase();
    if (key && !runtime.stats.keysUsed.includes(key)) runtime.stats.keysUsed.push(key);
    // The legacy key system immediately adds the key color to the allowed palette.
    // World 4 keeps hidden-color cards in reserve, so release them at the same moment.
    if (key) releaseCardsForColor(key);
    applyZoneVisibility(allowedColors());
    recalcPhase(); renderHud();
  }

  function onDoorOpened(doorId) {
    if (!isWorld4()) return;
    const cfg = getLevelConfig();
    const spec = cfg?.doors?.find(d => d.id === String(doorId));
    if (!runtime.restoring) {
      if (!runtime.stats.doorsOpened.includes(String(doorId))) runtime.stats.doorsOpened.push(String(doorId));
      if (runtime.stats.doorOpenTurns[String(doorId)] == null) {
        try { runtime.stats.doorOpenTurns[String(doorId)] = Math.max(1, Number(turnCount)||1); } catch (_) { runtime.stats.doorOpenTurns[String(doorId)] = 1; }
      }
    }
    if (spec?.revealOnOpen) spec.revealOnOpen.forEach(c => revealColor(c, { toast:!runtime.restoring }));
    updateCoreLockState();
    recalcPhase(); renderHud();
  }

  function onCardPlayed(card, placementResult) {
    if (!isWorld4() || runtime.restoring) return;
    runtime.stats.cardsPlayed += 1;
    if (String(card?.category || '').toLowerCase() === 'large') runtime.stats.largeCardsUsed += 1;
    if (card?.isGolden || card?.color?.isGolden) runtime.stats.goldenCardsUsed += 1;
    runtime.stats.maxActiveSeen = Math.max(runtime.stats.maxActiveSeen, activeCellCount());
    const nowPrimary = isPrimaryComplete(currentLevelNumber(), runtime.lastScores || getScoresFallback());
    if (nowPrimary && !runtime.stats.primaryWasComplete && runtime.stats.primaryCompletedOnCard == null) {
      runtime.stats.primaryCompletedOnCard = runtime.stats.cardsPlayed;
    }
    runtime.stats.primaryWasComplete = nowPrimary;
    recalcPhase(); renderHud();
  }

  function onBonusUsed(colorKey) {
    if (!isWorld4() || runtime.restoring || colorKey === 'purchased') return;
    runtime.stats.bonusesUsed += 1;
    runtime.stats.maxActiveSeen = Math.max(runtime.stats.maxActiveSeen, activeCellCount());
    runtime.stats.primaryWasComplete = isPrimaryComplete(currentLevelNumber(), runtime.lastScores || getScoresFallback());
    recalcPhase(); renderHud();
  }

  function onScoreUpdated(scores) {
    if (!isWorld4()) return;
    runtime.lastScores = scores ? clone(scores) : getScoresFallback();
    runtime.stats.maxActiveSeen = Math.max(runtime.stats.maxActiveSeen, activeCellCount());
    recalcPhase(); updateCoreLockState(); renderHud(runtime.lastScores);
  }

  function isCellBlocked(cell) {
    if (!isWorld4() || !cell) return false;
    if (cell.classList.contains('w4-ruin-forbidden')) return true;
    if (cell.classList.contains('w4-citadel-core') && !cell.classList.contains('w4-core-unlocked')) return true;
    return false;
  }

  function containerIdForCell(cell) {
    if (!cell) return '';
    return cell.closest('.grid,[data-subgrid]')?.id || cell.closest('.zone')?.id || '';
  }

  function findSavedCell(containerId, x, y) {
    if (!containerId) return null;
    const host = document.getElementById(String(containerId));
    if (!host) return null;
    try { return host.querySelector(`.cell[data-x="${cssEscape(x)}"][data-y="${cssEscape(y)}"]`); } catch (_) { return null; }
  }

  function captureBoardGateState() {
    if (!isWorld4()) return null;
    const lockedCells = [...document.querySelectorAll('.cell[data-locked-door-id]')].map(cell => ({
      gridId:containerIdForCell(cell), x:cell.dataset.x, y:cell.dataset.y, doorId:cell.dataset.lockedDoorId
    }));
    const doorState = [...document.querySelectorAll('.cell.door-cell[data-door-id]')].map(cell => ({
      id:cell.dataset.doorId, open:cell.classList.contains('door-open'), armed:cell.classList.contains('door-armed')
    }));
    const keyState = [...document.querySelectorAll('.cell.key-cell[data-key-color]')].map(cell => ({
      gridId:containerIdForCell(cell), x:cell.dataset.x, y:cell.dataset.y, color:cell.dataset.keyColor, consumed:cell.dataset.keyConsumed === 'true'
    }));
    let unlocked = [];
    try { unlocked = Array.from(world4UnlockedColors || []); } catch (_) {}
    return {
      runtime:{ phase:runtime.phase, stats:clone(runtime.stats), lastScores:clone(runtime.lastScores) },
      allowedColors:allowedColors(), unlockedColors:unlocked, lockedCells, doorState, keyState,
      reserveIds:(runtime.lockedCardReserve || []).map(c => c?.id).filter(Boolean)
    };
  }

  function restoreGateState(snapshot) {
    if (!isWorld4() || !snapshot) return;
    runtime.restoring = true;
    try {
      runtime.phase = Number(snapshot.runtime?.phase || 0);
      runtime.stats = clone(snapshot.runtime?.stats || freshStats());
      runtime.lastScores = clone(snapshot.runtime?.lastScores || runtime.lastScores);
      if (typeof setWorld4AllowedColors === 'function') setWorld4AllowedColors(snapshot.allowedColors || getLevelConfig()?.startColors || []);
      if (typeof setWorld4UnlockedColors === 'function') setWorld4UnlockedColors(snapshot.unlockedColors || []);
      applyZoneVisibility(snapshot.allowedColors || []);

      // Return cards released after the snapshot to the locked reserve.
      const reserveIds = new Set(snapshot.reserveIds || []);
      try {
        const back = [];
        if (Array.isArray(drawPile)) {
          drawPile = drawPile.filter(card => {
            if (reserveIds.has(card?.id)) { back.push(card); return false; }
            return true;
          });
        }
        const existing = new Map((runtime.lockedCardReserve || []).map(c => [c?.id,c]));
        back.forEach(c => existing.set(c?.id,c));
        runtime.lockedCardReserve = [...existing.values()].filter(c => reserveIds.has(c?.id));
      } catch (_) {}

      document.querySelectorAll('.cell[data-locked-door-id]').forEach(c => { delete c.dataset.lockedDoorId; c.classList.remove('locked-behind-door'); });
      (snapshot.lockedCells || []).forEach(s => {
        const cell = findSavedCell(s.gridId, s.x, s.y);
        if (cell) { cell.dataset.lockedDoorId = String(s.doorId); cell.classList.add('locked-behind-door'); }
      });
      document.querySelectorAll('.cell.door-cell').forEach(c => c.classList.remove('door-open','door-armed'));
      (snapshot.doorState || []).forEach(s => {
        const cell = findDoorCell(s.id); if (!cell) return;
        cell.classList.toggle('door-open', !!s.open); cell.classList.toggle('door-armed', !!s.armed);
      });
      (snapshot.keyState || []).forEach(s => {
        const cell = findSavedCell(s.gridId, s.x, s.y);
        if (!cell) return;
        cell.dataset.keyConsumed = s.consumed ? 'true' : 'false';
        if (s.consumed) {
          cell.querySelector('.key-symbol')?.remove();
        } else if (!cell.querySelector('.key-symbol')) {
          const sym = document.createElement('span');
          sym.className = 'key-symbol';
          sym.innerHTML = '<span class="key-glyph" aria-hidden="true">🗝️</span>';
          cell.appendChild(sym);
        }
      });
      updateCoreLockState(); recalcPhase(); renderHud();
      try { updateDeckPreview?.(); renderCurrentHand?.(); } catch (_) {}
    } finally { runtime.restoring = false; }
  }

  function cssEscape(v) { try { return CSS.escape(String(v ?? '')); } catch (_) { return String(v ?? '').replace(/[^a-zA-Z0-9_-]/g,'\\$&'); } }
  function findDoorCell(id) {
    try { return document.querySelector(`.cell.door-cell[data-door-id="${cssEscape(id)}"]`); } catch (_) { return [...document.querySelectorAll('.cell.door-cell')].find(c => c.dataset.doorId === id) || null; }
  }

  function getSaveState() {
    if (!isWorld4()) return null;
    const activeCells = [...document.querySelectorAll('#yellow-zone .cell.active:not(.void-cell),#green-zone .cell.active:not(.void-cell),#blue-zone .cell.active:not(.void-cell),#purple-zone .cell.active:not(.void-cell),#red-zone .cell.active:not(.void-cell)')].map(cell => ({
      gridId:containerIdForCell(cell), x:cell.dataset.x, y:cell.dataset.y,
      activationSequence:cell.dataset.activationSequence || null, placementId:cell.dataset.placementId || null
    }));
    const gates = captureBoardGateState();
    return {
      version:1, level:currentLevelNumber(), activeCells,
      runtime:{ phase:runtime.phase, stats:clone(runtime.stats), lastScores:clone(runtime.lastScores) },
      allowedColors:gates?.allowedColors || allowedColors(), unlockedColors:gates?.unlockedColors || [],
      openDoors:(gates?.doorState || []).filter(d => d.open).map(d => d.id),
      reserve:clone(runtime.lockedCardReserve || [])
    };
  }

  function restoreSaveState(state) {
    if (!state || !isWorld4() || Number(state.level) !== currentLevelNumber()) return false;
    runtime.restoring = true;
    try {
      runtime.phase = Number(state.runtime?.phase || 0);
      runtime.stats = clone(state.runtime?.stats || freshStats());
      runtime.lastScores = clone(state.runtime?.lastScores || null);
      runtime.lockedCardReserve = clone(state.reserve || []);
      if (typeof setWorld4AllowedColors === 'function') setWorld4AllowedColors(state.allowedColors || getLevelConfig()?.startColors || []);
      if (typeof setWorld4UnlockedColors === 'function') setWorld4UnlockedColors(state.unlockedColors || []);
      applyZoneVisibility(state.allowedColors || []);

      (state.activeCells || []).forEach(s => {
        const cell = findSavedCell(s.gridId, s.x, s.y);
        if (!cell) return;
        cell.classList.add('active');
        if (s.activationSequence != null) cell.dataset.activationSequence = String(s.activationSequence);
        if (s.placementId) cell.dataset.placementId = String(s.placementId);
      });
      // Mark used keys and reopen doors after board has been rebuilt deterministically.
      const unlocked = new Set(state.unlockedColors || []);
      document.querySelectorAll('.cell.key-cell[data-key-color]').forEach(cell => {
        const used = unlocked.has(String(cell.dataset.keyColor || '').toLowerCase());
        cell.dataset.keyConsumed = used ? 'true' : 'false';
        if (used) cell.querySelector('.key-symbol')?.remove();
      });
      (state.openDoors || []).forEach(id => { try { openWorld4Door(id); } catch (_) {} });
      updateCoreLockState(); recalcPhase();
      try { if (typeof updateScore === 'function') updateScore(); } catch (_) {}
      renderHud(runtime.lastScores || getScoresFallback());
      try { updateDeckPreview?.(); renderCurrentHand?.(); } catch (_) {}
      return true;
    } finally { runtime.restoring = false; }
  }

  function buildRoundStarsHTML(success, scores = runtime.lastScores || getScoresFallback()) {
    if (!isWorld4()) return '';
    const cfg = getLevelConfig();
    const results = getStarResults(scores, true);
    const earned = success ? results.filter(r => r.earned).length : 0;
    return `<div class="w4-round-stars"><div class="w4-round-stars-title"><strong>${escapeHtml(cfg?.title || 'Wereld 4')}</strong><span>${success ? `${earned}/3 sterren` : 'Sterren worden alleen toegekend bij voltooiing'}</span></div><div class="w4-round-star-row">${results.map(r => `<div class="${success && r.earned ? 'is-earned':''}"><b>${success && r.earned ? '★' : '☆'}</b><span>${escapeHtml(r.label)}</span></div>`).join('')}</div></div>`;
  }

  function cleanup() {
    cleanSpecialCells();
    document.getElementById('world4-star-strip')?.remove();
    document.getElementById('world4-phase-bar')?.remove();
    document.body.classList.remove('w4-gate','w4-chain','w4-narrow','w4-sealed','w4-ruin','w4-reveal','w4-citadel','w4-boss');
    delete document.body.dataset.w4Level;
  }

  window.LocusWorld4 = {
    LEVELS, getLevelConfig, getRuntime, resetRuntime, isWorld4,
    isPrimaryComplete, primaryProgressText, getStarResults, commitStars, buildRoundStarsHTML,
    afterBoardBuilt, onKeyActivated, onDoorOpened, onCardPlayed, onBonusUsed, onScoreUpdated,
    isCellBlocked, capturePrePlacementState:captureBoardGateState, restorePrePlacementState:restoreGateState,
    partitionDeckForAllowedColors, setLockedCardReserve, releaseCardsForColor, revealColor, applyZoneVisibility,
    getSaveState, restoreSaveState, cleanup, renderHud, activeCellCount, ruinComplete, coreComplete
  };
})();
