const Post = require('../Post/Model');
const User = require('./Model')
const PinPost = async (req,res)=>{
    if(req.isAuthenticated()){
        try
            { 
                const user = await User.findById(req.user.id)
                if(user){
                    user.pinnedPost.push(req.body.postId)
                
                    try {
                        await user.save();
                        console.log('PinnedPost updated successfully', user.pinnedPost);
                        res.status(200).json({ message: 'PinnedPost updated successfully' });
                      } catch (err) {
                        console.error('Error saving user:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                      }
                }else{
                    res.status(404).json({'message':'post not found'})
                }
            }catch(e){
                res.status(500).json({message:'internal server error while pin',error:e})
            }
            
    }else{
        res.status(401).json({message:'pleas login to pin'})
    }
    


    
}
const unPinPost = async (req,res)=>{
    if(req.isAuthenticated()){
        try{
            const user = await User.findById(req.user.id);
            if(!user){
                return res.status(404).json({'message':'user not found'})
            }
            const postIdToRemove = req.body.postId
            user.pinnedPost = user.pinnedPost.filter((postId) => postId !== postIdToRemove);

            // Save the updated user document
            try {
                await user.save();
                console.log('Post removed from pinnedPost successfully');
                res.status(200).json({ message: 'Post removed from pinnedPost successfully' });
              } catch (err) {
                console.error('Error saving user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
              }
        }catch(e){
            console.log(e)
            res.status(500).json({message:'internal server error while unpin',error:e})

        }

    }
    else{
        res.status(401).json({message:'pleas login to unpin'})
    }
}
const likePost = async(req,res)=>{
    if(req.isAuthenticated()){
        try{
            const user = await User.findById(req.user.id)
            let post = null;
            try{
             post = await Post.findById(req.body.postId)
            }catch(e){
                console.log(e)
            }
            user.likedPost.push(post._id)
            try{
                await user.save()

            }catch(err){
                console.log(err)
                res.status(500).json({message:'Error while saving user ad likedPost',})
            }

            try{
                await post.save()
            }catch(e){
                console.log(e)
                res.status(500).json({message:'Error while saving post at likedPost'})

            }
            console.log(user.id)
            post.likedBy.push(user.id)
            try{
                await post.save()
            }
            catch(e){
                console.log(e)
                res.status(500).json({message:'Error while saving post id likedPost'})

            }
            res.status(200).json({message:'post liked',post:post})
        }catch(error){
            res.status(500).json({message:'Error while liked post', error:error})
        }

    }else{
        res.status(401).json({message:'please login to like the post'})
    }
}
const setProfileName = async(req,res)=>{
    if(req.isAuthenticated()){
        try{
            const user = await User.findById(req.user.id);
            if(!req.body.profileName){
                res.status(400).json({message:"recheck the value"})
                return
            }
            user.profileName = req.body.profileName;
            try{
                await user.save()
            }catch(e){
                res.status(500).json({message:'error while saving the user after updating the profile name'})
                return
            }
            res.status(200).json({message:'profile name updated successfuly'})
        }catch(e){
            res.status(500).json({message:'error while updating the profile name'})
        }
        
        

        
    }else {
        res.status(401).json({ message: 'Please login to unlike the post' });
    }
}
const getProfileNameById = async ()=>{
    if(!req.body.userId){
        res.status(400).json({message:"recheck the value"})
                return
    }
    try{
    const user =  await User.findById(req.body.userId)
    if(user.profileName){
        return res.status(200).json({profileName:user.profileName})

    }else{
        return  res.status(404).json({message:'the resource is not available at thgis moment'})
    }
}catch(e){
    res.status(500).json({message:"cantr complete the request at this moment"})
    return

}
}
const unlikePost = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findById(req.user.id);
            const post = await Post.findById(req.body.postId);
            // console.log(post)
            // Remove the post's ID from the user's likedPosts array

            if(!user.likedPost){
                res.status(400).json({"message":'bad request'})
                return
            }
            let postIndex
            try{
             postIndex = user.likedPost.indexOf(post._id);
            }catch(e){
                console.log(e)
            }
            if (postIndex !== -1) {
                
                user.likedPost.splice(postIndex, 1);
            }

            try {
                await user.save();
            } catch (err) {
                res.status(500).json({ message: 'Error while saving user and unlikedPost' });
                return;
            }
            const usid = post.likedBy.indexOf(user.id);
            if(usid!==-1){
                post.likedBy.splice(usid,1)
            }
            try{
                await post.save()
            }catch(e){
                res.status(500).json({ message: 'Error while saving user and unlikedPost' });

            }

            res.status(200).json({ message: 'Post unliked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error while unliking post', error: error });
        }
    } else {
        res.status(401).json({ message: 'Please login to unlike the post' });
    }
};

const getPinnedPosts = async(req,res)=>{
    if(req.isAuthenticated()){
        try{
            const id = req.user.id;
            // console.log("id of the user ", id)
            const user = await User.findById(id);
            
            if(!user){
                console.log(id + " user npot found ")
                res.status(404).json({message:"user "+id+" not found"})
            }
            const pinnedPosts = user.pinnedPost
            console.log("pinned posts",pinnedPosts)

            
                res.status(200).json({"message":'got',"pinned":pinnedPosts})
            
        }catch(e){
            console.log(e)
            res.status(500).json({message:"Internal server error while getting pinned posts ", error:e})
        }
    }else{
        res.status(401).json({message:"please login to get pinned posts"})

    }
}
const getLikedPostsByUser = async(req,res)=>{
    if(req.isAuthenticated()){
        try{
            const id = req.user.id;
            // console.log("id of the user ", id)
            const user = await User.findById(id);
            
            if(!user){
                console.log(id + " user npot found ")
                res.status(404).json({message:"user "+id+" not found"})
            }
            const likedPosts = user.likedPost
            console.log("pinned posts",likedPosts)

            
                res.status(200).json({"message":'got',"post":likedPosts})
            
        }catch(e){
            console.log(e)
            res.status(500).json({message:"Internal server error while getting pinned posts ", error:e})
        }
    }else{
        res.json(401).json({message:'please login to get liked post'})
    }
}
const getUserById = async (req,res)=>{
    if(req.isAuthenticated()){
        try{
            const id = req.params.id;
            const user = await User.findById(id);
            if(!user){
                res.status(404).json({message:'user not found'})
            }
            res.status(200).json({user:user})


        }catch(e){
            res.status(500).json({message:"internal server error on getting user by id", error:e})
        }
    }else{
        res.status(401).json({message:'please login to get user'})
    }
}
// const getCurrentUser = async(req,res)=>{
//     if(req.isAuthenticated()){
//         res.status(200).json({"user":req.user.id})
//     }else{
//         res.status(401).json({'message':'please login'})
//     }
// }
module.exports = {
    PinPost,
    unPinPost,
    getUserById,
    getPinnedPosts,
    likePost,
    unlikePost,
    setProfileName,
    getProfileNameById,
    getLikedPostsByUser
}