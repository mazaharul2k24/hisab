const { reseMail } = require("../config/reset-mail");
const hisabModel=require("../model/hisabmodel");
const hisabBuyerModel=require("../model/hisabBuyermodel");
const hisabusersModel=require("../model/hisabUsersModel");
const {sendEmail}=require('../config/mail');
const randomstring=require("randomstring");
const bcrypt=require("bcrypt");
const hisabUsersModel = require("../model/hisabUsersModel");
const saltRounds=10;

const homeController=(req,res)=>{
    res.render('hisab')
}
    const hisabController = (req, res) => {
      res.send("hisab")
    }
    const getReviewController = (req, res) => {
      res.render("signup_review")
    }
    const getCalculateController = (req, res) => {
      res.render("calpro")
    }
 

const postSignupController=async(req,res)=>{
    const users=req.body;
    const dateadjust=new Date();
    const dateM=dateadjust.toLocaleTimeString() +" - "+ dateadjust.toLocaleDateString(); 
    const dbEmail=await hisabusersModel.findOne({userEmail:users.email});
    const dbNumber=await hisabusersModel.findOne({userNumber:users.phoneNumber});
    const dbStatus=await hisabusersModel.findOne({userEmail:users.email});
if(dbEmail || dbNumber){
if(dbStatus.userStatus=="pending"){
    res.render("login",{
        existUSer:"Verify Your Email Then Login"
    })
}else{  
    res.render("login",{
        existUSer:"Already Regester Account"
    })
}
}else{    
const idGen="hisab-"+randomstring.generate({charset:['numeric'],length:8});
const verifykeyGen="hisabkey-"+randomstring.generate({charset:['numeric'],length:12});

   bcrypt.genSalt(saltRounds, function(err, salt) {
         bcrypt.hash(users.password, salt,async function(err, hash) {

          const userSQuery=new hisabusersModel({
            userId:idGen,
            accountnumber:24+users.phoneNumber,
            userFirstName:users.firstName,
            userLastName:users.lastName,
            userEmail:users.email,
            userPhone:users.phoneNumber,
            userAddress:users.address,
            userStatus:"pending",
            userPassword:hash,
            date:dateM,
            verifyKey:verifykeyGen,
            invoiceSign:users.firstName,
            invoiceLogo:"hisabInvoicelogo.png",
         
          });
         
          const runQuery=await userSQuery.save();
          if(runQuery){

            const uEmail=users.email;
            const ufname=users.firstName;
            const uPhone=users.phoneNumber;
            const mails=sendEmail(ufname,uEmail,uPhone,verifykeyGen);
            if(mails){
                res.render("login",{  
                    success:`successfully signup Please Verify Your Email <a href="mailto:${users.email}">${users.email}</a> Then Login.`
                })
            }else{
                res.send("mail not send please try again...")
            }
    
           
          }else{
            res.render("login",{
                faild:`Something went wrong...`
            })
          }
  });
})


  
}  

}


const getHisabverifyController = async (req, res) => {
  const hisabkeyId = req.params.hisabkey;
  const updateQuery = await hisabusersModel.findOne({
    verifyKey: hisabkeyId,
  });

  if (updateQuery.userStatus == "pending") {
    updateQuery.userStatus = "verified";
    const Vemail = updateQuery.userEmail;
    await updateQuery.save();

    res.render("emilverify", {
      vEmail: Vemail,
    });
  } else if (updateQuery.userStatus == "verified") {
    const aemail = updateQuery.userEmail;
    res.render("emilverify", {
      aEmail: aemail,
      adata: "This Email Already Verified",
    });
  } else {
    res.render("error");
  }
};


const postLoginController = async (req, res) => {
  const userLoginData = req.body;
  const loginDataMacthtry = await hisabusersModel.findOne({userEmail: userLoginData.email});
  const match = await bcrypt.compare(userLoginData.password,loginDataMacthtry.userPassword);


  if (loginDataMacthtry &&match&&loginDataMacthtry.userStatus == "verified") {
    const hisabIdgen=loginDataMacthtry.userId;
    res.cookie("hisabId",hisabIdgen,{
maxAge:((((1000*60)*60)*24)*155),
httpOnly:true

    }).redirect("/profile");
  } else if (loginDataMacthtry && match && loginDataMacthtry.userStatus == "pending") {
    res.render("login",{
      notVeri:"Please Verify Your Email Then Login"
    })
  } else {
    res.render("login",{
      wrong:"Please provide correct info"
    })
  }
};  


