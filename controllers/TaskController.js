const express = require('express');
const http = require('http');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const Task = require('../models/task.js');
const app = express();  // Create the Express app
const server = http.createServer(app);  // Create the HTTP server using Express app
const io = require('socket.io')(server);  // Initialize socket.io with the HTTP server

// Create Task
router.post('/new', authMiddleware, async (req, res) => {
    try {
      const task = new Task({
        ...req.body,  // Spread the rest of the request body (task details)
        userId: req.userId,  // Associate the task with the authenticated user
      });
  
      await task.save();
      io.emit('taskCreated', task);  // Emit the event with the created task

      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Error creating task', error: error.message });
    }
});

router.get('/all', authMiddleware, async (req, res) => {
    try {
        // Fetch tasks from database based on userId
        const tasks = await Task.find({ userId: req.userId });

        io.emit('tasksFetched', tasks); 

        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});

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

// You can start the server somewhere else in your app, e.g., in your main file:
// server.listen(3000, () => console.log('Server running on http://localhost:3000'));
