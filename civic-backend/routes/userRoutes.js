const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/test", (req, res) => {
  res.send("User route working");
});


/* REGISTER */

router.post("/register", async (req, res) => {

  try {

    const { name, phone, password, role, ward } = req.body;

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists ❌"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      role,
      ward
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully ✅"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error creating user ❌",
      error: error.message
    });

  }

});


/* LOGIN */

router.post("/login", async (req, res) => {

  try {

    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        message: "User not found ❌"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials ❌"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      role: user.role,
      department: user.department
    });

  } catch (error) {

    res.status(500).json({
      message: "Login error ❌",
      error: error.message
    });

  }

});

module.exports = router;