const getcalproController=async(req,res)=>{
  const cruser = req.cookies.hisabId;
  const cruserDta=await hisabusersModel.findOne({userId:cruser});
  if(cruserDta){
 const {pid,pname,pprice,pquantity,pinDate,ptoken,ptotalprice}=req.body;
 const {btoken,bname,baddr,bnmbr}=req.body;
var proData=[];
const email=cruserDta.userEmail;
for (let index =0; index < pname.length; index++) {
  const id=pid[index];
const productName=pname[index];
const productPrice=pprice[index];
const pQnty=pquantity[index];
const entryDate=pinDate[index];
const entryToken=ptoken[index];
const pTotal=ptotalprice[index];
proData.push({id,productName,productPrice,pQnty,entryDate,entryToken,pTotal,email})
}

//buyer Info store


const dataInserDb=await hisabModel.insertMany(proData);
const buyerInfoSave=new hisabBuyerModel({
  buyerToken:btoken,
  buyerName:bname,
  buyerAddress:baddr,
  buyerPhone:bnmbr
});

await buyerInfoSave.save();

if(dataInserDb && buyerInfoSave){

  const Etoen=proData[0].entryToken;

res.render("calculate",{
  inserted:Etoen
})

}else{
 res.render("calculate",{
  notinsert:"পণ্যের তথ্য যোগ করা হয় নাই ..."
})

}
}else{
  res.render("unuser")
}
}


const getContactController=async(req,res)=>{
  const cruserid=req.cookies.hisabId;
  const fechcrdata=await hisabusersModel.findOne({userId:cruserid});

  if(fechcrdata){
    const crData1={
      fname:fechcrdata.userFirstName,
      lname:fechcrdata.userLastName,
      email:fechcrdata.userEmail
      }
res.render("contact",{
  crData:crData1
})
  }else{
    res.render("unuser")
  }

}



const getFindProfileController = async (req, res) => {
  const sData = req.params.findtoken;
  const dataRec = sData.trim();
  const crHisabuser = req.cookies.hisabId;
  const crUSerIdmacthTry = await hisabusersModel.findOne({
    userId: crHisabuser,
  });
  if (crUSerIdmacthTry) {
    crUserEmail = crUSerIdmacthTry.userEmail;
    const userProduct = await hisabModel.find({
      entryToken: dataRec,
      email: crUserEmail,
    });
    if (userProduct.length > 0) {
      const uId = userProduct[0].entryToken;

      var sum = parseInt(0);

      for (let index = 0; index < userProduct.length; index++) {
        const pprice = parseInt(userProduct[index].pTotal);
        sum = sum + pprice;
      }
      const dt = new Date();
      const adDatee = dt.toLocaleDateString() + "-" + dt.toLocaleTimeString();
      const crUserInfoAdd = {
        fname: crUSerIdmacthTry.userFirstName,
        lname: crUSerIdmacthTry.userLastName,
        status: crUSerIdmacthTry.userStatus,
        phone: crUSerIdmacthTry.userPhone,
        addr: crUSerIdmacthTry.userAddress,
        invoiceSign:crUSerIdmacthTry.invoiceSign,
        logopath:crUSerIdmacthTry.invoiceLogo,
        ivcno: uId,
        prDaet: adDatee,
      };


      const buyerDetails=await hisabBuyerModel.findOne({buyerToken:dataRec});

      if(buyerDetails){
        res.render("profileInvoice", {
          searchProduct: userProduct,
          sProductId: uId,
          userIn: crUserInfoAdd,
          totalCost: sum,
          bDetails:buyerDetails
        });
  
      }else{
        console.log("Data Not Found...")
      }


     
    } else {
      res.render("findhisab", {
        notFound: "Product Not Found ",
      });
    }
  } else {
    res.render("unuser");
  }
};


const getProfileController=async(req,res)=>{
  const crUserId= req.cookies.hisabId;
  const crSUerfind = await hisabusersModel.findOne({
    userId: crUserId,
  });

  if(crSUerfind){
    const cruserEmail=crSUerfind.userEmail;
    const prodInfoClt=await hisabModel.find({email:cruserEmail});
    
    if(prodInfoClt){

const dArrceyfind=(data)=>{
  const duplicates= data.filter((index,val)=>data.indexOf(index)===val);
 return duplicates;
}
var tokenarr=[]
prodInfoClt.forEach(element => {
  tokenarr.push(element.entryToken);
});
const tokenA=dArrceyfind(tokenarr);
const tokenSort=[];

tokenA.forEach(element => {
tokenSort.push(element)

});


      const cruserInfoBndl={
        acno:crSUerfind.accountnumber,
        fname:crSUerfind.userFirstName,
        lname:crSUerfind.userLastName,
        email:crSUerfind.userEmail,
        phone:crSUerfind.userPhone,
        address:crSUerfind.userAddress,
        status:crSUerfind.userStatus,
        userid:crSUerfind.userId,
        pimg:crSUerfind.profileImage,
        postcode:crSUerfind.postcode,
        invoiceSign:crSUerfind.invoiceSign,
        invoiceLogo:crSUerfind.invoiceLogo

      
      }

      res.render("users/profile",{
        userInfo:cruserInfoBndl,
        productInfo:prodInfoClt,
        token:tokenSort.reverse(),
        updatecount:crSUerfind.updateCount
        
       
      })
     
 
     
    }else{
      res.send("Product Data Invalid")
    }

  }else{
    res.redirect("/unuser")
  }


 
}

