// express library
const express = require("express");
// Makes manipulations on pathes of URL addresses
const path = require("path");
// Activates a server
const http = require("http");
// A library that ables a different domain to send requests to our server
const cors = require("cors");

// Connect to our db
require("./db/mongoConnect");
// A function that when activated defines routes on our server
const {routesInit} = require("./routes/configRoutes");

// Define a variable that represents the express and its abilities   
const app = express();

app.use(cors())

// Defines the express can get post and update requests from the body
app.use(express.json());

// Define the public folder to be a static folder that is exposed to the customer
app.use(express.static(path.join(__dirname,"public")));

// Defines the routers of our app when the server will work 
routesInit(app);

// Activates the server
const server = http.createServer(app);
server.listen(3001);
