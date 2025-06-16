import main from "./modules/EGLAG.js";
function run() {
main.setStartLoc(0,0);
main.colorPoint(0,0,1);
main.colorPoint(3,0,1);
main.colorPoint(0,2,1);
main.colorPoint(3,2,1);
main.colorPoint(1,3,1);
main.colorPoint(2,3,1);
main.fillArea(main.startPos[0], main.startPos[1], main.gridCols-1, main.gridRows-1, 4);
main.parseGrid();
main.addMoveRule(0, 1, "v");
main.addMoveRule(0, 2, "N");
main.addMoveRule(0, 0, "L", 1);
main.addMoveRule(1, 1, "v");
main.addMoveRule(1, 2, "N");
main.addMoveRule(1, 0, "L", 0);
}
const canvas = document.getElementById('canvas');
const canvasHolder = document.getElementById("canvasHolder")
const ctx = canvas.getContext('2d');
const outputTxt = document.getElementById("output");
function resize() {
  main.width = window.innerWidth
  main.height = window.innerHeight
  outputTxt.style.width = (main.width - 25) + "px";
  outputTxt.style.height = (main.height - 27) + "px";
  canvas.width = main.width
  canvas.height = main.height
}
function toggleHide(elm) {
  if (elm.hidden) {
    elm.hidden = false;
  } else {
    elm.hidden = true
  }
}
window.onload = () => {
  resize();
  try {
    run();
    document.getElementById("output").innerHTML = JSON.stringify(main.json);
  } catch (e) {
    alert(e);
  }
};
window.addEventListener('resize', resize);
window.addEventListener('keydown', (c) => {
  if (c.key==="c") {
    toggleHide(canvasHolder)
  }
})
function drawGrid() {
    if (!main.grid || !main.grid.length || !main.grid[0].length || !ctx) return;
    // Remove save/transform/restore - calculate pixels directly
    // ctx.save();
    // ctx.translate(offsetX, offsetY);
    // ctx.scale(scale, scale);

    if (main.gridCols <= 0 || main.gridRows <= 0) { return; }

    // Calculate visible grid bounds (in grid cell coordinates - still useful)
    const viewX1 = -offsetX / main.scale, viewY1 = -offsetY / main.scale;
    const viewX2 = (main.width - offsetX) / main.scale, viewY2 = (main.height - offsetY) / main.scale;
    const cellSize = 1;
    // Add a small buffer to catch cells partially visible at edges
    const buffer = 2;
    const startCol = Math.max(0, Math.floor(viewX1 / cellSize) - buffer);
    const endCol = Math.min(main.gridCols, Math.ceil(viewX2 / cellSize) + buffer);
    const startRow = Math.max(0, Math.floor(viewY1 / cellSize) - buffer);
    const endRow = Math.min(main.gridRows, Math.ceil(viewY2 / cellSize) + buffer);

    // Draw ALL cells using calculated pixel coordinates
    for (let x = startCol; x < endCol; x++) {
        if (x < 0 || x >= grid.length || !grid[x]) continue;
        for (let y = startRow; y < endRow; y++) {
             if (y < 0 || y >= grid[x].length) continue;

            const colorIndex = grid[x][y];
            // Draw ALL valid color indices (including 0)
            if (colorIndex >= 0 && colorIndex < main.colors.length) {
                 ctx.fillStyle = main.colors[colorIndex];

                 // Calculate final pixel coordinates and dimensions
                 const px = Math.floor(offsetX + x * cellSize * scale);
                 const py = Math.floor(offsetY + y * cellSize * scale);
                 const pw = Math.ceil(cellSize * scale);
                 const ph = Math.ceil(cellSize * scale);

                 if (px + pw > 0 && px < width && py + ph > 0 && py < height) {
                    ctx.fillRect(px, py, pw, ph);
                 }
            } // else { console.warn(`Invalid color index at ${x},${y}: ${colorIndex}`); } // Optional: Warn on invalid index
        }
    }
}
