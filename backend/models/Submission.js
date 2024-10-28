const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    studentName: String,
    quizId: mongoose.Schema.Types.ObjectId,
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        answer: String,
        isCorrect: Boolean,
    }],
    score: Number,
    submittedAt: { type: Date, default: Date.now },
});

submissionSchema.pre('save', async function (next) {
    const quiz = await mongoose.model('Quiz').findById(this.quizId);
    let score = 0;

    this.answers.forEach(answer => {
        const question = quiz.questions.id(answer.questionId);
        if (question.correct_answer === answer.answer) {
            answer.isCorrect = true;
            score += question.points;
        } else {
            answer.isCorrect = false;
        }
    });

    this.score = score;
    next();
});

module.exports = mongoose.model('Submission', submissionSchema);