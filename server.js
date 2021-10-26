//////////////////////////////
// Import our dependencies
//////////////////////////////

require("dotenv").config(); // brings in dotenv variables
const express = require("express"); // web framework
const morgan = require("morgan"); // logger
const methodOverride = require("method-override"); // to swap request methods
const path = require("path"); // helper functions for file paths
const FruitsRouter = require("./controllers/fruit");
const UserRouter = require("./controllers/user");
const session = require("express-session");   // session middleware
const MongoStore = require("connect-mongo");


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
// ability to parse urlencoded from form submission and place in req.body
app.use(express.urlencoded({ extended: true }));
// setup public folder to serve files locally
app.use(express.static("public"));
// middlware to create sessions (req.sessions)
app.use(session({
  secret: process.env.SECRET,
  store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  resave: false,
  saveUninitialized: true,
}));


//////////////////////////////
// Routes
//////////////////////////////

app.get("/", (req, res) => {
  res.render("index.liquid");
});

// Register the Fruits Router
// and since we're saying below to look into the "/fruits" folder, we can remove it from the controllers/fruit.js file
// BUT don't change the res.render() or res.redirect() routes passed into them!

// register fruits router
app.use("/fruits", FruitsRouter);

// register user router
app.use("/user", UserRouter);



//////////////////////////////
// Setup server listener
//////////////////////////////
// we can't choose the port number for heroku. Heroku will assign us one

// grab the port number from the environment
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
