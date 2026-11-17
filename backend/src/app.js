import express from "express";

import userModel from "./model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

let app = express();

app.get("/", (req, res) => {
  res.send("checkup route");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    let { name, username, password } = req.body;
    // check the data
    if (!name || !username || !password) {
      return res.status(400).json({ message: "all field is required" });
    }
    // check exsisting user
    let exsistingUser = await userModel.findOne({ username });
    if (exsistingUser) {
      return res.status(400).json({ message: "username already exists" });
    }
    await bcrypt.hash(password, 12, function (err, hash) {
      let user = userModel.create({
        name,
        username,
        password: hash,
      });
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });
      return res
        .status(200)
        .json({
          message: "user created successfully",
          user: { name, username, token },
        });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    // Check fields
    if (!username || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Find existing user
    let existUser = await userModel.findOne({ username });

    if (!existUser) {
      return res.status(400).json({
        message: "User does not exist"
      });
    }

    // Compare password
    let result = await bcrypt.compare(password, existUser.password);

    if (!result) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // Generate token
    let token = jwt.sign(
      { id: existUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        username: existUser.username,
        token
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
});

export default app;
