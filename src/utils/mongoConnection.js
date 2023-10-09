const mongoose = require("mongoose")
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to DB " + process.env.ATLAS_URI)
})
.catch((err)=>console.log(err))