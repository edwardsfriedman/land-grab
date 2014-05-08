land-grab
=========

Mapping the Global Land Grab

Developers : Anna Herlihy (aherlihy), Edward Friedman (esfriedm), Travis Lloyd (tlloyd)
Designer : ma45

=========

Outline
--------

The purpose of this project is to provide a web application for users across the world to consolidate information about various movements involving land-grab. The can see land-grab movements on the map as well as search by name, location, and other tags. The administrator can vet movements submitted by users, as well as submit their own and curate the existing collection.

There are two main components to our application, the frontend (Mapbox, jQuery, javascript, html/css) and the backend (Node.js, Express, Mongodb).

The backend is written in node.js on the Express framework. The backend is implemented in MongoDB, a NoSQL database. We chose to use Mongo because of the ease of use and the potential for geospacial querying. The frontend sends asynchronous queries to the backend to populate the map.


Currently the DB is hosted on MongoHQ. MongoHQ is a platform for MongoDB hosting on the web, so the data is stored on the cloud and it should be accessible from anywhere the app is run. In order to run the app, just clone the repo and run:
    node server.js


In the case that MongoHQ goes down, and the DB needs to be run locally, then the DB can be set up on localhost.

    (1) install MongoDB (NOTE: VERSION MATTERS!!! USE 2.4.1.)
    (2) start the server instance by running: 'mongod'
    (3) load the data into the DB by running: './dbimport_local.sh'
    (4) instead of connecting to MongoHQ, connect to localhost. This can happen by changing the argument to mongoClient.connect on line 20 of server.js.
        Replace the line: 
            mongoClient.connect("mongodb://anna:mypwd@oceanic.mongohq.com:10044/landGrabCS132", function(err, database) {
        with the line:
            mongoClient.connect("mongodb://localhost:27017/" + dbUrl, function(err, database) {
    (4) npm update
    (5) node server.js


If you want to set up a new MongoHQ instance for some reason, then create the new instance on MongoHQ (https://app.mongohq.com/). Then run 'dbimport.sh' replacing the variables with the appropriate names, users, and password. Then update the mongoClient.connect function on line 20 of server.js to point to the right URL. 

The default admin username and password for the website:
    Username: LGAdmin
    Password: defaultAdmin


Security 
--------

Authentication is handled by express BasicAuth. While this is effective in the short term, if this website were to go live we recommend buying a certificate and using HTTPS to encrypt and send information instead of HTTP because it is a lot more secure.  As of now usernames and passwords are send and stored unencrypted.


Frontend
--------

The frontend is comprised of HTML, CSS, and javascript. It uses jQuery and an API called Mapbox. The jQuery is mostly just for animating, but I'll discuss mapbox. Mapbox is an api that lets you do all sorts of cool stuff with maps. You can load it into a div-- in our case, this takes up the whole page-- and it comes with interaction like zooming, panning, etc build into it. But it also lets you load information onto the map (our markers). It also allows you to register functions with all sorts of events. For example, when our marker is clicked, it sets the map's view to that marker and with that marker's id finds the corresponding div with its information and displays it. When zoom event occurs, the code will check the zoom level of the map currently and display corresponding search fields.

Most of the other functionality of the frontend is pretty straight forward. It makes a call on 'load' to the server to return all the data points, so it can populate the drop downs in the search area with their information. When a search is performed, the search terms are collected from the drop downs and posted to the server, which returns relevant data. Html is built to display the data in the results window. There are functions for when a marker is clicked on and for when a result list item is clicked on, which reveal a hidden div with more extensive information about that result, in the result window.

To improve user experience, the 'actionBox' div, in which search features, share features, and results are displayed, is 40% opacity when the user isn't hovering over it, which allows the user to use the map and see what's on it, even while an action window is up.



Backend
--------

The backend is written in Node.js on top of the Express framework. When the server is started it attempts to connect to the DB. If the DB is able to connect but the DB doesn’t already exist, it creates and sets up the initial landGrab database. The existing data given to us is stored in public/grabdata.json. The search POST request takes in up to 12 terms and does an inclusive search on the DB. We chose to ‘or’ our search queries because we decided it would be most helpful for users who were using the platform to search for other people who are working on the same project. Since we are trying to encourage solidarity, we want to provide as many potential sources as possible. Additionally, geospacial limitations can be placed on top of queries so that the results of the query are limited to a geographic radius.

Error handling is mostly done on the backend, as a precaution against potential threats. There is basic user input sanitation that occurs on the frontend to simplify the control flow, but any user input that could potential cause erratic behavior is tested for on the backend. Since the administrator is hand-picking  the data points that are allowed to be displayed on the map, there is no need for validating user information automatically (i.e. test that URLS are valid, etc.). There is also no thread of SQL injection, since the database does not run on SQL and so the backend does not have to sanitize user input against potential attacks.

The Administrator page is accessed at /admin.  Administrators can be made by other administrators using the "Create a new admin" form at the top of the page. Once administrators are made, they have control over what makes it on to the map. This is done as a security precaution. This administrator page is accessible for those who are authenticated, where various administrator functionality is handled (adding, removing, etc).

When users insert into the database their information is automatically set to unpublished. Only an administrator can publish and modify an existing datapoint. The latitude and longitude are generated from the location input, which is verified. The user is free to input whatever fields they wish although they are required to provide at least a name and location. If two users were to input information for the same movement, both would be inserted into the database as unpublished so the administrator could potentially consolidate the sources. The administrator can also delete nodes from the list of published and unpublished data points, which is only accessible from the administrator pages.



Bugs
-----
Although there are no known bugs, there was not work done on cross-browser compatibility outside Firefox and Chrome. It has not been tested on mobile frameworks and would probably would benefit from a mobile app that could be developed in the future.
