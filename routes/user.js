/*
it has all the routes related to the user like for login , signup and log-out
*/
const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");

// form route for signup
//to save user to database
router.route("/signup")
.get(usercontroller.rendersignupform)
.post(wrapasync(usercontroller.signup));

//login page 

router.route("/login")
.get(usercontroller.renderloginform)
.post(saveredirecturl,
      passport.authenticate("local",
            {failureRedirect:'/login',
            failureFlash: true
      }),
      usercontroller.login
);

router.get("/logout",usercontroller.logout)

module.exports = router;   