'use strict';

var cookieParser = require('cookie-parser');
var express      = require('express');
var request      = require('request');

var app          = express();
var NoteRouter   = express.Router();
var UserRouter   = express.Router();
var SoloRouter   = express.Router();
var GroupRouter  = express.Router();
var ItemRouter   = express.Router();
var BattleRouter = express.Router();
var routers      = {};

routers.NoteRouter  = NoteRouter;
routers.UserRouter  = UserRouter;
routers.SoloRouter  = SoloRouter;
routers.GroupRouter = GroupRouter;
routers.ItemRouter  = ItemRouter;
routers.BattleRouter  = BattleRouter;


require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);
require('../user/user_routes.js')(UserRouter);
require('../solo/solo_routes.js')(SoloRouter);
require('../group/group_routes.js')(GroupRouter);
require('../item/item_routes.js')(ItemRouter);
require('../battle/battle_routes.js')(BattleRouter);


module.exports = exports = app;
