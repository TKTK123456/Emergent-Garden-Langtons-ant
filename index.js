/* FOR EXPORT TO JSON (mjs) - This section is optional
import fs from 'fs';
import path from 'path'; 
const __dirname = path.resolve();
let outputFile = path.join(__dirname, 'output.json');
*/ 
// CODE
let gridCols = 171; // You will have to get this yourself from the javascript if you have a different screen size
let gridRows = 96;
let main = {
  grid: [],
  checkCords: function (cords) {
    let x = cords.x;
    let y = cords.y;
    while (x<0||x>=gridCols||y<0||y>=gridRows) {
      if (x < 0) {
        let amountLess = Math.abs(x);
        x = gridCols-amountLess;
      };
      if (y < 0) {
        let amountLess = Math.abs(y);
        y = gridRows-amountLess;
      };
      if (x >= gridCols) {
        x = x-gridCols;
      };
      if (y >= gridRows) {
        y = y-gridRows;
      };
    };
    return {x:x,y:y};
  },
  get: function (cords) {
    cords = this.checkCords(cords);
    return this.grid[cords.x][cords.y];
  },
  set: function (cords, set) {
    cords = this.checkCords(cords);
    this.grid[cords.x][cords.y] = set
    return this.grid[cords.x][cords.y]
  }
}
for (let i = 0; i < gridCols; i++) {
  main.grid[i] = [];
  for (let j = 0; j < gridRows; j++) {
    main.grid[i][j] = 0;
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
  x = main.checkCords({x:x,y:y}).x
  y = main.checkCords({x:x,y:y}).y
  if (x == endPosDirc[0] && y == endPosDirc[1] && direction == endPosDirc[2]) {
    return;
  }
  endPosDirc = [x,y,direction];
}
function colorPoint(x,y,color) {
  main.set({x:x,y:y}, color);
}
function fillArea(x1,y1,x2,y2,color) {
  let set1 = main.checkCords({x:x1,y:y1})
  let set2 = main.checkCords({x:x2,y:y2})
  x1 = set1.x
  y1 = set1.y
  x2 = set2.x
  y2 = set2.y
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
      main.set({x:i,y:j}, color);
    }
  }
}
function parseGrid() {
  let shortestPath = [];
  let goToPoints = [];
  let getDist = function (p1,p2) {
    let distX = Math.abs(p1.x - p2.x)
    let distY = Math.abs(p1.y - p2.y)
    let type = {x:0,y:0}
    let tempDistX = Math.abs(p1.x - (p2.x-gridCols))
    if (tempDistX<distX) {
      distX = tempDistX;
      type.x = 1;
    }
    tempDistY = Math.abs(p1.y - (p2.y-gridRows))
    if (tempDistY<distY) {
      distY = tempDistY;
      type.y = 1;
    }
    tempDistX = Math.abs(p1.x - (p2.x+gridCols))
    if (tempDistX<distX) {
      distX = tempDistX;
      type.x = 2;
    }
    tempDistY = Math.abs(p1.y - (p2.y+gridRows))
    if (tempDistY<distY) {
      distY = tempDistY;
      type.y = 2;
    }
    return {dist:distX + distY,type:type};
  }
  main.grid.forEach((item,x) => {
    item.forEach((value,y) => {
      if (value>0) goToPoints.push({x:x,y:y});
    }); 
  });
  let path = [{x:startPos[0],y:startPos[1]}]
  while (path.length<goToPoints.length+1) {
    let shortestDist = Infinity
    let pointIndex = -1
    goToPoints.forEach((item,index) => {
      if (!path.some(e => e.x==item.x&&e.y==item.y)) {
        let dist = getDist(path[path.length-1],item).dist
        if (shortestDist > dist) {
          shortestDist = dist;
          pointIndex = index;
        }
      }
    });
    path.push(goToPoints[pointIndex]);
  }
  path.push({x:endPosDirc[0],y:endPosDirc[1]})
  for (let i = 0;i<path.length-1;i++) {
    let current = path[i]
    let end = path[i+1]
    let type = getDist(current,end).type;
    if (type.x==1) end.x = end.x-gridCols; else if (type.x==2) end.x = end.x+gridCols;
    if (type.y==1) end.y = end.y-gridRows; else if (type.y==2) end.y = end.y+gridRows;
    while (current.x!=end.x||current.y!=end.y) {
      if (current.x<end.x) {
        current.x++
        shortestPath.push({move:">",pos:{x:current.x,y:current.y}});
      } 
      if (current.x>end.x) {
        current.x--
        shortestPath.push({move:"<",pos:{x:current.x,y:current.y}});
      } 
      if (current.y<end.y) {
        current.y++
        shortestPath.push({move:"v",pos:{x:current.x,y:current.y}});
      } 
      if (current.y>end.y) {
        current.y--
        shortestPath.push({move:"^",pos:{x:current.x,y:current.y}});
      }
    }
  }
  shortestPath.forEach((value) => {
    let move = value.move
    let state = startState;
    let color = main.get(value.pos);
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
  })
  if (endPosDirc[2]=='right') {
    let move = "<"
    let state = startState;
    let color = main.get({x:endPosDirc[0],y:endPosDirc[1]});
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
    move = ">"
    state = startState;
    color = main.get({x:endPosDirc[0]-1,y:endPosDirc[1]});
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
  }
  if (endPosDirc[2]=='left') {
    let move = ">"
    let state = startState;
    let color = main.get({x:endPosDirc[0],y:endPosDirc[1]});
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
    move = "<"
    state = startState;
    color = main.get({x:endPosDirc[0]+1,y:endPosDirc[1]});
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
  }
  if (endPosDirc[2]=='up') {
    let move = "v"
    let state = startState;
    let color = main.get({x:endPosDirc[0],y:endPosDirc[1]});
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
    move = "^"
    state = startState;
    color = main.get({x:endPosDirc[0],y:endPosDirc[1]+1});
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
  }
  if (endPosDirc[2]=='down') {
    let move = "^"
    let state = startState;
    let color = main.get({x:endPosDirc[0],y:endPosDirc[1]});
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
    move = "v"
    state = startState;
    color = main.get({x:endPosDirc[0],y:endPosDirc[1]-1});
    startState++
    json[state] = [{writeColor: color, move: move, nextState: startState}]
  }
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
fillArea(startPos[0],startPos[1],gridCols-1,gridRows-1,4)
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
