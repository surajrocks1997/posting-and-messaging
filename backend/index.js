const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API RUNNING"));

app.get("/api/posts", (req, res) => {
  const posts = [
    {
      id: "akjgfbjkabdf",
      title: "First Server Side Post",
      content: "Coming from server",
    },
    {
      id: "akjgfbjkabdf",
      title: "Second Server Side Post",
      content: "Coming from server",
    },
    {
      id: "akjgfbjkabdf",
      title: "Third Server Side Post",
      content: "Coming from server",
    },
  ];
  res.status(200).json({
    message: "Posts Fetching Successful",
    posts: posts,
  });
});

app.listen(3000, () => console.log("Listening on Port 3000"));
