const User = require('../models/User');
const express = require('express');
const authMiddleware = require('../authMiddleware');

const router = express.Router();
router.put('/update',authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; 
        const updates = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.updateProfile(updates);

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
      const userId = req.userId; 

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ message: 'User profile fetched successfully', user });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

router.delete('/delete', authMiddleware, async (req, res) => {
  try {
      const userId = req.userId;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await User.findByIdAndDelete(userId);

      res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});
module.exports = router;
