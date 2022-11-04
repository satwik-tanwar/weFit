module.exports=toolsRoute;


function toolsRoute(app,userDb){
  app.get('/tools',function(req,res){
    var renderData={title:'Tools'};
    if(req.isAuthenticated()){
      renderData.loggedInUser="d-block";
      renderData.loggedInUserImg="d-md-block";
      renderData.loginBtn="d-none";
      renderData.user=req.user.name;
      renderData.userImg=req.user.profilePicture;
      renderData.id=req.user._id;
    }else{
      renderData.loggedInUser="d-none";
      renderData.loggedInUserImg="d-none";
      renderData.loginBtn="d-block";
      renderData.user='';
      renderData.userImg='';
      renderData.id='';
    }
    res.render('tools',renderData);
  });

  // --------------------------- progress tracker ----------------------------- //
  app.get('/tools/progress_tracker',function(req,res){
    var renderData={title:'Progress Tracker'};
    if(req.isAuthenticated()){
      renderData.loggedInUser="d-block";
      renderData.loggedInUserImg="d-md-block";
      renderData.loginBtn="d-none";
      renderData.user=req.user.name;
      renderData.userImg=req.user.profilePicture;
      renderData.id=req.user._id;
      res.render('progress_tracker',renderData);
    }else{
      res.redirect('/login');
    }
  });

  app.post('/tools/progress_tracker/add',function(req,res){
    userDb.findOne({_id:req.user._id},function(err,foundItem){
      if(err){
        console.log(err);
      }else{
        var lastEntry=foundItem.progress[foundItem.progress.length-1];
       
        var lastEntryDate=''
        if(typeof lastEntry!=='undefined'){
          lastEntryDate=lastEntry.date.toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];
        }
        const dateRn=(new Date()).toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];

        if(lastEntryDate===dateRn){
          lastEntry.date=new Date();
          lastEntry.weight=Number(req.body.weight);
          lastEntry.height=Number(req.body.height);
          lastEntry.bodyFat=Number(req.body.bodyfat);
          lastEntry.waistSize=Number(req.body.waist)
          lastEntry.chestSize=Number(req.body.chest);
          lastEntry.armSize=Number(req.body.arm);
          lastEntry.quadSize=Number(req.body.quad);
          lastEntry.hipSize=Number(req.body.hip);
        }else{
          const newEntry={
            date:new Date(),
            weight:Number(req.body.weight),
            height:Number(req.body.height),
            bodyFat:Number(req.body.bodyfat),
            waistSize:Number(req.body.waist),
            chestSize:Number(req.body.chest),
            armSize:Number(req.body.arm),
            quadSize:Number(req.body.quad),
            hipSize:Number(req.body.hip)
          };
        foundItem.progress.push(newEntry);
        }
        
        foundItem.save();
        res.redirect('/tools/progress_tracker');
      }
    });
  });

  app.post('/tools/progress_tracker/dataPoints',function(req,res){
    const reqDate=new Date(req.body.date);
    var dataDates=[];
    req.user.progress.forEach(element => {
      if(element.date.getMonth()===reqDate.getMonth() && element.date.getFullYear()===reqDate.getFullYear()){
        dataDates.push(element.date.getDate())
      }
    });
    res.send(dataDates);
  });

  app.post('/tools/progress_tracker',function(req,res){
    const reqDate=new Date(req.body.date);
    const progressData=req.user.progress;
    
    var resData={
      data:0
    };
    progressData.forEach(element => {

      if(element.date.toDateString()===reqDate.toDateString()){
        resData=element;
      }
    });
    
    res.send(resData);
  })


  // --------------------------- diet tool ----------------------------- //
  app.get('/tools/diet_tool',function(req,res){
    var renderData={title:'Diet Tool'};
    if(req.isAuthenticated()){
      renderData.loggedInUser="d-block";
      renderData.loggedInUserImg="d-md-block";
      renderData.loginBtn="d-none";
      renderData.user=req.user.name;
      renderData.userImg=req.user.profilePicture;
      renderData.id=req.user._id;
      res.render('diet_tool',renderData);
    }else{
      res.redirect('/login')
    }
  });


  // --------------------------- training tool ----------------------------- //
  app.get('/tools/training_tool',function(req,res){
    var renderData={title:'Training Tool'};
    if(req.isAuthenticated()){
      renderData.loggedInUser="d-block";
      renderData.loggedInUserImg="d-md-block";
      renderData.loginBtn="d-none";
      renderData.user=req.user.name;
      renderData.userImg=req.user.profilePicture;
      renderData.id=req.user._id;
      res.render('training_tool',renderData);
    }else{
      res.redirect('/login')
    }
  });


  // --------------------------- bmr calculator ----------------------------- //  
  app.get('/tools/bmr_calculator',function(req,res){
    var renderData={title:'BMR Calculator'};
    if(req.isAuthenticated()){
      renderData.loggedInUser="d-block";
      renderData.loggedInUserImg="d-md-block";
      renderData.loginBtn="d-none";
      renderData.user=req.user.name;
      renderData.userImg=req.user.profilePicture;
      renderData.bmrVal=req.user.goal.bmr;
      renderData.tdeeVal=req.user.goal.tdee;
      renderData.id=req.user._id;
    }else{
      renderData.loggedInUser="d-none";
      renderData.loggedInUserImg="d-none";
      renderData.loginBtn="d-block";
      renderData.user='';
      renderData.userImg='';
      renderData.bmrVal='';
      renderData.tdeeVal='';
      renderData.id='';
    }
    res.render('bmr_calculator',renderData);
  });

  app.put('/tools/bmr_calculator',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({_id:req.user._id},function(err,foundItem){
        if(err){
          console.log(err);
        }else{
          foundItem.goal.bmr=Number(req.body.bmr);
          foundItem.goal.tdee=Number(req.body.tdee);
          foundItem.save();
          res.send('OK');
        }
      });
    }
  });


  // --------------------------- goal calculator ----------------------------- //
  app.get('/tools/goal_calculator',function(req,res){
    var renderData={title:'Goal Calculator'};
    if(req.isAuthenticated()){
      renderData.loggedInUser="d-block";
      renderData.loggedInUserImg="d-md-block";
      renderData.loginBtn="d-none";
      renderData.user=req.user.name;
      renderData.userImg=req.user.profilePicture;
      renderData.targetCal=req.user.goal.goalCals;
      renderData.diffType='d-none';
      renderData.targetPr=req.user.goal.calBreakDown.protien;
      renderData.targetCarb=req.user.goal.calBreakDown.carbs;
      renderData.targetFat=req.user.goal.calBreakDown.fats;
      renderData.id=req.user._id;
    }else{
      renderData.loggedInUser="d-none";
      renderData.loggedInUserImg="d-none";
      renderData.loginBtn="d-block";
      renderData.user='';
      renderData.userImg='';
      renderData.targetCal='';
      renderData.diffType='d-none';
      renderData.targetPr='';
      renderData.targetCarb='';
      renderData.targetFat='';
      renderData.id='';
    }
    res.render('goal_calculator',renderData);
  });

  app.put('/tools/goal_calculator',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({_id:req.user._id},function(err,foundItem){
        if(err){
          console.log(err);
        }else{
          console.log(foundItem.goal);
          foundItem.goal.goalCals=Number(req.body.goalCals);
          foundItem.goal.calBreakDown.protien=Number(req.body.protien);
          foundItem.goal.calBreakDown.carbs=Number(req.body.carbs);
          foundItem.goal.calBreakDown.fats=Number(req.body.fats);
          console.log(foundItem.goal);
          foundItem.save();
          res.send('OK');
        }
      });
    }
  });


  // --------------------------- body fat caculator ----------------------------- //
  app.get('/tools/bodyFat_calculator',function(req,res){
    var renderData={title:'Body Fat Calculator'};
    if(req.isAuthenticated()){
      renderData.loggedInUser="d-block";
      renderData.loggedInUserImg="d-md-block";
      renderData.loginBtn="d-none";
      renderData.user=req.user.name;
      renderData.id=req.user._id;
      renderData.userImg=req.user.profilePicture;
      if(typeof req.user.progress[req.user.progress.length-1]!=='undefined')
        renderData.bodyFatVal=req.user.progress[req.user.progress.length-1].bodyFat;
      else
        renderData.bodyFatVal='';
    }else{
      renderData.loggedInUser="d-none";
      renderData.loggedInUserImg="d-none";
      renderData.loginBtn="d-inline-block";
      renderData.user='';
      renderData.userImg='';
      renderData.bodyFatVal='';
      renderData.id='';
    }
    res.render('bodyFat_calculator',renderData);
  });

  app.put('/tools/bodyFat_calculator',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({_id:req.user._id},function(err,foundItem){
        if(err){
          console.log(err);
        }else{
          var lastEntry=foundItem.progress[foundItem.progress.length-1];
          var lastEntryDate=''
          if(typeof lastEntry!=='undefined'){
            lastEntryDate=lastEntry.date.toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];
          }
          const dateRn=(new Date()).toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];
  
          if(lastEntryDate===dateRn){
            lastEntry.date=new Date();
            lastEntry.weight=Number(req.body.weight);
            lastEntry.height=Number(req.body.height);
            lastEntry.bodyFat=Number(req.body.bodyfat);
            lastEntry.waistSize=Number(req.body.waist);
            lastEntry.hipSize=Number(req.body.hip);
          }else{
            const newEntry={
              date:new Date(),
              weight:Number(req.body.weight),
              height:Number(req.body.height),
              bodyFat:Number(req.body.bodyfat),
              waistSize:Number(req.body.waist),
              hipSize:Number(req.body.hipSize)
            };
          foundItem.progress.push(newEntry);
          }
          
          foundItem.save();
          res.send("OK");
        }
      });
    }else{
      res.send("login");
    }
  });
}