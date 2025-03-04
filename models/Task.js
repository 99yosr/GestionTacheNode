const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false }, // Link to Project
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ✅ Prevent model overwrite error
module.exports = mongoose.models.Taches || mongoose.model('Taches', TaskSchema);