const getUpdateProfileinfoController=async(req,res)=>{
  try {

    const bdata=req.body;
  const crUserId= req.cookies.hisabId;

  const upQueryfind=await hisabusersModel.findOne({userId:crUserId});
  if(upQueryfind){

    var filename="";
    if(typeof req.file=="undefined"){
     filename=upQueryfind.profileImage;
    
    }else{
   filename=req.file.filename;
   
    }
    var upcount=parseInt(upQueryfind.updateCount)+1;

    upQueryfind.userFirstName=bdata.ufnm;
    upQueryfind.userLastName=bdata.ulnm;
    upQueryfind.postcode=bdata.upcode;
    upQueryfind.userAddress=bdata.uaddr;
    upQueryfind.updateCount=upcount;
    upQueryfind.profileImage=filename;
    await upQueryfind.save();
    res.redirect("/profile")

  }else{
    res.send("Not updatetd")
  }


  } catch (error) {
    console.log(error)
  }
  
}

const getdeleteHisabController = async (req, res) => {
  try {
    const dltToken = req.params.dlttoken;
    const dltQuery = await hisabModel.deleteMany({ entryToken: dltToken });

    if (dltQuery) {
      res.redirect("/profile");
    } else {
      console.log("Not success delete");
    }
  } catch (error) {
    console.log(error);
  }
};

const getChangepasswordController=async(req,res)=>{
try {
  const cruser=req.cookies.hisabId;
  const {crpass,cnpass,cncpass}=req.body;
  const crUserfind=await hisabusersModel.findOne({userId:cruser});
  if(crUserfind){
    if(crUserfind.userPassword==crpass ){
if(cnpass===cncpass){
  crUserfind.userPassword=cncpass;
  if(await crUserfind.save()){
    res.clearCookie("hisabId").send("password change successfull");
  }else{
    res.send("password not change!")
  }
  
}else{
  res.send("confirm password wrong!")
}
    }else{
res.send("password incorrect!")
    }
    
  }else{
    res.redirect("/unuser");
  }
} catch (error) {
  res.send(error)
  
}

}

const getResetPassController=(req,res)=>{
  res.render("users/resetpass")
}
const postResetPassController=async(req,res)=>{
  const bdaat=req.body.remail;

  const findResetUser=await hisabusersModel.findOne({userEmail:bdaat});
if(findResetUser){
  const ufname=findResetUser.userFirstName + findResetUser.userLastName;
  const uEmail=findResetUser.userEmail;
  try {
    const tamporaryPass=parseInt((Math.random()*9999)+999);
    const uPass=tamporaryPass;
    findResetUser.userPassword=tamporaryPass;
await findResetUser.save();

    reseMail(ufname,uEmail,uPass);




    res.render("users/resetpass",{
      sendS:`Reset Email Send Successfull Please Check Your Email ${uEmail}`
    })
  } catch (error) {
    res.render("users/resetpass",{
      error:"Something went Wrong"
    })
  }

}else{
  res.render("users/resetpass",{
    faild:"Invalid Email Address"
  })
}

}




const upInvoiceController=async(req,res)=>{
  const fs=require("fs")
  const {osign}=req.body;
  const crUserId= req.cookies.hisabId;
  const updateIquery=await hisabUsersModel.findOne({userId:crUserId});
  if(updateIquery){
    var filenamew="";
    if(typeof req.file=="undefined"){
      filenamew=updateIquery.invoiceLogo;
    
      
    
    }else{
      filenamew=req.file.filename;
      // fs.unlink(`./upload/${filenamew}`,(err)=>{
      //   console.log(err)
      // })
 
   
    }

updateIquery.invoiceSign=osign,
updateIquery.invoiceLogo=filenamew
await updateIquery.save();
res.redirect("/profile")



  }else{
    console.log("something went wrong...")
  }

}



module.exports = {
  homeController,
  hisabController,
  getReviewController,
  getCalculateController,

  postSignupController,
  getHisabverifyController,
  postLoginController,
  getcalproController,
  getContactController,
  getFindProfileController,
  getProfileController,
  getdeleteHisabController,
  getUpdateProfileinfoController,
  getChangepasswordController,
  getResetPassController,
  postResetPassController,
  upInvoiceController
};
   