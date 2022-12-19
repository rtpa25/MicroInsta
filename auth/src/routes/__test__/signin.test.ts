import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exists is supplied', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
});

it('fails when incorrect password is supplied', async () => {
    const email = 'test@test.com',
        password = 'password',
        username = 'test';

    await request(app)
        .post('/api/users/signup')
        .send({ email, password, username })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({ email, username, password: 'newpassword' })
        .expect(400);
});
