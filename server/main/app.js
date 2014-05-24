'use strict';

var cookieParser = require('cookie-parser');
var express      = require('express');
var request      = require('request');
var passport     = require('passport');

var app          = express();
var NoteRouter   = express.Router();
var UserRouter   = express.Router();
var SoloRouter   = express.Router();
var GroupRouter  = express.Router();
var ItemRouter   = express.Router();
var BattleRouter = express.Router();
var PastGroupRouter = express.Router();
var PastSoloRouter = express.Router();
var routers      = {};

routers.NoteRouter  = NoteRouter;
routers.UserRouter  = UserRouter;
routers.SoloRouter  = SoloRouter;
routers.GroupRouter = GroupRouter;
routers.ItemRouter  = ItemRouter;
routers.BattleRouter  = BattleRouter;
routers.PastGroupRouter  = PastGroupRouter;
routers.PastSoloRouter  = PastSoloRouter;


require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);
require('../user/user_routes.js')(UserRouter);
require('../solo/solo_routes.js')(SoloRouter);
require('../group/group_routes.js')(GroupRouter);
require('../item/item_routes.js')(ItemRouter);
require('../battle/battle_routes.js')(BattleRouter);
require('../pastSolo/past_solo_routes.js')(PastSoloRouter);
require('../pastGroup/past_group_routes.js')(PastGroupRouter);


require('../jawbone/jawbone.js')(app, passport);

require('../jawbone/jawbone.js')(app, passport);

module.exports = exports = app;
