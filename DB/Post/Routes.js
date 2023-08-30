const express = require('express')
const {getAllPosts,
    getById,
    CreatePost,
    UpdatePostContent,} = require('./Controller')
const router = express.Router()
router.get('/:id',getById);
router.get('/all')
router.post('/create',CreatePost)
router.patch('/update/content/:id',UpdatePostContent)

module.exports = router;