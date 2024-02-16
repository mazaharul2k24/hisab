const mongoose=require("mongoose");

const buyerSchima=mongoose.Schema({
    buyerToken:{
        require:true,
        type:String
    },
    buyerName:{
        require:true,
        type:String
    },
    buyerAddress:{
        require:true,
        type:String
    },
buyerPhone:{
        require:true,
        type:String
    },
    
})

module.exports=mongoose.model("hisabBuyerTable",buyerSchima);
