const express = require('express')
const  {
    getAllUsers,
    PinPost,
    unPinPost,
    getUserById,
    getPinnedPosts,
    likePost,
    unlikePost,
    getLikedPostsByUser,
    setProfileName,
    getProfileNameById,
    setUserProfileName,
    getUserByEmail,
    getCurrentUser,
    setBio,
    clearSession,
    updateGeneralDetails,
    

} = require('./Controller')
const router = express.Router()
//localhost http://localhost:8088/api/user
router.get('/:id',getUserById);
router.get('/get/all', getAllUsers)
router.get('/get/liked',getLikedPostsByUser)
router.get('/get/pinnedposts',getPinnedPosts)
router.get('/get/email/:email', getUserByEmail )
router.get('/get/profilename/:id',getProfileNameById)
router.get('/get/current',getCurrentUser)
router.patch('/pinpost',PinPost)
router.patch('/unpinpost',unPinPost)
router.patch('/like',likePost)
router.patch('/unlike', unlikePost)
router.patch('/set/profilename', setUserProfileName)
router.patch('/save/general', updateGeneralDetails)
router.delete('/clear-session',clearSession)
module.exports  = router