/* Focused regression checks for the Citadel tutorial, shop and tablet drag. */
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname;
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  try {
    res.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html');
    res.end(fs.readFileSync(file));
  } catch { res.writeHead(404).end(); }
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport:{width:1024,height:768}, hasTouch:true, isMobile:true });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.addInitScript(() => localStorage.setItem('locus_tutorial_v1_done', '1'));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const setup = await page.evaluate(() => {
      document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('show','active'));
      starterPicksDoneByWorld = {'1':true,'2':true,'3':true,'4':true};
      preLevelStarterPicksInProgress = false;
      startLevel(31);
      document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('show','active'));
      updateShopUpgradeUI();
      return {
        target:window.LocusWorld4.getLevelConfig(31).scoreTarget,
        keyCount:document.querySelectorAll('.key-cell').length,
        doorCount:document.querySelectorAll('.door-cell').length,
        guide:document.querySelector('.w4-intro-guide')?.textContent,
        featured:document.querySelectorAll('#shop-upgrade-container > .shop-upgrade-card').length,
        more:document.querySelectorAll('.shop-more-upgrades .shop-upgrade-card').length
      };
    });
    assert.equal(setup.target, 100);
    assert.equal(setup.keyCount, 1);
    assert.equal(setup.doorCount, 1);
    assert.match(setup.guide, /START.*sleutel/);
    assert.equal(setup.featured, 3);
    assert.ok(setup.more > 0);
    await page.waitForFunction(() => document.querySelector('#green-zone .cell')?.getBoundingClientRect().width >= 25);
    assert.ok(await page.evaluate(() => document.querySelector('#green-zone .cell').getBoundingClientRect().width >= 25),
      'Citadel cells remain touchable on a tablet');
    const phase = await page.evaluate(() => {
      unlockWorld4Color('blauw');
      window.LocusWorld4.onKeyActivated('blauw');
      const afterKey = document.querySelector('.w4-intro-guide')?.textContent;
      openWorld4Door('w4:31:gate:blue');
      const afterDoor = document.querySelector('.w4-intro-guide')?.textContent;
      UPGRADES.coinMaster.purchased = true;
      updateShopUpgradeUI();
      return { afterKey, afterDoor, owned:document.querySelector('.shop-owned-upgrades')?.textContent };
    });
    assert.match(phase.afterKey, /POORT/);
    assert.match(phase.afterDoor, /PUNTEN/);
    assert.match(phase.owned, /Muntmeester/);
    const positions = await page.evaluate(() => {
      const card = document.querySelector('#card-options .card-option').getBoundingClientRect();
      const cell = document.querySelector('#green-zone .cell:not(.active):not(.void-cell)').getBoundingClientRect();
      return { start:{x:card.x+card.width/2,y:card.y+card.height/2}, end:{x:cell.x+cell.width/2,y:cell.y+cell.height/2} };
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[positions.start]});
    for (let i=1; i<=10; i++) {
      await cdp.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[{
        x:positions.start.x+(positions.end.x-positions.start.x)*i/10,
        y:positions.start.y+(positions.end.y-positions.start.y)*i/10
      }]});
    }
    assert.equal(await page.evaluate(() => !!draggedBlock && dragHasMoved), true);
    await cdp.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
    assert.equal(await page.evaluate(() => isPointerDragging), false);
    const doorBonus = await page.evaluate(() => {
      UPGRADES.world4DoorSurge.purchased = true;
      startLevel(33);
      const before = freePlacementsRemaining;
      openWorld4Door('w4:33:gate:green');
      openWorld4Door('w4:33:gate:red');
      return freePlacementsRemaining - before;
    });
    assert.equal(doorBonus, 1, 'the door upgrade grants at most one placement per level');
    assert.deepEqual(errors, []);
    await page.close();

    const phone = await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    const phoneErrors = [];
    phone.on('pageerror', err => phoneErrors.push(err.message));
    await phone.addInitScript(() => localStorage.setItem('locus_tutorial_v1_done','1'));
    await phone.goto(`http://127.0.0.1:${server.address().port}`);
    await phone.waitForSelector('#preworld-pick-grid .preworld-pick-item');
    const choice = await phone.evaluate(() => {
      const items = [...document.querySelectorAll('#preworld-pick-grid .preworld-pick-item')];
      const outer = items[0].getBoundingClientRect();
      const inner = items[0].querySelector('.preworld-pick-card').getBoundingClientRect();
      return {inside:inner.bottom <= outer.bottom+1, separated:outer.bottom <= items[2].getBoundingClientRect().top+1,
        named:!!items[0].querySelector('.preworld-choice-name')?.textContent};
    });
    assert.deepEqual(choice, {inside:true,separated:true,named:true}, 'starter cards remain legible and separate');
    await phone.evaluate(() => document.getElementById('world4-demo-btn').click());
    await phone.evaluate(() => {window.confirm=()=>true;document.getElementById('preworld-pick-confirm').click();});
    await phone.waitForFunction(() => document.body.classList.contains('table-ui') && currentLevel === 31);
    await phone.waitForFunction(() => document.querySelector('#green-zone .bold-cell.w4-intro-start'));
    const mobile = await phone.evaluate(() => {
      const zone = document.getElementById('green-zone');
      const key = zone.querySelector('.key-cell').getBoundingClientRect();
      const start = zone.querySelector('.w4-intro-start').getBoundingClientRect();
      const viewport = zone.getBoundingClientRect();
      return {level:currentLevel, cell:zone.querySelector('.cell').getBoundingClientRect().width,
        focused:document.querySelector('.table-tab[aria-pressed="true"]')?.getAttribute('aria-controls'),
        keyVisible:key.right > viewport.left && key.left < viewport.right && key.bottom > viewport.top && key.top < viewport.bottom,
        startVisible:start.right > viewport.left && start.left < viewport.right && start.bottom > viewport.top && start.top < viewport.bottom,
        startValid:validateGreenPlacement(zone,[zone.querySelector('.w4-intro-start')]),
        field:[document.querySelector('#green-grid').dataset.rows,document.querySelector('#green-grid').dataset.cols,
          document.querySelector('#blue-grid').dataset.rows,document.querySelector('#purple-grid').dataset.rows],
        tabScore:document.querySelector('.table-tab[aria-controls="green-zone"] .table-tab-score')?.textContent,
        tabName:document.querySelector('.table-tab[aria-controls="green-zone"]')?.getAttribute('aria-label'),
        endTurnGold:document.getElementById('new-cards-btn').classList.contains('complete-round'),
        finalHand:drawPile.length === 0,
        keyIsStart:zone.querySelector('.key-cell').classList.contains('bold-cell'),
        keyAcceptsFirstCard:validateGreenPlacement(zone,[zone.querySelector('.key-cell')]),
        keyInk:getComputedStyle(zone.querySelector('.key-cell svg')).color,
        doorInk:getComputedStyle(document.querySelector('#blue-zone .door-cell svg')).color,
        headerHeight:document.getElementById('table-header').getBoundingClientRect().height,
        phaseHeight:document.getElementById('world4-phase-bar').getBoundingClientRect().height,
        mobileInstruction:document.querySelector('.w4-mobile-objective')?.textContent};
    });
    assert.equal(mobile.level,31,'demo opens the actual first Citadel level');
    assert.ok(mobile.cell>=27,'Citadel cells remain touchable on a phone');
    assert.equal(mobile.focused,'green-zone');
    assert.equal(mobile.keyVisible,true,'the first key is visible on opening');
    assert.equal(mobile.startVisible,true,'the separate green start is visible on opening');
    assert.equal(mobile.startValid,true,'the green start accepts the first placement');
    assert.deepEqual(mobile.field,['28','30','40','12'],'only the generated first-level fields shrink');
    assert.equal(mobile.tabScore,'0');
    assert.equal(mobile.tabName,'Groen speelgebied');
    assert.equal(mobile.endTurnGold,mobile.finalHand,'the final hand has a gold end-turn action');
    assert.equal(mobile.keyIsStart,false,'the key is separate from the start');
    assert.equal(mobile.keyAcceptsFirstCard,false,'the key cannot start the green route');
    assert.equal(mobile.keyInk,'rgb(255, 224, 120)','the key icon is readable against its dark tile');
    assert.equal(mobile.doorInk,'rgb(217, 240, 255)','the door icon is readable against its dark tile');
    assert.ok(mobile.headerHeight < 80 && mobile.phaseHeight < 40,'the tutorial leaves room for the board on a phone');
    assert.match(mobile.mobileInstruction,/startcel.*sleutel/i);
    const turnStates = await phone.evaluate(() => {
      const savedPile = drawPile;
      drawPile = [{}]; updateDrawButtonState();
      const next = document.getElementById('new-cards-btn').classList.contains('complete-round');
      drawPile = []; updateDrawButtonState();
      const end = document.getElementById('new-cards-btn').classList.contains('complete-round');
      drawPile = savedPile; updateDrawButtonState();
      return {next,end};
    });
    assert.deepEqual(turnStates,{next:false,end:true},'only the end-of-round action is gold');
    await phone.evaluate(() => {document.getElementById('green-score').textContent='14';});
    await phone.waitForFunction(() => document.querySelector('.table-tab[aria-controls="green-zone"] .table-tab-score')?.textContent === '14');
    assert.deepEqual(phoneErrors, []);
    await phone.close();
    console.log('PASS Citadel tutorial, shop, tablet drag and mobile layout');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode=1; });
