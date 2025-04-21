const express = require('express');
const router = express.Router();
const userModels = require('../Models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;   
require('dotenv').config()
const fileUpload = require('express-fileupload')


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key:process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });

router.post('/signup',async(req,res)=>{
    try{

    
   const nUser = await userModels.find({email:req.body.email})
 
   if(nUser.length > 0 )
   {
    return res.status(200).json({
        msg:"email already registerd"
    })
   }
   
   // file upload
   
   const uploadLogo = await cloudinary.uploader.upload(req.files.logo.tempFilePath)

   const code = await bcrypt.hash(req.body.password,10)

    const data = new userModels({
        fullname:req.body.fullname,
        email:req.body.email,
        password:code,
        mobileNo:req.body.mobileNo,
        address:req.body.address,
        logoUrl:uploadLogo.secure_url,
        logoId:uploadLogo.public_id,
    })

   const info = await data.save()

   res.status(200).json({
    
    info:info
 
   })

    }
    catch(err)
    {
        console.log(err)
    }
})

// login

router.post('/login',async(req,res)=>{
    try
    {
    const user = await userModels.find({email:req.body.email})

   if(user.length == 0)
   {
    return res.status(500).json({
        err:"email is not registered"
    })
}


  const ismatch = await bcrypt.compare(req.body.password,user[0].password)

if(!ismatch)
{
    return res.status(500).json({
        err:"password is wrong"
    })
}

const token = await jwt.sign({
    _id:user[0]._id,
    fullname:user[0].fullname,
    email:user[0].email,
    address:user[0].address,
    logoId:user[0].logoId,
    logoUrl:user[0].logoUrl
},'secret 123',{
    expiresIn:'365d'

})

res.status(200).json({
    _id:user[0]._id,
    fullname:user[0].fullname,
    email:user[0].email,
    address:user[0].address,
    logoId:user[0].logoId,
    logoUrl:user[0].logoUrl,
    token:token
  
})

    }
    catch(err)
    {
        console.log(err)
    }
})


module.exports = router