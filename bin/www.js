#!/usr/bin/env node
"use strict";

//module dependencies
var server = require("../out/server");
var debug = require("debug")("express:server");
var http = require("http");
console.log('server =======', server);
//create http server
var httpPort = normalizePort(process.env.PORT || 3004);
var test = server.bootstrap().app;
console.log('TEST : ', test);
var app = server.bootstrap().app // server.Server.bootstrap().app;
app.set("port", httpPort);
var httpServer = http.createServer(app);

//listen on provided ports
httpServer.listen(httpPort);

//add error handler
httpServer.on("error", onError);

//start listening on port
httpServer.on("listening", onListening);


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = httpServer.address();
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    debug("Listening on " + bind);
}