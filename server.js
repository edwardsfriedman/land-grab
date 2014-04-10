var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use(express.bodyParser());

var dbUrl = "test";
var collections = ["entries"];

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
    if(!err) {
        console.log("We are connected");
    }
    var db = mongoClient.db("test");
});



app.get('/', function(request, response){
	console.log("homepage");
	response.render('homepage.html');
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
