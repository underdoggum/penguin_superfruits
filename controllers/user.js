//////////////////////////////
// Import our dependencies
//////////////////////////////
// need to import express because that's how we actually use the router
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");


//////////////////////////////
// Create router
//////////////////////////////
const router = express.Router();


//////////////////////////////
// Routes
//////////////////////////////

// the signup routes (get -> form, post -> form submission)
// "/user/signup"
router.get("/signup", (req, res) => {
  res.render("user/signup.liquid");
});

router.post("/signup", async (req, res) => {
  // encrypt the password (replacing the password with the hashed version of the password)
  // note: this line will never change for encrypting the password!
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));

  // save the user to our database
  User.create(req.body)
    .then(user => {
      console.log(user);
      // redirect user to login
      res.redirect("/user/login");
    })
    .catch(error => {
      res.json({ error });
    });
});

// the login routes (get -> form, post -> form submission)
// "/user/login"
router.get("/login", (req, res) => {
  res.render("user/login.liquid");
});

router.post("/login", async (req, res) => {
  // destructure the username and password from req.body
  const { username, password } = req.body;
  
  // search for the user
  User.findOne({ username })
    .then(async (user) => {
      // check if the user exists
      if (user) {
        // compare passwords
        // note that we need to use bcrypt's compare function because we don't know how the hashing works
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          // store some data in the session object for storing the fact that the user is now logged in
          req.session.username = username;
          req.session.loggedIn = true;
          // redirect to fruits index page
          res.redirect("/fruits");
        } else {
          res.json({ error: "password doesn't match" });
        }
      } else {
        // if the user does not exist, send an error
        res.json({ error: "user doesn't exist" });
      }
    })
    .catch(error => {
      res.json({ error });
    });
});

// create a logout route (get request to /user/logout), basically destroy the session
router.get("/logout", (req, res) => {
  // destroy the session
  req.session.destroy(error => {
    res.redirect("/");
  })
})



module.exports = router;
