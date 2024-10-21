import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import your CSS file for styling
import Img from '../image.png'
import axios from 'axios';
const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dummy product data

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products/all');
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    // Fetch products from API (now replaced with dummy data)
    useEffect(() => {
        setLoading(false);
    }, []);


    return (
        <div className="home-page">

            <div className="products-section">
                <h2>Our Products</h2>
                <div className="product-cards-container">
                    {loading ? (
                        <p>Loading products...</p>
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="product-card">
                                <img
                                    src={Img}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <h3>{product.name}</h3>
                                <p>Price : ${product.price.toFixed(2)}</p>
                                <p>{product.description}</p>
                                <Link to={`/product/${product._id}`} className="read-more">
                                    Read More
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
