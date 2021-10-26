//////////////////////////////
// Import our dependencies
//////////////////////////////

const mongoose = require("./connection"); // our database library


//////////////////////////////
// Create our user model
//////////////////////////////

const { Schema, model } = mongoose;

// make a user schema
// have to use the "new" keyword because it's a constructor function
const usersSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  readyToEat: Boolean,
});

// make the user model
// convention: models are always uppercase and singular!
const User = model("User", usersSchema);


module.exports = User;
