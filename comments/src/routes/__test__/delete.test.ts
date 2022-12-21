import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('deletes a comment with valid inputs', async () => {
    const postId = global.createMongoId();
    const userCookie = global.signin(global.createMongoId());

    await request(app)
        .post('/api/comments')
        .set('Cookie', userCookie)
        .send({ postId, content: 'test' });

    const resp = await request(app)
        .delete('/api/comments')
        .set('Cookie', userCookie)
        .send({ postId })
        .expect(200);

    expect(resp.body.postId).toEqual(postId);
});

it('returns a 401 if the user is not authenticated', async () => {
    const postId = global.createMongoId();

    await request(app).delete('/api/comments').send({ postId }).expect(401);
});

it('returns a 400 if the postId is not provided', async () => {
    await request(app)
        .delete('/api/comments')
        .set('Cookie', global.signin(global.createMongoId()))
        .send({})
        .expect(400);
});

it('publishes an event on successful deletion', async () => {
    const postId = global.createMongoId();

    const userCookie = global.signin(global.createMongoId());

    await request(app)
        .post('/api/comments')
        .set('Cookie', userCookie)
        .send({ postId, content: 'test' });

    await request(app)
        .delete('/api/comments')
        .set('Cookie', userCookie)
        .send({ postId })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
