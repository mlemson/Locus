from pathlib import Path
import re

INDEX = Path('index.html')
s = INDEX.read_text(encoding='utf-8')

def replace_once(text, old, new, label):
    count = text.count(old)
    if count < 1:
        raise SystemExit(f'{label}: source text not found')
    return text.replace(old, new, 1)

# --- Purple: varied rectangular courts instead of a square every level ---
pattern = re.compile(r"\tfunction getWorld4PurpleProfile\(subLevel = 1\) \{.*?\n\tfunction getWorld4BlueProfile", re.S)
replacement = '''\tfunction getWorld4PurpleProfile(subLevel = 1) {
\t\tconst n = Math.max(1, Math.min(10, Number(subLevel) || 1));
\t\t// World 4 purple deliberately changes aspect ratio per level. It keeps the
\t\t// familiar connection scoring, but no longer reads as one repeated square.
\t\tconst dimensions = [
\t\t\t[14,19],[17,15],[15,20],[18,16],[16,21],
\t\t\t[19,17],[17,22],[20,18],[18,23],[21,19]
\t\t];
\t\tconst [rows, cols] = dimensions[n - 1];
\t\tconst cy = Math.floor(rows / 2), cx = Math.floor(cols / 2);
\t\tconst dy = Math.max(3, Math.floor(rows * .22));
\t\tconst dx = Math.max(3, Math.floor(cols * .22));
\t\tconst clamp = ([r,c]) => [Math.max(1, Math.min(rows - 2, r)), Math.max(1, Math.min(cols - 2, c))];
\t\tconst motifs = [
\t\t\t[[cy,cx],[cy-dy,cx],[cy+dy,cx],[cy,cx-dx],[cy,cx+dx],[cy-1,cx-1],[cy+1,cx+1]],
\t\t\t[[2,2],[2,cols-3],[rows-3,2],[rows-3,cols-3],[cy,cx],[cy-dy,cx],[cy+dy,cx]],
\t\t\t[[cy-dy,cx-dx],[cy-2,cx-2],[cy,cx],[cy+2,cx+2],[cy+dy,cx+dx],[cy-dy,cx+dx],[cy+dy,cx-dx]],
\t\t\t[[cy-dy,cx+dx],[cy-2,cx+2],[cy,cx],[cy+2,cx-2],[cy+dy,cx-dx],[cy-dy,cx-dx],[cy+dy,cx+dx]],
\t\t\t[[cy-dy,cx],[cy-2,cx-dx],[cy,cx-dx],[cy+2,cx-dx],[cy+dy,cx],[cy+2,cx+dx],[cy,cx+dx],[cy-2,cx+dx],[cy,cx]],
\t\t\t[[2,cx],[cy,2],[rows-3,cx],[cy,cols-3],[cy,cx],[cy-dy,cx],[cy+dy,cx],[cy,cx-dx],[cy,cx+dx]],
\t\t\t[[3,3],[3,cx],[3,cols-4],[cy,3],[cy,cx],[cy,cols-4],[rows-4,3],[rows-4,cx],[rows-4,cols-4]],
\t\t\t[[1,cx],[cy,1],[rows-2,cx],[cy,cols-2],[cy-dy,cx-dx],[cy+dy,cx+dx],[cy-dy,cx+dx],[cy+dy,cx-dx],[cy,cx]],
\t\t\t[[2,2],[2,cols-3],[rows-3,2],[rows-3,cols-3],[cy-dy,cx],[cy+dy,cx],[cy,cx-dx],[cy,cx+dx],[cy,cx]],
\t\t\t[[1,1],[1,cols-2],[rows-2,1],[rows-2,cols-2],[cy-dy,cx],[cy+dy,cx],[cy,cx-dx],[cy,cx+dx],[cy,cx],[cy-2,cx-2],[cy+2,cx+2]]
\t\t];
\t\tconst seen = new Set();
\t\tconst fixedBoldCells = motifs[n - 1].map(clamp).filter(([r,c]) => {
\t\t\tconst key = `${r},${c}`;
\t\t\tif (seen.has(key)) return false;
\t\t\tseen.add(key);
\t\t\treturn true;
\t\t});
\t\treturn {
\t\t\trows, cols, size:Math.max(rows, cols), fixedBoldCells,
\t\t\tname:['kruis','vierposten','diagonaal','tegenddiagonaal','ring','assen','negenhof','kompas','vesting','kernplein'][n-1]
\t\t};
\t}

\tfunction applyWorld4PurpleGeneration(subLevel = 1) {
\t\tconst p = getWorld4PurpleProfile(subLevel);
\t\twindow.purpleGridConfig = {
\t\t\tworld3:true, world4:true, size:p.size, rows:p.rows, cols:p.cols, generationName:p.name,
\t\t\touterRingBonusPerBold:22 + Math.min(16, subLevel * 2), innerRingBonus:true,
\t\t\tinnerRingBonusPerBold:12 + Math.min(12, subLevel)
\t\t};
\t\twithWorld4Seed(0x4200 + subLevel * 131, () => createGrid('purple-grid', p.rows, p.cols, {
\t\t\tgoldCells:true, symbols:true,
\t\t\tminSymbols:12 + subLevel, maxSymbols:15 + subLevel,
\t\t\tcoinChance:0.06, maxCoins:9 + Math.min(9,subLevel),
\t\t\trandomBoldCount:Math.min(28,10 + subLevel * 2), randomBoldMinEdgeDistance:2,
\t\t\tavoidAdjacentBold:true, fixedBoldCells:p.fixedBoldCells, outerRingShade:true,
\t\t\ttrapChance:0, maxTraps:0, blackHoleChance:0
\t\t}));
\t\tconst zone=document.getElementById('purple-zone'); if(zone) zone.dataset.w4Generation=p.name;
\t}

\tfunction getWorld4BlueProfile'''
s, count = pattern.subn(replacement, s, count=1)
if count != 1:
    raise SystemExit(f'Purple generator replacement failed ({count})')

