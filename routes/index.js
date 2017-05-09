'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Topic = require('../models/APImodels'); //added to reference API
const mid = require('../middleware');
const request = require("request");
const port = process.env.PORT || 3000;
const  http = require('http');
const https = require('https');
var multer = require('multer');

// for image upload
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/user-profiles');
  },
  filename: function (req, file, callback) {
    var fileusername = "none";
    console.log(typeof req.session.userId);
    var username = User.findById(req.session.userId).exec(function(error, user){
      
      fileusername = user.username;
      // user.username.profileImage = `${file.fieldname}-${req.session.userId.substring(0, 5)}-${fileusername}`
      
      var filename = file.fieldname + "-" + req.session.userId.substring(0, 5) + "-" + fileusername;
      var pathAndFilename = `/images/user-profiles/${filename}`

      //upload the new image with unique filename
      callback(null, filename);
      
      User.findOne({ _id: req.session.userId }, function (err, user){
        if (err) throw err;
        console.log(user);
        user.profileImage = pathAndFilename;
        user.save();
      });
    });
  }
});

const upload = multer({ storage : storage }).single('userPhoto');


// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return res.render('displayError', {title: "Whoops!", errorMessage: error.status});
          // return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.username, favoriteChar: user.favoriteCharacter, profileImage: user.profileImage});
        }
      });
});

// GET /logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
});

// GET /form -- JUST FOR FORM EXPERIMENTATION
router.get('/form', mid.loggedOut, function(req, res, next) {
    return res.render('textareaexp', {title: 'Fuckin \'round'});
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
    return res.render('login', {title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next) {
    // return res.send(`${req.body.username} and ${req.body.password}`);
    if ( req.body.username && req.body.password ) {
      
      //authetnicates user via users.js file
      User.authenticate(req.body.username, req.body.password, function(error, user){
        if (error || !user ) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id; //add user._id property to session.userId will create everything for the session
          return res.redirect('/profile');
        }
      });
    } else {
      var err = new Error("Username and password are required");
      err.status = 401;
      return next(err);
    }
});


// GET /register
router.get('/register', mid.loggedOut, function(req, res, next){
  return res.render('register', { title: 'Register' });
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.email && //checks to make sure all the form data is being sent
      req.body.name &&
      req.body.favoriteCharacter &&
      req.body.username &&
      req.body.password &&
      req.body.confirmPassword) {
        
        //check to make sure that the password contains one alpha, one num, one special
        //"^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$"
        
        
        //confirm that user typed same password twice
        if( req.body.password !== req.body.confirmPassword) {
          var err = new Error("Passwords do not match");
          err.status = 400;
          return next(err);
        }
        
        //create object with form input
        var userData = {
          username: req.body.username,
          email: req.body.email,
          name: req.body.name,
          favoriteCharacter: req.body.favoriteCharacter,
          password: req.body.password
        }
        
        // use schema's 'create' method to insert document into Mongo
        User.create(userData, function(error, user){
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
          }
        });
        
        
        
      } else {
        //in case of missing field.
        var err = new Error('All fields required.');
        err.status = 400; //error for malformed syntax and other Bad Requests.
        return next(err);
      }

  
});


// GET /
router.get('/', function(req, res, next) {
  // if (req.session) {console.log(req.session)} else {console.log("No req.session.userId")};
  
  if (!req.session.userId) {
      var loggedIn = false;
      return res.render('index', { title: 'Home', loggedIn: loggedIn });
   } else {
     
   User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('index', { title: 'Home', name: user.username, favoriteChar: user.favoriteCharacter, profileImage: user.profileImage });
        }
      });
   }
   
});


// GET /about
router.get('/about', function(req, res, next) {
  if (!req.session.userId) {
      var loggedIn = false;
      return res.render('about', { title: 'Fan Art', loggedIn: loggedIn });
   } else {
     
   User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          
          return res.render('about', { title: 'Fan Art', name: user.username, favoriteChar: user.favoriteCharacter, loggedIn: loggedIn, profileImage: user.profileImage });
        }
      });
   }
});

// GET /contact /questions /topics ????
router.get('/contact', function(req, res, next) {
  if (!req.session.userId) {
      var loggedIn = false;
      return res.render('contact', { title: 'Discussion Boards', loggedIn: loggedIn });
   } else {
     
   User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          
          return res.render('contact', { title: 'Discussion Boards', name: user.username, favoriteChar: user.favoriteCharacter, loggedIn: loggedIn, profileImage: user.profileImage });
        }
      });
   }
});


//GET /rivendell where eventually a long list of discussion topics will be shown.
router.get('/rivendell', function(req, res, next) {
   if (!req.session.userId) {
      return res.redirect('/login');
   } else {
     
   User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          
          return res.render('rivendell-topics', { title: 'Rivendell', name: user.username, favoriteChar: user.favoriteCharacter,profileImage: user.profileImage });
        }
      });
   }
});

//input limit, then put that into Rivendell:

//seeking to get route for topics/:topicID
router.get('/rivendell/:topicID', function(req, res, next) {
  // if (req.session) {console.log(req.session)} else {console.log("No req.session.userId")};
        ///////
  
        if (!req.session.userId) {
            var loggedIn = false;
            return res.render('login', { title: 'Login' });
         } else {
            // console.log(req.params.topicID);
            
            
            User.findById(req.session.userId)
                .exec(function (error, user) {
                  if (error) {
                    return res.render('displayError', {title: "Whoops!", errorMessage: error.status});
                    // return next(error);
                  } else {
                    // return res.render('profile', { title: 'Profile', name: user.username, favoriteChar: user.favoriteCharacter });
                  }
                
                    //callback hell: why? first picks up the current user from the db, then the topic in question, passing in some params so that Angular can use it in a bit?
                
                    Topic.findById(req.params.topicID)
                      .exec(function (error, topicx) {
                        if (error) {
                          return next(error);
                        } else {
                          // req.thisTopic = req.params.topicID
                          return res.render('singleTopic', { title: topicx.title, text: topicx.text, id: topicx._id, name: user.username,  profileImage: user.profileImage});
                        }
                      });
                  
            });
         }
   
});//end get

//post route for uploading new profile images
router.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        console.log("file uploaded");
        return res.redirect('/profile');
    });
});


module.exports = router;