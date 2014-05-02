var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname + '/public');
app.use('/public', express.static(__dirname + '/public'));

app.use(express.bodyParser());


// our database is named "landGrab", the collection we store everything in is named mapPoints
var collection, db, userCollection;
var dbUrl = "landGrab";
var collectionName = "mapPoints";
var userCollectName = "users";

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
		db.collection(userCollectName,function(err,collec){
			if(err){
				console.log("error finding usercollection");
			} else {
				console.log("success");
				userCollection = collec;
			}
		});
    } else {
    	console.log("Error connecting to db. exiting");
    	process.exit(code=0);
    }
});

var auth = express.basicAuth(function(user, pass, callback){
	var userquery = {username : user, password : pass};
	userCollection.find(userquery).toArray(function(err,entries){
		if(err || entries.length == 0){
			console.log("username and password do not match or error");
			var result = false;
		} else {
			var result = true;
		}
		callback(null,result);
	});
});

app.get('/', function(request, response){
	console.log("homepage");
	response.render('map.html');
});

app.post('/search.json', function(request, response){
	//search
	console.log("SEARCH RECIEVED:");
	console.log(JSON.stringify(request.body));
	var names = [request.body.name1, request.body.name2, request.body.name3];
	var locations = [request.body.location1,request.body.location2,request.body.location3];
	var grabbers = [request.body.grabbers1,request.body.grabbers2,request.body.grabbers3];
	var typesOfResistance = [request.body.resistance1,request.body.resistance2,request.body.resistance3];

	var nameQuery = [];

	for(name in names){
		if(names[name]){
			nameQuery.push(names[name]);
		};
	};

	var locQuery = [];
	for(loc in locations){
		if(locations[loc]){
			locQuery.push(locations[loc]);
		};
	};


	var grabbersQuery = [];
	for(grab in grabbers){
		if(grabbers[grab]){
			grabbersQuery.push(grabbers[grab]);
		};
	};

	var resTypeQuery = [];
	for(resType in typesOfResistance){
		if(typesOfResistance[resType]){
			resTypeQuery.push(typesOfResistance[resType]);
		};
	};

	var query = { $or: [ {name : { $in: nameQuery } },{location : { $in: locQuery } },{grabbers : { $in: grabbersQuery } },{resistance : { $in: resTypeQuery } } ] };	

	console.log("About to execute the following query: ");
	var queryString = JSON.stringify(query);
	console.log(queryString);

	collection.find(query).toArray(function(err,entries){
		if(err){
			console.log("error: ");
			console.log(err);
		} else if(entries.length == 0) {
			console.log("no results found");
		} else {
			console.log("Results:");
			console.log(entries);
			response.send(entries);
		}
	});
});

app.get('/publicInsert', function(request, response){
	console.log("PUBLIC insert");
	response.render('test.html');
});
app.post('/publicInsert', function(request, response){
    // insert everything to the database
    console.log("PUBLIC insert POST: { name=", request.body.name, "loc=", request.body.location, "url=", request.body.url, "desc=", request.body.desc,"locActive=",  request.body.locationsActive, "grabbers=", request.body.grabbers, "resistance=", request.body.resistance, "submitter=", request.body.submitter, "}");
    data = {           name:request.body.name,
                       location:request.body.location,
                       url:request.body.url,
                       desc:request.body.desc,
                       locationsActive:request.body.locationsActive,
                       grabbers:request.body.grabbers,
                       resistance:request.body.resistance,
                       submitter:request.body.submitter,
                       published:false
           };
    //console.log("data to be inserted", data);
    // public insert uses insert because always adding new datapoint, admin insert uses save in order to update existing nodes
    collection.insert(data, function() {
                          console.log("insert success");
                          response.json({ success: true });
                      });

});

//TODO: authenticate get and post for admin
app.get('/adminList', function(request, response){
	response.render('test.html');
});

app.post('/adminList.json', auth, function(request, response) {
	console.log("in GET: admin list");
    collection.find().toArray(function(err,entries){
		if(err){
			console.log("error: ");
			console.log(err);
		} else if(entries.length == 0) {
			console.log("no results found");
		} else {
			console.log("Results:");
			//console.log(entries);
			response.json(entries);
		}
	});

});

app.get('/adminInsert', auth, function(request, response){
	console.log("ADMIN insert");
	response.render('test.html');
});


app.post('/adminInsert', auth, function(request, response){
    // admin insert or update into the database
    console.log("insert POST:", request.body._id, request.body.name, request.body.location, request.body.url, request.body.desc, request.body.locationsActive, request.body.grabbers, request.body.resistance, request.body.published);
    data = {           name:request.body.name,
                       location:request.body.location,
                       url:request.body.url,
                       desc:request.body.desc,
                       locationsActive:request.body.locationsActive,
                       grabbers:request.body.grabbers,
                       resistance:request.body.resistance,
                       submitter:request.body.submitter,
                       published:request.body.published
           };
    if( request.body._id != -1 )
        data['_id']=request.body._id;
    //console.log("data to be inserted", data);
    collection.save(data, function() {
                          console.log("insert success");
                          response.json({ success: true });
                      });

});
app.get('/adminRemove', function(request, response){
	console.log("ADMIN remove");
	response.render('test.html');
});
app.post('/adminRemove', auth, function(request, response){
    // admin insert or update into the database
    console.log("ADMIN removing node with _id", request.body._id);
    collection.remove({ '_id':request.body._id }, function() {
                          console.log("remove success");
                          response.json({ success: true });
                      }, 1); //NOTE: justOne parameter set to true so only 1 item is removed

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
