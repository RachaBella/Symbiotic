var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	user 	 = require("./user.js")

var socketSchema = new Schema ({
	userI: {type: Schema.Types.ObjectId, ref: "User"},
	current: {type: Schema.Types.ObjectId, ref: "User"}
});

var Socket = mongoose.model('Socket', socketSchema);
module.exports = Socket;
	