// Require the http module
var http = require('http');
var fs = require('fs');
var PORT = 8080;
var qs = require('querystring');
var url = require('url');

// Creating a server
var server = http.createServer(function(request, response) {

  // Data Buffer
  var dataBuffer = '';
  request.on('data', function(data) {
    dataBuffer += data;
  });

  // Parse url
  request.on('end', function() {
    var body = 'banana';
    var browserUrl = url.parse(request.url);
    var data = qs.parse( dataBuffer.toString() );

  // =================== GET ==============================
    if (request.method === 'GET') {
      if (request.url === '/') {
        return fs.readFile('public/index.html', function(err, data) {
          if (err) throw err; {
            // Print the data to page
            return response.end(data);
          }
        });
      }

      // If request matches exisiting url, then read, else 404
      if ( request.url == '/' + elementName + '.html') {
        fs.readFile(('./public/' + elementName + '.html'), function(err, data) {
          if (err) {
            return error404(request, response);
          }
          return response.end(data.toString());
        });
      }
    } // End of get method
  });

  // =================== POST ==============================
  //if uri is /elements create a page

  if (request.uri === '/elements') {

    if (request.method === 'POST') {
      // data is in the body instead of url

      // Data Buffer
      dataBuffer = '';
      request.on('data', function(data) {
        dataBuffer += data;
      });

      // End and write file!
      request.on('end', function() {
        // Need to parse the url
        data = qs.parse( dataBuffer.toString() );
        // if its a newurl .. we need to parse the url

        // Create a new file
        // if file doesnt exist then write!  inside the write, write to head successful else, 404
      }

     );

      // Server request body
      // This goes somewhere in the post
      // response.writeHead(200, {
      //   'Content-Type' : 'application/json',
      //   'Content-Body' : { 'success' : true }
      // });
    }

  }

  // =================== FUNCTIONS ===============================
  /*  Variables - Expected to be given
  elementName = the Titlecased name of the element to be saved, for example "Boron"
  elementSymbol = the element Symbol, for example: "B"
  elementAtomicNumber = the element's atomic number, for example: 5
  elementDescription =  a short description
  */

  // Error Page
  function error404 (request, response) {
    fs.readFile('./public/404.html', function(err, data) {
        response.end(data.toString());
      });
  }

  // Write New File
  function writeFile (request, response) {
    fs.writeFile('./public/' + data.elementName + '.html', elementDescription, function(err) {
    if (err) throw new Error('Could not write to ' + data.elementName + '.html');
  });
    writeNewFileContents();
  }

  // Writes contents of new file
  function writeNewFileContents (data) {
    return '<!DOCTYPE html>\ <html lang=\'en\'>\ <head>\ <meta charset="UTF-8">\ <title>The Elements - ' + data.elementName + '</title>\ <link rel="stylesheet" href="/css/styles.css">\ </head>\ <body> <h1>' + data.elementName + ' </h1>\ <h2>' + data.elementSymbol + '</h2> <h3>' + data.elementAtomicNumber + '</h3>\ <p>' + data.elementDescription + '</p>\ <p><a href="/">back</a></p>\ </body>\ </html>';
  }

  //Auto Update the Index / Add link to Index.html
  // ????????? How to insert it to index.html? <script> ???? </script>
  function addLinkToIndex () {
    return '<li><a href="' + data.elementName + '.html">' + data.elementName + '</a></li>';
  }

});

console.log('THIS IS SERVERRRRR!\n', server);





//Server listens for the port
server.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log('Server listening on: http://localhost:%s', PORT);
});
