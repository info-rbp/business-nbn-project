const config = require('../config/env');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

let db;
let isPostgres = false;

if (config.DATABASE_URL) {
    console.log('Using PostgreSQL database');
    db = new Pool({
        connectionString: config.DATABASE_URL,
    });
    isPostgres = true;
} else {
    console.log('Using SQLite database at', config.SQLITE_PATH);
    db = new sqlite3.Database(config.SQLITE_PATH);
}

const initializeSchema = () => {
    if (isPostgres) {
        return db.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                stripe_session_id TEXT,
                stripe_customer_id TEXT,
                stripe_subscription_id TEXT,
                business_name TEXT,
                abn TEXT,
                contact_name TEXT,
                email TEXT,
                phone TEXT,
                address TEXT,
                plan_id TEXT,
                status TEXT,
                paid_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } else {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    stripe_session_id TEXT,
                    stripe_customer_id TEXT,
                    stripe_subscription_id TEXT,
                    business_name TEXT,
                    abn TEXT,
                    contact_name TEXT,
                    email TEXT,
                    phone TEXT,
                    address TEXT,
                    plan_id TEXT,
                    status TEXT,
                    paid_at DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }
};

initializeSchema().catch(err => console.error('Database initialization error:', err));

const dbHelpers = {
    async createOrder(orderDetails) {
        if (isPostgres) {
            const query = `
                INSERT INTO orders (business_name, abn, contact_name, email, phone, address, plan_id, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `;
            const values = [
                orderDetails.businessName,
                orderDetails.abn,
                orderDetails.contactName,
                orderDetails.email,
                orderDetails.phone,
                orderDetails.address,
                orderDetails.planId,
                'PENDING'
            ];
            const result = await db.query(query, values);
            return result.rows[0].id;
        } else {
            return new Promise((resolve, reject) => {
                const query = `
                    INSERT INTO orders (business_name, abn, contact_name, email, phone, address, plan_id, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                db.run(query, [
                    orderDetails.businessName,
                    orderDetails.abn,
                    orderDetails.contactName,
                    orderDetails.email,
                    orderDetails.phone,
                    orderDetails.address,
                    orderDetails.planId,
                    'PENDING'
                ], function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
        }
    },

    async updateOrderStripeSession(orderId, sessionId) {
        if (isPostgres) {
            await db.query('UPDATE orders SET stripe_session_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [sessionId, orderId]);
        } else {
            return new Promise((resolve, reject) => {
                db.run('UPDATE orders SET stripe_session_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [sessionId, orderId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
    },

    async updateOrderPaymentStatus(sessionId, { status, customerId, subscriptionId, paidAt }) {
        if (isPostgres) {
            const query = `
                UPDATE orders
                SET status = $1,
                    stripe_customer_id = $2,
                    stripe_subscription_id = $3,
                    paid_at = $4,
                    updated_at = CURRENT_TIMESTAMP
                WHERE stripe_session_id = $5 OR stripe_subscription_id = $3
            `;
            await db.query(query, [status, customerId, subscriptionId, paidAt, sessionId]);
        } else {
            return new Promise((resolve, reject) => {
                const query = `
                    UPDATE orders
                    SET status = ?,
                        stripe_customer_id = ?,
                        stripe_subscription_id = ?,
                        paid_at = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE stripe_session_id = ? OR stripe_subscription_id = ?
                `;
                db.run(query, [status, customerId, subscriptionId, paidAt, sessionId, subscriptionId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
    },

    async getOrderByStripeSession(sessionId) {
        if (isPostgres) {
            const result = await db.query('SELECT * FROM orders WHERE stripe_session_id = $1', [sessionId]);
            return result.rows[0];
        } else {
            return new Promise((resolve, reject) => {
                db.get('SELECT * FROM orders WHERE stripe_session_id = ?', [sessionId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    },

    async getOrderBySubscriptionId(subscriptionId) {
        if (isPostgres) {
            const result = await db.query('SELECT * FROM orders WHERE stripe_subscription_id = $1', [subscriptionId]);
            return result.rows[0];
        } else {
            return new Promise((resolve, reject) => {
                db.get('SELECT * FROM orders WHERE stripe_subscription_id = ?', [subscriptionId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    }
};

module.exports = {
    db,
    isPostgres,
    ...dbHelpers
};
