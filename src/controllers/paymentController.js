const config = require('../config/env');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const fs = require('fs').promises;
const path = require('path');
const db = require('../services/db');
const { validateAbn } = require('../utils/validateAbn');
const nbnService = require('../services/nbnService');

exports.createCheckoutSession = async (req, res) => {
    try {
        const { planId, businessDetails, address } = req.body;

        // Basic presence validation
        if (!planId || !businessDetails || !address) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Detailed business details validation
        if (!businessDetails.email || !businessDetails.businessName || !businessDetails.abn || !businessDetails.phone) {
            return res.status(400).json({ error: 'Missing business details' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(businessDetails.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // ABN Validation
        if (!validateAbn(businessDetails.abn)) {
            return res.status(400).json({ error: 'Invalid Australian Business Number (ABN)' });
        }

        // Re-verify serviceability server-side before checkout
        try {
            const serviceability = await nbnService.checkServiceability(address);
            if (!serviceability.serviceable) {
                return res.status(400).json({
                    error: 'Serviceability check failed',
                    message: serviceability.error || 'NBN is not available at this address.'
                });
            }
        } catch (err) {
            return res.status(400).json({ error: 'Serviceability validation error: ' + err.message });
        }

        const plansPath = path.join(__dirname, '../../plans.json');
        const plansData = await fs.readFile(plansPath, 'utf8');
        const plans = JSON.parse(plansData);
        const plan = plans.find(p => p.id === planId);

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        // Save pending order to DB using helper
        const orderId = await db.createOrder({
            ...businessDetails,
            address,
            planId
        });

        const isProduction = config.NODE_ENV === 'production';

        // Production Safety Check: Require Stripe Price IDs
        if (isProduction && !plan.stripe_price_id) {
            return res.status(500).json({
                error: 'Production configuration error',
                message: 'Stripe Price ID is missing for this plan. Please contact administrator.'
            });
        }

        let sessionConfig = {
            payment_method_types: ['card'],
            mode: 'subscription',
            success_url: `${config.PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.PUBLIC_BASE_URL}/signup-review`,
            customer_email: businessDetails.email,
            metadata: {
                orderId: orderId.toString(),
                planId,
                businessName: businessDetails.businessName,
                abn: businessDetails.abn,
                address,
                promo_duration: plan.promo_duration || 0,
                standard_price: plan.price,
                promo_price: plan.promo_price || 0
            }
        };

        // Pricing Logic
        if (plan.stripe_price_id) {
            // Best Implementation: Use Stripe Price IDs
            // Note: To handle transitions from promo to standard price automatically,
            // Stripe Subscription Schedules or Coupons should be used here.
            // For now, we default to the standard price ID to prevent indefinite promo billing.
            sessionConfig.line_items = [{
                price: plan.stripe_price_id,
                quantity: 1
            }];

            // TODO: If stripe_promo_price_id is to be used, it must be paired with a
            // Subscription Schedule or a limited-time coupon to ensure transition to standard price.
        } else {
            // Development/Fallback: Use inline price_data
            // Safety: If a promo exists, use the standard price for the subscription
            // to avoid billing at the promo rate indefinitely.
            const billingAmount = plan.promo_duration ? plan.price : (plan.promo_price || plan.price);

            sessionConfig.line_items = [{
                price_data: {
                    currency: 'aud',
                    product_data: {
                        name: `Velocity Enterprise: ${plan.name} - ${plan.speed}`,
                        description: `NBN Business Plan for ${businessDetails.businessName}`,
                    },
                    unit_amount: Math.round(billingAmount * 100),
                    recurring: { interval: 'month' },
                },
                quantity: 1,
            }];
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        // Update with session ID using helper
        await db.updateOrderStripeSession(orderId, session.id);

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session: ' + error.message });
    }
};
