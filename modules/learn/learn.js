module.exports=learnRoute;

const path=require('path');
const { send } = require('process');

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
      
      posts=posts.sort((a,b) => Date.parse(b.lastModified) - Date.parse(a.lastModified));
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
          id:req.user._id
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
        userImg:"",
        id:""
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
        userImg:req.user.profilePicture,
        editBlogTitle:'',
        editBlogContent:'',
        id:req.user._id
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
        var imgName=img.md5+'.'+img.name.split('.')[img.name.split('.').length-1];
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

    const refererArr=req.headers.referer.split('/')
    const blogID=refererArr[refererArr.length-1].substring(0,refererArr[refererArr.length-1].length-1)
    if(refererArr[refererArr.length-2]==='edit'){
      blogDb.findOne({_id:blogID},function(err,foundItem){
        if(err){
          console.log(err);
        }else{
          foundItem.title=req.body.newTitle;
          foundItem.content=req.body.newPost;
          foundItem.lastModified=new Date();
          foundItem.author= req.user.name;
          foundItem.authorImg=req.user.profilePicture;
          foundItem.blogImgs= blogImgs;
          foundItem.sampleText= sampleText;
          foundItem.isFeatured= isFeatured;
          foundItem.save();
          const redirectURL='/learn/'+refererArr[refererArr.length-1];
          res.redirect(redirectURL);
        }
      });
    }else{
      blogDb.create({
        title: req.body.newTitle,
        content: req.body.newPost,
        lastModified: new Date(),
        author: req.user.name,
        authorID: req.user._id,
        authorImg:req.user.profilePicture,
        blogImgs: blogImgs,
        sampleText: sampleText,
        isFeatured: isFeatured
      },function(err,newBlog){
        if(err){
          console.log(err);
        }else{
          res.redirect('/learn/'+newBlog._id);
        }
      });
    }
  });


  // ------------- BLOGs  -------------------

  app.get("/learn/:title", function(req,res){
    
    var target=req.params.title;

    blogDb.findOne({_id:target},function(err,foundItem){

      var blogData={};
      if(req.isAuthenticated()){
        blogData.loggedInUser="d-block";
        blogData.loggedInUserImg="d-md-block";
        blogData.loginBtn="d-none";
        blogData.user=req.user.name;
        blogData.userImg=req.user.profilePicture;
        blogData.id=req.user._id;
      }else{
        blogData.loggedInUser="d-none";
        blogData.loggedInUserImg="d-none";
        blogData.loginBtn="d-block";
        blogData.user="";
        blogData.userImg="";
        blogData.id="";
      }

      if(err|| foundItem ===null){
        blogData.title= req.params.title;
        blogData.blogTitle= "Oops! Requested resource does not exist, please check your URL.";
        blogData.blogContent="";
        blogData.blogAuthor='';
        blogData.blogDate='';
        blogData.authorImg='';
        blogData.blogOptions='d-none';
        blogData.blogID='';
      }
      else{
        blogData.title= foundItem.title;
        blogData.blogTitle= foundItem.title;
        blogData.blogContent=foundItem.content;
        blogData.blogAuthor=foundItem.author;
        blogData.blogDate=foundItem.lastModified.toLocaleDateString('en-us', {month:"short",year:"numeric"});
        blogData.authorImg=foundItem.authorImg;
        
        if(req.isAuthenticated()){
          if(String(foundItem.authorID)===String(req.user._id)){
            blogData.blogOptions='d-block';
          }else{
            blogData.blogOptions='d-none';
          }
          blogData.blogID=String(foundItem._id);

        }else{
          blogData.blogOptions='d-none';
          blogData.blogID='';
        }
      }
      res.render('blog',blogData);
    });
  });

  app.get('/learn/edit/:blogID',function(req,res){
    if(req.isAuthenticated()){
      const blogId=req.params.blogID;
      blogDb.findOne({_id:blogId},function(err,foundItem){
        if(err){
          console.log(err);
        }else{
          if(String(foundItem.authorID)===String(req.user._id)){
            const renderData={
                title: "Compose",
                loggedInUser:"d-block",
                loggedInUserImg:"d-md-block",
                loginBtn:"d-none",
                user:req.user.name,
                userImg:req.user.profilePicture,
                editBlogTitle:foundItem.title,
                editBlogContent:foundItem.content,
                id:req.user._id
              };
            res.render('compose',renderData);
          }else{
            res.redirect('/learn/'+blogId)
          }
        }
      });
    }else{
      res.redirect('/learn/'+req.params.blogID);
    }
  });

  app.put('/learn/delete/:blogID',function(req,res){
    if(req.isAuthenticated()){
      const blogId=req.params.blogID;
      blogDb.findOne({_id:blogId},function(err,foundItem){
        if(err){
          console.log(err);
        }else{
          if(String(foundItem.authorID)===String(req.user._id)){
            blogDb.deleteOne({_id:foundItem._id},function(err){
              if(err){
                res.send('not deleted');
              }else{
                res.send('deleted');
              }
            });
          }else{
            res.send('not deleted');
          }
        }
      });
    }else{
      res.redirect('/learn/'+req.params.blogID);
    }
  });
}

