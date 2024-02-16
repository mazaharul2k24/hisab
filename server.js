const express=require("express");
require("dotenv").config();
var port=process.env.port || 151;
const app=express();
//db connectio
require("./config/db");

//passport authentaction
//cookie parser
const cookieparser=require('cookie-parser');


//view engine setup
app.set('view engine', 'ejs');

const {hisabRouter}=require('./routes/hisabroute');
const morgan=require("morgan")
app.use([
morgan("dev"),
hisabRouter,
express.static('views'),
express.static("public"),
express.json(),
express.urlencoded({extended:false}),
cookieparser(),
])


app.get('*',(req, res)=> { 
  res.render('error')
}) 
app.use((err,req, res, next) => { 
 res.send(err)
}) 
app.listen(port,()=>{
    console.log(`running at ${port}...`)
});