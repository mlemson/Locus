# LOCUS Digitaal

Een interactieve puzzelgame met een visuele editor voor het maken van custom levels.

## Hoe te gebruiken

### 1. Repository downloaden naar je PC

Er zijn twee manieren om de bestanden naar je computer te krijgen:

#### Optie A: Met Git (aanbevolen)

1. **Installeer Git** (als je het nog niet hebt):
   - Windows: Download van [git-scm.com](https://git-scm.com/)
   - Mac: `brew install git` of download van [git-scm.com](https://git-scm.com/)
   - Linux: `sudo apt-get install git` (Ubuntu/Debian) of `sudo yum install git` (Fedora)

2. **Open een terminal/command prompt** en navigeer naar de map waar je het project wilt opslaan:
   ```bash
   cd /pad/naar/gewenste/map
   ```

3. **Clone het repository**:
   ```bash
   git clone https://github.com/mlemson/Locus.git
   ```

4. **Open in VS Code**:
   ```bash
   cd Locus
   code .
   ```

#### Optie B: Zonder Git (eenvoudiger maar minder flexibel)

1. Ga naar [https://github.com/mlemson/Locus](https://github.com/mlemson/Locus)
2. Klik op de groene knop **"Code"**
3. Klik op **"Download ZIP"**
4. Pak het ZIP-bestand uit op je computer
5. Open de uitgepakte map in VS Code:
   - Start VS Code
   - Ga naar `File` > `Open Folder`
   - Selecteer de uitgepakte Locus map

### 2. Meest recente wijzigingen ophalen

Als je al een lokale kopie hebt en de nieuwste wijzigingen wilt ophalen:

```bash
cd /pad/naar/Locus
git pull origin main
```

### 3. Het spel lokaal uitvoeren

1. Open het project in VS Code
2. Installeer de **Live Server** extensie (als je die nog niet hebt):
   - Klik op het Extensions icoon in de zijbalk (of druk `Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Zoek naar "Live Server"
   - Klik op "Install"

3. Open `index.html` in VS Code
4. Klik rechtsonder op de **"Go Live"** knop, of:
   - Klik rechts op `index.html` en selecteer "Open with Live Server"

De game opent nu in je browser op `http://localhost:5500` (of een andere poort).

## Projectstructuur

```
Locus/
├── index.html      # Het hoofdspel
├── editor.html     # De level editor
├── editor.js       # Editor functionaliteit
└── editor.css      # Editor styling
```

## Features

### Het Spel (index.html)
- Puzzelgame met meerdere levels en zones
- Verschillende kleuren symbolen om te plaatsen
- Muntjes verzamelen systeem
- Upgrade systeem
- Dark mode ondersteuning
- Responsive design voor desktop en mobiel

### De Editor (editor.html)
- Visuele level editor
- Drag-and-drop functionaliteit
- Verschillende tools voor het plaatsen van:
  - Gekleurde symbolen
  - Munten
  - Portals
  - Traps
  - Bold cells (startpunten)
- Levels opslaan en laden
- Printvriendelijke modus
- Export functie voor scenario's

## Tips voor gebruik in VS Code

### Aanbevolen extensies:
- **Live Server** - Voor het lokaal draaien van de game
- **HTML CSS Support** - Voor betere HTML/CSS ondersteuning
- **JavaScript (ES6) code snippets** - Voor JavaScript development
- **Prettier** - Voor code formattering

### Handige shortcuts:
- `Ctrl+Shift+F` / `Cmd+Shift+F` - Zoeken in alle bestanden
- `Ctrl+P` / `Cmd+P` - Snel een bestand openen
- `Ctrl+B` / `Cmd+B` - Sidebar toggle
- `Alt+Shift+F` - Code formatteren

## Wijzigingen doorvoeren

Als je wijzigingen wilt maken en terug wilt pushen naar GitHub:

```bash
# Bekijk wat er gewijzigd is
git status

# Voeg gewijzigde bestanden toe
git add .

# Commit met een beschrijving
git commit -m "Beschrijving van je wijzigingen"

# Push naar GitHub
git push origin main
```

**Let op**: Je hebt schrijftoegang nodig tot het repository om wijzigingen te pushen.

## Problemen oplossen

### "Permission denied" bij git push
Je hebt geen schrijftoegang tot het repository. Neem contact op met de eigenaar of maak een fork.

### Live Server werkt niet
1. Zorg dat de extensie geïnstalleerd is
2. Herstart VS Code
3. Probeer het bestand te openen via rechtermuisklik > "Open with Live Server"

### Het spel laadt niet correct
1. Controleer of alle bestanden aanwezig zijn (index.html, editor.html, etc.)
2. Check de browser console voor fouten (F12)
3. Zorg dat je via Live Server opent (niet door het bestand direct te openen)

## Browser ondersteuning

Het spel werkt het beste in moderne browsers:
- Chrome/Edge (aanbevolen)
- Firefox
- Safari

## Licentie

Zie het repository voor licentie-informatie.
