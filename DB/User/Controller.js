
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
//PATCH  localhost http://localhost:8088/api/user/unpinpost
const unPinPost = async (req,res)=>{
    if(req.isAuthenticated()){
        try{
            const user = await User.findById(req.user.id);
            if(!user){
                return res.status(404).json({'message':'user not found'})
            }
            const postIdToRemove = req.body.postId
            console.log("req post id to be remoberd : ",postIdToRemove)
            user.pinnedPost = user.pinnedPost.filter((postId) => !postId.equals(postIdToRemove));
            console.log("pinned post after remove : ", user.pinnedPost)

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
const getProfileNameById = async (req,res)=>{
    console.log(req.params.id)
    if(!req.params.id){
        res.status(400).json({message:"recheck the value"})
                return
    }
    try{
    const user =  await User.findById(req.params.id)
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
const getCurrentUser = async (req,res)=>{
    if(req.isAuthenticated()){
        try{
            const currentUser = req.user
            console.log(req.session)
            await currentUser.populate([{
                path: 'posts',
                 // Filter posts with status "posted"
            },{
                path:'about'
            }]);

            return res.status(200).json({user:currentUser,currentPost:req.session})
        }catch(e){
            return res.status(500).json({message:"failed to fetch current user",error:e})
        }

    }else {
        res.status(401).json({ message: 'Please login to get current ' });
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
        const isObject = req.query.asObject
        
        if(!isObject){
        try{
            const id = req.user.id;
            
            // console.log("id of the user ", id)
            const user = req.user;
            
            if(!user){
                console.log(id + " user npot found ")
                res.status(404).json({message:"user "+id+" not found"})
                return
            }
            const pinnedPosts = user.pinnedPost
            console.log("pinned posts",pinnedPosts)

            
                res.status(200).json({"message":'got',"pinned":pinnedPosts})
            
        }catch(e){
            console.log(e)
            res.status(500).json({message:"Internal server error while getting pinned posts ", error:e})
        }
    }else{
        try{
            let user = req.user;
            user = await user.populate('pinnedPost')
            const pinnedPost = user.pinnedPost
            return res.status(200).json({"pinnedposts":pinnedPost, "user":user})



        }catch(e){
            console.log(e)
            res.status(500).json({message:"Internal server error while getting pinned posts ", error:e})
        }
    }
    }else{
        res.status(401).json({message:"please login to get pinned posts"})

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
const getLikedPostsByUser = async(req,res)=>{
    if(req.isAuthenticated()){
        try{
            const id = req.user.id;
            // console.log("id of the user ", id)
            const user = await User.findById(id);
            
            if(!user){
                console.log(id + " user npot found ")
                res.status(404).json({message:"user "+id+" not found"})
                return
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
const getUserByEmail = async(req,res)=>{
    if(!req.params.email){
        return res.status(400).json({message:'rechek value'})
    }
    try{
        console.log(req.params.email)
        const user = await User.findOne({email:req.params.email})
        if(!user){return res.status(401).json({message:'rechek value'})}

        try{
        await user.populate([{
            path: 'posts',
             // Filter posts with status "posted"
        },{
            path:'about'
        }]);
        

    }catch(e){
        console.log(e)
    }

       


        return res.status(200).json({user:user})
    }catch(e){
        return res.status(500).json({messgae:"nothing good all bad"})
    }
}

const getUserById = async (req,res)=>{
    
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
    
}
const getAllUsers = async(req,res)=>{
    try{
    const users = await User.find({}).sort({createdAt:-1})
    res.status(200).json({users:users})
    }catch(e){
        res.status(500).json({message:e})
    }
}
const setUserProfileName = async(req,res)=>{
    try{
        if(!req.body.uid && !req.body.profileName){
            return res.status(400)

        }
        const user = await User.findById(req.body.uid)
        user.profileName = req.body.profileName
        try{
            await user.save()
        }catch(e){
            return res.status(500).json({error:e})
        }
        return res.status(200).json({message:user.profileName})
    }catch(e){
        return res.status(500).json({error:e})

    }
}
// const getCurrentUser = async(req,res)=>{
//     if(req.isAuthenticated()){
//         res.status(200).json({"user":req.user.id})
//     }else{
//         res.status(401).json({'message':'please login'})
//     }
// }

//BIo
const setBio = async(req,res)=>{
    if(req.isAuthenticated()){
        try{
            const user = req.user;
            const newBio = req.body.bio;
            user.bio = newBio
            await user.save()
            return res.status(200).json({message:'bio updated succesfully'})
        }catch(e){
            return res.status(500).json({message:'error in setting bio'})
        }

    }else{
        return res.status(401).json({message:'please login again'})
    }
}
// const getBioByid = async(req,res)=>{
//     const userId = req.params.id;

//         try{
//            const user = await User.findById(userId)
//             const bio = user.bio
           
//             return res.status(200).json({message:'bio fetchd succesfully', bio:bio})
//         }catch(e){
//             return res.status(500).json({message:'error in setting bio'})
//         }

    

// }
const updateGeneralDetails = async(req,res)=>{
    if(req.isAuthenticated()){
        try{
            const user = req.user;
            const newProfileName  = req.body.profileName;
            try{
                const isValiuser = await User.findOne({profileName:newProfileName})
                if(isValiuser && user.id!==isValiuser.id){
                    return res.status(400).json({message:'user already exist'})
                }
                console.log("the bio is ",req.body.bio)
                user.bio = req.body.bio;
                user.profileName = newProfileName;
                await user.save()
                return res.status(200).json({message:'user updated succesfully', user:user})
            }catch(e){
                return res.status(500).json({message:'error in updating user'})

            }
        }catch(e){
            return res.status(500).json({message:'error in saving user'})
        }
           
       
    }else{
        return res.status(401).json({message:'please login again'})

    }
}

module.exports = {
    PinPost,
    unPinPost,
    getUserById,
    getPinnedPosts,
    likePost,
    unlikePost,
    setProfileName,
    getProfileNameById,
    getLikedPostsByUser,
    getAllUsers,
    setUserProfileName,
    getUserByEmail,
    getCurrentUser,
    setBio,
    updateGeneralDetails,
    clearSession
    
}