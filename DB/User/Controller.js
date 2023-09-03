const User = require('./Model')
const PinPost = async (req,res)=>{
    if(req.isAuthenticated()){
        try
            { 
                const user = await User.findById(req.user.id)
                if(user){
                    user.pinnedPost.push(req.body.postId)
                
                user.save((err) => {
                    if (err) {
                      console.error('Error saving user:', err);
                      res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                      console.log('PinnedPost updated successfully');
                      res.status(200).json({ message: 'PinnedPost updated successfully' });
                    }
                  })
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
            user.pinnedPost = user.pinnedPost.filter((postId) => postId !== postIdToRemove);

            // Save the updated user document
            user.save((err) => {
              if (err) {
                console.error('Error saving user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                console.log('Post removed from pinnedPost successfully');
                res.status(200).json({ message: 'Post removed from pinnedPost successfully' });
              }
            });
        }catch(e){
            res.status(500).json({message:'internal server error while unpin',error:e})

        }

    }
    else{
        res.status(401).json({message:'pleas login to unpin'})
    }
}