module.exports=learnRoute;

const path=require('path');

function learnRoute(app,blogDb){

 

  // ------------- LEARN PAGE -------------------  
  app.get("/learn",function(req,res){
    blogDb.find({},function(err,foundItems){
      var featuredPosts=[], posts=[];
      foundItems.forEach(item => {
        if(item.isFeatured){
          featuredPosts.push(item);
        }else{
          posts.push(item);
        }
      });
      
      posts=posts.sort((a,b) => Date.parse(b.datePublished) - Date.parse(a.datePublished));
      var learnData;
      if(req.isAuthenticated()){
        learnData ={
          title: 'Learn',
          posts: posts,
          featuredPosts:featuredPosts,
          loggedInUser:"d-block",
          loggedInUserImg:"d-md-block",
          loginBtn:"d-none",
          user:req.user.name,
          userImg:req.user.profilePicture,
        };
      }else{
        learnData ={
        title: 'Learn',
        posts: posts,
        featuredPosts:featuredPosts,
        loggedInUser:"d-none",
        loggedInUserImg:"d-none",
        loginBtn:"d-block",
        user:"",
        userImg:""
      };
      } 
      res.render('learn',learnData); 
    });
    
  });

  // ------------- COMPOSE PAGE -------------------//

  app.get("/learn/compose",function(req,res){

    if(req.isAuthenticated()){
      const composeData={
        title: "Compose",
        loggedInUser:"d-block",
        loggedInUserImg:"d-md-block",
        loginBtn:"d-none",
        user:req.user.name,
        userImg:req.user.profilePicture
      };
      res.render('compose',composeData);
    }else{
      res.redirect('/login');
    }
  });

  app.post("/learn/compose/upload",function(req,res){
    try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
        const img = req.files.upload;
        var imgName=img.md5+'.'+img.name.split('.')[1];
        const imgPath=path.join(__dirname, '../../public/uploads/');
        img.mv(imgPath+imgName);
        var imgURL='/uploads/'+imgName;
        res.send({
          "url": imgURL
        });
      }
    } catch (err) {
        res.status(500).send(err);
    }        
  });


  function getSampleText(content){
    var text=content;
    text=text.replace(/<figure.*?>.*?<\/figure>/ig,'');
    text=text.replace(/<\/?[^>]+(>|$)/g, "");
    text=text.substring(0,Math.min(200,text.length))+'...';
    return text;
  }

  app.post("/learn/compose",function(req,res){
    function getImages(string) {
      const imgRex = /<img.*?src="(.*?)"/g;
      const images = [];
      let img;
      while ((img = imgRex.exec(string))) {
          images.push(img[1]);
      }
      if(images.length===0) images.push('/images/logo2.png');
      return images;
    }
    var blogImgs=getImages(req.body.newPost);
    var sampleText=getSampleText(req.body.newPost);
    var isFeatured=false;
    if(req.user.adminAccess) isFeatured=true;
    blogDb.create({
      title: req.body.newTitle,
      content: req.body.newPost,
      datePublished: new Date(),
      author: req.user.name,
      authorID: req.user._id,
      authorImg:req.user.profilePicture,
      blogImgs: blogImgs,
      sampleText: sampleText,
      isFeatured: isFeatured
    },function(){
      res.redirect('/learn');
    });
  });


  // ------------- BLOGs  -------------------

  app.get("/learn/:title", function(req,res){
    
    var target=req.params.title;

    blogDb.find({_id:target},function(err,foundItems){
      var blogData;
      if(err){
        blogData={
          title: req.params.title,
          blogTitle: "Oops! Requested resource does not exist, please check your URL.",
          blogContent:""
        }
      }
      else{
        obj=foundItems[0];
        blogData={
          title: obj.title,
          blogTitle: obj.title,
          blogContent:obj.content,
          blogAuthor:obj.author,
          blogDate:obj.datePublished.toLocaleDateString('en-us', {month:"short",year:"numeric"}),
          authorImg:obj.authorImg
        }
      }
      if(req.isAuthenticated()){
        blogData.loggedInUser="d-block";
        blogData.loggedInUserImg="d-md-block";
        blogData.loginBtn="d-none";
        blogData.user=req.user.name;
        blogData.userImg=req.user.profilePicture;
      }else{
        blogData.loggedInUser="d-none";
        blogData.loggedInUserImg="d-none";
        blogData.loginBtn="d-block";
        blogData.user="";
        blogData.userImg="";
      }
      res.render('blog',blogData);
    });
  });
}

