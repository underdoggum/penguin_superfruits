//////////////////////////////
// Import our dependencies
//////////////////////////////

const mongoose = require("./connection"); // our database library


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
  username: String,
});

// make the fruit model
// convention: models are always uppercase and singular!
const Fruit = model("Fruit", fruitsSchema);


module.exports = Fruit;