# --- Green: visibly larger World 4 networks ---
pattern = re.compile(r"\tfunction getWorld4GreenProfile\(subLevel = 1\) \{.*?\n\tfunction applyWorld4GreenGeneration", re.S)
replacement = '''\tfunction getWorld4GreenProfile(subLevel = 1) {
\t\tconst n=Math.max(1,Math.min(10,Number(subLevel)||1));
\t\treturn [
\t\t\t{rows:34,cols:36,growth:220,split:.24,name:'boomgaard'},
\t\t\t{rows:38,cols:32,growth:240,split:.30,name:'smalle-tuin'},
\t\t\t{rows:36,cols:40,growth:270,split:.34,name:'waaier'},
\t\t\t{rows:42,cols:34,growth:295,split:.38,name:'doolhof'},
\t\t\t{rows:38,cols:42,growth:320,split:.42,name:'kruidentuin'},
\t\t\t{rows:44,cols:36,growth:350,split:.44,name:'terrassen'},
\t\t\t{rows:40,cols:44,growth:380,split:.48,name:'ruinetuin'},
\t\t\t{rows:46,cols:38,growth:410,split:.50,name:'binnenpark'},
\t\t\t{rows:42,cols:46,growth:440,split:.53,name:'vestinggroen'},
\t\t\t{rows:48,cols:42,growth:475,split:.56,name:'citadeltuin'}
\t\t][n-1];
\t}

\tfunction applyWorld4GreenGeneration'''
s, count = pattern.subn(replacement, s, count=1)
if count != 1:
    raise SystemExit(f'Green generator replacement failed ({count})')

# --- Modern vector key + lock ---
key_svg = '<span class="key-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="8.5" r="3.5"></circle><path d="M10.2 11.2 20 21"></path><path d="m15.7 16.7 2.1-2.1"></path><path d="m18.1 19.1 2-2"></path></svg></span>'
lock_svg = '<span class="door-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2.5"></rect><path d="M8 10V7.5a4 4 0 0 1 8 0V10"></path><path d="M12 14v2.5"></path></svg></span>'
s = replace_once(s, 'const ICON_KEY = \'<span class="key-glyph" aria-hidden="true">🗝️</span>\';', "const ICON_KEY = '" + key_svg + "';", 'key glyph')
s = replace_once(s, 'const ICON_DOOR = \'<span class="door-glyph" aria-hidden="true">🚪</span>\';', "const ICON_DOOR = '" + lock_svg + "';", 'door glyph')

