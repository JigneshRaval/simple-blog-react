const bodyParser = require('body-parser');

//import * as express from "express";

const express = require('express');
const path = require('path');
/**
 * The server.
 *
 * @class Server
 */
class Server {

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    static bootstrap() {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //add routes
        this.routes();

        //add api
        this.api();
    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    api() {
        //empty for now
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    config() {
        //add static paths
        this.app.use(express.static(path.join(__dirname, "public")));

        //configure pug
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");

        //use logger middleware
        // this.app.use(logger("dev"));

        //use json form parser middleware
        this.app.use(bodyParser.json());

        //use query string parser middleware
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        //use cookie parser middleware
        // this.app.use(cookieParser("SECRET_GOES_HERE"));

        //use override middleware
        // this.app.use(methodOverride());

        //catch 404 and forward to error handler
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });

        //error handling
        // this.app.use(errorHandler());
    }

    /**
     * Create router
     *
     * @class Server
     * @method api
     */
    routes() {
        //empty for now
    }
}
module.exports = Server;
