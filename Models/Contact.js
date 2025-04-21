const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    fullname:{type:String,require:true},
    email:{type:String,required:true},
    mobileNo:{type:String,required:true},
    password:{type:String,required:true},
    imgUrl:{type:String,required:true},
    imgId:{type:String,required:true},
    uId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'}
})

module.exports = mongoose.model('contact',contactSchema)