const session = require('express-session');
const passport= require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

module.exports=feedRoute;

function feedRoute(app,userDb,postDb){
  app.get('/home/feed',function(req,res){
    if(req.isAuthenticated()){
      postDb.findOne({_id:'63621153b587cbe0ee563f68'},function(err,result){
        userDb.findOne({"_id":req.user._id},function(err,foundItem){
          var posts=result.posts;
          var displayPosts=[];
          posts.forEach(post => {
            if(post.owner===String(req.user._id) || foundItem.following.includes(post.owner)){
              if(post.likes.includes(String(req.user._id)))post.liked="fa-solid text-danger";
              else post.liked="";
              displayPosts.push(post);
            }
          });
          var followReq=req.user.followRequests.reverse();

          userDb.find({"_id":followReq},function(err,foundItems){
            var reqData=[];
            foundItems.forEach(item => {
              var obj={
                name:item.name,
                dp:item.profilePicture,
                id: item._id
              }
              reqData.push(obj);
            });

            const renderData={
              title: "Home",
              loggedInUser:"d-block",
              loggedInUserImg:"d-md-block",
              loginBtn:"d-none",
              user:req.user.name,
              userImg:req.user.profilePicture,
              id:req.user._id,
              posts: displayPosts.reverse(),
              reqData:reqData
            };
            res.render('feed',renderData);
            
          });
        });
      });
    }else{
      res.redirect('/login');
    }
  });
}