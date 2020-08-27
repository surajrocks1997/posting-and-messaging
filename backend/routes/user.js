const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      hashPassword,
    });

    const result = await user.save();
    res.status(201).json({ message: "User Created", result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
