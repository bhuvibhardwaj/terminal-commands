const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 8001;

// --- Security Middleware ---

// 1. Helmet: Sets various HTTP headers for security (XSS, Clickjacking, etc.)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://d3js.org"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
        },
    },
}));

// 2. CORS: Restrict cross-origin requests
app.use(cors({
    origin: 'http://localhost:' + PORT,
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
}));

// 3. Rate Limiting: Prevent Brute-force and DoS attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// --- Serving Static Files ---

// Serve the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// --- Server Startup ---

app.listen(PORT, () => {
    console.log(`
    =========================================
    🔒 Secure Terminal Ecosystem Backend
    =========================================
    Server running on: http://localhost:${PORT}
    Security Features Active:
    - Content Security Policy (CSP)
    - XSS Protection
    - Clickjacking Protection
    - Rate Limiting (100 req/15min)
    - CORS Restricted
    =========================================
    `);
});
