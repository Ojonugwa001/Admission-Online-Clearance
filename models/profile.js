var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  dob : { 
    type: Date, 
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  olevel: {
    type: String,
    required: true,
    trim: true
  },
  olevel2: {
    type: String,
    trim: true
  },
  birthCertificate: {
    type: String,
    required: true,
    trim: true
  },
  certificateOfOrigin: {
    type: String,
    required: true,
    trim: true
  },
  medicalCertificate: {
    type: String,
    required: true,
    trim: true
  },
  approved: {
    type: String,
    enum: ['pending', 'approved', 'disaproved'],
    default: 'pending'
  },

});

//authenticate input against database
 var authenticate = ProfileSchema.statics.authenticate = function (userId, callback) {
  Profile.findOne({ userId: userId })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('Profile not found.');
        err.status = 401;
        return callback(err);
      } else {
        return callback(null, user);
      }
      
    });
} 

/* hashing a password before saving it to the database */

var Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;