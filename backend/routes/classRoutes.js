const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Class = require('../models/Class');
const User = require('../models/User');

const router = express.Router();

// Route to create a new class
router.post('/create-class', authMiddleware, async (req, res) => {
  const { name, description, type, students } = req.body;

  try {
    const newClass = new Class({
      name,
      description,
      type,
      students,
      createdBy: req.user._id,
    });
    await newClass.save();
    res.status(201).json({ success: true, class: newClass });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// Route to get all classes for the logged-in user
router.get('/classes', authMiddleware, async (req, res) => {
  try {
    const classes = await Class.find().populate('createdBy', 'fname lname');
    res.status(200).json({ success: true, classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get class details by ID
router.get('/class/:id', authMiddleware, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('createdBy', 'fname lname');
    res.status(200).json({ success: true, class: classItem });
  } catch (error) {
    console.error('Error fetching class details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST route to add multiple students to a class
router.post('/class/:id/add-students', authMiddleware, async (req, res) => {
  const classId = req.params.id;
  const { students } = req.body;

  try {
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    classItem.students.push(...students);
    await classItem.save();
    res.status(200).json({ success: true, class: classItem });
  } catch (error) {
    console.error('Error adding students to class:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to remove a student from a class
router.post('/class/:id/remove-student', authMiddleware, async (req, res) => {
  const classId = req.params.id;
  const { studentEmail } = req.body;

  try {
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    classItem.students = classItem.students.filter(email => email !== studentEmail);
    await classItem.save();
    res.status(200).json({ success: true, class: classItem });
  } catch (error) {
    console.error('Error removing student from class:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to leave a class
router.post('/class/:id/leave', authMiddleware, async (req, res) => {
  const classId = req.params.id;

  try {
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    classItem.students = classItem.students.filter(email => email !== req.user.email);
    await classItem.save();
    res.status(200).json({ success: true, class: classItem });
  } catch (error) {
    console.error('Error leaving class:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;