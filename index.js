'use strict';
const JSMiddleware = require('./lib/Server');
//const JSMiddleware = require('./lib/Api');
//JSMiddleware.registryServer = require('./lib/Server');
//JSMiddleware.middleware = require('./lib/Middleware')
module.exports = JSMiddleware;
  /** It is also possible to start the Server and the Middleware in this way - This feature was disabled
   api.registryServer.start({ port: 2020});
   api.middleware.start({ host: '127.0.0.1', port: 2020});
  */
