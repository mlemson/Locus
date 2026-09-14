# Locus 1 — wereld op tafel

De vijf kleurgebieden vormen één rustig speelbord op een donkerblauwe tafel.
De bestaande spelregels, levels, kaarten, punten, munten en bonussen blijven
in `index.html`. De nieuwe weergave gebruikt dezelfde spelelementen en handlers.

## Indeling en bediening

- Desktop: compacte score links, speelwereld centraal en hand rechts.
- Tablet: speelwereld boven, hand en compacte status onderaan.
- Telefoon: één kleurgebied tegelijk, kleurknoppen boven het bord, hand en status
  binnen handbereik. Liggend staan hand en status naast het bord.
- Grote kaarten verschuiven met één vinger, muissleep, trackpad, muiswiel of
  pijltjestoetsen op het speelgebied. Randknoppen verschuiven 36% van het venster.
  Fades en pijlen verschijnen alleen waar nog kaart buiten beeld ligt.
- Selecteer een kaart, draai/spiegel met de handknoppen en tik op een geldige cel.
  Slepen om het gebied te bekijken plaatst geen kaart. De × bovenaan annuleert
  een selectie; Undo draait de laatste plaatsing terug.
- Het menu biedt de klassieke weergave. De wissel hergebruikt het bestaande bord.

Het subtiele perspectief zit in de decoratieve achtergrond van het complete
speelveld: 97% breed bovenaan, 100% onderaan (98,5% op telefoon). De klikbare grids
blijven vlak, zodat hun coördinaten en hitboxes niet vervormen.

## Correcties celmaat en uitlijning

Alle vijf gebieden gebruiken nu dezelfde celmaat, berekend vanuit paars.
Sleepblokken gebruiken diezelfde maat. Groene startcellen behouden hun donkere
rand; eindcellen hebben weer een herkenbare donkergroene vulling. Symbolen en
portalen staan in het midden en muntjes schalen mee (58% van de celbreedte).
Het menu volgt de rechterrand van de menuknop.

De browsertests controleren deze maten, markeringen, uitlijning en menupositie
op alle acht schermformaten.

## Bestanden

- `index.html`: spel en gerichte integratiepunten voor de tafellayout.
- `js/world-table.js`: indeling, kleurfocus, panherkenning en randindicatoren.
- `styles/world-table.css`: de nieuwe, op `body.table-ui` begrensde stijllaag.
- `responsive.css`: bestaande stijlen, onder meer voor klassieke weergave.
- `editor.html`, `editor.js`, `editor.css`: bestaande leveleditor.
- `tests/world-table.cjs`: browsercontroles tegen de echte game.
- `TEST_MATRIX.md`: uitgebreide handmatige acceptatiematrix.

De site is statisch en vereist geen build. Serveer de map met een lokale
webserver of GitHub Pages. Nieuwe layoutcorrecties horen in de aparte CSS/JS,
niet als extra mobiele uitzonderingen in de inline stijlen.

## Controles uitvoeren

```sh
npm install
npx playwright install chromium
npm test
```

Voor een reeds geïnstalleerde Chromium kan `CHROMIUM_EXECUTABLE` het pad aangeven.
Met `SCREENSHOT_DIR=test-results` bewaart de test screenshots.

De automatische controle omvat acht schermformaten (320×568 tot 1920×1080),
paneelgrenzen en overlap, primaire knoppen van minimaal 44 px, touchselectie,
rotatie, spiegelen, kleurvalidatie, pan zonder plaatsing, randindicatoren,
oriëntatiewissels, plaatsing en Undo, schone editor-export, wereldvarianten,
save/load, klassieke weergave en muispan. Normale saves starten volgens het
bestaande spelgedrag het opgeslagen level opnieuw met een nieuwe hand.

Chromium met touch-emulatie is automatisch getest. De overige browsers en echte
apparaten uit `TEST_MATRIX.md` blijven handmatige controles; de volledige matrix
is geen claim dat al die scenario's automatisch zijn afgedekt.
