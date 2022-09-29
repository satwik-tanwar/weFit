module.exports=authRoute;

function authRoute(app,userDb){

  // ------------------ LOGIN PAGE --------------------//
  app.get("/login",function(req,res){
    const loginData ={
      title: 'Login'
    };
    res.render('login',loginData);
  });

  app.post("/login",function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    userDb.findOne({email: email},function(err,foundUser){
      if(err){
        console.log(err);
      }
      else{
        if(foundUser){
          if(foundUser.password===password){
            const renderData={
              title: foundUser.name
            };
            res.render('timeline',renderData);
          }
          else{
            res.send("invalid password");
          }
        }
        else{
          res.send("Not registered");
        }
      }
    });
  });

  // ------------------ Sign up PAGE --------------------//
  app.get("/signup",function(req,res){
    const signupData ={
      title: 'Sign Up'
    };
    res.render('signup',signupData);
  });

  app.post("/signup",function(req,res){
    userDb.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    },function(){
      const renderData= {
        title: req.body.name
      };
      res.render('timeline',renderData);
    });

  });



}