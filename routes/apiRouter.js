'use strict';

var express = require("express");
var apiRouter = express.Router();

//GET route for /topics //stripping away /topics (since it's mentioned in app.js)
//Route for topic colleciton
apiRouter.get("/", function(req, res){
   //return all questions 
   res.json({response: "You sent me a GET request"});
});

//POST /topics
//Route for creating topics
apiRouter.post("/", function(req, res){
   //return all topics 
   res.json({
       response: "You sent me a GET request",
       body: req.body
   });
});

//GET route for /topics
//Route for specific topics
apiRouter.get("/:tID", function(req, res){
    res.json({
       response: "You sent me a POST request for ID: " + req.params.qID,
    });

});

//POST /topics/:tID/comments
//Route for creating comments
apiRouter.post("/:tID/comments", function(req, res){
   //return all topics 
   res.json({
       response: "You sent me a POST request to /topics",
       questionId: req.params.tID,
       body: req.body,
   });
});

//qID === tID && cID === aID
//PUT /topics/:tID/comments/:cID// Edit a specific answer
apiRouter.put("/:tID/comments/:cID", function(req, res){
   res.json({
       response: "You sent me a PUT request to /topics",
       topicID: req.params.tID,
       commentID: req.params.cID,
       body: req.body
   });
});



//DELETE /topics/:tID/comments/:cID// Edit a specific answer
apiRouter.delete("/:tID/comments/:cID", function(req, res){
   res.json({
       response: "You sent me a DELETE request to /topics",
       topicID: req.params.tID,
       commentID: req.params.cID
   });
});


//POST /topics/:tID/comments/:cID/vote-up
//POST /topics/:tID/comments/:cID/vote-down
// Vote on a specific answer
apiRouter.post("/:tID/comments/:cID/vote-:dir", function(req, res, next){
        if (req.params.dir.search(/^up|down$/) === -1) {
            var err = new Error("Not found - wrong up/down vote string.");
            err.status = 404;
            next(err);
        } else {
            next();
        }
    }, function(req, res){
       res.json({
           response: "You sent me a POST request to /vote-" + req.params.dir,
           topicID: req.params.tID,
           commentID: req.params.cID,
           vote: req.params.dir,
       });
    });


//hopefully it's just postman, but there may be a problem with these routes getting the req.body object after a request. EFF!


module.exports = apiRouter;