const bodyParser = require('body-parser');
const multer = require('multer');
var User =  require("../models/user");
const Profile =  require("../models/profile");

var storage = multer.diskStorage({
 	destination: './uploads/',
  	filename: function (req, file, callback) {
    	callback(null, Date.now()+ '-' + file.originalname  );  
    }
});

var upload = multer({ storage: storage });


// Define port for app to listen on
const port =  process.env.PORT || 8080;

/* ==================================================== */
/* ===== Section 2: Configure express middlewares ===== */
/* ==================================================== */

// const app =  express();
// app.use(bodyParser());  // to use bodyParser (for text/number data transfer between clientg and server)
// app.set('view engine', 'ejs');  // setting hbs as the view engine
// app.use(express.static(__dirname + '/public'));  // making ./public as the static directory
// app.set('views', __dirname + '/views');  // making ./views as the views directory
// // app.use(logger('dev'));  // Creating a logger (using morgan)
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));






module.exports = function(app) {

	// To make the server live
	app.listen(port, () => {
	    console.log(`App is live on port ${port}`);
	});

	/* ==================================== */
	/* ===== Section 3: Making Routes ===== */
	/* ==================================== */

	// GET / route for serving profile.html file
	app.get('/profile', function (req, res, next) {	
  		User.findById(req.session.userId).exec(function (error, user) {
	      	if (error) {
	      		console.log(error);
	      		res.redirect('/login');
	       		return next();
	     	} else {
	        	if (user === null) {
	          		var err = new Error('Not authorized! Go back!');
	          		// err.status = 400;
	          		console.log(err);

	          		res.redirect('/login');

	         		return next();
	        	} else {
		        	Profile.authenticate(req.session.userId, function (error, userId) {
	      				if (error || !userId) {
	      					var email = req.session.userEmail;
	        				return res.render("profile", {email:email, user: 'New Student'});
	      				} else {
	        				return res.redirect("/");
	      				}
      				});
	        	}	
	      	}
    	});
	});

	// POST /upload for file upload
	/* ===== Make sure that file name matches the name attribute in your html ===== */
	app.post('/profile', upload.any(), (req, res, next) => {
		console.log(req.session.userId);

  		if (!req.files) {
	   		console.log("No file received");
	    	return res.send({
      			success: false
    		});

  		} else if (req.body.firstname && 
  			req.body.lastname && 
  			req.body.dept && 
  			req.body.gender && 
  			req.body.date && 
  			req.body.tel && 
  			req.body.address && req.files && req.session.userId) {

  			var profileData = {};

  			if (req.files.length === 4) {
	  			profileData = {
	  				userId: req.session.userId,
					firstname: req.body.firstname,
			    	lastname: req.body.lastname,
			    	department: req.body.dept,
			    	gender: req.body.gender,
					dob: req.body.date,
					phone: req.body.tel,
					address: req.body.address,
					olevel: req.files[0].destination + req.files[0].filename,
					birthCertificate: req.files[1].destination + req.files[1].filename,
					certificateOfOrigin: req.files[2].destination + req.files[2].filename,
					medicalCertificate: req.files[3].destination + req.files[3].filename
		    	}
  			}

  			if (req.files.length === 5) {
	  			profileData = {
	  				userId: req.session.userId,
					firstname: req.body.firstname,
			    	lastname: req.body.lastname,
			    	department: req.body.dept,
			    	gender: req.body.gender,
					dob: req.body.date,
					phone: req.body.tel,
					address: req.body.address,
					olevel: req.files[0].destination + req.files[0].filename,
					olevel2: req.files[1].destination + req.files[1].filename,
					birthCertificate: req.files[2].destination + req.files[2].filename,
					certificateOfOrigin: req.files[3].destination + req.files[3].filename,
					medicalCertificate: req.files[4].destination + req.files[4].filename
			    }
  			}
			

			//use schema.create to insert data into the db
			Profile.create(profileData, function (err, user) {
				if (err) { 
					return next(err)
				} else {

					console.log("Data successfully inserted");
					return res.redirect('/');
			    }
			});

	    	// console.log('file received');
	    	// console.log(req.body);
	    	// return res.send({
	     //  		success: true
	    	// });

  		} else {
    		var err = new Error('All fields required.');
    		err.status = 400;
   			return next(err);
  		}
	});
};