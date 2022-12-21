import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('creates a new post with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const response = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            imageUrl: 'https://www.google.com',
            caption: 'This is a caption',
        })
        .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('imageUrl');
    expect(response.body).toHaveProperty('caption');
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('version');
    expect(response.body.imageUrl).toEqual('https://www.google.com');
    expect(response.body.caption).toEqual('This is a caption');
});

it('creates a new post without caption', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const response = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            imageUrl: 'https://www.google.com',
        })
        .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('imageUrl');
    expect(response.body).not.toHaveProperty('caption');
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('version');
    expect(response.body.imageUrl).toEqual('https://www.google.com');
});

it('publishes an event', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            imageUrl: 'https://www.google.com',
            caption: 'This is a caption',
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
