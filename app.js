require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");

const session = require('express-session');
const passport= require('passport');
const fileUpload = require('express-fileupload');


const app=express();
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(fileUpload());

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 60000*60*24*10
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ****************************** DATABASE *********************************** //
const database=require(__dirname+"/database/data-connectivity.js");
const endpoints=database();
const userDb=endpoints[0];
const toolDb=endpoints[1];
const blogDb=endpoints[2];

// ****************************** ROUTES *********************************** //

const homeRoute=require(__dirname+'/modules/home/home.js');
homeRoute(app,blogDb);

const authRoute=require(__dirname+'/modules/auth/auth.js');
authRoute(app,userDb);

const learnRoute=require(__dirname+'/modules/learn/learn.js');
learnRoute(app,blogDb);

const feedRoute=require(__dirname+'/modules/feed/feed.js');
feedRoute(app,userDb);


app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000.");
});