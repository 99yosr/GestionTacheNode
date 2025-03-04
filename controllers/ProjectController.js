const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task'); // ✅ Import Task model

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

// Add Task to Project
router.post('/projects/:projectId/add-task', async (req, res) => {
    try {
        const { taskId } = req.body;
        const project = await Project.findById(req.params.projectId);
        const task = await Task.findById(taskId);

        if (!project || !task) {
            return res.status(404).json({ error: "Project or Task not found" });
        }

        project.tasks.push(taskId);
        await project.save();

        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Task from Project
router.post('/projects/:projectId/remove-task', async (req, res) => {
    try {
        const { taskId } = req.body;
        
        // Find the project
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Remove task from the project's tasks array
        project.tasks = project.tasks.filter(task => task.toString() !== taskId);
        await project.save();

        // Optionally, delete the task itself from the Task collection
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: "Task removed from project and deleted", project });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Project
router.delete('/projects/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Find the project by ID
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Optionally, delete tasks associated with the project
        // This will delete all tasks associated with this project (be careful)
        await Task.deleteMany({ _id: { $in: project.tasks } });

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        res.status(200).json({ message: "Project and associated tasks deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Project Information (name and description)
router.put('/projects/:projectId', async (req, res) => {
    try {
        const { name, description } = req.body;
        const projectId = req.params.projectId;

        // Find the project by ID
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Update project fields
        if (name) project.name = name;
        if (description) project.description = description;

        // Save the updated project
        await project.save();

        res.status(200).json(project); // Return the updated project
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
module.exports = router;
