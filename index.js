const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/webpage");
//-----------------------------------------------------

const express = require('express');
const app = express();

// Serve static files
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

app.use('/',userRoute)
app.use('/admin',adminRoute)

app.listen(3059,function(){
    console.log("http://localhost:3059 ")
})