// const Post = new Schema({
//     user:String,
//     category:{
//         type:String,
//         enum:['Life Lesson','Tech Stack','Books','General']
//     },
//     status:{
//         type:'String',// a post for about user
//         enum:['DRAFT','POSTED','REPORTED','ABOUT']

//     },
//     content:String,
//     title:String,
//     description:String,
//     clickUpImageSrc:String,
//     likedBy:[
//         {
//             type:Schema.Types.ObjectId,
//             ref:'User'
//         }
//     ]
     
    


// }
const Post = require('./Model')
const User = require('../User/Model')
const getHeadingFromContent = require('./utils/parse-heading')
const getDescriptionFromContent = require('./utils/parse-description')
const getClickUpImageFromContent = require('./utils/parse-image')
const getDesc = (md)=>{
    const desc = getDescriptionFromContent(md);
    return desc
}
const getHdng = (md)=>{
    const desc = getHeadingFromContent(md);
    return desc
}
const getImg = (md)=>{
    const img = getClickUpImageFromContent(md)
    return img
}
//http://localhost:8088/api/post
const getAllPosts = async(req,res)=>{  
    console.log(req.user) 
    try{
        
        const posts = await Post.find({ status: "POSTED" }).sort({createdAt:-1}).populate('user', 'email profileName');
        res.status(200).json({'posts':posts})
    }
    catch(e){
        console.log(e)
        res.status(500).json({"message":'Internal Server Error','error':e})
    }  



}
//http://localhost:8088/api/post/:id
const getById = async(req,res)=>{
    console.log(req.session)
    if(!req.user)
    {
        const id = req.params.id;
        console.log(id)
        try{
            const post = await Post.findById(id);
            if(post)
            {
                res.status(200).json({
                isAuthenticated:false,
                "message":'post found',
                'post':post
            })}
            else{
                res.status(404).json({
                    "message":'post not found'
                })
            }
        }catch(e){
            res.status(500).json({'message':'internal server error','error':e})
        }

    }else{
        const id = req.params.id;
        console.log(id)
        try{
            const post = await Post.findById(id);
            post.populate({
                path:'highlights',
                match:{ user: req.user.id },
                select: 'highlightedText'
            })
            
            
            if(post)
            {
                return res.status(200).json({
                isAuthenticated:true,
                "message":'post found',
                'post':{
                    post,
                    userHighlighted: post.highlights
                }
                
            })}
            else{
                return res.status(404).json({
                    "message":'post not found'
                })
            }
        }catch(e){
           return res.status(500).json({'message':'internal server error','error':e})
        }

    }
}
//PATCH http://localhost:8088/api/post/update/highlight/:id
const updateHighlightedText = async(req,res)=>{
    if(req.user)
    {const postId = req.params.id
        console.log(postId)
    const userId = req.user.id;
    let post
    try{
        try{
         post = await Post.findById(postId.trim());
        }catch(e){
            console.log(e)
        }
        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
        const highlightIndex = post.highlights.findIndex(
            (highlight) => highlight.user.toString() === userId
        );
try{
        if (highlightIndex === -1) {
            // If the user doesn't have a highlight, create a new one
            post.highlights.push({
                user: userId,
                highlightedText: req.body.highlightedText
            });
        } else {
            // Update the existing highlight
            post.highlights[highlightIndex].highlightedText = req.body.highlightedText;
        }
    }catch(e){
        console.log(e)
    }
        // Save the updated post
        let updatedPost
        try{
         updatedPost = await post.save();
        }catch(e){
            console.log(e)
        }

        return res.status(200).json({
            message: 'Highlight updated successfully',
            post: updatedPost
        });

    }catch(e){
        return  res.status(500).json({ message: 'Internal server error', error: e });

    }
}else{
    return res.status(401).json({ message: 'please login to highlight',});
}}
//http://localhost:8088/api/post/about
const createAboutPost = async(req,res)=>{
    if(req.isAuthenticated()){
        const user = req.user
        const postUser = user.id
        const status = 'ABOUT'
        const content = ""
        const title = 'About me'
        try{
            const aboutPost = await Post.create({
                user:postUser,
                status:status,
                content:content,
                title:title

            })
            req.session.postId = aboutPost.id
            user.about = aboutPost._id
            await user.save()
            return res.status(200).json({postid:aboutPost.id})
            
        }catch(e){
            res.status(500).json({'message':'internal server error','error':e})
        }



    }else{
        res.status(401).json({'message':'please login again'})

    }
}
//http://localhost:8088/api/user/clear-session
const clearSession = ()=>{
    if(req.isAuthenticated()){
        try{
            req.session.postId=""
            return res.status(200).json({message:"Cleared sucessFullyF"})


        }catch(e){
            console.log(e)
            return res.status(500).json({message:'Error while clearing session',error:e})
        }

    }else{
        res.status(401).json({'message':'please login again'})

    }
}
const CreatePost = async(req,res)=>{
    if(req.isAuthenticated()){
        
        const user = req.user.id;
        const u = await User.findById(user)
        const category = req.body.category;
        const status = 'DRAFT';
        const content = req.body.content;
        const title = req.body.title;
        try{
            const newPost = await Post.create({user,category,status,content,title}) 

            req.session.postId = newPost._id;
            try{
            u.posts.push(newPost._id)
            await u.save()
            }catch(e){
                console.log(e)
            }
            res.status(200).json({"message":'post created succesfully','id':newPost.id})
            
        }catch(e){
            console.log(e)
            res.status(500).json({'message':'internal server error','error':e})
        }
    }else{
        res.status(401).json({'message':'please login again'})
    }
}
const UpdatePostContent = async (req,res)=>{
    if(req.isAuthenticated()){
        console.log(req.originalUrl)
        const id = req.params.id
        const newContent  = req.body.content
        console.log("The content is ",newContent)
        try
        {
            const updatedPost = await Post.findByIdAndUpdate(id,{ $set: { content: newContent } },{ new: true })
        if(!updatedPost){
            return req.status(404).json({message:'post not found'})
        }
        await updatedPost.save()
        console.log("The content is updtaed ",newContent.content )
        return res.status(200).json({message:'update succesfull '})}
        catch(e){
            console.log('upodate failoed ', e)
            res.status(500).json({message:'internal server error',error:e})
        }

    }

}


