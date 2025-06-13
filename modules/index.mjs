const main = {
gridCols: 171, // You will have to get this yourself from the javascript if you have a different screen size
gridRows: 96,
startPos: [Math.floor(gridCols / 2), Math.floor(gridRows / 2)],
endPosDirc: [Math.floor(gridCols / 2), Math.floor(gridRows / 2), 'right'],
gridInited: false,
grid: [],
checkCords: function ({x, y}) {
    if (!this.gridInited) {
      initGrid()
    }
    x = ((x % gridCols) + gridCols) % gridCols;
    y = ((y % gridRows) + gridRows) % gridRows;
    return {x, y};
},
get: function (cords) {
  if (!this.gridInited) {
      initGrid()
    }
    cords = this.checkCords(cords);
    return this.grid[cords.x][cords.y];
},
set: function (cords, value) {
  if (!this.gridInited) {
      initGrid()
    }
    cords = this.checkCords(cords);
    this.grid[cords.x][cords.y] = value;
    return value;
},
json: {},
startState: 0,
// Utility functions for toroidal distance & movement
getDelta: function(p1, p2, size) {
  let delta = (p2 - p1 + size) % size;
  if (delta > size / 2) delta -= size;
  return delta;
},

getDistAndDelta: function(p1, p2) {
  const dx = this.getDelta(p1.x, p2.x, gridCols);
  const dy = this.getDelta(p1.y, p2.y, gridRows);
  return { dist: Math.abs(dx) + Math.abs(dy), dx, dy };
},

// Moves to a location
setStartLoc: function(x, y, direction = "right") {
  ({x, y} = this.checkCords({x, y}));
  if (x === this.endPosDirc[0] && y === this.endPosDirc[1] && direction === this.endPosDirc[2]) return;
  this.endPosDirc = [x, y, direction];
},

colorPoint: function(x, y, color) {
  this.set({x, y}, color);
},

fillArea: function(x1, y1, x2, y2, color) {
  if (!this.gridInited) {
      initGrid()
    }
  ({x: x1, y: y1} = this.checkCords({x: x1, y: y1}));
  ({x: x2, y: y2} = this.checkCords({x: x2, y: y2}));
  if (x1 > x2) [x1, x2] = [x2, x1];
  if (y1 > y2) [y1, y2] = [y2, y1];
  for (let i = x1; i <= x2; i++) {
    this.grid[i].fill(color, y1, y2+1);
  }
},

parseGrid: function() {
  if (!this.gridInited) {
      initGrid()
  }
  let shortestPath = [];
  let goToPoints = [];

  this.grid.forEach((col, x) => {
    col.forEach((val, y) => {
      if (val > 0) goToPoints.push({x, y});
    });
  });

  let path = [{x: this.startPos[0], y: this.startPos[1]}];
  let unvisited = goToPoints.slice();
  if (unvisited.some(e => e.x == this.startPos[0]&&e.y == this.startPos[1])) unvisited.splice(unvisited.findIndex(e => e.x == this.startPos[0]&&e.y == this.startPos[1]),1)
  while (unvisited.length > 0) {
    let current = path[path.length - 1];
    let closestIdx = 0;
    let shortestDist = this.getDistAndDelta(current, unvisited[0]).dist;

    for (let i = 1; i < unvisited.length; i++) {
      let { dist } = this.getDistAndDelta(current, unvisited[i]);
      if (dist < shortestDist) {
        shortestDist = dist;
        closestIdx = i;
      }
    }
    const [nextPoint] = unvisited.splice(closestIdx, 1);
    path.push(nextPoint);
  }

  path.push({x: this.endPosDirc[0], y: this.endPosDirc[1]});

  // Generate moves same as before
  for (let i = 0; i < path.length - 1; i++) {
  const start = path[i];
  const end = path[i + 1];
  const { dx, dy } = this.getDistAndDelta(start, end);

  let x = start.x;
  let y = start.y;

  // Move in x direction first
  for (let step = 0; step < Math.abs(dx); step++) {
    const color = this.get({x, y}); // Get color BEFORE move
    const state = this.startState;
    this.startState++;
    this.json[state] = [{writeColor: color, move: dx > 0 ? ">" : "<", nextState: this.startState}];

    x = (x + (dx > 0 ? 1 : -1) + gridCols) % gridCols;
  }

  // Move in y direction
  for (let step = 0; step < Math.abs(dy); step++) {
    const color = this.get({x, y});
    const state = this.startState;
    this.startState++;
    this.json[state] = [{writeColor: color, move: dy > 0 ? "v" : "^", nextState: this.startState}];

    y = (y + (dy > 0 ? 1 : -1) + gridRows) % gridRows;
  }
}
  const addFinalMoves = (moves) => {
    moves.forEach(([move, dx, dy]) => {
      const pos = this.checkCords({x: endPosDirc[0] + dx, y: endPosDirc[1] + dy});
      const color = this.get(pos);
      const state = this.startState;
      this.startState++;
      this.json[state] = [{writeColor: color, move, nextState: this.startState}];
    });
  };

  const directions = {
    right: [["<", 0, 0], [">", -1, 0]],
    left:  [[">", 0, 0], ["<", 1, 0]],
    up:    [["v", 0, 0], ["^", 0, 1]],
    down:  [["^", 0, 0], ["v", 0, -1]],
  };

  addFinalMoves(directions[this.endPosDirc[2]]);
},


// This function adds a move rule to the json you should use this function (one time or more) after the others;
addMoveRule = function(state, writeColor, move, nextState) {
  state += this.startState;
  nextState = (nextState !== undefined) ? nextState + this.startState : state;
  if (!this.json[state]) this.json[state] = [];
  this.json[state].push({writeColor, move, nextState});
},
initGrid = function() {
this.grid = Array(this.gridCols).fill(null).map(() => Array(this.gridRows).fill(0));
this.gridInited = true;
},
clearGrid = function() {
  initGrid()
}
}
export default main
