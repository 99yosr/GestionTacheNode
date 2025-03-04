const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Taches' }], // Reference to Task model
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Projet', ProjectSchema);
