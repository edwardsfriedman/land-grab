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
	response.render('homepage.html');
	//console.log("database " + db);
	console.log(collection);
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
/*
app.get('/testInsert', function(request, response){
	console.log("insert page hit");
	console.log(collections[0]);
})
*/
app.get('/testFetchAll', function(request, response){
	console.log("fetchAll page hit");
	collection.find().toArray(function(err,entries){
		if(err || entries.length == 0) {
			console.log("error or no results found");
		} else {
			entries.forEach(function(entry){
				console.log(entry);
			});
			console.log("finished loop");
		}
	});
});

app.post('/superSecretUrl69', function(request, response){
	//post to db
	var username = request.body.nickname;
	var message = request.body.message;
	var roomName = request.params.roomName;

	var sql = "INSERT INTO messages (room, nickname, body, time) VALUES ($1,$2,$3,$4);";
	var q = conn.query(sql,[roomName,username,message,new Date().getTime()]);
	q.on('end', function(){
		response.redirect('/' + request.params.roomName);
	});

	var query = ""
});

var server = app.listen(8081, function(){
	console.log('Listening on port %d', server.address().port);
});
