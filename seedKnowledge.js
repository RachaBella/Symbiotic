var express = require('express');
var request = require('request');
var app     = express();
var mongoose = require("mongoose");
var db = require('./models');



var know = {
	name: "Android",
	img:"http://icons.iconarchive.com/icons/martz90/circle/512/android-icon.png",
	usersWhoKnow:[],
	usersWhoWant:[]
}
var know1 = {
	name: "C#",
	img:"http://a5.mzstatic.com/au/r30/Purple1/v4/5c/2e/45/5c2e45cc-1737-c9b1-2019-b64da2bf425e/icon175x175.png",
	usersWhoKnow:[],
	usersWhoWant:[]
}

var know3 = {
	name: "Java",
	img:"http://tecadmin.net/wp-content/uploads/2013/02/java-logo.png",
	usersWhoKnow:[],
	usersWhoWant:[]
}

var know4 = {
	name: "C++",
	img:"https://i.warosu.org/data/sci/img/0073/82/1436460985794.png",
	usersWhoKnow:[],
	usersWhoWant:[]
}

var know5 = {
	name: "C",
	img:"https://lh3.ggpht.com/vrKC4cLAuEFf2-FdDfc02iuCHa5TnPRd-uecZZY8vCzxFnCN-C0PGZ-qsTKeKSIVacA=w170",
	usersWhoKnow:[],
	usersWhoWant:[]
}

var know6 = {
	name: "Windows phone",
	img:"http://icons.iconarchive.com/icons/martz90/circle/256/windows-8-icon.png",
	usersWhoKnow:[],
	usersWhoWant:[]
}

var know7 = {
	name: "Ruby",
	img:"http://www.theodinproject.com/assets/icons/ruby-945dfca9c81e9efb2e6c714960291f93.png",
	usersWhoKnow:[],
	usersWhoWant:[]
}

var know8 = {
	name: "Rails",
	img:"https://upload.wikimedia.org/wikipedia/commons/1/16/Ruby_on_Rails-logo.png",
	usersWhoKnow:[],
	usersWhoWant:[]
}

var know9 = {
	name: "Python",
	img:"https://ee5817f8e2e9a2e34042-3365e7f0719651e5b8d0979bce83c558.ssl.cf5.rackcdn.com/python.png",
	usersWhoKnow:[],
	usersWhoWant:[]
}

db.Knowledge.create(know, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});

db.Knowledge.create(know1, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});


db.Knowledge.create(know3, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});

db.Knowledge.create(know4, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});

db.Knowledge.create(know5, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});

db.Knowledge.create(know6, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});

db.Knowledge.create(know7, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});

db.Knowledge.create(know8, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});

db.Knowledge.create(know9, function (error, keyw){
		if(error){
			console.log("error :", error);
		}
		console.log("the keyword created successfully", keyw);
});


app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;