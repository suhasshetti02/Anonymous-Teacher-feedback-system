import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

//database configuration 
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
