
var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
    path = require("path"),
    bodyParser = require("body-parser"),
    db = require('./models'),
    session = require('express-session');


app.listen(process.env.PORT || 3000, function () {
	console.log("listening on port 3000 ... success :)");
});