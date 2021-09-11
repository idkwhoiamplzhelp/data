const fs = require('fs'),
    logger = require('morgan');
const {
    resolve
} = require('path')
const Datastore = require('nedb'),
    express = require('express'),
    app = express(),
    db = new Datastore({
        filename: resolve(__dirname, "../db/db")
    }),
    port = process.env.PORT || 3030;

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



// index page
// GET - /
app.get("/", (req, res) => {
    res.sendFile(resolve(__dirname,'../public/index.html'))
})

// Show all my submissions
// GET - /logs
app.get("/logs", (req, res) => {
    res.sendFile(resolve(__dirname,'../public/logs/index.html'))
})

// Map for data visualization
// GET - /map
app.get('/map', (req, res) => {
    res.sendFile(resolve(__dirname,'../public/map/index.html'))
})

app.get('/isthispersonusingbasic', (req,res)=>{
    var {
        authorization
    } = req.headers;
    
})

// Show all my submissions
// our API
// GET - /api
app.get("/api", (req, res) => {
    db.find({}, function(err, docs) {
        if (err) {
            return err;
        }
        res.json(docs);
    });
});

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