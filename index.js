const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const router = require("./src/routes/userRoute")

const PORT = 3500 || process.env.PORT

app.use(bodyParser.json())

mongoose.connect("mongodb://localhost:27017/annoy")
.then(()=>
console.log("DB is connected successfully"))

.catch((Error)=>
console.log(Error))

app.use("/",router)

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
})