land-grab
=========

Mapping the Global Land Grab

=========

Outline
--------

The purpose of this project is to provide a web application for users across the world to consolidate information about various movements involving land-grab. The can see land-grab movements on the map as well as search by name, location, and other tags. The administrator can vet movements submitted by users, as well as submit their own and curate the existing collection.

There are two main components to our application, the frontend (Mapbox, jQuery, javascript, html/css) and the backend (Node.js, Express, Mongodb).

The backend is written in node.js on the Express framework. The backend is implemented in MongoDB, a NoSQL database. We chose to use Mongo because of the ease of use and the potential for geospacial querying. The frontend sends asynchronous queries to the backend to populate the map.

To run: start a ‘mongod’ instance, then run ‘node server.js’.
To import a JSON file into the DB, use:
    $ mongoimport --jsonArray --db landGrab --collection mapPoints --file public/grabdata.json
    (and to populate the users collection)
    $ mongoimport --jsonArray --db landGrab --collection users --file public/userdata.json
To print all the contents of the DB:
    $ mongo
        > use landGrab
        > db.mapPoints.find()
To tell mongod to use a specific directory:
    $ mongod --dbpath <dir>

Default admin:
    Username: LGAdmin
    Password: defaultAdmin

Security
--------

Authentication is handled by express BasicAuth. While this is effective in the short term, if this website were to go live we recommend buying a certificate and using HTTPS to encrypt and send information instead of HTTP because it is a lot more secure.


Frontend
--------

The frontend is comprised of HTML, CSS, and javascript. It uses jQuery and an API called Mapbox. The jQuery is mostly just for animating, but I'll discuss mapbox. Mapbox is an api that lets you do all sorts of cool stuff with maps. You can load it into a div-- in our case, this takes up the whole page-- and it comes with interaction like zooming, panning, etc build into it. But it also lets you load information onto the map (our markers). It also allows you to register functions with all sorts of events. For example, when our marker is clicked, it sets the map's view to that marker and with that marker's id finds the corresponding div with its information and displays it. When zoom event occurs, the code will check the zoom level of the map currently and display corresponding search fields.

Most of the other functionality of the frontend is pretty straight forward. It makes a call on 'load' to the server to return all the data points, so it can populate the drop downs in the search area with their information. When a search is performed, the search terms are collected from the drop downs and posted to the server, which returns relevant data. Html is built to display the data in the results window. There are functions for when a marker is clicked on and for when a result list item is clicked on, which reveal a hidden div with more extensive information about that result, in the result window.

To improve user experience, the 'actionBox' div, in which search features, share features, and results are displayed, is 40% opacity when the user isn't hovering over it, which allows the user to use the map and see what's on it, even while an action window is up.



Backend
--------

The backend is written in Node.js on top of the Express framework. When the server is started it attempts to connect to the DB. If the DB is able to connect but the DB doesn’t already exist, it creates and sets up the initial landGrab database. The existing data given to us is stored in public/grabdata.json. The search POST request takes in up to 12 terms and does an inclusive search on the DB. We chose to ‘or’ our search queries because we decided it would be most helpful for users who were using the platform to search for other people who are working on the same project. Since we are trying to encourage solidarity, we want to provide as many potential sources as possible. Additionally, geospacial limitations can be placed on top of queries so that the results of the query are limited to a geographic radius.

Error handling is mostly done on the backend, as a precaution against potential threats. There is basic user input sanitation that occurs on the frontend to simplify the control flow, but any user input that could potential cause erratic behavior is tested for on the backend. Since the administrator is hand-picking  the data points that are allowed to be displayed on the map, there is no need for validating user information automatically (i.e. test that URLS are valid, etc.). There is also no thread of SQL injection, since the database does not run on SQL and so the backend does not have to sanitize user input against potential attacks.

Administrators can be made by the head administrator, which in this case would be Professor Perry. Once administrators are made, they have control over what makes it on to the map but cannot create other administrators. This is done as a security precaution. Separate administrator pages are accessible for those who are authenticated, where various administrator functionality is handled (adding, removing, etc).

When users insert into the database their information is automatically set to unpublished. Only an administrator can publish and modify an existing datapoint. The latitude and longitude are generated from the location input, which is verified. The user is free to input whatever fields they wish although they are required to provide at least a name and location. If two users were to input information for the same movement, both would be inserted into the database as unpolished so the administrator could potentially consolidate the sources. The administrator can also delete nodes from the list of published and unpublished data points, which is only accessible from the administrator pages.



Bugs
-----
Although there are no known bugs, there was not work done on cross-browser compatibility outside Firefox and Chrome. It has not been tested on mobile frameworks and would probably would benefit from a mobile app that could be developed in the future.
