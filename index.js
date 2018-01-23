var http = require('http');
    express = require('express'); 
    path = require('path');
    MongoClient = require('mongodb').MongoClient;
    assert = assert = require('assert');
    Server = require('mongodb').Server;
    CollectionDriver = require('./collectionDriver').CollectionDriver;
    var bodyParser = require('body-parser');

var app = express();
app.set('port', process.env.PORT || 3000);                              // Set the PORT property in app to 3000 or a custom value
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

var collectionDriver;
var url = 'mongodb://localhost:27017';
var dbName = 'myproject';

MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var db = client.db(dbName);
    collectionDriver = new CollectionDriver(db);
});

app.get('/:collection', function(req, res) {                                    // create the /:collection route
    var params = req.params;                                                    // match any first-level path store the requested name in the req.params
    collectionDriver.findAll(req.params.collection, function(error, objs) {     // endpoint to match any URL to a MongoDB collection using findAll of CollectionDriver
        if (error) { res.send(400, error); }
        else {
            if (req.accepts('html')) {                                                  // checks if the request accepts an HTML result in the header
                res.render('data',{objects: objs, collection: req.params.collection});  // stores the rendered HTML from the data.jade template in response
            } else {
                res.set('Content-Type','application/json');                             // sets a machine-parsable JSON header
                res.status(200).send(objs);
            }

        }
    });
});

app.get('/:collection/:entity', function(req, res) {                        // case: collection name and entity _id given
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
        collectionDriver.get(collection, entity, function(error, objs) {    // request the specific entity using the get() collectionDriver‘s method
            if (error) { res.status(400).send(error); }
            //else { res.send(200, objs); } //K
            else { res.status(200).send(objs); } //K
        });
    } else {
        res.status(400).send({error: 'bad url', url: req.url});
    }
});

app.post('/:collection', function(req, res) {                           // new route for a POST
    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {      // inserts the body as an object into the specified collection by calling save()
        if (err) { res.status(400).send(err); }
        else { res.status(201).send(docs); } // res.send(status, body): Use res.status(status).send(body)
    });
});

app.put('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
        collectionDriver.update(collection, req.body, entity, function(error, objs) { //B
            if (error) { res.status(400).send(error); }
            else { res.status(200).send(objs); } //C
        });
    } else {
        var error = { "message" : "Cannot PUT a whole collection" };
        res.status(400).send(error);
    }
});

app.delete('/:collection/:entity', function(req, res) { // delete endpoint doesn’t require a body
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
        collectionDriver.remove(collection, entity, function(error, objs) { //B
            if (error) { res.status(400).send(error); }
            else { res.status(200).send(objs); } //C 200 b/c includes the original doc
        });
    } else {
        var error = { "message" : "Cannot DELETE a whole collection" };
        res.status(400).send(error);
    }
});

app.use(function (req,res) {
    res.render('404', {url:req.url});
});

http.createServer(app).listen(app.get('port'), function(){  // Start the listener on port 3000 on app.port
  console.log('Express server listening on port ' + app.get('port'));
});
