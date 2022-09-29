module.exports=learnRoute;
const fileUpload = require('express-fileupload');
const path=require('path');

function learnRoute(app,blogDb){

  app.use(fileUpload());

  // ------------- LEARN PAGE -------------------  
  app.get("/learn",function(req,res){
    
    blogDb.find({},function(err,foundItems){
      const learnData={
        title: "Learn",
        posts: foundItems
      };
      res.render('learn',learnData);
    });
    
  });

  // ------------- COMPOSE PAGE -------------------

  const composeData={
    title: "Compose"
  };

  app.get("/learn/compose",function(req,res){
    res.render('compose',composeData);
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
        imgName=img.md5+'.'+img.name.split('.')[1];
        const imgPath=path.join(__dirname, '../../public/uploads/');
        img.mv(imgPath+imgName);
        var imgURL='http://'+req.get('host')+'/uploads/'+imgName; 
        res.send({
          "url": imgURL
        });
      }
    } catch (err) {
        res.status(500).send(err);
    }        
  });

  app.post("/learn/compose",function(req,res){
    blogDb.create({
      title: req.body.newTitle,
      content: req.body.newPost,
      datePublished: new Date()
    },function(){
      res.redirect('/learn');
    });
  });


  // ------------- BLOGs  -------------------

  app.get("/learn/:title", function(req,res){
    
    var target=req.params.title;

    blogDb.find({_id:target},function(err,foundItems){
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
          blogContent:obj.content
        }
      }
      res.render('blog',blogData);
    });
  });
}