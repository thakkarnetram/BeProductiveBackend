const mongoose = require("mongoose")
require('dotenv').config({path:`.env.${process.env.NODE_ENV}`})
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to DB " + process.env.ATLAS_URI)
})
.catch((err)=>console.log(err))