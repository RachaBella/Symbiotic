
var express = require("express"),
	app = express(),
	resources= require('./resources')
	mongoose = require("mongoose"),
    path = require("path"),
    bodyParser = require("body-parser"),
    http = require('http'),
    server = http.Server(app),
    db = require('./models'),
    session = require('express-session') ({
        secret: "aliensAreAmongUs",
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 6000000}
    }),
    sharedsession = require('express-socket.io-session'),
	ejs = require('ejs');


require('dotenv').load();
app.engine('html', ejs.renderFile); 
app.set('view engine', 'html');
app.use("/static", express.static("public"));
app.use(bodyParser.json());


// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ 
			extended: true }
		));

//sessions
app.use(session);
app.get('/templates/:name', resources.templates);

app.get("/", function (req, res) {
	res.render("index");
});

//Creating a new user
var sessionUser = null;
app.post('/users', function (req, res) {
	var user = req.body
	console.log("the user is", user);
	db.User.checkEmail(user.email, function (result) {
		if (result ==="Email exists") {
			res.send("Email exists")
		} else {
			db.User.checkUsername(user.username, function (result2) {
				if (result2 ==="Username exists") {
					res.send("Username exists")
				} else {
					db.User.createSecure(user.username, user.email, user.password, function (error, newUser) {
					if (error) {
						console.log("Error OCCURED : *****", error.message);
						res.send("Error");
					}
					req.session.user = newUser;
					sessionUser = newUser;
					req.session.id= newUser._id;
					res.send(newUser);
				})

				}
			})
		}
	})
	
});

//Get the current user details
app.get('/currentUser', function (req, res) {
	var user = req.session.user;
	res.json({user : req.session.user});
});

//Get the Profile page
app.get('/users/:name', function (req, res) {
	var userName = req.params.name;
	res.render("templates/profile", {user: req.currentUser});
});

/*db.User.findByIdAndUpdate(req.session.userId, { $set : user} , function (error, userUpdated) {
		if(error) {
			console.log("Error :" , error); 
		}		
	});*/

//Update Profile
app.put("/users/:id", function (req, res) {
	id = req.session.id;
	if (( req.body.email === "") && ( req.body.username ==="")) {
		res.send("No Update");
	} else if ((req.body.email ==="") && (req.body.username !== "")) {
		db.User.checkUsername(req.body.username, function (found) {
			if (found === "Username exists") {
				res.send("Username exists");
			}else {
				db.User.findOneAndUpdate({_id: req.session.user._id}, {$set: {userName: req.body.username}},  { 'new': true }, function (error, userU) {
					if (error) {
						res.send("Error");
					} else {
						req.session.user = userU;
						console.log(userU);
						res.send(userU);
					}
				});
			}
		})
		
		
	} else if ((req.body.email !=="") && (req.body.username !=="")) {
		db.User.checkUsername(req.body.username,  function (result) {
			if (result === "Username exists") {
				res.send("Username exists")
			} else {
				db.User.checkEmail (req.body.email, function (result2) {
					if (result2=== "Email exists") {
						res.send("Email exists");
					} else {
						db.User.findOneAndUpdate({_if: req.session.user._id}, {$set : {userName: req.body.username, email: req.body.email}},  { 'new': true }, function (error, userU) {
							if(error) {
								res.send("Error");
							}
							else {
								req.session.user = userU;
								console.log(userU);
								res.send(userU);
							}
						});
					}
				})
			}
		});


	} else if ((req.body.email !=="") && (req.body.username ==="")) {
		db.User.checkEmail (req.body.email, function (result2) {
			if (result2=== "Email exists") {
					res.send("Email exists");
			} else {
				db.User.findOneAndUpdate({_if: req.session.user._id}, {$set : {email: req.body.email}}, { 'new': true }, function (error, userU) {
					if(error) {
						res.send("Error");
						}
						else {
							req.session.user = userU;
							console.log(userU);
							res.send(userU);
						}
				});
			}
		})
	}
	
	
})

