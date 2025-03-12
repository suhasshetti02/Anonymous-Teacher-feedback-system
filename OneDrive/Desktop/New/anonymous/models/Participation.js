import mongoose from "mongoose";

//schema
const participationSchema = new mongoose.Schema({
    hash_id: { type: String, required: true, unique: true }, 
    teacher_id: { type: String, required: true }, 
    submitted_at: { type: Date, default: Date.now } 
  });
  
  export default mongoose.model("Participation", participationSchema);