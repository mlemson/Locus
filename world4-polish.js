(function installWorld4Polish(){
  'use strict';
  if (window.__world4PolishInstalled) return;
  window.__world4PolishInstalled = true;

  function installStartCardPickerSorter() {
    const grid = document.getElementById('preworld-pick-grid');
    if (!grid || grid.dataset.costSorterInstalled === 'true') return;
    grid.dataset.costSorterInstalled = 'true';

    let sequence = 0;
    let sorting = false;

    const sortByCost = () => {
      if (sorting) return;
      const items = Array.from(grid.children).filter(el => el.classList && el.classList.contains('preworld-pick-item'));
      if (items.length < 2) return;

      items.forEach(item => {
        if (!item.dataset.preworldSortSequence) {
          item.dataset.preworldSortSequence = String(sequence++);
        }
      });

      const sorted = items.slice().sort((a, b) => {
        const costA = Number(a.dataset.cost || Number.POSITIVE_INFINITY);
        const costB = Number(b.dataset.cost || Number.POSITIVE_INFINITY);
        if (costA !== costB) return costA - costB;
        return Number(a.dataset.preworldSortSequence || 0) - Number(b.dataset.preworldSortSequence || 0);
      });

      const changed = sorted.some((item, index) => item !== items[index]);
      if (!changed) return;

      sorting = true;
      const fragment = document.createDocumentFragment();
      sorted.forEach(item => fragment.appendChild(item));
      grid.appendChild(fragment);
      sorting = false;
    };

    new MutationObserver(sortByCost).observe(grid, { childList: true });
    sortByCost();
  }

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
    document.addEventListener('DOMContentLoaded', () => {
      installObserver();
      installStartCardPickerSorter();
      scheduleCentering();
    }, { once:true });
  } else {
    installObserver();
    installStartCardPickerSorter();
    scheduleCentering();
  }
})();
