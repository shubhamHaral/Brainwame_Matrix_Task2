import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IoIosContact } from "react-icons/io";
import './navbar.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Img from "./images/image.png"
const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDropdown = () => {
        // setDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/products/categories'); // Replace with your API endpoint
                setCategories(response.data); // Assuming response.data is an array of categories
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            // Navigate to a search results page or handle search functionality here
            console.log("Search Term:", searchTerm);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo"><img src={Img} alt="" width={'50px'} /></div>
                <ul className="nav-links">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <div className="dropdown">
                            <button className="dropbtn"  >Products Category</button>
                            <div className="dropdown-content">

                                <ul className="dropdown-menu">

                                    <li >
                                        <Link to={`/category/tech`}>
                                            Pizza
                                        </Link>
                                    </li>
                                    <li >
                                        <Link to={`/category/tech`}>
                                            Tech
                                        </Link>
                                    </li>

                                </ul>

                            </div>
                        </div>
                    </li>
                    <li>
                        <Link to="/contact">Contact Us</Link>
                    </li>
                </ul>
                <div className="search-bar">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                    </a>
                    <Link to="/profile"  >
                        <IoIosContact size={30} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
