var socket = io();
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