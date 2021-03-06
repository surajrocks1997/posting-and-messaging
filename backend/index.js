const express = require("express");
const path = require("path");

const app = express();

const connectDB = require("./config/db");

connectDB();

app.use("/images", express.static(path.join("./images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API RUNNING"));

app.use("/api/posts", require("./routes/posts"));
app.use("/api/user", require("./routes/user"));

app.listen(3000, () => console.log("Listening on Port 3000"));
