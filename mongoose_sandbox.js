'use strict';

//note this is done in app.js

var mongoose = require("mongoose");

mongoose.connect("mongodb://" + process.env.IP + ":27017/sandbox");

var db = mongoose.connection;
// listen for errors handle them in a specific way via this anonymous function
db.on("error", function(err){
    console.error("connection error:", err);
});

//once only first one time, unlike .on
db.once("open", function(){
    console.log("db connection successful");
    //All database communciation goes here.
    
    var Schema = mongoose.Schema;
    var AnimalSchema = new Schema({
        //describe data here:
        type: {type: String, default: "goldfish"},
        color: {type: String, default: "gold"},
        mass: {type: Number, default: 0.007 },
        name: {type: String, default: "Angela"}
    });
    
    AnimalSchema.pre("save", function(next){
        if (this.mass >= 100) {
            this.size = "big";
        } else if (this.mass >= 5 && this.mass < 100) {
            this.size = "medium";
        } else {
            this.size = "small";
        }
        next();
    });
    
    AnimalSchema.statics.findSmall = function(callback){
        // this will === animal
        return this.find({size: "small"}, callback);
    };
    
    var Animal = mongoose.model("Animal", AnimalSchema);
    
    var elephant = new Animal({
        type: "elephant",
        color: "grey",
        mass: 6000,
        name: "Lawrence"
    });
    
    var whale = new Animal({
       type: "whale",
       mass: 19050,
       name: "Fig"
    });
    
    var animal = new Animal({}); //Goldfish
    var animalData = [
        {
            type: "moues",
            color: "grey",
            mass: 0.035,
            name: "Marvin"
        }, {
            type: "nutria",
            color: "brown",
            mass: 6.35,
            name: "Gretchen"
        }, {
            type: "wolf",
            color: "grey",
            mass: 45,
            name: "Iris"
        },
        elephant,
        animal,
        whale
        ];
    
    Animal.remove({}, function(){
            Animal.create(animalData, function(err, animals){
                            if (err) console.log("Save failed.", err);
                            
                            Animal.findSmall({}, function(err, animals){ //search for big animals.s
                                if (err) console.log("Search failed.", err);
                                animals.forEach(function(animal){
                                    console.log(animal.name + " the " + animal.color + " " + animal.type+ " is a " + animal.size + "-size animal.");
                                });
                            
                            db.close(function(){
                                console.log("db connection closed");    
                            }); //find lets you search stuff takes an object that you want to match to your results
                            
                }); //close connection when we're done
            }); //save in asych method, with callback function that has close in it. Otherwise it'll fail.
        });
    //be careful with saves. All these happen asynchronously. 
}); // you can avoid these types of problems by nesting callback functions. But it's not actually a good idea. Promises can also help.

//We have a Pyramid of DOOOOM.



// Complete way of using find method: 
// apiRouter.get("/", function(req, res, next){
//     Topic.find({}, null, {sort: {createdAt: -1}}, function(err, questions){
//         //above parameters are find, limit (null here), sort parameter, callback
        
//         //handle errors
//         if (err) return next(err);
//         res.json(questions); //because we're directly returning javaScript objects, we can drop it into the json function
        
//     });