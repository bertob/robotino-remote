var PLAYGROUND_HEIGHT = 730;
var PLAYGROUND_WIDTH = 730;
var ROBOT_SIZE = 80;
var MOVEMENT_UNIT = 2;
var ROTATION_UNIT = 0.01;

var hoverX, hoverY;
var robotX = PLAYGROUND_HEIGHT/5 - ROBOT_SIZE/2;
var robotY = PLAYGROUND_WIDTH/5 - ROBOT_SIZE/2;
var targetX, targetY;
var robotA = 0;
var targetA;
var intervalsM = 0;
var intervalsA = 0;
var moving = false;
var moveOperations = [];

moveTo("#robot", robotX, robotY);

$("#playground").on("mousemove", function(event) {
  var rect = $("#playground").get(0).getBoundingClientRect();
  hoverX = event.pageX - rect.left - ROBOT_SIZE/2;
  hoverY = event.pageY - rect.top - ROBOT_SIZE/2;
	// console.log("move", hoverX, hoverY);
	// console.log("chtouc", event.changedTouches);
	moveTo("#robot-preview", hoverX, hoverY);
});

$("#playground").on("mouseup", function(event) {
	console.log("robot moves");
	targetX = hoverX;
	targetY = hoverY;

	targetA = Math.atan((targetY - robotY) / (targetX - robotX));
	intervalsA = (targetA - robotA) / ROTATION_UNIT;
  console.log("oiiiiiiiiiiiiiiii", targetA, intervalsA);

	var length = Math.abs((targetY - robotY) / Math.sin(targetA));
	intervalsM = Math.abs(length / MOVEMENT_UNIT);

	var moveId = "mov_" + targetX + "_" + targetY + "_" + Math.random() * 1000;
	moveOperations.push(moveId);
	moveRobot(targetX, targetY, targetA, intervalsA, intervalsM, moveId);
	// console.log("ang", angle);
	// console.log("sin", Math.sin(angle));
	// console.log("cos", Math.cos(angle));
});

function moveRobot(x, y, a, inA, inM, moveId) {
	if (moveOperations[moveOperations.length - 1] === moveId) {
		// if (!moving) {
		// 	moving = true;
		// }
		setTimeout(function() {
			// console.log("start move", a, inA, inM);
			if (inA !== 0) {
				console.log("robotA",robotA);
				console.log("inA",inA);
				var f = (Math.abs(inA) < 1)? inA : 1;
        if (inA < 0) f = -f;
        console.log("roba", robotA);
				robotA += ROTATION_UNIT * f;
        console.log("roba_after", robotA);
				rotateTo("#robot .robot-img", robotA);

        if (inM-1 > 0)
				  moveRobot(targetX, targetY, a, inA-f, inM, moveId);
        else
          moveRobot(targetX, targetY, a, 0, inM, moveId);
			}
			else {
				console.log("rot done");
				var k = (inM < 1)? inM : 1;
				if (Math.cos(a) < 0) {
					console.log("HEOOOOOOOOO");
					robotX -= MOVEMENT_UNIT * Math.cos(a) * k;
					robotY -= MOVEMENT_UNIT * Math.sin(a) * k;
				} else {
					robotX += MOVEMENT_UNIT * Math.cos(a) * k;
					robotY += MOVEMENT_UNIT * Math.sin(a) * k;
				}
				moveTo("#robot", robotX, robotY);
				if (inM-1 > 0)
					moveRobot(targetX, targetY, a, 0, inM-1, moveId);
			}

		}, 15);
	}
}

function moveTo(id, x, y) {
	$(id).css({"transform": "translate(" + x + "px, " + y + "px)" });
}
function rotateTo(id, a) {
	$(id).css({"transform": "rotate(" + a + "rad)" });
}
