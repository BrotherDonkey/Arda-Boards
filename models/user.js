var mongoose = require("mongoose");
var bcrypt = require("bcrypt");


var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,   //data type declaration
        unique: true,  //makes sure that no other duplicate email exists in Mongo
        required: true,  //makes form required
        trim: true  //removes any whitespace
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favoriteCharacter: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }

});

//authenticate input against database docs
//.statics object lets you add methods directly to the model, even from other files
UserSchema.statics.authenticate = function(username, password, callback){
    User.findOne({ username: username })
        .exec(function(error, user){ //Mongoose search query
            if (error) {
                return callback(error);
            } else if (!user ){
                var err = new Error("User not found");
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(error, result){
                if (result === true) {
                    return callback(null, user); //null is in place of error, because there is no error here.
                } else {
                    return callback();
                }
            });
        });
};


//Pre-save hook, this is a function that Mongoose runs just previous to saving to Mongo
UserSchema.pre('save', function(next){
   //middleware processes input as it's passed through a chain of commands --
   var user = this; //refers to object created with user information
   
   //include validation here?
   
   bcrypt.hash(user.password, 10, function(err, hash){
       //replace
       if (err) {
           return next(err);
       }
       user.password = hash;
       next();
   });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;


          // username, name, email, favorite book, password, confirm password