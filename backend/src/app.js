import express from "express";
import Redis from "ioredis"

import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import userModel from "./model/user.model.js";

let app = express();
const redis =new Redis(process.env.REDIS_URL) 

app.get("/", (req, res) => {
  res.send("checkup route");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/api/auth",authRouter)

app.get("/get",async(req,res)=>{
  let user =await userModel.find({})
  return res.json(user)
})
// with redis 
app.get("/get-with-redis",async(req,res)=>{
  let data =await redis.get("user:all")
  if(data){
    let normal = JSON.parse(data)
    return res.json({message:"data from redis",normal})
  }
  let user =await userModel.find({})
  await redis.set("user:all",JSON.stringify(user))
  return res.json(user)
})
export default app;

// otp management
app.get("/get-otp",async(req,res)=>{
  let {email}= req.body
  let otp = Math.floor(1000 + Math.random() * 9000)
  await redis.set(`otp:${email}`,otp,"EX",30)
  return res.json(otp)
})
app.post("/verify-otp",async(req,res)=>{
  let {email,otp}= req.body
  let redis_otp = await redis.get(`otp:${email}`)
  if (!redis_otp) {
    return res.json({message:"wrong otp or timeout"})
  }
  if (redis_otp == otp) {
    redis.del(`otp:${email}`)
    return res.json({message:"opt match"})
  }
})