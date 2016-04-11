var PLAYGROUND_HEIGHT = 730;
var PLAYGROUND_WIDTH = 730;
var ROBOT_SIZE = 80;
var MOVEMENT_UNIT = 2;
var ROTATION_UNIT = 0.02;

var hoverX, hoverY;
var robotX = PLAYGROUND_HEIGHT / 5 - ROBOT_SIZE / 2;
var robotY = PLAYGROUND_WIDTH / 5 - ROBOT_SIZE / 2;
var targetX, targetY;
var intervalsM = 0;

var hoverA, targetA;
var robotA = 0;
var intervalsA = 0;

var moveOperations = [];

$("#robot-preview").hide();
moveTo("#robot", robotX, robotY);

$("#playground").on("touchstart", function(e) {
  hover(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
});
$("#playground").on("move", function(e) {
  hover(e.pageX, e.pageY);
});
$("#playground").on("touchend", function(e) {
  startMoving();
});
$("#playground").on("moveend", function(e) {
  startMoving();
});

function hover(pX, pY) {
  $("#robot-preview").show();
  var rect = $("#playground").get(0).getBoundingClientRect();
  hoverX = pX - rect.left - ROBOT_SIZE / 2;
  hoverY = pY - rect.top - ROBOT_SIZE / 2;
  hoverA = Math.atan((hoverY - robotY)/(hoverX - robotX));
  if (hoverX - robotX < 0) hoverA += Math.PI;

  moveTo("#robot-preview", hoverX, hoverY);
  rotateTo("#robot-preview .robot-img", hoverA);
}

function startMoving() {
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
}

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
