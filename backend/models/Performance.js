const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  attempts: { type: Number, required: true }
});

module.exports = mongoose.model('Performance', performanceSchema);