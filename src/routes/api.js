const express = require('express');
const router = express.Router();
const nbnController = require('../controllers/nbnController');
const paymentController = require('../controllers/paymentController');
const fs = require('fs').promises;
const path = require('path');

// NBN Serviceability
router.post('/check-address', nbnController.checkAddress);

// Payments
router.post('/create-checkout-session', paymentController.createCheckoutSession);

// Plans
router.get('/plans', async (req, res) => {
    try {
        const plansPath = path.join(__dirname, '../../plans.json');
        const plansData = await fs.readFile(plansPath, 'utf8');
        res.json(JSON.parse(plansData));
    } catch (error) {
        res.status(500).json({ error: 'Failed to load plans' });
    }
});

module.exports = router;
