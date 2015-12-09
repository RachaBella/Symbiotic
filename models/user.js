var mongoose = require('mongoose'),
    knowledge= require('./knowledge.js'),
    post     = require('./post.js'),
    comment  = require('./comment.js'),
	Schema   = mongoose.Schema,
	bcrypt   = require('bcryptjs');

var userSchema = new Schema({
	userName: {
		type:String,
		require:true
	},
	password_digest: {
		type:String,
		require:true
	},
	email: {
		type:String,
		require:true
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

userName.statics.createSecure = function() {

}

userSchema.statics.authenticate = function() {

}

userSchema.methods.checkPassword = function (password) {

}

userSchema.statics.updatePassword = function (password) {

}

var User = mongoose.model('User', userSchema);
module.exports = User;