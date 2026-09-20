/* Integration checks against the real game. Run: node tests/world-table.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const requested = new URL(req.url, 'http://localhost').pathname;
  const filename = path.resolve(root, '.' + (requested === '/' ? '/index.html' : requested));
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    res.setHeader('Content-Type', filename.endsWith('.css') ? 'text/css' : filename.endsWith('.js') ? 'text/javascript' : 'text/html');
    res.end(fs.readFileSync(filename));
  } catch { res.writeHead(404).end(); }
});
const sizes = [[1920,1080,false],[1440,900,false],[1366,1024,false],[1366,1024,true],[1180,820,true],[1024,1366,false],[1024,1366,true],[1024,768,true],[768,1024,true],[390,844,true],[430,932,true],[844,390,true],[320,568,true]];
let browser;
async function open(width, height, touch) {
  const page = await browser.newPage({viewport:{width,height}, hasTouch:touch, isMobile:touch});
  page.setDefaultTimeout(5000);
  const errors=[];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('locus_tutorial_v1_done','1');
    let seed=123456;
    Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => {
    document.querySelectorAll('.modal-overlay').forEach(e => e.classList.remove('show','active'));
    const pick = document.getElementById('preworld-pick-modal');
    if (pick) pick.style.display = 'none';
    starterPicksDoneByWorld = {'1':true,'2':true,'3':true,'4':true};
    preLevelStarterPicksInProgress = false;
    startLevel(12);
  });
  await page.waitForTimeout(350);
  return {page, errors};
}
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_EXECUTABLE || undefined, args:['--no-sandbox','--disable-gpu']});
  for (const [width,height,touch] of (process.env.INTERACTIONS_ONLY ? [] : sizes)) {
    const {page,errors}=await open(width,height,touch);
    const layout = await page.evaluate(() => {
      const ids=['table-header','card-choice-zone','table-world','gold-zone'];
      const boxes=ids.map(id=>{const r=document.getElementById(id).getBoundingClientRect();return {id,x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};});
      const controls=[...document.querySelectorAll('#card-action-buttons > button:not(#bonus-shop-btn),#menu-toggle,.table-tab')].filter(e=>e.getBoundingClientRect().width);
      return {width:innerWidth,height:innerHeight,scroll:document.documentElement.scrollWidth, boxes, controls:controls.map(e=>({id:e.id||e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})), frameCount:[...document.querySelectorAll('.table-zone-frame')].filter(e=>!e.hidden).length};
    });
    assert.ok(layout.scroll <= width+1, `page overflow ${width}`);
    for (const b of layout.boxes) assert.ok(b.x>=-1 && b.y>=-1 && b.right<=width+1 && b.bottom<=height+1, `clipped ${width}: ${JSON.stringify(b)}`);
    for (const b of layout.controls) assert.ok(b.w>=43 && b.h>=43, `small control ${width}: ${JSON.stringify(b)}`);
    for (let i=0;i<3;i++) for(let j=i+1;j<3;j++) {
      const a=layout.boxes[i],b=layout.boxes[j];
      assert.ok(a.right<=b.x+1||b.right<=a.x+1||a.bottom<=b.y+1||b.bottom<=a.y+1, `overlap ${width}: ${a.id}/${b.id}`);
    }
    assert.equal(layout.frameCount,Math.min(width,height)<600?1:5);

    // Tablet regression checks: portrait HUD must not horizontally scroll, while
    // landscape uses a narrow one-column hand rail to give the board more width.
    if (Math.min(width,height)>=600 && Math.max(width,height)<=1400) {
      const tabletLayout=await page.evaluate(()=>{
        const body=document.body;
        const status=document.getElementById('table-status');
        const bonus=document.getElementById('bonus-inventory');
        const hand=document.getElementById('table-hand');
        const cards=[...document.querySelectorAll('#card-options .card-option')].map(el=>el.getBoundingClientRect());
        const style=getComputedStyle(document.getElementById('card-options'));
        return {
          tablet:body.classList.contains('table-tablet'),
          statusScroll:status ? status.scrollWidth-status.clientWidth : 0,
          bonusScroll:bonus ? bonus.scrollWidth-bonus.clientWidth : 0,
          handX:hand?.getBoundingClientRect().x ?? 0,
          cardCols:style.gridTemplateColumns.split(' ').filter(Boolean).length,
          cardWidths:cards.map(r=>r.width)
        };
      });
      if (touch) assert.equal(tabletLayout.tablet,true,`tablet class ${width}x${height}`);
      if (height>width && width>=700) {
        assert.ok(tabletLayout.statusScroll<=1,`portrait status overflow ${width}: ${tabletLayout.statusScroll}`);
        assert.ok(tabletLayout.bonusScroll<=1,`portrait bonus overflow ${width}: ${tabletLayout.bonusScroll}`);
        assert.ok(tabletLayout.cardWidths.every(w=>w<=133),`portrait cards stay compact ${width}: ${tabletLayout.cardWidths}`);
      }
      if (width>height && width>=900 && height>=650) {
        assert.equal(tabletLayout.cardCols,1,`landscape hand is one column ${width}: ${tabletLayout.cardCols}`);
        assert.ok(tabletLayout.handX>width*.72,`landscape hand stays in right rail ${width}: ${tabletLayout.handX}`);
      }
    }
    const cellWidths=[];
    for (const color of ['purple','yellow','red','green','blue']) {
      await page.evaluate(color=>LocusTable.focus(document.getElementById(`${color}-zone`)),color);
      cellWidths.push(await page.locator(`#${color}-zone .cell:not(.void-cell)`).first().evaluate(c=>c.getBoundingClientRect().width));
    }
    assert.ok(cellWidths.every(w=>Math.abs(w-cellWidths[0])<.1),`shared cell size ${width}: ${cellWidths}`);
    const markers=await page.evaluate(()=>{
      const zone=document.getElementById('green-zone');
      const bold=getComputedStyle(zone.querySelector('.bold-cell'));
      const end=getComputedStyle(zone.querySelector('.end-cell:not(.active)'));
      const normal=getComputedStyle(zone.querySelector('.cell:not(.end-cell):not(.bold-cell):not(.void-cell):not(.active)'));
      return {border:bold.borderTopColor,borderWidth:bold.borderTopWidth,end:end.backgroundColor,normal:normal.backgroundColor};
    });
    assert.equal(markers.borderWidth,'2px');
    assert.notEqual(markers.border,'rgba(0, 0, 0, 0)');
    assert.notEqual(markers.end,markers.normal,'green endpoints retain their dark fill');
    const dragWidth=await page.evaluate(()=>{
      const block=makeDraggable([[1,1],[1,0]],{name:'groen',code:'#94d5a1'});
      document.body.append(block);
      const width=block.firstElementChild.getBoundingClientRect().width;
      block.remove();return width;
    });
    assert.ok(Math.abs(dragWidth-cellWidths[0])<.1,`drag cells match board ${width}: ${dragWidth}/${cellWidths[0]}`);
    await page.evaluate(()=>LocusTable.focus(document.getElementById('purple-zone')));
    const symbolLayout=await page.evaluate(()=>{
      const zone=document.getElementById('purple-zone');
      const empty=[...zone.querySelectorAll('.cell:not(.void-cell):not(.gold-cell):not(.bold-cell)')].find(c=>!c.children.length);
      setupPortalCell(empty,'purple-grid');
      const offsets=[...zone.querySelectorAll('.symbol,.portal-symbol')].map(s=>{
        const a=s.getBoundingClientRect(),b=s.closest('.cell').getBoundingClientRect();
        return Math.max(Math.abs(a.x+a.width/2-b.x-b.width/2),Math.abs(a.y+a.height/2-b.y-b.height/2));
      });
      const coin=zone.querySelector('.gold-cell'),c=getComputedStyle(coin),p=getComputedStyle(coin,'::after');
      return {offsets,coinRatio:parseFloat(p.width)/coin.getBoundingClientRect().width,
        coinX:parseFloat(p.left)-(coin.clientWidth/2),coinY:parseFloat(p.top)-(coin.clientHeight/2)};
    });
    assert.ok(symbolLayout.offsets.every(d=>d<1),'symbols and portal centered');
    assert.ok(symbolLayout.coinRatio>.54,'coins scale with the cell');
    assert.ok(Math.abs(symbolLayout.coinX)<1 && Math.abs(symbolLayout.coinY)<1,'coins centered');
    await page.locator('#menu-toggle').click();
    const menu=await page.locator('#controls').boundingBox();
    const toggle=await page.locator('#menu-toggle').boundingBox();
    assert.ok(Math.abs(menu.x+menu.width-toggle.x-toggle.width)<=2,'menu aligns with right edge of its button');
    assert.ok(menu.y>=toggle.y+toggle.height,'menu opens below button');
    await page.locator('#menu-toggle').click();
    if (process.env.SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});
      await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`locus-${width}x${height}.png`)});
    }
    assert.deepEqual(errors,[],`runtime errors ${width}`);
    console.log(`PASS layout ${width}x${height}`);
    await page.close();
  }
  const {page,errors}=await open(390,844,true);
  // A real tap selects a card; four rotations and two mirrors preserve its cells.
  await page.evaluate(() => {
    const card=document.querySelector('#card-options .card-option');
    const color={name:'paars',code:'#a478e0'};
    const shape=[[1,0],[1,1]];
    card.cardColor=color; card.cardData.color=color; card.cardShape=shape; card.cardData.matrix=shape;
    card.classList.remove('selection-disabled');
    updateCardPattern(card,shape,color);
  });
  await page.locator('#card-options .card-option').first().tap();
  assert.equal(await page.evaluate(()=>selectedColor?.name),'paars');
  const initial=await page.evaluate(()=>JSON.stringify(selectedShape));
  await page.locator('#rotate-card-btn').tap();
  assert.notEqual(await page.evaluate(()=>JSON.stringify(selectedShape)),initial);
  for(let i=0;i<3;i++) await page.locator('#rotate-card-btn').tap();
  assert.equal(await page.evaluate(()=>JSON.stringify(selectedShape)),initial);
  for(let i=0;i<2;i++) await page.locator('#mirror-card-btn').tap();
  assert.equal(await page.evaluate(()=>JSON.stringify(selectedShape)),initial);
  console.log('PASS selection, rotation and mirroring');
  // Pan with a selected card: neither movement nor its trailing click may place cells.
  await page.getByRole('button',{name:'Groen speelgebied',exact:true}).tap();
  const before=await page.evaluate(()=>document.querySelectorAll('#board .cell.active').length);
  const green=await page.locator('#green-zone').boundingBox();
  const touchSession=await page.context().newCDPSession(page);
  const scrollBefore=await page.locator('#green-zone').evaluate(z=>[z.scrollLeft,z.scrollTop]);
  await touchSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:green.x+180,y:green.y+200}]});
  await touchSession.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:green.x+100,y:green.y+140}]});
  await touchSession.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.notDeepEqual(await page.locator('#green-zone').evaluate(z=>[z.scrollLeft,z.scrollTop]),scrollBefore,'touch pans the map');
  assert.equal(await page.evaluate(()=>document.querySelectorAll('#board .cell.active').length),before);
  await page.waitForTimeout(450);
  // A wrong-color tap must also leave the board unchanged.
  const target=await page.evaluate(()=>[...document.querySelectorAll('#green-zone .cell:not(.void-cell)')].find(e=>{const r=e.getBoundingClientRect(),z=e.closest('.zone').getBoundingClientRect();return r.x>z.x+45&&r.right<z.right-45&&r.y>z.y+45&&r.bottom<z.bottom-45;})?.outerHTML);
  if (target) {
    await page.evaluate(()=>{const zone=document.getElementById('green-zone');const cell=[...zone.querySelectorAll('.cell:not(.void-cell)')].find(e=>{const r=e.getBoundingClientRect(),z=zone.getBoundingClientRect();return r.x>z.x+45&&r.right<z.right-45&&r.y>z.y+45&&r.bottom<z.bottom-45;});cell?.click();});
    assert.equal(await page.evaluate(()=>document.querySelectorAll('#board .cell.active').length),before);
  }
  // Edge indicators represent actual overflow, and survive a resize without rebuilding cells.
  await page.evaluate(()=>{const z=document.getElementById('green-zone');z.scrollLeft=z.scrollWidth;z.scrollTop=z.scrollHeight;});
  await page.waitForTimeout(80);
  assert.equal(await page.locator('[data-zone=green] .table-edge-right').isVisible(),false);
  assert.equal(await page.locator('[data-zone=green] .table-edge-left').isVisible(),true);
  const coords=await page.evaluate(()=>[...document.querySelectorAll('#board .cell')].map(c=>[c.dataset.zoneId,c.dataset.x,c.dataset.y]));
  await page.setViewportSize({width:844,height:390});
  await page.waitForTimeout(350);
  assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#board .cell')].map(c=>[c.dataset.zoneId,c.dataset.x,c.dataset.y])),coords);
  console.log('PASS pan safety, color rule, edges and orientation');
  // Place into a rule-validated purple cell using the UI click path, then undo.
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(400);
  await page.getByRole('button',{name:'Paars speelgebied',exact:true}).tap();
  await page.waitForTimeout(350);
  const anchor=await page.evaluate(()=>{
    const zone=document.getElementById('purple-zone');
    return [...zone.querySelectorAll('.cell:not(.void-cell)')].find(c=>canPlace(zone,Number(c.dataset.x),Number(c.dataset.y),selectedShape))?.dataset;
  });
  assert.ok(anchor,'valid purple placement exists');
  await page.locator(`#purple-zone .cell[data-x="${anchor.x}"][data-y="${anchor.y}"]`).tap();
  assert.ok(await page.evaluate(()=>document.querySelectorAll('#board .cell.active').length)>before,'tap places selected shape');
  await page.locator('#undo-inline-btn').tap();
  assert.equal(await page.evaluate(()=>document.querySelectorAll('#board .cell.active').length),before,'undo restores board');
  const exported=await page.evaluate(()=>getEditorBoardHtml());
  assert.ok(!exported.includes('table-zone-frame')&&!exported.includes('table-edge'));
  console.log('PASS placement, undo and clean editor export');
  assert.deepEqual(errors,[]);
  await page.close();
  const desktop=await open(1440,900,false);
  const d=desktop.page;
  for (const level of [1,22,32]) {
    await d.evaluate(level=>startLevel(level),level);
    await d.waitForTimeout(350);
    const count=await d.locator('.table-zone-frame:visible').count();
    assert.equal(count,level===32?3:5,`visible zones at level ${level}`);
    // Normal saves intentionally restart the level with a fresh hand (existing game behavior).
    const snapshot=await d.evaluate(()=>{
      saveGameState();
      return {level:currentLevel,zones:[...document.querySelectorAll('.table-zone-frame')].filter(e=>!e.hidden).length,hand:currentHand.length};
    });
    assert.equal(await d.evaluate(()=>loadGameState()),true);
    await d.waitForTimeout(350);
    assert.deepEqual(await d.evaluate(()=>({level:currentLevel,zones:[...document.querySelectorAll('.table-zone-frame')].filter(e=>!e.hidden).length,hand:currentHand.length})),snapshot);
  }
  // World-start selection is outside this layout fixture; dismiss it before menu checks.
  await d.evaluate(()=>{
    document.querySelectorAll('.modal-overlay').forEach(e=>e.classList.remove('show','active'));
    starterPicksDoneByWorld={'1':true,'2':true,'3':true,'4':true};
    preLevelStarterPicksDone=true;
    preLevelStarterPicksInProgress=false;
  });
  await d.locator('#menu-toggle').click();
  await d.locator('#classic-mode-toggle').click();
  await d.waitForTimeout(500);
  assert.equal(await d.locator('#table-app').isVisible(),false,'classic restores original layout');
  assert.equal(await d.locator('#board .cell').count()>0,true);
  await d.locator('#classic-mode-toggle').click();
  await d.waitForTimeout(500);
  assert.equal(await d.locator('#table-app').isVisible(),true,'modern layout restored at unchanged viewport');
  await d.locator('#menu-toggle').click();
  await d.evaluate(()=>startLevel(12));
  await d.waitForTimeout(350);
  const z=await d.locator('#green-zone').boundingBox();
  const oldScroll=await d.locator('#green-zone').evaluate(z=>[z.scrollLeft,z.scrollTop]);
  await d.mouse.move(z.x+z.width/2,z.y+z.height/2);
  await d.mouse.down();
  await d.mouse.move(z.x+z.width/2-60,z.y+z.height/2-60,{steps:6});
  await d.mouse.up();
  assert.notDeepEqual(await d.locator('#green-zone').evaluate(z=>[z.scrollLeft,z.scrollTop]),oldScroll);
  await d.waitForTimeout(450);
  const cue= d.locator('[data-zone=green] .table-edge-left');
  const beforeCue=await d.locator('#green-zone').evaluate(z=>z.scrollLeft);
  await cue.click();
  await d.waitForTimeout(500);
  assert.ok(await d.locator('#green-zone').evaluate(z=>z.scrollLeft)<beforeCue,'edge button pans');
  assert.deepEqual(desktop.errors,[]);
  console.log('PASS world variants, save/load, classic toggle, mouse pan and edge buttons');
  await d.close();
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();});
