'use strict';

var cookieParser = require('cookie-parser');
var express      = require('express');
var request      = require('request');

var app          = express();
var NoteRouter   = express.Router();
var UserRouter   = express.Router();
var SoloRouter   = express.Router();
var GroupRouter  = express.Router();
var routers      = {};

routers.NoteRouter  = NoteRouter;
routers.UserRouter  = UserRouter;
routers.SoloRouter  = SoloRouter;
routers.GroupRouter = GroupRouter;


require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);
require('../user/user_routes.js')(UserRouter);
require('../solo/solo_routes.js')(SoloRouter);
require('../group/group_routes.js')(GroupRouter);


module.exports = exports = app;
