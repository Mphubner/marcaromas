import request from 'supertest';
import app from '../src/app.js';
import { prisma } from './setup.js';

describe('Content API', () => {
    it('should search for content', async () => {
        const res = await request(app)
            .get('/api/content/search')
            .query({ q: 'test' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('content');
        expect(Array.isArray(res.body.content)).toBe(true);
    });
});
