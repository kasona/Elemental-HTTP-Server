// Require the http module
var http = require('http');
var fs = require('fs');
var PORT = 8080;
var qs = require('querystring');
var url = require('url');

// Creating a server
var server = http.createServer(function(request, response) {
  var body = 'it works, banana and strawberry';
  var dataBuffer = '';

  request.on('data', function(data) {
    dataBuffer += data;
  });

  request.on('end', function() {
    var browserUrl = url.parse(request.url);
    var data = qs.parse( dataBuffer.toString() );

    //Get request
    fs.readFile('./public' + browserUrl.path, function(err, data) {
      if (err) {
        // go to 404 ERRRRR
        fs.readFile('./public/404.html');
      }
      response.end(data.toString());
    });
  });

});

console.log('THIS IS SERVER!\n', server);





//Server listens for the port
server.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log('Server listening on: http://localhost:%s', PORT);
});
