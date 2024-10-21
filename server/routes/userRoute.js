const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For token generation

// POST REQUEST - Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, address });
        await newUser.save();
        res.status(200).json({ success: true, message: 'Register success' });
    } catch (error) {
        res.status(400).json({ message: `${error}` });
    }
});

// POST REQUEST - User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).send(user);
        } else {
            res.status(400).json({ message: 'Login Failed' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Something went wrong' });
    }
});

// GET REQUEST - Get all users
router.get('/getallusers', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(404).json({ message: error.stack });
    }
});

// POST REQUEST - Delete a user
router.post('/deleteuser', async (req, res) => {
    const userid = req.body.userId;
    try {
        await User.findOneAndDelete({ _id: userid });
        res.status(200).send("User deleted");
    } catch (error) {
        res.status(404).json({ message: error.stack });
    }
});

// PUT REQUEST - Update user information
router.put('/update', async (req, res) => {
    const { userId, name, email, address } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, address }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST REQUEST - Handle forgot password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a token for password reset (consider adding expiration time)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Here, you would send an email with the reset link containing the token.
        // Example: sendEmail(user.email, `Reset your password: ${resetLink}`);

        res.status(200).json({ success: true, message: 'Password reset link sent to your email', token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT REQUEST - Reset password
router.put('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
