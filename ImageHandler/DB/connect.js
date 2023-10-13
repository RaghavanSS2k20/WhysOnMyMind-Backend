const mongoose = require("mongoose")
require('dotenv').config();
const uri = process.env.URI;
console.log("urii",uri)
conn = mongoose.connect(uri).then(()=>{
    console.log('connected')

}).catch((error)=>{
    console.log(error)
})
module.exports = conn;