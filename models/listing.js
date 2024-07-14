/*
IN THIS FILE I HAVE DEFINED THE SCHEMA OF THE LISTINGS AND THEN I HAVE MADE A MODEL OF THAT
SCHEMA WHICH I HAVE EXPORTED AT THE END
*/
const mongoose = require("mongoose");
const schema =mongoose.Schema;
const review = require("./review.js");

const listingschema = new schema({
      title:{
            type:String,
            required:true,
      },
      description:{
            type:String
      },
      image:{
            filename:String,
            url:{
                  type:String,      
                  default:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
                  // // for image if link not send or link is empty
                  // set:(v) => v===""? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60":v, 
            }, 
      },
      price:{
            type:Number
      },
      location:{
            type:String
      },
      country:{
            type:String
      },
      reviews:[
            {
                  type:schema.Types.ObjectId,
                  ref:"review",
            },
      ],
      owner:{
            type: schema.Types.ObjectId,
            ref:"User",
      }, 
      category:[
            {
                  type:String,
                  enum : ["trending","rooms","beach","mountains","castles","pools","camping",
                  "arctic","farms","domes","boats"] 
           }
      ],
});
 
listingschema.post("findOneAndDelete",async (listing)=>{
      if(listing){
          await review.deleteMany({_id : {$in: listing.reviews}})
      }
})

//making model of the listing schema and exporting it 
const listing = mongoose.model("listing",listingschema);
module.exports=listing;