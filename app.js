require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");


const app=express();
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// ****************************** DATABASE *********************************** //
const database=require(__dirname+"/database/data-connectivity.js");
endpoints=database();
userDb=endpoints[0];
toolDb=endpoints[1];
blogDb=endpoints[2];

// ****************************** ROUTES *********************************** //

const homeRoute=require(__dirname+'/modules/home/home.js');
homeRoute(app);

const learnRoute=require(__dirname+'/modules/learn/learn.js');
learnRoute(app,blogDb);

const authRoute=require(__dirname+'/modules/auth/auth.js');
authRoute(app,userDb);


app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000.");
});