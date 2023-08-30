const Post = require('./Model')

const getAllPosts = async(req,res)=>{   
    try{
        const posts = await Post.find({}).sort({createdAt:-1})
        res.status(200).json({'posts':posts})
    }
    catch(e){
        res.status(500).json({"message":'Internal Server Error','error':e})
    }  



}

const getById = async(req,res)=>{
    if(req.isAuthenticated()){
        const id = req.params.id;
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
        const category = req.body.category;
        const status = 'DRAFT';
        const content = req.body.content;
        const title = req.body.title;
        try{
            const newPost = await Post.create({user,category,status,content,title}) 
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
        const id = req.params.id
        try
        {const updatedPost = await Post.findByIdAndUpdate(id,{ $set: { content: newContent } },{ new: true })
        if(!updatedPost){
            return req.status(404).json({message:'post not found'})
        }
        return res.status(200).json({message:'update succesfull'})}
        catch(e){
            console.log('upodate failoed')
            res.status(500).json({message:'internal server error',error:e})
        }

    }

}

module.exports = {
    getAllPosts,
    getById,
    CreatePost,
    UpdatePostContent,
}