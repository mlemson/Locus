(function installWorld4Polish(){
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
