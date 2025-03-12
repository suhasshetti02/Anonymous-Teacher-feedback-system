import mongoose from 'mongoose';
//shema
const feedbackSchema = new mongoose.Schema({
    feedback_id: {type : String, required: true, unique: true},
    teacher_id: {type : String, required: true},
    feedback_text : {type : String, required: true},
    submitted_at :{type : Date, default: Date.now}  
});

export default mongoose.model('Feedback', feedbackSchema);