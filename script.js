var PLAYGROUND_HEIGHT = 730;
var PLAYGROUND_WIDTH = 730;
var ROBOT_SIZE = 80;
var MOVEMENT_UNIT = 2;
var ROTATION_UNIT = 0.02;

var hoverX, hoverY;
var robotX = PLAYGROUND_HEIGHT / 5 - ROBOT_SIZE / 2;
var robotY = PLAYGROUND_WIDTH / 5 - ROBOT_SIZE / 2;
var targetX, targetY;

var robotA = 0;
var targetA, hoverA;
var intervalsM = 0;
var intervalsA = 0;
var moving = false;
var moveOperations = [];

moveTo("#robot", robotX, robotY);

$("#playground").on("mouseenter", function(event) {
  $("#robot-preview").show();
});
$("#playground").on("mouseleave", function(event) {
  $("#robot-preview").hide();
});
$("#playground").on("mousemove", function(event) {
  var rect = $("#playground").get(0).getBoundingClientRect();
  hoverX = event.pageX - rect.left - ROBOT_SIZE / 2;
  hoverY = event.pageY - rect.top - ROBOT_SIZE / 2;
  hoverA = Math.atan((hoverY - robotY)/(hoverX - robotX));
  if (hoverX - robotX < 0) hoverA += Math.PI;

  moveTo("#robot-preview", hoverX, hoverY);
  rotateTo("#robot-preview .robot-img", hoverA);
});

$("#playground").on("mouseup", function(event) {
  console.log("robot moves");
  targetX = hoverX;
  targetY = hoverY;

  dX = targetX - robotX;
  dY = targetY - robotY;

  targetA = Math.atan(dY/dX);
  if (targetA > Math.PI)
    targetA = 2 * Math.PI - targetA;
  if (dX < 0)
    targetA += Math.PI;
  intervalsA = (targetA - robotA) / ROTATION_UNIT;

  var length = Math.abs(dY / Math.sin(targetA));
  intervalsM = length / MOVEMENT_UNIT;

  var moveId = "mov_" + targetX + "_" + targetY + "_" + Math.random() *
    1000;
  moveOperations.push(moveId);
  moveRobot(targetX, targetY, targetA, intervalsA, intervalsM, moveId);
});

function moveRobot(x, y, a, inA, inM, moveId) {
  if (moveOperations[moveOperations.length - 1] === moveId) {
    setTimeout(function() {
      if (Math.abs(inA) > 0.4) {
        var f = (Math.abs(inA) < 1) ? inA : 1;
        if (inA < 0) f = -f;
        robotA += ROTATION_UNIT * f;
        rotateTo("#robot .robot-img", robotA);

        moveRobot(targetX, targetY, a, inA - f, inM, moveId);
      } else {
        var k = (inM < 1) ? inM : 1;
        robotX += MOVEMENT_UNIT * Math.cos(a) * k;
        robotY += MOVEMENT_UNIT * Math.sin(a) * k;
        moveTo("#robot", robotX, robotY);
        if (inM - 1 > 0)
          moveRobot(targetX, targetY, a, 0, inM - 1, moveId);
      }

    }, 15);
  }
}

function moveTo(id, x, y) {
  $(id).css({
    "transform": "translate(" + x + "px, " + y + "px)"
  });
}

function rotateTo(id, a) {
  $(id).css({
    "transform": "rotate(" + a + "rad)"
  });
}
