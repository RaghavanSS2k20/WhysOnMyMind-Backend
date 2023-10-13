const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Post = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    category:{
        type:String,
        enum:['Life Lesson','Tech Stack','Books','General']
    },
    status:{
        type:'String',// a post for about user
        enum:['DRAFT','POSTED','REPORTED','ABOUT']

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
    ],
    highlights:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            highlightedText:{
                type:String
            }
        }
    ]
     
    


},{timestamps:true})
module.exports = Post