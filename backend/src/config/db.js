import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
let DB_URL = process.env.DB_URL

async function main() {
  await mongoose.connect(DB_URL).then(()=>{
    console.log("db connected");
  }).catch((err)=>{
    console.log(`db not connected ${err}`)
  })
}

export default main
