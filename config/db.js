const mongoose=require("mongoose");
require('dotenv').config();
mongoose.connect(process.env.db_url)
.then(()=>{
    console.log("db connected")
})
.catch(()=>{  
    console.log("db not connected ");

})          


