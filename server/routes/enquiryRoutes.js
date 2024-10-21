const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// Create a new enquiry
router.post('/create', async (req, res) => {
    const { name, email, message, contact,
        subject } = req.body;
    const newEnquiry = new Enquiry({
        name, email, message, contact,
        subject
    });
    try {
        await newEnquiry.save();
        res.status(201).json({ success: true, message: 'Enquiry submitted successfully' });
    } catch (error) {
        res.status(400).json({ message: `Error: ${error.message}` });
    }
});

// Get all enquiries
router.get('/all', async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.status(200).json(enquiries);
    } catch (error) {
        res.status(400).json({ message: `Error: ${error.message}` });
    }
});

// Delete an enquiry
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Enquiry.findByIdAndDelete(id);
        res.status(200).json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: `Delete failed: ${error.message}` });
    }
});

module.exports = router;
