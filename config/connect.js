const mongoose = require("mongoose")
require('dotenv').config();
const uri =  process.env.MONGOURI;
conn = mongoose.connect(uri,{
    serverSelectionTimeoutMS: 15000
}).then(()=>{
    console.log("mongoDB connected successfully")

}).catch((error)=>{
    console.log(error)
})
module.exports = conn;