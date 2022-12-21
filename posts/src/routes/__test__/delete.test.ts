import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('deletes post on valid request', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const postResponse = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            imageUrl: 'https://www.google.com',
            caption: 'This is a caption',
        })
        .expect(201);

    const postId = postResponse.body.id;

    const deleteResponse = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Cookie', cookie)
        .send()
        .expect(204);

    expect(deleteResponse.body).toEqual({}); //even though the response is empty, which is not what we are sending via the route handler but it is a valid response as jest converts it to an empty object whenever the request type is delete
});

it('returns 404 if post is not found', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const postId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Cookie', cookie)
        .send()
        .expect(404);
});

it('returns 401 if user is not authenticated', async () => {
    const postId = new mongoose.Types.ObjectId().toHexString();

    await request(app).delete(`/api/posts/${postId}`).send().expect(401);
});

it('returns 401 if user does not own the post', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const postResponse = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            imageUrl: 'https://www.google.com',
            caption: 'This is a caption',
        })
        .expect(201);

    const postId = postResponse.body.id;

    await request(app)
        .delete(`/api/posts/${postId}`)
        .set(
            'Cookie',
            global.signin(new mongoose.Types.ObjectId().toHexString())
        )
        .send()
        .expect(401);
});

it('publishes an event on successful post deletion', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin(userId);

    const postResponse = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            imageUrl: 'https://www.google.com',
            caption: 'This is a caption',
        })
        .expect(201);

    const postId = postResponse.body.id;

    await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Cookie', cookie)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
