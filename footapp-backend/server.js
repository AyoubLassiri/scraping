const express = require('express');
const cors = require('cors');
require('dotenv').config();

// This line automatically runs the database creation script when the server starts
require('./config/db'); 

const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const staffRoutes = require('./routes/staffRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const playerRoutes = require('./routes/playerRoutes');
const historyRoutes = require('./routes/historyRoutes');
// Add this to your route imports
const postRoutes = require('./routes/postRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/history', historyRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Route
app.get('/', (req, res) => {
  res.send('Mustaqbal El Marsa API is running!');
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});



// Add this to your API Endpoints Mounting section
app.use('/api/posts', postRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});