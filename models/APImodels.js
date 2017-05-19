'use strict';

var mongoose = require("mongoose");

//store Schema contructor as a local variable
var Schema = mongoose.Schema;


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
    authorImg: {type: String, default: "/images/user-profiles/avatar.png"},
    voted: {type: Array, default: []}
});

//instance method, way to make number1:
// CommentSchema.methods.update = function(updates, callback) {};
//instance method, way to make number2 (functionally the same as above:
CommentSchema.method("update", function(updates, callback){
    // Object.assign
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
})//this will be the key to up and downvoting

CommentSchema.method("vote", function(vote, callback){
    if (vote === "up") {
        this.votes += 1;
    } else {
        this.votes -= 1;
    }
    this.parent().save(callback);
});


var TopicSchema = new Schema({
    title: {type: String, default: "title-less serf topic"},
    text: {type: String, default: "string not saved"},
    createdAt: {type: Date, default: Date.now },
    comments: [CommentSchema], //place Comment Schema as the only element in this array, as a signal to Mongo that they're related.
    author: {type: String, default: "anonymous"},
    authorImg: {type: String, default: "/images/user-profiles/avatar.png"}
});

//order comments when Topic is saved.
TopicSchema.pre("save", function(next){
    this.comments.sort(sortComments); // [object Object]
    next();
});

TopicSchema.method("update", function(updates, callback){
    // Object.assign
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
})//this will be the key to editing comment



// TopicSchema.pre("save", function(next){this.dataKey.something()}); this is a basic pre save hook


var Topic = mongoose.model("Topic", TopicSchema);

// var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Topic;
// module.exports = mongoose.model('Topic', TopicSchema);
//import

