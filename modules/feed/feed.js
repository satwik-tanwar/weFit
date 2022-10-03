const session = require('express-session');
const passport= require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

module.exports=feedRoute;

function feedRoute(app,userDb){
  app.get('/home/feed',function(req,res){
    if(req.isAuthenticated()){
      const renderData={
        title: "Home",
        loggedInUser:"d-block",
        loggedInUserImg:"d-md-block",
        loginBtn:"d-none",
        user:req.user.name,
        userImg:req.user.profilePicture
      };
      res.render('feed',renderData);
    }else{
      res.redirect('/login');
    }
  });
}