const express = require('express')
const {getAllPosts,
    getById,
    CreatePost,
    createAboutPost,
    UpdatePostContent,
SubmitPost} = require('./Controller')
const router = express.Router()
//http://localhost:8088/api/post
router.get('/:id',getById);
router.get('/',getAllPosts)
router.post('/create',CreatePost)
router.post('/about', createAboutPost)
router.patch('/update/content/:id',UpdatePostContent)
router.patch('/submit',SubmitPost)
module.exports = router;