var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');

var homeController =  require("./controllers/home");
var authController =  require("./controllers/authentication");
var profileController =  require("./controllers/profile");

/* connect to database (MongoDB) */ 
// mongoose.connect('mongodb://localhost:27017/admission-clearance', {useNewUrlParser: true});
// mongoose.connect('mongodb://Ojay:Radiant1@localhost:27017/admission-clearance');
mongoose.connect('mongodb://localhost:27017/admission-clearance');

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));  // making ./public as the static directory
app.set("views", __dirname + "/views");  // making ./views as the views directory
app.use(bodyParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  // store: new MongoStore({
  //   mongooseConnection: db
  // })
}));

// fire up controllers 
homeController(app);
authController(app);
profileController(app);

app.use(function(req, res, next){
    res.status(404).render('page-404')
});


// app.get("/", function(req, res) {
// 	res.send("this is the home page");
// });

// app.listen(4000); 

// console.log("Now listening to port: 4000");