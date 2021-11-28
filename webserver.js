var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var url = require('url');
var path = require('path');
var io = require('socket.io','net')(http) //require socket.io module and pass the http object (server)
var Gpio = require('pigpio').Gpio; //include onoff to interact with the GPIO
const led26 = new Gpio(26, {mode: Gpio.OUTPUT});
var ip = require("ip");
const nodemailer = require("nodemailer")
const {google} = require("googleapis")

const CLIENT_ID = "443127748749-8tvsl6s0hf16c2q9a8qovs663ruk0k9s.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//049yfanlTagRlCgYIARAAGAQSNwF-L9IrHIlJIid_cvvZpu11TX2_3hHa_Ik-8OwHZUIPnGuT4BexxBo-KVNJBqa-q-nkkoFnW54"

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth",
        user: "nicceccanti@gmail.com",
	pass: "M1ch1xx1234!@#$",
        clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	refreshToken: REFRESH_TOKEN,
	accessToken: accessToken
      }
    })

    const mailOptions = {
      from: "nicceccanti@gmail.com",
      to: "nicceccanti@gmail.com",
      subject: "A1 Rover Controller IP",
      text: "" + ip.address(),
      html: "<h1>" + ip.address() + "</h1>"
    };
    
   const result = await transport.sendMail(mailOptions);
   return result;

  } catch(error) {
    return error;
  }
}

//sendMail().then(result => console.log("Email sent", result)).catch(error => console.log(error.message))

var GPIO26value = 0;
/****** CONSTANTS******************************************************/

const WebPort = 80;


/* if you want to run WebPort on a port lower than 1024 without running
 * node as root, you need to run following from a terminal on the pi
 * sudo apt update
 * sudo apt install libcap2-bin
 * sudo setcap cap_net_bind_service=+ep /usr/local/bin/node
 */
 
/*************** Web Browser Communication ****************************/



// Start http webserver
http.listen(WebPort, function() {  // This gets call when the web server is first started.
	led26.pwmWrite(GPIO26value); //turn LED on or off
	console.log('Server running on Port '+WebPort);
	console.log('GPIO26 = '+GPIO26value);
	} 
); 



// function handler is called whenever a client makes an http request to the server
// such as requesting a web page.
function handler (req, res) { 
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    console.log('filename='+filename);
    var extname = path.extname(filename);
    if (filename=='./') {
      console.log('retrieving default index.html file');
      filename= './index.html';
    }
    
    // Initial content type
    var contentType = 'text/html';
    
    // Check ext and set content type
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
	    fs.readFile(__dirname + '/public/404.html', function(err, content) {
		res.writeHead(200, {'Content-Type': 'text/html'}); 
		return res.end(content,'utf'); //display 404 on error
	    });
	}
	else {
	    // Success
	    res.writeHead(200, {'Content-Type': contentType}); 
	    return res.end(content,'utf8');
	}
      
    });
}

// Execute this when web server is terminated
process.on('SIGINT', function () { //on ctrl+c
  led26.pwmWrite(0); // Turn LED off
  process.exit(); //exit completely
}); 


io.sockets.on('connection', function (socket) {// WebSocket Connection
    socket.emit('GPIO26', GPIO26value);
    socket.on('GPIO26', function(data) { 
	GPIO26value = data;
	led26.pwmWrite(GPIO26value)
	console.log(GPIO26value)
    });
    
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
	console.log('A user disconnected');
    });
});

