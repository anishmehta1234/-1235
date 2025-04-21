const express = require('express')
const app = express()
const mongoose = require('mongoose')
const contactRoutes = require('./routes/contact')
const userRoutes = require('./routes/user')
const batchRoutes = require('./routes/batch')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const { base } = require('./Models/Contact')
require('dotenv').config()


const connectWithDataBase = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
     console.log("connected with database......")

    }
    
    catch(err)
    {
      
     console.log(err)
    }
}
connectWithDataBase();


app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles : true,
    // tempFileDir : '/tmp/'
}));

app.use('/auth',userRoutes)
app.use('/contact',contactRoutes)
app.use('/batch',batchRoutes)

module.exports = app;