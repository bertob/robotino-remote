var PLAYGROUND_REAL_SIZE = 200; //cm
var ROBOT_REAL_SIZE = 35; //cm
var PLAYGROUND_HEIGHT = 680;
var PLAYGROUND_WIDTH = 680;
var ROBOT_SIZE = (ROBOT_REAL_SIZE/PLAYGROUND_REAL_SIZE) * PLAYGROUND_WIDTH;
$("#playground").css("width", PLAYGROUND_WIDTH + "px");
$("#playground").css("height", PLAYGROUND_HEIGHT + "px");
$("#robot").css("width", ROBOT_SIZE + "px");

var MOVEMENT_UNIT = 1.6;
var ROTATION_UNIT = 0.09; ///1.1;
var MOVEMENT_SPEED = 290; //*1.17;
var ROTATION_SPEED = 40;

var hoverX, hoverY;
var robotX = 0;
var robotY = 0;
var targetX, targetY;
var intervalsM = 0;

var hoverA, targetA;
var robotA = 0;
var intervalsA = 0;

var moveOperations = [];

$("#robot-preview").hide();
moveTo("#robot", robotX, robotY);

$("#wiggle-button").on("click", function(e) {
  wiggle();
});

$("#playground").on("touchstart", function(e) {
  hover(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
});
$("#playground").on("move", function(e) {
  hover(e.pageX, e.pageY);
});
$("#playground").on("touchend", function(e) {
  startMoving(hoverX, hoverY);
});
$("#playground").on("moveend", function(e) {
  startMoving(hoverX, hoverY);
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

function startMoving(hX, hY) {
  console.log("robot moves");
  targetX = hX;
  targetY = hY;

  dX = targetX - robotX;
  dY = targetY - robotY;

  if (robotA < 0) {
    robotA = (2*Math.PI - Math.abs(robotA));
  }

  targetA = Math.atan(dY/dX);
  if (targetA > Math.PI)
    targetA = 2 * Math.PI - Math.abs(targetA);
  if (dX < 0)
    targetA += Math.PI;
  if (dX > 0 && dY < 0)
    targetA += 2*Math.PI;

  if (Math.abs(targetA - robotA) > Math.PI) {
    targetA = -(2*Math.PI - Math.abs(targetA));
    if (Math.abs((robotA - targetA + 2*Math.PI) % (2*Math.PI)) > Math.PI) {
      if (targetA > 2*Math.PI) {
        targetA = targetA % (2*Math.PI);
      }
    }
  }
  // if ((robotA > Math.PI) && (robotA > targetA + Math.PI)) {
  //   robotA = -(2*Math.PI - robotA);
  // }

  intervalsA = (targetA - robotA) / ROTATION_UNIT;

  var length = Math.abs(dY / Math.sin(targetA));
  intervalsM = length / MOVEMENT_UNIT;

  moveRobot(targetA, intervalsA, intervalsM, newMoveId());
}

function moveRobot(a, inA, inM, moveId) {
  if (moveOperations[moveOperations.length - 1] === moveId) {
    setTimeout(function() {
      if (Math.abs(inA) > 0.4) {
        var f = (Math.abs(inA) < 1) ? inA : 1;
        if (inA < 0) f = -f;
        robotA += ROTATION_UNIT * f;
        rotateTo("#robot .robot-img", robotA);

        if (inA < 0) {
          robot(0, 0, ROTATION_SPEED);
        }
        else {
          robot(0, 0, -ROTATION_SPEED);
        }

        moveRobot(a, inA - f, inM, moveId);
      } else {
        var k = (inM < 1) ? inM : 1;
        robotX += MOVEMENT_UNIT * Math.cos(a) * k;
        robotY += MOVEMENT_UNIT * Math.sin(a) * k;
        moveTo("#robot", robotX, robotY);

        robot(MOVEMENT_SPEED, 0, 0);

        if (inM - 1 > 0)
          moveRobot(a, 0, inM - 1, moveId);
        else
          robot(0, 0, 0);
      }

    }, 15);
  }
}

function moveRobotSideways(a, inM, moveId) {
  if (moveOperations[moveOperations.length - 1] === moveId) {
    console.log("yolooooo");
    setTimeout(function() {
      var k = (Math.abs(inM) < 0.4) ? inM : sign(inM)*1;
      robotX += MOVEMENT_UNIT * Math.cos(a) * k;
      robotY += MOVEMENT_UNIT * Math.sin(a) * k;
      moveTo("#robot", robotX, robotY);

      robot(MOVEMENT_SPEED, 0, 0);

      if (inM - 1 > 0)
        moveRobot(a, 0, inM - k, moveId);
      else
        robot(0, 0, 0);

    }, 15);
  }
}

function wiggle() {
  moveRobotSideways(robotA - Math.PI/2, -50, newMoveId());
  setTimeout(function() {
    moveRobotSideways(robotA + Math.PI/2, +50, newMoveId());
    setTimeout(function() {
      moveRobotSideways(robotA - Math.PI/2, -50, newMoveId());
      setTimeout(function() {
        moveRobotSideways(robotA + Math.PI/2, +50, newMoveId());
      }, 760);
    }, 760);
  }, 760);
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

function robot(x, y, r) {
  $.post(
    "http://172.26.201.2:1337/x" + x + "y" + y + "r" + r
  );
}

function newMoveId() {
  var moveId = "mov_" + Math.random() * 1000;
  moveOperations.push(moveId);
  console.log("id", moveId, moveOperations);
  return moveId;
}

function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }
