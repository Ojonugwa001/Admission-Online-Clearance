var bodyParser = require('body-parser');
var User =  require("../models/user");

// var itemOne = User({email: "ojay1@gmail.com", username: "ojay1", password: "123456", passwordConf: "123456"});
// itemOne.save(function(err) {
// 	if (err) throw err;
// 	console.log("New User Saved!");
// });

/* create application/x-www-form-urlencoded parser */
var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports = function(app) {
	
	app.get("/login", function(req, res) {
		res.render("page-login");
	});

	app.post("/login", urlencodedParser, function(req, res, next) {
		// res.render("page-login");
		User.authenticate(req.body.emailaddress, req.body.password, function (error, user) {
      		if (error || !user) {
        		var err = new Error('Wrong email or password.');
        		err.status = 401;
       	 		return next(err);
      		} else {
        		req.session.userId = user._id;
        		req.session.userEmail = user.email;
        		console.log(req.session.userEmail)
        		return res.redirect('/');
      		}
      	});
	});

	app.get("/register", function(req, res) {
		// console.log(req.query);
		res.render("page-register");
	});

	app.post("/register", function(req, res, next) {
		console.log(req.body);

		// confirm that user typed same password twice
		if (req.body.password !== req.body.passwordConf) {
		    var err = new Error('Passwords do not match.');
		    err.status = 400;
		    res.send("passwords dont match");
		    return next(err);
		}

		if (req.body.emailaddress && req.body.username && req.body.password && req.body.passwordConf) {
			var userData = {
				email: req.body.emailaddress,
		    	username: req.body.username,
		    	password: req.body.password,
		    	passwordConf: req.body.passwordConf,
		    }

			//use schema.create to insert data into the db
			User.create(userData, function (err, user) {
				if (err) { 
					return next(err)
				} else {
					return res.redirect('/login');
			    }
			});
		} else {
    		var err = new Error('All fields required.');
    		err.status = 400;
   			 return next(err);
  		}

		// res.render("page-register");
	});	

	// GET for logout logout
	app.get('/logout', function (req, res, next) {
		User.findById(req.session.userId).exec(function (error, user) {
	      	if (error) {
	      		console.log(error);
	      		res.redirect('/login');
	       		return next();
	     	} else {
	        	if (user === null) {
	          		var err = new Error('Not authorized! Go back!');
	          		err.status = 400;
	          		console.log(err);

	          		res.redirect('/login');

	         		return next();
	        	} else {
	        		if (req.session) {
		    			// delete session object
		    			req.session.destroy(function (err) {
		    				if (err) {
		        				return next(err);
		      				} else {
		        				return res.render('page-logout');
		      				}
		   		 		});
					}
	        	}	
	      	}
    	});
	
	});

	// app.post("/todo", urlencodedParser, function(req, res) {
	// 	data.push(req.body);
	// 	res.json(data);
	// });

	// app.delete("/todo/:item", function(req, res) {
	// 	data = data.filter(function(todo) {
	// 		return todo.item.replace(/ /g, '-') !== req.params.item;
	// 	});
	// 	res.json(data);
	// });  	 
};