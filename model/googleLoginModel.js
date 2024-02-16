const mongoose=require("mongoose");

const gauthScima=mongoose.Schema({
    googleId:{
        type:String,
    },
    googleDisplayName:{
   
        type:String
    },
    gfirstName:{
      
        type:String
    },
    glastName:{
    
        type:String
    },
    gprofileImage:{
    
        type:String
    }

})

module.exports=mongoose.model("googleAuth",gauthScima);