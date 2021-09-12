require('http')
  .createServer(require('./src/server.js'))
  .listen(2000);