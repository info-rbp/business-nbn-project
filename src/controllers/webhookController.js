const config = require('../config/env');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const db = require('../services/db');

exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, config.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`Handling Stripe event: ${event.type}`);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                await db.updateOrderPaymentStatus(session.id, {
                    status: 'PAID',
                    customerId: session.customer,
                    subscriptionId: session.subscription,
                    paidAt: new Date()
                });
                break;
            }
            case 'invoice.paid': {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    await db.updateOrderPaymentStatus(null, {
                        status: 'ACTIVE',
                        customerId: invoice.customer,
                        subscriptionId: invoice.subscription,
                        paidAt: new Date()
                    });
                }
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    await db.updateOrderPaymentStatus(null, {
                        status: 'FAILED',
                        customerId: invoice.customer,
                        subscriptionId: invoice.subscription
                    });
                }
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await db.updateOrderPaymentStatus(null, {
                    status: 'CANCELLED',
                    customerId: subscription.customer,
                    subscriptionId: subscription.id
                });
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error(`Error processing webhook ${event.type}:`, err);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};