//log out :
app.get('/logout', function (req , res) {
	req.session.user = null;
	sessionUser = null;
	req.session.id=null;
	res.json(req.session.user);
});

//login 
app.post("/login", function (req, res) {
	email = req.body.email;
	db.User.authenticate(req.body.email, req.body.password, function (error, userFound) {
		if (error =="wrong email") {
			res.send("wrong email");
		} else if( error =="Error: incorrect password") {
			res.send("Error: incorrect password");
		} else if (userFound !== null) {
			req.session.id = userFound._id;
			req.session.user = userFound;
			sessionUser = userFound;
			console.log("session verification :", req.session.id )
			res.json(userFound);
		}
	});
});

//Getting the knowledges that will show up in the what the user knows select options, excluding what he has already chosen
app.get("/users/:id/knowledgeIKnow", function (req, res) {
	db.Knowledge.find().populate("usersWhoKnow").exec( function (error, knowledges) {
		if (error) {
			res.send("Error");
		}
		else {
			//if it's the first time, it should return all the knowledges 
			var knowledgesIKnow = req.session.user.knowledgeIKnow;
			if (knowledgesIKnow === []) {
				res.send(knowledges)
			} else {
				var result= [];
				console.log("*****************Knowledges know ***********")
				var length = knowledges.length;

				for (var i=0; i <length; i++) {
					var found = false;
					var length2 = knowledges[i].usersWhoKnow.length;
					for (var j=0; j< length2; j++) {
						if (req.params.id == knowledges[i].usersWhoKnow[j]._id) {
							found = true;
							console.log("****user found ----> true !!!!!!")
							break;
						}
					}
					if (found === false) {
						result.push(knowledges[i]);
					}
				}
			}
			res.send(result);
		}
	})
});

//Getting the knowledges that will show up in the what user wants select options, excluding what he has already chosen
app.get("/users/:id/knowledgeIWant", function (req, res) {
	db.Knowledge.find().populate("usersWhoWant").exec( function (error, knowledges) {
		if (error) {
			res.send("Error");
		}
		else {
			var knowledgesIWant = req.session.user.knowledgeIWant;
			if (knowledgesIWant === []) {
				res.send(knowledges);
				console.log("****EMPTYYYY*****");
			} else {
				var result= [];
				var length = knowledges.length;
				for (var i=0; i< length; i++) {
					var found = false;
					var length2 = knowledges[i].usersWhoWant.length;
					for (var j=0; j< length2; j++) {
						if (req.params.id == knowledges[i].usersWhoWant[j]._id) {
							found =true;
							console.log("****user found ----> true !!!!!!")
							break;
						}
					}
					if (found === false) {
						result.push(knowledges[i]);
					}
				}
				res.send(result);

			}
		}
	})
});

//Getting the user added Symbiotics
app.get('/users/:id/mySymbiotic', function (req, res) {
	db.User.findOne({_id: req.params.id}).populate("mySymbiotic").exec( function (error, userFound) {
		var options = [{
			path: "mySymbiotic.knowledgeIKnow",
			model: 'Knowledge'
		}, {
			path: "mySymbiotic.knowledgeIWant",
			model: 'Knowledge'
		}];
		if(error) {
			res.send("Error");
		} else {
			db.User.populate(userFound, options, function (error, user) {
				
				res.send(user.mySymbiotic);
			})
		}
	})
});

//deleting KnowledgeIwant
app.delete("/users/:id/knowledgeIWant/:id2" ,function (req, res) {
	db.User.findOne({_id : req.params.id}).populate("knowledgeIWant").exec( function (error, result) {
		if (error) {
			res.send("Error");
		}
		else {
			for (var i =0; i< result.knowledgeIWant.length; i++ ) {
				if (result.knowledgeIWant[i]._id == req.params.id2) {
					result.knowledgeIWant.splice(i,1);
					result.save();
					break;
				}
			}

			db.Knowledge.findOne({_id: req.params.id2}).populate("usersWhoWant").exec (function (error, result) {
				if (error) {
					res.send("Error");
				}else {
					for (var i =0; i< result.usersWhoWant.length; i++ ) {
						if (result.usersWhoWant[i]._id == req.params.id) {
							result.usersWhoWant.splice(i,1);
							result.save();
							break;
					}
			}
				}
		
			});
			res.send(result.knowledgeIWant);
		}
	})
})

