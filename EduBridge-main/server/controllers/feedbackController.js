const Feedback = require('../models/Feedback');

const submitFeedback = async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    const savedFeedback = await newFeedback.save();
    res.status(201).json({ success: true, data: savedFeedback });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch feedbacks' });
  }
};

module.exports = { submitFeedback, getFeedbacks };