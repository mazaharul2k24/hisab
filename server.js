const express=require("express");
require("dotenv").config();
var port=process.env.port || 151;
const app=express();
//db connectio
require("./config/db");
//passport authentaction
//cookie parser
const cookieparser=require('cookie-parser');
app.use(cookieparser());
app.use(express.urlencoded({extended:true}))
app.use(express.json());
//view engine setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('views'));
const {hisabRouter}=require('./routes/hisabroute');
app.use(hisabRouter); 
const morgan=require('morgan')
morgan('dev')
app.get('*',(req, res)=> { 
  res.render('error')
}) 
app.use((err,req, res, next) => { 
 res.send(err)
}) 
app.listen(port,()=>{
    console.log(`running at ${port}...`)
});
