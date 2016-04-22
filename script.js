var MOV_SPEED = 500;
var ROT_SPEED = 40;
var TOUCHPAD_SIZE = 600;
var MAX_X = 300;
var MAX_Y = 300;

var hoverX, hoverY;
var moving = false;

$("#rot-cl-button").on("touchstart", function(e) {
  cl();
});
$("#rot-ccl-button").on("touchstart", function(e) {
  ccl();
});
$("#wiggle-button").on("touchstart", function(e) {
  wiggle();
});
$("#wiggle-button, #rot-cl-button, #rot-ccl-button").on("touchend", function(e) {
  move(0, 0);
  setTimeout(function() {
    move(0, 0);
  }, 50);
});
$(".sound-button").on("touchstart", function(e) {
  $(this).children("audio").get(0).play();
  $(this).children("audio").attr("loop", "");
});
$(".sound-button").on("touchend", function(e) {
  $(this).children("audio").removeAttr("loop");
  $(this).children("audio").get(0).pause();
  $(this).children("audio").get(0).currentTime = 0;
});

$("#touchpad").on("move", function(e) {
  if (!moving) {
    hover(e.pageX, e.pageY);
    setTimeout(function() {
      moving = false;
    }, 250);
  }
});
$("#touchpad").on("moveend", function(e) {
  move(0, 0);
});

function hover(pX, pY) {
  console.log("everyday im hovering", pX, pY);
  var rect = $("#touchpad").get(0).getBoundingClientRect();
  hoverX = (pX - rect.left) - TOUCHPAD_SIZE/2;
  hoverY = -((pY - rect.top) - TOUCHPAD_SIZE/2);
  move(hoverX, hoverY);
}
function move(x, y) {
  $("#knob").css({"transform": "translate(" + x + "px, " + -y + "px)"});

  console.log("hoverXY",x,y);
  var vX = (Math.min(x, MAX_X)/MAX_X) * MOV_SPEED;
  var vY = (Math.min(y, MAX_Y)/MAX_Y) * MOV_SPEED;
  console.log("vXY",vX,vY);
  robot(Math.floor(vX), Math.floor(vY), 0);
}

function cl() {
  robot(0, 0, -80);
}
function ccl() {
  robot(0, 0, 80);
}
function wiggle() {
  robot(-MOV_SPEED*0.3, 0, 0);
  setTimeout(function() {
    robot(MOV_SPEED*0.3, 0, 0);
    setTimeout(function() {
      robot(-MOV_SPEED*0.3, 0, 0);
      setTimeout(function() {
        robot(MOV_SPEED*0.3, 0, 0);
        setTimeout(function() {
          robot(-MOV_SPEED*0.3, 0, 0);
          setTimeout(function() {
            robot(MOV_SPEED*0.3, 0, 0);
            setTimeout(function() {
              robot(0, 0, 0);
            }, 320);
          }, 320);
        }, 320);
      }, 320);
    }, 320);
  }, 320);
}

function robot(y, x, r) {
  $.post(
    "http://172.26.201.2:1337/x" + x + "y" + -y + "r" + r
  );
}
