const mongoose=require('mongoose');
const passport= require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

module.exports=database;

function database(){
  mongoose.connect('mongodb+srv://satwik_tanwar:Stan%40956879@fitty.lyn18ds.mongodb.net/?retryWrites=true&w=majority');
  //--------------------------  USER DATA ----------------------------------//

  const postPool=new mongoose.Schema({
    posts: [{
      _id: Object,
      date: Date,
      post: String,
      owner: String,
      ownerName: String,
      ownerDp: String,
      caption: String,
      likes: [String],
      comments: [{
        author: String,
        authorName: String,
        authorDp: String,
        text: String
      }]
    }]
  });
  const Post=mongoose.model('Post',postPool);
  const userSchema=new mongoose.Schema({
    email: String,
    isEmailVerified: { type: Boolean, default: false },
    mobile: Number,
    isMobileVerified: { type: Boolean, default: false },
    googleID:String,
    password: String,
    isSignedUp: { type: Boolean, default: false },
    adminAccess:{type:Boolean,default:false},
    name: String,
    description: String,
    gender: String,
    dob: Date,
    private: { type: Boolean, default: false },
    followRequests: [String],
    followers: [String],
    following: [String],
    profilePicture: {type: String, default:"/images/dp.png"},
    posts: [String],

    //--------------------------  DATA from TOOLS ----------------------------------//

    //------------------  progress ----------------//
    height:{
      type:Number,
      min:0
    },
    progress:[{
      date: Date,
      weight: {
        type:Number,
        min:0
      },
      height: {
        type:Number,
        min:0
      },
      bodyFat: {
        type:Number,
        min: 0,
        max: 100
      },
      waistSize: {
        type:Number,
        min: 0
      },
      chestSize:{
        type:Number,
        min:0
      },
      armSize:{
        type:Number,
        min:0
      },
      quadSize:{
        type:Number,
        min:0
      },
      hipSize:{
        type:Number,
        min:0
      },
    }],

    //------------------  DIET TOOL ---------------------//
    food:[{
      name: String,
      protien: Number,
      carbs: Number,
      fats: Number,
      cals: Number
    }],
    diet:[{
      date: Date,
      calories: Number,
      protien: Number,
      carbs: Number,
      fats: Number,
      breakfast:[{
        name:String,
        quantity: Number
      }],
      lunch:[{
        name:String,
        quantity: Number
      }],
      snacks:[{
        name:String,
        quantity: Number
      }],
      dinner:[{
        name:String,
        quantity: Number
      }],
    }],

    //------------------  TRAINING TOOL ---------------------//
    training:[{
      date: Date,
      benchRm: Number,
      deadliftRm: Number,
      squatRm: Number,
      overheadRm: Number,
      exercises:[{
        exName: String,
        reps:Number,
        sets: Number
      }]
    }],

    //------------------  GOAL ---------------------//
    goal:{
      bmr: Number,
      tdee: Number,
      goalCals: Number,
      calBreakDown:{
        protien: Number,
        carbs: Number,
        fats: Number
      }
    }
  });
  userSchema.plugin(passportLocalMongoose,{usernameField: "email"});
  userSchema.plugin(findOrCreate);


  //--------------------------  BLOG DATA ----------------------------------//
  const blogSchema=new mongoose.Schema({
    title: String,
    content: String,
    sampleText:String,
    lastModified: Date,
    author: String,
    authorImg: String,
    authorID:Object,
    isFeatured: {type: Boolean, default:false},
    blogImgs:[String],
    likes:[String]
  });

  const User=mongoose.model('User',userSchema);
  passport.use(User.createStrategy());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/fitty",
  },function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleID: profile.id },function (err, user) {
          user.name=profile.displayName;
          user.isEmailVerified=true;
          user.email=profile.emails[0].value;
          user.save();
          return cb(err, user);
        });
    }
  ));

  const Blog=mongoose.model('Blog',blogSchema);
  

  return [User, Blog, Post];
}


