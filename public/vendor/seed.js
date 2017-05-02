'use strict'

var Topic = require('./models/APImodels.js');

var topicArr = [
    "Hello",
    "World",
    "Another",
    "Thing"
    ];
    
    
topicArr.forEach(function(topic, index){
    Topic.find({"title": topic}, function(err, topics){
        if (!err && !topics.length){
            Topic.create({title: topics, author: "Seed"});
        }
    });
});

//to make this happen, just require this file in App.js after the database
//then it will run whenever it restarts.