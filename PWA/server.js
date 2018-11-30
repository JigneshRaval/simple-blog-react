var http = require('http');
var fs = require('fs');
var path = require('path');

const port = process.env.PORT || 3000;

console.log("PORTS --> ", process.env.PORT);

http.createServer(function (request, response) {
    console.log('Request ...: ', __dirname + request.url);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
		case '.ts':
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
        case '.wav':
            contentType = 'audio/wav';
            break;
    }
    
    console.log(" Type : ", contentType);
    
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port);

console.log(`Server running at http://localhost:${port}/`);

/*

// server.js
// =====================================

// A simple node server using express.js to serve static files and content

const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

// SET A FOLDER LOCATION FOR ANGULAR APP TO SERVE STATIC JS, CSS, IMAGES OTHER FILES
app.use(express.static(path.join(__dirname + '/dist/app1/')));


// 404 catch
app.get('*', (req, res) => {
	console.log("DIR :", __dirname);
	console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);

	res.status(200).sendFile(path.join(__dirname + '/dist/app1/' + 'index.html'));

});

app.listen(port, function () {
	console.log(`Server is listening at http://localhost:${port}/`);
});
*/