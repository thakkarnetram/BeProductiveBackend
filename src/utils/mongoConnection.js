const mongoose = require("mongoose");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

async function connectToDB() {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB ");
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
}

connectToDB();
