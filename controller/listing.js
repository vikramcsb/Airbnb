/*
this file is having all the code of the listing routes. 
1). for displaying all lists
2). for showing a particular listing
3). to update the listing
4). to delete a particular listing
5). to create a new list
*/

const listing = require("../models/listing");
const {listingschema,reviewschema} = require("../schema.js");

//to show all the listings
module.exports.index = async (req,res)=>{
      const alllistings = await listing.find({});
      res.render("listings/index.ejs",{alllistings});
 };

//to render form for creation of new listing
module.exports.rendernewform = (req,res)=>{   
      res.render("listings/new.ejs"); 
};

//to show the listing completely 
module.exports.showlisting = async (req,res) =>{
      let {id} =req.params;
      const listings = await listing.findById(id)
      .populate({path:"reviews",
        populate:{path:"author"}})
      .populate("owner"); 
      // console.log(listings);
      if(!listings){
        req.flash("error","Lisitng you requested for does not exist");
        res.redirect("/listings");
        }
      //   console.log(listings);
      res.render("listings/show.ejs",{listings});
};

//to create the listing after the form is submitted(send a listing object)
module.exports.createlisting = async (req,res,next)=>{      
      // if(!req.body.listing){
      //       throw new expresserror(400,"send valid data for lisitng");
      // }
      let result=listingschema.validate(req.body);
      // console.log(result);
      //now pasting the link from cloud
      let url = req.file.path;
      let filename = req.file.filename;
      
      const nlisting= new listing(req.body.listing);
      nlisting.owner = req.user._id;
      nlisting.image = {filename,url}; 
      // console.log(nlisting.image.url);
      // if(!nlisting.title){
      //       throw new expresserror(400,"title missing");
      // }
      await nlisting.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listings");
};

//to render the edit form 
module.exports.rendereditform = async (req,res) =>{
      let {id} =req.params;
      const listings = await listing.findById(id);
      if(!listings){
           req.flash("error","Lisitng you requested for does not exist");
           res.redirect("/listings");
      }
      let originalimageurl = listings.image.url;
      let newurl = originalimageurl.replace("/upload","/upload/w_250"); 
      res.render("listings/edit.ejs",{listings,newurl});  
};

//to update the listing 
module.exports.updatelisting = async(req,res)=>{
      if(!req.body.listing){
            throw new expresserror(400,"send valid data for lisitng");
      }
      let {id} =req.params;
      let nlisting=await listing.findByIdAndUpdate(id,{...req.body.listing}); 
      
      //agr request me file exist krti h to ye sb krna h 
      //sbse phle url and filename extract kro and db me save krdo
      if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            nlisting.image={filename,url};
            await nlisting.save();
      }

      req.flash("success","Lisiting updated!!");
      res.redirect(`/listings/${id}`);
};

// to delete a listing
module.exports.destroy = async(req,res)=>{
      let {id} =req.params;
      await listing.findByIdAndDelete(id); 
      req.flash("success","listing deleted");
      res.redirect(`/listings`);
};