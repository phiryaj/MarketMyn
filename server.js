try { require('dotenv').config(); } catch(e) {}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('[Startup] Node version:', process.version);
console.log('[Startup] NODE_ENV:', process.env.NODE_ENV);
console.log('[Startup] MONGO_URI set:', !!process.env.MONGO_URI);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from project root (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '/')));

// ─── DATABASE ─────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketmyn')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => res.json({ status: 'MarketMyn API Running', version: '1.0.0' }));
app.get('/admin', (req, res) => res.redirect('/admin-dashboard.html'));

const routes = [
    ['/api/auth',       './routes/authRoutes'],
    ['/api/products',   './routes/productRoutes'],
    ['/api/orders',     './routes/orderRoutes'],
    ['/api/admin',      './routes/adminRoutes'],
    ['/api/payouts',    './routes/payoutRoutes'],
    ['/api/staff',      './routes/staffRoutes'],
    ['/api/seller',     './routes/sellerRoutes'],
    ['/api/upload',     './routes/uploadRoutes'],
    ['/api/returns',    './routes/returnRoutes'],
    ['/api/promotions', './routes/promotionRoutes'],
    ['/api/messages',   './routes/messageRoutes'],
    ['/api/bulk',       './routes/bulkRoutes'],
    ['/api/settings',   './routes/settingsRoutes'],
    ['/api/categories', './routes/categoryRoutes'],
    ['/api/support',    './routes/supportRoutes'],
    ['/api/user',       './routes/userRoutes'],
];

for (const [mountPath, routeFile] of routes) {
    try {
        app.use(mountPath, require(routeFile));
        console.log(`[Route] Loaded: ${mountPath}`);
    } catch (err) {
        console.error(`[Route] FAILED to load ${routeFile}:`, err.message);
    }
}

// ─── CATCH-ALL ────────────────────────────────────────────────────────────────
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

module.exports = app;
