const mongoose = require("mongoose")

const uri = "mongodb+srv://raghavan20pw26:raghav0175@assignment.wbcf3qb.mongodb.net/?retryWrites=true&w=majority";
conn = mongoose.connect(uri).then(()=>{
    console.log('connected')

}).catch((error)=>{
    console.log(error)
})
module.exports = conn;