//////////////////////////////
// Import our dependencies
//////////////////////////////

require("dotenv").config(); // brings in dotenv variables
const mongoose = require("mongoose"); // our database library


//////////////////////////////
// Establish database connection
//////////////////////////////

// setup the inputs for mongoose connect
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = { useNewUrlParser: true, useUnifiedTopology: true }; // passing these objects into mongoose.connect removes all the deprecation errors that are logged when running

// connect method for mongoose
mongoose.connect(DATABASE_URL, CONFIG);

// our connection messages for the .connection object
mongoose.connection
  .on("open", () => { console.log("Connected to Mongo") })
  .on("close", () => { console.log("Disconnected from Mongo") })
  .on("error", error => { console.log(error) });


// export the connection
module.exports = mongoose;
