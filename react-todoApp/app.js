		
		var http = require("http");                         // Module used to create a web server
		var express = require("express");                   //Express is a light-weight web application framework to help organize your web application into an MVC architecture on the server side.
		var consolidate = require("consolidate");           //Template engine consolidation library.

		var _ = require("underscore");                      // Underscore is a JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects.
		var bodyParser = require('body-parser');            // Body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body as something easier to interface with. 

		var routes = require('./routes');                   //File that contains our endpoints.

		var MongoClient = require('mongodb').MongoClient;   // A simple url connection string for a single server connection.

		 

		var app = express();
		app.use(bodyParser.urlencoded({
		   extended: true,

		}));
		             
		app.use(bodyParser.json({limit: '5mb'}));           // Limit the HTTP requet  size and upload size.  

		app.set('views', 'templates');                      //Set the folder-name from where you serve the html page. 
		app.use(express.static('./public'));                //setting the folder name (public) where all the static files like css, js, images etc are made available
		 

		app.set('view engine','html');                      // 'html' as a view engine in express.
		app.engine('html',consolidate.underscore);          // Using undescore as template engine
		var portNumber = 7000;                              //for locahost:7000

		http.createServer(app).listen(portNumber, function(){    //Creating the server which is listening to the port number:7000, and calls a function within in which calls the initialize(app) function in the router module
			console.log('Server listening at port '+ portNumber); 

			var url = 'mongodb://localhost:27017/todoAppDb';     // Connecting to database todoAppDb mongoDB. 

				MongoClient.connect(url, function(err, db) {    //a connection with the mongodb is established here.
					if(err){
						console.log("Error in connection!!!" +err);
					}else {
						console.log("Connected to Database");
						routes.initialize(app, db);           //function defined in routes.js which is exported to be accessed by other modules	
					}
			});
		});




		/* 1. Not all the template engines work uniformly with express, hence this library in js, (consolidate), is used to make the template engines work uniformly. Altough it doesn't have any 
		modules of its own and any template engine to be used should be seprately installed!*/