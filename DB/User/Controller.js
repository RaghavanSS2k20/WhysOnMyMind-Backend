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
module.exports = {
    PinPost,
    unPinPost,
    getUserById,
    getPinnedPosts
}