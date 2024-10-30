const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Class = require('../models/Class');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');

const router = express.Router();

// Route to fetch all public classes that the logged-in student is registered to or belongs to
router.get('/public-classes', authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find all public classes where the student's email is in the students array
    const publicClasses = await Class.find({ type: 'public', students: userEmail }).populate('createdBy', 'fname lname');

    res.status(200).json({ success: true, classes: publicClasses });
  } catch (error) {
    console.error('Error fetching public classes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to fetch all registered private classes for a student
router.get('/registered-classes', authMiddleware, async (req, res) => {
  const studentEmail = req.user.email; // Assuming req.user contains the authenticated student's email

  try {
    const registeredClasses = await Class.find({
      type: 'private',
      students: studentEmail, // Match classes where the student is enrolled
    }).populate('createdBy', 'fname lname'); // Populate createdBy with fname and lname
    
    res.status(200).json({ success: true, classes: registeredClasses });
  } catch (error) {
    console.error('Error fetching registered classes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to register for a private class using the class code
router.post('/register-private-class', authMiddleware, async (req, res) => {
  const { classCode } = req.body;
  const studentEmail = req.user.email; // Assuming req.user contains the authenticated student's email

  try {
    // Find the private class by code
    const classToJoin = await Class.findOne({ code: classCode, type: 'private' });
    
    if (!classToJoin) {
      return res.status(404).json({ success: false, error: 'Class not found or invalid code.' });
    }

    // Add the student's email to the students array if it's not already included
    if (!classToJoin.students.includes(studentEmail)) {
      classToJoin.students.push(studentEmail);
      await classToJoin.save();
    }

    // Find the student by email
    const student = await User.findOne({ email: studentEmail });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found.' });
    }

    // Add the class ID to the student's registeredClasses array if it's not already included
    if (!student.registeredClasses.includes(classToJoin._id)) {
      student.registeredClasses.push(classToJoin._id);
      await student.save();
    }

    res.status(200).json({ success: true, message: 'Successfully registered for the private class.', class: classToJoin });
  } catch (error) {
    console.error('Error registering for class:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to fetch a quiz by ID
router.get('/quiz/:quizId', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).send({ error: 'Quiz not found.' });
        }
        res.status(200).send(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).send({ error: 'An error occurred while fetching the quiz.' });
    }
});

// Route to submit a quiz
router.post('/submit', async (req, res) => {
    try {
        const { studentName, quizId, answers } = req.body;

        // Validate the incoming data
        if (!studentName || !quizId || !answers || answers.length === 0) {
            return res.status(400).send({ error: 'All fields are required.' });
        }

        const submission = new Submission({
            studentName,
            quizId,
            answers
        });

        await submission.save();
        res.status(201).send({ message: 'Quiz submitted successfully', submission });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).send({ error: 'An error occurred while submitting the quiz.' });
    }
});

// Route to get performance analysis
router.get('/performance/:submissionId', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId).populate('quizId');

        if (!submission) {
            return res.status(404).send({ error: 'Submission not found.' });
        }

        const totalQuestions = submission.answers.length;
        const correctAnswers = submission.answers.filter(answer => answer.isCorrect).length;
        const incorrectAnswers = totalQuestions - correctAnswers;
        const accuracy = (correctAnswers / totalQuestions) * 100;

        const performance = {
            score: submission.score,
            accuracy,
            correctAnswers,
            incorrectAnswers,
            answers: submission.answers.map(answer => ({
                questionId: answer.questionId,
                answer: answer.answer,
                isCorrect: answer.isCorrect
            }))
        };

        res.status(200).send(performance);
    } catch (error) {
        console.error('Error fetching performance analysis:', error);
        res.status(500).send({ error: 'An error occurred while fetching the performance analysis.' });
    }
});

module.exports = router;