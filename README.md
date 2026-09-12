# Locus 1 — visual + responsive makeover v2

Deze set hoort uitsluitend bij **Locus 1**.

## Richting

De nieuwe UI is bewust geen generieke "AI app"-look.

De stijl is:
- donker en digitaal;
- rustig en modern;
- subtiele fysieke kaartkwaliteit;
- weinig glas/neon;
- zones/bord blijven inhoudelijk herkenbaar;
- kaarten, knoppen en modals krijgen diepte door normale CSS-belichting en schaduw;
- animatie ondersteunt actie en hiërarchie, niet decoratie.

## Twee concrete mobiele problemen die hiermee worden aangepakt

### 1. Landscape-telefoon wordt als desktop gezien

De bestaande layout gebruikt onder andere:

```js
width <= MOBILE_BREAKPOINT // MOBILE_BREAKPOINT = 650
```

voor de compacte touch-landscape-layout.

Een telefoon van bijvoorbeeld 844×390 heeft in landscape een breedte boven 650
en kan daardoor in de desktop-layout terechtkomen. De patch bepaalt compact
touch-landscape voortaan op basis van de **korte zijde**:

```js
const isCompactTouchScreen =
    isTouchDevice && Math.min(width, height) < 700;
```

Grote tablets blijven dus groot-tablet/desktop-layout gebruiken.

### 2. Bottom bar en kaartmaat spreken elkaar tegen

In de huidige mobiele CSS komt een bottom bar van ongeveer 110–115 px voor,
terwijl een andere regel mobiele kaarten tot minimaal 180 px hoog maakt. Dat is
een structurele clipping-bron.

De nieuwe CSS reserveert een realistische handhoogte en schaalt de kaarten binnen
die ruimte. Bij kleinere telefoons wordt eerst tekst/decoratie compacter, niet
de touch target.

## Bestanden

- `styles/locus-ui-v2.css`
  - volledige visuele makeover;
  - cursor/touch apart;
  - phone portrait;
  - compact touch landscape;
  - tablets;
  - laptops/desktops;
  - safe areas;
  - reduced motion;
  - high contrast.

- `locus1-v2.patch`
  - import van stylesheet;
  - landscape-phone detectiefix;
  - mirrored-playability bugfix;
  - world-unlock bugfix.

- `TEST_MATRIX.md`
  - schermformaten en interacties die vóór livegang gecontroleerd moeten worden.

## Integratie

Plaats:

```text
styles/locus-ui-v2.css
```

in de repo.

Voeg bovenaan `responsive.css` toe:

```css
@import url("./styles/locus-ui-v2.css");
```

Daarna de wijzigingen uit `locus1-v2.patch` toepassen op `index.html`.

## Belangrijk bij de visuele refactor

Niet meer nieuwe mobiele uitzonderingen onderaan `index.html` toevoegen.
Nieuwe visuele correcties horen in `styles/locus-ui-v2.css`.

Wanneer deze laag stabiel is, is de volgende structurele stap:

1. legacy inline CSS letterlijk naar `styles/game-legacy.css`;
2. pure shape/geometry helpers naar `js/geometry.js`;
3. placement validators naar `js/placement-rules.js`;
4. pas daarna cards/progression/persistence;
5. responsive DOM-reparenting als laatste.

## Kaartanimatie

Nieuwe kaarten krijgen een korte deal-in van ongeveer 220 ms.
Geselecteerde kaarten liften enkele pixels.

Op cursorapparaten bestaat hover.
Op touch bestaat géén hover-afhankelijk gedrag.

`prefers-reduced-motion` schakelt animatie praktisch uit.

## Touchdoelen

Primaire compacte touchcontrols zijn minimaal 44×44 px.

Op een zeer klein scherm wordt liever:
- tekst kleiner of verborgen;
- een paneel scrollbaar;
- het bord scrollbaar;

dan dat een belangrijke actieknop naar 22 px wordt teruggeschaald.

## Waarom geen horizontale swipe-hand als eerste versie?

Locus gebruikt touch ook voor het oppakken/plaatsen van spelvormen.
Een horizontaal scrollgebaar op exact hetzelfde kaartoppervlak kan daardoor
pointer-events en draggedrag met elkaar laten concurreren.

Daarom probeert v2 eerst de hand responsief binnen de beschikbare breedte te
plaatsen. Als de maximale handgrootte later structureel groter wordt dan in deze
versie, moet de handinteractie zelf bewust worden aangepast (bijvoorbeeld
tap-select + apart plaatsen in plaats van drag-from-card) vóór native swipen
wordt aangezet.
