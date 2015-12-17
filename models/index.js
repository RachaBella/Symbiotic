var mongoose = require('mongoose');


mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL || 
                      'mongodb://localhost/Symbiotic')
//Lets connect to our database using the DB server URL.
/*mongoose.connect('mongodb://localhost/iHelp');*/
module.exports.Knowledge = require("./knowledge.js");
module.exports.Post= require("./post.js");
module.exports.Comment = require("./comment.js");
module.exports.User= require("./user.js");