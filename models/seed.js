//////////////////////////////
// Import our dependencies
//////////////////////////////

// import the version of mongoose exported from connection so all the connection details are already set up
const mongoose = require("./connection");
const Fruit = require("./fruit");


//////////////////////////////
// Seed code
//////////////////////////////
// save the connection in a variable
const db = mongoose.connection;

// make sure code doesn't run until connection is open
db.on("open", () => {
  const startFruits = [
    { name: "Orange", color: "orange", readyToEat: false },
    { name: "Grape", color: "purple", readyToEat: false },
    { name: "Banana", color: "orange", readyToEat: false },
    { name: "Strawberry", color: "red", readyToEat: false },
    { name: "Coconut", color: "brown", readyToEat: false },
  ];

  Fruit.deleteMany({})
    .then(data => {
      Fruit.create(startFruits)
        .then(data => {
          console.log(data);
          db.close();
        });
    });
});
