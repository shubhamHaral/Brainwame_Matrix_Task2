const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Add product to cart
router.post('/add', async (req, res) => {
    const { customerId, products } = req.body; // Extract customerId and products from request body

    // Validate input
    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    // Validate products input
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Products array is required and should not be empty' });
    }

    // Create new cart object
    const newCart = new Cart({ customerId, products }); // Create new cart with customerId and products

    try {
        // Save the cart to the database
        await newCart.save();
        res.status(201).json({ success: true, message: 'Products added to cart successfully', cart: newCart });
    } catch (error) {
        res.status(400).json({ message: `Error: ${error.message}`, error });
    }
});

// Get cart for a customer
router.get('/:customerId', async (req, res) => {
    const { customerId } = req.params; // Extract customer ID from request params

    try {
        const cart = await Cart.find({ customerId }); // Find the cart by customer ID
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' }); // Return 404 if cart is not found
        }
        res.status(200).json(cart); // Return the found cart
    } catch (error) {
        res.status(500).json({ message: `Error fetching cart: ${error.message}` });
    }
});

// Update cart items
router.put('/update/:customerId', async (req, res) => {
    const { customerId } = req.params; // Extract customer ID from request params

    try {
        const updatedCart = await Cart.findOneAndUpdate({ customerId }, req.body, { new: true }); // Update the cart
        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found' }); // Return 404 if cart is not found
        }
        res.status(200).json(updatedCart); // Return the updated cart
    } catch (error) {
        res.status(400).json({ message: `Update failed: ${error.message}` });
    }
});

// Delete a cart
router.delete('/delete/:customerId', async (req, res) => {
    const { customerId } = req.params; // Extract customer ID from request params

    try {
        const deletedCart = await Cart.findOneAndDelete({ customerId }); // Delete the cart by customer ID
        if (!deletedCart) {
            return res.status(404).json({ message: 'Cart not found' }); // Return 404 if cart is not found
        }
        res.status(200).json({ message: 'Cart deleted successfully' }); // Return success message
    } catch (error) {
        res.status(400).json({ message: `Delete failed: ${error.message}` });
    }
});

module.exports = router;
