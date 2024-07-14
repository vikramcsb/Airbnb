const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session({
      secret:"mysupersecretstring",
      resave:false,
      saveUninitialized:true
}));
app.use(flash());

app.get("/register",(req,res)=>{
      let {name="anonymous"} = req.query;
      req.session.name = name;
      if(name ==="anonymous") {
            req.flash("error","user not registered");
      }else{
            req.flash("success","user registered successfully");
      }      
      res.redirect("/hello");
}) 

app.get("/hello",(req,res)=>{
//    res.send(`hello, ${req.session.name}`);
      res.locals.successmsg = req.flash("success");
      res.locals.errormsg = req.flash("error");
      // we can also put these two lines in a middleware
      res.render("page.ejs",{name:req.session.name});
})

// app.get("/reqcount",(req,res)=>{
//       if(req.session.count){
//             req.session.count++;
//       }else{
//             req.session.count=1;
//       }

//       res.send(`you sent a request ${req.session.count} times`)
// })

// app.get("/",(req,res)=>{
//       res.send("test successful");
// })

app.listen(3000,()=>{
      console.log("server is listening");
})