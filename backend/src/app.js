import express from "express"
let app = express()

app.get("/",(req,res)=>{
    res.send("checkup route")
})

export default app