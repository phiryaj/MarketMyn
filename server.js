require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// In production, restrict to your deployed domain via ALLOWED_ORIGIN env var.
// In development (or when not set), allow all origins so file:// protocol works.
const allowedOrigins = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
    : ['*'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Vercel internal)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true
}));

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from project root (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '/')));

// ─── DATABASE ─────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketmyn')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Don't crash — Vercel will still serve static pages
    });

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => res.json({ status: 'MarketMyn API Running', version: '1.0.0' }));
app.get('/admin', (req, res) => res.redirect('/admin-dashboard.html'));

app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/admin',      require('./routes/adminRoutes'));
app.use('/api/payouts',    require('./routes/payoutRoutes'));
app.use('/api/staff',      require('./routes/staffRoutes'));
app.use('/api/seller',     require('./routes/sellerRoutes'));
app.use('/api/upload',     require('./routes/uploadRoutes'));
app.use('/api/returns',    require('./routes/returnRoutes'));
app.use('/api/promotions', require('./routes/promotionRoutes'));
app.use('/api/messages',   require('./routes/messageRoutes'));
app.use('/api/bulk',       require('./routes/bulkRoutes'));
app.use('/api/settings',   require('./routes/settingsRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/support',    require('./routes/supportRoutes'));
app.use('/api/user',       require('./routes/userRoutes'));

// ─── CATCH-ALL ────────────────────────────────────────────────────────────────
// Send index.html for any non-API route (SPA-style fallback)
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[Server Error]', err.message);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─── START ────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 MarketMyn server running on http://localhost:${PORT}`);
    });
}

module.exports = app; // Required for Vercel serverless export
