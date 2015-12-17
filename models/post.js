var mongoose = require('mongoose'),
	user = require("./user.js"),
	Schema = mongoose.Schema;


var postSchema = new Schema ({
	Title: {
		require:true,
		type:String
	},
	owner: {
		type:Schema.Types.ObjectId, ref :"User"
	},
	watcher: {
		type:Schema.Types.ObjectId, ref :"User"
	},
	content:{
		type:String,
		require:true
	},
	image: String
});

var Post = mongoose.model("Post", postSchema);
    module.exports = Post
  