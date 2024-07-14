const listing = require("./models/listing.js");
const review = require("./models/review.js");
const expresserror = require("./utils/expresserror.js");
const {listingschema,reviewschema} = require("./schema.js") 

// to check whether the user is logged-in or not
module.exports.isLoggedIn = (req,res,next) =>{
      if(!req.isAuthenticated()){
            //is user is not logged in then store the url from where it 
            //is asked to login
            req.session.redirectUrl = req.originalUrl;   
            req.flash("error","you must be logged in to create listing");
            res.redirect("/login"); 
      }
      next();
}

// to redirect to the previous url
module.exports.saveredirecturl = (req,res,next) =>{
     if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
     } 
     next();
}

// to check whether the current user is the owner of some listing or review
module.exports.isowner = async (req,res,next) =>{
      let {id} = req.params;
      let listings = await listing.findById(id);
       if(!listings.owner._id.equals(res.locals.curruser._id)){
            req.flash("error","You are not the owner");
            return res.redirect(`/listings/${id}`); 
      }
      next();
}

// this is to validate the review i.e. whether some data is filled or not in the review
module.exports.validatereview = (req,res,next) =>{
      let {error} = reviewschema.validate(req.body);
      if(error){
            let errmsg = error.details.map((el)=>el.message).join(",");
            throw new expresserror(400,errmsg);
      }
      else{
            next();
      }
}  

// to check whether the current user is the author of the review
module.exports.isreviewauthor = async (req,res,next) =>{
      let {id,reviewid} = req.params;
      let reviews = await review.findById(reviewid);
       if(!reviews.author._id.equals(res.locals.curruser._id)){
            req.flash("error","You didn't create it");
            return res.redirect(`/listings/${id}`); 
      }
      next();
}