const mongoose = require('mongoose')
const Schema = require('./Schema')
const PostModel = mongoose.model('Post',Schema)
module.exports = PostModel