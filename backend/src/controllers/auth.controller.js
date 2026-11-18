import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function login(req, res) {
  try {
    let { username, password } = req.body;

    // Check fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find existing user
    let existUser = await userModel.findOne({ username });

    if (!existUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Compare password
    let result = await bcrypt.compare(password, existUser.password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    let token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name:existUser.name,
        username: existUser.username,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
async function signup(req, res) {
  try {
    let { name, username, password } = req.body;

    // Check the data
    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    let existingUser = await userModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash password
    let hash = await bcrypt.hash(password, 12);

    // Create user
    let user = await userModel.create({
      name,
      username,
      password: hash,
    });

    // Generate token
    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export { login ,signup};
