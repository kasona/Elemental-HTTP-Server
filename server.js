// Require the http module
var http = require('http');
var fs = require('fs');
var PORT = 8080;
var qs = require('querystring');
var url = require('url');

// Creating a server
var server = http.createServer(function(request, response) {
  console.log('Server Start!');
  // Data Buffer
  var dataBuffer = '';
  request.on('data', function(data) {
    dataBuffer += data;
  });

  // Parse url
  request.on('end', function() {
    var body = 'This is the body';
    var browserUrl = url.parse(request.url);
    var data = qs.parse( dataBuffer.toString() );

    // =================== GET ==============================
    if (request.method === 'GET') {
      console.log(request.url);
      if (request.url === '/') {
        fs.readFile('./public/index.html', function(err, data) {
          if (err) {
            error404(request, response);
            throw err;
          }
          response.end(data.toString());
        });
      }

      // catch all request and end
      else {
        fs.readFile('./public' + request.url, function(err, data) {
          if (err) {
            return error404(request, response);
          }
          response.end(data.toString());
        });
      }

      // If request matches exisiting url, then read, else 404
      if ( request.url == '/' + data.elementName + '.html') {
        fs.readFile(('./public' + data.elementName + '.html'), function(err, data) {
          if (err) {
            return error404(request, response);
          }
          return response.end(data.toString());
        });
      }
    }

    // =================== POST ==============================
    if (request.method === 'POST') {
      if (request.url === '/elements') {
        // data is in the body instead of url
        exists(request, response, data);
        return response.end('END');
      }
    }
  });

});

// =================== FUNCTIONS ===============================
/*  Variables - Expected to be given
elementName = the Titlecased name of the element to be saved, for example "Boron"
elementSymbol = the element Symbol, for example: "B"
elementAtomicNumber = the element's atomic number, for example: 5
elementDescription =  a short description
*/

// =============== GET functions =====================
// Error Page
function error404 (request, response) {
  fs.readFile('./public/404.html', function(err, data) {
    response.end(data.toString());
  });
}

// ================ POST functions  ===================
// Check if file exists
function exists(request, response, data) {
  fs.exists('./public/' + request.url, function(exists) {
    if (exists) {
      fs.readFile('./public/' + data.element, function(err, data) {
        return response.end(data.toString());
      });

    } else {

      // Write, Add Content, Add to Index
      writeFile(data);
      writeNewFileContents(data);
      addLinkToIndex(data);

      // Write to the head, successful
      response.writeHead(200, {
        'Content-Type' : 'application/json',
        'Content-Body' : { 'success' : true }
      });
    }
  });
}

// Write New File
function writeFile (data) {
  fs.writeFile('./public/' + data.elementName + '.html', data.elementDescription, function(err, data) {
    if (err) throw new Error('Could not write to ' + data.elementName + '.html');
  });
  writeNewFileContents(data);
}

// Writes contents of new file
function writeNewFileContents (data) {
  return '<!DOCTYPE html>\ <html lang=\'en\'>\ <head>\ <meta charset="UTF-8">\ <title>The Elements - ' + data.elementName + '</title>\ <link rel="stylesheet" href="/css/styles.css">\ </head>\ <body> <h1>' + data.elementName + ' </h1>\ <h2>' + data.elementSymbol + '</h2> <h3>' + data.elementAtomicNumber + '</h3>\ <p>' + data.elementDescription + '</p>\ <p><a href="/">back</a></p>\ </body>\ </html>';
}

//Auto Update the Index / Add link to Index.html
// ????????? How to insert it to index.html? <script> ???? </script>
function addLinkToIndex (data) {
  return '<li><a href="' + data.elementName + '.html">' + data.elementName + '</a></li>';
}

// ============ PUT functions ==================

// If requested path to update does not exist
// response.writeHead(500, {
//         'Content-Type' : 'application/json',
//         'Content-Body' : { 'error' : 'resource' + elementName + 'does not exist' }
//       });

// // If requested update successfully
// response.writeHead(200, {
//         'Content-Type' : 'application/json',
//         'Content-Body' : { 'success' : true }
//       });


//Server listens for the port
server.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log('Server listening on: http://localhost:%s', PORT);
});