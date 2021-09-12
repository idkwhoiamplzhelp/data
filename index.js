var appdist = require('./server.js'),
http = require('http'),
    apperror = require('./error');

    http.createServer(appdist).listen(2000);