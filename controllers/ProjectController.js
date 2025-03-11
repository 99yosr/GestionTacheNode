const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/task');
const authMiddleware = require('../authMiddleware');
const app = express();  // Create the Express app
const http = require('http');
const server = http.createServer(app);  // Create the HTTP server using Express app
const io = require('socket.io')(server); 

const router = express.Router();

router.post('/new',authMiddleware, async (req, res) => {
    try {
        const project = new Project(
            {...req.body,  
            userId: req.userId,} 
        );
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/projects', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.userId }).populate('tasks');

        res.json(projects);
        io.emit('projectsFetched', projects); 

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


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

router.post('/projects/:projectId/remove-task', async (req, res) => {
    try {
        const { taskId } = req.body;
        
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        project.tasks = project.tasks.filter(task => task.toString() !== taskId);
        await project.save();


        res.status(200).json({ message: "Task removed from project and deleted", project });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/delete/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

    
        await Task.deleteMany({ _id: { $in: project.tasks } });

        await Project.findByIdAndDelete(projectId);

        res.status(200).json({ message: "Project and associated tasks deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/update/:projectId', async (req, res) => {
    try {
        const { name, description , progress} = req.body;
        const projectId = req.params.projectId;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        if (name) project.name = name;
        if (description) project.description = description;
        if (progress) project.progress = progress;

        await project.save();

        res.status(200).json(project); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/projects/:projectId/tasks', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('tasks');

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.status(200).json(project.tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:projectId/completion-percentage', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('tasks');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const totalTasks = project.tasks.length;
        if (totalTasks === 0) {
            return res.status(200).json({ message: "No tasks in the project", percentage: 0 });
        }

        const completedTasks = project.tasks.filter(task => task.status === "completed").length;

        const completionPercentage = (completedTasks / totalTasks) * 100;

        res.status(200).json({
            message: `Project completion percentage: ${completionPercentage.toFixed(2)}%`,
            percentage: completionPercentage.toFixed(2),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/top-5-progressing-projects', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // Get userId from authenticated user (set by authMiddleware)
        
        // Query the user's projects, sorting by progress in descending order and limiting to top 5
        const projects = await Project.find({ userId })
            .sort({ progress: -1 }) 
            .limit(5);
  
        if (!projects || projects.length === 0) {
            return res.status(404).json({ error: 'No projects found' });
        }
  
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  
module.exports = router;
