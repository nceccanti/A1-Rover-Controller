var socket = io();
//socket.emit("GPIO26", a);
var xPrev = 1000;
var yPrev = 1000;

setInterval(function(){
  let x = joy.GetX();
  let y = joy.GetY();
  x = x * 2.5;
  y = y * 2.5;
  x = parseInt(x);
  y = parseInt(y);
  
  let lY = y;
  let rY = y;
  
  if(x > 0) {
    rY -= x;
  } else {
    lY -= x;
  }
 
  console.log(x + "x " + y + "y")
}, 50);

document.addEventListener("keydown", reportKeyDown);
document.addEventListener("keyup", reportKeyUp);

document.addEventListener("DOMContentLoaded", (e) => {
	let ip = location.host;
	console.log(ip)
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
