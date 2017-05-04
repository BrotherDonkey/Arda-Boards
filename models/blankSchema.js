'use strict';


//just a generic Mongo / Mongoose Schema that can be modified later.

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

//example Scheme definition
var varName = new Schema({
   name: {type: String, default: "Default new name"},
   bool: {type: Boolean, default: false},
   createdOn: {type: Date, default: Date.now },
   updatedOn: { type: Date, default: Date.now },
   number: { type: Number, min: 0, max: 100},
   subDocs: [NameOfAnotherSchemaInThisFile],
   arrayOfObjectId: [Schema.Types.ObjectId],
   nested: {
       name: {type: String, lowercase: true, trim: true}
   },
   identification: ObjectId
});

//example pre-save hook
varName.pre("save", function(){
    //code to be executed just previous to saving
});

//just an example of a referencial document, which would appear within the "varName" docment above
var NameOfAnotherSchemaInThisFile = new mongoose.Schema({
    name: {type: String, default: "Some name"}
}); 


//make a model out of the previous schema
var schemaToExport = mongoose.model("schemaToExport", varName);

//export it, just in case you're using advanced configs
//the "schemaToExport" should be available wherever Mongoose is required, because it's a singleton.
module.exports = schemaToExport;