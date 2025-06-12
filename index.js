/* FOR EXPORT TO JSON (mjs) - This section is optional
import fs from 'fs';
import path from 'path'; 
const __dirname = path.resolve();
let outputFile = path.join(__dirname, 'output.json');
END OF EXPORT SECTION*/

// CONFIG
let gridCols = 171; // You will have to get this yourself from the javascript if you have a different screen size
let gridRows = 96;

let main = {
  grid: [],
  checkCords: function ({x, y}) {
    x = ((x % gridCols) + gridCols) % gridCols;
    y = ((y % gridRows) + gridRows) % gridRows;
    return {x, y};
  },
  get: function (cords) {
    cords = this.checkCords(cords);
    return this.grid[cords.x][cords.y];
  },
  set: function (cords, value) {
    cords = this.checkCords(cords);
    this.grid[cords.x][cords.y] = value;
    return value;
  }
};

// Initialize grid
for (let i = 0; i < gridCols; i++) {
  main.grid[i] = Array(gridRows).fill(0);
}

let json = {}; 
let startState = 0;
let startPos = [Math.floor(gridCols / 2), Math.floor(gridRows / 2)];
let endPosDirc = [Math.floor(gridCols / 2), Math.floor(gridRows / 2), 'right'];

// Utility functions for toroidal distance & movement
function getDelta(p1, p2, size) {
  let delta = (p2 - p1 + size) % size;
  if (delta > size / 2) delta -= size;
  return delta;
}

function getDistAndDelta(p1, p2) {
  const dx = getDelta(p1.x, p2.x, gridCols);
  const dy = getDelta(p1.y, p2.y, gridRows);
  return { dist: Math.abs(dx) + Math.abs(dy), dx, dy };
}

// Moves to a location
function setStartLoc(x, y, direction = "right") {
  ({x, y} = main.checkCords({x, y}));
  if (x === endPosDirc[0] && y === endPosDirc[1] && direction === endPosDirc[2]) return;
  endPosDirc = [x, y, direction];
}

function colorPoint(x, y, color) {
  main.set({x, y}, color);
}

function fillArea(x1, y1, x2, y2, color) {
  ({x: x1, y: y1} = main.checkCords({x: x1, y: y1}));
  ({x: x2, y: y2} = main.checkCords({x: x2, y: y2}));
  if (x1 > x2) [x1, x2] = [x2, x1];
  if (y1 > y2) [y1, y2] = [y2, y1];
  for (let i = x1; i <= x2; i++) {
    main.grid[i].fill(color, y1, y2);
  }
}

function parseGrid() {
  let shortestPath = [];
  let goToPoints = [];

  main.grid.forEach((col, x) => {
    col.forEach((val, y) => {
      if (val > 0) goToPoints.push({x, y});
    });
  });

  let path = [{x: startPos[0], y: startPos[1]}];
  let unvisited = goToPoints.slice();

  while (unvisited.length > 0) {
    let current = path[path.length - 1];
    let closestIdx = 0;
    let shortestDist = getDistAndDelta(current, unvisited[0]).dist;

    for (let i = 1; i < unvisited.length; i++) {
      let { dist } = getDistAndDelta(current, unvisited[i]);
      if (dist < shortestDist) {
        shortestDist = dist;
        closestIdx = i;
      }
    }
    const [nextPoint] = unvisited.splice(closestIdx, 1);
    path.push(nextPoint);
  }

  path.push({x: endPosDirc[0], y: endPosDirc[1]});

  // Generate moves same as before
  for (let i = 0; i < path.length - 1; i++) {
  const start = path[i];
  const end = path[i + 1];
  const { dx, dy } = getDistAndDelta(start, end);

  let x = start.x;
  let y = start.y;

  // Move in x direction first
  for (let step = 0; step < Math.abs(dx); step++) {
    x = (x + (dx > 0 ? 1 : -1) + gridCols) % gridCols;
    shortestPath.push({ move: dx > 0 ? "<" : ">", pos: { x, y } });
  }

  // Then move in y direction
  for (let step = 0; step < Math.abs(dy); step++) {
    y = (y + (dy > 0 ? 1 : -1) + gridRows) % gridRows;
    shortestPath.push({ move: dy > 0 ? "^" : "v", pos: { x, y } });
  }
}

  shortestPath.forEach(({move, pos}) => {
    const color = main.get(pos);
    const state = startState;
    startState++;
    json[state] = [{writeColor: color, move, nextState: startState}];
  });

  const addFinalMoves = (moves) => {
    moves.forEach(([move, dx, dy]) => {
      const pos = main.checkCords({x: endPosDirc[0] + dx, y: endPosDirc[1] + dy});
      const color = main.get(pos);
      const state = startState;
      startState++;
      json[state] = [{writeColor: color, move, nextState: startState}];
    });
  };

  const directions = {
    right: [["<", 0, 0], [">", -1, 0]],
    left:  [[">", 0, 0], ["<", 1, 0]],
    up:    [["v", 0, 0], ["^", 0, 1]],
    down:  [["^", 0, 0], ["v", 0, -1]],
  };

  addFinalMoves(directions[endPosDirc[2]]);
}


// This function adds a move rule to the json you should use this function (one time or more) after the others;
function addMoveRule(state, writeColor, move, nextState) {
  state += startState;
  nextState = (nextState !== undefined) ? nextState + startState : state;
  if (!json[state]) json[state] = [];
  json[state].push({writeColor, move, nextState});
}

// EXAMPLE CODE FOR RUN - This section is optional (I am also going to use this for generating rules)
setStartLoc(0,0);
colorPoint(0,0,1);
colorPoint(3,0,1);
colorPoint(0,2,1);
colorPoint(3,2,1);
colorPoint(1,3,1);
colorPoint(2,3,1);
fillArea(startPos[0], startPos[1], gridCols, gridRows, 4);
parseGrid();
addMoveRule(0, 1, "v");
addMoveRule(0, 2, "N");
addMoveRule(0, 0, "L", 1);
addMoveRule(1, 1, "v");
addMoveRule(1, 2, "N");
addMoveRule(1, 0, "L", 0);

/* FOR EXPORT TO JSON (mjs) - This section is optional
fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
END OF EXPORT SECTION */

function resize() {
  const outputElm = document.getElementById("output");
  outputElm.style.width = (window.innerWidth - 25) + "px";
  outputElm.style.height = (window.innerHeight - 27) + "px";
}

window.onload = () => {
  resize();
  try {
    document.getElementById("output").innerHTML = JSON.stringify(json);
  } catch (e) {
    alert(e);
  }
};
window.addEventListener('resize', resize);
