const {listingschema,reviewschema} = require("../schema.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");

module.exports.createreview = async (req,res)=>{
      let Listing = await listing.findById(req.params.id);
      let newreview = new review(req.body.review);
      newreview.author = req.user._id;
      Listing.reviews.push(newreview);
      await newreview.save();
      await Listing.save();
 
      console.log("new review saved"); 
      req.flash("success","New review created");
      res.redirect(`/listings/${Listing._id}`);
};

module.exports.destroyreview = async(req,res)=>{
      let {id,reviewid} = req.params;
      listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
      await review.findByIdAndDelete(reviewid); 
      req.flash("success","Review deleted");
      res.redirect(`/listings/${id}`);
};