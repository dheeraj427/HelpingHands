const express = require('express');
const router = express.Router();

const { submitFeedback, getFeedbacks } = require('../controllers/feedbackController');

// These map directly to the functions we exported in the controller
router.post('/', submitFeedback);
router.get('/', getFeedbacks);

module.exports = router;