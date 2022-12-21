import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('creates a like with valid inputs', async () => {
    const postId = global.createMongoId();

    const resp = await request(app)
        .post('/api/likes')
        .set('Cookie', global.signin(global.createMongoId()))
        .send({ postId })
        .expect(201);

    expect(resp.body.postId).toEqual(postId);
});

it('returns a 401 if the user is not authenticated', async () => {
    const postId = global.createMongoId();

    await request(app).post('/api/likes').send({ postId }).expect(401);
});

it('returns a 400 if the postId is not provided', async () => {
    await request(app)
        .post('/api/likes')
        .set('Cookie', global.signin(global.createMongoId()))
        .send({})
        .expect(400);
});

it('publishes an event on successful creation', async () => {
    const postId = global.createMongoId();

    await request(app)
        .post('/api/likes')
        .set('Cookie', global.signin(global.createMongoId()))
        .send({ postId })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
