const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  async function capture(level, file, viewport, mobile = false) {
    const context = await browser.newContext({
      viewport,
      isMobile: mobile,
      hasTouch: mobile,
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(String(err)));

    await page.addInitScript(() => {
      localStorage.setItem('locus_tutorial_v1_done', '1');
    });
    await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof window.startLevel === 'function', null, { timeout: 15000 });
    await page.evaluate(n => {
      // World-start starter pick modals intentionally interrupt direct level jumps.
      // Mark them completed so this screenshot really renders the requested World 4 level.
      starterPicksDoneByWorld = {'1':true,'2':true,'3':true,'4':true};
      preLevelStarterPicksDone = true;
      preLevelStarterPicksInProgress = false;
      document.querySelectorAll('.modal-overlay,[id$="-modal-layer"],.modal-layer').forEach(el => {
        el.classList.remove('show','active','open');
        if (el.style) el.style.display = 'none';
      });
      startLevel(n);
    }, level);
    await page.waitForTimeout(1900);

    await page.evaluate(() => {
      document.querySelectorAll('.modal-overlay,[id$="-modal-layer"],.modal-layer').forEach(el => {
        el.classList.remove('show', 'active', 'open');
        if (el.style) el.style.display = 'none';
      });
      window.dispatchEvent(new Event('resize'));
    });
    await page.waitForTimeout(1100);

    const state = await page.evaluate(() => {
      const purple = document.getElementById('purple-zone');
      const yellow = document.getElementById('yellow-zone');
      const purpleGrid = document.getElementById('purple-grid');
      const greenGrid = document.getElementById('green-grid');
      const gridBox = el => el ? el.getBoundingClientRect() : null;
      return {
        currentLevel: typeof currentLevel !== 'undefined' ? currentLevel : null,
        world4: document.body.classList.contains('world-4'),
        purpleCells: document.querySelectorAll('#purple-grid .cell').length,
        greenCells: document.querySelectorAll('#green-grid .cell').length,
        yellowCells: document.querySelectorAll('#yellow-grid .cell').length,
        keySvg: !!document.querySelector('.key-cell .key-glyph svg'),
        doorSvg: !!document.querySelector('.door-cell .door-glyph svg'),
        purpleSize: gridBox(purpleGrid) && { w: Math.round(gridBox(purpleGrid).width), h: Math.round(gridBox(purpleGrid).height) },
        greenSize: gridBox(greenGrid) && { w: Math.round(gridBox(greenGrid).width), h: Math.round(gridBox(greenGrid).height) },
        purpleScroll: purple && { left: Math.round(purple.scrollLeft), top: Math.round(purple.scrollTop), maxX: Math.max(0, purple.scrollWidth-purple.clientWidth), maxY: Math.max(0, purple.scrollHeight-purple.clientHeight) },
        yellowScroll: yellow && { left: Math.round(yellow.scrollLeft), top: Math.round(yellow.scrollTop), maxX: Math.max(0, yellow.scrollWidth-yellow.clientWidth), maxY: Math.max(0, yellow.scrollHeight-yellow.clientHeight) }
      };
    });

    console.log(file, JSON.stringify(state), 'pageErrors=', JSON.stringify(pageErrors));
    if (state.currentLevel !== level || !state.purpleCells || !state.greenCells || !state.yellowCells) {
      throw new Error('Requested World 4 board did not render: ' + JSON.stringify(state));
    }
    if (state.purpleSize && state.purpleSize.w === state.purpleSize.h) {
      throw new Error('Purple is unexpectedly square: ' + JSON.stringify(state.purpleSize));
    }
    if (level >= 34 && (!state.keySvg || !state.doorSvg)) {
      throw new Error('Vector key/lock did not render by 4.4: ' + JSON.stringify(state));
    }

    await page.screenshot({ path: file, fullPage: false });
    await context.close();
  }

  await capture(31, 'world4-latest-41-desktop.png', { width: 1600, height: 1000 });
  await capture(34, 'world4-latest-44-desktop.png', { width: 1600, height: 1000 });
  await capture(31, 'world4-latest-41-mobile.png', { width: 430, height: 932 }, true);

  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
