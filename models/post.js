var mongoose = require('mongoose'),
	user = require("./user.js"),
	knowledge = require("./knowledge.js"),
	Schema = mongoose.Schema;


var postSchema = new Schema ({
	title: {
		require:true,
		type:String
	},
	owner: {
		type:Schema.Types.ObjectId, ref :"User"
	},
	watcher: {
		type:Schema.Types.ObjectId, ref :"User"
	},

	knowledge: {
		type:Schema.Types.ObjectId, ref :"Knowledge"
	},

	content:{
		type:String,
		require:true
	},
	image: String
});

var Post = mongoose.model("Post", postSchema);
    module.exports = Post
  