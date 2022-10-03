const mongoose=require('mongoose');
const passport= require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

module.exports=database;

function database(){
  mongoose.connect('mongodb://localhost:27017/fitty');
  //--------------------------  USER DATA ----------------------------------//

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
    followers: [String],
    following: [String],
    profilePicture: {type: String, default:"/images/dp.png"},
    posts: [{
      date: Date,
      post: String,
      likes: [String],
      comments: [{
        author: String,
        text: String
      }]
    }],
  });
  userSchema.plugin(passportLocalMongoose,{usernameField: "email"});
  userSchema.plugin(findOrCreate);

  //--------------------------  DATA from TOOLS ----------------------------------//

  const toolsDataSchema=new mongoose.Schema({
    user: userSchema,

    //------------------  PROGRESS TRACKER ---------------------//
    progress:{
      date: Date,
      bodyWeight: {
        type:Number,
        min:0
      },
      waistSize: {
        type:Number,
        min: 0
      },
      bodyFat: {
        type:Number,
        min: 0,
        max: 100
      },
      quadSize:{
        type:Number,
        min:0
      },
      chestSize:{
        type:Number,
        min:0
      },
      armSize:{
        type:Number,
        min:0
      },
      hipSize:{
        type:Number,
        min:0
      },
      muscleMass:{
        type:Number,
        min:0
      },
    },

    //------------------  DIET TOOL ---------------------//
    diet:{
      date: Date,
      breakfast:[{
        food: String,
        calories: Number,
        protien: Number,
        carbs: Number,
        Fats: Number
      }],
      lunch:[{
        food: String,
        calories: Number,
        protien: Number,
        carbs: Number,
        Fats: Number
      }],
      snacks:[{
        food: String,
        calories: Number,
        protien: Number,
        carbs: Number,
        Fats: Number
      }],
      dinner:[{
        food: String,
        calories: Number,
        protien: Number,
        carbs: Number,
        Fats: Number
      }],
    },

    //------------------  TRAINING TOOL ---------------------//
    training:{
      date: Date,
      rm1:{
        exercise: String,
        weight: Number,
        reps:Number,
        rm: Number
      },
      exercises:[{
        exName: String,
        reps:[{
          setNum: Number,
          weight: Number
        }]
      }]
    },

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

  //--------------------------  BLOG DATA ----------------------------------//
  const blogSchema=new mongoose.Schema({
    title: String,
    content: String,
    sampleText:String,
    datePublished: Date,
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
          user.profilePicture=profile.photos[0].value;
          user.save();
          return cb(err, user);
        });
    }
  ));

  const Tool=mongoose.model('Tool',toolsDataSchema);
  const Blog=mongoose.model('Blog',blogSchema);

  return [User, Tool, Blog];
}


