import express from "express";
import User from "./model/user.schema.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

dotenv.config();
const SECRET = process.env.SECRET;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ======================================Signup route=======================================
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validating if all fields are filled
    if (!(name && email && password)) {
      res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    }

    // Check if email is unique
    const isEmailExist = await User.findOne({ email });

    console.log(isEmailExist);

    if (isEmailExist) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Encrypting password and sending data to the DB
    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    // Sending token to frontend
    const token = jwt.sign({ email, id: user._id }, SECRET, {
      expiresIn: "24h",
    });

    user.token = token;
    user.password = undefined;

    res.status(200).cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600 * 1000 * 2),
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

// ===========================Login route=================================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validating if all fields are filled
    if (!(email && password)) {
      res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    }

    // Check if email is unique
    const user = await User.findOne({ email });

    if (!(user && bcrypt.compare(password, user.password))) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email, id: user._id }, SECRET, {
      expiresIn: "24h",
    });

    user.password = undefined;
    user.token = token;

    const option = {
      httpOnly: true,
      expires: new Date(Date.now() + 2 * 24 * 3600000),
    };

    res
      .status(200)
      .cookie("token", token, option)
      .json({ sucess: true, user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || error });
  }
});

export default app;
