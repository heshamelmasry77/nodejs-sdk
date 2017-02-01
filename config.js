
/**
 * Module dependencies.
 */
var express = require('express'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  path = require('path');

module.exports = function() {
  var app = express();

  // all environments
  app.set('port', process.env.PORT || 5000);
  app.use(logger('dev'));
  app.use(bodyParser());
  app.use(methodOverride());

  app.use(errorHandler());

  return app;
}();
