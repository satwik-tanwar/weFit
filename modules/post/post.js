module.exports=postRoute;

function postRoute(app, userDb,postDb){
  app.get("/post/:imgId",function(req,res){
    
    if(req.isAuthenticated()){
      postDb.findOne({"_id":'63621153b587cbe0ee563f68'},function(err,result){
        
        var posts=result.posts;
        posts.forEach(post => {
          if(String(post._id)===req.params.imgId){
            userDb.findOne({"_id":post.owner},function(err,foundItem){
              const followers=foundItem.followers;
              function isFollower(id){
                if (followers.includes(id)) return true;
                else return false;
              }
              if(!foundItem.private || post.owner===String(req.user._id) || isFollower(req.user._id)){
                var liked;
                if(post.likes.includes(String(req.user._id)))liked="fa-solid text-danger";
                else liked="";
          
                var ownerInfo={
                  id:foundItem._id,
                  name:foundItem.name,
                  dp:foundItem.profilePicture
                }       

                const renderData={
                  title: "Post",
                  loggedInUser:"d-block",
                  loggedInUserImg:"d-md-block",
                  loginBtn:"d-none",
                  user:req.user.name,
                  userImg:req.user.profilePicture,
                  id:req.user._id,
                  post:post,
                  ownerInfo:ownerInfo,
                  liked:liked,
                  comments:[]
                };
                res.render('post',renderData);
              }else{
                res.redirect('/home/feed');
              }
            });
          }
        });
      })
    }else{
      res.redirect('/login');
    }
  });

  app.post("/liked",function(req,res){
    if(req.isAuthenticated()){
      var postId=req.body.postId;
      postDb.findOne({_id:'63621153b587cbe0ee563f68'},function(err,foundItem){
        var posts=foundItem.posts;
        for (var i=0;i<posts.length;i++){
          if(String(posts[i]._id)===postId){
            if(req.body.action==='like'){
              posts[i].likes.push(req.user._id);
            }else if(req.body.action==='unlike'){
              const index = posts[i].likes.indexOf(String(req.user._id));
              if (index > -1) {
                posts[i].likes.splice(index, 1);
              }
            }
          }
        }

        foundItem.posts=posts;
        foundItem.save();
        res.send("done");
      });
    }
  });

  app.post("/comment",function(req,res){
    if(req.isAuthenticated()){
      var newComment={
        author: req.user._id,
        authorName: req.user.name,
        authorDp: req.user.profilePicture,
        text: req.body.comment
      };

      var arr=req.headers.referer.split('/');
      var postId=arr.pop();
      postDb.findOne({_id:'63621153b587cbe0ee563f68'},function(err,foundItem){
        var posts=foundItem.posts;
        for (var i=0;i<posts.length;i++){
          if(String(posts[i]._id)===postId){
            posts[i].comments.push(newComment);
          }
        }
        foundItem.posts=posts;
        foundItem.save();
      });

      res.send("ok");
    }else{
      res.redirect('/login')
    }
  })

}

