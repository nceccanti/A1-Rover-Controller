var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var url = require('url');
var path = require('path');
var io = require('socket.io','net')(http) //require socket.io module and pass the http object (server)
var Gpio = require('pigpio').Gpio; //include onoff to interact with the GPIO
const led4 = new Gpio(4, {mode: Gpio.OUTPUT});
const led14 = new Gpio(14, {mode: Gpio.OUTPUT});
const led16 = new Gpio(16, {mode: Gpio.OUTPUT});
const led26 = new Gpio(26, {mode: Gpio.OUTPUT});
var ip = require("ip");
const nodemailer = require("nodemailer")
const {google} = require("googleapis")
const express = require("express");
const app = express();
const cors = require("cors")

const SerialPort = require("serialport")
const SerialPortParser = require("@serialport/parser-readline")
const GPS = require("gps");
const Request = require("request-promise");

const port = new SerialPort("/dev/ttyS0", { baudRate: 9600});
const gps = new GPS();
const parser = port.pipe(new SerialPortParser());

const allowedOrigins = [ip.address()];
app.use(cors())

var lat = 0;
var long = 0;

app.get("/gps", (req, res) => {
  res.send({
    latit: lat,
    longit: long,
  });
});

gps.on("data", data => {
  if(data.type == "GGA") {
    if(data.quality != null) {
      lat = data.lat;
      long = data.lon;
     console.log(lat + " " + long)
    }
  }
})

parser.on("data", data => {
  gps.update(data)
})

app.listen(3000, () => {
  console.log(`Example app listening at 3000`)
})

var GPIO4value = 0;
var GPIO14value = 0;
var GPIO16value = 0;
var GPIO26value = 0;

const WebPort = 80;

http.listen(WebPort, function() {
  led4.pwmWrite(GPIO4value);
  led14.pwmWrite(GPIO14value);
  led16.pwmWrite(GPIO16value);
	led26.pwmWrite(GPIO26value); 
	console.log('Server running on Port '+WebPort);
	console.log(GPIO4value + " " + GPIO14value + " " + GPIO16value + " " + GPIO26value);
	} 
); 

function handler (req, res) { 
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    console.log('filename='+filename);
    var extname = path.extname(filename);
    if (filename=='./') {
      console.log('retrieving default index.html file');
      filename= './index.html';
    }
    
    var contentType = 'text/html';
    
    switch(extname) {
	case '.js':
	    contentType = 'text/javascript';
	    break;
	case '.css':
	    contentType = 'text/css';
	    break;
	case '.json':
	    contentType = 'application/json';
	    break;
	case '.png':
	    contentType = 'image/png';
	    break;
	case '.jpg':
	    contentType = 'image/jpg';
	    break;
	case '.ico':
	    contentType = 'image/png';
	    break;
    }
    

    
    fs.readFile(__dirname + '/public/' + filename, function(err, content) {
	if(err) {
	    console.log('File not found. Filename='+filename);
	}
	else {
	    res.writeHead(200, {'Content-Type': contentType}); 
	    return res.end(content,'utf8');
	}
      
    });
}

process.on('SIGINT', function () {
  led4.pwmWrite(0);
  led14.pwmWrite(0);
  led16.pwmWrite(0);
  led26.pwmWrite(0); 
  process.exit(); 
}); 


io.sockets.on('connection', function (socket) {
    socket.emit('GPIO4', GPIO4value);
    socket.emit('GPIO14', GPIO14value);
    socket.emit('GPIO16', GPIO16value);
    socket.emit('GPIO26', GPIO26value);

    socket.on('GPIO4', function(data) { 
	    GPIO4value = data;
	    led4.pwmWrite(GPIO4value)
	    console.log(GPIO4value)
    });

    socket.on('GPIO14', function(data) { 
	    GPIO14value = data;
	    led14.pwmWrite(GPIO14value)
	    console.log(GPIO14value)
    });

    socket.on('GPIO16', function(data) { 
	    GPIO16value = data;
	    led16.pwmWrite(GPIO16value)
	    console.log(GPIO16value)
    });

    socket.on('GPIO26', function(data) { 
	    GPIO26value = data;
	    led26.pwmWrite(GPIO26value)
	    console.log(GPIO26value)
    });
    
    socket.on('disconnect', function () {
	console.log('A user disconnected');
    });
});