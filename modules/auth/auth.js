module.exports=authRoute;
const passport= require('passport');
const path=require('path');

function authRoute(app,userDb){
  var returnTo;
  // ------------------ Sign up PAGE --------------------//
  app.get("/signup",function(req,res){
    if(req.isAuthenticated()){
      res.redirect('/home/feed');
    }else{
      const signupData ={
      title: 'Sign Up',
      loggedInUser:"d-none",
      loggedInUserImg:"d-none",
      loginBtn:"d-block",
      user:"",
      userImg:'',
      id:''
    };
    res.render('signup',signupData);
    }  
  });

  app.get("/signup/:email",function(req,res){
    userDb.countDocuments({email:req.params.email},function(err,count){
      if (count>0){
        res.send(true);
      }
      else{
        res.send(false);
      }
    });
  });

  app.post("/signup",function(req,res){
    userDb.register({email: req.body.email}, req.body.password, function(err,user){
      if(err){
          res.redirect('/signup');
      }else{
        user.name=req.body.name;
        user.mobile=req.body.mobile;
        user.save();
        passport.authenticate('local', { successRedirect: ('/home/completeProfile'), failureRedirect: '/login' })(req, res);
      }
    });
  });

  app.get('/home/completeProfile',function(req,res){
    if(req.isAuthenticated()){ 
      if(!req.user.isSignedUp){
        const renderData={
          title: "Complete Profile",
          loggedInUser:"d-block",
          loggedInUserImg:"d-md-block",
          loginBtn:"d-none",
          user:req.user.name,
          userImg:req.user.profilePicture,
          id:req.user._id
        };
        res.render('completeProfile',renderData);
      }else{
        res.redirect('/home/feed');
      }
    }else{
      res.redirect("/signup");
    }
  });

  app.post("/home/completeProfile",function(req,res){
    userDb.findOne({email: req.user.email},function(err,foundItem){
      if(err){
        console.log(err);
        res.redirect('/home/completeProfile');
      }else{
        foundItem.isSignedUp=true;
        foundItem.mobile=Number(req.body.mobile);
        foundItem.dob=new Date(req.body.dob);
        foundItem.description=req.body.description;
        if(typeof req.body.gender === 'string'){
          foundItem.gender=req.body.gender;
        }else{
          foundItem.gender='not specified';
        }
        if(typeof req.body.private==='string'){
          foundItem.private=true;
        }
        foundItem.save();
        res.redirect('/home/feed');
      }
    });
  });

  app.put("/home/completeProfile",function(req,res){
    try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
        const img = req.files.img;
        var imgName=img.md5+'.'+img.name.split('.')[img.name.split('.').length-1];
        const imgPath=path.join(__dirname, '../../public/uploads/');
        img.mv(imgPath+imgName);
        var imgURL='/uploads/'+imgName;
        userDb.findOne({email:req.user.email},function(err,foundItem){
          foundItem.profilePicture=imgURL;
          foundItem.save();
        }); 
      }
    } catch (err) {
        res.status(500).send(err);
    }
  });

  // ------------------ LOGIN with google --------------------//

  app.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

  app.get('/auth/google/fitty',

    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      if(!req.user.signedUp){
        res.redirect("/home/completeProfile");
      }
      else{
        res.redirect(returnTo);
      }
    });

  // ------------------ LOGIN PAGE --------------------//

  app.get("/login",function(req,res){
    returnTo=req.headers.referer;
    if(req.isAuthenticated()){
      res.redirect('/home/feed');
    }else{
      const loginData ={
        title: 'Login',
        loggedInUser:"d-none",
        loggedInUserImg:"d-none",
        loginBtn:"d-block",
        user:"",
        userImg:"",
        id:''
      };
      res.render('login',loginData);
    }
  });

  app.post("/login",function(req,res){
    passport.authenticate('local', { successRedirect: (returnTo), failureRedirect: '/login' })(req, res);
  });

  // ------------------ Logout --------------------//
  
  app.post('/logout', function(req, res, next){
    returnTo=req.headers.referer;
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect(returnTo);
    });
  });
  
}