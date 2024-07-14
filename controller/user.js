const user = require("../models/user.js");

module.exports.rendersignupform = (req,res)=>{
      res.render("users/signup.ejs");
};

module.exports.signup = async (req,res) =>{
      try{
            let {username,email,password} = req.body; 
            let  newuser = new user({email,username});
            let registereduser = await user.register(newuser,password);  
            console.log(registereduser);
            //to directly login a user
            req.login(registereduser,(err)=>{
               if(err){
                  next(err);
               }
               req.flash("success","Welcome to wanderlust");
               res.redirect("/listings");
            })
      }catch(err){
            req.flash("error",err.message);
            res.redirect("/signup");
      }
};

module.exports.renderloginform = (req,res)=>{
      res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
      req.flash("success","Welcome to Wanderlust!!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
      req.logout((err)=>{
        if(err){
              next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
      })
};