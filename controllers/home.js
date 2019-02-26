var User =  require("../models/user");
const Profile =  require("../models/profile");

module.exports = function(app) {
	
	app.get('/', function (req, res, next) {
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
	        		// console.log(profileData);

	          		Profile.authenticate(req.session.userId, function (error, profileUserId) {
	          			var email = req.session.userEmail;
	      				
	      				if (error || !profileUserId) {
	      					Profile.find({},'userId firstname lastname department approved', function(err, profileData){
	        					if (err) {
	        						console.log("profileData could not be fetched");
	        						return next();
	        					}

	        					return res.render('index', {profileUpdated: false, email: email, profileData: profileData, user: 'Admin', title: "Dashboard"});
	        				});	
	      				} else {

	      					Profile.findOne({ userId: req.session.userId })
						    .exec(function (err, user) {
						      if (err) {
						        return callback(err)
						      } else if (!user) {
						        var err = new Error('User not found.');
						        err.status = 401;
						        return callback(err);
						      }
						      var name = user.lastname + " " + user.firstname;
						      return res.render('index', {profileUpdated: true, email: email, user: name, status: user.approved});
						     
						    });
	      				}
      				});
	        	}	
	      	}
    	});
	});

	app.post('/', function (req, res, next) {
		// console.log(req.params.data);
		console.log('body: ' + JSON.stringify(req.body.Id));

		var Id = req.body.Id;
		Profile.findOneAndUpdate({userId: Id}, {$set:{approved:req.body.status}}, {new: true}, (err, doc) => {
    		if (err) {
        		console.log("Something wrong when updating data!");
    		}

    		// console.log(doc);
    		res.redirect('/');
		});

		// var approvalData = {};	
	});

	app.get('/print-clearance', function (req, res, next) {

		var email = req.session.userEmail;

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
	        		// console.log(profileData);

	          		Profile.authenticate(req.session.userId, function (error, profileUserId) {
	          			var email = req.session.userEmail;
	      				if (error || !profileUserId) {
	      					Profile.find({},'userId firstname lastname department approved', function(err, profileData){
	        					if (err) {
	        						console.log("profileData could not be fetched");
	        						return next();
	        					}

	        					return res.render('index', {profileUpdated: false, email: email, profileData: profileData, user: 'Admin', title: "Dashboard"});
	        				});	
	      				} else {

	      					Profile.findOne({ userId: req.session.userId })
						    .exec(function (err, user) {
								if (err) {
									return callback(err) 
						    	} else if (user.approved !== 'approved') {
						        	return res.redirect('/');
						      	} else {
						      		var name = user.lastname + " " + user.firstname;
						      		return res.render('screening-cert', {profileUpdated: true, email: email, user: name});
						      	}
						     
						    });

	      				}
      				});
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