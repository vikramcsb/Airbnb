/*
it has all the routes of the listings
*/
const express = require("express");
const router = express.Router();
const wrapasync= require("../utils/wrapasync.js");
const {listingschema,reviewschema} = require("../schema.js");
const expresserror=require("../utils/expresserror.js");
const listing = require("../models/listing.js");
const {isLoggedIn,isowner} = require("../middleware.js");
 
const listingcontroller = require("../controller/listing.js");

const multer = require("multer");
const {storage} = require("../cloudconfig.js"); 
const upload = multer({storage});

//index route
//we removed app and pasted router
//we removed /listings from every path
// router.get("/",wrapasync(listingcontroller.index));

//create route
//  router.post("/",isLoggedIn,wrapasync(listingcontroller.createlisting)); 

//so we have combined both the routes index and create
router.route("/")
.get(wrapasync(listingcontroller.index))
.post(isLoggedIn,
      upload.single('listing[image]'),
      wrapasync(listingcontroller.createlisting));  

//new route
router.route("/new")
.get(isLoggedIn,listingcontroller.rendernewform);

//show route
// router.get("/:id",wrapasync(listingcontroller.showlisting));
//update route
// router.put("/:id",isLoggedIn,isowner,wrapasync(listingcontroller.updatelisting));
 //delete route
// router.delete("/:id",isLoggedIn,isowner,wrapasync(listingcontroller.destroy));
 
router.route("/:id")
.get(wrapasync(listingcontroller.showlisting))
.put(isLoggedIn,isowner,upload.single("lisitng[image]"),wrapasync(listingcontroller.updatelisting))
.delete(isLoggedIn,isowner,wrapasync(listingcontroller.destroy));

//edit route
router.get("/:id/edit",isLoggedIn,isowner,wrapasync(listingcontroller.rendereditform));
 
module.exports = router;