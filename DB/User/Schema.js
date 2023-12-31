const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema
const User = new Schema({
    googleId: {
        type: String,
        unique: true,
        
      },
      email: {
        type: String,
        unique: true,
        
      },
      displayName: {
        type: String,
        
      },
      firstName: {
        type: String,
        
      },
      lastName: {
        type: String,
        
      },
      image: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },    
      pinnedPost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
      }],
      posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
      }],
      likedPost:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Post'
        }
      ],
      profileName:{
        type:String,
        unique:true,
      },
      bio:{
        type:String,
        default :'Content creator, Being human'
      },
      about:{
        type:mongoose.Schema.Types.ObjectId,
          ref:'Post'
      },
      
},{timestamps:true})
User.plugin(passportLocalMongoose,{
    usernameField:'email',
})
module.exports = User