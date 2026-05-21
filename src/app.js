const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS for server-side rendering (if needed)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

app.get('/success', (req, res) => {
    res.send('<h1>Order Successful!</h1><p>Thank you for choosing Velocity Enterprise. Our provisioning team will contact you shortly.</p><a href="/">Return Home</a>');
});

// Catch-all for other pages
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

module.exports = app;
