const express = require('express')
const router = express.Router()
const batchModels = require('../Models/Batch')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;   
const fileUpload = require('express-fileupload')

cloudinary.config({ 
   cloud_name: process.env.CLOUD_NAME, 
   api_key:process.env.API_KEY, 
   api_secret: process.env.API_SECRET
 });


 // add batch 
router.post('/addBatch',async (req,res)=>{
   try{
   
     const user = await jwt.verify(req.headers.authorization.split(" ")[1],'secret 123')

     const uploadImg = await cloudinary.uploader.upload(req.files.img.tempFilePath)

      const data = new batchModels ({
         batchname:req.body.batchname,
         details:req.body.details,
         startingdate:req.body.startingdate,
         duration:req.body.duration,
         uId:user._id,
         imgUrl:uploadImg.secure_url,
         imgId:uploadImg.public_id
      })
  
      const newBatch = await data.save()
      res.status(200).json({
         msg:newBatch
      })
   }
   catch(err)
   {
      console.log("something is wrong")
   console.log(err)

   res.status(500).json({
      error:err
   })
   }
})


// contact get bt id 
router.get('/id/:batchId',async(req,res)=>{
   try
   {
     const user = await jwt.verify(req.headers.authorization.split(" ")[1],'secret 123')

     const data = await batchModels.find({_id:req.params.batchId,uId:user._id})
   
     res.status(200).json({
      contact:data
     })
   }
   catch(err)
   {
     console.log(err)
   }
})





 module.exports = router;