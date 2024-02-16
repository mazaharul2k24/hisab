const mongoose=require("mongoose");
const hisabSchima=mongoose.Schema({
    id:{
        require:true,
        type:String
    },
    productName:{
        require:true,
        type:String

    },
    productPrice:{
        require:true,
        type:String
    },
    pQnty:{
        require:true,
        type:String
    },
    entryDate:{
        require:true,
        type:String 
    },
    entryToken:{
        require:true,
        type:String
    },
    email:{
        require:true,
        type:String
    },
   
    pTotal:{
        require:true,
        type:String,
       
    }
}) 
module.exports=mongoose.model("hisabTable",hisabSchima);