const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false }, // Link to Project
    createdAt: { type: Date, default: Date.now },
    completedAt: {type: Date, default:null},
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the User model
        required: true,
        ref: 'User',  // Assuming you have a 'User' model
    },
    deadline: { 
        type: Date, // Store the deadline as a Date
        required: false, // Optional or you can set it to true if you want to make it required
    },
}, { timestamps: true });

// ✅ Prevent model overwrite error
module.exports = mongoose.models.Taches || mongoose.model('Taches', TaskSchema);
