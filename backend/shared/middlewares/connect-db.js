const mongoose = require("mongoose");
require("dotenv").config();

//Connect to MongoDB
const connectDB = async (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        // Already connected
        return next();
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB is connected.');
        next();
    } catch (error) {
        console.error('MongoDB fails to connect with error:', error.message);
        res.status(500).json({ error: 'Database connection error' });
    }
};

module.exports = connectDB;