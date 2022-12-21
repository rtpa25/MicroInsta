import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 401 if the user is not authenticated', async () => {
    const postId = global.createMongoId();

    await request(app).post('/api/comments').send({ postId }).expect(401);
});

it('returns a 400 if the user provides an invalid postId', async () => {
    const userCookie = global.signin(global.createMongoId());

    await request(app)
        .post('/api/comments')
        .set('Cookie', userCookie)
        .send({ postId: 'invalidPostId' })
        .expect(400);
});

it('creates a comment with valid inputs', async () => {
    const postId = global.createMongoId();
    const userCookie = global.signin(global.createMongoId());

    const resp = await request(app)
        .post('/api/comments')
        .set('Cookie', userCookie)
        .send({ postId, content: 'comment content' })
        .expect(201);

    expect(resp.body.postId).toEqual(postId);
    expect(resp.body.content).toEqual('comment content');
});

it('successfully publishes an event', async () => {
    const postId = global.createMongoId();
    const userCookie = global.signin(global.createMongoId());

    await request(app)
        .post('/api/comments')
        .set('Cookie', userCookie)
        .send({ postId, content: 'comment content' })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
