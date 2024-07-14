/*
it has all the routes of the reviews
*/
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync= require("../utils/wrapasync.js");
const {listingschema,reviewschema} = require("../schema.js");
const expresserror=require("../utils/expresserror.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");
const {validatereview,isLoggedIn, isreviewauthor} = require("../middleware.js");
const reviewcontroller = require("../controller/review.js"); 

//validate reviews is in middlewares

//reviews
//post route
//  path /listings/:id/reviews
router.post("/",isLoggedIn,
    validatereview,
    wrapasync(reviewcontroller.createreview)
);
 
 //delete review route
 // path => /listings/:id/reviews/:reviewid
router.delete("/:reviewid",
    isLoggedIn,
    isreviewauthor,
    wrapasync(reviewcontroller.destroyreview)
); 

module.exports = router;