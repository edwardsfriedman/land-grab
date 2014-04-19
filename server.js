var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname + '/public');
app.use(express.bodyParser());


// our database is named "landGrab", the collection we store everything in is named mapPoints
var collection, db;
var dbUrl = "landGrab";
var collectionName = "mapPoints";

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.connect("mongodb://localhost:27017/" + dbUrl, function(err, database) {
    if(!err) {
        console.log("We are connected");
		db = database;
		db.collection(collectionName,function(err,collec){
			if(err){
				console.log("error fetching collections");
			} else {
				console.log("success");
				collection = collec;
			}
		});
    } else {
    	console.log("Error connecting to db. exiting");
    	process.exit(code=0);
    }
});

app.get('/', function(request, response){
	console.log("homepage");
	response.render('map.html');
});

app.get('/search.json', function(request, response){
	//search
	console.log("SEARCH RECIEVED:", request.body.name, request.body.location, request.body.description);

	var name1 = request.body.name1;
	var name2 = request.body.name2;
	var name3 = request.body.name3;
	var location1 = request.body.location1;
	var location2 = request.body.location2;
	var location3 = request.body.location3;
	var grabbers1 = request.body.grabbers1;
	var grabbers2 = request.body.grabbers2;
	var grabbers3 = request.body.grabbers3;
	var typeOfResistance1 = request.body.typeOfResistance1;
	var typeOfResistance2 = request.body.typeOfResistance2;
	var typeOfResistance3 = request.body.typeOfResistance3;

	var query = TODO;

	collection.find(query).toArray(function(err,entries){
		if(err || entries.length == 0) {
			console.log("error or no results found");
		} else {
			response.send(entries);
		}
	});
});

app.post('/testInsert', function(request, response){
    // insert everything to the database

    console.log("POST RECIEVED:", request.body.name, request.body.location, request.body.description);

    collection.insert({name:request.body.name, 
                       location:request.body.location, 
                       url:request.body.url,
                       desc:request.body.desc,
                       locationsActive:request.body.locationsActive,
                       grabbers:request.body.grabbers,
                       resistance:request.body.resistance
                      }, function() { 
                          console.log("SUCCESFULLY INSERTED");
                      });

    response.redirect('/');
});


app.get('/populateMap.json',function(request, response){
	collection.find().toArray(function(err,entries){
		if(err || entries.length == 0) {
			console.log("error or no results found");
		} else {
			response.send(entries);
		}
	});
});

var server = app.listen(8081, function(){
	console.log('Listening on port %d', server.address().port);
});
