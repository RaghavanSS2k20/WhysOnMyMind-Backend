const express = require('express')
const  {
    PinPost,
    unPinPost,
    getUserById,
    getPinnedPosts
} = require('./Controller')
const router = express.Router()
router.get('/:id',getUserById);
router.patch('/pinpost',PinPost)
router.patch('/unpinpost',unPinPost)
router.get('/get/pinnedposts',getPinnedPosts)
module.exports  = router