'use strict';

var cookieParser = require('cookie-parser');
var express      = require('express');
var request      = require('request');
var passport     = require('passport');
var app          = express();
var NoteRouter   = express.Router();
var routers      = {};

routers.NoteRouter  = NoteRouter;


require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);

// require fitbit.js in here and it'll run
require('../fitbitauth/fitbit.js')(app,passport);



module.exports = exports = app;


