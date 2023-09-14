const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Post = new Schema({
    user:String,
    category:{
        type:String,
        enum:['Life Lesson','Tech Stack','Books','General']
    },
    status:{
        type:'String',
        enum:['DRAFT','POSTED','REPORTED']

    },
    content:String,
    title:String,
    description:String,
    clickUpImageSrc:String,
    likedBy:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ]
     
    


},{timestamps:true})
module.exports = Post