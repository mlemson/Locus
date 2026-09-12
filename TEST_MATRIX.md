# Locus 1 — responsive & interaction test matrix

De makeover is pas "af" wanneer dezelfde spelronde door deze matrix heen werkt.

## 1. Schermformaten

| Profiel | Viewport | Input | Layoutverwachting |
|---|---:|---|---|
| Kleine telefoon portrait | 320×568 | touch | bottom hand |
| Kleine telefoon portrait | 360×640 | touch | bottom hand |
| iPhone-achtig portrait | 375×667 | touch | bottom hand |
| Moderne telefoon portrait | 390×844 | touch | bottom hand |
| Grote telefoon portrait | 430×932 | touch | bottom hand |
| Kleine landscape telefoon | 640×360 | touch | compact side layout |
| Landscape telefoon | 667×375 | touch | compact side layout |
| Landscape telefoon | 740×360 | touch | compact side layout |
| Moderne landscape telefoon | 844×390 | touch | compact side layout |
| Grote landscape telefoon | 915×412 | touch | compact side layout |
| Tablet portrait | 768×1024 | touch | desktop/tablet portrait |
| Tablet portrait | 820×1180 | touch | desktop/tablet portrait |
| Tablet landscape | 1024×768 | touch | desktop/tablet landscape |
| Kleine laptop | 1280×720 | cursor | desktop |
| Laptop | 1366×768 | cursor | desktop |
| Desktop | 1440×900 | cursor | desktop |
| Full HD | 1920×1080 | cursor | desktop |
| QHD | 2560×1440 | cursor | desktop |

Controleer daarnaast browserzoom op desktop bij 80%, 100%, 125% en 150%.

## 2. Per viewport controleren

### Altijd zichtbaar/bereikbaar
- board / alle actieve zones;
- objective;
- score;
- coins;
- bonus inventory;
- volledige hand;
- "nieuwe kaarten"/doorgaan;
- rotate;
- mirror;
- cancel;
- menu;
- modals en hun sluit/continue-knoppen.

Niet alles hoeft tegelijk volledig uitgeschreven te zijn.
Alles moet wél zonder verborgen of afgesneden actie bereikbaar blijven.

### Geen layoutfouten
- geen horizontale body-scroll door panelen;
- geen paneel onder een safe-area/notch;
- geen kaart half buiten zijn container;
- geen modal buiten viewport;
- geen `position: fixed` element dat een essentiële knop afdekt;
- geen layout-jump bij selecteren van kaart;
- geen board-schaal die door een kaartanimatie verandert.

## 3. Touch

Test met echte touch of device emulation:

1. kaart selecteren;
2. draaien;
3. spiegelen;
4. oppakken/plaatsen;
5. ongeldige plaatsing;
6. cancel;
7. bonus selecteren;
8. bonus plaatsen;
9. zone zoom openen;
10. zone zoom sluiten;
11. hamburger openen/sluiten;
12. shop bedienen;
13. modal sluiten;
14. orientation portrait→landscape;
15. orientation landscape→portrait.

Acceptatie:
- primaire targets minimaal ±44 px;
- geen hover nodig om informatie/actie zichtbaar te maken;
- één tap voert één actie uit;
- geen dubbele click + touchend uitvoering;
- plaatsen blijft bruikbaar naast scrollbare panelen.

## 4. Cursor + toetsenbord

- hover heeft alleen visuele feedback;
- click is functioneel zonder hover;
- Tab-focus blijft zichtbaar;
- focusvolgorde blijft logisch;
- Escape sluit bestaande modals zoals voorheen;
- Enter/Space op buttons werkt;
- floating rotate/mirror/cancel verspringt niet door hover-transform.

## 5. Hand / kaarten

Test:
- 3 kaarten;
- 4 kaarten (extra hand size);
- golden kaart;
- copy/replay kaart;
- geselecteerde kaart;
- disabled/onbruikbare kaart;
- asymmetrische kaart die alleen gespiegeld past.

Acceptatie:
- kaartvorm is leesbaar;
- label is secundair maar leesbaar;
- selected state is direct duidelijk;
- disabled lijkt disabled maar blijft herkenbaar;
- nieuwe kaartanimatie blokkeert geen input.

## 6. Progressie-regressie

- level 10→11;
- level 20→21;
- level 30→31;
- unlock modal;
- shop openen;
- shop skip;
- save/reload vlak vóór levelovergang;
- save/reload vlak na levelovergang.

## 7. Game-mechanic regressie

- gewone kaart plaatsen;
- rotate 4×;
- mirror;
- undo;
- Golden placement;
- Bonus Echo;
- free placement;
- coins;
- traps;
- portals;
- level complete met nog speelbare kaart;
- level complete waarbij alleen gespiegeld nog een geldige plek bestaat.

## 8. Editor/custom scenario

- editor openen;
- opgeslagen level laden;
- custom scenario starten;
- normale run herstellen;
- World 4 voorbeeldscenario;
- refresh in custom scenario.

## 9. Browsers

Minimaal:
- Chrome/Edge desktop;
- Firefox desktop;
- Safari iOS;
- Chrome Android.

Bij Safari vooral:
- `100dvh`;
- safe area;
- orientation;
- fixed bottom UI;
- scroll in sidebar/modal.
