//var socket = io();
//socket.emit("GPIO26", a);
var lYPrev = 1000;
var rYPrev = 1000;

setInterval(function(){
  let x = joy.GetX();
  let y = joy.GetY();
  x = x * 2.5;
  y = y * 2.5;
  
  let lY = y;
  let rY = y;

  if(x > 0) {
    lY += x;
    rY -= x; 
  } else {
    lY += x;
    rY -= x;
  }

  if(lY > 255) {
    lY = 255;
  }

  if(rY > 255) {
    rY = 255;
  }

  if(lY < -255) {
    lY = -255;
  }

  if(rY < -255) {
    rY = -255;
  }
 
  lY = parseInt(lY);
  rY = parseInt(rY);
  
  let LF = 0;
  let LB = 0;
  let RF = 0;
  let RB = 0;

  if(lY > 0) {
    LF = lY;
  }
  if(lY < 0) {
    LB = Math.abs(lY);
  }
  if(rY > 0) {
    RF = rY;
  }
  if(rY < 0) {
    RB = Math.abs(rY);
  }

  if(lY != lYPrev || rY != rYPrev) {
    lYPrev = lY;
    rYPrev = rY;
    socket.emit("GPIO4", LF);
    socket.emit("GPIO14", LB);
    socket.emit("GPIO16", RF);
    socket.emit("GPIO26", RB);
  }
}, 50);

document.addEventListener("keydown", reportKeyDown);
document.addEventListener("keyup", reportKeyUp);

document.addEventListener("DOMContentLoaded", (e) => {
	let ip = location.host;
	console.logw(ip)
	let back = document.querySelector("body");
	let host = "background-image:url(http://" + ip + ":8080/?action=stream);"
	back.style.cssText = host;	
});


var map = {};

var LEFT_SUM;
var RIGHT_SUM;

function reportKeyDown(e) {
  lSum = 0;
  rSum = 0;
  e = e || event;
  map[e.keyCode] = e.type == "keydown";
  //console.log(map)
  if(map[87] && map[83]) {
    lSum = 0;
    rSum = 0;
  } else if(map[87]) {
    lSum = 255;
    rSum = 255;
  } else if(map[83]) {
    lSum = -255;
    rSum = -255;
  }
  if(map[65] && map[68]) {
    console.log("nothing")
  } else if(map[65]) {
    if(lSum == 0 && rSum == 0) {
      lSum = -255
      rSum = 255
    } else {
      lSum *= 0.5;
      lSum = parseInt(lSum)
    }
  } else if(map[68]) {
    if(lSum == 0 && rSum == 0) {
      lSum = 255
      rSum = -255
    } else {
      rSum *= 0.5;
      rSum = parseInt(rSum)
    }
  }
  
  if(LEFT_SUM != lSum) {
    LEFT_SUM = lSum
    Math.abs(lSum)
    if(lSum > 255) {
      lSum = 255
    }
    socket.emit("GPIO26", LEFT_SUM)
    //console.log(LEFT_SUM)
  }
  if(RIGHT_SUM != rSum) {
    RIGHT_SUM = rSum
    //console.log(RIGHT_SUM)
  }
}

function reportKeyUp(e) {
  var code = e.which || e.keyCode
  if(e.key == "w" || code == 38) {
    map = {}
    socket.emit("GPIO26", 0)
  }
  if(e.key == "s" || code == 40) {
    map = {}
    socket.emit("GPIO26", 0)
  }
  if((e.key == "a" || code == 37)) {
    map = {}
    socket.emit("GPIO26", 0)
  }
  if((e.key == "d" || code == 39)) {
    map = {}
    socket.emit("GPIO26", 0)
  }
}
