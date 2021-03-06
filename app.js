var express = require('express');
var cors = require('cors');
var swaggerTools = require('swagger-tools');
var errorhandler = require('errorhandler');

var nconf = require('./nconf');
var swaggerObject = require('./api/swagger');
var security = require('./utils/security');
var param = require('./utils/param');

swaggerTools.initializeMiddleware(swaggerObject, function(middleware) {

  var securityOptions = {
    tokenName: nconf.get('security:tokenName'),
    id: nconf.get('feature:id'),
    secret: nconf.get('feature:secret')
  };

  var routerOptions = {
    controllers: __dirname + '/' + nconf.get('swagger:controllers')
  };

  var corsOptions = {
    exposedHeaders: ['X-Total-Count']
  };

  var app = express();
  app.use(cors(corsOptions));
  app.use(middleware.swaggerUi());

  app.use(security(securityOptions));
  app.use(param());

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerRouter(routerOptions));

  app.use(errorhandler());

  app.listen(nconf.get('port'), function() {
    console.log('start up');
  });

});
