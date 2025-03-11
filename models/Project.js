const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Taches' }], // Reference to Task model
    createdAt: { type: Date, default: Date.now },
    progress : {type: Number},
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


module.exports = mongoose.model('Projet', ProjectSchema);
