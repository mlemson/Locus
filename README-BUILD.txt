LOCUS consistent build — 2026-09-14

This is a deployment overlay for the existing GitHub repository.
Replace these exact files in the repository while leaving all other existing assets/files in place:
- index.html
- responsive.css
- js/world-table.js
- js/world4-citadel.js
- styles/world-table.css
- styles/world4-citadel.css

Important consistency changes:
- index.html points to the JS/CSS files at the exact paths included in this ZIP.
- cache-busting version is 20260914-final1, so browsers do not silently keep the old table CSS/JS.
- mobile table sizing uses a minimum 14-cell reference, preventing World 1's 9x9 purple grid from inflating every cell.
- touch/pen panning is owned by browser native overflow scrolling; the modern table's custom drag-pan handles mouse only.
- hidden mobile zone frames remain display:none, preventing stacked hidden zones from intercepting touch.
- World 4 uses the newer denser/challenging generation for yellow, purple and red.

Do not mix this index.html with older world-table.js/world-table.css files.
