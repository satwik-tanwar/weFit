const path=require('path');
var mongoose = require('mongoose');
module.exports=newPostRoute;

function newPostRoute(app,userDb,postDb){
  app.get("/newPost",function(req,res){
    if(req.isAuthenticated()){
      const renderData={
        title: "New Post",
        loggedInUser:"d-block",
        loggedInUserImg:"d-md-block",
        loginBtn:"d-none",
        user:req.user.name,
        userImg:req.user.profilePicture,
        id:req.user._id
      };
      res.render('newPost',renderData);
    }else{
      res.redirect('/login');
    }
  });

  app.post("/newPost",function(req,res){
    if(req.isAuthenticated()){
      try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
          const img = req.files.img;
          const caption = req.body.caption;
          var imgName=img.md5+'.'+img.name.split('.')[img.name.split('.').length-1];
          const imgPath=path.join(__dirname, '../../public/uploads/');
          img.mv(imgPath+imgName);
          var imgURL='/uploads/'+imgName;
          const newPost={
            _id: new mongoose.Types.ObjectId(),
            date: new Date(),
            post: imgURL,
            owner: req.user._id,
            ownerName: req.user.name,
            ownerDp: req.user.profilePicture,
            caption: caption
          }
          postDb.findOne({_id:"63621153b587cbe0ee563f68"},function(err,result){
            result.posts.push(newPost);
            userDb.findOne({_id:req.user._id},function(err,foundItem){
              foundItem.posts.push(newPost._id);
              foundItem.save();
            });
            result.save();
          });
          res.send(String(newPost._id));
        }
      } catch (err) {
          res.status(500).send(err);
      }
    }else{
      res.redirect('/login');
    }
    
  });
}