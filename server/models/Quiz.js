const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['multiple-choice', 'true-false', 'fill-blank'],
    default: 'multiple-choice'
  },
  title: { type: String, default: '' },
  question: { type: String, default: '' },
  points: { type: Number, default: 0 },
  
  options: [{
    text: String,
    isCorrect: { type: Boolean, default: false }
  }],
  
  correctAnswer: Boolean,
  
  blanks: [{
    possibleAnswers: [String]
  }]
});

const quizSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Quiz' },
  description: { type: String, default: '' },
  points: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  shuffleAnswers: { type: Boolean, default: false },
  timeLimit: {
    enabled: { type: Boolean, default: false },
    minutes: { type: Number, default: 20 }
  },
  dueDate: Date,
  availableDate: { type: Date, default: Date.now },
  untilDate: Date,
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);