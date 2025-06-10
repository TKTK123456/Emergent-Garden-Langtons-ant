/* FOR EXPORT TO JSON (mjs) - This section is optional
import fs from 'fs';
import path from 'path'; 
const __dirname = path.resolve();
let outputFile = path.join(__dirname, 'output.json');
*/
// CODE
let gridCols = 171; // You will have to get this yourself from the javascript if you have a different screen size
let gridRows = 96;
let grid = [];
for (let i = 0; i < gridCols; i++) {
  grid[i] = [];
  for (let j = 0; j < gridRows; j++) {
    grid[i][j] = 0;
  }
}
let json = {} // This is the output json
let startState = 0;
let startPos = [Math.floor(gridCols/2), Math.floor(gridRows/2)]
let posDirc = [Math.floor(gridCols/2), Math.floor(gridRows/2), 'right']

//Moves to a location
function setStartLoc(x,y,direction) {
  if (!direction) {
    direction = "right";
  }
  if (x == posDirc[0] && y == posDirc[1] && direction == posDirc[2]) {
    return;
  }
  alert("hey")
  while (x<0||x>=gridCols||y<0||y>=gridRows) {
  if (x < 0) {
    let amountLess = Math.abs(x);
    x = gridCols-amountLess;
  }
  if (y < 0) {
    let amountLess = Math.abs(y);
    y = gridRows-amountLess;
  }
  if (x >= gridCols) {
    x = x-gridCols;
  }
  if (y >= gridRows) {
    y = y-gridRows;
  }
  }
  posDirc = [x,y,direction];
}
function colorPoint(x,y,color) {
  if (!direction) {
    direction = "right";
  }
  while (x<0||x>=gridCols||y<0||y>=gridRows) {
    if (x < 0) {
      let amountLess = Math.abs(x);
      x = gridCols-amountLess;
    }
    if (y < 0) {
      let amountLess = Math.abs(y);
      y = gridRows-amountLess;
    }
    if (x >= gridCols) {
      x = x-gridCols;
    }
    if (y >= gridRows) {
      y = y-gridRows;
    }
  }
  grid[x][y] = color;
}
function fillArea(x1,y1,x2,y2,color) {
  while (x1<0||x1>=gridCols||y1<0||y1>=gridRows||x2<0||x2>=gridCols||y2<0||y2>=gridRows) {
    if (x1 < 0) {
      let amountLess = Math.abs(x1);
      x1 = gridCols-amountLess;
    }
    if (y1 < 0) {
      let amountLess = Math.abs(y1);
      y1 = gridRows-amountLess;
    }
    if (x1 >= gridCols) {
      x1 = x1-gridCols;
    }
    if (y1 >= gridRows) {
      y1 = y1-gridRows;
    }
    if (x2 < 0) {
      let amountLess = Math.abs(x2);
      x2 = gridCols-amountLess;
    }
    if (y2 < 0) {
      let amountLess = Math.abs(y2);
      y2 = gridRows-amountLess;
    }
    if (x2 >= gridCols) {
      x2 = x2-gridCols;
    }
    if (y2 >= gridRows) {
      y2 = y2-gridRows;
    }
    }
  if (x1>x2) {
    let temp = x1;
    x1 = x2;
    x2 = temp;
  }
  if (y1>y2) {
    let temp = y1;
    y1 = y2;
    y2 = temp;
  }
  for (let i = x1; i <= x2; i++) {
    for (let j = y1; j <= y2; j++) {
      grid[i][j] = color;
    }
  }
}
function findShortestPath() {
  let shortestPath = [];
  let shortestPathLength = 0;
  let currentPos = startPos
}
function parseGrid() {
  let shortestPath = [];
  let shortestPathLength = 0;
  
}
// This function adds a move rule to the json you should use this function (one time or more) after the others;
function addMoveRule(state, writeColor, move, nextState) {
  state = state+startState;
  if (!nextState) {
    if (nextState === 0) {
      nextState = nextState+startState;
    } else nextState = state;
  } else {
    nextState = nextState+startState;
  }
  if (!json[state]) {
    json[state] = [];
  }
  json[state].push({writeColor: writeColor, move: move, nextState: nextState});
}
// EXAMPLE CODE FOR RUN - This section is optional (I am also going to use this for generating rules)
setStartLoc(0,0);
colorPoint(0,0,1)
colorPoint(3,0,1)
colorPoint(0,2,1)
colorPoint(3,2,1)
colorPoint(1,3,1)
colorPoint(2,3,1, "right")
addMoveRule(0, 1, "v");
addMoveRule(0, 2, "N");
addMoveRule(0, 0, "L", 1);
addMoveRule(1, 1, "v");
addMoveRule(1, 2, "N");
addMoveRule(1, 0, "L", 0);
alert(JSON.stringify(json));
/* FOR EXPORT TO JSON (mjs) - This section is optional
fs.writeFileSync(outputFile, JSON.stringify(json, null, 2))
*/
try {
  document.getElementById("output").innerHTML = JSON.stringify(json)
} catch (e) {
  alert(e)
}
