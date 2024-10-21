import React, { useEffect, useState } from 'react';
import './cate.css'; // Ensure the CSS file is available and correctly imported
import { useParams, useHistory } from 'react-router-dom';
import Img from '../image.png'; // Check if the image path is correct or use a placeholder
import axios from 'axios';
import { Link } from 'react-router-dom';

const Cate = () => {
    const [products, setProducts] = useState([]); // State to hold products data
    const [loading, setLoading] = useState(true); // State to handle loading state
    const { id } = useParams(); // Get the category ID from the URL parameters
    const history = useHistory();

    // Fetch products when the component mounts or when the category ID changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Log the category ID for debugging
                console.log(`Fetching products for category ID: ${id}`);

                // Ensure that the backend API route is correctly defined in the backend
                const response = await axios.get(`/api/products/cate/${id}`);

                // Log the response data to check if it's returning as expected
                console.log('Fetched products:', response.data);

                // Set the products data in the state
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false); // Stop loading after fetching
            }
        };

        // Only fetch products if `id` is available
        if (id) {
            fetchProducts();
        }
    }, [id]); // Dependency array includes `id` to refetch if the category changes

    return (
        <div className="home-page">
            <div className="products-section">
                <h2>Our Products</h2>
                <div className="product-cards-container">
                    {/* Display a loading message while products are being fetched */}
                    {loading ? (
                        <p>Loading products...</p>
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="product-card">
                                {/* Ensure the image path or URL is correct */}
                                <img src={Img} alt={product.name} className="product-image" />
                                <h3>{product.name}</h3>
                                <p>Price: ${product.price.toFixed(2)}</p>
                                <p>{product.description}</p>
                                <Link to={`/product/${product._id}`} className="read-more">
                                    Read More
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p> // Display a message if no products are available
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cate;
