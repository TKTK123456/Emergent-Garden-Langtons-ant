import main from "./modules/index.mjs";
function run() {
main.grid = [];
for (let i = 0; i < gridCols; i++) {
  main.grid[i] = Array(gridRows).fill(0);
}
main.startPos = [Math.floor(gridCols / 2), Math.floor(gridRows / 2)];
endPosDirc = [Math.floor(gridCols / 2), Math.floor(gridRows / 2), 'right'];
main.setStartLoc(0,0);
colorPoint(0,0,1);
colorPoint(3,0,1);
colorPoint(0,2,1);
colorPoint(3,2,1);
colorPoint(1,3,1);
colorPoint(2,3,1);
fillArea(startPos[0], startPos[1], gridCols-1, gridRows-1, 4);
parseGrid();
addMoveRule(0, 1, "v");
addMoveRule(0, 2, "N");
addMoveRule(0, 0, "L", 1);
addMoveRule(1, 1, "v");
addMoveRule(1, 2, "N");
addMoveRule(1, 0, "L", 0);
}

function resize() {
  const outputElm = document.getElementById("output");
  outputElm.style.width = (window.innerWidth - 25) + "px";
  outputElm.style.height = (window.innerHeight - 27) + "px";
  main.width = window.innerWidth
  main.height = window.innerHeight
}

window.onload = () => {
  resize();
  run();
  try {
    document.getElementById("output").innerHTML = JSON.stringify(json);
  } catch (e) {
    alert(e);
  }
};
window.addEventListener('resize', resize);
