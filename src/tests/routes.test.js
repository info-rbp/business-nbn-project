const request = require('supertest');
const app = require('../app');

describe('API & Routes Smoke Tests', () => {
    test('GET /health returns 200', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBe(true);
    });

    test('GET /api/plans returns plans', async () => {
        const res = await request(app).get('/api/plans');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /non-existent-route returns 404', async () => {
        const res = await request(app).get('/non-existent-route');
        expect(res.statusCode).toEqual(404);
    });

    test('POST /api/check-address works', async () => {
        const res = await request(app)
            .post('/api/check-address')
            .send({ address: '123 Main St' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('serviceable');
    });
});
