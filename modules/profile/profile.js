module.exports=profileRoute;

function profileRoute(app,userDb,postDb){
  app.get('/profile/:id',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({_id:req.params.id},function(err,foundItem){
        if(err){
          console.log(err);
        }else{
          postDb.findOne({"_id":"63621153b587cbe0ee563f68"},function(err,result){
            var postIds=foundItem.posts;
            var posts=result.posts;
            var renderPosts=[]
            posts.forEach(post => {
                if(postIds.includes(post._id)){
                  renderPosts.push(post);
                }
            });
            var renderData={
              title:req.user.name,
              loggedInUser:"d-block",
              loggedInUserImg:"d-md-block",
              loginBtn:"d-none",
              user:req.user.name,
              userImg:req.user.profilePicture,            
              id:req.user._id,
  
              profileUserName:foundItem.name,
              profileUserImg:foundItem.profilePicture,
              description:foundItem.description,
              postCount:foundItem.posts.length,
              followersCount:foundItem.followers.length,
              followingCount:foundItem.following.length,
              posts:renderPosts
            };
            if(String(foundItem._id)===String(req.user._id)){
              renderData.editBtn='';
              renderData.showPosts='';
              renderData.privateAccMsg='d-none';
              renderData.followBtn='d-none';
              renderData.reqBtn='d-none';
              renderData.unFollowBtn='d-none';
              res.render('profile',renderData);
            }
            else if(foundItem.followers.includes(req.user._id)){
              renderData.editBtn='d-none';
              renderData.showPosts='';
              renderData.privateAccMsg='d-none';
              renderData.followBtn='d-none';
              renderData.reqBtn='d-none';
              renderData.unFollowBtn='';
              res.render('profile',renderData);
            }else if(!foundItem.private && !foundItem.followers.includes(req.user._id)){
              renderData.editBtn='d-none';
              renderData.showPosts='';
              renderData.privateAccMsg='d-none';
              renderData.followBtn='';
              renderData.reqBtn='d-none';
              renderData.unFollowBtn='d-none';
              res.render('profile',renderData);
            }
            else if(foundItem.private && foundItem.followRequests.includes(req.user._id)){
              renderData.editBtn='d-none';
              renderData.showPosts='d-none';
              renderData.privateAccMsg='';
              renderData.followBtn='d-none';
              renderData.reqBtn='';
              renderData.unFollowBtn='d-none';
              res.render('profile',renderData);
            }
            else{
              renderData.editBtn='d-none';
              renderData.showPosts='d-none';
              renderData.posts=[];
              renderData.privateAccMsg='';
              renderData.followBtn='';
              renderData.reqBtn='d-none';
              renderData.unFollowBtn='d-none';
              res.render('profile',renderData);
            }
          });
        }
      });
    }else{
      res.redirect('/login');
    }
  });

  // ****************** Edit Profile ****************** //

  app.get('/editProfile',function(req,res){
    if(req.isAuthenticated()){
      var isChecked='';
      if(req.user.private) isChecked="checked";
      const renderData={
        title:req.user.name,
        loggedInUser:"d-block",
        loggedInUserImg:"d-md-block",
        loginBtn:"d-none",
        user:req.user.name,
        userImg:req.user.profilePicture,
        id:req.user._id,
        mobile:req.user.mobile,
        description:req.user.description,
        isChecked:isChecked,
      };
      res.render('editProfile',renderData);
    }else{
      res.redirect('/login');
    }
  });

  app.post('/editProfile',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({_id: req.user._id},function(err,foundItem){
        if(err){
          console.log(err);
          res.redirect('/profile/editProfile');
        }else{
          foundItem.name=req.body.name;
          foundItem.mobile=Number(req.body.mobile);
          foundItem.description=req.body.description;
          if(typeof req.body.private==='string'){
            foundItem.private=true;
          }else{
            foundItem.private=false;
            while(foundItem.followRequests.length>0){
              var followerId=foundItem.followRequests.pop();
              foundItem.followers.push(followerId);
              userDb.findOne({_id:followerId},function(err,found){
                found.following.push(req.user._id);
                found.save();
              });
            }
          }
          foundItem.save();
          res.redirect('/profile/'+req.user._id);
        }
      });
    }
  });


  // ****************** Follow Request ****************** //
  app.get('/follow',function(req,res){
    if(req.isAuthenticated()){
      const targetId=req.headers.referer.split('/').pop();
      userDb.findOne({_id:targetId},function(err,foundItem){
        if(foundItem.private){
          foundItem.followRequests.push(req.user._id);
          foundItem.save();
          res.send('private');
        }else{
          foundItem.followers.push(req.user._id);
          userDb.findOne({_id:req.user._id},function(err,found){
            found.following.push(targetId);
            found.save();
          });
          foundItem.save();
          res.send('public');
        }
      });
      
    }else{
      req.redirect('/login');
    }
  });

  app.get('/deleteReq',function(req,res){
    if(req.isAuthenticated()){
      const targetId=req.headers.referer.split('/').pop();
      userDb.findOne({_id:targetId},function(err,foundItem){
        const index = foundItem.followRequests.indexOf(String(req.user._id));
        if (index > -1) { 
          foundItem.followRequests.splice(index, 1);
        }
        foundItem.save();
        res.send('deleted');
      });
    }else{
      req.redirect('/login');
    }
  });


  app.get('/unfollow',function(req,res){
    if(req.isAuthenticated()){
      const targetId=req.headers.referer.split('/').pop();
      userDb.findOne({_id:targetId},function(err,foundItem){
        const index = foundItem.followers.indexOf(String(req.user._id));
        if (index > -1) { 
          foundItem.followers.splice(index, 1);
        }
        userDb.findOne({_id:req.user._id},function(err,found){
          const i = found.following.indexOf(targetId);
          if (i > -1) { 
            found.following.splice(i, 1);
          }
          found.save();
        });
        foundItem.save();
        if(foundItem.private) res.send('private');
        else res.send('public');
      });
    }else{
      req.redirect('/login');
    }
  });

  app.post('/reqResponse',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({"_id":req.user._id},function(err,foundItem){
        const i = foundItem.followRequests.indexOf(req.body.reqId);
            if (i > -1) { 
              foundItem.followRequests.splice(i, 1);
            }
        if(req.body.action==='accept'){
          foundItem.followers.push(req.body.reqId);
          userDb.findOne({"_id":req.body.reqId},function(err,found){
            found.following.push(req.user._id);
            found.save();
          })
        }
        foundItem.save();
      });
    }
  })
}




