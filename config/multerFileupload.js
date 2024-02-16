const multer=require("multer");
const upload_path="./public/upload";
const path=require("path")
const randomString=require("randomstring").generate(10)
const storage = multer.diskStorage({
    destination:  (req, file, cb)=> {
            cb(null, upload_path)
    },
    filename:  (req, file, cb)=> {
        const fileEx=path.extname(file.originalname);
        const fileNamecreate=randomString+fileEx;
      cb(null, fileNamecreate)
    }
  });
  
const upload=multer({
    storage:storage,
  fileFilter:function(req,file,cb){
   
    const fileTyepe=file.mimetype;
    if(
        fileTyepe==="image/png" || 
        fileTyepe==="image/jpg" || 
        fileTyepe==="image/jpeg" ||
        fileTyepe==="image/gif" 
      
    ){
    cb(null,true)
    }else{
        cb("Only Allow png,jpg,jpeg and gif")
    }

  }
})

module.exports={upload};