//deleting KnowledgeIKnow
app.delete("/users/:id/knowledgeIKnow/:id2" ,function (req, res) {
	db.User.findOne({_id : req.params.id}).populate("knowledgeIKnow").exec( function (error, result) {
		if (error) {
			res.send("Error");
		}
		else {
			// lients.map(function(e) { return e.user; }).indexOf(data.current._id);
			console.log("the params", req.params.id2)
			// var i= result.knowledgeIKnow.map(function (e) {console.log (' the e :', e._id); return e._id;}).indexOf(req.params.id2);
			for (var i =0; i< result.knowledgeIKnow.length; i++ ) {
				if (result.knowledgeIKnow[i]._id == req.params.id2) {
					result.knowledgeIKnow.splice(i,1);
					result.save();
					break;
				}
			}
			db.Knowledge.findOne({_id: req.params.id2}).populate("usersWhoknow").exec (function (error, result) {
				if (error) {
					res.send("Error");
				}else {
					for (var i =0; i< result.usersWhoKnow.length; i++ ) {
						if (result.usersWhoKnow[i]._id == req.params.id) {
							result.usersWhoKnow.splice(i,1);
							result.save();
							break;
					}
			}
				}
		
			});
			res.send(result.knowledgeIKnow);
		}
	});

})

//Getting the Symbiotics matches for the user
app.get("/users/:id/MatchingSymbiotics", function (req, res) {
	var peopleWhoKnow = [];
	var iWant= [];
	var found= false;
	var filtredUsersWhoKnow=[];
	db.Knowledge.find({
      usersWhoWant:
        {
          _id: req.params.id,
        }
    }).populate("usersWhoKnow").populate("mySymbiotic").exec(function (error, results) {
		var l = results.length;
		//console.log("the length of results is :", l);
		//console.log("the results :", results);
		for (var i=0; i<l ; i++) {
			//console.log("loop i");
			//console.log("the usersWhoknow of the results query", results[i].usersWhoKnow);
			var length = results[i].usersWhoKnow.length
			for (var j =0; j < length ; j++) {
				//console.log("loop j")
				var length2 = results[i].usersWhoKnow[j].mySymbiotic.length;
				for (var k=0; k< length2; k++) {
					//console.log("loop k, symbiotic :", results[i].usersWhoKnow[j].mySymbiotic[k], "and the id of this user: ", req.params.id);
					if (results[i].usersWhoKnow[j].mySymbiotic[k] == req.params.id) {
						found =true;
						//console.log('true...eliminated');
						break;
					}
				}
				if (found === false) {
					filtredUsersWhoKnow.push(results[i].usersWhoKnow[j]);
				}
				found = false;
			}
			
			var	knowledge = {
				usersWhoKnow: filtredUsersWhoKnow,
				name: results[i].name,
				img : results[i].img,

				}
			peopleWhoKnow.push(knowledge);
			filtredUsersWhoKnow=[];
		}
		
		res.send(peopleWhoKnow);
	});
	
});

