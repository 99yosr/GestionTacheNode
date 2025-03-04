const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const authMiddleware = require('../authMiddleware');


// Create Task
router.post('/new',authMiddleware, async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
});

// Get All Tasks
router.get('/all',authMiddleware, async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Update Task
router.put('/update/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

// Delete Task
router.delete('/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

module.exports = router;
