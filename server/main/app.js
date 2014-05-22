'use strict';

var cookieParser = require('cookie-parser');
var express      = require('express');
var request      = require('request');

var app          = express();
var NoteRouter   = express.Router();
var routers      = {};

routers.NoteRouter  = NoteRouter;


require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);

module.exports = exports = app;
