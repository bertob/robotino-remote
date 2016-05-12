var MOV_SPEED = 500;
var ROT_SPEED = 40;

var TOUCHPAD_SIZE = 600;
var KNOB_SIZE = 120;
var MAX_X = 300;
var MAX_Y = 300;

var mq = window.matchMedia("(max-width: 800px)");
if (mq.matches){
  var TOUCHPAD_SIZE = 300;
  var KNOB_SIZE = 100;
  var MAX_X = 150;
  var MAX_Y = 150;
}

var hoverX, hoverY;
var moving = false;

document.ontouchmove = function(e) {
  e.preventDefault();
};
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
  console.log("yo");
  // $(this).children("audio").attr("loop", "");
});
// $(".sound-button").on("touchend", function(e) {
//   $(this).children("audio").removeAttr("loop");
//   $(this).children("audio").get(0).pause();
//   $(this).children("audio").get(0).currentTime = 0;
// });

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
  // console.log("everyday im hovering", pX, pY);
  var rect = $("#touchpad").get(0).getBoundingClientRect();
  hoverX = (pX - rect.left) - TOUCHPAD_SIZE/2;
  hoverY = -((pY - rect.top) - TOUCHPAD_SIZE/2);
  move(hoverX, hoverY);
}
function move(x, y) {
  var h = Math.sqrt(x*x + y*y);
  var r = TOUCHPAD_SIZE/2 - KNOB_SIZE/2 + 20;
  if (h > r) {
    console.log("x",x,"y",y);
    var a = Math.atan(y/x);
    x = r * Math.cos(a) * sign(x);
    var k = 1;
    if ((y < 0 && x > 0) || (y > 0 && x < 0)) k = -1;
    y = r * Math.sin(a) * sign(y) * k;
    console.log("x2",x,"y2",y);
  }
  $("#knob").css({"transform": "translate(" + x + "px, " + -y + "px)"});

  // console.log("hoverXY",x,y);
  var vX = (Math.min(x, MAX_X)/MAX_X) * MOV_SPEED;
  var vY = (Math.min(y, MAX_Y)/MAX_Y) * MOV_SPEED;
  // console.log("vXY",vX,vY);
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
              robot(MOV_SPEED*0.3, 0, 0);
              setTimeout(function() {
                robot(0, 0, 0);
              }, 60);
            }, 120);
          }, 120);
        }, 120);
      }, 120);
    }, 120);
  }, 60);
}

function robot(y, x, r) {
  $.post(
    "http://172.26.201.2:1337/x" + x + "y" + -y + "r" + r
  );
}

function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }
