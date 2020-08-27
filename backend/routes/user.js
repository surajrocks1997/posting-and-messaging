const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashPassword,
    });

    const result = await user.save();
    res.status(201).json({ message: "User Created", result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Authentication Failed. Invalid Username/Password",
      });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).json({
        message: "Authentication Failed. Invalid Username/Password",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      config.get("jwtSecret"),
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    res.status(401).json({
      message: "Authentication Failed. Invalid Username/Password",
    });
  }
});

module.exports = router;