const SubmitPost = async (req,res)=>{
    if(req.isAuthenticated()){
        console.log(req.session)
        const id = req.session.postId;
        
        try{
            console.log(req.originalUrl,id)
            const p = await Post.findById(id)
            let desc = ''
            let imgSrc = ''
            try{
             desc = getDesc(p.content)
            imgSrc = getImg(p.content)
            let heading  = req.body.title
            }
            catch(e){console.log(e)}
            if(req.body.title === "A Valid name of your work?"){
                console.log("samee")
                heading =  getHdng(p.content)            
            }
            console.log(desc)
            const post = await Post.findByIdAndUpdate(id,{
                $set:{
                    status:'POSTED',
                    title:heading,
                    category:req.body.category,
                    description: desc,
                    clickUpImageSrc:imgSrc
                }
            },{new:true})
            try{
            req.session.postId=""
            
            }catch(e){
                console.log(e)
            }
            console.log('the content from func cal',req.session.postId)
            if(!post){
                console.log('req.session.postId , ',id)
                return req.status(404).json({message:'post not found'})
            }
            
            return res.status(200).json({message:'posted succesfully',postID:post.id,user:req.user.id,post:post})

        }catch(e){
            res.status(500).json({message:'internal server error while posting'})
        }

    }else{
        req.status(401).json({message:'user must be logged in to post'})
    }
}

module.exports = {
    getAllPosts,
    getById,
    CreatePost,
    UpdatePostContent,
    SubmitPost,
    createAboutPost,
    updateHighlightedText
    
}