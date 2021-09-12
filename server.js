const {
  resolve
} = require('path');
const fs = require('fs');
const logger = require('morgan');
const Datastore = require('nedb');
const express = require('express');
const app = express();
var db = new Datastore({
  filename: resolve(__dirname, "./db/db")
});

db.loadDatabase();

app.use(logger("dev"));
app.use(express.json({
  limit: '6mb',
  extended: true
}));
app.use(express.urlencoded({
  limit: '5mb',
  extended: true
}));

var publicc = resolve(__dirname, './public')

// index page
// GET - /
app.get("/", (req, res) => {
  res.sendFile(resolve(publicc,'index.html'))
})

app.get('/vip', (req, res) => {
  var j = req.headers.authorization;

  if (j !== process.env.pass) return  res.status(401).send('401');

  require('./vip')(req, res);

})

app.get('/map/two', (req,res)=>{
  res.sendFile(resolve(publicc, '/map/map.html'))
})

// Show all my submissions
// GET - /logs
app.get("/logs", (req, res) => {
  res.sendFile(resolve(publicc,'/logs/index.html'))
})

// Map for data visualization
// GET - /map
app.get('/map', (req, res) => {
  res.sendFile(resolve(publicc,'/map/index.html'))
})

// Show all my submissions
// our API
// GET - /api
app.get("/api", (req, res) => {
  db.find({}, function(err, docs) {
    if (err) return res.status(400).send(err);
    res.json(docs);
  });
});

app.get("/api/lines", (req, res) => {
  db.find({}, function(err, docs) {
    if (err) {
      return err;
    }
    //for one user who told us to add this
    var length = docs.length + 1;
    res.json({ length: length });
  });
})

// Create a submission
// POST - /api
app.post("/api", (req, res) => {
  const unixTimeCreated = new Date().getTime();

  const newData = Object.assign({
    "created": unixTimeCreated
  }, req.body);

  db.insert(newData, (err, docs) => {
    if (err) {
      return err;
    }
    res.json(docs);
  });
})

app.delete("/api/one", (req, res) => {
  var {
    id
  } = req.query;
  var {
    authorization
  } = req.headers;
  if (!authorization) return res.status(401).json({
    error: 'No credentials sent!'
  });

  authorization = authorization.split(' ')[1]
  if (authorization !== process.env['pass']) return res.status(401).json({
    error: 'auth doesn\'t match'
  })

  db.remove({
    _id: id
  }, {
      multi: true
    }, function(err, numRemoved) {
      if (err) return res.status(400).json({
        error: err
      });
      if (numRemoved == 0)
        return res.status(400).json({
          error: 'id unknow'
        });

      res.send({
        removedn: numRemoved,
        id
      })
    });
})


module.exports = app;