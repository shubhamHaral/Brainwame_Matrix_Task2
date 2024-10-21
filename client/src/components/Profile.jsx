// Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Use useHistory for navigation
import './profile.css'; // Import CSS file

const Profile = () => {
    const history = useHistory(); // Initialize useHistory for navigation
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        // Check if user information is in localStorage
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!storedUserInfo) {
            // If no user info, redirect to login page
            history.push('/login'); // Redirect to login
            return; // Exit the function
        }

        // Set user information from local storage
        setUser(storedUserInfo);
        setName(storedUserInfo.name);
        setEmail(storedUserInfo.email);
        setAddress(storedUserInfo.address);
        setUserId(storedUserInfo._id); // Correctly set userId

        // Fetch user orders
        const fetchOrders = async () => {
            console.log(userId)
            console.log(orders)
            try {  // /api/orders / 6706d5145198a082e3a87638
                const response = await axios.get(`/api/orders/${userId}`); // Fetch user orders
                setOrders(response.data);
                console.log("pramod " + response.data)
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [userId]);

    const handleSave = async () => {
        try {

            const response = await axios.put('/api/users/update', { userId, name, email, address });
            setUser(response.data.user); // Update local user state
            localStorage.setItem('userInfo', JSON.stringify(response.data.user)); // Update localStorage
            setEditMode(false); // Exit edit mode   
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('userInfo');
        // Redirect to login page
        history.push('/login');
    };


    if (!user) return <div>Loading...</div>; // Loading state

    return (
        <div className="profile-container">
            {/* Logout Button */}
            <div className="logout-button-container " style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end'
            }}>
                <button className="logout-button" style={{ backgroundColor: "red" }} onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <h2>Customer Profile</h2>
            {editMode ? (
                <div className="profile-edit">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </div>
            ) : (
                <div className="profile-info">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            )}

            <h3>My Orders</h3>
            <div className="orders-list">
                {orders.length > 0 ? (
                    orders.map((order) => {
                        return (
                            <div key={order._id} className="order-item">
                                <hr />
                                <p><strong>Order ID:</strong> {order._id}</p>
                                <p><strong>Total Price:</strong> ${order.totalAmount.toFixed(2)}</p> {/* Display total price */}
                                <p><strong>Status:</strong> {order.status}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
