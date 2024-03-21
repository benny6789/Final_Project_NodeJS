const mongoose = require("mongoose");
require("dotenv").config();
main().catch(err => console.log(err));

async function main() {
//This is the db where we get the information from:
  await mongoose.connect(process.env.MONGO_CONNECT);
  console.log("connect mongo atlas Final Project 2024");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


