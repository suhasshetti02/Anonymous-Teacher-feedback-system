import express from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import Feedback from "../models/Feedback.js";
import Participation from "../models/Participation.js";

const router = express.Router();

//post api to get the feedback
router.post("/feedback", async (req, res) => {
  const { teacher_id, feedback_text, device_fingerprint } = req.body;

  if (!teacher_id || !feedback_text || !device_fingerprint) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let hash_id; // creating hashid to avoid repitive feebacks
  try {
    hash_id = await bcrypt.hash(device_fingerprint, 10);
  } catch (error) {
    return res.status(500).json({ error: "Error generating hash" });
  }

  let existingEntry;
  try {
    existingEntry = await Participation.findOne({ hash_id, teacher_id });
  } catch (error) {
    return res.status(500).json({ error: "Error checking existing participation" });
  }

  if (existingEntry) {
    return res.status(400).json({ error: "Feedback already submitted" });
  }

  try {
    const feedback = new Feedback({
      feedback_id: uuidv4(),
      teacher_id,
      feedback_text,
    });

    const participation = new Participation({
      hash_id,
      teacher_id,
    });

    await feedback.save();
    await participation.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get feedback for a teacher
// GET /api/feedback/:teacher_id
router.get("/:teacher_id", async (req, res) => {
    const { teacher_id } = req.params;
  
    try {
      const feedbackData = await Feedback.aggregate([
        { $match: { teacher_id: teacher_id } },
        {
          $group: {
            _id: "$teacher_id",
            total_feedback: { $sum: 1 },
            feedback_texts: { $push: "$feedback_text" },
          },
        },
      ]);
  
      if (feedbackData.length === 0) {
        return res.status(404).json({ error: "No feedback found for this teacher" });
      }
  
      res.status(200).json(feedbackData[0]);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

export default router;
