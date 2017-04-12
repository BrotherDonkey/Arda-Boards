'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
//store Schema contructor as a local variable

// function for sorting comments
var sortComments = function(a, b) {
  if (a.votes === b.votes) {
      return b.updatedAt - a.updatedAt;
  }
  return a.votes - b.votes;
  };

var CommentSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now },
    author: {type: String, default: "anonymous"},
    votes: {type: Number, default: 0 },
});

//instance method, way to make number1:
// CommentSchema.methods.update = function(updates, callback) {};
//instance method, way to make number2 (functionally the same as above:
CommentSchema.method("update", function(updates, callback){
    // Object.assign
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
})


var TopicSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now },
    comments: [CommentSchema], //place Comment Schema as the only element in this array, as a signal to Mongo that they're related.
    author: {type: String, default: "anonymous"}
});

//order comments when Topic is saved.
TopicSchema.pre("save", function(next){
    this.comments.sort(sortComments); // [object Object]
    next();
});


// TopicSchema.pre("save", function(next){this.dataKey.something()}); this is a basic pre save hook


var Topic = mongoose.model("Topic", TopicSchema);

// var Comment = mongoose.model("Comment", CommentSchema);

module.exports.Topic = Topic;

//import

