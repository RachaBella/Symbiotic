var mongoose = require('mongoose'),
    knowledge= require('./knowledge.js'),
    post     = require('./post.js'),
    comment  = require('./comment.js'),
	Schema   = mongoose.Schema,
	bcrypt   = require('bcryptjs');

var userSchema = new Schema({
	userName: {
		type:String,
		require:true,
		unique:true
	},
	password_digest: {
		type:String,
		require:true
	},
	email: {
		type:String,
		require:true,
		unique:true
	},
	knowledgeIKnow:[
		{type: Schema.Types.ObjectId, ref: "Knowledge"
		}],
	knowledgeIWant:[
		{type: Schema.Types.ObjectId, ref: "Knowledge"
		}],
	mySymbiotic:[{
		type: Schema.Types.ObjectId, ref: "User"
	}],
	points:Number
});

userSchema.statics.checkUsername = function (username, callback) {
	db.User.find({userName: username}, function (error, found) {
		if (found.length) {
			callback("Username exists");
		} else {
		callback (null);
		}
	});
}

userSchema.statics.checkEmail = function (email, callback) {
	db.User.find({email: email}, function (error, found) {
		if (found.length) {
			callback("Email exists");
		} else 
		callback(null);
	});
}

userSchema.statics.createSecure = function(username, email , password, callback) {
	var user = this;
	//console.log("we are in the secure function creation");
    // hash password user enters at sign up

    bcrypt.genSalt(function (err, salt) {
	    bcrypt.hash (password, salt, function (err, hash) {
		    //console.log(hash);
		        // create the new user (save to db) with hashed password
		    user.create({
		        userName:username,	
		        email: email,
		        password_digest: hash,
		        knowledgeIKnow:[],
		        knowledgeIWant:[],
		        mySymbiotic:[], 
		        points:25
		        }, callback);
		});
	});

}

// authenticate user (when user logs in)
userSchema.statics.authenticate = function (email, password, callback) {
    // find user by email entered at log in
    this.findOne({email: email}).populate("mySymbiotic").populate('knowledgeIWant').populate("knowledgeIKnow").exec(function (err, user) {
      // throw error if can't find user
      if (!user) {
        console.log('No user with email ' + email);
        callback ('wrong email', null);
      // if found user, check if password is correct
      } else if (user.checkPassword(password)) {
        callback(null, user);
      }else {
      	callback("Error: incorrect password", null);
      }
    });
};

userSchema.statics.updatePassword = function (password, user, callback) {
	if (password) {
		bcrypt.genSalt(function (err, salt) {
	    bcrypt.hash (password, salt, function (err, hash) {
		    //console.log(hash);
		        // create the new user (save to db) with hashed password
		    user.findByIdAndUpdate(user._id, { $set : {passwordDigest: hash }} , function (error, userU ) {
		    	if (error) {
		    		callback("Error", null);
		    	}else {
		    		callback(null, userU);
		    	}
		    });
		});
	});

	}
}


userSchema.methods.checkPassword = function (password) {
	 return bcrypt.compareSync(password, this.password_digest);
}


var User = mongoose.model('User', userSchema);
module.exports = User;