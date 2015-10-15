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
    var requestBody = qs.parse( dataBuffer.toString() );

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
      if ( request.url == '/' + requestBody.elementName + '.html') {
        fs.readFile(('./public' + requestBody.elementName + '.html'), function(err, data) {
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
        console.log(requestBody.elementName);
        exists(request, response, requestBody);
        return response.end('END');
      }
    }
  });

});

// ==================== PUT ===================================

if (request.method === 'PUT') {
  fs.writeFile('./public/' + data.elementName + '.html', function(err) {
    failUpdate(data);
  });
  return successUpdate(data);
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

// Check if file exists
function exists(request, response, data) {
  fs.exists('./public' + request.url, function(exists) {
    if (exists) {
      fs.readFile('./public' + data.element, function(err, data) {
        return response.end(data.toString());
      });

    } else {

      // Write, Add Content, Add to Index
      writeFile(data);
      // Need to render
      addLinkToIndex(data);

      // Write to the head, successful
      response.writeHead(200, {
        'Content-Type' : 'application/json',
        'Content-Body' : { 'success' : true }
      });
    }
  });
}

// ================= Render for index.html =======================
  // fill in elements with current elements found in public folder
  fs.readdir('./public', function(err, files) {
    if (err) throw new Error('./public dir does not exist or is not readable' + err.message);

    // only want html element files
    elements = files.filter(function(file) {
      return file.indexOf('.html') > 1 &&
        file !== '404.html' &&
        file !== 'index.html';
    }).map(function(elementFileName) {
      return elementFileName.substr(0, elementFileName.indexOf('.html'));
    }).map(function(lowerCasedElementName) {
      return lowerCasedElementName.substr(0, 1).toUpperCase() + lowerCasedElementName.substr(1);
    });

    //elements array is initialized
    //write our rendered index.html
    writeIndex();
  });

  // to update the index
function writeIndex() {
    //get template
    fs.readFile('template.html', function(err, template) {
      if (err) throw new Error('template.html does not exist or is not readable.  This file is required by application.', err.message);

      // render list of links for each element
      // into the template {{ listOfElements}}
      var renderedList = elements.map(function(element) {
        return ' <li>' +
                  '<a href="{{ filePatn }}">' +
                    '{{ elementName }} ' +
                  '</a>' +
                '</li>'.replace('{{ filePatn }}', element.toLowerCase() + ".html")
                .replace("{{ elementName }} ", element);
      });
      var rendered = template.toString().replace("{{ listOfElements }}", renderedList.join('\n'));

      // update the index.html
      fs.writeFile('./public/index.html', rendered, function(err) {
        if (err) throw new Error("./public/index.html is not writeable and is required by this application", err.message);

      });
    });
  }

// ==========================================
// Write New File
function writeFile (data) {
  // writeFile( arguments )
  fs.writeFile('./public/' + data.elementName + '.html',  writeNewFileContents(data), function(err, data) {
    if (err) throw new Error('Could not write to ' + data.elementName + '.html');
  });
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
function failUpdate (data) {
  response.writeHead(500, {
    'Content-Type' : 'application/json',
    'Content-Body' : { 'error' : 'resource' + data.elementName + 'does not exist' }
  });
}

// If requested update successfully
function successUpdate () {
  response.writeHead(200, {
    'Content-Type' : 'application/json',
    'Content-Body' : { 'success' : true }
  });
}

// ============ DELETE functions ===============
if (request.method === 'DELETE') {
  fs.unlink('/public/' + request.url, function (err) {
    if (err) throw err;
    console.log('successfulyy deleted', request.url);
  });
}

//Server listens for the port
server.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log('Server listening on: http://localhost:%s', PORT);
});