# --- World 4 random symbol colors: only colors actually active in this level ---
old = "\t\t\t\tconst chances = computeObjectiveDrivenBonusColorChances();"
new = '''\t\t\t\tlet chances = computeObjectiveDrivenBonusColorChances();
\t\t\t\ttry {
\t\t\t\t\tconst info = (typeof getWorldAndSubLevel === 'function') ? getWorldAndSubLevel(currentLevel) : null;
\t\t\t\t\tif (Number(info?.world) === 4) {
\t\t\t\t\t\tconst normalize = c => ({ geel:'yellow', yellow:'yellow', rood:'red', red:'red', groen:'green', green:'green', paars:'purple', purple:'purple', blauw:'blue', blue:'blue' }[String(c||'').toLowerCase()] || null);
\t\t\t\t\t\tlet raw = [];
\t\t\t\t\t\ttry { if (typeof world4AllowedColors !== 'undefined' && Array.isArray(world4AllowedColors)) raw = world4AllowedColors.slice(); } catch (_) {}
\t\t\t\t\t\tif (!raw.length) {
\t\t\t\t\t\t\ttry { raw = window.LocusWorld4?.getLevelConfig?.(currentLevel)?.startColors?.slice?.() || []; } catch (_) {}
\t\t\t\t\t\t}
\t\t\t\t\t\tconst allowed = new Set(raw.map(normalize).filter(Boolean));
\t\t\t\t\t\tif (allowed.size) {
\t\t\t\t\t\t\tconst source = Array.isArray(chances) ? chances : BONUS_ORDER.map(color => ({ color, weight:1 }));
\t\t\t\t\t\t\tchances = source.filter(entry => allowed.has(String(entry.color || '').toLowerCase()));
\t\t\t\t\t\t}
\t\t\t\t\t}
\t\t\t\t} catch (_) {}'''
s = replace_once(s, old, new, 'World4 bonus color filtering')

# Random bonus upgrades in World 4 follow the zones that are actually visible.
anchor = '\tfunction grantRandomBonusUpgrade({ silent = false } = {}) {'
helper = '''\tfunction getEligibleBonusUpgradeColors() {
\t\tlet pool = BONUS_ORDER.filter(key => BONUS_COLOR_CONFIG[key]);
\t\ttry {
\t\t\tconst info = (typeof getWorldAndSubLevel === 'function') ? getWorldAndSubLevel(currentLevel) : null;
\t\t\tif (Number(info?.world) === 4) {
\t\t\t\tconst zoneIds = { yellow:'yellow-zone', red:'red-zone', green:'green-zone', purple:'purple-zone', blue:'blue-zone' };
\t\t\t\tconst visible = pool.filter(key => {
\t\t\t\t\tconst zone = document.getElementById(zoneIds[key]);
\t\t\t\t\tif (!zone || zone.hidden) return false;
\t\t\t\t\tconst style = getComputedStyle(zone);
\t\t\t\t\treturn zone.style.display !== 'none' && style.display !== 'none';
\t\t\t\t});
\t\t\t\tif (visible.length) pool = visible;
\t\t\t}
\t\t} catch (_) {}
\t\treturn pool.filter(key => !isBonusUpgraded(key));
\t}

\tfunction grantRandomBonusUpgrade({ silent = false } = {}) {'''
s = replace_once(s, anchor, helper, 'bonus upgrade helper')
old_pool = "\t\tconst available = BONUS_ORDER\n\t\t\t.filter(key => BONUS_COLOR_CONFIG[key])\n\t\t\t.filter(key => !isBonusUpgraded(key));"
if s.count(old_pool) < 2:
    raise SystemExit(f'Expected two random bonus pools; found {s.count(old_pool)}')
s = s.replace(old_pool, '\t\tconst available = getEligibleBonusUpgradeColors();', 2)

# --- New run after game over: clear actual score state, not just visible labels ---
anchor = "\tconst startLevelNum = (typeof isTutorialCompleted === 'function' && isTutorialCompleted()) ? 1 : 0;"
reset = '''\t// A genuinely new run must not inherit score/progression caches from the failed run.
\tresetScoreState();
\tresetObjectives();
\tlatestScoreSnapshot = { yellow:0, red:0, green:0, purple:0, blue:0, bonus:0, total:0 };
\tlastRoundWasSuccess = false;
\tlastRoundFailureReason = null;
\tconst startLevelNum = (typeof isTutorialCompleted === 'function' && isTutorialCompleted()) ? 1 : 0;'''
s = replace_once(s, anchor, reset, 'new run reset')

# Cache bust and load a tiny centering helper after World 4 runtime.
s = re.sub(r'world4-citadel\.css\?v=[^"\']+', 'world4-citadel.css?v=20260914-polish2', s)
s = re.sub(r'world4-citadel\.js\?v=[^"\']+', 'world4-citadel.js?v=20260914-polish2', s)
if 'world4-polish.js?v=20260914-polish2' not in s:
    tag_re = re.compile(r'(<script[^>]+src=["\']world4-citadel\.js\?v=[^"\']+["\'][^>]*></script>)')
    s, count = tag_re.subn(r'\1\n\t<script src="world4-polish.js?v=20260914-polish2"></script>', s, count=1)
    if count != 1:
        raise SystemExit('Could not insert world4-polish.js')

INDEX.write_text(s, encoding='utf-8')

# Restore path in external World4 runtime also gets the same vector icons.
js_path = Path('world4-citadel.js')
js = js_path.read_text(encoding='utf-8')
js = js.replace('<span class="key-glyph" aria-hidden="true">🗝️</span>', key_svg)
js = js.replace('<span class="door-glyph" aria-hidden="true">🚪</span>', lock_svg)
js_path.write_text(js, encoding='utf-8')

