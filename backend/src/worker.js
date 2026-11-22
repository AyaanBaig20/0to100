import {Worker} from "bullmq"
import { sendEmail } from "./utilis/sendEmail.js"
import Redis from "ioredis"

export const redis = new Redis({maxRetriesPerRequest:null})

const worker = new Worker("send-email",async(job)=>{
    const email = job.data.email
    await sendEmail(email)
},{connection:redis})