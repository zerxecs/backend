const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Create a new quiz
router.post('/', async (req, res) => {
    try {
        const { quiz_title, quiz_desc, quiz_instructions, questions, timeLimit, deadline, passingScore, attemptsAllowed } = req.body;

        // Validate the incoming data
        if (!quiz_title || !quiz_desc || !quiz_instructions || !questions || questions.length === 0 || 
            !timeLimit || !deadline || !passingScore || !attemptsAllowed) {
            return res.status(400).send({ error: 'All fields are required.' });
        }

        // Validate questions
        for (const question of questions) {
            if (!question.question || !question.correct_answer || question.choices.length !== 4 || !question.points) {
                return res.status(400).send({ error: 'Each question must have a question text, correct answer, 4 choices, and points.' });
            }
        }

        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(201).send({ message: 'Quiz created successfully', quiz });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).send({ error: 'An error occurred while creating the quiz.' });
    }
});

// Get all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).send(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).send({ error: 'An error occurred while retrieving quizzes.' });
    }
});

module.exports = router;
