const express = require('express')
const router = express.Router()
const contactModels = require('../Models/Contact')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;   
const fileUpload = require('express-fileupload')
cloudinary.config({ 
   cloud_name: process.env.CLOUD_NAME, 
   api_key:process.env.API_KEY, 
   api_secret: process.env.API_SECRET
 });


router.post('/addContact',async (req,res)=>{
   try{
   
     const user = await jwt.verify(req.headers.authorization.split(" ")[1],'secret 123')

     const uploadImg = await cloudinary.uploader.upload(req.files.img.tempFilePath)

      const data = new contactModels ({
         fullname:req.body.fullname,
         email:req.body.email,
         mobileNo:req.body.mobileNo,
         password:req.body.password,
         uId:user._id,
         imgUrl:uploadImg.secure_url,
         imgId:uploadImg.public_id
      })
  
      const newContact = await data.save()
      res.status(200).json({
         msg:newContact
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

router.get('/allContact',async(req,res)=>{
       try{
       const user = await jwt.verify(req.headers.authorization.split(" ")[1],'secret 123')
        

         const data = await contactModels.find({uId:user._id})
       res.status(200).json({
         allData:data
       })
 }
       catch(err)
       {
   console.log(err)
   res.status(500).json({
      err:err
   })

   
       }
      
})

// contact get bt id 
router.get('/id/:contactId',async(req,res)=>{
   try
   {
     const user = await jwt.verify(req.headers.authorization.split(" ")[1],'secret 123')

     const data = await contactModels.find({_id:req.params.contactId,uId:user._id}).populate('batchId','batchname duration')
   
     res.status(200).json({
      contact:data
     })
   }
   catch(err)
   {
     console.log(err)
   }
})

//delete contact by id

router.delete('/delete/:id',async(req,res)=>{
   try
   {
    
      const user = await jwt.verify(req.headers.authorization.split(" ")[1],'secret 123')

     const contact = await contactModels.find({_id:req.params.id})
  
     if(contact[0].uId != user._id)
     {
      return res.status(500).json({
         err:"user invalid"
      })
     }
await cloudinary.uploader.destroy(contact[0].imgId)

    await contactModels.findByIdAndDelete(req.params.id)
    res.status(200).json({
      msg:"data deleted"
    })
     
   }
   catch(err)
   {
      console.log(err)
      res.status(500).json({
         err:err
      })
   }
})

//update by id

router.put('/update/:id',async(req,res)=>{
   try
   {
      const user = await jwt.verify(req.headers.authorization.split(" ")[1],'secret 123')

     const contact = await contactModels.find({_id:req.params.id})
  
     if(contact[0].uId != user._id)
     {
      return res.status(500).json({
         err:"user invalid"
      })
     }

     if(req.files)
     {
     //update with file
     
     await cloudinary.uploader.destroy(contact[0].imgId)

     const updatedImg = await cloudinary.uploader.upload(req.files.img.tempFilePath)

     const data = {
      fullname:req.body.fullname,
      email:req.body.email,
      mobileNo:req.body.mobileNo,
      imageUrl:updatedImg.secure_url,
      imageId:updatedImg.public_id


    }
   const uData = await contactModels.findByIdAndUpdate(req.params.id,data,{new:true})
   res.status(200).json({
      msg:uData
   })

     }
     else{
      const data = {
         fullname:req.body.fullname,
         email:req.body.email,
         mobileNo:req.body.mobileNo
       }
      const uData = await contactModels.findByIdAndUpdate(req.params.id,data,{new:true})
      res.status(200).json({
         msg:uData
      })
      }
     }
   
   catch(err)
   {
      console.log(err)
      res.status(500).json({
         err:err
      })
   }
})

module.exports = router