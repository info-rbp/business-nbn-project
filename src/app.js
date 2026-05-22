const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const apiRoutes = require('./routes/api');

const app = express();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://js.stripe.com"],
            "script-src-attr": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "https://lh3.googleusercontent.com"],
            "frame-src": ["'self'", "https://js.stripe.com"],
            "connect-src": ["'self'", "https://api.stripe.com"]
        },
    },
}));

// CORS configuration
const corsOptions = {
    origin: config.CORS_ORIGIN,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', generalLimiter);

// Specific limiters for sensitive routes
const addressCheckLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, // 30 address checks per 15 mins
    message: { error: 'Too many address checks from this IP, please try again after 15 minutes' }
});

const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 checkout attempts per 15 mins
    message: { error: 'Too many checkout attempts from this IP, please try again after 15 minutes' }
});

// Apply specific limiters (must be before router)
app.post('/api/check-address', addressCheckLimiter);
app.post('/api/create-checkout-session', checkoutLimiter);

// Middleware
// Webhook route needs raw body for signature verification
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));

app.use(bodyParser.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS for server-side rendering (if needed)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Health Check
app.get('/health', (req, res) => {
    res.json({
        ok: true,
        service: "business-nbn-project",
        timestamp: new Date().toISOString(),
        env: config.NODE_ENV
    });
});

// API Routes
app.use('/api', apiRoutes);

// Page Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});

app.get('/signup-plans', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup-plans.html'));
});

app.get('/signup-business', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup-business.html'));
});

app.get('/signup-review', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup-review.html'));
});

app.get('/plans', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/plans.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});

app.get('/support', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/support.html'));
});

app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/privacy.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/terms.html'));
});

app.get('/critical-information-summary', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/critical-information-summary.html'));
});

app.get('/sla', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sla.html'));
});

app.get('/success', async (req, res) => {
    const sessionId = req.query.session_id;
    if (!sessionId) {
        return res.redirect('/');
    }

    try {
        if (config.STRIPE_SECRET_KEY && config.STRIPE_SECRET_KEY !== 'sk_test_xxx') {
            const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status === 'paid' || session.status === 'complete') {
                return res.send(`
                    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1 style="color: #E5000F;">Order Successful!</h1>
                        <p>Thank you for choosing Velocity Enterprise. Your payment has been confirmed.</p>
                        <p>Our provisioning team will contact you shortly.</p>
                        <a href="/" style="color: #4200B3; font-weight: bold;">Return Home</a>
                    </div>
                `);
            }
        }

        // Fallback for development or if stripe key is not set
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #E5000F;">Order Received!</h1>
                <p>Thank you for choosing Velocity Enterprise. Your order is being processed.</p>
                <p>Payment status: Pending confirmation.</p>
                <a href="/" style="color: #4200B3; font-weight: bold;">Return Home</a>
            </div>
        `);
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.send('<h1>Order Received</h1><p>We are processing your order. Thank you.</p><a href="/">Return Home</a>');
    }
});

// Catch-all for other pages
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

module.exports = app;
