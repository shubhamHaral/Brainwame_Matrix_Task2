const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/config');

// Configure dotenv to read environment variables
dotenv.config();

// Connect to MongoDB using the configuration file
connectDB();

const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests 

// Import routes

app.use("/api/users", require("./routes/userRoute"));
app.use("/api/orders", require("./routes/orderRoute"));

// Additional Routes
app.use("/api/products", require("./routes/productRoutes"));    // Product routes
app.use("/api/carts", require("./routes/cartRoutes"));          // Cart routes
app.use("/api/enquiries", require("./routes/enquiryRoutes"));   // Enquiry routes

// Define a simple root route
app.get('/', (req, res) => {
    res.send("<h1>Welcome! Hello from Node server</h1>");
});

// Get the port from environment variables or use default port 8080
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
});
