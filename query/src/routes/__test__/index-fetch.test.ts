import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 200 on successful fetch', async () => {
    await request(app)
        .get('/api/query?limit=10&offset=0')
        .set(
            'Cookie',
            global.signin(new mongoose.Types.ObjectId().toHexString())
        )
        .expect(200);
});

it('returns a 401 if the user is not authenticated', async () => {
    await request(app).get('/api/query?limit=10&offset=0').expect(401);
});

it('returns a 400 if the limit or offset is not a number', async () => {
    await request(app)
        .get('/api/query?limit=10&offset=abc')
        .set(
            'Cookie',
            global.signin(new mongoose.Types.ObjectId().toHexString())
        )
        .expect(400);
});