//posting the user's preferences
app.put("/knowledges", function (req, res) {
	var cpt =0;
	var length1 = req.body.iWant.length;
	var length2 = req.body.iKnow.length;
	var know = true;
	for (var i=0; i < req.body.iWant.length; i++) {
		db.Knowledge.findOneAndUpdate({_id:req.body.iWant[i]._id} ,{$push: {usersWhoWant: req.session.user}}, function (error, knowledge) {
			if (error) {
				console.log("error", error);
				know = false;
				
			}else {
				//console.log("im in for loop i want")
			    know = knowledge;
			    // console.log('the know is :',knowledge);
			    // console.log('session id : ', req.session.user);
			    db.User.findOneAndUpdate({_id:req.session.user._id }, {$push: {knowledgeIWant: knowledge}}, function (error, user) {
					if (error) {
						console.log("error in user", error);
						know = false
					} else {
						cpt++;
						console.log("the counter :", cpt);
					}
				});
			}
		});

	}
	for (var i=0; i< req.body.iKnow.length; i++) {
		db.Knowledge.findOneAndUpdate({_id: req.body.iKnow[i]._id }, {$push: {usersWhoKnow: req.session.user}}, function (error, knowledge) {
			if (error) {
				console.log("error", error);
				know = false 
			}else {
				// console.log("im in for loop i know")
				req.session.knowledge = knowledge;
				db.User.findOneAndUpdate({_id: req.session.user._id }, {$push: {knowledgeIKnow: knowledge}},  function (error, user) {
					if (error) {
						console.log("error in user", error.message);
						know = false;
					} else {
						cpt++;
						// console.log("the counter is: ", cpt)
						if (cpt === length1 + length2) {
							req.session.user = user;
							db.User.findOne({_id: user._id}).populate("knowledgeIKnow").populate('knowledgeIWant').exec( function (error, userr) {
							res.send(userr);
								
							})
						} 
					}
				});
			}
		});	
	}
	// console.log("the final counter is: ", cpt)
	
	if (know === false) {
		res.send("Error");
	}
});

//Getting the dashBoardPage 

app.get('/users/:name1/Symbiose/:name2', function (req, res) {
	console.log("the params are : " , req.params.name1, " the second params", req.params.name2);
	db.Post.find({ 
		$or: [
			{
				owner:
		        {
		          _id: req.params.name1
		        },
		        watcher:{
		          _id: req.params.name2
		        }
			},
			{
				owner:
		        {
		          _id: req.params.name2
		        },
		        watcher:{
		          _id: req.params.name1
		        }
			}
		]	
	}).populate('owner', 'userName').populate('watcher','userName').populate('knowledge', 'name').exec(function (error, results) {
		if(error) {
			console.log("ERROR " , error.message)
			res.send("Error");
		} else {
			res.send(results);
		}
	});
});

//posting a posta
app.post('/posts/:ownerId/:watcherId', function (req, res) {
	var post = {
		title: req.body.title,
		owner: req.params.ownerId,
		watcher: req.params.watcherId,
		content: req.body.content,
		knowledge : req.body.knowledge.id,
		image:""
	}
	db.Post.create(post, function (error, newPost) {
		if (error) {
			res.send("Error");
		} else {
			res.send(newPost);
		}
	})
})

//deleting a user from sockets 
app.delete("/sockets/:id", function (req, res) {
	db.Socket.remove({userI: req.session.user._id}, function (error, deleted) {
		if(error) {

		}else {
			res.send(deleted);
		}
	})
});

app.get("*", resources.index);

