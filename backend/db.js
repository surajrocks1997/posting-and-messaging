const mongoose = require("mongoose");

const db =
  "mongodb+srv://suraj123:s65M67iRhRTB5rqY@cluster0.rm3bh.mongodb.net/postMessage?retryWrites=true&w=majority";
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
