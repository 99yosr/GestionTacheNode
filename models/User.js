const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Create a User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving to the database
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); // Hash password
    }
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Method to update user profile
UserSchema.methods.updateProfile = async function (updates) {
    try {
        if (updates.email) this.email = updates.email;
        if (updates.password) {
            this.password = await bcrypt.hash(updates.password, 10); // Hash new password
        }
        await this.save();
        return this;
    } catch (error) {
        throw new Error('Error updating profile');
    }
};

module.exports = mongoose.model('User', UserSchema);
