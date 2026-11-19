import express from "express"
import dotenv from "dotenv"

dotenv.config()
let app = express()
let PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
app.get("/",(req,res)=>{
    res.send("checkup route 2")
})