const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname:{type:String,required:true},
    email:{type:String,requiredddd:true},
    password:{type:String,required:true},
    mobileNo:{type:String,required:true},
    address:{type:String,required:true},
    logoUrl:{type:String,require:true},
    logoId:{type:String,require:true}
})

module.exports = mongoose.model('user',userSchema)