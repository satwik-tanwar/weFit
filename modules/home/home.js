const mailChimp=require(__dirname+"/mailing-list.js");

module.exports=homeRoute;

function homeRoute(app,blogDb){
  
  app.get("/",function(req,res){

    var foundItems=[]
    if(req.isAuthenticated()){
      res.redirect('/home/feed');
    }else{
      blogDb.find(function(err,foundItem){
        if(err){
          console.log(err);
        }else{
          const homeData={
            title: "Home",
            alertType: "",
            subscribeAlert: "d-none",
            alertText: "",
            loggedInUser:"d-none",
            loggedInUserImg:"d-none",
            loginBtn:"d-block",
            user:"",
            userImg:"",
            posts:foundItem
          };
          res.render('home',homeData);
        }
      }).sort({datePublished:-1}).limit(2);
    } 
  });
  
  app.post("/",function(req,res){
    error_count=mailChimp.mailingList(req);
    error_count.then(function(result){
      homeData.subscribeAlert="d-flex";
      if(result===0){
        homeData.alertType="alert-success";
        homeData.alertText="Congrats! Your are subscribed";
      }
      else{
        homeData.alertType="alert-danger";
        homeData.alertText="Oops! There is some problem, please try again";
      }
      res.redirect('/#subscribe');
    });
  });
}