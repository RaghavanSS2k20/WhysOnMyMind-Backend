const { application } = require('express')
const mongoose = require('mongoose')
const Schema = require('./Schema')

const userModel = mongoose.model('User',Schema)
module.exports = userModel