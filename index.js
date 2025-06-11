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
let endPosDirc = [Math.floor(gridCols/2), Math.floor(gridRows/2), 'right']

//Moves to a location
function setStartLoc(x,y,direction) {
  if (!direction) {
    direction = "right";
  } 
  if (x == endPosDirc[0] && y == endPosDirc[1] && direction == endPosDirc[2]) {
    return;
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
  endPosDirc = [x,y,direction];
}
function colorPoint(x,y,color) {
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
  let goToPoints = [];
  let getDist = function (p1,p2) {
    let distX = Math.abs(p1.x - p2.x)
    let distY = Math.abs(p1.y - p2.y)
    return distX + distY;
  }
  grid.forEach((item,x) => {
    item.forEach((value,y) => {
      if (value>0) goToPoints.push({x:x,y:y});
    }); 
  });
  let path = [{x:startPos[0],y:startPos[1]}]
  while (path.length<goToPoints.length+1) {
    let shortestDist = gridCols*2 + gridRows*2
    let pointIndex = -1
    goToPoints.forEach((item,index) => {
      if (!path.some(e => e.x==item.x&&e.y==item.y)) {
        let dist = getDist(path[path.length-1],item)
        if (shortestDist > dist) {
          shortestDist = dist;
          pointIndex = index;
        }
      }
    });
    path.push(goToPoints[pointIndex]);
  }
  for (let i = 0;i<path.length-1;i++) {
    let current = path[i]
    let end = path[i+1]
    while (current.x!=end.x||current.y!=end.y) {
      if (current.x<end.x) {
        current.x++
        shortestPath.push({move:">",x:current.x,y:current.y});
      } 
      if (current.x>end.x) {
        current.x--
        shortestPath.push({move:"<",x:current.x,y:current.y});
      } 
      if (current.y<end.y) {
        current.y++
        shortestPath.push({move:"v",x:current.x,y:current.y});
      } 
      if (current.y>end.y) {
        current.y--
        shortestPath.push({move:"^",x:current.x,y:current.y});
      }
    }
  }
  return shortestPath
}
function parseGrid() {
  let shortestPath = findShortestPath()
  shortestPath.forEach(value => {
    let move = value.move
    let state = startState;
    let color = grid[value.x][value.y]
    json[state].push({writeColor: color, move: move, nextState: startState+1})
    startState++
  })
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
colorPoint(2,3,1)
parseGrid()
addMoveRule(0, 1, "v");
addMoveRule(0, 2, "N");
addMoveRule(0, 0, "L", 1);
addMoveRule(1, 1, "v");
addMoveRule(1, 2, "N");
addMoveRule(1, 0, "L", 0);
/* FOR EXPORT TO JSON (mjs) - This section is optional
fs.writeFileSync(outputFile, JSON.stringify(json, null, 2))
*/
function resize() {
  let h = window.innerHeight;
  let w = window.innerWidth;
  let outputElm = document.getElementById("output")
  outputElm.style.width=(w-25)+"px"
  outputElm.style.height=(h-27)+"px"
}
window.onload = function() {
resize()
try {
  document.getElementById("output").innerHTML = JSON.stringify(json)
} catch (e) {
  alert(e)
}
}
window.addEventListener('resize', resize);
