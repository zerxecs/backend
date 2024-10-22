const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true, // Ensure question text is required
        trim: true // Trim whitespace
    },
    choices: {
        type: [String],
        validate: {
            validator: (v) => v.length === 4, // Ensure exactly 4 choices
            message: 'Each question must have exactly 4 choices.'
        },
        required: true // Ensure choices are required
    },
    correct_answer: {
        type: String,
        required: true // Ensure correct answer is required
    },
    points: {
        type: Number,
        required: true,
        min: 0 // Ensure points are non-negative
    }
});

const quizSchema = new mongoose.Schema({
    quiz_title: {
        type: String,
        required: true, // Ensure quiz title is required
        trim: true // Trim whitespace
    },
    quiz_desc: {
        type: String,
        required: true, // Ensure quiz description is required
        trim: true // Trim whitespace
    },
    quiz_instructions: {
        type: String,
        required: true, // Ensure quiz instructions are required
        trim: true // Trim whitespace
    },
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true // Class reference is required
    },
    questions: {
        type: [questionSchema],
        required: true, // Ensure questions array is required
    },
    timeLimit: {
        hours: {
            type: Number,
            required: true,
            min: 0 // Ensure hours are non-negative
        },
        minutes: {
            type: Number,
            required: true,
            min: 0, // Ensure minutes are non-negative
            max: 59 // Ensure minutes are less than 60
        },
        seconds: {
            type: Number,
            required: true,
            min: 0, // Ensure seconds are non-negative
            max: 59 // Ensure seconds are less than 60
        }
    },
    deadline: {
        date: {
            type: String,
            required: true // Ensure deadline date is required
        },
        time: {
            type: String,
            required: true // Ensure deadline time is required
        }
    },
    passingScore: {
        type: Number,
        required: true,
        min: 0 // Ensure passing score is non-negative
    },
    attemptsAllowed: {
        type: Number,
        required: true,
        min: 1 // Ensure at least 1 attempt is allowed
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
