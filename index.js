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
function resize() {
  const outputElm = document.getElementById("output");
  outputElm.style.width = (window.innerWidth - 25) + "px";
  outputElm.style.height = (window.innerHeight - 27) + "px";
  main.width = window.innerWidth
  main.height = window.innerHeight
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
