import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './productDetails.css';
import { useParams, useHistory } from 'react-router-dom'; // Import useHistory
import Img from "../image.png"
const Productinfo = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const history = useHistory(); // Initialize history
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null); // State to hold user info

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                alert('Failed to fetch product details. Please try again later.'); // User-friendly error message
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        // Retrieve user info from local storage
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
            setUser(storedUserInfo);
        }
    }, []);

    const handleAddToCart = async () => {
        if (!user) {
            alert('Please log in to add items to your cart.'); // Prompt to log in if not authenticated
            return;
        }

        const cartItem = {
            customerId: user._id, // Use user's ID from stored info
            products: [
                {
                    productId: product._id,
                    quantity: 1, // Adjust the quantity as needed
                },
            ],
        };

        try {
            const response = await axios.post('/api/carts/add', cartItem); // Adjust the URL based on your backend
            alert('Product added to cart successfully!');
            history.push('/checkout'); // Use history for navigation
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Failed to add product to cart. Please try again.');
        }
    };

    return (
        <div className="product-details-container">
            {!product ? (
                <div className="loading-message">Loading product details...</div> // Loading state
            ) : (
                <>
                    <div className="product-image-section">
                        <img
                            src={Img} // Display a dynamic image or a placeholder
                            alt={product.name}
                            className="product-image"
                        />
                    </div>
                    <div className="product-info-section">
                        <h2 className="product-name">{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
                        <p className="product-stock">
                            {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                        </p>
                        <p className="product-category">Category: {product.category}</p>
                        <button className="add-to-cart-button" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Productinfo;
