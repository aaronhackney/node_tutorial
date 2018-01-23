var ObjectID = require('mongodb').ObjectID; // import ObjectID function from the MongoDB package.

CollectionDriver = function(db) {           // class constructor
    this.db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {   // helper function getCollection()
    this.db.collection(collectionName, function(error, the_collection) {          // You define class methods by adding functions to prototype
        if( error ) callback(error);
    else callback(null, the_collection);
  });
};

CollectionDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) {    // findall() gets the this.getCollection(collectionName)
      if( error ) callback(error);                                          // Throw an error if database connection issue
      else {
        the_collection.find().toArray(function(error, results) {            // calls mongo.find() on collection & returns data cursor to iterate
          if( error ) callback(error);
          else callback(null, results);                                     // return all found documents in collection as an array
        });
      }
    });
};

CollectionDriver.prototype.get = function(collectionName, id, callback) {
    this.getCollection(collectionName, function(error, the_collection) {              // obtains a single item from a collection by its _id
        if (error) callback(error);
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");                  // regex check to make sure _id is a valid hex string (BSON format)
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});         // selector {'_id':ObjectID(id)} matches the _id field exactly against the supplied id.
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) {   //takes a string and turns it into a BSON ObjectID
                if (error) callback(error);
                else callback(null, doc);
            });
        }
    });
};

//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, function(error, the_collection) {        //  retrieves the collection object
        if( error ) callback(error)
        else {
            obj.created_at = new Date();                                        // adds a field to record - the date it was created
            the_collection.insert(obj, function() {                             // insert the modified object into  collection - automatically adds _id to the object
                callback(null, obj);
            });
        }
    });
};

CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            obj._id = ObjectID(entityId); // convert to a real obj id
            obj.updated_at = new Date();
            the_collection.save(obj, function(error,doc) {  // takes an object and updates it in the collection using collectionDriver‘s save() method
                if (error) callback(error);
                else callback(null, obj);
            });
        }
    });
};

CollectionDriver.prototype.remove = function(collectionName, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error);
        else {
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
                if (error) callback(error);
                else callback(null, doc);
            });
        }
    });
};

exports.CollectionDriver = CollectionDriver; //declares the exposed, or exported, entities to other applications

