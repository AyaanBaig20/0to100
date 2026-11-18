import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "./routes/auth.routes.js"

let app = express();

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


export default app;
