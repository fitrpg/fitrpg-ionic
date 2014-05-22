"use strict";

var bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    middle        = require('./middleware'),
    mongoose      = require('mongoose'),
    morgan        = require('morgan'),
    methodOverride= require('method-override'),
    OAuth         = require('oauth').OAuth,
    passport      = require('passport');



mongoose.connect(process.env.DB_URL || 'mongodb://localhost/myApp');
/*
 * Include all your global env variables here.
*/
module.exports = exports = function (app, express, routers) {
  app.set('port', process.env.PORT || 9000);
  app.set('base url', process.env.URL || 'http://localhost');
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(middle.cors);
  app.use('/note' , routers.NoteRouter);
  app.use(middle.logError);
  app.use(middle.handleError);
  app.use(methodOverride());
  /* 
   * passport.initialize() middleware is required to initialize Passport. 
   * Because this application uses persistent login sessions, passport.session() 
   * middleware must also be used. If enabling session support, express.session()
   * must be used BEFORE passport.session() to ensure that the login is 
   * restored in the correct order.
   */
  app.use(session({secret: 'amiraconormatt', maxAge: 360*5}));
  app.use(passport.initialize());
  app.use(passport.session());
};
