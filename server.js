//////////////////////////////
// Import our dependencies
//////////////////////////////

require("dotenv").config(); // brings in dotenv variables
const express = require("express"); // web framework
const morgan = require("morgan"); // logger
const methodOverride = require("method-override"); // to swap request methods
const mongoose = require("mongoose"); // our database library
const path = require("path"); // helper functions for file paths


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


//////////////////////////////
// Create our fruits model
//////////////////////////////

// we're going to try out destructuring here to pull out the variables we need
// it will look inside mongoose to see if it has a "Schema" and "model" object, then store them in the "Schema" and "model" variables
const { Schema, model } = mongoose;

// make a fruits schema
// have to use the "new" keyword because it's a constructor function
const fruitsSchema = new Schema({
  name: String,
  color: String,
  readyToEat: Boolean,
});

// make the fruit model
// convention: models are always uppercase and singular!
const Fruit = model("Fruit", fruitsSchema);
// console.log(Fruit);


//////////////////////////////
// Create our app with object, configure liquid
//////////////////////////////

// import liquid
const liquid = require("liquid-express-views");

// construct an absolute path to our views folder
// "__dirname" is a javascript variable which is where you're running the program (I think?)
const viewsFolder = path.resolve(__dirname, "views/");
// console.log(viewsFolder);

// create an app object with liquid, passing the path to the views folder
const app = liquid(express(), { root: viewsFolder });
// console.log(app);


//////////////////////////////
// Register our middleware
//////////////////////////////

// logging, setting to tiny keeps the logs short
app.use(morgan("tiny"));
// ability to override request methods
app.use(methodOverride("_method"));
// ability to parse urlencoded from form submission
app.use(express.urlencoded({ extended: true }));
// setup public folder to serve files locally
app.use(express.static("public"));








//////////////////////////////
// Routes
//////////////////////////////

app.get("/", (req, res) => {
  res.send("Your server is running, better catch it!");
});


//////////////////////////////
// Fruits Routes
//////////////////////////////

// seed route - seeds our starter data
app.get("/fruits/seed", (req, res) => {
  // array of starter fruits
  const startFruits = [
    { name: "Orange", color: "orange", readyToEat: false },
    { name: "Grape", color: "purple", readyToEat: false },
    { name: "Banana", color: "orange", readyToEat: false },
    { name: "Strawberry", color: "red", readyToEat: false },
    { name: "Coconut", color: "brown", readyToEat: false },
  ];

  Fruit.deleteMany({})
    .then(data => {
      // seed the starter fruits
      Fruit.create(startFruits)
        .then(data => {
          // send created fruits back as json
          res.json(data)})
    });
});

// Routes
// index route - get - /fruits
app.get("/fruits", (req, res) => {
  // find all the fruits
  Fruit.find({})
    .then(fruits => {
      // render the index template with the fruits
      res.render("fruits/index.liquid", { fruits });
    })
    .catch(error => {
      res.json({ error });
    })
});

// new route - get - /fruits/new (purpose: to render the form for generating new fruits)
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.liquid");
});

// create route - post /fruits
app.post("/fruits", (req, res) => {
  // bc of checkbox property, need to convert to true or false instead of "on" or "off"
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  Fruit.create(req.body)
    .then(fruits => {
      // redirect user if successfully created the item
      res.redirect("/fruits");
    })
    .catch(error => {
      console.log(error);
      res.json({ error });
    });
});

// edit route - get - /fruits/:id/edit
app.get("/fruits/:id/edit", (req, res) => {
  const id = req.params.id;

  Fruit.findById(id)
    .then(fruit => {
      res.render("fruits/edit.liquid", { fruit });
    })
    .catch(error => {
      console.log(error);
      res.json({ error });
    });
});

// update route - put - /fruits/:id
app.put("/fruits/:id", (req, res) => {
  const id = req.params.id;
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;

  // updating the item with the matching id
  Fruit.findByIdAndUpdate(id, req.body, { new: true })
    .then(fruit => {
      res.redirect("/fruits");
    })
    .catch(error => {
      console.log(error);
      res.json({ error });
    });
});

// destroy route - delete - /fruits/:id
app.delete("/fruits/:id", (req, res) => {
  const id = req.params.id;
  Fruit.findByIdAndRemove(id)
    .then(fruit => {
      res.redirect("/fruits");
    })
    .catch(error => {
      console.log(error);
      res.json({ error });
    });
});

// show route - get - /fruits/:id
app.get("/fruits/:id", (req, res) => {
  const id = req.params.id;

  // get that particular fruit from the database
  Fruit.findById(id)
    .then(fruit => {
      // render the show page with the fruit that was returned by the promise
      res.render("fruits/show.liquid", { fruit });
    })
    .catch((error) => {
      res.json({error});
  });
});





//////////////////////////////
// Setup server listener
//////////////////////////////
// we can't choose the port number for heroku. Heroku will assign us one

// grab the port number from the environment
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
