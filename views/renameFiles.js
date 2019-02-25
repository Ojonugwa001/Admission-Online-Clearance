var fs = require("fs");
var path = require('path');

fs.readdir(__dirname, function(err, files) {

	if (err) {
		throw err;
	}

	files.forEach(function(fileName) {
		var name = fileName.substr(0, fileName.lastIndexOf('.'));
		name += ".ejs"
		console.log(name + "\n");

		fs.renameSync(fileName, name);

		console.log("Files renamed successfully");
	});
	

});

console.log("Reading Files...");


// var file = "index.html"; 

// var name = fileName.substr(0, file.lastIndexOf('.'));

// var sample = path.basename('index.html');
// console.log(name);
