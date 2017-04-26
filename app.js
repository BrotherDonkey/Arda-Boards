'use strict'

var express = require("express");
var bodyParser = require("body-parser");
// var jsonParser = require("body-parser").json; //subset of bodyParser
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session); //pass session as argument, allows middleware to access session
var app = express();
var routes = require("./routes/index"); //include routes file
var apiRouter = require("./routes/apiRouter"); //include routes for API
var logger = require("morgan");

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// mongodb connection
mongoose.connect("mongodb://" + process.env.IP + ":27017/arda");
var db = mongoose.connection;

//mongo error

db.on('error', console.error.bind(console, "connection error:"));

// use sessions for tracking logins
app.use(session({
  secret: 'gandalf loves you', //string used to sign the session id cookie
  resave: true, //forces to be resave in sessions store
  saveUninitialized: false,  // forces new and not yet modified session in store if true
  store: new MongoStore({
    mongooseConnection: db
  })
}));
//once you create a session you can access it in the request object of any route

//Morgan gives color status codes for Routes and Responses.
app.use(logger("dev"));

//CORS - setting up API to be used publicly from web browser.
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     if (req.method === "OPTIONS") {
//       res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
//       return res.status(200).json({});
//     }
//     next();
// });


//TEST
//topics API route,
app.use("/api-topics", apiRouter);

// //simple test middleware for API, note: the colon below is only to add something to the req.params.WHATEVER object
// app.use("/hello/:id", function(req, res, next){
//   console.log("The id is: "+ req.params.id);
//   next();
// });

//make userID availabe in templates
app.use(function(req, res, next){
  res.locals.currentUser = req.session.userId;
  next();
});




// //check if json available from the req.body property.
// app.use(function(req, res, next) {
//     if (req.body){
//       console.log("The sky is", req.body.color);
//     } else {
//       console.log("There is no body property on the request.")
//     }
//     next();
// });

// //make json available from the req.body property.
// app.use(function(req, res, next) {
//     req.body;
//     next();
// });

// serve static files from /public
app.use(express.static(__dirname + "/public"));

// view engine setup
app.set("view engine", "pug");
app.set("views", __dirname + "/views");



// include routes
app.use('/', routes);

//include static files within the public folder:
app.use(express.static('public'));

// catch 404 and forward to error handler (MW)
app.use(function(req, res, next) {
  var err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// Error Handler
// same as setting up custom middleware, except error handlers have 4 paramaters.
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  // normal way trying both
  // res.render("error", {
  //   message: err.message,
  //   error: {}
  // });
  
  // json error handler for api -- come back here if API errors aren't working properly.
  res.json({
    error: {
      message: err.message
    }
  });
});

var port = process.env.PORT || 3000;
// listen on port 3000
app.listen(port, function () {
  console.log("Express app listening on " + port + ".");
});
