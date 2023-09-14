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
const getAllPosts = async(req,res)=>{  
    console.log(req.user) 
    try{
        
        const posts = await Post.find({ status: "POSTED" }).sort({createdAt:-1})
        res.status(200).json({'posts':posts})
    }
    catch(e){
        console.log(e)
        res.status(500).json({"message":'Internal Server Error','error':e})
    }  



}

const getById = async(req,res)=>{
    console.log(req.session)
    if(req.isAuthenticated()){
        const id = req.params.id;
        console.log(id)
        try{
            const post = await Post.findById(id);
            if(post)
            {
                res.status(200).json({
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
        res.status(401).json({'message':'please login'})
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

            req.session.postId = newPost.id;
            u.posts.push(newPost._id)
            await u.save()
            res.status(200).json({"message":'post created succesfully','id':newPost.id})
            
        }catch(e){
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
        try
        {const updatedPost = await Post.findByIdAndUpdate(id,{ $set: { content: newContent } },{ new: true })
        if(!updatedPost){
            return req.status(404).json({message:'post not found'})
        }
        return res.status(200).json({message:'update succesfull'})}
        catch(e){
            console.log('upodate failoed ', e)
            res.status(500).json({message:'internal server error',error:e})
        }

    }

}


const SubmitPost = async (req,res)=>{
    if(req.isAuthenticated()){
        
        const id = req.session.postId;
        
        try{
            console.log(req.originalUrl,id)
            const p = await Post.findById(id)
            const desc = getDesc(p.content)
            const imgSrc = getImg(p.content)
            let heading  = req.body.title
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
    SubmitPost
}