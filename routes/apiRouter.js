'use strict';

var express = require("express");
var apiRouter = express.Router();
var Topic = require("../models/APImodels.js");

//execute a callback wheever tID is present
apiRouter.param("tID", function(req, res, next, id){
    //express allows us to trigger a handler whenever a URL request is present.
    Topic.findById(id, function(err, doc){
        if (err) return next(err);
        if (!doc) {
            err = new Error("Topic not found");
            err.status = 404;
            return next(err);
        }
        req.topic = doc;
        return next();
    });
});

apiRouter.param("cID", function(req, res, next, id){
    //Mongoose has a special .id() function for arrays of subdocuments, paramater is the id passed to the function
    req.comment = req.topic.comments.id(id); //problem?
     if (!req.comment) {
            var err = new Error("Question not found");
            err.status = 404;
            return next(err);
     }
     next();
});

//GET route for /topics //stripping away /topics (since it's mentioned in app.js)
//Route for topic colleciton


apiRouter.get("/", function(req, res, next){
    Topic.find({})
            .sort({createdAt: -1})
            .exec(function(err, topics){
                //handle errors
                if (err) return next(err);
                res.json(topics); //because we're directly returning javaScript objects, we can drop it into the json function
            });
});

//Docs for Building Queries: http://mongoosejs.com/docs/queries.html

//POST /topics
//Route for creating topics
apiRouter.post("/", function(req, res, next){
    var topic = new Topic(req.body);
    topic.save(function(err, topic){
        if (err) return next(err);
        res.status(201);
        res.json(topic);
    });
   //return all topics 
});

//GET route for /topics
//Route for specific topics
apiRouter.get("/:tID", function(req, res, next){
    res.json(req.topic);
    // res.json({
    //   response: "You sent me a POST request for ID: " + req.params.qID,
    // });
});

//POST /topics/:tID/comments
//Route for creating comments
apiRouter.post("/:tID/comments", function(req, res, next){
   req.topic.comments.push(req.body);
   
   req.topic.save(function(err, topic){
        if (err) return next(err);
        res.status(201); //successful save status
        res.json(topic);
    });
   
//   //return all topics 
//   res.json({
//       response: "You sent me a POST request to /topics",
//       topicId: req.params.tID,
//       body: req.body,
//   });
});

//qID === tID && cID === aID
//PUT /topics/:tID/comments/:cID// Edit a specific answer
apiRouter.put("/:tID/comments/:cID", function(req, res, next){ //added NEXT unlike vid
   req.comment.update(req.body, function(err, result){ //added NEXT unlike vid
       if(err) return next(err);
       res.json(result);
       
   }); //updates object contains properties we'd like to update on our existing document
});



//DELETE /topics/:tID/comments/:cID// Edit a specific answer
apiRouter.delete("/:tID/comments/:cID", function(req, res, next){ //added next unlike video
   req.comment.remove(function(err){
    //   if(err) return next(err);
       req.topic.save(function(err, topic){
           if(err) return next(err);
           res.json(topic);
       });
   });
   
//   res.json({
//       response: "You sent me a DELETE request to /topics",
//       topicID: req.params.tID,
//       commentID: req.params.cID
//   });
});


//POST /topics/:tID/comments/:cID/vote-up
//POST /topics/:tID/comments/:cID/vote-down
// Vote on a specific answer
apiRouter.post("/:tID/comments/:cID/vote-:dir", 
    function(req, res, next){
        if (req.params.dir.search(/^up|down$/) === -1) {
            var err = new Error("Not found - wrong up/down vote string.");
            err.status = 404;
            next(err);
        } else {
            req.vote = req.params.dir;
            // console.log("Vote: "+ req.vote);
            next();
        }
    }, 
    
    function(req, res, next){
            console.log("Comment"+req.comment.votes);
            // console.log("Question found!");
            req.comment.votes.save(req.vote, function(err, topic){
                if (err) return next(err);
                res.json(topic);
            });
            
            //problem with voting, look to earlier post requests.
            
    //      res.json({
    //       response: "You sent me a POST request to /vote-" + req.params.dir,
    //       topicID: req.params.tID,
    //       commentID: req.params.cID,
    //       vote: req.params.dir,
    //   });
    });


//hopefully it's just postman, but there may be a problem with these routes getting the req.body object after a request. EFF!


module.exports = apiRouter;