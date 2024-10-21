import React, { useState } from 'react';
import axios from 'axios';
import './contact.css'; // Import your CSS file for styling

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/enquiries/create', formData); // Replace with your API endpoint
            console.log(response.data); // You can handle the response as needed
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                contact: '',
                subject: '',
                message: ''
            });
        } catch (err) {
            console.error('Error sending message:', err);
            setError('There was an error sending your message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            {/* Banner Section */}
            <div className="banner">
                <h1>Contact Us</h1>
                <p>We would love to hear from you!</p>
            </div>

            {/* Enquiry Form Section */}
            <div className="enquiry-form">
                <h2>Enquiry Form</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="contact"
                        placeholder="Your Contact Number"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                    {success && <p className="success-message">Message sent successfully!</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>

            {/* Google Map Section */}
            <div className="google-map">
                <h2>Find Us Here</h2>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.73046968594!2d74.6872204!3d19.181265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdcbbe061fe9e81%3A0x1972733fbb666d7e!2sDr.Vithalrao%20Vikhe%20Patil%20College%20Of%20Engineering%2C%20Ahmednagar%2C!5e0!3m2!1sen!2sin!4v1696849320482!5m2!1sen!2sin"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Map - Dr. Vithalrao Vikhe Patil College of Engineering"
                ></iframe>
            </div>
        </div>
    );
};

export default Contact;