var io = require('socket.io').listen(server);
var clients= [];
io.use(sharedsession(session));
io.on('connection', function(socket){
	console.log("************the clients*********",clients)
    console.log("connected");
    console.log("//**********THE HANDSHAKE IS ////", socket.handshake.session.user)
    if ((socket.handshake.session.user !== null) && (socket.handshake.session.user !== undefined)) {
    	var i= clients.map(function(e) { return e.user; }).indexOf(socket.handshake.session.user._id);
    	if(i=== -1) {
			clients.push({
							user:socket.handshake.session.user._id,
					 		id: socket.id});
			db.Socket.find({userI: socket.handshake.session.user._id}).populate("userI").populate('current').exec(function( error, userFound) {
				if (userFound.length) {
					console.log("****THE USER IS ONLINE AGAIN EMIIIIIT TO HIM §§§******", userFound)
					console.log("And the clients are" , clients);
					console.log("the socket id is :", socket.id)
					io.to(socket.id).emit('invitationRequest', userFound);
				}
			});
    	}
	}
	
	console.log("*************the clients are************",clients)
    //socket.emit("invitationResponse", {msg:"hello"});
    socket.on("invitationRequest", function(data){
    	console.log("invitationRequest data is ", data)
    	var i= clients.map(function(e) { return e.user; }).indexOf(data.userI._id);
    	console.log("the index of the invited person in clients table is i:", i);
    	if (i !== -1) {
    		socket.broadcast.to(clients[i].id).emit('invitationRequest', data);
    	} else {
    	  db.Socket.create({userI:data.userI, current: data.current}, function (error, userSaved) {
    	  	if (error) {
    	  		var i= clients.map(function(e) { return e.user; }).indexOf(data.current._id);
    	  		socket.broadcast.to(clients[i].id).emit('invitationResponse', {msg:"Error", user: data.userI});

    	  	} else {
    	  		console.log('the socket user is saved : ', userSaved);
    	  	}
    	  })
    	}
    	// io.emit('invitationRequest', data)
        // console.log("client["+socket.handshake.session.user._id+"] sent data: " + data);
    });

//socket.broadcast.to(id).emit('my message', msg);

    socket.on("invitationResponse", function(data){
    	console.log("******the invitation response data  is: ******    ", data)
    	debugger;
    	var i= clients.map(function(e) { return e.user; }).indexOf(data.user._id);
    	console.log("******the index of the user accepted in the clients is i: ***    ", i);
    	if(data.msg ==="refuse") {
    		socket.broadcast.to(clients[i].id).emit('invitationResponse', data);
    	}else {
    		db.User.findOne({_id: data.current._id} , function (error, userFound) {
    			if(error) {
    				var i= clients.map(function(e) { return e.user; }).indexOf(data.current._id);
    				socket.broadcast.to(clients[i].id).emit('invitationResponse', {msg:"Error", user: data.user});
    			}
    			else{
    				console.log("i am the one who clicked the accept button :     ", userFound)
    				userFound.mySymbiotic.push(data.user._id);
    				userFound.save();
    				var i= clients.map(function(e) { return e.user; }).indexOf(data.current._id);
    				socket.broadcast.to(clients[i].id).emit('invitationResponse', {msg:"SuccessAdding", data:data.user});

    			}
    		});

    		console.log("******************the user._id : before the db search:   ****** the one who sent the invitation :  \n", data.user);
    		db.User.findOne({_id : data.user._id }, function (error, userFound2) {
    			if(error) {
    				var i= clients.map(function(e) { return e.user; }).indexOf(data.current._id);
    				if(i === -1) {

    				}else {
    					socket.broadcast.to(clients[i].id).emit('invitationResponse', {msg:"Error", user: data.current});
    				}
    			}
    			else {
    				console.log("****i am the one who sent the invitation:***** \n ", userFound2)
    				userFound2.mySymbiotic.push(data.current._id);
    				userFound2.save();
    				var i= clients.map(function(e) { return e.user; }).indexOf(data.user._id);
    				if(i === -1) {
    					console.log("Client disconnected");
    				} else {
    					socket.broadcast.to(clients[i].id).emit('invitationResponse', {msg:"Success", data:data.current});
    				}
    			}
    		});
    	}
    	
    });

    socket.on('disconnect', function () {
    	if ((sessionUser === null) || (sessionUser === undefined)) {
    		socket.handshake.session.user =null
    		console.log("///*************///********NO SESSION*****");
    		clients.splice(clients.indexOf({id:socket.id}), 1); 
    		console.log("client disconnected :", socket.id);
    		console.log(clients);
    	} else {
    		console.log("§§§§§Is THERE HERE A HANDSHAKE §§§§§§",socket.handshake.session.user._id);
    		console.log("still online");
    		console.log(clients);

    	}
    	
    })
});
server.listen(process.env.PORT || 3000, function () {
	console.log("listening on port 3000 ... success :)");
});


