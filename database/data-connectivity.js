const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
const secret=process.env.SECRET;

module.exports=database;

function database(){
  mongoose.connect('mongodb://localhost:27017/fitty');
  //--------------------------  USER DATA ----------------------------------//

  const userSchema=new mongoose.Schema({
    username:String,
    password: String,
    name: String,
    email: String,
    description: String,
    private: Boolean,
    followers: [String],
    following: [String],
    profilePicture: String,
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
  userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});

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
    datePublished: Date
  });

  const User=mongoose.model('User',userSchema);
  const Tool=mongoose.model('Tool',toolsDataSchema);
  const Blog=mongoose.model('Blog',blogSchema);

  return [User, Tool, Blog];
}


