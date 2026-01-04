# LOCUS Digital

An interactive puzzle game with a visual editor for creating custom levels.

## How to Use

### 1. Download Repository to Your PC

There are two ways to get the files to your computer:

#### Option A: Using Git (recommended)

1. **Install Git** (if you don't have it yet):
   - Windows: Download from [git-scm.com](https://git-scm.com/)
   - Mac: `brew install git` or download from [git-scm.com](https://git-scm.com/)
   - Linux: `sudo apt-get install git` (Ubuntu/Debian) or `sudo yum install git` (Fedora)

2. **Open a terminal/command prompt** and navigate to where you want to save the project:
   ```bash
   cd /path/to/desired/folder
   ```

3. **Clone the repository**:
   ```bash
   git clone https://github.com/mlemson/Locus.git
   ```

4. **Open in VS Code**:
   ```bash
   cd Locus
   code .
   ```

#### Option B: Without Git (simpler but less flexible)

1. Go to [https://github.com/mlemson/Locus](https://github.com/mlemson/Locus)
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file on your computer
5. Open the extracted folder in VS Code:
   - Start VS Code
   - Go to `File` > `Open Folder`
   - Select the extracted Locus folder

### 2. Getting the Latest Changes

If you already have a local copy and want to get the latest changes:

```bash
cd /path/to/Locus
git pull origin main
```

### 3. Running the Game Locally

1. Open the project in VS Code
2. Install the **Live Server** extension (if you don't have it yet):
   - Click the Extensions icon in the sidebar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Search for "Live Server"
   - Click "Install"

3. Open `index.html` in VS Code
4. Click the **"Go Live"** button in the bottom right, or:
   - Right-click on `index.html` and select "Open with Live Server"

The game will now open in your browser at `http://localhost:5500` (or another port).

## Project Structure

```
Locus/
├── index.html      # Main game
├── editor.html     # Level editor
├── editor.js       # Editor functionality
└── editor.css      # Editor styling
```

## Features

### The Game (index.html)
- Puzzle game with multiple levels and zones
- Different colored symbols to place
- Coin collection system
- Upgrade system
- Dark mode support
- Responsive design for desktop and mobile

### The Editor (editor.html)
- Visual level editor
- Drag-and-drop functionality
- Various tools for placing:
  - Colored symbols
  - Coins
  - Portals
  - Traps
  - Bold cells (starting points)
- Save and load levels
- Print-friendly mode
- Export function for scenarios

## Tips for Using in VS Code

### Recommended Extensions:
- **Live Server** - For running the game locally
- **HTML CSS Support** - For better HTML/CSS support
- **JavaScript (ES6) code snippets** - For JavaScript development
- **Prettier** - For code formatting

### Useful Shortcuts:
- `Ctrl+Shift+F` / `Cmd+Shift+F` - Search in all files
- `Ctrl+P` / `Cmd+P` - Quick open file
- `Ctrl+B` / `Cmd+B` - Toggle sidebar
- `Alt+Shift+F` - Format code

## Making Changes

If you want to make changes and push them back to GitHub:

```bash
# Check what has changed
git status

# Add changed files
git add .

# Commit with a description
git commit -m "Description of your changes"

# Push to GitHub
git push origin main
```

**Note**: You need write access to the repository to push changes.

## Troubleshooting

### "Permission denied" on git push
You don't have write access to the repository. Contact the owner or create a fork.

### Live Server doesn't work
1. Make sure the extension is installed
2. Restart VS Code
3. Try opening the file via right-click > "Open with Live Server"

### The game doesn't load correctly
1. Check that all files are present (index.html, editor.html, etc.)
2. Check the browser console for errors (F12)
3. Make sure you're opening via Live Server (not by opening the file directly)

## Browser Support

The game works best in modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## License

See the repository for license information.
