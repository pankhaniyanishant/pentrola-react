const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const ensureDefaultAdmin = require('./seedAdmin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const startServer = async () => {
    await connectDB();
    await ensureDefaultAdmin();

// Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/products', require('./routes/productRoutes'));
    app.use('/api/orders', require('./routes/orderRoutes'));
    app.use('/api/cart', require('./routes/cartRoutes'));
    app.use('/api/wishlist', require('./routes/wishlistRoutes'));
    app.use('/api/admin', require('./routes/adminRoutes'));

    app.get('/', (req, res) => {
        res.send('API is running...');
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
