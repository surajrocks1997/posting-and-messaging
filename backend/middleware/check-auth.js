const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  try {
    const token = req.header.authorization.split(" ")[1];
    jwt.verify(token, config.get("jwtSecret"));
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authorization Failed",
    });
  }
};
