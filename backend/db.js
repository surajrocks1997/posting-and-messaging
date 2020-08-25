const mongoose = require("mongoose");

const dbUri =
  "mongodb+srv://suraj123:suraj123@cluster0.yjdgk.mongodb.net/demo?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
