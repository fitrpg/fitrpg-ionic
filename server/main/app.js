'use strict';

var cookieParser = require('cookie-parser');
var express      = require('express');
var request      = require('request');
var passport     = require('passport');

var app          = express();
var NoteRouter   = express.Router();
var UserRouter   = express.Router();
var routers      = {};

routers.NoteRouter  = NoteRouter;
routers.UserRouter  = UserRouter;


require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);
require('../user/user_routes.js')(UserRouter);


require('../jawbone/jawbone.js')(app, passport);

require('../jawbone/jawbone.js')(app, passport);

module.exports = exports = app;
