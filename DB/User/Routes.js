const express = require('express')
const  {
    PinPost,
    unPinPost,
    getUserById,
    getPinnedPosts,
    likePost,
    unlikePost,
    getLikedPostsByUser
} = require('./Controller')
const router = express.Router()
router.get('/:id',getUserById);
router.patch('/pinpost',PinPost)
router.patch('/unpinpost',unPinPost)
router.get('/get/pinnedposts',getPinnedPosts)
router.patch('/like',likePost)
router.patch('/unlike', unlikePost)
router.get('/get/liked',getLikedPostsByUser)
module.exports  = router