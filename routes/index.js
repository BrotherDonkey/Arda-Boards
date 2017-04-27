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


// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.username, favoriteChar: user.favoriteCharacter });
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
  return res.render('index', { title: 'Home' });
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
          
          return res.render('about', { title: 'Fan Art', name: user.username, favoriteChar: user.favoriteCharacter, loggedIn: loggedIn });
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
          
          return res.render('contact', { title: 'Discussion Boards', name: user.username, favoriteChar: user.favoriteCharacter, loggedIn: loggedIn });
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
          
          return res.render('rivendell-topics', { title: 'Rivendell', name: user.username, favoriteChar: user.favoriteCharacter });
        }
      });
   }
});


module.exports = router;
