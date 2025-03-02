const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Create a Project
router.post('/projects', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().populate('tasks'); // Get tasks inside project
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
