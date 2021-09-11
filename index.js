var appdist = require('./dist'),
http = require('http'),
    apperror = require('./error');

    http.createServer(appdist).listen(2000);