
(function(){
	function fit(){
		var b = document.querySelector('.board');
		if(!b) return;
		b.style.transform = '';
		b.style.transformOrigin = 'top left';
		var rect = b.getBoundingClientRect();
		var margin = 16;
		var scale = Math.min((window.innerWidth - margin) / rect.width, (window.innerHeight - margin) / rect.height, 1);

		// Try to center the start/root cell in the viewport when present.
		var root = b.querySelector('.print-focus') || b.querySelector('.root-cell') || b.querySelector('.cell.root') || b.querySelector('.cell.start');
		if (root) {
			var rootRect = root.getBoundingClientRect();
			var relX = (rootRect.left - rect.left) + (rootRect.width/2);
			var relY = (rootRect.top - rect.top) + (rootRect.height/2);
			var centerX = window.innerWidth / 2;
			var centerY = window.innerHeight / 2;
			// After scaling, the root center will be at rel*scale. Compute translation so it's at viewport center.
			var tx = centerX - (relX * scale);
			var ty = centerY - (relY * scale);
			// Apply scale first, then translate (translate values are in device pixels after scaling).
			b.style.transform = 'scale(' + scale.toFixed(4) + ') translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px)';
		} else {
			b.style.transform = 'scale(' + scale.toFixed(4) + ')';
		}
	}
	var __autoPrint = ${opts && typeof opts.autoPrint !== 'undefined' ? (opts.autoPrint ? 'true' : 'false') : 'true'};
	window.addEventListener('load', function(){ fit(); if(__autoPrint) setTimeout(function(){ window.print(); }, 200); });
	window.addEventListener('resize', fit);
})();
</scr` + `ipt>
</body></html>`;
		w.document.open();
		w.document.write(doc);
		w.document.close();
	}

	function performPrintFromSettings() {
		const opts = getPrintSettings();
		let boardHtml = '';
		if (opts.source === 'world1') {
			boardHtml = buildGeneratedPrintBoard('world1', opts.noBonuses);
		} else if (opts.source === 'world2') {
			boardHtml = buildGeneratedPrintBoard('world2', opts.noBonuses);
		} else {
			boardHtml = buildPrintBoardFromCurrent(opts.noBonuses);
		}
		openPrintWindow(boardHtml, opts);
	}

	function performPreviewFromSettings() {
		const opts = getPrintSettings();
		let boardHtml = '';
		if (opts.source === 'world1') {
			boardHtml = buildGeneratedPrintBoard('world1', opts.noBonuses);
		} else if (opts.source === 'world2') {
			boardHtml = buildGeneratedPrintBoard('world2', opts.noBonuses);
		} else {
			boardHtml = buildPrintBoardFromCurrent(opts.noBonuses);
		}
		// Open print window but do not auto-invoke window.print()
		openPrintWindow(boardHtml, Object.assign({}, opts, { autoPrint: false }));
	}

	if (printBtn) {
		printBtn.addEventListener('click', (e) => {
			e.preventDefault();
			showPrintSettings();
		});
	}
	if (printSettingsClose) {
		printSettingsClose.addEventListener('click', (e) => {
			e.preventDefault();
			hidePrintSettings();
		});
	}
	if (printSettingsCancel) {
		printSettingsCancel.addEventListener('click', (e) => {
			e.preventDefault();
			hidePrintSettings();
		});
	}
	if (printSettingsPrint) {
		printSettingsPrint.addEventListener('click', (e) => {
			e.preventDefault();
			hidePrintSettings();
			performPrintFromSettings();
		});
	}
	if (printSettingsPreview) {
		printSettingsPreview.addEventListener('click', (e) => {
			e.preventDefault();
			hidePrintSettings();
			performPreviewFromSettings();
		});
	}
	if (editorBtn) {
		editorBtn.addEventListener('click', (e) => {
			e.preventDefault();
			// Close the hamburger menu if open.
			try {
				const menuToggle = document.getElementById('menu-toggle');
				const controls = document.getElementById('controls');
				if (menuToggle) menuToggle.classList.remove('active');
				if (controls) controls.classList.remove('open');
			} catch (err) {}
			openEditorWindow();
		});
	}
	if (printSettingsLayer) {
		printSettingsLayer.addEventListener('click', (e) => {
			if (e.target === printSettingsLayer) hidePrintSettings();
		});
	}
	
	if (confirmCompleteYes) {
	  confirmCompleteYes.addEventListener('click', () => {
		const callback = pendingRoundCompletion;
		hideCompleteRoundConfirm();
		if (typeof callback === 'function') {
			callback();
		} else if (newCardsButton) {
			newCardsButton.focus();
		}
	  });
	}
	if (confirmCompleteNo) {
	  confirmCompleteNo.addEventListener('click', () => {
		hideCompleteRoundConfirm();
		if (newCardsButton) newCardsButton.focus();
	  });
	}
	if (confirmCompleteLayer) {
		confirmCompleteLayer.addEventListener('click', event => {
		  if (event.target === confirmCompleteLayer) {
			hideCompleteRoundConfirm();
			if (newCardsButton) newCardsButton.focus();
		  }
		});
	}
	document.addEventListener('keydown', event => {
		if (event.key !== 'Escape') return;
		if (confirmNewGameLayer && confirmNewGameLayer.classList.contains('show')) {
			hideNewGameConfirm();
			return;
		}
		if (confirmCompleteLayer && confirmCompleteLayer.classList.contains('show')) {
			hideCompleteRoundConfirm();
			if (newCardsButton) newCardsButton.focus();
			return;
		}
		if (blackHoleModalLayer && blackHoleModalLayer.classList.contains('show')) {
			forfeitBlackHoleChallenge();
			return;
		}
		if (deckModalLayer && deckModalLayer.classList.contains('show')) {
			closeDeckModal();
		}
	});
	if (roundModalNext) {
	  const handleRoundNext = () => {
		hideAllModals();
		if (lastRoundWasSuccess) {
		  const upcomingLevel = currentLevel + 1;
		  try {
			const prevWorldInfo = (typeof getWorldAndSubLevel === 'function') ? getWorldAndSubLevel(currentLevel) : { world: 1 };
			const nextWorldInfo = (typeof getWorldAndSubLevel === 'function') ? getWorldAndSubLevel(upcomingLevel) : { world: 1 };
			const prevWorld = Number(prevWorldInfo?.world || 1);
			const nextWorld = Number(nextWorldInfo?.world || 1);
			if (Number.isFinite(prevWorld) && Number.isFinite(nextWorld) && nextWorld > prevWorld) {
				logWorldProgress({
					event: 'world_reached',
					world: nextWorld,
					level: upcomingLevel,
					prevWorld,
					prevLevel: currentLevel
				});
			}
		  } catch (e) {}
		  
		  // BELANGRIJK: Reset ALLE scores EN objectives VOORDAT we currentLevel updaten
		  // Dit voorkomt dat de nieuwe level objective wordt gecontroleerd met oude scores
		  resetScoreState();
		  resetObjectives();
		  document.querySelectorAll('#scoreboard .score').forEach(el => {
			el.textContent = '0';
		  });
		  const totalScoreEl = document.getElementById('total-score');
		  if (totalScoreEl) totalScoreEl.textContent = '0';
		  latestScoreSnapshot = { yellow: 0, red: 0, green: 0, purple: 0, blue: 0, bonus: 0, total: 0 };
		  
		  // NU pas currentLevel updaten
		  currentLevel = upcomingLevel;
		  // Werk de objective header meteen bij (leveltitel verversen)
		  try { setCurrentObjectiveForLevel(currentLevel); } catch (e) {}
		  
		  // Save direct na level completion
		  saveGameState();
		  
		  // Check voor nieuwe unlocks
		  const levelUnlocks = UNLOCK_PROGRESSION.getLevelUnlocks(upcomingLevel, currentWorld);
		  // One-time announcement: traps become relevant after completing level 4.
		  let announceTraps = false;
		  try {
			const trapsIntroKey = 'locus_traps_intro_shown_v1';
			announceTraps = (Number(upcomingLevel) === 5 && !localStorage.getItem(trapsIntroKey));
			if (announceTraps) localStorage.setItem(trapsIntroKey, 'true');
		  } catch {
			announceTraps = (Number(upcomingLevel) === 5);
		  }
		  if (announceTraps) {
			levelUnlocks.features = Array.isArray(levelUnlocks.features) ? levelUnlocks.features : [];
			levelUnlocks.features.push({
				id: 'trapsIntro',
				icon: '⚠️',
				name: 'Traps actief',
				description: 'Pas op voor valkuilen!'
			});
		  }
		  const hasUnlocks = levelUnlocks.cardCategories.length > 0 || levelUnlocks.upgrades.length > 0 || (levelUnlocks.features && levelUnlocks.features.length > 0);
		  
		  if (hasUnlocks) {
			// Toon unlock modal met callback naar shop
			showUnlockModal(levelUnlocks, () => {
				openShopModal(() => startLevel(currentLevel));
			});
		  } else {
			// Geen unlocks, ga direct naar shop
			openShopModal(() => startLevel(currentLevel));
		  }
		} else {
		  startNewRun();
		}
	  };
	  roundModalNext.addEventListener('click', handleRoundNext);
	  roundModalNext.addEventListener('touchend', (e) => {
		e.preventDefault();
		handleRoundNext();
	  });
	}
	if (roundModalRestart) {
	  const handleRestart = () => {
		if (lastRoundWasSuccess) {
			showNewGameConfirm();
			return;
		}
		hideAllModals();
		startNewRun();
	  };
	  roundModalRestart.addEventListener('click', handleRestart);
	  roundModalRestart.addEventListener('touchend', (e) => {
		e.preventDefault();
		handleRestart();
	  });
	}
	if (roundModalCurrentRun) {
	  const handleReturnToCurrentRun = () => {
		hideAllModals();
		// Restore the exact previous run snapshot (level + cards/upgrades/coins + board).
		let restored = false;
		try {
			if (typeof restorePreviousNormalRunSnapshot === 'function') {
				restored = !!restorePreviousNormalRunSnapshot();
			}
		} catch (e) { restored = false; }
		if (!restored) {
			// Fallback to the legacy behavior (best effort)
			try {
				if (window) {
					window._locusScenarioMode = false;
					window._locusScenarioLoaded = false;
					window._locusRunMode = 'normal';
					window._locusEditorApplied = false;
					window.scenarioAllowedColors = null;
					window.loadedCustomLevelMeta = null;
					window.loadedCustomObjectiveCompiled = null;
					window.loadedCustomLevelMetaCompleted = false;
				}
			} catch (e) {}
			try { portalsActive = false; clearPortals(); } catch (e) {}
			let loaded = false;
			try {
				const hasSave = !!localStorage.getItem('locusGameSave');
				if (hasSave && typeof loadGameState === 'function') loaded = !!loadGameState();
			} catch (e) { loaded = false; }
			if (!loaded) startNewRun();
			try { requestAnimationFrame(() => requestAnimationFrame(autoCenterScrollableZones)); } catch (e) {}
		}
	  };
	  roundModalCurrentRun.addEventListener('click', handleReturnToCurrentRun);
	  roundModalCurrentRun.addEventListener('touchend', (e) => {
		e.preventDefault();
		handleReturnToCurrentRun();
	  });
	}
	if (shopModalSkip) {
	  const handleSkipShop = () => skipShop();
	  shopModalSkip.addEventListener('click', handleSkipShop);
	  shopModalSkip.addEventListener('touchend', (e) => {
		e.preventDefault();
		handleSkipShop();
	  });
	}
	
	// Shop modal kruisje handler
	const shopModalClose = document.getElementById('shop-modal-close');
	if (shopModalClose) {
	  const handleCloseShop = () => skipShop();
	  shopModalClose.addEventListener('click', handleCloseShop);
	  shopModalClose.addEventListener('touchend', (e) => {
		e.preventDefault();
		handleCloseShop();
	  });
	}
	
	// Unlock Modal handler - met touch support voor mobiel
	const unlockModalContinue = document.getElementById('unlock-modal-continue');
	if (unlockModalContinue) {
		const handleUnlockContinue = () => {
			hideUnlockModal();
		};
		unlockModalContinue.addEventListener('click', handleUnlockContinue);
		unlockModalContinue.addEventListener('touchend', (e) => {
			e.preventDefault(); // Voorkom dubbele trigger
			handleUnlockContinue();
		});
	}
	
	if (upgradeModalClose) {
	  upgradeModalClose.addEventListener('click', () => {
		upgradeModalLayer?.classList.remove('show');
	  });
	}

	// Rules Modal handlers
	const rulesModalLayer = document.getElementById('rules-modal-layer');
	const rulesModalClose = document.getElementById('rules-modal-close');
	
	window.showRulesModal = function() {
		if (rulesModalLayer) {
			rulesModalLayer.classList.add('show');
		}
	};

	if (rulesModalClose) {
		rulesModalClose.addEventListener('click', () => {
			rulesModalLayer?.classList.remove('show');
		});
	}
	
	if (rulesModalLayer) {
		rulesModalLayer.addEventListener('click', (e) => {
			if (e.target === rulesModalLayer) {
				rulesModalLayer.classList.remove('show');
			}
		});
	}

	const bonusZoneEl = document.getElementById('bonus-zone');
	if (bonusZoneEl) {
	  bonusZoneEl.addEventListener('pointerdown', onBonusPointerDown);
	  bonusZoneEl.addEventListener('click', event => {
		const badge = event.target.closest('.bonus-badge');
		if (badge) event.preventDefault();
	  });
	}
	updateBonusInventoryUI();
	// startNewRun() is verplaatst naar de game initialization functie
	initialiseCoins();
	addCoin();
	
	// Initialiseer de +1 blokplaatsing knop en preview
	const buyPlacementBtn = document.getElementById('buy-placement-btn');
	const purchasedBlockPreview = document.getElementById('purchased-block-preview');
	if (buyPlacementBtn) {
	  buyPlacementBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		onBuyPlacementClick();
	  });
	  buyPlacementBtn.addEventListener('pointerdown', (e) => {
		e.stopPropagation();
	  });
	  buyPlacementBtn.addEventListener('pointerup', (e) => {
		e.stopPropagation();
	  });
	  updateBuyPlacementButton();
	}
	if (purchasedBlockPreview) {
	  // Gebruik pointerdown voor zowel mouse als touch
	  purchasedBlockPreview.addEventListener('pointerdown', (e) => {
		e.stopPropagation();
		e.preventDefault(); // Voorkom touch scroll
		// Capture pointer voor touch devices
		if (e.pointerId !== undefined) {
			try {
				purchasedBlockPreview.setPointerCapture(e.pointerId);
			} catch (err) { /* ignore */ }
		}
		onPurchasedBlockPreviewClick(e);
	  });
	  purchasedBlockPreview.addEventListener('click', (e) => {
		e.stopPropagation();
	  });
	  // Touch events als fallback
	  purchasedBlockPreview.addEventListener('touchstart', (e) => {
		// Niet blokkeren als pointerdown al afgehandeld is
		if (e.defaultPrevented) return;
		e.stopPropagation();
		const touch = e.touches[0];
		if (touch) {
			onPurchasedBlockPreviewClick({
				clientX: touch.clientX,
				clientY: touch.clientY,
				pointerType: 'touch',
				pointerId: touch.identifier
			});
		}
	  }, { passive: false });
	}

  // expose some helpers for debugging
	window.createGrid = createGrid;
	window.generateRoots = generateRoots;
	// Wrap updateScore so scenario monitor runs after each score recalculation
	try {
		window._origUpdateScore = updateScore;
		window.updateScore = function(cell) {
			try { window._origUpdateScore(cell); } catch(e) { try { window._origUpdateScore(cell); } catch(e){} }
			try { if (typeof monitorScenarioProgress === 'function') monitorScenarioProgress(); } catch(e){}
		};
	} catch (e) {
		window.updateScore = updateScore;
	}
  
  
	function hideEmptyZones() {
	const zones = document.querySelectorAll('#original-coins-zone, #original-score-zone, #original-objective-zone, #original-card-zone, #original-controls-zone, #original-bonus-zone');
	  zones.forEach(zone => {
		if (zone.children.length === 0) {
		  zone.style.display = 'none';
		} else {
		  zone.style.display = '';
		}
	  });
	}
 
	function getCardSizing() {
		const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
		// If we're in a zoomed-in mobile view, prefer measuring the actual
		// rendered cell size from the active zoom zone so card previews use
		// the same cell size as the board.
		try {
			if (document.body.classList.contains('zoomed-in') && typeof activeZoomZone !== 'undefined' && activeZoomZone) {
				const measured = Math.round(getActualCellSize(activeZoomZone));
				return {
					cardSize: isMobile ? 140 : 110,
					cellSize: Number.isFinite(measured) && measured > 6 ? measured : (isMobile ? 14 : 20)
				};
			}
		} catch (e) {}
		return {
			cardSize: isMobile ? 140 : 110,
			cellSize: isMobile ? 14 : 20
		};
	}

	function applyCardSizing() {
	const { cellSize: fallbackCellSize } = getCardSizing();
	const isMobile = window.innerWidth <= (typeof MOBILE_BREAKPOINT !== 'undefined' ? MOBILE_BREAKPOINT : 650);
	const allCards = document.querySelectorAll('#card-choice-zone .card-option, .shop-card .card-option, #deck-modal-content .card-option, #golden-unlock-content .card-option');
	allCards.forEach(card => {
		const cols = parseInt(card.dataset.shapeCols || '0', 10);
		const rows = parseInt(card.dataset.shapeRows || '0', 10);
		const pattern = card.querySelector('.card-pattern');
		const cells = pattern ? pattern.querySelectorAll('.card-cell') : card.querySelectorAll('.card-cell');

		// On mobile, cards inside #bottom-bar use their CSS --preview-cell value;
		// we must actively re-apply it because updateCardPattern may have set
		// board-sized inline styles before the card was in the DOM.
		if (isMobile && card.closest('#bottom-bar')) {
			const cssCellSizeRaw = (getComputedStyle(card).getPropertyValue('--preview-cell') || '').trim();
			const cssCellSize = parseFloat(cssCellSizeRaw);
			const cellSize = Number.isFinite(cssCellSize) && cssCellSize > 0 ? cssCellSize : 8;
			if (pattern && cols) pattern.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
			if (pattern && rows) pattern.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
			cells.forEach(cell => {
			  cell.style.width = `${cellSize}px`;
			  cell.style.height = `${cellSize}px`;
			});
			return;
		}

		const cssCellSizeRaw = (getComputedStyle(card).getPropertyValue('--preview-cell') || '').trim();
		const cssCellSize = parseFloat(cssCellSizeRaw);
		const cellSize = Number.isFinite(cssCellSize) && cssCellSize > 0 ? cssCellSize : fallbackCellSize;
		if (pattern && cols) pattern.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
		if (pattern && rows) pattern.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
		cells.forEach(cell => {
		  cell.style.width = `${cellSize}px`;
		  cell.style.height = `${cellSize}px`;
		});
	});

	const sizingGroups = [
		{ selector: '#card-choice-zone .card-option', extra: 92 },
		{ selector: '#deck-modal-content .card-option', extra: 82 },
		{ selector: '#golden-unlock-content .card-option', extra: 82 },
		{ selector: '.shop-card .card-option', extra: 82 }
	];
	sizingGroups.forEach(group => {
		const cards = Array.from(document.querySelectorAll(group.selector));
		if (!cards.length) return;
		const maxRows = cards.reduce((max, card) => {
			const rows = parseInt(card.dataset.shapeRows || '0', 10);
			return Math.max(max, Number.isFinite(rows) ? rows : 0);
		}, 0);
		const sample = cards[0];
		const cssCellSizeRaw = (getComputedStyle(sample).getPropertyValue('--preview-cell') || '').trim();
		const cssCellSize = parseFloat(cssCellSizeRaw);
		const cellSize = Number.isFinite(cssCellSize) && cssCellSize > 0 ? cssCellSize : fallbackCellSize;
		// Laat de hoogte meeschalen met de inhoud; mobile mag lager en regelbaar via JS.
		let requestedHeight = Math.max(0, (maxRows * cellSize) + group.extra);
		const isMobile = window.innerWidth <= (typeof MOBILE_BREAKPOINT !== 'undefined' ? MOBILE_BREAKPOINT : 650);
		const mobileCap = typeof window.mobileHandHeightCap === 'number' ? window.mobileHandHeightCap : 120;
		const mobileFloor = typeof window.mobileHandHeightFloor === 'number' ? window.mobileHandHeightFloor : 60;
		// Maak hand-kaarten op mobiel ~20% lager (deck-overview formaat) tenzij overschreven.
		if (isMobile && group.selector === '#card-choice-zone .card-option') {
			const handHeightScale = typeof window.mobileHandHeightScale === 'number' ? window.mobileHandHeightScale : 0.8;
			requestedHeight = requestedHeight * handHeightScale;
		}
		const minHeight = isMobile
			? Math.min(Math.max(mobileFloor, requestedHeight), mobileCap)
			: requestedHeight;
		cards.forEach(card => {
			card.style.minHeight = `${minHeight}px`;
			card.style.height = 'auto';
		});

		// Op mobiel: stem de CSS variabele voor hand-kaarten af op de berekende hoogte,
		// zodat de bottom-bar (card-choice-zone) dezelfde hoogte ziet als de inline kaart.
		const isHandGroup = group.selector === '#card-choice-zone .card-option';
		if (isHandGroup && isMobile) {
			document.documentElement.style.setProperty('--hand-card-height', `${minHeight}px`);
		} else if (isHandGroup && !isMobile) {
			// Laat desktop terugvallen op stylesheetwaarden.
			document.documentElement.style.removeProperty('--hand-card-height');
		}
	});
	}

	function applyMobileHandFitForFiveCards() {
		const bottomBar = document.getElementById('bottom-bar');
		if (!bottomBar) return;
		const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
		if (!isMobile) {
			bottomBar.style.removeProperty('--hand-card-width');
			return;
		}
		const cardControls = document.getElementById('card-controls');
		const cardOptions = document.getElementById('card-options');
		const actionButtons = document.getElementById('card-action-buttons');
		if (!cardControls || !cardOptions || !actionButtons) return;

		const cards = cardOptions.querySelectorAll('.card-option');
		const cardCount = cards.length;
		if (cardCount < 1) {
			bottomBar.style.removeProperty('--hand-card-width');
			return;
		}
		// Only auto-fit when the hand is too wide (e.g. 5+ cards).
		// For 3–4 cards we keep the CSS value (so width stays at the requested 32px).
		if (cardCount <= 4) {
			bottomBar.style.removeProperty('--hand-card-width');
			return;
		}

		const rootStyles = getComputedStyle(document.documentElement);
		const cardGap = parseFloat(rootStyles.getPropertyValue('--hand-card-gap')) || 6;
		const controlsGapRaw = getComputedStyle(cardControls).gap || '0px';
		const controlsGap = parseFloat(String(controlsGapRaw).split(' ')[0]) || 0;
		const optionsStyles = getComputedStyle(cardOptions);
		const paddingLeft = parseFloat(optionsStyles.paddingLeft) || 0;
		const paddingRight = parseFloat(optionsStyles.paddingRight) || 0;
		const available = cardControls.clientWidth
			- actionButtons.offsetWidth
			- controlsGap
			- paddingLeft
			- paddingRight;
		if (!(available > 0)) return;

		const targetWidth = Math.floor((available - (cardGap * Math.max(0, cardCount - 1))) / cardCount);
		// Boost de gewenste breedte lichtjes voor meer leesbaarheid (20% default).
		const desired = parseFloat(rootStyles.getPropertyValue('--hand-card-width')) || 40;
		const widthBoost = typeof window.mobileHandWidthBoost === 'number' ? window.mobileHandWidthBoost : 1.2;
		const boostedDesired = desired * widthBoost;
		const fitted = Math.max(32, Math.min(targetWidth, boostedDesired));
		bottomBar.style.setProperty('--hand-card-width', `${fitted}px`);
	}

	function scaleBoardForDesktop() {
		const board = document.getElementById('board');
		if (!board) return;
		const boardContainer = board.parentElement;
		const desktopBottom = document.getElementById('desktop-bottom');
		const desktopWrapper = document.getElementById('desktop-wrapper');
		const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;
		const isMobileSidebar = document.body.classList.contains('mobile-sidebar-layout');
		if (!isDesktop || isMobileSidebar) {
			logLayout('scale:desktop:skip', { isDesktop, isMobileSidebar });
			if (desktopWrapper) {
				desktopWrapper.style.removeProperty('transform');
				desktopWrapper.style.removeProperty('transform-origin');
			}
			board.style.removeProperty('transform');
			board.style.removeProperty('transform-origin');
			if (boardContainer && boardContainer.id === 'desktop-grids') {
				boardContainer.style.removeProperty('justify-content');
			}
			if (desktopBottom) {
				desktopBottom.style.removeProperty('margin-top');
			}
			document.body.classList.remove('board-scaled');
			return;
		}

		if (!desktopWrapper) {
			board.style.removeProperty('transform');
			board.style.removeProperty('transform-origin');
			document.body.classList.remove('board-scaled');
			logLayout('scale:desktop:no-wrapper');
			return;
		}

		// reset inline transforms before measuring
		desktopWrapper.style.removeProperty('transform');
		desktopWrapper.style.removeProperty('transform-origin');

		// Always clear board-only scaling first; we may apply wrapper-level scaling.
		board.style.removeProperty('transform');
		board.style.removeProperty('transform-origin');

		const isPortrait = document.body.classList.contains('desktop-portrait');
		const isLandscape = document.body.classList.contains('desktop-landscape');

		// Desktop-landscape: scale the entire desktop wrapper so board + side UI fit together.
		if (isLandscape) {
			if (boardContainer && boardContainer.id === 'desktop-grids') {
				boardContainer.style.removeProperty('justify-content');
			}
			if (desktopBottom) {
				desktopBottom.style.removeProperty('margin-top');
			}
			document.body.classList.remove('board-scaled');

			// The body has padding: 10px on each side.
			// Be conservative: transformed content + shadows can otherwise get clipped at the viewport edges.
			const viewportW = document.documentElement ? document.documentElement.clientWidth : window.innerWidth;
			const viewportH = document.documentElement ? document.documentElement.clientHeight : window.innerHeight;
			// Margin to avoid edge clipping from shadows/rounding.
			// Keep this modest so the left/right panels don't get unnecessarily cramped.
			const safeMargin = 12;
			const availableWidth = Math.max(viewportW - safeMargin, 280);
			const availableHeight = Math.max(viewportH - safeMargin, 240);
			const contentWidth = desktopWrapper.scrollWidth;
			const contentHeight = desktopWrapper.scrollHeight;
			if (!(contentWidth > 0 && contentHeight > 0)) return;

			const scale = Math.min(availableWidth / contentWidth, availableHeight / contentHeight, 1);
			if (scale < 0.999) {
				// Anchor to the left so narrow screens don't waste space on the left,
				// but center it when there is spare horizontal room after scaling.
				desktopWrapper.style.transformOrigin = 'top center';
				const scaledWidth = contentWidth * scale;
				// const offsetX = Math.max(0, (viewportW - scaledWidth) / 2);
				desktopWrapper.style.transform = `scale(${scale.toFixed(4)})`;
			} else {
				desktopWrapper.style.removeProperty('transform');
				desktopWrapper.style.removeProperty('transform-origin');
			}
			return;
		}
		
		// Calculate sidebar widths for landscape mode
		let rightSidebarWidth = 0;
		if (isLandscape) {
			const wrapper = document.getElementById('desktop-wrapper');
			const rightSidebar = wrapper ? wrapper.querySelector('.desktop-right-column, #right-sidebar, [class*="right"]') : null;
			if (rightSidebar) {
				rightSidebarWidth = rightSidebar.offsetWidth || 200;
			} else {
				// Estimate sidebar width based on viewport
				rightSidebarWidth = Math.min(220, window.innerWidth * 0.18);
			}
		}
		
		// Portrait mode: leave more room for bottom bar
		// Landscape mode: account for right sidebar
		// Short height (<=925px): need extra room for compact bottom bar
		const isShortHeight = window.innerHeight <= 925;
		const bottomReserve = isPortrait ? (isShortHeight ? 150 : 160) : 70;
		const horizontalPadding = isPortrait ? 40 : 40;
		const sidebarReserve = isLandscape ? (rightSidebarWidth + 40) : 0; // sidebar + gap
		
		const availableWidth = Math.max(window.innerWidth - horizontalPadding - sidebarReserve, 280);
		const availableHeight = Math.max(window.innerHeight - horizontalPadding - bottomReserve, 200);
		const boardWidth = board.scrollWidth;
		const boardHeight = board.scrollHeight;
		if (!boardWidth || !boardHeight) return;
		logLayout('scale:desktop:measure', { boardWidth, boardHeight, availableWidth, availableHeight, isPortrait, isLandscape });

		// For constrained viewports (925-1650px), be more aggressive with scaling
		const isConstrainedLandscape = isLandscape && window.innerWidth < 1650;
		const maxScale = 1;
		
		const scale = Math.min(availableWidth / boardWidth, availableHeight / boardHeight, maxScale);
		const containerWidth = (boardContainer && boardContainer.clientWidth) ? boardContainer.clientWidth : (window.innerWidth - sidebarReserve);
		const scaledBoardWidth = boardWidth * scale;
		const scaledBoardHeight = boardHeight * scale;
		const offsetX = Math.max((containerWidth - scaledBoardWidth) / 2, 0);

		if (scale < 0.999) {
			// When we scale with CSS transforms, layout width stays unscaled.
			// If the parent is centered flex, this can push the board off to the left.
			// Fix by left-aligning layout and translating the scaled board back to center.
			if (boardContainer && boardContainer.id === 'desktop-grids') {
				boardContainer.style.justifyContent = 'flex-start';
			}
			// Desktop-portrait: compensate for transform-scale whitespace by pulling the bottom UI up.
			// This avoids clipping the board (transform doesn't affect layout height).
			if (isPortrait && desktopBottom) {
				const gap = Math.max(0, Math.round(boardHeight - scaledBoardHeight));
				desktopBottom.style.marginTop = gap ? `-${gap}px` : '';
			} else if (desktopBottom) {
				desktopBottom.style.removeProperty('margin-top');
			}
			board.style.transform = `translateX(${offsetX.toFixed(1)}px) scale(${scale})`;
			board.style.transformOrigin = 'top left';
			document.body.classList.add('board-scaled');
			logLayout('scale:desktop:set', { scale, offsetX, boardWidth, boardHeight, availableWidth, availableHeight });
		} else {
			board.style.removeProperty('transform');
			board.style.removeProperty('transform-origin');
			if (boardContainer && boardContainer.id === 'desktop-grids') {
				boardContainer.style.removeProperty('justify-content');
			}
			if (desktopBottom) {
				desktopBottom.style.removeProperty('margin-top');
			}
			document.body.classList.remove('board-scaled');
			logLayout('scale:desktop:clear');
		}
	}

	function scaleBoardForMobile() {
		const board = document.getElementById('board');
		if (!board) return;
		const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
		if (!isMobile) {
			document.documentElement.style.removeProperty('--board-scale');
			document.body.classList.remove('board-mobile-scaled');
			logLayout('scale:mobile:skip');
			return;
		}
		const isClassicMode = document.body.classList.contains('classic-mode');
		if (isClassicMode) {
			document.documentElement.style.setProperty('--board-scale', '1');
			document.body.classList.remove('board-mobile-scaled');
			return;
		}

		// Reset any inline desktop transform if we just crossed breakpoints.
		board.style.removeProperty('transform');
		board.style.removeProperty('transform-origin');
		document.body.classList.remove('board-scaled');

		const rootStyles = getComputedStyle(document.documentElement);
		const bottomBar = document.getElementById('bottom-bar');
		const bottomBarMeasured = (!isClassicMode && bottomBar) ? bottomBar.getBoundingClientRect().height : 0;
		const bottomBarCss = isClassicMode ? 0 : (parseFloat(rootStyles.getPropertyValue('--bottom-bar-height')) || 0);
		const bottomBarHeight = Math.max(bottomBarMeasured || 0, bottomBarCss || 0);
		const mobileObjective = document.getElementById('mobile-objective-banner');
		const objectiveHeight = mobileObjective ? mobileObjective.getBoundingClientRect().height : 0;

		// Provide some breathing room so we never render past the edges.
		const horizontalPadding = 16;
		const verticalPadding = 24;
		const availableWidth = Math.max(window.innerWidth - horizontalPadding, 280);
		const availableHeight = Math.max(window.innerHeight - bottomBarHeight - objectiveHeight - verticalPadding, 280);

		const boardWidth = board.scrollWidth;
		const boardHeight = board.scrollHeight;
		if (!boardWidth || !boardHeight) return;
		logLayout('scale:mobile:measure', { boardWidth, boardHeight, availableWidth, availableHeight, bottomBarHeight, objectiveHeight });

		const scaleW = availableWidth / boardWidth;
		const scaleH = availableHeight / boardHeight;
		// If the board is much taller than the viewport (e.g., long scrollable zones),
		// don't let height drive the scale too small; fit to width instead.
		const heightIsTall = boardHeight > (availableHeight * 1.15);
		let scale = Math.min(scaleW, heightIsTall ? 1 : scaleH, 1);
		scale = Math.max(0.25, Math.min(scale, 1));
		document.documentElement.style.setProperty('--board-scale', scale.toFixed(3));
		document.body.classList.add('board-mobile-scaled');
		logLayout('scale:mobile:set', { scale, scaleW, scaleH, heightIsTall });
	}

	// Remove desktop-wrapper when switching layouts to force rebuild
	// Defined before moveGameElements so it can be called from there
	function cleanupDesktopWrapper() {
		const desktopWrapper = document.getElementById('desktop-wrapper');
		if (!desktopWrapper) return;
		
		// Get references to elements that need to be restored
		const board = document.getElementById('board');
		const score = document.getElementById('scoreboard');
		const coins = document.getElementById('gold-zone');
		const objective = document.getElementById('objective-zone');
		const bonus = document.getElementById('bonus-zone');
		const cards = document.getElementById('card-choice-zone');
		const controls = document.getElementById('controls');
		
		// Find original containers
		const origCoins = document.getElementById('original-coins-zone');
		const origScore = document.getElementById('original-score-zone');
		const origCards = document.getElementById('original-card-zone');
		const origBonus = document.getElementById('original-bonus-zone');
		const origObjective = document.getElementById('original-objective-zone');
		
		// Restore elements to original containers
		if (score && origScore && !origScore.contains(score)) {
			origScore.appendChild(score);
		}
		if (coins && origCoins && !origCoins.contains(coins)) {
			origCoins.appendChild(coins);
		}
		if (cards && origCards && !origCards.contains(cards)) {
			origCards.appendChild(cards);
		}
		if (bonus && origBonus && !origBonus.contains(bonus)) {
			origBonus.appendChild(bonus);
		}
		if (objective && origObjective && !origObjective.contains(objective)) {
			origObjective.appendChild(objective);
		}
		
		// Move board back to body (before mobile-landscape-wrapper if it exists)
		const mlWrapper = document.getElementById('mobile-landscape-wrapper');
		if (board && board.parentNode !== document.body) {
			if (mlWrapper) {
				document.body.insertBefore(board, mlWrapper.nextSibling);
			} else {
				// Find a suitable position - after any wrapper containers
				const bottomBar = document.getElementById('bottom-bar');
				if (bottomBar) {
					document.body.insertBefore(board, bottomBar);
				} else {
					document.body.appendChild(board);
				}
			}
		}
		
		// Move controls back to body
		if (controls && controls.parentNode !== document.body) {
			document.body.appendChild(controls);
		}
		
		// Now remove the empty desktop wrapper
		desktopWrapper.remove();
	}

	function runZoneSizingOnce() {
		if (!zoneSizingNeedsRun) return;
		zoneSizingNeedsRun = false;
		try {
			const worldInfo = typeof getWorldAndSubLevel === 'function' ? getWorldAndSubLevel(currentLevel) : null;
			if (worldInfo && (worldInfo.world === 2 || worldInfo.world === 3)) {
				adjustZoneSizesForWorld2();
			}
		} catch (_) {}
		let didSync = false;
		try { didSync = !!syncZoneHeights(); } catch (_) { didSync = false; }
		if (!didSync) {
			zoneSizingNeedsRun = true;
			try { requestAnimationFrame(() => requestAnimationFrame(runZoneSizingOnce)); } catch (_) {}
			return;
		}
		// One-time deferred sync to catch sizing set in rAF inside adjustZoneSizesForWorld2.
		try { requestAnimationFrame(() => { try { syncZoneHeights(); } catch (_) {} }); } catch (_) {}
		try { scheduleGreenCenter({ force: false, allowZoom: false, fallback: true, fallbackDelay: 140 }); } catch (_) {}
	}

	function moveGameElements() {
	  const width = window.innerWidth;
	  const height = window.innerHeight;
	  const isMobile = width <= MOBILE_BREAKPOINT;
	  
	  // Bepaal portrait/landscape primair op basis van afmetingen (iPad/Safari matchMedia kan misrapporteren).
	  const ORIENTATION_EPS = 24; // px tolerance to avoid flapping near-square viewports
	  const effectiveLandscape = (width - height) > ORIENTATION_EPS;
	  const effectivePortrait = (height - width) > ORIENTATION_EPS;
	  // Fallback if near-square
	  const isPortrait = effectivePortrait || (!effectiveLandscape && height >= width);
	  
	  // Touch device check - belangrijk voor onderscheid desktop vs tablet/telefoon
	  // isCoarsePointer() checkt voor touch-primaire devices
	  const isTouchDevice = isCoarsePointer();
	  const isLargeTouchScreen = isTouchDevice && Math.min(width, height) >= 700;
	  
	  // Desktop breakpoints - voor wanneer bottom layout beter is
	  const DESKTOP_NARROW_BREAKPOINT = 800; // Was 925, nu smaller voor meer sidebar gebruik
	  const DESKTOP_SHORT_HEIGHT_BREAKPOINT = 500; // Was 925, nu korter - sidebars werken ook bij korte hoogte
	  
	  // BELANGRIJK: Verschil maken tussen:
	  // 1. Desktop/laptop (muis) → gebruikt normale desktop layout (sidebars of bottom)
	  // 2. Tablet/telefoon (touch) in landscape → gebruikt compacte mobile sidebar layout
	  
	  // Mobile sidebar layout is ALLEEN voor kleine touch screens (phones/small tablets) in landscape.
	  // Grote tablets (iPad) gebruiken de normale desktop layout.
	  const useMobileSidebarLayout = isTouchDevice && !isLargeTouchScreen && effectiveLandscape && 
	                                  width <= MOBILE_BREAKPOINT && height >= 350;
	  
	  const useDesktopLayout = !isMobile && !useMobileSidebarLayout;
	  // Desktop sidebar layout: landscape met voldoende breedte
	  const useDesktopLandscape = useDesktopLayout && effectiveLandscape && width > DESKTOP_NARROW_BREAKPOINT;
	  // Bottom layout: portrait of te smal
	  const isNarrowDesktop = useDesktopLayout && width <= DESKTOP_NARROW_BREAKPOINT;
	  const isShortDesktop = useDesktopLayout && height <= DESKTOP_SHORT_HEIGHT_BREAKPOINT;
	  
	  // Touch device in portrait mode
	  const isTouchPortrait = isTouchDevice && !useMobileSidebarLayout && !effectiveLandscape;
	  
	  // Desktop bottom layout: alleen in portrait of als echt te smal
	  // NIET meer gebaseerd op short height - sidebars werken goed met scroll
	  const useDesktopPortrait = useDesktopLayout && (isPortrait || isNarrowDesktop);
	  
	  // Add body classes for CSS targeting
	  document.body.classList.toggle('mobile-sidebar-layout', useMobileSidebarLayout);
	  document.body.classList.toggle('touch-portrait', isTouchPortrait);
	  document.body.classList.remove('mobile-landscape'); // deprecated class
	  
	  // Desktop classes - ook voor grote tablets (iPad) zodat portrait/landscape correct werkt
	  if (useDesktopLayout) {
		  document.body.classList.toggle('desktop-portrait', useDesktopPortrait);
		  document.body.classList.toggle('desktop-landscape', useDesktopLandscape && !useDesktopPortrait);
	  } else {
		  document.body.classList.remove('desktop-portrait', 'desktop-landscape');
	  }
	logLayout('moveGameElements:mode', {
		width,
		height,
		isMobile,
		isTouchDevice,
		useMobileSidebarLayout,
		useDesktopLayout,
		useDesktopLandscape,
		useDesktopPortrait
	});

		  const coins = document.getElementById('gold-zone');
		  const score = document.getElementById('scoreboard');
		  const objective = document.getElementById('objective-zone');
		  const bonus = document.getElementById('bonus-zone');
		  const cards = document.getElementById('card-choice-zone');
		  const controls = document.getElementById('controls');
		  const board = document.getElementById('board');

			  const bottomBarScore = document.getElementById('bottom-bar-score');
			  const bottomBarRight = document.getElementById('bottom-bar-cards');
			  const bottomBarBonus = document.getElementById('bottom-bar-bonus');
			  const bottomBarCoins = document.getElementById('bottom-bar-coins');
			  const bottomBarScoreCoins = document.getElementById('bottom-bar-score-coins');
		  const mobileObjective = document.getElementById('mobile-objective-banner');
		  
		  // Mobile Sidebar containers
		  const mlWrapper = document.getElementById('mobile-landscape-wrapper');
		  const mlLeft = document.getElementById('ml-sidebar-left');
		  const mlCenter = document.getElementById('ml-board-center');
		  const mlRight = document.getElementById('ml-sidebar-right');
		  const mlObjectiveTop = document.getElementById('ml-objective-top');

	const origCoins = document.getElementById('original-coins-zone');
	const origScore = document.getElementById('original-score-zone');
	const origObjective = document.getElementById('original-objective-zone');
	const origBonus = document.getElementById('original-bonus-zone');
	  const origCards = document.getElementById('original-card-zone');
	  const origControls = document.getElementById('original-controls-zone');

			// === MOBILE LANDSCAPE SIDEBAR LAYOUT ===
			// Dit geldt ALLEEN voor touch devices (tablets/telefoons) in landscape mode
			// Desktop/laptop behoudt normale layout
			if (useMobileSidebarLayout) {
				// Zorg dat de sidebar wrapper elementen bestaan
				if (!mlWrapper || !mlLeft || !mlCenter || !mlRight) {
					console.warn('Mobile landscape wrapper elements not found, cannot use sidebar layout');
				} else {
					logLayout('moveGameElements:mobile-sidebar');
				// Remove desktop wrapper if exists - use centralized cleanup
				if (document.getElementById('desktop-wrapper')) {
					cleanupDesktopWrapper();
				}
				
				// Show wrapper
				mlWrapper.style.display = 'flex';
				
				// Move elements to sidebars
				if (score && !mlLeft.contains(score)) mlLeft.appendChild(score);
				if (coins && !mlLeft.contains(coins)) mlLeft.appendChild(coins);
				
				// Move objective to top of center column
				if (objective && mlObjectiveTop && !mlObjectiveTop.contains(objective)) {
					mlObjectiveTop.appendChild(objective);
					mlObjectiveTop.style.display = 'flex';
				}
				
				if (board && !mlCenter.contains(board)) mlCenter.appendChild(board);
				if (cards && !mlRight.contains(cards)) mlRight.appendChild(cards);
				if (bonus && !mlRight.contains(bonus)) mlRight.appendChild(bonus);
				return;
				}
			}
			
			// Hide mobile sidebar wrapper when not in that mode
			if (mlWrapper) mlWrapper.style.display = 'none';
			if (mlObjectiveTop) mlObjectiveTop.style.display = 'none';

				if (isMobile) {
				logLayout('moveGameElements:mobile-bottom', { classic: document.body.classList.contains('classic-mode') });
				const isClassicMode = document.body.classList.contains('classic-mode');
				// Remove desktop wrapper if exists - use centralized cleanup
				if (document.getElementById('desktop-wrapper')) {
					cleanupDesktopWrapper();
				}
				
					// Move elements to bottom bar sections
					if (score && bottomBarScore && !bottomBarScore.contains(score)) bottomBarScore.appendChild(score);
					if (objective && mobileObjective && !mobileObjective.contains(objective)) mobileObjective.appendChild(objective);
					if (cards && bottomBarRight && !bottomBarRight.contains(cards)) bottomBarRight.appendChild(cards);

					// Mobile footer: row above scoreboard = bonus inventory + coin total + buy button.
					// In classic mode, the bottom bar is hidden: keep coins outside the bottom bar.
					if (bonus && bottomBarBonus && !bottomBarBonus.contains(bonus) && !isClassicMode) bottomBarBonus.appendChild(bonus);
					if (coins && bottomBarBonus && !bottomBarBonus.contains(coins) && !isClassicMode) bottomBarBonus.appendChild(coins);
					if (coins && board && !board.contains(coins) && isClassicMode) board.appendChild(coins);
					const buyPlacementContainer = document.getElementById('buy-placement-container');
					if (buyPlacementContainer && coins && !coins.contains(buyPlacementContainer)) {
						coins.appendChild(buyPlacementContainer);
					}

				if (controls && controls.parentNode !== document.body) document.body.appendChild(controls);
				
			} else {
			closeZoom();
			logLayout('moveGameElements:desktop', { landscape: useDesktopLandscape, portrait: useDesktopPortrait });

				// Ensure the buy button lives inside the coin zone again on desktop.
				const buyPlacementContainer = document.getElementById('buy-placement-container');
				if (buyPlacementContainer && coins && !coins.contains(buyPlacementContainer)) {
					coins.appendChild(buyPlacementContainer);
				}
		
		// Toggle body class for portrait bottom layout (keep both flags consistent)
		document.body.classList.toggle('desktop-portrait', useDesktopPortrait);
		document.body.classList.toggle('desktop-landscape', useDesktopLandscape && !useDesktopPortrait);
		
		// Create desktop wrapper if not exists
		let desktopWrapper = document.getElementById('desktop-wrapper');
		if (!desktopWrapper) {
			desktopWrapper = document.createElement('div');
			desktopWrapper.id = 'desktop-wrapper';
			
			// Create containers
			const desktopMenu = document.createElement('div');
			desktopMenu.id = 'desktop-menu';
			
			const desktopObjective = document.createElement('div');
			desktopObjective.id = 'desktop-objective';
			
			const desktopLeft = document.createElement('div');
			desktopLeft.id = 'desktop-left';
			
			const desktopGrids = document.createElement('div');
			desktopGrids.id = 'desktop-grids';
			
			const desktopRight = document.createElement('div');
			desktopRight.id = 'desktop-right';
			
			const desktopBottom = document.createElement('div');
			desktopBottom.id = 'desktop-bottom';
			
			// Create bottom section columns for portrait mode
			const bottomLeft = document.createElement('div');
			bottomLeft.id = 'desktop-bottom-left';
			const bottomCenter = document.createElement('div');
			bottomCenter.id = 'desktop-bottom-center';
			const bottomButtons = document.createElement('div');
			bottomButtons.id = 'desktop-bottom-buttons';
			const bottomRight = document.createElement('div');
			bottomRight.id = 'desktop-bottom-right';
			
			desktopBottom.appendChild(bottomLeft);
			desktopBottom.appendChild(bottomCenter);
			desktopBottom.appendChild(bottomButtons);
			desktopBottom.appendChild(bottomRight);
			
			desktopWrapper.appendChild(desktopMenu);
			desktopWrapper.appendChild(desktopObjective);
			desktopWrapper.appendChild(desktopLeft);
			desktopWrapper.appendChild(desktopGrids);
			desktopWrapper.appendChild(desktopRight);
			desktopWrapper.appendChild(desktopBottom);					// Insert wrapper before board
					if (board) {
						board.parentNode.insertBefore(desktopWrapper, board);
					}
					
					// Desktop menu toggle is handled by the single #menu-toggle overlay.
				}
				
				// Move elements to desktop positions
				const desktopMenu = document.getElementById('desktop-menu');
				const desktopObjective = document.getElementById('desktop-objective');
				const desktopLeft = document.getElementById('desktop-left');
				const desktopGrids = document.getElementById('desktop-grids');
				const desktopRight = document.getElementById('desktop-right');
				const desktopBottom = document.getElementById('desktop-bottom');
				const bottomLeft = document.getElementById('desktop-bottom-left');
				const bottomCenter = document.getElementById('desktop-bottom-center');
				const bottomButtons = document.getElementById('desktop-bottom-buttons');
				const bottomRight = document.getElementById('desktop-bottom-right');
				
				if (controls && desktopMenu && !desktopMenu.contains(controls)) {
					desktopMenu.appendChild(controls);
				}
				// Remove legacy duplicated desktop toggle if it exists from older versions.
				const legacyDesktopToggle = document.getElementById('desktop-menu-toggle');
				if (legacyDesktopToggle) legacyDesktopToggle.remove();
				if (objective && desktopObjective && !desktopObjective.contains(objective)) {
					desktopObjective.appendChild(objective);
				}
				if (board && desktopGrids && !desktopGrids.contains(board)) {
					desktopGrids.appendChild(board);
				}
				
				if (useDesktopPortrait) {
					// Portrait mode: gebruik bottom layout
					if (score && bottomLeft && !bottomLeft.contains(score)) {
						bottomLeft.appendChild(score);
					}
					if (cards && bottomCenter && !bottomCenter.contains(cards)) {
						bottomCenter.appendChild(cards);
					}
					
					// Move action buttons below cards in portrait mode
					// On touch devices (iPad portrait), buttons should be BELOW cards, not in separate column
					const actionButtons = document.getElementById('card-action-buttons');
					if (actionButtons) {
						// Remove from current parent first
						if (actionButtons.parentNode) {
							actionButtons.parentNode.removeChild(actionButtons);
						}
						// On touch device: add buttons BELOW cards (inside bottomCenter)
						// On non-touch: use separate button zone (bottomButtons)
						if (isTouchDevice && bottomCenter) {
							bottomCenter.appendChild(actionButtons);
						} else if (bottomButtons) {
							bottomButtons.appendChild(actionButtons);
						}
					}
					
					if (bonus && bottomRight && !bottomRight.contains(bonus)) {
						bottomRight.appendChild(bonus);
					}
					// Coins (counter + buy button) under the bonuses in portrait bottom layout.
					if (coins && bottomRight && !bottomRight.contains(coins)) {
						bottomRight.appendChild(coins);
					}
				} else {
					// Landscape mode: gebruik sidebar layout
					if (score && desktopLeft && !desktopLeft.contains(score)) {
						desktopLeft.appendChild(score);
					}
					if (coins && desktopLeft && !desktopLeft.contains(coins)) {
						desktopLeft.appendChild(coins);
					}
					if (cards && desktopRight && !desktopRight.contains(cards)) {
						desktopRight.appendChild(cards);
					}
					
					// In landscape mode, buttons go to separate zone below cards
					const actionButtons = document.getElementById('card-action-buttons');
					if (actionButtons) {
						// Remove from current parent first
						if (actionButtons.parentNode) {
							actionButtons.parentNode.removeChild(actionButtons);
						}
						// Add directly to desktopRight
						if (desktopRight) {
							desktopRight.appendChild(actionButtons);
						}
					}
					
					if (bonus && desktopRight && !desktopRight.contains(bonus)) {
						desktopRight.appendChild(bonus);
					}
				}
						
			}
	  
	  
	}

	function scrollChildIntoView(container, child, opts = {}) {
	  if (!container || !child) return;
	  const alignX = opts.alignX || 'center';
	  const alignY = opts.alignY || 'center';
	  const paddingY = Number.isFinite(opts.paddingY) ? opts.paddingY : 16;
	  const containerRect = container.getBoundingClientRect();
	  const childRect = child.getBoundingClientRect();
	  const currentLeft = container.scrollLeft;
	  const currentTop = container.scrollTop;
	  const deltaLeft = childRect.left - containerRect.left;
	  const deltaTop = childRect.top - containerRect.top;
	  let targetLeft = currentLeft;
	  let targetTop = currentTop;
	  if (alignX === 'center') {
		targetLeft = currentLeft + deltaLeft - (containerRect.width / 2 - childRect.width / 2);
	  }
	  if (alignY === 'center') {
		targetTop = currentTop + deltaTop - (containerRect.height / 2 - childRect.height / 2);
	  } else if (alignY === 'bottom') {
		targetTop = currentTop + deltaTop - (containerRect.height - childRect.height - paddingY);
	  }
	  container.scrollLeft = Math.max(0, targetLeft);
	  container.scrollTop = Math.max(0, targetTop);
	}

	function autoCenterScrollableZones() {
		// Do not auto-center while zoomed-in; it causes jumps on mobile.
		if (document.body.classList.contains('zoomed-in')) return;
	  // Only auto-center when the user hasn't scrolled yet (prevents fighting the player).
	  const greenZone = document.getElementById('green-zone');
	  const greenMem = (() => {
		try { return getZoneScrollMemory('green-zone'); } catch (_) { return null; }
	  })();
	  // World 1: green zone is intentionally non-scrollable (overflow hidden).
	  // Avoid programmatically scrolling it, because that looks like a late layout shift.
	  const greenScrollDisabled = (() => {
		if (!greenZone) return true;
		if (greenZone.classList.contains('no-scroll')) return true;
		try {
			const st = getComputedStyle(greenZone);
			const ox = st.overflowX;
			const oy = st.overflowY;
			return (ox === 'hidden' || ox === 'clip') && (oy === 'hidden' || oy === 'clip');
		} catch (_) {
			return false;
		}
	  })();
	  const greenShouldAutoCenter = !(greenMem && greenMem.normal && greenMem.normal.initialized);
	  if (greenZone && !greenScrollDisabled && greenShouldAutoCenter) {
		try { scheduleGreenCenter({ force: false, allowZoom: false, fallback: true, fallbackDelay: 140 }); } catch (_) {}
	  }

	  const blueZone = document.getElementById('blue-zone');
	  const blueShouldAutoCenter = (() => {
		try {
			const mem = getZoneScrollMemory('blue-zone');
			return !(mem && mem.normal && mem.normal.initialized);
		} catch (_) {
			return true;
		}
	  })();
	  if (blueZone && blueShouldAutoCenter && blueZone.scrollTop <= 2) {
		const boldCells = Array.from(document.querySelectorAll('#blue-grid .cell.bold-cell'));
		if (boldCells.length) {
			const maxY = Math.max(...boldCells.map(cell => Number(cell.dataset.y) || 0));
			const bottomCells = boldCells.filter(cell => (Number(cell.dataset.y) || 0) === maxY);
			bottomCells.sort((a, b) => (Number(a.dataset.x) || 0) - (Number(b.dataset.x) || 0));
			const target = bottomCells[Math.floor(bottomCells.length / 2)] || boldCells[0];
			scrollChildIntoView(blueZone, target, { alignX: 'center', alignY: 'bottom', paddingY: 18 });
		} else {
			blueZone.scrollTop = blueZone.scrollHeight;
			blueZone.scrollLeft = Math.max(0, (blueZone.scrollWidth - blueZone.clientWidth) / 2);
		}
	  }
	}

	// Centralized layout reflow (used on resize/orientation changes)
	let layoutReflowTimer = null;
	let layoutReflowInProgress = false;
	let lastLayoutViewportKey = '';
	let lastLayoutMode = ''; // track layout mode to detect switches
	const LOG_LAYOUT = false; // Set to true for layout debugging
	let pendingReflowKey = null;
	let pendingReflowDelay = 0;

	function logLayout(step, data) {
		if (!LOG_LAYOUT) return;
		const t = (performance && typeof performance.now === 'function') ? performance.now().toFixed(1) : Date.now();
		try {
			console.log(`[layout] ${t} ${step}`, data || '');
		} catch (_) {}
	}

	// Ensure font-dependent sizing settles before scaling/layout steps that measure text.
	function waitForFontsReadyThen(cb) {
		try {
			const ready = document.fonts && document.fonts.ready;
			if (ready && typeof ready.then === 'function') {
				ready.then(() => { try { cb(); } catch (_) {} }).catch(() => { try { cb(); } catch (_) {} });
				return;
			}
		} catch (_) {}
		// Fallback: run on next frame so layout has a chance to settle.
		try { requestAnimationFrame(() => { try { cb(); } catch (_) {} }); } catch (_) { try { cb(); } catch (_) {} }
	}
	function resetLayoutTransforms() {
		try {
			const board = document.getElementById('board');
			if (board) {
				board.style.removeProperty('transform');
				board.style.removeProperty('transform-origin');
				board.style.removeProperty('width');
				board.style.removeProperty('height');
			}
			const desktopWrapper = document.getElementById('desktop-wrapper');
			if (desktopWrapper) {
				desktopWrapper.style.removeProperty('transform');
				desktopWrapper.style.removeProperty('transform-origin');
				desktopWrapper.style.removeProperty('width');
				desktopWrapper.style.removeProperty('height');
			}
			// Reset all desktop layout containers
			['desktop-grids', 'desktop-left', 'desktop-right', 'desktop-bottom', 
			 'desktop-bottom-left', 'desktop-bottom-center', 'desktop-bottom-buttons', 'desktop-bottom-right',
			 'desktop-objective', 'desktop-menu'].forEach(id => {
				const el = document.getElementById(id);
				if (el) {
					el.style.removeProperty('transform');
					el.style.removeProperty('transform-origin');
					el.style.removeProperty('width');
					el.style.removeProperty('height');
					el.style.removeProperty('display');
				}
			});
			// Reset mobile sidebar containers
			['mobile-landscape-wrapper', 'ml-sidebar-left', 'ml-board-center', 'ml-sidebar-right', 'ml-objective-top'].forEach(id => {
				const el = document.getElementById(id);
				if (el) {
					el.style.removeProperty('transform');
					el.style.removeProperty('width');
					el.style.removeProperty('height');
				}
			});
			document.documentElement.style.removeProperty('--board-scale');
		} catch (_) {}
	}
	
	// Determine current layout mode for comparison
	function getCurrentLayoutMode() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const isMobile = width <= MOBILE_BREAKPOINT;
		const isTouchDevice = isCoarsePointer();
		const isLargeTouchScreen = isTouchDevice && Math.min(width, height) >= 700;
		const ORIENTATION_EPS = 24;
		const effectiveLandscape = (width - height) > ORIENTATION_EPS;
		const useMobileSidebarLayout = isTouchDevice && !isLargeTouchScreen && effectiveLandscape && width <= MOBILE_BREAKPOINT && height >= 350;
		if (useMobileSidebarLayout) return 'mobile-sidebar';
		if (isMobile) return 'mobile';
		const effectivePortrait = (height - width) > ORIENTATION_EPS;
		const isPortrait = effectivePortrait || (!effectiveLandscape && height >= width);
		if (isPortrait || width <= 800) return 'desktop-portrait';
		return 'desktop-landscape';
	}
	
	function reflowLayout() {
		if (layoutReflowInProgress) return;
		layoutReflowInProgress = true;
		logLayout('reflowLayout:start');
		try { document.body.classList.add('layout-reflow'); } catch (_) {}
		
		// Detect layout mode changes and clean up wrapper if needed
		try {
			const currentMode = getCurrentLayoutMode();
			if (lastLayoutMode && lastLayoutMode !== currentMode) {
				logLayout('layoutMode:change', { from: lastLayoutMode, to: currentMode });
				// Layout mode changed - clean up old wrapper to force rebuild
				cleanupDesktopWrapper();
				// Also reset all body layout classes
				document.body.classList.remove('mobile-sidebar-layout', 'touch-portrait', 
					'desktop-portrait', 'desktop-landscape', 'mobile-landscape');
				// Ensure zone sizing runs once for the new layout
				markZoneSizingNeeded();
			}
			lastLayoutMode = currentMode;
		} catch (_) {}
		
		// Step 1: clear stale inline sizing/transforms
		try { resetWorldLayoutStyles(); } catch (_) {}
		try { resetLayoutTransforms(); } catch (_) {}
		logLayout('layout:reset-done');
		// Step 2: re-place DOM blocks for current breakpoint/orientation
		try {
			moveGameElements();
			logLayout('layout:moved');
		} catch (e) {
			logLayout('layout:moved:error', e?.message || e);
		}
		// Step 3: run sizing/spacing on next frames so layout has settled
		try {
			requestAnimationFrame(() => {
				logLayout('layout:rAF-phase1');
				try { hideEmptyZones(); } catch (_) {}
				try { runZoneSizingOnce(); } catch (_) {}
				try { renderTrapSummary(); } catch (_) {}
				try { autoCenterScrollableZones(); } catch (_) {}
				try { placeActionButtons(); } catch (_) {}
				try { applyCardSizing(); } catch (_) {}
				try { applyMobileHandFitForFiveCards(); } catch (_) {}
				try { if (typeof updateHandScrollControls === 'function') updateHandScrollControls(); } catch (_) {}
				try { if (activeZoomZone) applyMobileZoomSizing(activeZoomZone); } catch (_) {}
				try { if (activeZoomZone) schedulePlaceholderSync(activeZoomZone); } catch (_) {}
				requestAnimationFrame(() => {
					// Now scale the board AFTER layout has settled and fonts are ready
					logLayout('layout:rAF-phase2');
					waitForFontsReadyThen(() => {
						try {
							scaleBoardForDesktop();
							logLayout('scale:desktop');
						} catch (e) {
							logLayout('scale:desktop:error', e?.message || e);
						}
						try {
							scaleBoardForMobile();
							logLayout('scale:mobile');
						} catch (e) {
							logLayout('scale:mobile:error', e?.message || e);
						}
						try { document.body.classList.remove('layout-reflow'); } catch (_) {}
						try { document.body.classList.remove('board-loading'); } catch (_) {}
						layoutReflowInProgress = false;
						logLayout('reflowLayout:done');
						if (pendingReflowKey) {
							const nextKey = pendingReflowKey;
							const nextDelay = pendingReflowDelay;
							pendingReflowKey = null;
							pendingReflowDelay = 0;
							if (nextKey === lastLayoutViewportKey) {
								logLayout('reflowLayout:pending-skip-same', { key: nextKey });
							} else {
								// reset last key so the queued run executes
								lastLayoutViewportKey = '';
								scheduleLayoutReflow(nextDelay || 0);
								logLayout('reflowLayout:run-pending', { key: nextKey, delay: nextDelay });
							}
						}
					});
				});
			});
		} catch (_) {
			// Fallback if rAF is blocked
			try {
				scaleBoardForDesktop();
				logLayout('scale:desktop:fallback');
			} catch (e) {
				logLayout('scale:desktop:error:fallback', e?.message || e);
			}
			try {
				scaleBoardForMobile();
				logLayout('scale:mobile:fallback');
			} catch (e) {
				logLayout('scale:mobile:error:fallback', e?.message || e);
			}
			try { document.body.classList.remove('layout-reflow'); } catch (_) {}
			try { document.body.classList.remove('board-loading'); } catch (_) {}
			layoutReflowInProgress = false;
			logLayout('reflowLayout:done:fallback');
			if (pendingReflowKey) {
				const nextKey = pendingReflowKey;
				const nextDelay = pendingReflowDelay;
				pendingReflowKey = null;
				pendingReflowDelay = 0;
				if (nextKey === lastLayoutViewportKey) {
					logLayout('reflowLayout:pending-skip-same', { key: nextKey, fallback: true });
				} else {
					lastLayoutViewportKey = '';
					scheduleLayoutReflow(nextDelay || 0);
					logLayout('reflowLayout:run-pending', { key: nextKey, delay: nextDelay, fallback: true });
				}
			}
		}
	}

	// Initial run
	function scheduleLayoutReflow(delay = 60) {
		const w = Math.round((window.innerWidth || 0) / 10) * 10;
		const h = Math.round((window.innerHeight || 0) / 20) * 20;
		// Include layout mode in key so orientation changes trigger reflow even at same dimensions
		const currentMode = getCurrentLayoutMode();
		const key = `${w}x${h}:${currentMode}`;

		if (layoutReflowInProgress) {
			// Avoid stacking identical requests while a reflow is active.
			if (key === lastLayoutViewportKey || key === pendingReflowKey) {
				logLayout('schedule:pending-skip-same', { key, pending: pendingReflowKey, last: lastLayoutViewportKey });
				return;
			}
			pendingReflowKey = key;
			pendingReflowDelay = delay;
			logLayout('schedule:pending-in-progress', { key, delay });
			return;
		}
		if (key === lastLayoutViewportKey && !layoutReflowInProgress) {
			logLayout('schedule:skip-same-key', { key });
			return;
		}
		lastLayoutViewportKey = key;
		if (layoutReflowTimer) clearTimeout(layoutReflowTimer);
		layoutReflowTimer = setTimeout(() => {
			logLayout('schedule:run', { key, delay });
			try { requestAnimationFrame(reflowLayout); } catch (_) { reflowLayout(); }
		}, delay);
	}
	
	// Laad opgeslagen spel of start nieuw spel (na alle initialisaties)
	// Check EERST of er een save is voordat we iets doen
	(function initializeGame() {
		// Scenario links must take full control and stay isolated from saves/current run.
		try {
			if (typeof tryLoadScenarioFromUrl === 'function' && tryLoadScenarioFromUrl()) {
				if (typeof scheduleLayoutReflow === 'function') scheduleLayoutReflow(0);
				return;
			}
		} catch (e) {}
		const hasSave = localStorage.getItem('locusGameSave');
		// By default do NOT auto-restore save on page reload to avoid surprising persistent decks.
		// Set AUTO_LOAD_SAVED_GAME = true to restore previous behavior.
		const AUTO_LOAD_SAVED_GAME = true;
		if (hasSave && AUTO_LOAD_SAVED_GAME) {
			if (loadGameState()) {
				if (typeof scheduleLayoutReflow === 'function') scheduleLayoutReflow(0);
				return;
			} else {
				console.warn('⚠️ Failed to load save, starting new game');
			}
		} else {
		}
		
		// Als we hier komen: geen save of laden mislukt
		startNewRun();
		if (typeof scheduleLayoutReflow === 'function') scheduleLayoutReflow(0);
	})();

	// Run again on resize/orientation with a stable reflow
	const handleViewportChange = () => scheduleLayoutReflow(120);
	window.addEventListener('resize', handleViewportChange, { passive: true });
	window.addEventListener('orientationchange', () => {
		// Force reflow on orientation change - reset the viewport key to ensure it triggers
		lastLayoutViewportKey = '';
		lastLayoutMode = '';
		scheduleLayoutReflow(180);
	}, { passive: true });
	if (window.visualViewport) {
		// visualViewport resize triggers frequent mid-frame reflows on mobile; rely on window resize only.
	}

	// Menu toggle handled earlier (removed duplicate handler)
	
	// ========================================
	// HIGH SCORE SYSTEM (ADDED)
	// ========================================
	
	function getHighScore() {
		return Number(localStorage.getItem('locusHighScore') || '0');
	}

	function updateHighScore(currentScore) {
		const oldHigh = getHighScore();
		if (currentScore > oldHigh) {
			localStorage.setItem('locusHighScore', String(currentScore));
			showHighScorePopup(currentScore);
		}
	}

	function showHighScorePopup(score) {
		// Remove existing
		document.querySelectorAll('.highscore-toast').forEach(el => el.remove());
		
		const popup = document.createElement('div');
		popup.className = 'highscore-toast';
		popup.innerHTML = `
			<span class="highscore-toast__icon">🏆</span>
			<div>
				<div>Nieuw record!</div>
				<div class="highscore-toast__score">${score}</div>
			</div>
		`;
		document.body.appendChild(popup);
		
		// Auto remove
		setTimeout(() => {
			popup.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
			popup.style.opacity = '0';
			popup.style.transform = 'translate(-50%, -20px) scale(0.9)';
			setTimeout(() => popup.remove(), 500);
		}, 3000);
	}

	function showHighScoreModal() {
		// Create modal if not exists
		let overlay = document.getElementById('highscore-modal-layer');
		if (!overlay) {
			overlay = document.createElement('div');
			overlay.id = 'highscore-modal-layer';
			overlay.className = 'highscore-modal-overlay';
			overlay.innerHTML = `
				<div class="highscore-modal">
					<h2>🏆 High Score</h2>
					<div class="highscore-value" id="modal-highscore-value">0</div>
					<button class="highscore-close-btn" onclick="closeHighScoreModal()">Sluiten</button>
				</div>
			`;
			document.body.appendChild(overlay);
			
			// Close on click outside
			overlay.addEventListener('click', (e) => {
				if (e.target === overlay) closeHighScoreModal();
			});
		}
		
		// Update value
		document.getElementById('modal-highscore-value').textContent = getHighScore();
		
		// Show
		overlay.classList.add('show');
		
		// Close menu if open
		const controls = document.getElementById('controls');
		const menuToggle = document.getElementById('menu-toggle');
		if (controls) controls.classList.remove('open');
		if (menuToggle) menuToggle.classList.remove('active');
	}

	function closeHighScoreModal() {
		const overlay = document.getElementById('highscore-modal-layer');
		if (overlay) overlay.classList.remove('show');
	}

	function showSavedLevelsModal() {
		let overlay = document.getElementById('saved-levels-modal');
		if (!overlay) {
			overlay = document.createElement('div');
			overlay.id = 'saved-levels-modal';
			overlay.className = 'highscore-modal-overlay';
			overlay.innerHTML = `
				<div class="highscore-modal">
					<h2>Opgeslagen levels</h2>
					<div id="saved-levels-list" style="max-height:420px; overflow:auto; padding-right:8px;"></div>
					<div style="margin-top:12px;"><button class="modal-btn" onclick="closeSavedLevelsModal()">Sluit</button></div>
				</div>
			`;
			document.body.appendChild(overlay);
			overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSavedLevelsModal(); });
		}
		// populate list
		const list = document.getElementById('saved-levels-list');
		list.innerHTML = '';

		// Append example scenarios for quick testing (World 4 prototypes)
		const examplesHeader = document.createElement('div');
		examplesHeader.style.marginBottom = '8px';
		examplesHeader.innerHTML = '<div class="saved-title">Voorbeeld-scenario\'s (World 4)</div>';
		list.appendChild(examplesHeader);

		const examples = [
		  { id: 'world4-4.1', name: 'Wereld 4.1 - Groen + Blauw', desc: 'Rechthoekige groen + brede blauwe zone. Test: sleutel + deur met afgesloten gebied.', objective: 'Voltooi de subdoelen en open de deur met de sleutel.', allowedColors: ['groen','blauw'], extraStartCards: 3, scenarioId: '4.1' },
		  { id: 'world4-4.2', name: 'Wereld 4.2 - Vormen & Deur', desc: 'Creatieve vormen + sleutel in blauw; deur in groen met groter afgesloten gebied.', objective: 'Voltooi subdoelen: 4×4 in groen, gebruik sleutel, open deur.', allowedColors: ['groen','blauw'], extraStartCards: 3, scenarioId: '4.2' }
		];
		examples.forEach(ex => {
		  const item = document.createElement('div');
		  item.style.display = 'flex'; item.style.gap = '8px'; item.style.alignItems = 'center'; item.style.marginBottom = '8px';
		  const label = document.createElement('div'); label.style.flex = '1';
		  const titleText = document.createElement('div'); titleText.textContent = ex.name; titleText.style.fontWeight = '600'; titleText.className = 'saved-title';
		  const objText = document.createElement('div'); objText.className = 'saved-obj-text'; objText.textContent = ex.objective || ex.desc;
		  label.appendChild(titleText); label.appendChild(objText);
		  const loadBtn = document.createElement('button'); loadBtn.textContent = 'Laad in spel'; loadBtn.className = 'modal-btn primary';
		  loadBtn.addEventListener('click', ()=>{ loadScenario(ex.scenarioId, ex); closeSavedLevelsModal(); });
		  item.appendChild(label); item.appendChild(loadBtn);
		  list.appendChild(item);
		});
		let saved = {};
		try {
			const raw = localStorage.getItem('locusSavedBoards');
			if (raw) {
				try {
					saved = JSON.parse(raw || '{}');
				} catch (err) {
					console.error('Failed to parse locusSavedBoards JSON:', err, 'raw length:', raw.length);
					console.error('Raw locusSavedBoards starts with:', String(raw).slice(0, 200));
					saved = {};
				}
			} else saved = {};
		} catch (e) { console.error('Error reading locusSavedBoards from localStorage', e); saved = {}; }
		// Also check for an existing backup of the current game session
		let backup = null;
		try { backup = JSON.parse(localStorage.getItem('locusGameSaveBackup') || 'null'); } catch (e) { backup = null; }
		const names = Object.keys(saved).sort((a,b)=>(saved[b].ts||0)-(saved[a].ts||0));
		if (!names.length && !backup) {
			list.textContent = 'Geen opgeslagen levels.';
		} else {
			names.forEach(n => {
				const item = document.createElement('div');
				item.style.display = 'flex'; item.style.gap = '8px'; item.style.alignItems = 'center'; item.style.marginBottom = '8px';
				const label = document.createElement('div'); label.style.flex = '1';
				const titleText = document.createElement('div'); titleText.textContent = n; titleText.style.fontWeight = '600'; titleText.className = 'saved-title';
				const objText = document.createElement('div'); objText.className = 'saved-obj-text';
				objText.textContent = saved[n].objective ? saved[n].objective : 'Geen doel (standaard: Haal 100 punten)';
				label.appendChild(titleText); label.appendChild(objText);
				const openEditorBtn = document.createElement('button'); openEditorBtn.textContent = 'Open in Editor'; openEditorBtn.className = 'modal-btn';
				openEditorBtn.addEventListener('click', ()=>{
					try { localStorage.setItem('locusEditorBoardHtml', saved[n].html); } catch (e) {}
					const w = window.open('editor.html', '_blank');
					if (w) try {
						w.postMessage({
							type:'LOCUS_EDITOR_BOARD',
							boardHtml: saved[n].html,
							name: saved[n].name || n,
							objective: saved[n].objective || null,
							scenarioSettings: (saved[n].scenarioSettings && typeof saved[n].scenarioSettings === 'object') ? saved[n].scenarioSettings : null
						}, '*');
					} catch (e) {}
				});
				const loadBtn = document.createElement('button'); loadBtn.textContent = 'Laad in spel'; loadBtn.className = 'modal-btn primary';
				const delBtn = document.createElement('button');
				delBtn.className = 'trash-btn modal-btn';
				delBtn.title = 'Verwijder opgeslagen level';
				delBtn.setAttribute('aria-label', `Verwijder ${n}`);
				delBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
				delBtn.style.padding = '6px';
				delBtn.style.border = '0';
				delBtn.style.background = 'transparent';
				delBtn.style.cursor = 'pointer';
				delBtn.style.color = 'inherit';
				delBtn.addEventListener('click', ()=>{
					if (!confirm(`Verwijder "${n}"?`)) return;
					try {
						try {
							const sb = JSON.parse(localStorage.getItem('locusSavedBoards')||'{}');
							delete sb[n];
							try {
								localStorage.setItem('locusSavedBoards', JSON.stringify(sb));
							} catch (le) {
								console.error('Failed to write locusSavedBoards during delete:', le, 'size:', JSON.stringify(sb).length);
								alert('Kon opgeslagen levels niet bijwerken (localStorage fout). Zie console voor details.');
							}
						} catch (pe) { console.error('Failed to parse locusSavedBoards when deleting:', pe); }
						// remove item from DOM
						if (item && item.parentNode) item.parentNode.removeChild(item);
					} catch (e) { console.error(e); }
				});
				loadBtn.addEventListener('click', ()=>{
					// Backup current game state + board before loading — ensure latest game state (coins/deck) is saved
					try {
						if (typeof saveGameState === 'function') {
							try { saveGameState(); } catch (e) { /* ignore save errors */ }
						}
						const currentGameSave = localStorage.getItem('locusGameSave') || null;
						const currentBoardHtmlExact = (document.getElementById('board') ? document.getElementById('board').outerHTML : null);
						// Keep a sanitized version for saved-boards autosave (so it doesn't store runtime placements),
						// but keep an exact snapshot for "restore previous session".
						const currentBoardHtmlSanitized = (typeof sanitizeBoardHtml === 'function' && currentBoardHtmlExact) ? sanitizeBoardHtml(currentBoardHtmlExact) : currentBoardHtmlExact;
						const backupObj = { ts: Date.now(), level: currentLevel || null, gameSave: currentGameSave, boardHtmlExact: currentBoardHtmlExact, boardHtml: currentBoardHtmlSanitized };
						localStorage.setItem('locusGameSaveBackup', JSON.stringify(backupObj));
						// Also add/overwrite a single autosave entry to saved boards for easy access (include gameSave)
						try {
							try {
								const sb = JSON.parse(localStorage.getItem('locusSavedBoards')||'{}');
								const autosaveKey = 'Autosave: laatste bewerking';
								sb[autosaveKey] = { html: backupObj.boardHtml, gameSave: backupObj.gameSave, name: autosaveKey, ts: backupObj.ts };
								try {
									localStorage.setItem('locusSavedBoards', JSON.stringify(sb));
								} catch (le) {
									console.error('Failed to write locusSavedBoards for autosave:', le, 'size:', JSON.stringify(sb).length);
								}
							} catch (pe) { console.error('Failed to parse locusSavedBoards for autosave:', pe); }
						} catch (e) {}
					} catch (e) {}
					// Load using unified loader (prevents board/settings mismatches)
					loadScenarioLikeToGame({
						boardHtml: saved[n].html,
						name: saved[n].name || n,
						objective: saved[n].objective || null,
						scenarioSettings: (saved[n].scenarioSettings && typeof saved[n].scenarioSettings === 'object') ? saved[n].scenarioSettings : null
					}, { source: 'Opgeslagen level' });
					setTimeout(()=>{ if (typeof setStatus === 'function') setStatus('Speelveld geladen. Gebruik "Herstel vorige" om terug te keren.'); }, 50);
				});
				item.appendChild(label); item.appendChild(openEditorBtn); item.appendChild(loadBtn); item.appendChild(delBtn);
				list.appendChild(item);
			});
			// If a backup exists, show a restore option at the end
				if (backup) {
				const restoreItem = document.createElement('div');
				restoreItem.style.display = 'flex'; restoreItem.style.gap = '8px'; restoreItem.style.alignItems = 'center'; restoreItem.style.marginTop = '12px';
				const lbl = document.createElement('div'); lbl.style.flex = '1'; lbl.textContent = `Herstel vorige sessie (level ${backup.level || '?'})`; lbl.className = 'saved-title';
				const restoreBtn = document.createElement('button'); restoreBtn.textContent = 'Herstel vorige'; restoreBtn.className = 'modal-btn';
				restoreBtn.addEventListener('click', ()=>{
					try {
						// restore saved game into localStorage
						if (backup.gameSave) localStorage.setItem('locusGameSave', backup.gameSave);
						// First restore gameplay state
						if (typeof loadGameState === 'function') {
							loadGameState();
						}
						// Then restore the exact board DOM snapshot
						const exactHtml = backup.boardHtmlExact || backup.boardHtml || null;
						if (exactHtml) {
							setTimeout(()=>{
								applyBoardHtmlToGame(exactHtml);
								try { if (typeof rehydrateTrapsFromDOM === 'function') rehydrateTrapsFromDOM(); } catch(e){}
								if (typeof updateScore === 'function') setTimeout(()=> updateScore(), 120);
							}, 80);
						}
						setTimeout(()=>{ if (typeof setStatus === 'function') setStatus('Vorige sessie hersteld.'); }, 200);
					} catch (e) { console.error(e); }
				});
				restoreItem.appendChild(lbl); restoreItem.appendChild(restoreBtn);
				list.appendChild(restoreItem);
			}
		}
		overlay.classList.add('show');
		// close menu
		const controls = document.getElementById('controls');
		const menuToggle = document.getElementById('menu-toggle');
		if (controls) controls.classList.remove('open');
		if (menuToggle) menuToggle.classList.remove('active');
	}

	function closeSavedLevelsModal() {
		const overlay = document.getElementById('saved-levels-modal');
		if (overlay) overlay.classList.remove('show');
	}
	
  