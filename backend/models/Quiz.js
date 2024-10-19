// models/Quiz.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    choices: [String],
    correct_answer: String,
    points: Number
});

const quizSchema = new mongoose.Schema({
    quiz_title: String,
    quiz_desc: String,
    quiz_instructions: String,
    questions: [questionSchema]
});

module.exports = mongoose.model('Quiz', quizSchema);