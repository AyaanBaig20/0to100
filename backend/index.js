import main from "./src/config/db.js"
import app from "./src/app.js";
import dotenv from "dotenv"

dotenv.config()

let PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})
main()
