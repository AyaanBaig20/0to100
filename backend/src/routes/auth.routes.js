import express from "express"
import {login,signup} from "../controllers/auth.controller.js"

let Router = express.Router()

// login api route
Router.post("/login",login)

// signup api route
Router.post("/signup",signup)

export default Router