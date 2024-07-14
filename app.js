if(process.env.NODE_ENV != "production"){
      require('dotenv').config();
} 
const port = process.env.PORT || 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
// const wrapasync= require("./utils/wrapasync.js");
const expresserror=require("./utils/expresserror.js");
// const {listingschema,reviewschema} = require("./schema.js");
// const review = require("./models/review.js");
const session = require("express-session"); 
const flash = require("connect-flash");
const listing = require("./models/listing.js");

//related to passport
const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./models/user.js");

//here we have required all the routes of listings, reviews and users
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter  = require("./routes/user.js");

// this code is to connect with our database
main()
.then(()=>{
      console.log("mongo server connected");
})
.catch((err)=>{
      console.log(err);
})

async function main(){
      await mongoose.connect(process.env.mongo_url);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionoptions = {
      secret :"mysupersecretcode",
      resave : false,
      saveUninitialized : true,
      cookie :{
            expires : Date.now()+ 7*24*60*60*1000,
            maxage : 7*24*60*60*1000,
            httpOnly : true
      }
}

// app.get("/",(req,res) =>{
//       res.send("i am root");
// })

app.use(session(sessionoptions));
app.use(flash());

//passport ke middlewares also use session middlewares
app.use(passport.initialize());
//taki hme ek hi session me bar bar login na krna pre
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.use((req,res,next)=>{
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      //store data of current user
      res.locals.curruser = req.user;
      next();
}) 

//creating demo user
// app.get("/demouser",async (req,res)=>{
//       let fakeuser = new user({
//             email:"student@gmail.com",
// // though not declared in schema mongoose adds username
//             username:"delta-student"
//       });
//       let newuser=await user.register(fakeuser,"helloworld");
//       res.send(newuser);
// })

// all listing routes are in listing.js in routes
app.use("/listings",listingRouter);
// all review routes are in review.js in routes
app.use("/listings/:id/reviews",reviewRouter);
//all user routes are in user.js
app.use("/",userRouter); 

app.post("/filter",async (req,res) =>{
      let {location_s} = req.body;
      // conversion of string in camel case
      let string="";
      location_s=location_s.trim();
      location_s=location_s.toLowerCase();
      for(let i=0;i<location_s.length;i++){
            if(i==0){
                if(location_s[i]>='a' && location_s[i]<='z'){
                  string+=location_s[i].toUpperCase();
                }
                else string+=location_s[i];
            }
            else{
                if(location_s[i-1]==' ' && (location_s[i]>='a' && location_s[i]<='z'))  
                  string+=location_s[i].toUpperCase();
                else string+=location_s[i];
            }
      }
      // console.log(string);
      const alllistings = await listing.find(
      {$or:[{location:string},{country:string}]});
      if(alllistings.length==0){
            req.flash("error","No match found your search");
            res.redirect("/listings");
      } 
      res.render("listings/index.ejs",{alllistings});
})

app.get("/filter/:filter_option",async (req,res) =>{
      let {filter_option} = req.params;
      const alllistings = await listing.find({category : {$in : [`${filter_option}`]}});
      res.render("listings/index.ejs",{alllistings});
})

app.use("*",(req,res,next)=>{
      next(new expresserror(404,"page not found"));
});

// app.get("/testlisting",async (req,res)=>{
//       let samplelisting = new listing({
//             title:"My new villa",
//             description:"By the beach",
//             price:1200,
//             location:"Calangute, Goa",
//             country:"India",
//       });
//       await samplelisting.save();
//       res.send("successful testing");
// })

app.use((err,req,res,next)=>{
      let {statusCode=500,message="Something went wrong"} =err; 
      res.render("error.ejs",{err});
      // res.status(statusCode).send(message);
})

//this is to connect the server i.e to listen to the server requests
app.listen(port,()=>{
      console.log("listening to port");
})
