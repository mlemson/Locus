# LOCUS fixes – 14-09-2026

Aangepast:
- Undo is geblokkeerd zolang een blok/bonusplaatsing actief is (ook via menu/keyboard guard).
- Deckoverzicht op telefoons gebruikt 3 compacte kolommen.
- Bonus/Echo-uitleg is een leesbare tooltip/popover in plaats van een smalle tekstkolom.
- Rode subgrids worden als groep gecentreerd; de info-knop telt niet mee in de gridflow.
- Blauwe speelzone is op niet-telefoonlayouts iets breder.
- Bonusknoppen in de telefoon-HUD zijn smaller zodat de rij binnen beeld blijft.

Bestanden:
- index.html
- responsive.css
- styles/world-table.css
- js/world-table.js
- tests/world-table.cjs (ongewijzigd meegeleverd)

## Mobiel / touch – aanvullende fix
- Wereld 1 gebruikt op telefoons een iets compactere celmaat (virtuele 11x11 fit in plaats van de 9x9 referentie), zodat meer van het speelveld zichtbaar blijft en de schaal dichter bij Wereld 2/3 ligt.
- Touch/pen-scrollen over een speelzone gebruikt weer native browser-panning (`pan-x pan-y`) in plaats van handmatig `scrollLeft/scrollTop` per pointermove.
- Daardoor werken momentum/inertia en direction locking weer natuurlijker op telefoon en tablet.
- Een swipe over het grid activeert geen cell; een echte tap blijft via de bestaande plaatsingsroute lopen.
- Extra inline touch-action override in `js/world-table.js`, zodat de fix ook werkt als een oudere `world-table.css` nog uit cache/GitHub Pages wordt geladen.
- Mobiele zoneframes worden door `world-table.js` expliciet op 100% breedte gehouden; dit voorkomt het smalle linker speelveld uit de eerdere mobiele Wereld-4 screenshot.
- De mobiele grid override gebruikt nu expliciet één rij (`grid-template-rows:minmax(0,1fr)`), zodat het gefocuste speelveld ook de volledige beschikbare hoogte gebruikt.

Gecontroleerd:
- `node --check js/world-table.js` geslaagd.
- Mobiele emulatie 390x844 op de paarse referentie: Wereld 1 = 28px CSS-cel; Wereld 2 = 23px en Wereld 3 = 22px. Wereld 1 blijft bewust iets ruimer, maar is circa 20% compacter dan de eerdere 9x9-fit.
- Touchtest op een scrollbare blauwe zone: scrollTop 120 -> 55 na swipe; 0 actieve cells toegevoegd.
- Wereld 4 screenshots gecontroleerd voor level 4.1, 4.4, 4.7 en 4.10 plus mobiel 4.4.
