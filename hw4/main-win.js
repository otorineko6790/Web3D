var shelljs = require('shelljs');
var express = require('express');
var app = express();

var server = app.listen (1337, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log ('server started on http://' + host + ':' + port);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/hw4.html');
});

app.get ('/api', function (req, res) {
	var x1 = req.query.x1;
	var y1 = req.query.y1;
	var x2 = req.query.x2;
	var y2 = req.query.y2;
	var cx = req.query.cx;
	var cy = req.query.cy;
	var rr = req.query.rr;
		
	shelljs.exec('GraphicsGems.exe ' + x1 + ' ' + y1 + ' ' + x2  + ' ' + y2 + ' ' + cx + ' ' + cy + ' ' + rr, function(status, output) {
	  console.log('Exit status:', status);
	  console.log('Program output:', output);

      var output = {
        status: status,
        output: output
      };

	  res.writeHead(200, {
		  "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
	  });
	
	  res.write( JSON.stringify(output) );
	  // return output;
	  res.end();   
	 	
	});
});
