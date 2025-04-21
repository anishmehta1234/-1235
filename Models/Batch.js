const mongoose = require('mongoose')

const batchSchema = new mongoose.Schema({
   batchname:{type:String,require:true},
    details:{type:String,required:true},
    startingdate:{type:String,required:true},
    duration:{type:String,required:true},
    imgUrl:{type:String,required:true},
    imgId:{type:String,required:true},
    uId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'}
})

module.exports = mongoose.model('batch',batchSchema)