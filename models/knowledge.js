var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	user = require('./user.js');

var knowledgeSchema = new Schema({
	name:String,
	img:String,
	usersWhoKnow:[{
		type:Schema.Types.ObjectId, ref :"User" 
	}],
	usersWhoWant:[{
		type:Schema.Types.ObjectId, ref :"User" 
	}]
})

var Knowledge  = mongoose.model('Knowledge', knowledgeSchema);
module.exports = Knowledge;