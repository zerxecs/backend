const express = require('express');
const router = express.Router();
const { submitQuiz } = require('../models/Submission');

// Route to handle quiz submission
router.post('/submit-quiz', submitQuiz);

module.exports = router;