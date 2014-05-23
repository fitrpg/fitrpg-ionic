'use strict';

var cookieParser = require('cookie-parser');
var express      = require('express');
var request      = require('request');

var app          = express();
var NoteRouter   = express.Router();
var UserRouter   = express.Router();
var SoloRouter   = express.Router();
var routers      = {};

routers.NoteRouter = NoteRouter;
routers.UserRouter = UserRouter;
routers.SoloRouter = SoloRouter;


require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);
require('../user/user_routes.js')(UserRouter);
require('../solo/solo_routes.js')(SoloRouter);


module.exports = exports = app;
