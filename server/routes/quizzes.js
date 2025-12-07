const router = require('express').Router();
const Quiz = require('../models/Quiz');

// GET all quizzes (sorted by availableDate)
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ availableDate: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new quiz
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz({
      title: 'Untitled Quiz',
      availableDate: new Date()
    });
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update quiz
router.put('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE quiz
router.delete('/:id', async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle publish
router.patch('/:id/publish', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    quiz.published = !quiz.published;
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;