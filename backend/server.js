const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Set up static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route to verify server is running
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

// Routes will be added here
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/reports', require('./src/routes/reports'));
app.use('/api/expenses', require('./src/routes/expenses'));
app.use('/api/analytics', require('./src/routes/analytics'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
