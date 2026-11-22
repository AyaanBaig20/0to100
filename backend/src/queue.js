import {Queue} from "bullmq"
import Redis from "ioredis"

let redis = new Redis({maxRetriesPerRequest:null})

const emailQueue = new Queue("send-email",{connection:redis})

export default emailQueue