import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
            username: 'test',
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'alskdflaskjfd',
            password: 'password',
            username: 'test',
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'alskdflaskjfd',
            password: 'p',
            username: 'test',
        })
        .expect(400);
});

it('returns a 400 with an invalid username', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'alskdflaskjfd',
            password: 'password',
            username: '2',
        })
        .expect(400);
});

it('returns a 400 with missing email, password & username', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            username: 'test',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'alskjdf',
            username: 'test',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
            username: 'test',
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});

it('publishes an event', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
            username: 'test',
        })
        .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