# Center compact grids when they fit; when they overflow JS scrolls them to their true midpoint.
css_path = Path('world4-polish.css')
css = css_path.read_text(encoding='utf-8')
old_center = '''body.table-ui #table-app#table-app .table-zone-frame:is([data-zone="purple"],[data-zone="yellow"]) > .zone {
  display:flex !important;
  flex-direction:column !important;
  align-items:safe center !important;
  justify-content:safe center !important;
}
body.table-ui #table-app#table-app .table-zone-frame:is([data-zone="purple"],[data-zone="yellow"]) > .zone > .grid {
  flex:0 0 auto !important;
  margin:0 !important;
}'''
new_center = '''body.table-ui #table-app#table-app .table-zone-frame:is([data-zone="purple"],[data-zone="yellow"]) > .zone {
  display:flex !important;
  flex-direction:column !important;
  align-items:stretch !important;
  justify-content:flex-start !important;
}
body.table-ui #table-app#table-app .table-zone-frame:is([data-zone="purple"],[data-zone="yellow"]) > .zone > .grid {
  flex:0 0 auto !important;
  margin:auto !important;
}'''
css = replace_once(css, old_center, new_center, 'purple/yellow centering CSS')

extra = '''

/* WORLD4_POLISH2_20260914: vector icons + explicit shop-card contrast */
body.world-4 .cell.key-cell .key-glyph,
body.world-4 .cell.door-cell .door-glyph {
  width:100%; height:100%; display:grid !important; place-items:center !important;
  color:currentColor;
}
body.world-4 .cell.key-cell .key-glyph svg,
body.world-4 .cell.door-cell .door-glyph svg {
  width:min(72%,18px) !important; height:min(72%,18px) !important;
  display:block; overflow:visible;
}
body.world-4 .cell.door-cell.door-open .door-glyph svg { opacity:.62; }
body:not(.classic-mode) #shop-modal :is(.shop-bonus-card,.shop-card-option,.shop-upgrade-card,.shop-freeplace-card,.shop-card,.upgrade-card) {
  color:#edf6fc !important;
}
body:not(.classic-mode) #shop-modal :is(.shop-bonus-card,.shop-card-option,.shop-upgrade-card,.shop-freeplace-card,.shop-card,.upgrade-card) :is(span,p,small,strong,b) {
  color:inherit !important;
}
body:not(.classic-mode) #shop-modal :is(.shop-bonus-card,.shop-card-option,.shop-upgrade-card,.shop-freeplace-card,.shop-card,.upgrade-card) button {
  color:#f5fbff !important; font-weight:700;
}
'''
if 'WORLD4_POLISH2_20260914' not in css:
    css += extra
css_path.write_text(css, encoding='utf-8')

cit_css_path = Path('world4-citadel.css')
cit_css = cit_css_path.read_text(encoding='utf-8')
cit_css = re.sub(r'world4-polish\.css\?v=[^"\')]+', 'world4-polish.css?v=20260914-polish2', cit_css)
cit_css_path.write_text(cit_css, encoding='utf-8')

Path('world4-polish.js').write_text('''(function installWorld4Polish(){
  'use strict';
  if (window.__world4PolishInstalled) return;
  window.__world4PolishInstalled = true;

  function isWorld4() { return document.body && document.body.classList.contains('world-4'); }
  function centerZone(id) {
    const zone = document.getElementById(id);
    if (!zone) return;
    zone.scrollLeft = Math.max(0, (zone.scrollWidth - zone.clientWidth) / 2);
    zone.scrollTop = Math.max(0, (zone.scrollHeight - zone.clientHeight) / 2);
  }
  function centerPurpleYellow() {
    if (!isWorld4()) return;
    centerZone('purple-zone');
    centerZone('yellow-zone');
  }
  function scheduleCentering() {
    [0,80,220,500,900].forEach(ms => setTimeout(() => requestAnimationFrame(centerPurpleYellow), ms));
  }
  function installObserver() {
    const board = document.getElementById('board');
    if (!board) return;
    let timer = 0;
    new MutationObserver(() => {
      if (!isWorld4()) return;
      clearTimeout(timer);
      timer = setTimeout(scheduleCentering, 50);
    }).observe(board, { childList:true, subtree:true });
  }
  window.addEventListener('resize', scheduleCentering, { passive:true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { installObserver(); scheduleCentering(); }, { once:true });
  } else {
    installObserver(); scheduleCentering();
  }
})();
''', encoding='utf-8')

print('World 4 polish patch applied')
