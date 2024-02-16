const hisabRouter = require("express").Router();
const { getReviewController, getcalproController
    , homeController, hisabController,
    postSignupController,
    getHisabverifyController, postLoginController,
    getContactController, getFindProfileController,
    getProfileController, getdeleteHisabController
    , getUpdateProfileinfoController, getChangepasswordController, postResetPassController,
    getResetPassController ,upInvoiceController} = require('../controller/hisabController');


//middleware
const { isLoggedIn, isNotLoggedIn } = require("../middleware/hisabMiddleware");
//multer import
const { upload } = require("../config/multerFileupload");
hisabRouter.get('/review', getReviewController)


//route

hisabRouter.get("/", homeController);
hisabRouter.get("/hisab", hisabController);

hisabRouter.get("/contact", getContactController);






//user regestration and login 

hisabRouter.post("/signup", isNotLoggedIn, postSignupController);
hisabRouter.get("/signup", isNotLoggedIn, (req, res) => {
    res.render('signup')
});

hisabRouter.get("/login", (req, res) => {
    const crUser = req.cookies.hisabId;
    if (crUser) {
        res.redirect("/profile")
    } else {
        res.render('login')
    }

});
hisabRouter.post("/login", postLoginController);

//account verify

hisabRouter.get("/user-verify/:hisabkey", getHisabverifyController);


hisabRouter.get("/calculate", (req, res) => {
    res.render("calculate");
})
hisabRouter.post('/calculate', isLoggedIn, getcalproController);

//without login all route
hisabRouter.get("/unuser", (req, res) => {
    const crUser = req.cookies.hisabId;
    if (!crUser) {
        res.render("unuser")
    } else {
        res.redirect("/login")
    }



})

//islogged in all route
hisabRouter.get("/profile", isLoggedIn, getProfileController);
hisabRouter.get("/profile/findhisab/:findtoken", isLoggedIn, getFindProfileController);
hisabRouter.get("/profile/deletehisab/:dlttoken", isLoggedIn, getdeleteHisabController);
hisabRouter.post("/profile/changepassword", isLoggedIn, getChangepasswordController);

hisabRouter.post("/profile/updateinfo", isLoggedIn, getUpdateProfileinfoController);

hisabRouter.get("/logout", (req, res) => {
    res.clearCookie("hisabId");
    res.redirect("/login");
})



hisabRouter.get("/reset-password", getResetPassController);
hisabRouter.post("/reset-password", postResetPassController);
hisabRouter.post("/profile/updateInvoiceinfo",isLoggedIn,upload.single("oinvoicelogo"),upInvoiceController)


module.exports = { hisabRouter }