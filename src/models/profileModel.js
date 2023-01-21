const mongoose = require("mongoose")
const profileSchema = new mongoose.Schema({
    book_title:{type:String, required:true},
    author:{type:String,required:true},
    category:{type:String,required:true},
    price:{type:Number,required:true}
})
module.exports = mongoose.model('profile',profileSchema)
