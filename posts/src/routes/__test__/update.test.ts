import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('updates a post with valid inputs', async () => {
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

    const postId = response.body.id;

    const response2 = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Cookie', cookie)
        .send({
            caption: 'This is a new caption',
        })
        .expect(200);

    expect(response2.body).toHaveProperty('id');
    expect(response2.body).toHaveProperty('imageUrl');
    expect(response2.body).toHaveProperty('caption');
    expect(response2.body).toHaveProperty('userId');
    expect(response2.body).toHaveProperty('username');
    expect(response2.body).toHaveProperty('createdAt');
    expect(response2.body).toHaveProperty('updatedAt');
    expect(response2.body).toHaveProperty('version');
    expect(response2.body.imageUrl).toEqual('https://www.google.com');
    expect(response2.body.caption).toEqual('This is a new caption');
});

it('updates a post without caption', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const response = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            imageUrl: 'https://www.google.com',
        })
        .expect(201);

    const postId = response.body.id;

    const response2 = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Cookie', cookie)
        .send({
            caption: 'This is a new caption',
        })
        .expect(200);

    expect(response2.body).toHaveProperty('id');
    expect(response2.body).toHaveProperty('imageUrl');
    expect(response2.body).toHaveProperty('caption');
    expect(response2.body).toHaveProperty('userId');
    expect(response2.body).toHaveProperty('username');
    expect(response2.body).toHaveProperty('createdAt');
    expect(response2.body).toHaveProperty('updatedAt');
    expect(response2.body).toHaveProperty('version');
    expect(response2.body.imageUrl).toEqual('https://www.google.com');
    expect(response2.body.caption).toEqual('This is a new caption');
});

it('publishes an event', async () => {
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

    const postId = response.body.id;

    await request(app)
        .put(`/api/posts/${postId}`)
        .set('Cookie', cookie)
        .send({
            caption: 'This is a new caption',
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
