const mongoose = require("mongoose");
/*
requiring all the data (as an object having an array named as data)
initdata ={
      data: [];
}
*/
const initdata = require("./data.js");
//requiring the model of the listings
const listing = require("../models/listing.js"); 

//connection with the mongodb
main()
.then(()=>{
      console.log("mongo server connected");
})
.catch((err)=>{
      console.log(err);
})

async function main(){
      console.log(process.env.mongo_url);
      await mongoose.connect("mongodb+srv://vikramkhedar123:%40EMAILIDv123@cluster0.mhgmuc8.mongodb.net/wanderlust");
}

//code to initialise database 
const initdb = async() =>{
      //to delete all data if any present (database ko khali kr rhe h)
      await listing.deleteMany({});
      /*
      initdata have an array named data so we will use map function for every element of the 
      data so we can insert the owner id
      this "..." is called as SPREAD OPERATOR and expands the iterable value to individual
      values 
      */
      initdata.data=initdata.data.map((obj) =>({...obj,owner:"6692e8b08e66d63e07b43f7d"}));
      //to insert the total data to the database
      await listing.insertMany(initdata.data);
      console.log(initdata.data);
      console.log("data was initialized");
}

initdb(); 