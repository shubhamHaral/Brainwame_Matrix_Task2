// Checkout.js
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './checkout.css';

const Checkout = () => {
    const history = useHistory();
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!storedUserInfo) {
            history.push('/login'); // Redirect to login if not authenticated
            return;
        }
        setUser(storedUserInfo);
    }, [history]);

    useEffect(() => {
        // Fetch and aggregate cart items
        const fetchCartItems = async () => {
            if (user) {
                try {
                    const response = await axios.get(`/api/carts/${user._id}`);
                    const cartData = response.data;

                    // Aggregate products and their quantities across multiple cart entries
                    const aggregatedProducts = cartData.reduce((acc, cart) => {
                        cart.products.forEach(product => {
                            const existingProduct = acc.find(p => p.productId === product.productId);
                            if (existingProduct) {
                                existingProduct.quantity += product.quantity;
                            } else {
                                acc.push({
                                    productId: product.productId,
                                    quantity: product.quantity,
                                });
                            }
                        });
                        return acc;
                    }, []);

                    // Fetch and enrich product details for display
                    const enrichedCartItems = await Promise.all(aggregatedProducts.map(async item => {
                        const productResponse = await axios.get(`/api/products/${item.productId}`);
                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            productName: productResponse.data.name,
                            price: productResponse.data.price,
                        };
                    }));

                    setCartItems(enrichedCartItems);
                } catch (error) {
                    console.error('Error fetching cart items:', error);
                    alert('Failed to fetch cart items. Please try again later.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchCartItems();
    }, [user]);

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            // Prepare order data
            const orderData = {
                customerId: user._id,
                products: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2),
            };

            // Create order
            const response = await axios.post('/api/orders/create', orderData);

            if (response && response.data.success) {
                Swal.fire({
                    title: 'Order placed successfully!',
                    text: 'Your order has been placed. You will receive an email confirmation shortly.',
                    icon: 'success',
                    confirmButtonText: 'Continue shopping',
                }).then((result) => {
                    if (result.isConfirmed) {
                        history.push('/');
                    }
                });

                setCartItems([]);
            } else {
                throw new Error('Failed to place order.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error during checkout. Please try again.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };

    if (loading) return <div className="loading-message">Loading...</div>;

    return (
        <div className="checkout-wrapper">
            <h2 className="checkout-title">Checkout</h2>
            <div className="cart-items-list">
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <div key={item.productId} className="cart-item">
                            <p className="cart-item-text">
                                {item.productName} (x{item.quantity}) - ${item.price * item.quantity}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="empty-cart-message">Your cart is empty!</p>
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="total-price">
                    <h3>Total Price: ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
                </div>
            )}

            <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
            </button>
        </div>
    );
};

export default Checkout;
