const express = require('express')
const {getAllPosts,
    getById,
    CreatePost,
    UpdatePostContent,
SubmitPost} = require('./Controller')
const router = express.Router()
router.get('/:id',getById);
router.get('/',getAllPosts)
router.post('/create',CreatePost)
router.patch('/update/content/:id',UpdatePostContent)
router.patch('/submit',SubmitPost)
module.exports = router;