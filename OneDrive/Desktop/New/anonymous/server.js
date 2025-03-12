import express from "express";
import connectDB from "./config/db.js";
import feedbackRoutes from "./routes/feedbackroutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
connectDB(); 

app.use("/api/feedback", feedbackRoutes); 

app.get("/", (req, res) => {
  res.send("Anonymous Feedback API is Running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
