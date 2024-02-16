const isLoggedIn = (req, res, next) => {
  const currentUser = req.cookies.hisabId;
  if (currentUser) {
    next();
  } else {
    res.redirect("/unuser");
    
  }
};
const isNotLoggedIn = (req, res, next) => {
  const currentUser = req.cookies.hisabId;
  if (!currentUser) {
  next();
  
  } else{
    res.redirect("/profile");
  
  }
};



module.exports = { isLoggedIn,isNotLoggedIn };
