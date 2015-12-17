var mongoose = require("mongoose"),
	Schema   = mongoose.Schema,
	user     = require("./user.js");


var commentSchema = new Schema ({
	content: String,
	owner: {
		type:Number,
		ref: 'User'
	}
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;