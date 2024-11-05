const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const Performance = require('../models/Performance');

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const { quiz_title, quiz_desc, quiz_instructions, questions, timeLimit, deadline, passingScore, attemptsAllowed, class_id } = req.body;

    // Validate the incoming data
    if (!quiz_title || !quiz_desc || !quiz_instructions || !questions || questions.length === 0 || 
        !timeLimit || !deadline || !passingScore || !attemptsAllowed || !class_id) {
      return res.status(400).send({ error: 'All fields are required.' });
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question || !question.correct_answer || question.choices.length !== 4 || !question.points) {
        return res.status(400).send({ error: 'Each question must have a question text, correct answer, 4 choices, and points.' });
      }
    }

    const quiz = new Quiz({
      quiz_title,
      quiz_desc,
      quiz_instructions,
      questions,
      timeLimit,
      deadline,
      passingScore,
      attemptsAllowed,
      class_id
    });

    await quiz.save();
    res.status(201).send({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).send({ error: 'An error occurred while creating the quiz.' });
  }
});

// Update an existing quiz
router.put('/:id', async (req, res) => {
  try {
      const {
          quiz_title, quiz_desc, quiz_instructions, questions, 
          timeLimit, deadline, passingScore, attemptsAllowed, class_id
      } = req.body;

      // Validate input
      if (!quiz_title || !quiz_desc || !quiz_instructions || !questions || 
          questions.length === 0 || !timeLimit || !deadline || !passingScore || 
          !attemptsAllowed || !class_id) {
          return res.status(400).send({ error: 'All fields are required.' });
      }

      // Validate questions
      for (const question of questions) {
          if (!question.question || !question.correct_answer || 
              question.choices.length !== 4 || !question.points) {
              return res.status(400).send({ 
                  error: 'Each question must have text, correct answer, 4 choices, and points.' 
              });
          }
      }

      const updateData = {
          quiz_title, quiz_desc, quiz_instructions, questions, 
          timeLimit, deadline, passingScore, attemptsAllowed, class_id
      };

      console.log('Received update data:', updateData); // Log the received data

      const updatedQuiz = await Quiz.findByIdAndUpdate(
          req.params.id, 
          updateData, 
          { new: true, runValidators: true }
      );

      if (!updatedQuiz) {
          return res.status(404).send({ error: 'Quiz not found.' });
      }

      console.log('Updated quiz:', updatedQuiz); // Log the updated quiz

      res.status(200).send({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).send({ error: 'An error occurred while updating the quiz.' });
  }
});

// Get all quizzes or filter by class_id
router.get('/', async (req, res) => {
  try {
    const { class_id } = req.query;
    const query = class_id ? { class_id } : {};
    const quizzes = await Quiz.find(query);
    res.status(200).send(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).send({ error: 'An error occurred while retrieving quizzes.' });
  }
});

// Get quiz details
router.get('/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz details' });
  }
});

// Get student submissions
router.get('/:quizId/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find({ quizId: req.params.quizId });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student submissions' });
  }
});

// Get performance analysis data
router.get('/:quizId/performance', async (req, res) => {
  try {
    const performance = await Performance.findOne({ quizId: req.params.quizId });
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance analysis data' });
  }
});

module.exports = router;