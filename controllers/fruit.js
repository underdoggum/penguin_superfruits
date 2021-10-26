//////////////////////////////
// Import our dependencies
//////////////////////////////

const express = require("express");
const Fruit = require("../models/fruit");


//////////////////////////////
// Create a router
//////////////////////////////

const router = express.Router();


//////////////////////////////
// Router Middleware
//////////////////////////////
// middlware to check if user is logged in
router.use((req, res, next) => {
  // check if logged in
  if (req.session.loggedIn) {
    // send to routes
    next();
  } else {
    res.redirect("/user/login")
  }
})


//////////////////////////////
// Fruits Routes
//////////////////////////////

// removed the below route because we're seeding via "npm run seed" which pulls from the /models/seed.js
// // seed route - seeds our starter data
// router.get("/seed", (req, res) => {
//   // array of starter fruits
  
// });

// Routes
// index route - get - /fruits
router.get("/", (req, res) => {
  // find all the fruits
  Fruit.find({ username: req.session.username })
    .then(fruits => {
      // render the index template with the fruits
      res.render("fruits/index.liquid", { fruits });
    })
    .catch(error => {
      res.json({ error });
    })
});

// new route - get - /fruits/new (purpose: to render the form for generating new fruits)
router.get("/new", (req, res) => {
  res.render("fruits/new.liquid");
});

// create route - post /fruits
router.post("/", (req, res) => {
  // bc of checkbox property, need to convert to true or false instead of "on" or "off"
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;

  // add the username to req.body, to track user
  req.body.username = req.session.username;

  // create the new fruit
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
router.get("/:id/edit", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
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
router.get("/:id", (req, res) => {
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


module.exports = router;
