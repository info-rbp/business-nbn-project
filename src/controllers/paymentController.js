const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs').promises;
const path = require('path');
const db = require('../services/db');

exports.createCheckoutSession = async (req, res) => {
    try {
        const { planId, businessDetails, address } = req.body;

        if (!planId || !businessDetails || !address) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!businessDetails.email || !businessDetails.businessName || !businessDetails.abn) {
            return res.status(400).json({ error: 'Invalid business details' });
        }

        const plansPath = path.join(__dirname, '../../plans.json');
        const plansData = await fs.readFile(plansPath, 'utf8');
        const plans = JSON.parse(plansData);
        const plan = plans.find(p => p.id === planId);

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        // Save pending order to DB
        const stmt = db.prepare(`INSERT INTO orders
            (business_name, abn, contact_name, email, phone, address, plan_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

        const resDb = await new Promise((resolve, reject) => {
            stmt.run(
                businessDetails.businessName,
                businessDetails.abn,
                businessDetails.contactName,
                businessDetails.email,
                businessDetails.phone,
                address,
                planId,
                'PENDING',
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'aud',
                        product_data: {
                            name: `${plan.name} - ${plan.speed}`,
                            description: `NBN Business Plan for ${businessDetails.businessName} at ${address}`,
                        },
                        unit_amount: (plan.promo_price || plan.price) * 100, // Stripe expects cents
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/signup-review`,
            customer_email: businessDetails.email,
            metadata: {
                orderId: resDb,
                planId,
                businessName: businessDetails.businessName,
                abn: businessDetails.abn,
                address
            }
        });

        // Update with session ID
        db.run('UPDATE orders SET stripe_session_id = ? WHERE id = ?', [session.id, resDb]);

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};
