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
      renderData.height=req.user.height;
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
        foundItem.height=req.body.height;
        if(foundItem.progress.length>0){
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
    if(req.user.progress.length>0){
      req.user.progress.forEach(element => {
        if(element.date.getMonth()===reqDate.getMonth() && element.date.getFullYear()===reqDate.getFullYear()){
          dataDates.push(element.date.getDate())
        }
      });
    }
    
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
      renderData.savedFood=req.user.food.reverse();
      res.render('diet_tool',renderData);
    }else{
      res.redirect('/login')
    }
  });

  app.get('/tools/diet_tool/checkFood/:foodName',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({"_id":req.user._id},function(err,foundItem){
        var foodNames=[];
        foundItem.food.forEach((food)=>{
          foodNames.push(food.name.toLowerCase());
        });
        if(foodNames.includes(req.params.foodName.toLowerCase())){
          res.send("found");
        }else{
          res.send("not found");
        }
      });
    }
  })

  app.post('/tools/diet_tool/addFood',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({"_id":req.user._id},function(err,foundItem){
        const newFood={
          name: req.body.foodName,
          protien: req.body.protien,
          carbs: req.body.carb,
          fats: req.body.fat,
          cals: req.body.cal
        }
        foundItem.food.push(newFood);
        foundItem.save();
        res.redirect("/tools/diet_tool");
      });
    }
  });

  app.post('/tools/diet_tool/addMeal/:foodName',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({"_id":req.user._id},function(err,foundItem){
        if(foundItem.diet.length>0){
          var lastEntry=foundItem.diet[foundItem.diet.length-1];
        var lastEntryDate=''
        if(typeof lastEntry!=='undefined'){
          lastEntryDate=lastEntry.date.toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];
        }
        const dateRn=(new Date()).toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];

        var calories,protien,carbs,fats;

        if(lastEntryDate===dateRn){
          
          calories=lastEntry.calories;
          protien=lastEntry.protien;
          carbs=lastEntry.carbs;
          fats=lastEntry.fats;
          foundItem.food.forEach(element => {
            if (element.name===req.params.foodName){
              calories+=element.cals;
              protien+=element.protien;
              carbs+=element.carbs;
              fats+=element.fats;
            }
          });
          
          lastEntry.date=new Date();
          lastEntry.calories=calories;
          lastEntry.protien=protien;
          lastEntry.carbs=carbs;
          lastEntry.fats=fats;
          var obj={
              name:req.params.foodName,
              quantity:Number(req.body.quantity)
          }
          if(req.body.mealType==='breakfast'){
            lastEntry.breakfast.push(obj);
          }else if(req.body.mealType==='lunch'){
            lastEntry.lunch.push(obj);
          }else if(req.body.mealType==='snacks'){
            lastEntry.snacks.push(obj);
          }else if(req.body.mealType==='dinner'){
            lastEntry.dinner.push(obj);
          }
        }else{
          calories=0;
          protien=0;
          carbs=0;
          fats=0;
          req.user.food.forEach(element => {
            if (element.name===req.params.foodName){
              calories+=element.cals;
              protien+=element.protien;
              carbs+=element.carbs;
              fats+=element.fats;
            }
          });
          const newEntry={
            date:new Date(),
            calories:calories,
            protien:protien,
            carbs:carbs,
            fats:fats
          }
          var obj={
            name:req.params.foodName,
            quantity:Number(req.body.quantity)
          }
          if(req.body.mealType==='breakfast'){
            newEntry.breakfast=[obj];
          }else if(req.body.mealType==='lunch'){
            newEntry.lunch=[obj];
          }else if(req.body.mealType==='snacks'){
            newEntry.snacks=[obj];
          }else if(req.body.mealType==='dinner'){
            newEntry.dinner=[obj];
          }
          foundItem.diet.push(newEntry);
        }
        }else{
          calories=0;
          protien=0;
          carbs=0;
          fats=0;
          req.user.food.forEach(element => {
            if (element.name===req.params.foodName){
              calories+=element.cals;
              protien+=element.protien;
              carbs+=element.carbs;
              fats+=element.fats;
            }
          });
          const newEntry={
            date:new Date(),
            calories:calories,
            protien:protien,
            carbs:carbs,
            fats:fats
          }
          var obj={
            name:req.params.foodName,
            quantity:Number(req.body.quantity)
          }
          if(req.body.mealType==='breakfast'){
            newEntry.breakfast=[obj];
          }else if(req.body.mealType==='lunch'){
            newEntry.lunch=[obj];
          }else if(req.body.mealType==='snacks'){
            newEntry.snacks=[obj];
          }else if(req.body.mealType==='dinner'){
            newEntry.dinner=[obj];
          }
          foundItem.diet.push(newEntry);
        }
        foundItem.save();
        res.redirect('/tools/diet_tool');
      });
    }
  });

  app.get('/tools/diet_tool/deleteFood/:food',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({"_id":req.user._id},function(err,foundItem){
        var index=-1;
        var i=0;
        foundItem.food.forEach(element => {
          if(element.name===req.params.food){
            index=i;
          }
          i+=1;
        });
        if (index > -1) { 
          foundItem.food.splice(index, 1);
        }
        foundItem.save();
      })
    }
  });

  app.post('/tools/diet_tool/dataPoints',function(req,res){
    const reqDate=new Date(req.body.date);
    var dataDates=[];
    if(req.user.diet.length>0){
      req.user.diet.forEach(element => {
        if(element.date.getMonth()===reqDate.getMonth() && element.date.getFullYear()===reqDate.getFullYear()){
          dataDates.push(element.date.getDate())
        }
      });
    }
    
    res.send(dataDates);
  });

  app.post('/tools/diet_tool',function(req,res){
    const reqDate=new Date(req.body.date);
    const dietData=req.user.diet;
    
    var resData={
      data:0
    };
    dietData.forEach(element => {

      if(element.date.toDateString()===reqDate.toDateString()){
        resData=element;
      }
    });
    
    res.send(resData);
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

  app.get('/tools/training_tool/rm',function(req,res){
    if(req.isAuthenticated()){
      if(req.user.training.length>0){
        var lastEntry=req.user.training[req.user.training.length-1]
      if(typeof lastEntry!=='undefined'){
        var obj={
          bench: lastEntry.benchRm,
          deadlift: lastEntry.deadliftRm,
          squat: lastEntry.squatRm,
          overhead: lastEntry.overheadRm
        }
        res.send(obj);
      }
      else{
        var obj={
          bench: "N/A",
          deadlift: "N/A",
          squat: "N/A",
          overhead: "N/A"
        }
        res.send(obj);
      }
      }else{
        var obj={
          bench: "N/A",
          deadlift: "N/A",
          squat: "N/A",
          overhead: "N/A"
        }
        res.send(obj);
      }
      
    }
  });

  app.put('/tools/training_tool/rm',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({"_id":req.user._id},function(err,foundItem){
        var lastEntry=foundItem.training[foundItem.training.length-1];
        if(foundItem.training.length>0){
          var lastEntryDate=''
        if(typeof lastEntry!=='undefined'){
          lastEntryDate=lastEntry.date.toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];
        }
        const dateRn=(new Date()).toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];

        if(lastEntryDate===dateRn){
          if(req.body.rmType==='Bench Press'){
            lastEntry.benchRm=req.body.rm;
          }else if(req.body.rmType==='Deadlift'){
            lastEntry.deadliftRm=req.body.rm;
          }else if(req.body.rmType==='Squat'){
            lastEntry.squatRm=req.body.rm;
          }else{
            lastEntry.overheadRm=req.body.rm;
          }
          
        }else{
          var newEntry={
            date: new Date
          }
          if(req.body.rmType==='Bench Press'){
            newEntry.benchRm=req.body.rm;
          }else if(req.body.rmType==='Deadlift'){
            newEntry.deadliftRm=req.body.rm;
          }else if(req.body.rmType==='Squat'){
            newEntry.squatRm=req.body.rm;
          }else{
            newEntry.overheadRm=req.body.rm;
          }
          foundItem.training.push(newEntry);
        }
        }else{
          var newEntry={
            date: new Date
          }
          if(req.body.rmType==='Bench Press'){
            newEntry.benchRm=req.body.rm;
          }else if(req.body.rmType==='Deadlift'){
            newEntry.deadliftRm=req.body.rm;
          }else if(req.body.rmType==='Squat'){
            newEntry.squatRm=req.body.rm;
          }else{
            newEntry.overheadRm=req.body.rm;
          }
          foundItem.training.push(newEntry);
        }
        
        
        foundItem.save();
        res.send('done');
      });
    }
  });

  app.post('/tools/training_tool',function(req,res){
    if(req.isAuthenticated()){
      userDb.findOne({"_id":req.user._id},function(err,foundItem){
        if(foundItem.training.length>0){
          var lastEntry=foundItem.training[foundItem.training.length-1];
        
        var lastEntryDate=''
        if(typeof lastEntry!=='undefined'){
          lastEntryDate=lastEntry.date.toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];
        }
        const dateRn=(new Date()).toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'}).split(',')[0];

        if(lastEntryDate===dateRn){
          var newEx={
            exName:req.body.exerciseName,
            reps:Number(req.body.reps),
            sets:Number(req.body.sets)
          }
          lastEntry.exercises.push(newEx);
          
        }else{
          var newEx={
            exName:req.body.exerciseName,
            reps:Number(req.body.reps),
            sets:Number(req.body.sets)
          }
          var newEntry={
            date:new Date(),
            exercises:[newEx]
          }
          
          foundItem.training.push(newEntry);
        }
        }else{
          var newEx={
            exName:req.body.exerciseName,
            reps:Number(req.body.reps),
            sets:Number(req.body.sets)
          }
          var newEntry={
            date:new Date(),
            exercises:[newEx]
          }
          
          foundItem.training.push(newEntry);
        }
        
        foundItem.save();
        res.redirect('/tools/training_tool');
      });
    }
  });

  app.post('/tools/training_tool/dataPoints',function(req,res){
    const reqDate=new Date(req.body.date);
    var dataDates=[];
    if(req.user.training.length>0){
      req.user.training.forEach(element => {
        if(element.date.getMonth()===reqDate.getMonth() && element.date.getFullYear()===reqDate.getFullYear()){
          dataDates.push(element.date.getDate())
        }
      });req.user.training.forEach(element => {
        if(element.date.getMonth()===reqDate.getMonth() && element.date.getFullYear()===reqDate.getFullYear()){
          dataDates.push(element.date.getDate())
        }
      });
    }
    
    res.send(dataDates);
  });

  app.post('/tools/training_tool/workoutData',function(req,res){
    const reqDate=new Date(req.body.date);
    const workoutData=req.user.training;
    
    var resData={
      data:0
    };
    workoutData.forEach(element => {

      if(element.date.toDateString()===reqDate.toDateString()){
        resData=element;
      }
    });
    
    res.send(resData);
  });


  // --------------------------- bmr calculator ----------------------------- //  
  app.get('/tools/bmr_calculator',function(req,res){
    var renderData={title:'BMR Calculator'};
    if(req.isAuthenticated()){
      renderData.height=req.user.height;
      renderData.loggedInUser="d-block";
      renderData.loggedInUserImg="d-md-block";
      renderData.loginBtn="d-none";
      renderData.user=req.user.name;
      renderData.userImg=req.user.profilePicture;
      renderData.bmrVal=req.user.goal.bmr;
      renderData.tdeeVal=req.user.goal.tdee;
      renderData.id=req.user._id;
    }else{
      renderData.height="";
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
          foundItem.goal.goalCals=Number(req.body.goalCals);
          foundItem.goal.calBreakDown.protien=Number(req.body.protien);
          foundItem.goal.calBreakDown.carbs=Number(req.body.carbs);
          foundItem.goal.calBreakDown.fats=Number(req.body.fats);
          
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
      renderData.height=req.user.height;
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
      renderData.height="";
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
              hipSize:Number(req.body.hip)
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