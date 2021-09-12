var fs = require('fs');

var data = fs.readFileSync('./db/db', 'utf-8');

data.replace('loaction', 'location')

fs.appendFileSync('./index.txt', data)