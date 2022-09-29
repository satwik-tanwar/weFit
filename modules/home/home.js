const mailChimp=require(__dirname+"/mailing-list.js");

module.exports=homeRoute;

function homeRoute(app){
  const homeData={
    title: "Home",
    alertType: "",
    subscribeAlert: "d-none",
    alertText: ""
  }
  app.get("/",function(req,res){
    res.render('home',homeData);
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